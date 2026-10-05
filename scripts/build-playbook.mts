import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { marked, type Tokens } from 'marked';
import { headingId, renderPage, type EditionPresentation, type SectionLink } from './playbook-page.mts';

/** Read explicit project inputs and bind the preview bytes to their source manuscript. */
async function main(): Promise<void> {
  const manuscriptUrl: URL = new URL('../PUBLIC_PLAYBOOK.md', import.meta.url);
  const stylesheetUrl: URL = new URL('../assets/playbook.css', import.meta.url);
  const [manuscript, stylesheet]: [string, string] = await Promise.all([
    readFile(manuscriptUrl, 'utf8'), readFile(stylesheetUrl, 'utf8'),
  ]);
  const tokens: TokensList = marked.lexer(manuscript);
  const sections: readonly SectionLink[] = tokens
    .filter((token): token is Tokens.Heading => token.type === 'heading' && token.depth === 2)
    .map(token => ({ id: headingId(token.text), text: token.text }));
  if (sections.length === 0) throw new Error('PUBLIC_PLAYBOOK.md contains no section headings.');
  if (new Set(sections.map(section => section.id)).size !== sections.length)
    throw new Error('PUBLIC_PLAYBOOK.md contains duplicate section fragments.');
  const outputDirectory: URL = new URL('../output/web/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const outputUrl: URL = new URL('index.html', outputDirectory);
  const edition: EditionPresentation = {
    title: 'Bridge Node 7 | Public Playbook — Review Draft',
    status: 'Public playbook · Editorial review draft · October 4, 2026',
    readLabel: 'Read the short playbook',
    pdfName: 'Bridge-Node-7-Public-Playbook-Short.pdf',
    articleLabel: 'Short public playbook',
  };
  const html: string = renderPage(manuscript, stylesheet, sections, edition);
  await writeFile(outputUrl, html, 'utf8');
  const sourceHash: string = createHash('sha256').update(manuscript).digest('hex');
  const stylesheetHash: string = createHash('sha256').update(stylesheet).digest('hex');
  const htmlHash: string = createHash('sha256').update(html).digest('hex');
  await writeFile(new URL('source.json', outputDirectory), JSON.stringify({
    source: 'PUBLIC_PLAYBOOK.md', sha256: sourceHash, sections: sections.length,
    html: 'index.html', html_sha256: htmlHash,
    stylesheet: 'assets/playbook.css', stylesheet_sha256: stylesheetHash,
    generator: 'scripts/build-playbook.mts',
  }, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({ output: fileURLToPath(outputUrl), sourceHash, stylesheetHash, htmlHash }) + '\n');
}


await main();
