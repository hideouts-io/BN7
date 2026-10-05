import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { chromium, type APIResponse, type Browser, type Page } from 'playwright';

type Viewport = Readonly<{ name: string; width: number; height: number }>;
type ReadingCheck = Readonly<{
  viewport: string; width: number; documentWidth: number; chapters: number;
  brokenFragments: readonly string[]; tables: number; unlabelledLinks: number;
  reviewLinkVisible: boolean;
  headingStarts: readonly Readonly<{ id: string; top: number; headerBottom: number }>[];
}>;
type Failure = Readonly<{ kind: string; message: string }>;

/** Bind responses and browser downloads to exact prepared bytes. */
function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Observe reflow, semantics, keyboard entry and every chapter destination. */
async function checkReading(page: Page, readingUrl: string, viewport: Viewport): Promise<ReadingCheck> {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(readingUrl, { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#skip-link').evaluate(element => element === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#playbook').evaluate(element => element === document.activeElement), true);
  const entryTop: number = await page.locator('#playbook').evaluate(element => element.getBoundingClientRect().top);
  const headerBottom: number = await page.locator('#site-header').evaluate(element => element.getBoundingClientRect().bottom);
  assert.ok(entryTop >= headerBottom && entryTop < viewport.height, `${viewport.name}: reading entry is obscured or offscreen.`);
  const basics = await page.evaluate(() => ({
    width: innerWidth, documentWidth: document.documentElement.scrollWidth,
    chapters: document.querySelectorAll('#playbook > .reading-section').length,
    brokenFragments: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
      .filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1)))).map(link => link.hash),
    tables: document.querySelectorAll('#playbook table').length,
    unlabelledLinks: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .filter(link => !(link.getAttribute('aria-label') || link.textContent || '').trim()).length,
  }));
  assert.ok(basics.documentWidth <= basics.width, `${viewport.name}: horizontal document overflow.`);
  assert.equal(basics.chapters, 10);
  assert.deepEqual(basics.brokenFragments, []);
  assert.equal(basics.unlabelledLinks, 0);
  for (const table of await page.locator('#playbook table').all())
    assert.ok(await table.locator('thead th').count() > 0, `${viewport.name}: table is missing header cells.`);
  const ids: readonly string[] = await page.locator('#contents ol a').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).hash.slice(1)));
  const headingStarts: { id: string; top: number; headerBottom: number }[] = [];
  for (const id of ids) {
    await page.locator(`#contents a[href="#${id}"]`).click();
    const position = await page.locator(`[id="${id}"]`).evaluate(element => ({ top: element.getBoundingClientRect().top,
      headerBottom: document.getElementById('site-header')!.getBoundingClientRect().bottom }));
    assert.ok(position.top >= position.headerBottom - 1 && position.top < viewport.height, `${viewport.name}: chapter #${id} is obscured or offscreen.`);
    headingStarts.push({ id, ...position });
  }
  await page.locator('#contents ol a').first().focus();
  for (let index: number = 0; index < 10; index += 1) await page.keyboard.press('Tab');
  assert.equal(await page.locator('#review-questions').evaluate(element => element === document.activeElement), true);
  const reviewLinkVisible: boolean = await page.locator('#review-questions').evaluate(element => {
    const box: DOMRect = element.getBoundingClientRect();
    const header: HTMLElement | null = document.getElementById('site-header');
    if (!header) throw new Error('Sticky header is missing while checking review-link focus.');
    return box.top >= header.getBoundingClientRect().bottom && box.bottom <= innerHeight;
  });
  assert.ok(reviewLinkVisible, `${viewport.name}: focused review-questions link is obscured or offscreen.`);
  await page.goto(readingUrl, { waitUntil: 'load' });
  await page.reload({ waitUntil: 'load' });
  await page.locator('#read-playbook').click();
  assert.equal(new URL(page.url()).hash, '#playbook');
  return { viewport: viewport.name, ...basics, headingStarts, reviewLinkVisible };
}

/** Verify one served expanded candidate in the installed browser, recording scoped evidence. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  const candidateRoot: string | undefined = process.argv[3];
  const readingUrl: string | undefined = process.argv[4];
  const evidenceRoot: string | undefined = process.argv[5];
  if (process.argv.length !== 6 || !executablePath || !candidateRoot || !readingUrl || !evidenceRoot
    || !isAbsolute(executablePath) || !isAbsolute(candidateRoot) || !isAbsolute(evidenceRoot)
    || !/^https?:\/\//.test(readingUrl))
    throw new Error('Pass absolute browser/candidate paths, HTTP reading URL, and unused absolute evidence directory.');
  const [html, pdf, manifest]: [Buffer, Buffer, Buffer] = await Promise.all([
    readFile(join(candidateRoot, 'index.html')), readFile(join(candidateRoot, 'Bridge-Node-7-Public-Playbook-Expanded.pdf')),
    readFile(join(candidateRoot, 'manifest.json')),
  ]);
  await mkdir(evidenceRoot, { recursive: false });
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page: Page = await browser.newPage({ acceptDownloads: true });
    const failures: Failure[] = [];
    page.on('pageerror', error => failures.push({ kind: 'pageerror', message: error.message }));
    page.on('console', message => { if (message.type() === 'error') failures.push({ kind: 'console', message: message.text() }); });
    page.on('requestfailed', request => failures.push({ kind: 'network', message: `${request.url()}: ${request.failure()?.errorText}` }));
    page.on('response', response => { if (response.status() >= 400) failures.push({ kind: 'http', message: `${response.status()}: ${response.url()}` }); });
    for (const artifact of [{ name: 'index.html', bytes: html }, { name: 'Bridge-Node-7-Public-Playbook-Expanded.pdf', bytes: pdf }, { name: 'manifest.json', bytes: manifest }]) {
      const response: APIResponse = await page.request.get(new URL(artifact.name, readingUrl).href);
      assert.equal(response.status(), 200, `Failed artifact response for ${artifact.name}`);
      assert.ok((await response.body()).equals(artifact.bytes), `Served ${artifact.name} differs from selected candidate.`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const checks: ReadingCheck[] = [];
    const viewports: readonly Viewport[] = [{ name: 'desktop', width: 1280, height: 900 },
      { name: 'compact-desktop', width: 1280, height: 600 },
      { name: 'mobile', width: 375, height: 812 }, { name: 'reflow', width: 320, height: 900 }];
    for (const viewport of viewports) {
      checks.push(await checkReading(page, readingUrl, viewport));
      await page.screenshot({ path: join(evidenceRoot, `${viewport.name}-reading.png`) });
      await page.goto(readingUrl, { waitUntil: 'load' });
      await page.screenshot({ path: join(evidenceRoot, `${viewport.name}-hero.png`) });
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
      assert.equal(await page.locator('.center-node').evaluate(element => getComputedStyle(element).animationName), 'none');
    }
    const article = await page.locator('#playbook').evaluate(element => ({ text: element.textContent,
      links: Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href]')).map(link => link.href) }));
    await writeFile(join(evidenceRoot, 'article-content.json'), JSON.stringify(article, null, 2) + '\n', 'utf8');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(readingUrl, { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'smooth');
    assert.equal(await page.locator('.center-node').evaluate(element => getComputedStyle(element).animationName), 'centerEnergy');
    await page.locator('#read-playbook').click();
    await page.waitForFunction(() => {
      const target: HTMLElement | null = document.getElementById('playbook');
      const header: HTMLElement | null = document.getElementById('site-header');
      if (!target || !header) throw new Error('Reading entry or sticky header is missing.');
      const top: number = target.getBoundingClientRect().top;
      return top >= header.getBoundingClientRect().bottom && top < 120;
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(readingUrl, { waitUntil: 'load' });
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#download-pdf').click()]);
    assert.equal(download.suggestedFilename(), 'Bridge-Node-7-Public-Playbook-Expanded.pdf');
    const downloadPath: string = join(evidenceRoot, download.suggestedFilename());
    await download.saveAs(downloadPath);
    assert.ok((await readFile(downloadPath)).equals(pdf), 'Downloaded PDF differs from candidate.');
    const urls: readonly string[] = await page.locator('#playbook a[href^="https://"]').evaluateAll(links =>
      Array.from(new Set(links.map(link => (link as HTMLAnchorElement).href))));
    assert.deepEqual(failures, [], 'Unresolved browser errors.');
    const report: string = JSON.stringify({ checkedAt: new Date().toISOString(), readingUrl,
      browserVersion: browser.version(), htmlSha256: sha256(html), pdfSha256: sha256(pdf),
      manifestSha256: sha256(manifest), checks, sourceUrls: urls, nativePdfDownload: 'exact-byte match',
      keyboard: 'skip focus and chapter entry passed', reducedMotion: 'scroll and orbital animation disabled',
      ordinaryMotion: 'smooth reading entry and orbital animation passed',
      browserErrors: failures, scope: 'Local real Chromium reading/download checks and reference inventory. Source-path and remote-access evidence are separate audits; qualified human and assistive-technology review remain pending.' }, null, 2) + '\n';
    await writeFile(join(evidenceRoot, 'browser-checks.json'), report, 'utf8');
    process.stdout.write(JSON.stringify({ evidenceRoot, checks: checks.length, sourceUrls: urls.length, browserErrors: failures }) + '\n');
  } finally { await browser.close(); }
}

await main();
