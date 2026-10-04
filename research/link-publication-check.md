# Source links, citation, and publication boundary

**Reviewed October 4, 2026 · Standalone playbook deliverables only**

The current manuscript and evidence-register links are accessible. The actionable issue is citation identity: a source version number can match a published release while referring to different bytes. Preserve the inspected commit in citations and evaluation records.

The user has selected the evidence-to-decisions narrative and explicitly excluded website changes. Website integration and source/deployment discovery are excluded. The earlier proposed `bridgenode7.com/playbook/` destination is superseded; a website source checkout or publisher is not a prerequisite for completing standalone HTML/PDF deliverables. No commits, pushes, deployments, uploads, emails, or remote changes were performed for this check.

## Live link results

[link-checks.json](link-checks.json) holds requested/final URLs, HTTP status, retrieval dates, redirects, response hashes, source occurrences, pinned local checks, and refreshed release/tag metadata. The checked manuscript, evidence register, and prior website study are identified by SHA-256 so later edits are distinguishable.

- All **71 unique HTTPS destinations** returned **200**, with **no redirects**. This includes all manuscript destinations, register references, nine website reading surfaces, present citation/use files, and published-release routes. Fragment variants share one network fetch.
- All **57 pinned local references** exist at their exact cloned HEAD; every requested line range is valid. This count includes repeated references and citation/use routes. The corrected `profiles/scientific-discovery` directory exists.
- All **eight pinned manuscript file bodies** match their remote raw GitHub source bytes by SHA-256. The ninth pinned manuscript reference is a directory and was checked for local presence and live URL access rather than byte equality.
- The contact address matches the live home/partner/privacy pages. Its `mailto:` link was inspected; no message was sent or mail delivery tested.
- Latest-release metadata and tag-to-commit resolution were refreshed for the seven implementation repositories. Results agree with the earlier source inventory. The profile repository's previously recorded absence of releases was not separately refreshed in this pass.

These checks establish availability and exact referenced file identity. A 200 response does not establish accessibility, successful interactive behavior, current factual accuracy, ownership, or software effectiveness. No website application or external business facts were validated by opening links.

## Exact source versus published release

None of the seven inspected implementation HEADs equals its latest published release commit. Even identical version labels need the commit qualifier. The full SHA values and refreshed release-object chains are in the structured check.

| Reference | Inspected source version / short commit | Latest published release checked | Citation route and implication |
| --- | --- | --- | --- |
| AI Cyber Assurance | 0.6.1 / `9033bf73` | [v0.6.1](https://github.com/Bridge-Node-7/ai-cyber-assurance/releases/tag/v0.6.1) | No `CITATION.cff` in the inspected clone. Cite repository plus exact inspected commit; matching version labels do not identify the same source. |
| Frontier Decision Engine | 0.5.16 / `4a913756` | [v0.5.14](https://github.com/Bridge-Node-7/frontier-decision-engine/releases/tag/v0.5.14) | [CITATION.cff](https://github.com/Bridge-Node-7/frontier-decision-engine/blob/4a913756d00cdd321da04bf7350507e571f2f2dd/CITATION.cff#L1-L9) describes source 0.5.16 and asks for software and dataset/case identity. Do not label it the published 0.5.14 artifact. |
| Frontier Intelligence Workflows | 0.9.0 / `36366e96` | [v0.9.0](https://github.com/Bridge-Node-7/frontier-intelligence-workflows/releases/tag/v0.9.0) | No `CITATION.cff` in the inspected clone. Cite exact commit for the inspected source and separately label the fictional case. |
| Frontier Mission Assurance | 0.11.2 / `f99dd217` | [v0.11.2](https://github.com/Bridge-Node-7/frontier-mission-assurance/releases/tag/v0.11.2) | [CITATION.cff](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/CITATION.cff#L1-L10) asks for the exact release used. The inspected maintenance HEAD differs from the release; cite its exact commit and source version rather than claiming release-byte evaluation. |
| Materials-to-Mission | 0.7.6 / `2a8d26af` | [v0.7.5](https://github.com/Bridge-Node-7/materials-to-mission/releases/tag/v0.7.5) | [CITATION.cff](https://github.com/Bridge-Node-7/materials-to-mission/blob/2a8d26af86e8adb8b1e34550045782d1a20418a4/CITATION.cff#L1-L10) describes source 0.7.6. GA-001 has its own snapshot version/date; keep toolkit, commit, and snapshot identities separate. |
| Pax Silica Intelligence | 0.3.3 / `2f62f678` | [v0.3.2](https://github.com/Bridge-Node-7/pax-silica/releases/tag/v0.3.2) | No `CITATION.cff` in the inspected clone. Cite exact source commit and dated corpus boundary; do not describe it as a live feed. |
| Quantum Readiness for Space Communications | 0.2.4 / `0f926377` | [v0.2.3](https://github.com/Bridge-Node-7/quantum-readiness-space-communications/releases/tag/v0.2.3) | [CITATION.cff](https://github.com/Bridge-Node-7/quantum-readiness-space-communications/blob/0f926377de268b20c2b1223eaf830405b8eb3648/CITATION.cff#L1-L14) expressly distinguishes tagged-release citation from unreleased commit citation. Follow that distinction. |

The profile's [canonical-source statement](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/README.md#L74-L83) identifies the public GitHub account and website. GitHub's account metadata identifies `Bridge-Node-7` as a **User** account; the private working repository owner is the separately selected `hideouts-io`. These identities must not be conflated.

## Reuse routes and reader guidance

The user's authorization to use Bridge Node 7 material for this playbook is established. Public readers receive the rights granted by each source's own terms; a research link or citation does not create an additional license.

- The profile's [LICENSE](https://github.com/Bridge-Node-7/Bridge-Node-7/blob/3f959138f3252b16bc69dabf178bdde83a606a3b/LICENSE#L1-L11) reserves original documentation rights.
- FMA's [LICENSE](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/LICENSE#L1-L7) and [Use and Evaluation](https://github.com/Bridge-Node-7/frontier-mission-assurance/blob/f99dd2174c74f26b648321e02f8d30e2cff10230/docs/USE_AND_EVALUATION.md#L3-L21) describe evaluation/review scope and the route for additional rights. The manuscript's current link to that guide is live.
- FDE carries Apache-2.0; FIW, ACA, M2M, Pax, and Quantum carry MIT notices at the inspected revisions. All eight LICENSE routes were checked. Preserve source notices when copying substantial licensed material.
- Pax's [NOTICE](https://github.com/Bridge-Node-7/pax-silica/blob/2f62f678d06f8444ddc7788ce03e1f1f46cf4cba/NOTICE#L1-L6) separately reserves identity/marks and states non-affiliation. Describing BN7's own work does not imply government endorsement.

The academic reading sentence should distinguish the **source actually examined** from an available release. A compact standalone source note can say that commit-pinned references identify this edition's inspected sources; a reader running a tagged distribution should cite that distribution instead. The existing manuscript already uses exact commits for material examples, so no broken-link correction is needed.

## Website reading routes and final publication implications

The home, partner, materials Atlas, neutral-atom FTQC, FMA landing, FDE entry, Genesis, Golden Age, and privacy routes remain accessible as reading references. The live [partner page](https://bridgenode7.com/partner/) supports the listed inquiry categories and non-confidential overview. The live [privacy guidance](https://bridgenode7.com/privacy/) supplies the public/sensitive-channel boundary and attributes site delivery to GitHub Pages. Public hosting observations do not identify an editable source checkout or prove deployment authority; neither is needed under the user's current scope.

No actionable broken URL, redirect, or missing pinned source was found. The publication work that remains is to preserve exact source identities, choose the approved standalone sharing destination, include citation/use routes appropriate to the audience, and recheck availability after any manuscript link changes. The prior website study's source-discovery/integration gap is historical and no longer a publication gate. The proposed `/playbook/` website path must remain excluded from current plans.
