# Bridge Node 7 editorial workplan

**Current editorial brief · October 4, 2026**

[TODO.md](TODO.md) is the single ordered task register. This file records editorial direction and deliverable choices. Research details live in the [evidence register](research/EVIDENCE_REGISTER.md), [source inventory](research/source-inventory.json), and separate source studies. The two original drafts are preserved byte-for-byte in research/baseline/ with their hashes.

## Working brief

Produce a central public playbook that is understandable, technically credible, and inviting to curious readers, academia, technical partners, and institutional/investor reviewers. The short edition comes first; the longer edition initially receives only an expansion outline.

The user works in Bridge Node 7 business development and marketing and has stated full access and authorization to use all material on the canonical public GitHub account and website. Content reuse for this initiative is settled. Public-reader software rights remain accurately described by each repository's own terms. The user explicitly authorized commit and push to the private hideouts-io/BN7 repository on October 4, 2026. Public release still requires approval of final content and destination.

All eight public repositories have been cloned separately under /Users/macbookpro/Codex/Any/BN7-sources. Their studies examine implementation/validators, contracts, examples, tests, release records, and limitations, with exact examined-path inventories. Source inspection is distinct from running software, verifying customer outcomes, or auditing every file.

## Narrative choices

| Direction | Reader benefit | Tradeoff |
| --- | --- | --- |
| **Evidence to decisions — recommended** | Begins with an ordinary question, shows source tracing and a changed assumption, then connects the portfolio. Works across all four audiences. | Needs disciplined example selection so the shared architecture stays concrete. |
| **Frontier-technology tour** | Quantum, materials, AI/cyber, and space can draw readers toward a domain they care about. | Risks feeling like several projects and implying uniform product maturity. |
| **Research-methods guide** | Gives academia a strong path through provenance, uncertainty, reproducibility, and critique. | Requires careful explanation to stay welcoming to non-specialists and institutional readers. |

The user confirmed the first direction for the short manuscript. It opens with FIW's fictional three-reports/one-source story, uses FMA's synthetic changed-assumption case as the flagship, and adds a brief Gallium evidence-boundary sidebar. This keeps a simple public opening while giving technical readers a substantive next step. The narrative decision is settled; detailed example/design/format review continues on the concrete candidate.

## Deliverables and formats

- **Short edition:** [PUBLIC_PLAYBOOK.md](PUBLIC_PLAYBOOK.md), 1,454 words. A standalone public learning guide with a plain-language process, bounded examples, portfolio reading paths, academia/partner/investor routes, and source/use boundaries.
- **Web review candidate:** output/web/index.html, derived from that same manuscript. Semantic headings, contents navigation, responsive layout, source links, and no third-party runtime assets.
- **Printable review candidate:** output/pdf/Bridge-Node-7-Public-Playbook-Short.pdf, printed from the same generated page. The four-page tagged Letter candidate was rendered and every page inspected; final human accessibility and release review remain open.
- **Long edition:** [LONG_PLAYBOOK_OUTLINE.md](LONG_PLAYBOOK_OUTLINE.md), proposing 5,000–8,000 words and ten deeper chapters. Full expansion follows short-edition review.
- **Private evidence:** source studies, claim register, exact source/release metadata, website snapshots and hashes. These are working evidence rather than public playbook content.
- **Standalone review archive:** output/package/Bridge-Node-7-Public-Playbook-Review.zip contains only the short manuscript, self-contained HTML, four-page PDF, and file/hash manifest. Preferred delivery format and distribution channel are pending; no upload or release has occurred.
- **Human-review preparation:** [REVIEW_BRIEF.md](REVIEW_BRIEF.md) defines named technical review and public, academic, and partner/investor reader sessions. Assignments and feedback remain pending; no outreach has occurred.

Tone and visual direction are provisional: approachable technical prose, a restrained navy/teal reading layout, and clear sources. The design introduces no new official logo or identity. The ordered process becomes a six-step visual in the generated page while retaining its complete text explanation.

## Source and build arrangement

BN7 is the private editorial working source. PUBLIC_PLAYBOOK.md owns the short narrative; detailed technical specifications remain authoritative in their original repositories. The user excludes website changes. The generated page remains a standalone local review artifact, and the PDF is prepared for a separately chosen distribution channel. No cloned source repository is nested inside BN7, and no upstream repository is edited.

The renderers' inputs, outputs, and requirements are documented in their functions. The project declares exact Marked/Playwright versions in package.json and uses already-bundled dependencies through an ignored local node_modules symlink; no Node packages were installed. The separate FMA evaluation used the authorized isolated Python environment and source-declared PyYAML/jsonschema dependencies; its installation record lives in research/fma-evaluation/. With the declared renderer dependencies available, regenerate using:

```sh
npm run check
npm run build
npm run verify -- /absolute/path/to/installed/chromium-browser
npm run pdf -- /absolute/path/to/installed/chromium-browser
```

The PDF command requires an explicitly supplied browser path. Current checks use the installed Google Chrome executable. Final browser checks passed for 1280, 375, and 320 CSS-pixel widths, keyboard skip navigation, fragments, reduced motion, computed text contrast, visible focus, and table structure. Native Chrome zoom observations and their scope are recorded separately. All four final PDF pages were visually inspected, and every manuscript reference URL is present in PDF link annotations. These checks do not establish assistive-technology usability or full accessibility conformance; TODO P07 retains that review. The check command validates syntax, not TypeScript types. Generated output and intermediates are ignored by Git; approved publication artifacts can be selected separately. To avoid intermittent iCloud hydration stalls in Documents, an exact local render snapshot is preserved at /Users/macbookpro/Codex/Any/BN7-render; its outputs are the reliable review copies. The source hashes and verification scope are recorded in research/render-review.json. This does not relocate the canonical workspace or change cloud settings.

## Standalone distribution

The user does not want changes to bridgenode7.com. Treat the existing site and public source repositories as read-only research. The earlier proposed /playbook/ URL is superseded.

Prepare a standalone PDF and optional self-contained HTML from the same canonical manuscript. Keep the private working repository, source studies, task register, and confidential business evidence separate from the public artifact. Select a public file host, Library/share location, or user-managed distribution route after the review candidate is assessed; no destination or upload is assumed.

## Decisions and evidence still needed

The user selected hideouts-io as the private repository owner. [hideouts-io/BN7](https://github.com/hideouts-io/BN7) is created and verified private; the local origin points to https://github.com/hideouts-io/BN7.git. The authorized private commit/push uses codex/public-playbook. Bridge-Node-7 remains the canonical upstream account for research, and no source clone was modified. Git state in research/render-review.json records the earlier review checkpoint; it does not grant public-release authorization.

The user should review the concrete short draft to confirm the lead example, tone, and formats within the chosen narrative. The next factual questions concern an approved company identity/brief team description and what academic or technical collaboration BN7 wants to invite. Commercial figures and financing details can remain outside this public guide unless the user wants supported public language.

The bounded FMA baseline validator and changed-assumption comparison were executed successfully at the inspected source commit. Six expected impacts matched; both decisions remain HOLD, with provenance warnings retained. The evidence register links exact commands and outputs and separates those observations from scientific or operational validity. Named qualified review, real representative-reader feedback, assistive-technology review, standalone distribution, and public release remain separate tasks in TODO.md. Website integration is excluded. Model editorial review and browser layout checks do not satisfy those human or operational requirements.
