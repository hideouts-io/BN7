import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type Page } from 'playwright';

type WebSource = Readonly<{
  source: string;
  sha256: string;
  html: string;
  html_sha256: string;
  stylesheet: string;
  stylesheet_sha256: string;
  sections: number;
  generator: string;
}>;
type PdfResult = Readonly<{ bytes: Buffer; browserVersion: string }>;

/** Hash exact source or artifact bytes. */
function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Reject missing or malformed build provenance rather than inferring its identity. */
async function readWebSource(url: URL): Promise<WebSource> {
  const record: WebSource = JSON.parse(await readFile(url, 'utf8'));
  if (!record || typeof record !== 'object' || record.source !== 'PUBLIC_PLAYBOOK.md'
    || record.html !== 'index.html' || record.generator !== 'scripts/build-playbook.mts'
    || typeof record.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(record.sha256)
    || typeof record.html_sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(record.html_sha256)
    || record.stylesheet !== 'assets/playbook.css'
    || typeof record.stylesheet_sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(record.stylesheet_sha256)
    || !Number.isInteger(record.sections) || record.sections < 1)
    throw new Error(`Invalid web provenance at ${fileURLToPath(url)}; rebuild the HTML from the canonical manuscript.`);
  return record;
}

/** Bind both the render copy and HTML to the explicitly selected canonical source. */
async function validateWebSource(canonicalRoot: string, inputUrl: URL, sourceUrl: URL): Promise<WebSource> {
  const record: WebSource = await readWebSource(sourceUrl);
  const [canonical, renderCopy, canonicalStylesheet, renderStylesheet, html]: [Buffer, Buffer, Buffer, Buffer, Buffer] = await Promise.all([
    readFile(join(canonicalRoot, 'PUBLIC_PLAYBOOK.md')),
    readFile(new URL('../PUBLIC_PLAYBOOK.md', import.meta.url)),
    readFile(join(canonicalRoot, record.stylesheet)),
    readFile(new URL('../assets/playbook.css', import.meta.url)),
    readFile(inputUrl),
  ]);
  if (sha256(canonical) !== record.sha256 || sha256(renderCopy) !== record.sha256)
    throw new Error('The HTML source hash or render manuscript differs from the canonical manuscript; synchronize and rebuild before exporting.');
  if (sha256(html) !== record.html_sha256)
    throw new Error('The current HTML differs from its build provenance; rebuild before exporting.');
  if (sha256(canonicalStylesheet) !== record.stylesheet_sha256 || sha256(renderStylesheet) !== record.stylesheet_sha256)
    throw new Error('The canonical or render stylesheet differs from the HTML build provenance; synchronize and rebuild before exporting.');
  return record;
}

/** Render verified HTML to PDF bytes with the explicitly selected installed browser. */
async function printPdf(inputUrl: URL, executablePath: string): Promise<PdfResult> {
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page: Page = await browser.newPage();
    await page.goto(inputUrl.href, { waitUntil: 'load' });
    await page.evaluate(async (): Promise<void> => { await document.fonts.ready; });
    const bytes: Buffer = await page.pdf({
      format: 'Letter', printBackground: true, preferCSSPageSize: true,
      tagged: true, outline: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-family:Arial;font-size:8px;color:#475569;padding:0 40px;display:flex;justify-content:space-between"><span>Bridge Node 7 · Review draft</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
      margin: { top: '0.55in', bottom: '0.65in', left: '0.6in', right: '0.6in' },
    });
    return { bytes, browserVersion: browser.version() };
  } finally {
    await browser.close();
  }
}

/** Export only current artifacts, then record the exact source, HTML, PDF, and browser. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  const canonicalRoot: string | undefined = process.argv[3];
  if (process.argv.length !== 4 || !executablePath || !canonicalRoot
    || !isAbsolute(executablePath) || !isAbsolute(canonicalRoot))
    throw new Error('Pass absolute browser and canonical-root paths: npm run pdf -- /absolute/browser/path /absolute/canonical/root');
  await access(executablePath);
  const inputUrl: URL = new URL('../output/web/index.html', import.meta.url);
  const sourceUrl: URL = new URL('../output/web/source.json', import.meta.url);
  const before: WebSource = await validateWebSource(canonicalRoot, inputUrl, sourceUrl);
  const result: PdfResult = await printPdf(inputUrl, executablePath);
  const after: WebSource = await validateWebSource(canonicalRoot, inputUrl, sourceUrl);
  if (before.sha256 !== after.sha256 || before.html_sha256 !== after.html_sha256
    || before.stylesheet_sha256 !== after.stylesheet_sha256)
    throw new Error('The manuscript, stylesheet, or HTML changed during PDF rendering; export again from current artifacts.');
  const outputDirectory: URL = new URL('../output/pdf/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const outputUrl: URL = new URL('Bridge-Node-7-Public-Playbook-Short.pdf', outputDirectory);
  const downloadUrl: URL = new URL('Bridge-Node-7-Public-Playbook-Short.pdf', inputUrl);
  const pdfHash: string = sha256(result.bytes);
  await writeFile(outputUrl, result.bytes);
  await writeFile(downloadUrl, result.bytes);
  const [exportedPdf, downloadPdf]: [Buffer, Buffer] = await Promise.all([
    readFile(outputUrl), readFile(downloadUrl),
  ]);
  if (!exportedPdf.equals(result.bytes) || !downloadPdf.equals(result.bytes))
    throw new Error(`The exported PDF or sibling download differs from rendered bytes at ${fileURLToPath(outputUrl)} and ${fileURLToPath(downloadUrl)}; export again before packaging or deployment.`);
  await writeFile(new URL('source.json', outputDirectory), JSON.stringify({
    source: before.source, sha256: before.sha256,
    html: before.html, html_sha256: before.html_sha256,
    stylesheet: before.stylesheet, stylesheet_sha256: before.stylesheet_sha256,
    pdf: 'Bridge-Node-7-Public-Playbook-Short.pdf', pdf_sha256: pdfHash,
    browser: { executable: executablePath, version: result.browserVersion },
    generator: 'scripts/export-playbook.mts',
  }, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({
    output: fileURLToPath(outputUrl), sourceHash: before.sha256,
    htmlHash: before.html_sha256, stylesheetHash: before.stylesheet_sha256, pdfHash, browser: executablePath,
  }) + '\n');
}

await main();
