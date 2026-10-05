# BN7 public-playbook review workspace

This repository presents Bridge Node 7's draft public playbook, editorial preparation, and supporting research for review. The owner has authorized public repository access. The short edition remains an **editorial review draft**; human review and final-edition approval are pending. Changes to bridgenode7.com are outside scope.

Start with the [short playbook](PUBLIC_PLAYBOOK.md), then the [Questions for Bryan](REVIEW_BRIEF.md#questions-for-bryan). The matching [HTML reading copy](https://hideouts.io/bridgenode7/) and [primary PDF](https://hideouts.io/bridgenode7/Bridge-Node-7-Public-Playbook-Short.pdf) are publicly available as **editorial review drafts** on hideouts.io. Revision 2143be65c720-ea075aa99f53 is served unchanged in an independent section outside the software navigation, catalog, search, and sitemap. The section is unlinked but public and crawlable. Local previews at http://127.0.0.1:4173/ and http://127.0.0.1:4388/bridgenode7/ remain development tools. No Pages site is configured for the BN7 repository itself. P12–P15 in TODO.md and research/web-repair-review.json record the selected destination and verified publication; human review and final-edition approval remain pending.

## Start here

| Purpose | Authoritative document |
| --- | --- |
| Read the short manuscript | [PUBLIC_PLAYBOOK.md](PUBLIC_PLAYBOOK.md) |
| Find the next task, acceptance criteria, and responsible role | [TODO.md](TODO.md) |
| Prepare business conversations and account research under working hypotheses | [FIRST_CONVERSATION_KIT.md](FIRST_CONVERSATION_KIT.md) |
| Review ten researched organizations and their source-backed conversation topics | [Candidate research](research/BD_CANDIDATES.md) |
| Review five unsent introductions and track preparation separately from outreach | [Outreach drafts](OUTREACH_DRAFTS.md) and [activity tracker](ACTIVITY_TRACKER.csv) |
| Collect CEO direction without email and explicitly import private answers | [CEO Q&A workflow](CEO_QA_WORKFLOW.md) and [questionnaire template](CEO_QA_TEMPLATE.md) |
| Read Bryan Lachica's questionnaire and detailed review scope | [REVIEW_BRIEF.md](REVIEW_BRIEF.md#questions-for-bryan) |
| Understand editorial choices, rendering commands, distribution options, and maintenance | [PLAYBOOK_WORKPLAN.md](PLAYBOOK_WORKPLAN.md) |
| See the longer edition's proposed depth and expansion priorities | [LONG_PLAYBOOK_OUTLINE.md](LONG_PLAYBOOK_OUTLINE.md) |
| Inspect material claims and their limits | [Evidence register](research/EVIDENCE_REGISTER.md) |
| Identify the exact upstream sources studied | [Source inventory](research/source-inventory.json) |
| Inspect the bounded synthetic demonstration | [FMA evaluation result](research/fma-evaluation/RESULT.md) |
| Check candidate artifact identities and verification scope | [Render review](research/render-review.json) |
| Check web diagnosis, design comparison, and current artifact validation | [Web repair review](research/web-repair-review.json) |
| Check repository disclosure review and public-access verification | [Repository publication review](research/repository-publication-review.json) |

## Review and distribution

Generate the PDF, HTML, and revision archive using the [source/build arrangement](PLAYBOOK_WORKPLAN.md#source-and-build-arrangement). Generated artifacts and local environments are ignored by Git. The artifact archive contains only the short manuscript, rendered formats, and public file manifest. Tracked research, the blank review brief, working plan, and committed business-development hypotheses are part of the repository review material. They do not establish customer outcomes or approved service commitments.

Earlier baselines and verification captures retain the private-workspace labels and visibility observations recorded when they were created. Preserve those records as evidence of their original scope. The repository publication review records the separate visibility decision and access checks. Actual confidential company information and identifiable reviewer responses belong outside this public repository unless their disclosure is explicitly approved; only approved public summaries should be committed.

Bryan Lachica is the user-selected lead internal/company reviewer. Review completion and actual reader/accessibility feedback are recorded through the [review brief](REVIEW_BRIEF.md), with task status in TODO.md. The longer edition remains an outline until the short edition is reviewed and expansion priorities are selected.

## Local reading preview

Use Node 22.18 or newer, Python 3, the declared Node dependencies, and an installed Chromium browser. In the BN7 checkout, run:

```sh
npm ci
npm run check
npm run build
npm run pdf -- /absolute/path/to/chromium /absolute/path/to/BN7
npm run preview
```

Open `http://127.0.0.1:4173/` in a browser, then run `npm run verify -- /absolute/path/to/chromium http://127.0.0.1:4173/` in another terminal. The preview serves `output/web/index.html` and its sibling PDF, with embedded styling, favicon, and brand graphics. Stop the server with Ctrl-C. [The workplan](PLAYBOOK_WORKPLAN.md#web-repair-and-design-milestone) records design adaptations and the deployment handoff. The selected revision is imported unchanged into the hideouts.io build, after software search and sitemap generation; it contains no build environment or working business-development files.
