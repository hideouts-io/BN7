import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked, type Tokens } from 'marked';
import { chromium, type Browser, type Page } from 'playwright';
import { headingId, renderPage, type EditionPresentation, type SectionLink } from './playbook-page.mts';

type InputFile = Readonly<{ name: string; bytes: Buffer }>;
type FileIdentity = Readonly<{ name: string; bytes: number; sha256: string }>;
type PdfResult = Readonly<{ bytes: Buffer; browserVersion: string }>;
type ReviewManifest = Readonly<{
  title: string; status: string; edition: string; source_review_date: string;
  revision: string; source_name: string; source_sha256: string;
  pdf_engine: Readonly<{ name: string; version: string }>;
  files: readonly FileIdentity[]; inputs: readonly FileIdentity[];
}>;

/** Hash one exact artifact without changing it. */
function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** Describe exact bytes in a public manifest without local environment paths. */
function identity(file: InputFile): FileIdentity {
  return { name: file.name, bytes: file.bytes.length, sha256: sha256(file.bytes) };
}

/** Read the complete canonical expanded-edition build dependency set. */
async function readInputs(root: string): Promise<readonly InputFile[]> {
  const names: readonly string[] = ['PUBLIC_PLAYBOOK_EXTENDED.md', 'assets/playbook.css',
    'assets/extended-playbook.css', 'scripts/playbook-page.mts', 'scripts/prepare-expanded-playbook.mts',
    'package.json', 'package-lock.json'];
  return await Promise.all(names.map(async (name: string): Promise<InputFile> => ({ name, bytes: await readFile(join(root, name)) })));
}

/** Reject changed inputs rather than packaging a mixed revision. */
function assertUnchanged(before: readonly InputFile[], after: readonly InputFile[]): void {
  for (const file of before) {
    const current: InputFile | undefined = after.find(item => item.name === file.name);
    if (!current || !file.bytes.equals(current.bytes))
      throw new Error(`Expanded-edition input changed during preparation: ${file.name}; choose a fresh output directory and rebuild.`);
  }
}

/** Print the ten-section reading copy with native tagged PDF and visible review status. */
async function printPdf(html: string, executablePath: string): Promise<PdfResult> {
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page: Page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(async (): Promise<void> => { await document.fonts.ready; });
    const bytes: Buffer = await page.pdf({
      format: 'Letter', printBackground: true, preferCSSPageSize: true, tagged: true,
      outline: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-family:Arial;font-size:8px;color:#475569;padding:0 40px;display:flex;justify-content:space-between"><span>Bridge Node 7 · Expanded editorial review draft</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
      margin: { top: '0.55in', bottom: '0.65in', left: '0.6in', right: '0.6in' },
    });
    return { bytes, browserVersion: browser.version() };
  } finally { await browser.close(); }
}

/** Prepare one distinct candidate, refusing to replace any existing output directory. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  const canonicalRoot: string | undefined = process.argv[3];
  const outputRoot: string | undefined = process.argv[4];
  if (process.argv.length !== 5 || !executablePath || !canonicalRoot || !outputRoot
    || !isAbsolute(executablePath) || !isAbsolute(canonicalRoot) || !isAbsolute(outputRoot))
    throw new Error('Pass absolute browser, canonical-root, and unused output-directory paths to prepare-expanded-playbook.mts.');
  if (fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '') !== canonicalRoot.replace(/\/$/, ''))
    throw new Error(`Execute the script from its canonical checkout; received canonical root ${canonicalRoot}.`);
  await access(executablePath);
  const inputs: readonly InputFile[] = await readInputs(canonicalRoot);
  const manuscript: string = inputs[0].bytes.toString('utf8');
  const stylesheet: string = `${inputs[1].bytes.toString('utf8')}\n${inputs[2].bytes.toString('utf8')}`;
  const sections: readonly SectionLink[] = marked.lexer(manuscript)
    .filter((token): token is Tokens.Heading => token.type === 'heading' && token.depth === 2)
    .map(token => ({ id: headingId(token.text), text: token.text }));
  if (sections.length !== 10 || new Set(sections.map(section => section.id)).size !== 10)
    throw new Error('PUBLIC_PLAYBOOK_EXTENDED.md must contain ten distinct second-level chapter headings.');
  const pdfName: string = 'Bridge-Node-7-Public-Playbook-Expanded.pdf';
  const edition: EditionPresentation = {
    title: 'Bridge Node 7 | Expanded Public Playbook — Review Draft',
    status: 'Expanded public playbook · Editorial review draft · October 5, 2026',
    readLabel: 'Read the expanded playbook', pdfName,
    articleLabel: 'Expanded public playbook',
  };
  const html: string = renderPage(manuscript, stylesheet, sections, edition);
  const result: PdfResult = await printPdf(html, executablePath);
  assertUnchanged(inputs, await readInputs(canonicalRoot));
  const files: readonly InputFile[] = [inputs[0], { name: 'index.html', bytes: Buffer.from(html) }, { name: pdfName, bytes: result.bytes }];
  const revision: string = `${sha256(inputs[0].bytes).slice(0, 12)}-${sha256(result.bytes).slice(0, 12)}`;
  const manifest: ReviewManifest = {
    title: 'Bridge Node 7: public playbook — expanded review edition',
    status: 'Editorial review draft; company, qualified technical, audience and accessibility review pending',
    edition: 'Expanded ten-chapter candidate; preserved short edition remains separate',
    source_review_date: '2026-10-05', revision, source_name: inputs[0].name,
    source_sha256: sha256(inputs[0].bytes), pdf_engine: { name: 'Chromium', version: result.browserVersion },
    files: files.map(identity), inputs: inputs.map(identity),
  };
  await mkdir(outputRoot, { recursive: false });
  for (const file of files) await writeFile(join(outputRoot, file.name), file.bytes, { flag: 'wx' });
  await writeFile(join(outputRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write(JSON.stringify({ output: outputRoot, revision, files: manifest.files, inputs: manifest.inputs }) + '\n');
}

await main();
