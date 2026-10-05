# Bridge Node 7 editorial workplan

**Current editorial brief · October 5, 2026**

[TODO.md](TODO.md) is the single ordered task register. This file records editorial direction and deliverable choices. Research details live in the [evidence register](research/EVIDENCE_REGISTER.md), [source inventory](research/source-inventory.json), and separate source studies. The two original drafts are preserved byte-for-byte in research/baseline/ with their hashes.

## Working brief

Produce a central public playbook that is understandable, technically credible, and inviting to curious readers, academia, technical partners, and institutional/investor reviewers. The short edition comes first; the longer edition initially receives only an expansion outline.

The user works in Bridge Node 7 business development and marketing and has stated full access and authorization to use all material on the canonical public GitHub account and website. Content reuse is settled; public-reader software rights remain accurately described by each repository’s terms. Repository draft access was separately authorized after disclosure review. The user subsequently explicitly authorized focused commit, push, and deployment of the independent hideouts.io review-draft section while preserving existing pages and unrelated work. P15 records its completion. Human review, final-edition approval, outreach, and changes to bridgenode7.com remain separate.

All eight public repositories have been cloned separately under /Users/macbookpro/Codex/Any/BN7-sources. Their studies examine implementation/validators, contracts, examples, tests, release records, and limitations, with exact examined-path inventories. Source inspection is distinct from running software, verifying customer outcomes, or auditing every file.

## Narrative choices

| Direction | Reader benefit | Tradeoff |
| --- | --- | --- |
| **Evidence to decisions — recommended** | Begins with an ordinary question, shows source tracing and a changed assumption, then connects the portfolio. Works across all four audiences. | Needs disciplined example selection so the shared architecture stays concrete. |
| **Frontier-technology tour** | Quantum, materials, AI/cyber, and space can draw readers toward a domain they care about. | Risks feeling like several projects and implying uniform product maturity. |
| **Research-methods guide** | Gives academia a strong path through provenance, uncertainty, reproducibility, and critique. | Requires careful explanation to stay welcoming to non-specialists and institutional readers. |

The user confirmed the first direction for the short manuscript. It opens with FIW's fictional three-reports/one-source story, uses FMA's synthetic changed-assumption case as the flagship, and adds a brief Gallium evidence-boundary sidebar. This keeps a simple public opening while giving technical readers a substantive next step. The narrative decision is settled; detailed example/design/format review continues on the concrete candidate.

## Deliverables and formats

- **Short edition:** [PUBLIC_PLAYBOOK.md](PUBLIC_PLAYBOOK.md), 1,492 words. A standalone public learning guide with a plain-language process, bounded examples, portfolio reading paths, academia/partner/investor routes, and source/use boundaries.
- **Web review candidate:** output/web/index.html, derived from that same manuscript. Semantic headings, contents navigation, responsive layout, source links, and no third-party runtime assets.
- **Printable review candidate:** output/pdf/Bridge-Node-7-Public-Playbook-Short.pdf, printed from the same generated page. The four-page tagged Letter candidate was rendered and every page inspected; final human accessibility and release review remain open.
- **Long edition:** [LONG_PLAYBOOK_OUTLINE.md](LONG_PLAYBOOK_OUTLINE.md), proposing 5,000–8,000 words and ten deeper chapters. Full expansion follows short-edition review.
- **Supporting research:** tracked source studies, claim register, exact source/release metadata, website snapshots and hashes become inspectable with the authorized repository visibility change. They are supporting review material rather than claims of completed human review or a finalized edition.
- **Standalone review archive:** a revision-specific ZIP contains only the short manuscript, self-contained HTML, four-page PDF, and file/hash manifest. PDF is the primary deliverable, with HTML as the reading copy. The matching HTML/PDF review draft is publicly served under P15; the ZIP remains a preserved local handoff. Final-edition distribution and release remain pending.
- **Human-review preparation:** [REVIEW_BRIEF.md](REVIEW_BRIEF.md) identifies Bryan Lachica, whom the user named as CEO, as lead internal/company reviewer and defines the remaining technical, audience, and accessibility review scopes. Feedback has not yet been received; no outreach has occurred.

The user requested a faithful adaptation of bridgenode7.com. The HTML uses the inspected live site's dark navy field, gold/blue/teal/violet palette, system typography, CSS-drawn mark, orbital hero, sticky header, rounded cards, buttons, and footer. Approachable prose and clear sources remain subject to human review. The adaptation reuses the existing brand identity under the user's material-reuse authorization. The ordered process becomes a six-step visual in the generated page while retaining its complete text explanation. The user selected PDF first with a standalone HTML reading copy; this settles the short-format decision.

## Source and build arrangement

BN7 is the editorial working source authorized for public draft review. PUBLIC_PLAYBOOK.md owns the short narrative; detailed technical specifications remain authoritative in their original repositories. The manuscript and questionnaire are the GitHub-accessible reading routes. The generated HTML/PDF are preserved locally, and the selected review draft is published on hideouts.io; [REVIEW_BRIEF.md](REVIEW_BRIEF.md#candidate-identity) owns the draft reading/download routes and exact artifact identities. Original source studies use the separate pinned clones; staged reference gitlinks under references/Bridge-Node-7 are preserved outside this continuation's edits. Upstream repositories and the live bridgenode7.com site remain unchanged. P14/P15 record completed integration and authorized review-draft deployment. Final-edition distribution and approval remain U01–U05.

P16's navigation correction is rendered separately in `output/p06-navigation-20261005/render`, preserving the earlier candidate in the original output paths. [The finding and intermediate identities](REVIEW_BRIEF.md#assistant-observed-navigation-correction) remain historical; the combined P17 correction is now published. Build/export/verify use that render root, and packaging uses a distinct revision path. Its preserved preview is http://127.0.0.1:4389/. The canonical root remains this BN7 workspace.

P17's [published short revision](REVIEW_BRIEF.md#candidate-identity) combines navigation correction with a direct citation of the retained C09 evaluation. Its exact build/export/verify snapshot is `/Users/macbookpro/Codex/Any/BN7-render-p17-20261005`, outside intermittently offloaded Documents; the canonical manuscript remains here. Its preserved preview is http://127.0.0.1:4391/; packaging uses that render root and the distinct ZIP identified in REVIEW_BRIEF.md. Website revision **c5b6cbb8501c-22dc71bea89e** is deployed under the user's explicit commit/push/publish instruction. [Publication verification](research/p17-publication-review.json) binds the successful workflow, exact served bytes and preservation of all 462 other production files. Prior candidates remain preserved. Human-review/freezing and final-edition gates remain open.

The renderers' inputs, outputs, and requirements are documented in their functions. The project declares exact Marked/Playwright versions in package.json and uses already-bundled dependencies through an ignored local node_modules symlink; no Node packages were installed. The separate FMA evaluation used the authorized isolated Python environment and source-declared PyYAML/jsonschema dependencies; its installation record lives in research/fma-evaluation/. With the declared renderer dependencies available, regenerate using:

```sh
npm run check
npm run build
npm run pdf -- /absolute/path/to/installed/chromium-browser /absolute/canonical/workspace
npm run preview
# In another terminal after the preview is running:
npm run verify -- /absolute/path/to/installed/chromium-browser http://127.0.0.1:4173/
python3 scripts/package-playbook.py --canonical-root /absolute/canonical/workspace --render-root /absolute/render/workspace --output /absolute/unused/review.zip
```

The PDF command requires explicit browser and canonical-workspace paths; it checks the render inputs against that workspace before and after printing. The web/PDF provenance sidecars and package validator bind the manuscript, stylesheet, HTML, and PDF bytes. The Python packager uses the standard library, requires explicit roots/output, and creates a deterministic archive for identical inputs. It reuses an identical existing archive and rejects an existing archive with different bytes; use a new revision path for an updated candidate. The old candidate remains preserved. Function/module docstrings own the implementation details.

Current checks use the installed Google Chrome executable. Browser checks cover 1280, 375, and 320 CSS-pixel widths, keyboard skip navigation, fragments, reduced motion, computed text contrast, visible focus, and table structure. Native Chrome zoom observations and their scope are recorded separately. PDF pages are visually inspected after substantive changes, and manuscript reference URLs are checked against PDF link annotations. These checks do not establish assistive-technology usability or full accessibility conformance; TODO P07 retains that review. The check command validates Node syntax, not TypeScript types. Generated outputs and intermediates remain ignored by Git. To avoid intermittent iCloud hydration stalls in Documents, an exact local render snapshot was preserved at /Users/macbookpro/Codex/Any/BN7-render. Those outputs and research/render-review.json remain historical candidates and evidence; [REVIEW_BRIEF.md](REVIEW_BRIEF.md#candidate-identity) identifies the current canonical-workspace artifacts. This does not relocate the canonical workspace or change cloud settings.

## Standalone distribution

The user does not want changes to bridgenode7.com. Treat the existing site and public source repositories as read-only research. The earlier proposed /playbook/ URL is superseded.

Prepare the primary PDF and self-contained HTML reading copy from the same canonical manuscript. The repository review workspace includes tracked planning and public-source studies; the generated artifact archive excludes those working documents. Keep actual confidential business evidence and identifiable feedback outside the public repository unless disclosure is approved. Choose among these final-edition delivery arrangements after the candidate is assessed:

| Arrangement | Reader experience and work required |
| --- | --- |
| **Owner-controlled public file location — recommended** | One stable public reference leads to the versioned PDF; place the HTML reading copy beside it where supported. Select the actual destination and publisher, then check unsigned-in access, downloads, references, and file identity. |
| **Public Library/share location** | Use an available sharing destination only after checking its actual public-access and download behavior. Keep PDF primary; offer HTML as a downloadable copy if the service does not render it. |
| **Owner-managed artifact package** | Distribute the approved PDF, HTML, and manifest as files or an archive. This supports handouts and authorized direct sharing; a stable public reference still needs to be selected. |

No destination, upload, public metadata, or outreach is approved by selecting a format or naming a reviewer. Distribution preparation remains U01–U05 in TODO.md.

## Publication handoff preparation

This is the destination-independent final-edition handoff for U02. It supplies proposed listing copy and the information a publisher needs; it does not establish an approved final edition or a completed launch check. Repository draft access is separately authorized. The exact review candidate and artifact hashes are recorded in [REVIEW_BRIEF.md](REVIEW_BRIEF.md#candidate-identity). Do not substitute a newer candidate without updating that record and obtaining the relevant review.

| Field | Prepared value or required decision |
| --- | --- |
| Display title | **Bridge Node 7 — Evidence to trusted capability**; derived from the manuscript title and subtitle. Proposed for the distribution listing. |
| Short description | **A public introduction to Bridge Node 7's evidence, assurance, and accountable decision methods.** Matches the current HTML description; approve as part of the final listing copy. |
| Language and formats | English; primary four-page Letter PDF, with a self-contained HTML reading copy from the same manuscript. |
| Audience | Curious public readers, researchers and academia, technical teams, prospective partners, and institutional/investor reviewers. |
| Present status | Editorial review draft. October 4, 2026 is the source-review/draft date; P15 records review-draft publication on October 5, 2026. The final-edition publication date remains pending. The current render retains draft labels. |
| Attribution | The manuscript identifies Bridge Node 7. Individual authors, team biographies, legal-entity wording, and a playbook-wide license are not supplied. Do not infer them from repository ownership or add them to the listing. Existing repository-specific use boundaries remain in the manuscript. |
| Files to select | Primary PDF, `index.html`, optional `PUBLIC_PLAYBOOK.md`, and the public `manifest.json` from the approved candidate archive. The candidate ZIP contains those four files. Select actual downloadable formats before approving the handoff; no private working document or research record is included. |
| Edition identity | Record the approved manuscript SHA-256 and exact published file hashes from the candidate manifest. A draft renderer/package version is not a published playbook edition number. |
| Public route | P15 records the published draft entry and downloads; [REVIEW_BRIEF.md](REVIEW_BRIEF.md#candidate-identity) supplies their routes and identities. Final-edition destination, versioning/access behavior, and responsible publisher remain to be approved under U01. Keep the stable entry useful when a later approved edition replaces the current edition. |
| Public contact and corrections | The manuscript points to the existing published inquiry route. The correction recipient, public wording, and ongoing responsibility need confirmation under M01/U03 before presenting that route as accepting playbook corrections. |

For U03–U05, prepare a release decision that binds the approved listing copy, manuscript and generated file identities, actual destination, selected formats, publisher, correction route, and review results. Record factual approval, technical scope, reader/accessibility findings, and public-release authorization separately. A proposed destination or a named reviewer does not supply the other decisions. The owner may revise the title/description without changing the manuscript; any manuscript or rendering change requires updated identities and the relevant checks.

Use this blank final-edition release record once actual decisions are supplied. Keep confidential answers outside the public repository and commit only approved public decisions:

```text
Approved title/description, attribution, and public reuse wording: Pending
Approved manuscript and selected artifact SHA-256 identities: Pending
Edition identifier, publication date, and source-review cutoff: Pending
Public entry reference, versioned file locations, and access behavior: Pending
Publisher and correction recipient/route: Pending
Review records, resolved findings, and remaining disclosed limits: Pending
Exact-content/destination release authorization, approver, and date: Pending
Actual publication URLs/date and served-file verification result: Not published
```

The final production pass must address the existing review-draft labels in the manuscript, HTML title/header/footer, PDF footer, and package manifest. Replace them only after the owner approves release wording. Regenerate both formats and a distinct archive, then inspect the affected pages and verify the links and artifact binding. Preserve the reviewed draft; an approved manuscript and an approved release package must refer to the same bytes. These release changes belong to U04, not to this preparation milestone.

The selected publisher needs to establish whether the destination serves HTML or downloads it, how a PDF is opened/downloaded, and whether public readers can access both without an account. After authorized publication, U07 verifies the actual unsigned-in entry/download routes, file bytes against the approved manifest, HTML navigation and source references, displayed status/date/edition, and correction route. Record the actual URLs, verification date, browser, hashes, and failures; do not infer successful access from an upload response. Retain an attributable prior edition and update the stable entry only through the approved revision process.

## Continuous improvement and revision handling

Prepare maintenance before launch. TODO.md owns task status; this section defines the working method and references the feedback capture and severity rules in REVIEW_BRIEF.md.

| Role | Responsibility and assignment |
| --- | --- |
| Editorial owner | The user's BN7 business-development/marketing role coordinates the manuscript, single TODO, feedback, reader needs, and approved company wording. Formal ongoing assignment is confirmed under M01. |
| Lead internal/company reviewer | Bryan Lachica, identified by the user as CEO, reviews positioning, company statements, engagement language, and overall clarity. Record the actual passages reviewed and his scope; review is pending. |
| Technical reviewer/source custodian | Assess affected claims, source revisions, example behavior, evidence limits, citations, and terms. Bryan may review within his relevant expertise; additional domain assignment is needed only where the reviewed claims require it. No independent signoff is inferred from his title. |
| Production and distribution owner | Codex prepares and verifies draft candidates and the authorized repository review access; the responsible final-edition publisher remains to be selected. The approved publisher maintains the final public route and released artifact identity. |
| Reader and accessibility reviewers | Record actual public, academic, partner/investor, and assistive-technology perspectives. Internal review does not establish representative audience or accessibility feedback. |

Under M01, record actual acceptance for each ongoing role before launch. Naming Bryan for this candidate's review does not assign ongoing source maintenance or public publishing. Use a role acceptance record with: role from the table; named assignee; acceptance date; covered claims/files or publication route; correction intake and escalation recipient; and any gap requiring another owner. Names and acceptance dates remain pending until supplied. Reader sessions are recorded in REVIEW_BRIEF.md; this record concerns responsibility for maintaining the publication.

A revision starts when evidence relevant to a claim changes, a cited example/validator/citation/license changes materially, a link fails, a dated analysis needs new evidence, approved company facts change, or a reader reports a material misunderstanding or access barrier. A new upstream commit by itself does not replace pinned sources. Assess its relevance before revising an edition.

Capture the affected passage and claim ID, supplied evidence, severity, responsible role, disposition, and verification needed using the review brief's fields. Add a concrete task to the existing TODO when remediation needs work. Prioritize evidence/factual/rights errors, then comprehension or access failures, then optional depth. Recheck the affected sources and behavior; obtain relevant human feedback again when meaning or usability changes. Keep unresolved evidence visible.

After an accepted change, regenerate both formats, check their source and file identities, inspect substantive layout changes, and package a distinct revision. Preserve previous candidate archives and source-pinned evidence. Before any public update, obtain approval of the exact content/destination and verify the served artifact. Keep the short manuscript, evidence register, and longer outline aligned now; expand the long edition only after short review and priority selection. No monitoring schedule or analytics is created.

## Continuing the plan in ChatGPT

1. Read the milestone roadmap and task dependencies in TODO.md, then inspect the current Git branch, remote, and dirty state. Select the first unblocked Codex-owned task and preserve concurrent work. Use the existing task register and documents.
2. Keep the PDF-first short edition and confirmed narrative. Check current REVIEW_BRIEF identities against artifact sidecars and the archive before preparing a handoff. Preserve earlier captures and candidate archives. Expand the longer edition only after P06/L03.
3. Make one focused improvement using the authoritative source or actual feedback. Maintain claim/evidence mappings and uncertainty. Record human review only from real observations with the reviewer's scope; keep identifiable responses outside this public workspace.
4. Use relevant available tools and skills for the selected artifact. For rendered changes, run the existing build/export/browser/package workflow and visually inspect the PDF. For preparation changes, verify local references and record/tracker consistency. Reuse passing evidence tied to unchanged bytes rather than repeating unrelated checks.
5. Update the existing task and milestone status only when its completion criterion is met. Report the deliverable, verification, unresolved dependency, and next concrete action. The focused P15 commit/push/deployment is explicitly authorized and completed. Preserve unrelated work and do not infer authorization for future commits, outreach, or final-edition releases.

## Decisions and evidence still needed

The user selected hideouts-io as repository owner and now authorizes [hideouts-io/BN7](https://github.com/hideouts-io/BN7) for public draft review. The local origin remains https://github.com/hideouts-io/BN7.git on codex/public-playbook. The [repository publication review](research/repository-publication-review.json) records disclosure scope and the actual visibility/access result. Bridge-Node-7 remains the canonical upstream research account, and no source clone was modified. Git state in research/render-review.json records an earlier checkpoint; historical privacy labels do not override the new explicit visibility authorization.

Bryan's concrete review should assess the candidate's examples, tone, company scope, and engagement language within the chosen narrative and PDF-first format. The next factual gaps concern approved company identity/brief team information and the academic or technical collaboration BN7 wants to invite. Naming Bryan as reviewer does not authorize adding a public biography or credentials. Commercial figures and financing details remain outside this public guide unless supported wording is supplied and approved.

The bounded FMA baseline validator and changed-assumption comparison were executed successfully at the inspected source commit. Six expected impacts matched; both decisions remain HOLD, with provenance warnings retained. The evidence register links exact commands and outputs and separates those observations from scientific or operational validity. Named qualified review, representative-reader and assistive-technology feedback, and final-edition release remain separate tasks in TODO.md. The hideouts.io review draft is live under P15. Changes to bridgenode7.com remain excluded. Model editorial review and browser layout checks do not satisfy human or operational requirements.

## Web repair and design milestone

The existing renderer/build and local reading/navigation worked in real Chrome. The public BN7 repository has no Pages reading site; the original presumed hideouts-io.github.io/BN7/ URL returned “Site not found.” The user selected the existing hideouts.io Astro/GitHub Pages site instead. P12–P15 record the separate section’s preparation and authorized publication. The [public HTML reading copy](https://hideouts.io/bridgenode7/) and matching [primary PDF](https://hideouts.io/bridgenode7/Bridge-Node-7-Public-Playbook-Short.pdf) now return 200 with exact selected-revision bytes. The website README describes reproducible import/build and initial publication while preserving current software files. No change was made to bridgenode7.com.

The live homepage was fetched and inspected in Chrome at 1280 × 900 and 375 × 812. Its logo, fonts, background artwork, cards and motion are native HTML/CSS; no external logo/font/background assets load. The renderer embeds the reused brand stylesheet and data-SVG favicon. [Web design reference](research/web-design-reference.json) records source identity and measured matches; [web repair review](research/web-repair-review.json) records the current build, validation and revision identities. Earlier render-review records and immutable ZIP candidates remain preserved.

Necessary adaptations: a visible dated editorial-draft label and a Playbook navigation link; read/PDF controls; a sticky desktop contents panel that becomes a static mobile list; narrower long-form reading measure, underlined source links, wrapping two-column tables, six numbered process cards, and a Gallium panel. The decorative radial background uses the captured reference field heights independently of the longer manuscript so its glows remain in the same first-screen positions. The original gradient fills, logo, hero type, header sizing, orbital geometry, button treatments and footer styling are retained. The footer contact text uses opaque muted color to exceed the measured ordinary-text contrast threshold. Keyboard focus on the gold skip link uses a contrasting dark outline surrounded by a gold ring; reduced motion stops all decorative animation and transitions. The original hero's redundant closing tag was omitted so added controls remain inside its print-hidden section. The manuscript's title is visible in print, with the marketing hero hidden, preserving the concise primary PDF and its source links.

PUBLIC_PLAYBOOK.md is unchanged and authoritative. The source-tracing story, synthetic FMA example, dated Gallium snapshot, evidence limits, and references remain intact. The four-page PDF is tagged and retains all 23 distinct reference destinations (22 HTTPS URLs and one mailto route). Browser and model visual checks do not complete the pending named human or assistive-technology reviews.

PUBLIC_PLAYBOOK.md remains the authoritative source on codex/public-playbook. Website commit be69e428 publishes selected revision 2143be65c720-ea075aa99f53 on hideouts.io. Its preserving workflow adds exactly four BN7 files while retaining all 462 existing production files byte for byte. TODO P15 and research/web-repair-review.json record live verification. Unrelated continuation/business-development edits and separately staged reference gitlinks remain outside this publication commit. Final-edition approval remains separate.
