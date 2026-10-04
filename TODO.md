# BN7 public playbook TODO

**Current state: eight bounded repository studies and nine-page website review complete; 1,454-word short manuscript, responsive HTML, four-page PDF, and standalone review archive prepared. Bounded synthetic FMA validation/comparison, live source checks, and practical presentation checks passed. Private hideouts-io/BN7 is connected; the user authorized commit and push on October 4, 2026, using codex/public-playbook. Human reviews, assistive-technology review, and standalone public distribution remain open. Website changes are excluded by user instruction. Updated October 4, 2026.**

This is the single task register for the project. [PUBLIC_PLAYBOOK.md](PUBLIC_PLAYBOOK.md) is the short public manuscript; [LONG_PLAYBOOK_OUTLINE.md](LONG_PLAYBOOK_OUTLINE.md) defines the longer edition. [PLAYBOOK_WORKPLAN.md](PLAYBOOK_WORKPLAN.md) holds editorial choices; the research folder holds evidence and source studies.

Checked tasks are complete only within the stated scope. **In progress** means work has begun; **open** means it has not met its acceptance criterion; **waiting** identifies a specific external answer or review; **excluded** means the user removed it from scope. Codex owns preparation and document checks. You own company facts, editorial choices, and release authorization. Named technical and academic reviewers will be assigned before publication.

## Decisions

| ID | Decision | Current state |
| --- | --- | --- |
| D1 | Owner of private GitHub repository BN7 | Confirmed: [hideouts-io/BN7](https://github.com/hideouts-io/BN7), private. Bridge-Node-7 remains the upstream research source. |
| D2 | Short-edition narrative | Confirmed by user: keep evidence-to-decisions, using the source-tracing story, changed-assumption example, and Gallium sidebar. |
| D3 | Lead example | Proposed: FMA's synthetic changed-assumption example, with a brief Gallium pathway sidebar. Source review passed; awaiting your choice of flagship. |
| D4 | Voice and visual treatment | Proposed: approachable technical prose, restrained diagrams, clear source links. Awaiting review of a concrete draft. |
| D5 | Length and format | Short candidate: 1,454 words, four-page PDF and standalone HTML. PDF-first versus HTML-first/only decision requested; answer pending. Long outline proposes 5,000–8,000 words plus linked references. |
| D6 | Standalone distribution and publisher | User excludes website changes. Prepare standalone PDF and local web preview; public distribution channel and responsible publisher remain to be chosen. |
| D7 | Public company facts | Company identity, team and engagement facts only when supplied and approved; financing details optional for the public guide. |
| D8 | Release approval | Pending review of exact content and publication changes. |

## 1. Private workspace and preservation

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] A01 | Read the attached brief and existing instructions. | Authorization and constraints understood: public/academia/partners/investors, short first, private working repo, no commits or public release without explicit request. | None. |
| [x] A02 | Preserve existing drafts before revision. | Byte-preserved baseline files and SHA-256 manifest in research/baseline/. | A01. |
| [x] A03 | Inspect local and authenticated Git state. | Local BN7 uses codex/public-playbook; origin is https://github.com/hideouts-io/BN7.git; gh is authenticated as hideouts-io. | A01. |
| [x] A04 | Select private repository owner. | D1 answered: hideouts-io owns BN7; Bridge-Node-7 supplies the upstream public sources. | A03 / D1. |
| [x] A05 | Create private BN7 and connect the local checkout. | hideouts-io/BN7 created; API confirms private=true and visibility=private; origin points to its HTTPS clone URL. Private commit/push now explicitly authorized. | A04. |
| [x] A06 | Define a small working file layout. | One manuscript per edition, one TODO, one editorial brief, evidence records, generated deliverables; clones excluded from BN7 tracking. Local render snapshot uses the same authored manuscript. | A02. |
| [x] A07 | Confirm review-state preservation. | Only intended files changed; original copies remain; repository stays private. The user authorized committing/pushing this review state; public release remains unapproved. | A02, A05–A06; remote and review state verified. |

## 2. Inventory and source acquisition

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] B01 | Inventory public repositories. | Eight public repositories identified from GitHub API, including the profile repository; raw inventory saved outside BN7 clones. | A01. |
| [x] B02 | Clone every public repository separately. | All eight clones under /Users/macbookpro/Codex/Any/BN7-sources; checkout succeeds without modifying remote sources. | B01. |
| [x] B03 | Record source identity and publication state. | source-inventory.json lists HEAD, version, source tree, license, release metadata, retrieval time, and clean status for every clone. | B02. |
| [x] B04 | Capture the main website surfaces. | Dated HTML snapshots and hashes for home, partner, Atlas, FTQC, FMA, FDE, policy context, and privacy; fetch failures remain explicit. | A01. |
| Excluded B05 | Identify website source and integration access. | Outside current scope: user does not want website changes. Existing website remains a read-only research source. | User decision / D6. |

## 3. Separate deep-study steps

Each study must examine relevant implementation or validators, examples, schemas/contracts, tests, validation/release records, limitations, and rights—not only its README. Its report names exactly examined paths and the scope of review. Completion means a bounded source study, not a full software/security audit or proof of operational use.

| Status / ID | Repository and research purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] R01 | Bridge-Node-7: establish public architecture and terminology. | Separate section in assurance-study.md covers users, lifecycle, authority map, source boundaries, and navigation. | B03. |
| [x] R02 | FMA: understand the flagship assurance behavior. | Separate section covers graph/receipt/change-impact implementation, three domain profiles, tests, examples, release and use boundaries. | B03. |
| [x] R03 | FDE: explain decision framing and comparison. | Separate section in decision-materials-study.md covers calculation/model, browser handling, receipt contracts, tests, pilot gates, and limits. | B03. |
| [x] R04 | Materials-to-Mission: trace material evidence to a decision. | Separate section covers Material Assurance Record, derived Passport, validation, HOLD/unknown behavior, interop, Atlas alignment, and M0 maturity. | B03. |
| [x] R05 | FIW: distinguish evidence from repeated claims. | Separate section in supporting-study.md covers source genealogy, uncertainty, review/reassessment, validator tests, fictional example, and limits. | B03. |
| [x] R06 | Pax Silica: understand reviewed public-source intelligence. | Separate section covers dated snapshot, data/UI/evidence drawer, sources, validation, and qualification/affiliation boundaries. | B03. |
| [x] R07 | AI Cyber Assurance: understand structured cyber-assurance cases. | Separate section covers templates, validator/control behavior, examples, tests, evidence obligations, and operational limits. | B03. |
| [x] R08 | Quantum Readiness: understand cryptographic transition planning. | Separate section covers assessment domains, evidence confidence, critical overrides, decision pack, validators/tests, and authorization limits. | B03. |
| [x] R09 | Website: compare messaging with implementation. | website-study.md records each inspected page, audience promise, source alignment, missing explanations, and accessible reader entry points. | B04, R01–R08. |
| [x] R10 | Consolidate an evidence register. | Every material short-draft claim maps to a source revision/date, evidence class, supported scope, limitation, and editorial status. | R01–R09. |
| [x] R11 | Resolve inconsistencies and unsupported connections. | Source/release differences, stale receipt wording, synthetic vs real cases, and exact-product compatibility gaps recorded without silently fixing source repos. | R10. |

## 4. Audience, positioning, and architecture

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] C01 | Compare three narrative directions. | Editorial brief explains strengths/tradeoffs and recommends one using source evidence. | R10 / D2. |
| [x] C02 | Define audience questions. | General-public, academic, partner, and investor reading needs identified; no investor-only organizing assumption. | C01. |
| In progress C03 | Select the main practical example. | Example has inspectable inputs, a decision question, a material change, outputs, and clear evidence limits. | R02–R04 / D3. |
| In progress C04 | Agree voice and terminology. | Explain new terms on first use, distinguish roles, use one consistent BN7 name; jargon and acronym review complete. | C02 / D4. |
| In progress C05 | Specify the two editions. | Short standalone manuscript and long expansion outline have agreed length, format, scope, and shared facts. | C01–C04 / D5. |
| [x] C06 | Establish one source per technical topic. | Manuscripts link authoritative repo details; do not duplicate specifications or create competing architectural authority. | R10, C05. |

## 5. Short edition—the first deliverable

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] S01 | Write an opening that makes the problem concrete. | A newcomer can explain what BN7 does and why revisiting a decision matters after the opening. | C01. |
| [x] S02 | Connect the work into one coherent story. | Intelligence → domain evidence → assurance → human decision → reassessment explained with public implementation limits. | R10, C06. |
| [x] S03 | Write the flagship example precisely. | Synthetic state clearly labeled; baseline posture and changed-state effects agree with fixtures/code, without invented approval or performance. | C03. |
| [x] S04 | Add one accessible real-source sidebar. | Gallium or another approved example illustrates the evidence boundary, with source date and unresolved link visible. GA-001 is dated August 10, 2026, v1.0.0. | R04, R09 / D3. |
| [x] S05 | Explain what a reader can explore now. | Short guided routes link examples, tools, methods, and correct evaluation/use terms. | R10. |
| [x] S06 | Give academia a useful entry point. | Methods, reproducibility distinctions, citation/reuse routes, and potential research questions are understandable and bounded. | C02, R10. |
| [x] S07 | Give partners and investors appropriate context. | Engagement route and evidence questions are useful; company/traction claims appear only if supplied and approved. | C02 / D7. |
| [x] S08 | Add useful visual explanation. | One simple process or changed-state diagram has readable labels and an equivalent text explanation. | S02–S03 / D4. |
| [x] S09 | Complete short-manuscript editorial review. | Model editorial/source review passed for the current manuscript, including observed synthetic runtime scope, provenance warnings, source/release identity, snapshot date, and terminology. Named human review remains V06/P04–P05. | S01–S08. |

## 6. Evidence and technical validation

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] V01 | Choose a bounded software demonstration. | Invocation and dependencies inspected before execution; only declared synthetic/public inputs used in a project environment. | C03. |
| [x] V02 | Execute and preserve the chosen demonstration. | Baseline validator and changed-case comparison exited 0 at source f99dd2174c74f26b648321e02f8d30e2cff10230 in an isolated Python environment with declared dependencies. Exact commands, environment, versions, outputs, warnings, and hashes preserved in research/fma-evaluation/. Initial capture-wrapper identifier error and corrected verification are retained. | V01. |
| [x] V03 | Compare prose with actual outputs. | All six fixture impact expectations matched; both decisions remain HOLD. Prose distinguishes computed staleness and review-reopening signals from actual human review, hardware validity, or outcomes. C09 and RESULT.md record warnings and scope. | S03, V02. |
| [x] V04 | Check each material factual claim. | Evidence register points to exact sources; estimates, hypotheses, and unknowns retain explicit status. | S09, R10. |
| [x] V05 | Check citations and academic usability. | 71 unique HTTPS destinations returned 200; 57 pinned local references/ranges valid; eight manuscript file bodies matched remote pinned bytes. Published release/tag identities checked for seven implementation repositories. Manuscript distinguishes inspected source commit from published release identity and guides packaged evaluations to cite the distribution actually used. Evidence in research/link-checks.json. | V04. |
| Open V06 | Obtain qualified technical review. | REVIEW_BRIEF.md prepared with exact candidate identities and scope; user asked to identify reviewer. Named reviewer must assess accuracy and scope; actionable feedback resolved or recorded. Model review does not satisfy signoff. | V03–V05. |

## 7. Presentation, reader testing, and accessibility

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] P01 | Prepare an accessible web-first preview. | Generated from the short manuscript, with semantic headings, readable line lengths, descriptive links, and responsive layout. | S09 / D5. |
| [x] P02 | Prepare a printable derivative if selected. | Same review manuscript; four-page tagged Letter PDF rendered and every page visually inspected. Final PDF must be regenerated from approved source. | P01 / D5. |
| [x] P03 | Inspect practical rendered presentation. | Final Chromium checks pass at 1280, 375, and 320 CSS pixels, keyboard skip, fragments, reduced motion, computed contrast/focus, and table structure. All four final PDF pages visually inspected; all 23 distinct manuscript reference URLs retained. Native zoom observations are scoped in render-review.json; assistive-technology review remains P07. | P01–P02. |
| Open P04 | Test with public and academic readers. | REVIEW_BRIEF.md defines sessions/questions; names requested and pending. Real readers must explain BN7's purpose, the example, its limits, and a next step; confusing language recorded. | P03. |
| Open P05 | Test with a prospective partner/investor reader. | REVIEW_BRIEF.md prepared; name requested and pending. Reader must separate existing evidence from business hypotheses and identify the next diligence/engagement step. | P03. |
| Open P06 | Revise and freeze the review candidate. | Reader/technical feedback addressed; source and generated artifacts correspond; open decisions visible privately. | V06, P04–P05. |
| Open P07 | Review assistive-technology use. | A named reviewer checks HTML with a screen reader and PDF tag/reading order, headings, links, and table navigation; actual platform/results and unresolved barriers recorded. Automated structure checks are not usability proof. | P03; resolve before U04. |

## 8. Longer edition—outline now, expansion later

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| [x] L01 | Outline the long edition. | LONG_PLAYBOOK_OUTLINE.md defines chapters, questions, sources, diagrams/examples, and missing evidence without drafting the full edition. | C05, R10. |
| [x] L02 | Map shared content and deeper material. | Shared core claims reuse the evidence register; expansion covers architecture, methodology, domain cases, evaluation, limits, and references. | L01. |
| Open L03 | Confirm expansion priorities after short review. | You select the depth and sequence based on the short deliverable; avoid expanding every repo equally without reader need. | P06 / D5. |
| Open L04 | Draft and validate the longer edition. | Full chapters created only after short edition review; technical, source, accessibility, and reader checks repeated for added material. | L03. |
| Open L05 | Approve and publish the longer edition. | Exact long content and destination approved; short edition remains a useful standalone route. | L04 / D8. |

## 9. Publication preparation and launch

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| Open U01 | Confirm standalone source and distribution channel. | BN7 manuscript owns the narrative; final PDF/public file host and responsible publisher selected. No website edits or private research published. | P06 / D6. |
| In progress U02 | Prepare standalone publication package. | Review ZIP contains only the short manuscript, PDF, self-contained HTML, and hash manifest; private research/TODO/brief excluded. Final approved source, preferred format, distribution destination, and delivery instructions remain pending. | Candidate prepared from P03; final package depends on U01. |
| Open U03 | Review company facts and final public scope. | You confirm factual wording, proposed-service labels, source handling, and public content; prior authorization for material reuse is not re-requested. | V04, U02 / D7. |
| Open U04 | Verify launch candidate. | Approved source/preview match; source links, navigation, accessibility, mobile, print, titles/description, and published contact route checked. Email delivery is outside current checks; no outreach performed. | U02–U03, P07. |
| Open U05 | Obtain explicit public-release authorization. | You approve exact public content/destination. Private BN7 commit/push is authorized; any later public-repository or deployment actions require their own authorization. | U04 / D8. |
| Open U06 | Publish the approved short edition. | Approved standalone artifact distributed through the selected channel; no website changes, private workplan, raw research, or confidential diligence published. | U05. |
| Open U07 | Verify the live release. | Chosen public download/share route serves intended version and working references; artifact hashes/version recorded. Website reciprocal links are outside scope. | U06. |

## 10. Maintenance

| Status / ID | Task and purpose | Deliverable and completion criterion | Depends on / decision |
| --- | --- | --- | --- |
| Open M01 | Assign maintenance ownership and triggers. | Named editor reviews relevant source releases, evidence changes, corrections, and approved company facts; no automation created without request. | U07. |
| Open M02 | Define corrections and revision handling. | Readers can report corrections; material changes receive source review; historical releases remain attributable. | M01. |
| Open M03 | Keep short and long versions aligned. | Shared claims remain consistent while each edition preserves its intended depth. | L05, M01. |
| Open M04 | Evaluate usefulness after launch. | Approved qualitative feedback or permitted measurements assess understanding and engagement; any analytics change requires its own decision. | U07. |

## First review package

The private review workspace contains the short manuscript, its rendered formats, longer outline, evidence register, studies, human-review brief, and this TODO. The standalone artifact archive contains only the short manuscript, rendered formats, and file identity manifest. Both remain review candidates until the named human reviews and publication decisions are complete.

## Concrete review package and remaining gates

The user confirmed the evidence-to-decisions narrative; the short draft retains it. Its 1,454 words serve public, academic, partner, and investor readers. The long edition has ten planned chapters and remains an outline. Original drafts and clone working trees are preserved. The private hideouts-io/BN7 repository is connected, and its commit/push is explicitly authorized. Public deployment remains unapproved. The Git counts in research/render-review.json describe the earlier timestamped review checkpoint.

Because the Documents workspace intermittently offloads files to iCloud, build inputs were copied to the local render snapshot at `/Users/macbookpro/Codex/Any/BN7-render`. The snapshot manuscript and canonical manuscript are checked by SHA-256 in `research/render-review.json`; this does not relocate the project or change cloud settings. The reliable generated review artifacts are:

- [Web review candidate](/Users/macbookpro/Codex/Any/BN7-render/output/web/index.html).
- [Four-page printable review candidate](/Users/macbookpro/Codex/Any/BN7-render/output/pdf/Bridge-Node-7-Public-Playbook-Short.pdf).
- [Browser check evidence](/Users/macbookpro/Codex/Any/BN7-render/output/verification/browser-checks.json).
- [Standalone review archive](/Users/macbookpro/Codex/Any/BN7-render/output/package/Bridge-Node-7-Public-Playbook-Review.zip).
- [Human-review brief](REVIEW_BRIEF.md) and [synthetic evaluation result](research/fma-evaluation/RESULT.md).

D1 and D2 are resolved. D3–D5 concern the concrete draft and design; the pending format/reviewer questions guide the next review. B05 and website changes are excluded; D6 selects a standalone distribution channel. V02–V03 and V05 are complete within their bounded scope. V06 and P04–P07 remain human-review/revision steps. Public release waits for U01–U05.
