# Public playbook evidence register

Current revision: **r6**. Source review date: **2026-10-04**; C09's public citation was verified **2026-10-05**. These revision/source-date fields apply to every entry below unless an entry states otherwise. This is the current claim register; it replaces the earlier workplan's claim-matrix concept. It does not duplicate the research studies or publication TODO.

**Evidence meanings:** Observed source content means the cited files were inspected; it does not mean deployed software or real-world behavior was observed. Reported means a repository's own statement. Synthetic means fictional fixtures or declared example outcomes. Inferred means editorial synthesis with its basis stated. Tested is reserved for an executed, preserved run. Supported for drafting does not mean approved for public release.

The user's Bridge Node 7 role and authorization to use GitHub/website material for this playbook are established by their instructions. That permission is the working authorization; it is separate from licenses granted to public readers. Company mission and product intentions below are attributed statements. Customers, revenue, funding, partnerships, performance improvements, and commercial outcomes are not established by this research.

## C01 — Company purpose

**Exact proposed wording:** “Bridge Node 7 describes its work as evidence-to-decision infrastructure for frontier systems: helping technical teams see what is known, what remains assumed, what changed, and what an accountable person can justify now.”

**Status/class:** Supported for drafting; Reported mission, Observed source wording.

**Source/revision:** [Public profile README, lines 3–19](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/README.md#L3-L19).

**Scope/remaining proof:** Supports attributed positioning and intended value. Does not establish customers, operating scale, measured effectiveness, or market leadership. Company owner should review final positioning; quantitative benefit claims require measured evidence.

## C02 — Intended practical value

**Exact proposed wording:** “The aim is to make consequential reasoning easier to inspect and reconsider as evidence changes.”

**Status/class:** Supported as an aim; Inferred synthesis of documented purpose.

**Source/revision:** [Profile README, lines 9–32](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/README.md#L9-L32).

**Scope/remaining proof:** This is an objective, not a demonstrated reduction in time, risk, cost, or error. “Faster,” “safer,” or numerical improvement requires baseline comparisons, method, sample, conditions, and results.

## C03 — Common operating sequence

**Exact proposed wording:** “Start with one bounded decision question, gather and challenge the evidence, keep material unknowns visible, record a human decision, and reconsider it when conditions change.”

**Status/class:** Supported for drafting; Observed documented method.

**Source/revision:** [Decision Lifecycle, lines 9–54](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/docs/DECISION_LIFECYCLE.md#L9-L54).

**Scope/remaining proof:** The documented path is compositional: activate only useful layers. It is not evidence that every layer operates as one deployed system. Technical reviewer should confirm narrative consistency.

## C04 — Three reports, one provenance root

**Exact proposed wording:** “In a fictional Frontier Intelligence Workflows example, three reports trace to one originating statement. Repetition has not established independent corroboration; the example identifies the independent testing still needed.”

**Status/class:** Supported for drafting; Observed Synthetic example.

**Source/revision:** [FIW diligence example, lines 3–47](https://github.com/Bridge-Node-7/frontier-intelligence-workflows/blob/36366e96c12765e14d09965c1f82330194dfa8d3/examples/frontier-technology-diligence/README.md#L3-L47).

**Scope/remaining proof:** Teaches provenance and next evidence. It does not show a real company was false, validate a material, or recommend investment. An independently reproduced exercise is optional teaching evidence; preserve the fictional label.

## C05 — Limits of deterministic checks

**Exact proposed wording:** “A passing software check means the exercised rules passed for the supplied records. A file can match its recorded digital fingerprint while the claim it contains still lacks support. Source tracing, artifact integrity, reproduction, scientific validity, and system qualification answer different questions. For any reported result, ask which check ran, what records and assumptions it covered, and which question remains for a qualified reviewer.”

**Status/class:** Supported for drafting; Observed declared boundary, with Inferred editorial explanation and reader guidance.

**Source/revision:** [FIW limitations, lines 9–35](https://github.com/Bridge-Node-7/frontier-intelligence-workflows/blob/36366e96c12765e14d09965c1f82330194dfa8d3/LIMITATIONS.md#L9-L35), [ACA validation boundary, lines 92–98](https://github.com/Bridge-Node-7/ai-cyber-assurance/blob/9033bf73bbd3923c5de0a9c6fb9959b4c140de64/13-assurance-intelligence/README.md#L92-L98), [FMA verification and scientific boundary, lines 73–83](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/docs/ARCHITECTURE.md#L73-L83), [portfolio human-authority boundary, lines 160–173](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/docs/FRONTIER_ASSURANCE_ARCHITECTURE.md#L160-L173).

**Scope/remaining proof:** Applies to named checks within declared contracts. The digital-fingerprint sentence is a simplified illustration of hash matching, not a new executed check or authentication claim; the reader questions are editorial guidance derived from the documented boundaries. `NO_FINDINGS` and `PASS` have distinct meanings. Do not collapse them into “verified.” Final examples must name their exact check and result scope.

## C06 — FMA preserves a decision basis

**Exact proposed wording:** “Frontier Mission Assurance connects claims, assumptions, evidence, dependencies, and decisions so reviewers can examine what a changed condition affects.”

**Status/class:** Supported for drafting; Observed implementation and Reported purpose.

**Source/revision:** [FMA README, lines 7–30](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/README.md#L7-L30), [dependency traversal, analysis.py lines 46–62](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/src/frontier_assurance/analysis.py#L46-L62).

**Scope/remaining proof:** Traverses declared relationships; authoritative source systems remain authoritative. No completeness, scientific sufficiency, operational adoption, or integration-performance claim is supported. The bounded synthetic validator/comparison evaluation is recorded in C09; it does not establish the whole FMA runtime or operational integration.

## C07 — The flagship baseline already holds

**Exact proposed wording:** “The fictional neutral-atom example begins on HOLD because a decision-gating evidence condition is declared rather than established.”

**Status/class:** Supported for drafting; Observed Synthetic receipt and Tested synthetic baseline validation.

**Source/revision:** [Baseline decision receipt, lines 1–14](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline/decision-receipt.yaml#L1-L14).

**Scope/remaining proof:** This is the fixture's recorded disposition, not a decision by this project or an assessment of actual quantum hardware. Avoid a before/after “approved to rejected” story: the baseline was already HOLD.

## C08 — Changing an assumption reopens its consequences

**Exact proposed wording:** “The fictional movement-loss assumption changes from baseline to degraded. The locally evaluated comparison flagged the reused estimate as stale, identified evidence outside its declared conditions, flagged expert review for reopening, and indicated that the decision requires reconsideration.”

**Status/class:** Supported for drafting; Observed Synthetic data and code, plus Tested synthetic comparison at the exact source commit in C09.

**Source/revision:** [Baseline assumption, lines 13–19](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline/system-concept.json#L13-L19), [changed assumption, lines 13–19](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/profiles/ftqc-assurance/examples/synthetic-neutral-atom/changed-assumption-case/system-concept.json#L13-L19), [comparison logic, lines 171–275](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/scripts/compare_ftqc_cases.py#L171-L275).

**Scope/remaining proof:** Impact derives from the supplied contracts and graph; it supplies no replacement engineering answer, hardware result, independent V&V, or action authority. The C09 evaluation supplies bounded observed execution evidence. The input fixture remains unchanged; its review_state still reads CURRENT while comparison logic flags the reused estimate stale. governance_review_required is false and must not be described as a governance authorization or mandatory governance review.

## C09 — Fresh local synthetic evaluation

**Exact proposed wording:** “A local evaluation of the supplied synthetic case validated the baseline records with provenance warnings while the decision remained HOLD. The changed-case comparison produced the expected stale-estimate, evidence-applicability, expert-review, and decision-reopening signals.”

**Status/class:** **Tested synthetic evaluation; supported for drafting.** Two repository-runtime commands ran on October 4, 2026; both exited 0 and returned PASS. The baseline and changed-case dispositions remain HOLD. This is validator/comparison execution, not an estimator run or FMA research-receipt reproduction.

**Source/revision:** FMA source 0.11.2 at commit `f99dd2174c74f26b648321e02f8d30e2cff10230`; this inspected HEAD differs from published v0.11.2. [Expected comparison assertions](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/tests/test_ftqc_case_compare.py#L44-L58). Retained run evidence: [evaluation result](fma-evaluation/RESULT.md), [baseline command/streams](fma-evaluation/baseline-validation.command.json), [comparison command/streams](fma-evaluation/changed-assumption-comparison.command.json), [verified expectations and hashes](fma-evaluation/verification.json), and pinned dependencies in [requirements](fma-evaluation/requirements-ftqc-evaluation.txt). The short manuscript links directly to the [public result pinned at BN7 commit 29162f3](https://github.com/hideouts-io/BN7/blob/29162f3fcdda61a774ed89ecd1f464e95c2b0aa4/research/fma-evaluation/RESULT.md).

**Observed scope:** Python 3.11.16 arm64 in an isolated venv. All six checked-in changed-impact expectations matched. MODEL-RESOURCE-001 is computed stale; three evidence records fall outside declared conditions; EXPERT-REVIEW-001 is flagged for reopening; DECISION-001 is impacted with decision_reopen_required=true. governance_review_required=false. Warnings identify four fixture evidence records without source/provenance fields. The baseline has two declared applicability gates; its checked-in receipt rationale mentions one. Preserve this source inconsistency rather than imposing a count in public prose.

**Custody and correction:** Source HEAD and all tracked bytes remain unchanged; clone remains clean. An additional logging-wrapper check initially used the wrong identifier ENVELOPE-RESOURCE-001. The initial failed wrapper record is preserved in evaluation.json and its corrected verification is separate. Neither FMA command failed, and their outputs were not modified or rerun to conceal the wrapper error.

**Remaining proof:** No replacement engineering estimate, quantum-hardware result, independent scientific validation, operational outcome, full test suite, release-asset equivalence, or named expert signoff is established. Preserve the synthetic and source-commit boundaries.

## C10 — Gallium public-source sidebar

**Exact proposed wording:** “Materials-to-Mission includes GA-001, an August 10, 2026, v1.0.0 public-source Gallium snapshot. It organizes official-source evidence about supply dependence and domestic recovery activity.”

**Status/class:** Supported as repository-content description; Observed snapshot metadata and Reported bounded interpretation.

**Source/revision:** [GA-001 README, lines 1–39](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/public-snapshots/gallium/GA-001/README.md#L1-L39).

**Scope/remaining proof:** Supports the existence/date of the example and its stated scope, not current market conditions. Specific policy, supply, production, or award figures require fresh review of the original primary sources before reuse. Avoid figures in the short sidebar unless verified.

## C11 — Public evidence leaves qualification unknown

**Exact proposed wording:** “GA-001 separates supported material evidence from an unresolved question about qualified domestic primary recovery at a relevant scale. Later application context does not close that gap.”

**Status/class:** Supported for drafting; Observed documented evidence boundary.

**Source/revision:** [GA-001 first unresolved link, lines 60–65](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/public-snapshots/gallium/GA-001/public-view.json#L60-L65), [GA-001 scope and limits, lines 8–22 and 35–41](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/public-snapshots/gallium/GA-001/README.md#L8-L41), [M2M maturity, lines 5–23](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/docs/MATURITY_AND_PROOF.md#L5-L23).

**Scope/remaining proof:** M2M identifies itself as an experimental public method. This is not a supplier assessment, acquisition decision, certification, or completed commercial case. Stronger claims require independently reviewable applications/outcomes.

## C12 — FDE frames, compares, and records

**Exact proposed wording:** “Frontier Decision Engine can organize ordinary-language context into a working brief, support an optional bounded comparison, and record an accountable person's decision and next action.”

**Status/class:** Supported as documented implementation; Observed source, runtime UX not freshly tested.

**Source/revision:** [FDE architecture, lines 7–43](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/docs/ARCHITECTURE.md#L7-L43), [method sequence, lines 5–15](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/docs/METHODOLOGY.md#L5-L15).

**Scope/remaining proof:** Framing uses bounded textual patterns. Default runtime has no remote AI inference or external fact retrieval. Novice usability, live deployment parity, and completion-time claims require observation; describe no automated research capability.

## C13 — Comparison numbers remain assumptions

**Exact proposed wording:** “FDE's comparison uses explicit user or analyst assumptions. Its scores are not probabilities or empirical forecasts, and a leading choice is separate from assurance posture and authorization.”

**Status/class:** Supported for drafting; Observed method boundary.

**Source/revision:** [FDE methodology, lines 17–23](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/docs/METHODOLOGY.md#L17-L23).

**Scope/remaining proof:** Describes interpretation of the declared comparison, not recommendation accuracy. Any numerical worked example must label assumptions, rationale, evidence limits, and sensitivity; outcome claims need measured proof.

## C14 — Human receipt and integrity limits

**Exact proposed wording:** “A Decision Receipt preserves the accountable person's choice, rationale, next action, and remaining uncertainty. The attestation does not independently verify identity or grant organizational or legal approval.”

**Status/class:** Supported for drafting; Observed receipt contract/implementation.

**Source/revision:** [FDE receipt boundaries, lines 19–37](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/docs/DECISION_RECEIPTS.md#L19-L37), [recording implementation, lines 102–160](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/site/src/lib/recording.js#L102-L160).

**Scope/remaining proof:** Hash verification is separate from identity, approval, truth, and complete archive continuity. Final wording must not imply a digital signature or tamper-proof organizational ledger.

## C15 — ACA offers consistent communication views

**Exact proposed wording:** “AI Cyber Assurance can represent one bounded assurance case and generate a Decision Receipt, Assurance Passport, and Executive Summary from that same record.”

**Status/class:** Supported as source capability; Observed renderer and documentation, execution not freshly tested.

**Source/revision:** [ACA canonical views, lines 27–37](https://github.com/Bridge-Node-7/ai-cyber-assurance/blob/9033bf73bbd3923c5de0a9c6fb9959b4c140de64/13-assurance-intelligence/README.md#L27-L37), [renderer, lines 267–284](https://github.com/Bridge-Node-7/ai-cyber-assurance/blob/9033bf73bbd3923c5de0a9c6fb9959b4c140de64/scripts/render_assurance_outputs.py#L267-L284).

**Scope/remaining proof:** Generated views are communication artifacts. They do not certify real controls or create three decisions. Do not confuse ACA's receipt vocabulary with FDE's separate receipt contract or imply automatic interchange.

## C16 — ACA's synthetic agent example preserves unknowns

**Exact proposed wording:** “A fictional supplier-research agent example records excess authority, corrective actions, and retest while preserving an Unknown item in its earlier logging evidence.”

**Status/class:** Supported for drafting; Observed Synthetic case, not an executed real-agent result.

**Source/revision:** [ACA fictional scenario, lines 7–36](https://github.com/Bridge-Node-7/ai-cyber-assurance/blob/9033bf73bbd3923c5de0a9c6fb9959b4c140de64/10-examples/synthetic-ai-agent-assurance/README.md#L7-L36), [closure prerequisites, validator lines 393–426](https://github.com/Bridge-Node-7/ai-cyber-assurance/blob/9033bf73bbd3923c5de0a9c6fb9959b4c140de64/scripts/validate_assurance_case.py#L393-L426).

**Scope/remaining proof:** Illustrates structured accountability and closure conditions. Real permission enforcement, logging, revocation, and recovery need authorized executed tests; simulated records cannot establish production effectiveness.

## C17 — Quantum planning separates critical inputs

**Exact proposed wording:** “Quantum Readiness for Space Communications separates exposure, migration capability, evidence confidence and coverage, and critical conditions so progress in one area cannot erase a serious gap elsewhere.”

**Status/class:** Supported for drafting; Observed documented planning method.

**Source/revision:** [Quantum methodology, lines 5–38](https://github.com/Bridge-Node-7/quantum-readiness-space-communications/blob/0f926377de268b20c2b1223eaf830405b8eb3648/docs/methodology.md#L5-L38), [limitations, lines 3–18](https://github.com/Bridge-Node-7/quantum-readiness-space-communications/blob/0f926377de268b20c2b1223eaf830405b8eb3648/KNOWN_LIMITATIONS.md#L3-L18).

**Scope/remaining proof:** Documentation-first framework; no cryptographic implementation, hardware testing, certification, or flight suitability proof. Fresh laws/standards applicability verification is required before adding dates or compliance statements. Source version 0.2.4 is distinct from its documented published 0.2.3 milestone.

## C18 — Pax Silica is a dated public-source implementation

**Exact proposed wording:** “Pax Silica Intelligence presents a dated public-source snapshot with separately inspectable sources, claims, analysis, and unknowns.”

**Status/class:** Supported for drafting; Observed repository data/rendering; current deployment not attested here.

**Source/revision:** [Pax evidence and trust boundary, lines 17–36](https://github.com/Bridge-Node-7/pax-silica/blob/2f62f678d06f8444ddc7788ce03e1f1f46cf4cba/README.md#L17-L36), [review boundary, data lines 1–22](https://github.com/Bridge-Node-7/pax-silica/blob/2f62f678d06f8444ddc7788ce03e1f1f46cf4cba/data/pax-silica.json#L1-L22).

**Scope/remaining proof:** Corpus snapshot is 2026-09-29. This is not a live feed, government affiliation, qualification, or policy authority. Verify original sources for time-sensitive details; check live identity before embedding screenshots or asserting current website behavior.

## C19 — Connected responsibilities, bounded interoperability

**Exact proposed wording:** “The public portfolio assigns distinct responsibilities to research workflows, assurance, dependency analysis, and human decision preparation. Portable records retain their evidence and authority limits when moved between systems.”

**Status/class:** Supported as documented architecture; Observed contracts, Inferred reader-facing portfolio explanation.

**Source/revision:** [Architecture authority map and contracts, lines 42–75](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/docs/FRONTIER_ASSURANCE_ARCHITECTURE.md#L42-L75), [M2M lossy projection and conformance boundary, lines 15–64](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/docs/FMA_INTEROPERABILITY.md#L15-L64).

**Scope/remaining proof:** Names and portable-contract conformance do not establish that the entire portfolio is a deployed integrated pipeline. Source M2M remains authoritative after lossy projection. Exact-version end-to-end compatibility requires its own executed receipt; direct M2M import into FDE is not established.

## C20 — Business evidence remains unestablished

**Exact proposed wording:** “This guide introduces the public methods and reference implementations. Company-specific commercial and impact claims require separately supplied, approved evidence.”

**Status/class:** Supported research boundary; Unknown business facts. No positive customer, revenue, funding, traction, affiliation, or impact assertion is authorized by this register.

**Source/revision:** [Public-reference scope, profile README lines 64–72](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/README.md#L64-L72), [M2M stronger-maturity evidence boundary, lines 5–23](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/docs/MATURITY_AND_PROOF.md#L5-L23), [FMA public-example boundary, README lines 13–17](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/README.md#L13-L17).

**Scope/remaining proof:** Absence from examined sources is not proof no customers or outcomes exist. Obtain company-approved facts and supporting records, plus permission to name counterparties where material. Public code, mission language, synthetic results, and source reuse authorization cannot substitute for business evidence.

## C21 — Published engagement and inquiry routes

**Exact proposed wording:** “The partner page describes Strategic Resilience Assessments, mission pilots, technical collaboration, research programs, and strategic opportunities. Begin with a non-confidential overview at contact@bridgenode7.com and follow the published privacy guidance.”

**Status/class:** Supported as attributed public website wording; Observed source content. Covers the manuscript's “Learn more or begin a conversation” section and privacy paragraph.

**Source/revision:** [Partner page](https://bridgenode7.com/partner/) and [privacy guidance](https://bridgenode7.com/privacy/), captured October 4, 2026. The [snapshot manifest](website-snapshots/manifest.json) binds retrieved URLs, times, response status, hashes, and local files `01-partner.html` and `08-privacy.html`; the [website study](website-study.md#page-by-page-findings) describes their bounded scope.

**Scope/remaining proof:** Establishes advertised engagement categories, inquiry address, and public handling guidance. Does not establish delivery capacity, a completed engagement, prices, timelines, customer outcomes, email delivery, or permission to contact anyone. Final company wording remains U03; commercial evidence remains C20.

## C22 — Website seven-domain positioning

**Exact proposed wording:** “Bridge Node 7's public website presents Quantum Technology, AI Governance, Critical Materials, Supply Chain, Space Systems, Information Trust, and Mission Assurance as its seven-domain model.”

**Status/class:** Supported as attributed public positioning; Observed source labels. Covers the website-style HTML hero, rather than an additional manuscript capability claim.

**Source/revision:** [Homepage](https://bridgenode7.com/), captured October 4, 2026 as `00-home.html` in the [snapshot manifest](website-snapshots/manifest.json). The later [design reference](web-design-reference.json) records the same homepage source identity and the reading-copy adaptations.

**Scope/remaining proof:** Domain labels describe the brand's breadth; they do not establish seven shipped products, uniform maturity, operational deployments, partnerships, or complete domain coverage. Implementation claims remain bounded by C12–C19 and the referenced repositories.
