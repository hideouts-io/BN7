import { strict as assert } from 'node:assert';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type Page } from 'playwright';

type ViewportCheck = Readonly<{ name: string; width: number; height: number }>;
type ReadingCheck = Readonly<{
  viewport: string;
  horizontalOverflow: number;
  brokenFragments: readonly string[];
  remoteResources: readonly string[];
}>;
type ColorPair = Readonly<{ foreground: string; background: string }>;
type ContrastCheck = Readonly<ColorPair & { ratio: number }>;

/** Convert an opaque browser RGB value to relative luminance. */
function luminance(color: string): number {
  const channels: RegExpMatchArray | null = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if (!channels) throw new Error(`Expected an opaque computed RGB color; received ${color}`);
  const linear: readonly number[] = channels.slice(1).map(channel => {
    const normalized: number = Number(channel) / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

/** Calculate the contrast of two opaque colors without altering the input. */
function contrast(pair: ColorPair): ContrastCheck {
  const foreground: number = luminance(pair.foreground);
  const background: number = luminance(pair.background);
  return { ...pair, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
}

/** Check the rendered text palette, including inherited surface backgrounds. */
async function checkContrast(page: Page): Promise<readonly ContrastCheck[]> {
  const pairs: readonly ColorPair[] = await page.evaluate((): readonly ColorPair[] => {
    const elements: readonly Element[] = Array.from(document.querySelectorAll('p,h1,h2,a,li,th,td,.site-header span,footer'));
    return elements.map(element => {
      let surface: Element | null = element;
      while (surface && getComputedStyle(surface).backgroundColor === 'rgba(0, 0, 0, 0)') surface = surface.parentElement;
      if (!surface) throw new Error(`No explicit opaque surface found for ${element.tagName}`);
      return { foreground: getComputedStyle(element).color, background: getComputedStyle(surface).backgroundColor };
    });
  });
  const distinct: readonly ColorPair[] = pairs.filter((pair, index) =>
    pairs.findIndex(candidate => candidate.foreground === pair.foreground && candidate.background === pair.background) === index);
  const checks: readonly ContrastCheck[] = distinct.map(contrast);
  for (const check of checks)
    assert.ok(check.ratio >= 4.5, `Text contrast is ${check.ratio.toFixed(2)}:1 for ${check.foreground} on ${check.background}`);
  return checks;
}

/** Inspect reading behavior in an explicitly sized, real browser viewport. */
async function checkReading(page: Page, viewport: ViewportCheck): Promise<ReadingCheck> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const result: ReadingCheck = await page.evaluate((name: string): ReadingCheck => ({
    viewport: name,
    horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    brokenFragments: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
      .filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1))))
      .map(link => link.hash),
    remoteResources: performance.getEntriesByType('resource').map(entry => entry.name)
      .filter(name => name.startsWith('https:') || name.startsWith('http:')),
  }), viewport.name);
  assert.ok(result.horizontalOverflow <= 0, `${viewport.name}: horizontal overflow is ${result.horizontalOverflow}px`);
  assert.deepEqual(result.brokenFragments, [], `${viewport.name}: missing fragment targets`);
  assert.deepEqual(result.remoteResources, [], `${viewport.name}: unexpected remote runtime resources`);
  return result;
}

/** Verify keyboard entry and reading layout, then save the actual browser evidence. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  if (!executablePath || !executablePath.startsWith('/'))
    throw new Error('Pass the absolute path to an installed Chromium browser: npm run verify -- /absolute/browser/path');
  await access(executablePath);
  const inputUrl: URL = new URL('../output/web/index.html', import.meta.url);
  await access(inputUrl);
  const outputDirectory: URL = new URL('../output/verification/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page: Page = await browser.newPage();
    await page.goto(inputUrl.href, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#skip-link').evaluate(element => element === document.activeElement), true,
      'The first keyboard stop must be the visible skip link.');
    const focusStyle: Readonly<{ style: string; width: number; color: string; background: string }> =
      await page.locator('#skip-link').evaluate(element => {
        const style: CSSStyleDeclaration = getComputedStyle(element);
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth),
          color: style.outlineColor, background: style.backgroundColor };
      });
    assert.equal(focusStyle.style, 'solid', 'Keyboard focus must have a visible solid outline.');
    assert.ok(focusStyle.width >= 3, 'Keyboard focus outline must remain at least 3 CSS pixels wide.');
    const focusContrast: ContrastCheck = contrast({ foreground: focusStyle.color, background: focusStyle.background });
    assert.ok(focusContrast.ratio >= 3, 'Focus outline must contrast against its white surface.');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#playbook').evaluate(element => element === document.activeElement), true,
      'Activating the skip link must focus the playbook.');
    const textContrast: readonly ContrastCheck[] = await checkContrast(page);
    const tableStructure: readonly Readonly<{ rows: number; columns: number; headers: number }>[] =
      await page.locator('#playbook table').evaluateAll(tables => tables.map(table => ({
        rows: table.querySelectorAll('tbody tr').length,
        columns: table.querySelectorAll('thead th').length,
        headers: table.querySelectorAll('thead tr').length,
      })));
    for (const table of tableStructure) {
      assert.ok(table.rows > 0, 'A reading table must have data rows.');
      assert.equal(table.columns, 2, 'The reading tables must retain both explanatory columns.');
      assert.equal(table.headers, 1, 'The reading tables must expose one column-header row.');
    }
    const viewports: readonly ViewportCheck[] = [
      { name: 'desktop', width: 1280, height: 900 },
      { name: 'mobile', width: 375, height: 812 },
      { name: 'reflow', width: 320, height: 900 },
    ];
    const checks: ReadingCheck[] = [];
    for (const viewport of viewports) {
      checks.push(await checkReading(page, viewport));
      await page.locator('#playbook').evaluate(element => element.blur());
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: fileURLToPath(new URL(`${viewport.name}.png`, outputDirectory)), fullPage: false });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto',
      'Reduced-motion preference must disable smooth scrolling.');
    const report: string = JSON.stringify({
      input: fileURLToPath(inputUrl), keyboardSkip: 'passed', reducedMotion: 'passed', checks,
      textContrast, focusOutline: { ...focusStyle, ratio: focusContrast.ratio }, tableStructure,
      scope: 'Local Chromium integration checks; named human and assistive-technology reviews remain open.',
    }, null, 2) + '\n';
    await writeFile(new URL('browser-checks.json', outputDirectory), report, 'utf8');
    process.stdout.write(report);
  } finally {
    await browser.close();
  }
}

await main();
