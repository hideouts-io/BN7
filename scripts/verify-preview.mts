import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { chromium, type Browser, type Page } from 'playwright';

type ViewportCheck = Readonly<{ name: string; width: number; height: number }>;
type ColorPair = Readonly<{ element: string; foreground: string; background: string }>;
type ContrastCheck = Readonly<ColorPair & { ratio: number }>;
type FocusStyle = Readonly<{ style: string; width: number; color: string; background: string }>;
type Palette = Readonly<{ pairs: readonly ColorPair[]; focus: FocusStyle; excludedBrandText: number }>;
type ReadingCheck = Readonly<{
  viewport: string; horizontalOverflow: number; overflowingText: readonly string[];
  rootClipping: readonly string[]; brokenFragments: readonly string[]; remoteResources: readonly string[];
}>;
type BrowserFailure = Readonly<{ kind: string; message: string }>;

/** Hash exact served or downloaded artifact bytes. */
function sha256(bytes: Buffer): string { return createHash('sha256').update(bytes).digest('hex'); }

/** Convert an opaque composited RGB value to relative luminance. */
function luminance(color: string): number {
  const channels: RegExpMatchArray | null = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if (!channels) throw new Error(`Expected composited opaque RGB; received ${color}`);
  const linear: readonly number[] = channels.slice(1).map(channel => {
    const value: number = Number(channel) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

/** Compare composited colors without treating a translucent surface as opaque. */
function contrast(pair: ColorPair): ContrastCheck {
  const foreground: number = luminance(pair.foreground);
  const background: number = luminance(pair.background);
  return { ...pair, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
}

/** Bound ordinary text against every declared gradient-stop/alpha combination. */
async function measurePalette(page: Page): Promise<Palette> {
  return page.evaluate((): Palette => {
    type Rgba = readonly [number, number, number, number];
    function rgba(value: string): Rgba {
      const match: RegExpMatchArray | null = value.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
      if (!match) throw new Error(`Unsupported computed color ${value}; measure its color space explicitly.`);
      return [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])];
    }
    function composite(top: Rgba, bottom: Rgba): Rgba {
      const alpha: number = top[3] + bottom[3] * (1 - top[3]);
      if (alpha === 0) return [0, 0, 0, 0];
      const channel = (index: number): number => (top[index] * top[3] + bottom[index] * bottom[3] * (1 - top[3])) / alpha;
      return [channel(0), channel(1), channel(2), alpha];
    }
    function rgb(value: Rgba): string {
      if (Math.abs(value[3] - 1) > 0.000001) throw new Error('Palette did not resolve to an opaque browser canvas.');
      return `rgb(${Math.round(value[0])}, ${Math.round(value[1])}, ${Math.round(value[2])})`;
    }
    function layers(value: string): readonly string[] {
      let depth: number = 0;
      let start: number = 0;
      const parts: string[] = [];
      for (let index: number = 0; index < value.length; index += 1) {
        if (value[index] === '(') depth += 1;
        if (value[index] === ')') depth -= 1;
        if (value[index] === ',' && depth === 0) { parts.push(value.slice(start, index).trim()); start = index + 1; }
      }
      if (depth !== 0) throw new Error(`Unbalanced computed gradient ${value}`);
      return [...parts, value.slice(start).trim()];
    }
    function stops(image: string): readonly Rgba[] {
      if (image === 'none') return [[0, 0, 0, 0]];
      if (!/^(linear|radial)-gradient\(/.test(image)) throw new Error(`Unsupported background ${image}; inspect it explicitly.`);
      const colors: readonly string[] = Array.from(image.matchAll(/rgba?\([^)]*\)/g), match => match[0]);
      if (colors.length < 2) throw new Error(`Missing computed gradient stops in ${image}`);
      return colors.map(rgba);
    }
    function backgrounds(element: Element): readonly Rgba[] {
      const ancestors: Element[] = [];
      for (let surface: Element | null = element; surface; surface = surface.parentElement) ancestors.push(surface);
      return ancestors.reverse().reduce((under: readonly Rgba[], surface: Element): readonly Rgba[] => {
        const style: CSSStyleDeclaration = getComputedStyle(surface);
        if (style.opacity !== '1') throw new Error(`Text ancestor ${surface.tagName} requires explicit opacity-group measurement.`);
        const color: Rgba = rgba(style.backgroundColor);
        const base: readonly Rgba[] = color[3] === 1 ? [color] : under.map(bottom => composite(color, bottom));
        if (style.backgroundImage === 'none') return base;
        return layers(style.backgroundImage).reverse().reduce((below: readonly Rgba[], image: string): readonly Rgba[] =>
          stops(image).flatMap(top => below.map(bottom => composite(top, bottom))), base);
      }, [[255, 255, 255, 1]] as readonly Rgba[]);
    }
    const visible: readonly Element[] = Array.from(document.querySelectorAll('*')).filter(element =>
      element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && !element.closest('[aria-hidden="true"]')
      && Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()));
    const excluded: readonly Element[] = visible.filter(element => element.closest('.gradient-text,.center-node,.mark')
      || getComputedStyle(element).backgroundClip === 'text');
    const pairs: readonly ColorPair[] = visible.filter(element => !excluded.includes(element)).flatMap(element => {
      const ink: Rgba = rgba(getComputedStyle(element).getPropertyValue('-webkit-text-fill-color'));
      return backgrounds(element).map(background => ({ element: `${element.tagName.toLowerCase()}#${element.id}.${element.className}`,
        foreground: rgb(composite(ink, background)), background: rgb(background) }));
    });
    const skip: HTMLElement | null = document.getElementById('skip-link');
    if (!skip) throw new Error('Missing #skip-link when measuring focus.');
    const style: CSSStyleDeclaration = getComputedStyle(skip);
    const surfaces: readonly Rgba[] = backgrounds(skip);
    if (surfaces.length !== 1) throw new Error('The skip-link focus surface must be a single opaque color.');
    return { pairs, excludedBrandText: excluded.length, focus: { style: style.outlineStyle,
      width: Number.parseFloat(style.outlineWidth), color: rgb(composite(rgba(style.outlineColor), surfaces[0])), background: rgb(surfaces[0]) } };
  });
}

/** Reject visible text overflow and root clipping that could conceal layout failures. */
async function checkReading(page: Page, viewport: ViewportCheck): Promise<ReadingCheck> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const result: ReadingCheck = await page.evaluate((name: string): ReadingCheck => {
    const elements: readonly Element[] = Array.from(document.querySelectorAll('a,p,h1,h2,h3,li,th,td,small,strong,b,.center-word'));
    return { viewport: name, horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      overflowingText: elements.filter(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        && !element.closest('[aria-hidden="true"]')).flatMap(element => {
        const range: Range = document.createRange(); range.selectNodeContents(element);
        return Array.from(range.getClientRects()).some(rect => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1))
          ? [`${element.tagName.toLowerCase()}#${element.id}: ${element.textContent?.trim().slice(0, 80)}`] : [];
      }),
      rootClipping: [document.documentElement, document.body].filter(element => ['hidden', 'clip'].includes(getComputedStyle(element).overflowX))
        .map(element => `${element.tagName.toLowerCase()}: ${getComputedStyle(element).overflowX}`),
      brokenFragments: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
        .filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1)))).map(link => link.hash),
      remoteResources: performance.getEntriesByType('resource').map(entry => entry.name)
        .filter(url => /^https?:/.test(url) && new URL(url).origin !== location.origin),
    };
  }, viewport.name);
  assert.ok(result.horizontalOverflow <= 0, `${viewport.name}: horizontal overflow ${result.horizontalOverflow}px`);
  assert.deepEqual(result.overflowingText, [], `${viewport.name}: visible text extends beyond viewport`);
  assert.deepEqual(result.rootClipping, [], `${viewport.name}: root overflow clipping could conceal failures`);
  assert.deepEqual(result.brokenFragments, [], `${viewport.name}: missing fragment targets`);
  assert.deepEqual(result.remoteResources, [], `${viewport.name}: unexpected remote runtime resources`);
  return result;
}

/** Verify HTTP identity, keyboard navigation, source links, and a native PDF download. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  const readingArgument: string | undefined = process.argv[3];
  if (process.argv.length !== 4 || !executablePath || !isAbsolute(executablePath) || !readingArgument)
    throw new Error('Pass absolute browser path and local HTTP URL: npm run verify -- /absolute/browser/path http://127.0.0.1:4173/');
  const readingUrl: URL = new URL(readingArgument);
  if (readingUrl.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(readingUrl.hostname))
    throw new Error(`Expected local HTTP reading URL; received ${readingUrl.href}`);
  await access(executablePath);
  const outputDirectory: URL = new URL('../output/verification/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const [expectedHtml, expectedPdf, manuscript]: [Buffer, Buffer, string] = await Promise.all([
    readFile(new URL('../output/web/index.html', import.meta.url)),
    readFile(new URL('../output/pdf/Bridge-Node-7-Public-Playbook-Short.pdf', import.meta.url)),
    readFile(new URL('../PUBLIC_PLAYBOOK.md', import.meta.url), 'utf8'),
  ]);
  const sourceUrls: string[] = [];
  marked.walkTokens(marked.lexer(manuscript), token => { if (token.type === 'link') sourceUrls.push(token.href); });
  const expectedLinks: readonly string[] = [...new Set(sourceUrls)];
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const failures: BrowserFailure[] = [];
    const page: Page = await browser.newPage({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
    page.on('pageerror', error => failures.push({ kind: 'pageerror', message: error.message }));
    page.on('console', message => { if (message.type() === 'error') failures.push({ kind: 'console', message: message.text() }); });
    page.on('requestfailed', request => failures.push({ kind: 'network', message: `${request.url()}: ${request.failure()?.errorText}` }));
    page.on('response', response => { if (response.status() >= 400) failures.push({ kind: 'http', message: `${response.status()} ${response.url()}` }); });
    const response = await page.goto(readingUrl.href, { waitUntil: 'load' });
    if (!response) throw new Error(`No HTTP response for ${readingUrl.href}`);
    assert.equal(response.status(), 200, `Reading URL failed: ${readingUrl.href}`);
    assert.equal(sha256(await response.body()), sha256(expectedHtml), 'Served HTML differs from the current generated file.');
    await page.evaluate(async (): Promise<void> => { await document.fonts.ready; });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#skip-link').evaluate(element => element === document.activeElement), true, 'First keyboard stop must be #skip-link.');
    const palette: Palette = await measurePalette(page);
    assert.equal(palette.focus.style, 'solid', 'Keyboard focus must have a solid outline.');
    assert.ok(palette.focus.width >= 3, 'Keyboard focus outline must be at least 3 CSS pixels.');
    const focusContrast: ContrastCheck = contrast({ element: '#skip-link focus', foreground: palette.focus.color, background: palette.focus.background });
    assert.ok(focusContrast.ratio >= 3, `Focus contrast ${focusContrast.ratio.toFixed(2)}:1 is below 3:1.`);
    const distinct: readonly ColorPair[] = palette.pairs.filter((pair, index, pairs) =>
      pairs.findIndex(candidate => candidate.foreground === pair.foreground && candidate.background === pair.background) === index);
    const textContrast: readonly ContrastCheck[] = distinct.map(contrast);
    const failedContrast: readonly ContrastCheck[] = textContrast.filter(check => check.ratio < 4.5);
    await writeFile(new URL('contrast-checks.json', outputDirectory), JSON.stringify({
      checks: textContrast, failures: failedContrast, excludedBrandText: palette.excludedBrandText,
    }, null, 2) + '\n', 'utf8');
    assert.deepEqual(failedContrast, [], 'Text contrast below 4.5:1; every failing measured pair is recorded in output/verification/contrast-checks.json.');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#playbook').evaluate(element => element === document.activeElement), true, 'Skip link must focus #playbook.');
    await page.locator('#header-contents').click();
    await page.waitForFunction(() => location.hash === '#contents');
    await page.locator('#contents a[href="#when-an-assumption-changes"]').click();
    await page.waitForFunction(() => location.hash === '#when-an-assumption-changes');
    const preservedLinks = await page.locator('#playbook a').evaluateAll((links, expected: readonly string[]) => expected.map(href => ({ href,
      visible: links.some(link => link.getAttribute('href') === href && link.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && Boolean(link.textContent?.trim())),
    })), expectedLinks);
    assert.deepEqual(preservedLinks.filter(link => !link.visible), [], 'Manuscript links must remain visible and preserve their destinations.');
    const tableStructure = await page.locator('#playbook table').evaluateAll(tables => tables.map(table => ({
      rows: table.querySelectorAll('tbody tr').length, columns: table.querySelectorAll('thead th').length, headers: table.querySelectorAll('thead tr').length,
    })));
    for (const table of tableStructure) { assert.ok(table.rows > 0); assert.equal(table.columns, 2); assert.equal(table.headers, 1); }
    assert.equal(await page.locator('#download-pdf').getAttribute('href'), 'Bridge-Node-7-Public-Playbook-Short.pdf', 'PDF link must use the sibling exported file.');
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#download-pdf').click()]);
    const failure: string | null = await download.failure();
    if (failure) throw new Error(`Native PDF download failed: ${download.url()}: ${failure}`);
    const downloadPath: string | null = await download.path();
    if (!downloadPath) throw new Error(`Native PDF download returned no artifact: ${download.url()}`);
    const downloadedPdf: Buffer = await readFile(downloadPath);
    assert.ok(downloadedPdf.equals(expectedPdf), 'Browser-downloaded PDF differs from the exported PDF bytes.');
    const checks: ReadingCheck[] = [];
    const viewports: readonly ViewportCheck[] = [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 375, height: 812 }, { name: 'reflow', width: 320, height: 900 }];
    for (const viewport of viewports) {
      checks.push(await checkReading(page, viewport));
      await page.locator('#playbook').evaluate(element => element.blur());
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: fileURLToPath(new URL(`${viewport.name}.png`, outputDirectory)), fullPage: true });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto', 'Reduced motion must disable smooth scrolling.');
    assert.deepEqual(failures, [], 'Browser page, console, HTTP and network errors must be resolved.');
    const report: string = JSON.stringify({ input: readingUrl.href, checkedAt: new Date().toISOString(), browserVersion: browser.version(),
      htmlSha256: sha256(expectedHtml), keyboardSkip: 'passed', navigation: 'passed', reducedMotion: 'passed', checks, preservedLinks,
      pdfDownload: { url: download.url(), filename: download.suggestedFilename(), bytes: downloadedPdf.length, sha256: sha256(downloadedPdf), matchesExportedPdf: true },
      textContrast, contrastMethod: 'Conservative gradient-stop and alpha composition through ancestor surfaces; ordinary opaque text and button endpoints retain 4.5:1, skip focus retains 3:1. Gradient-clipped brand headings and center-node brand labels are excluded from numeric palette checks; decorative pseudo-elements/backdrop filters and actual assistive-technology usability remain unverified.',
      excludedBrandText: palette.excludedBrandText, focusOutline: { ...palette.focus, ratio: focusContrast.ratio }, tableStructure, browserErrors: failures,
      scope: 'Local HTTP Chromium integration checks; no accessibility conformance claim; named human and assistive-technology reviews remain open.' }, null, 2) + '\n';
    await writeFile(new URL('browser-checks.json', outputDirectory), report, 'utf8');
    process.stdout.write(JSON.stringify({ report: fileURLToPath(new URL('browser-checks.json', outputDirectory)), checks, sourceLinks: preservedLinks.length,
      pdfSha256: sha256(downloadedPdf), minimumTextContrast: Math.min(...textContrast.map(check => check.ratio)), focusContrast: focusContrast.ratio,
      excludedBrandText: palette.excludedBrandText, browserErrors: failures }) + '\n');
  } finally { await browser.close(); }
}

await main();
