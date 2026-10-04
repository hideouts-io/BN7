import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Marked, marked, type Tokens } from 'marked';

type SectionLink = Readonly<{ id: string; text: string }>;

/** Return a stable fragment for a manuscript heading. */
function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').trim().replace(/ +/g, '-');
}

/** Escape manuscript-derived navigation labels and fragments. */
function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/** Render a semantic heading with a stable, source-derived fragment. */
function renderHeading(heading: Tokens.Heading): string {
  return `<h${heading.depth} id="${headingId(heading.text)}">${marked.parseInline(heading.text, { async: false })}</h${heading.depth}>\n`;
}

/** Produce one self-contained page from the canonical Markdown manuscript. */
function renderPage(manuscript: string, stylesheet: string, sections: readonly SectionLink[]): string {
  const navigation: string = sections.map(section =>
    `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.text)}</a></li>`).join('\n');
  const parser: Marked = new Marked({
    async: false,
    gfm: true,
    renderer: { heading: renderHeading },
  });
  const article: string = parser.parse(manuscript, { async: false });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="A public introduction to Bridge Node 7's evidence, assurance, and accountable decision methods.">
<title>Bridge Node 7 | Public Playbook — Review Draft</title>
<style>${stylesheet}</style>
</head>
<body>
<a id="skip-link" class="skip-link" href="#playbook">Skip to playbook</a>
<header class="site-header"><span>BRIDGE NODE 7</span><span>Public playbook · Review draft</span></header>
<div class="layout">
<nav id="contents" aria-label="Playbook contents"><p class="nav-label">Explore the guide</p><ol>${navigation}</ol></nav>
<main id="playbook" tabindex="-1">${article}</main>
</div>
<footer>Bridge Node 7 · Editorial review draft · Source review: October 4, 2026</footer>
</body>
</html>\n`;
}

/** Read explicit project inputs and write the derived preview plus its source hash. */
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
  await writeFile(outputUrl, renderPage(manuscript, stylesheet, sections), 'utf8');
  const sourceHash: string = createHash('sha256').update(manuscript).digest('hex');
  await writeFile(new URL('source.json', outputDirectory), JSON.stringify({
    source: 'PUBLIC_PLAYBOOK.md', sha256: sourceHash, sections: sections.length,
    generator: 'scripts/build-playbook.mts',
  }, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({ output: fileURLToPath(outputUrl), sourceHash }) + '\n');
}

type TokensList = ReturnType<typeof marked.lexer>;

await main();
