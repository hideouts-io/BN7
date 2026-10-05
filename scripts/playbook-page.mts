import { Marked, marked, type Tokens } from 'marked';

export type EditionPresentation = Readonly<{
  title: string;
  status: string;
  readLabel: string;
  pdfName: string;
  articleLabel: string;
}>;

export type SectionLink = Readonly<{ id: string; text: string }>;

/** Return a stable fragment for a manuscript heading. */
export function headingId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').trim().replace(/ +/g, '-');
}

/** Escape manuscript-derived navigation labels and fragments. */
function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/** Render a semantic heading with a stable, source-derived fragment. */
function renderHeading(heading: Tokens.Heading): string {
  const depth: number = heading.depth;
  const className: string = heading.depth === 1 ? ' class="manuscript-title"' : '';
  return `<h${depth}${className} id="${headingId(heading.text)}">${marked.parseInline(heading.text, { async: false })}</h${depth}>\n`;
}

/** Produce one self-contained page from the canonical Markdown manuscript. */
export function renderPage(manuscript: string, stylesheet: string, sections: readonly SectionLink[], edition: EditionPresentation): string {
  const navigation: string = sections.map(section =>
    `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.text)}</a></li>`).join('\n');
  const parser: Marked = new Marked({
    async: false,
    gfm: true,
    renderer: { heading: renderHeading },
  });
  const tokens: TokensList = marked.lexer(manuscript);
  const starts: readonly number[] = tokens.flatMap((token, index) =>
    token.type === 'heading' && token.depth === 2 ? [index] : []);
  const article: string = starts.map((start, index) => {
    const end: number = index + 1 < starts.length ? starts[index + 1] : tokens.length;
    const sectionTokens: TokensList = Object.assign(tokens.slice(index === 0 ? 0 : start, end), { links: tokens.links });
    const body: string = parser.parser(sectionTokens);
    return `<section class="reading-section" aria-labelledby="${escapeHtml(sections[index].id)}">${body}</section>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="A public introduction to Bridge Node 7's evidence, assurance, and accountable decision methods.">
<meta name="theme-color" content="#050914">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23f1c86b'/%3E%3Ctext x='50' y='63' font-size='52' font-weight='900' fill='%23050914' text-anchor='middle'%3E7%3C/text%3E%3C/svg%3E">
<title>${escapeHtml(edition.title)}</title>
<style>${stylesheet}</style>
</head>
<body>
<a id="skip-link" class="skip-link" href="#playbook">Skip to playbook</a>
<header id="site-header" class="nav"><div class="nav-inner"><a id="brand-home" class="brand" href="https://bridgenode7.com/" aria-label="Bridge Node 7 home"><span class="mark" aria-hidden="true"><span>7</span></span><span>Bridge Node 7</span></a><nav class="nav-links" aria-label="Primary navigation"><a id="header-contents" href="#contents">Playbook</a><a id="partner-link" class="cta" href="https://bridgenode7.com/partner/">Partner</a></nav></div></header>
<div class="shell"><section class="hero" aria-labelledby="hero-title"><div class="hero-grid"><div><p class="draft-status">${escapeHtml(edition.status)}</p><h1 id="hero-title"><span class="gradient-text">Frontier Intelligence</span><span>Mission Assurance</span><span>Strategic Resilience</span></h1><p class="lead hero-lead">Bridge Node 7 builds evidence-to-decision infrastructure for frontier systems.</p></div><div class="orbital" aria-label="Bridge Node 7 seven-domain model"><div aria-hidden="true" class="path-field"><span style="--i:0"></span><span style="--i:1"></span><span style="--i:2"></span><span style="--i:3"></span><span style="--i:4"></span><span style="--i:5"></span><span style="--i:6"></span><span style="--i:7"></span><span style="--i:8"></span><span style="--i:9"></span><span style="--i:10"></span><span style="--i:11"></span><span style="--i:12"></span><span style="--i:13"></span><span style="--i:14"></span><span style="--i:15"></span><span style="--i:16"></span><span style="--i:17"></span><span style="--i:18"></span><span style="--i:19"></span><span style="--i:20"></span><span style="--i:21"></span></div><div class="center-node"><div><span class="center-word">Bridge</span><span class="center-word">Node</span><strong>7</strong></div></div><div class="node n1"><small>01</small><b>Quantum Technology</b></div><div class="node n2"><small>02</small><b>AI Governance</b></div><div class="node n3"><small>03</small><b>Critical Materials</b></div><div class="node n4"><small>04</small><b>Supply Chain</b></div><div class="node n5"><small>05</small><b>Space Systems</b></div><div class="node n6"><small>06</small><b>Information Trust</b></div><div class="node n7"><small>07</small><b>Mission Assurance</b></div></div></div><div class="actions"><a id="read-playbook" class="btn primary" href="#playbook">${escapeHtml(edition.readLabel)}</a><a id="download-pdf" class="btn" href="${escapeHtml(edition.pdfName)}" download>Download the PDF</a></div></section></div>
<div class="reading-layout shell">
<nav id="contents" class="contents" aria-label="Playbook contents"><p class="section-label">Explore the guide</p><ol>${navigation}</ol><a id="review-questions" class="review-link" href="https://github.com/hideouts-io/BN7/blob/codex/public-playbook/REVIEW_BRIEF.md#questions-for-bryan">Review questions for Bryan</a></nav>
<main id="playbook" tabindex="-1" aria-label="${escapeHtml(edition.articleLabel)}">${article}</main>
</div>
<section class="activation" aria-labelledby="activation-title"><div class="shell activation-inner"><p class="eyebrow">Evidence. Intelligence. Decisions.</p><h2 id="activation-title">Explore the next question.</h2><p class="shared">Inspect the sources. Share a question. Keep the evidence visible.</p><div class="actions"><a id="footer-pdf" class="btn primary" href="${escapeHtml(edition.pdfName)}" download>Download the review PDF</a><a id="repository-link" class="btn" href="https://github.com/hideouts-io/BN7">Explore the project</a></div><p class="draft-status">Editorial review draft · Company and specialist review pending</p></div></section>
<footer class="footer"><div class="shell footer-inner"><a class="footer-brand" href="https://bridgenode7.com/"><span class="mark" aria-hidden="true"><span>7</span></span><strong>Bridge Node 7</strong></a><a class="footer-contact" href="mailto:contact@bridgenode7.com">contact@bridgenode7.com</a><div class="footer-right"><nav class="footer-links" aria-label="Footer navigation"><a href="https://bridgenode7.com/privacy/">Privacy</a><a id="back-to-top" href="#hero-title">Back to top</a></nav><span class="copyright">© 2026 Bridge Node 7</span></div></div></footer>
</body>
</html>\n`;
}

type TokensList = ReturnType<typeof marked.lexer>;
