# FMA synthetic FTQC evaluation

The supplied baseline validated successfully while its human decision remained **HOLD**. The supplied changed-assumption comparison returned the six impacts recorded in the repository's expected-impact fixture. Both repository commands exited `0`, returned JSON `status: PASS`, and produced empty stderr. This is a local evaluation of synthetic declared contracts, not execution of a quantum estimator or `fma reproduce`.

The final machine-readable entry point is [`receipt.json`](receipt.json), with successful retained-output checks in [`verification.json`](verification.json). [`evaluation.json`](evaluation.json) deliberately preserves an initial capture-wrapper expectation error described below; it is not the final verification result.

## Source and environment

- Repository: <https://github.com/Bridge-Node-7/frontier-mission-assurance>.
- Clone: `/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance`.
- Exact HEAD: `f99dd2174c74f26b648321e02f8d30e2cff10230`; source version `0.11.2`; FTQC profile `0.2`.
- Runtime: Python `3.11.16`, macOS `27.0`, Apple Silicon `arm64`.
- Isolated environment: `/Users/macbookpro/Codex/Any/BN7-evaluation/fma-20261004T223724Z/.venv`.
- Direct imports installed from the source's `requirements-dev.txt` pins: `PyYAML==6.0.3`, `jsonschema==4.26.0`. Resolved transitives: attrs `26.1.0`, jsonschema-specifications `2025.9.1`, referencing `0.37.0`, rpds-py `2026.9.1`, typing_extensions `4.16.0`. The venv seeded pip `26.2.1` and setuptools `84.0.0`.
- Dependency installation exited `0` without stderr; `pip check` exited `0`: “No broken requirements found.” No global installation or FMA package build/editable installation was performed.
- [`environment.json`](environment.json), the pip installation report, complete freeze, and setup command records preserve interpreter details, exact versions, downloaded artifact URLs and hashes, setup output, and exit codes. Transitive versions are the recorded resolution from this run; the upstream file pins only the two requested imports in this bounded selection.

All 239 tracked source files have SHA-256 manifests before and after execution. HEAD and tracked bytes were unchanged, and Git reported a clean checkout before and after. No report argument was passed; `PYTHONDONTWRITEBYTECODE=1` prevented Python cache writes into the clone. No whole test suite, hosted integration, receipt-code reproduction, commit, push, or publication ran.

## Exact runtime commands

Both commands ran with working directory `/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance`, inheriting the host environment with the two overrides shown. The capture wrapper retained stdout and stderr separately.

```sh
env PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/src /Users/macbookpro/Codex/Any/BN7-evaluation/fma-20261004T223724Z/.venv/bin/python /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/scripts/validate_ftqc_case.py /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline --root /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance --json

env PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/src /Users/macbookpro/Codex/Any/BN7-evaluation/fma-20261004T223724Z/.venv/bin/python /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/scripts/compare_ftqc_cases.py /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance/profiles/ftqc-assurance/examples/synthetic-neutral-atom/changed-assumption-case --root /Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance --json
```

Executed at `2026-10-04T22:39:36–37Z`. The `.command.json` files preserve exact argv, cwd, environment overrides, timestamps, exit codes, and stream hashes.

| Command | stdout SHA-256 | stderr |
| --- | --- | --- |
| Baseline validation | `8bdf0b4a87150e11dcf025c0b505ea5efffb1589427d4862bb999bf92615f322` | Empty |
| Changed-assumption comparison | `5f8e3c47e1f4bd2ee22ff08ff10ddf694b83cf69fcc95e867d1752306c0742cf` | Empty |

Empty-stream SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Observed behavior and limits

Baseline `DECISION-001` is HOLD. Its runtime hold reasons identify `ENV-RESOURCE-001` and `ENV-LOSS-001` applicability as declared but not established. The checked-in receipt rationale says “one decision-gating evidence envelope”; the envelope records and validator expose two. Public wording should avoid the numeric count until that source inconsistency is resolved.

The changed fixture declares movement-loss assumption `ASSUMPTION-LOSS-001` as `degraded` instead of `baseline`, and changes the architecture revision. Observed comparison output exactly matches every field in the checked-in `changed-assumption/expected-impact.json`:

| Expected and observed signal | IDs/value |
| --- | --- |
| Changed assumption | `ASSUMPTION-LOSS-001` |
| Reused estimate computed stale | `MODEL-RESOURCE-001` |
| Outside declared applicability | `EVIDENCE-LOSS-001`, `EXPERT-REVIEW-001`, `MODEL-RESOURCE-001` |
| Expert review requires reopening | `EXPERT-REVIEW-001` |
| Impacted nodes | `CLAIM-001`, `CLAIM-002`, `CLAIM-003`, `DECISION-001`, `MODEL-RESOURCE-001` |
| Decision requires reopening | `true` |

The current disposition remains HOLD; `decision_changes=[]`. `governance_review_required=false` because this fixture leaves graph structure, envelope definitions, and decision governance fields unchanged. This flag does not suppress the separately observed decision-reopening requirement.

The input resource receipt still declares `review_state: CURRENT`, and the expert record still declares `SUPPORTED_WITHIN_SCOPE`. The comparison computes staleness and reopening signals; it does not rewrite those records. Resource, QEC expert, and loss envelopes fail computed applicability against the changed loss assumption; the photonic envelope remains in scope.

PASS includes provenance warnings: four graph evidence records lack a source/provenance field in the baseline; the comparison repeats those four warnings for previous and current records. Empty stderr therefore does not mean warning-free or independently authenticated evidence.

The results establish the behavior of this supplied synthetic case and the declared dependency graph. They do not establish estimator correctness, a replacement engineering answer, hardware performance, independent scientific validation, readiness, adoption, commercial outcomes, or authority to approve a consequential decision.

## Retained failed preparation and capture steps

The capture wrapper completed installation and both successful FMA commands, then exited `1` because its extra baseline check mistakenly used `ENVELOPE-RESOURCE-001`. Source and runtime use `ENV-RESOURCE-001`. The original script, streams, and failed expectation report are retained. `verify-capture.py` corrected the identifier check, confirmed both declared gates and original stream hashes, and exited `0` without reexecuting FMA or altering its source/output. Final `verification.json` has every check true.

Two preparation-only discovery reads also failed: a broad `rg --files /Users/macbookpro/Codex/Any -g AGENTS.md` encountered permission-denied fixtures in unrelated ManPagesCatalog directories and exited `2`; applicable ancestor files were then read directly. A targeted `rg` initially named nonexistent `baseline/evidence-validity-envelopes.json`; `rg --files` established the actual `baseline/evidence-envelopes.json`. Neither failure executed FMA or changed source. No dependency-installation failure, FMA runtime failure, or timeout occurred.
