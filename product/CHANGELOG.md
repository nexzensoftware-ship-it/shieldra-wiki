# ShieldRA CHANGELOG

All HIPAA roadmap changes are recorded here. Each entry documents what changed, the debate that resolved it, and why each item was added or modified.

---

## Dashboard Snapshot Cache + New Workers (2026-04-17)

**Summary:** Moved expensive dashboard work off the request path and added three new background workers. The dashboard now serves pre-computed payloads from a DB cache refreshed on a schedule; request-time compute is the fallback, not the default.

### Architecture

- New `dashboard_snapshots` table (migration `c3d4e5f6a7b8`). One row per `(org_id, snapshot_type)`, storing the full payload + `computed_at`.
- Dashboard endpoints (`/dashboard/overview`, `/dashboard/intelligence-briefing`, `/dashboard/data`) now use a two-tier cache: in-process L1 (30–60s) → DB snapshot L2 (15 min default, `DASHBOARD_SNAPSHOT_FRESH_SECONDS`) → live compute + write-back.
- Eliminates the "autonomous agent + cross-org benchmarker + 20 SQL queries per dashboard load" hot path.

### New workers

| Worker | Interval | What it does |
|---|---|---|
| Dashboard Snapshot | 10 min | Re-runs the three dashboard endpoints for every org and writes snapshots. |
| Reminder | 24 h | Digest emails for remediations due ≤7 days and regulatory effective dates ≤14 days, with a 3-day per-item cooldown. |
| Invite-Token Cleanup | 24 h | Expires pending invite/reset tokens past their `expires_at`; prunes terminal-state tokens older than 90 days. |

### Fixes

- `retention_worker` was registered in `main.py` but **not** in `worker.py` — meaning on Railway (where the API sets `DISABLE_BG_WORKERS=1`), retention never ran. Now registered in both.
- `get_dashboard_data` was calling `get_overview(ctx)` with `ctx` in the `response` slot, causing silent AttributeErrors on every aggregate dashboard fetch. Fixed to `get_overview(response=None, ctx=ctx)`.
- `cohort_aggregation` now also runs on the LE worker cadence instead of only when the insights endpoint is hit on-demand.

### Docs

- New [docs/WORKERS.md](docs/WORKERS.md) covers the full worker registry, intervals, env vars, and the API/worker split rule.
- README gained a "Background Workers" section pointing at the above.

---

## Learning Engine — All 8 Use Cases Implemented (2026-03-30)

**Summary:** All 8 Learning Engine use cases are now live on dev.shieldra.ai. Intelligence from the LE's 10 subsystems now surfaces across every major page in the platform. The integration follows a non-fatal enrichment architecture — intelligence enhances the experience but never blocks core functionality.

### New API Endpoints

| Method | Endpoint | Use Case |
|--------|----------|----------|
| GET | `/dashboard/intelligence-briefing` | UC1 — Smart compliance briefing |
| GET | `/remediation/{id}/intelligence` | UC3 — Pattern-backed remediation suggestions |
| POST | `/ai/feedback` | UC5 — Record user feedback signals |
| GET | `/ai/feedback/stats` | UC5 — Aggregate feedback metrics |
| GET | `/vendors/{id}/intelligence` | UC7 — Smart vendor risk intelligence |
| GET | `/documents/{id}/intelligence` | UC8 — Document analysis intelligence |

### Enhanced Existing Endpoints

- **Compliance findings** (detail + list): Enriched with calibrated confidence scores and expert correction metadata (`_finding_to_enriched_dict()`, `_batch_enrich_finding_dicts()`)
- **Report generation**: All reports now include peer percentile, compliance trend, patterns, and recommendations via `_gather_intelligence()` / `_enrich_with_intelligence()`. Executive reports get `risk_forecast` + `peer_ranking`
- **Alerts list/summary**: Intelligence alerts (`IntelligenceAlert` model) merged with finding-based alerts
- **AI suggestion endpoint**: Enhanced with pattern library data for remediation
- **Vendor summary**: Enhanced with intelligence data
- **Document analysis**: Enhanced with `score_trend` + `peer_comparison`

### New Frontend Components

| Component | Page | Notes |
|-----------|------|-------|
| `<IntelligenceBriefing />` | Dashboard | Priority-sorted action items from agent, benchmarks, flywheel |
| Calibrated confidence badges | Compliance | Color-coded (green/amber/red), ⚡ expert-reviewed badges |
| `<IntelligenceSection />` | Remediation | Lazy-loaded, shows pattern success rates + peer insights |
| Intelligence Insights section | Reports | Embedded in report HTML; 🧠 AI-Enhanced badge on cards |
| 👍/👎 feedback buttons | AI Assistant | With optional "What was wrong?" input on 👎 |
| AI Feedback card | Learning Engine | Aggregate feedback stats |
| Intelligence alert types | Alerts | `compliance_drift`, `proactive_risk`, `evidence_gap` with icons |
| `<VendorIntelligenceSection />` | Vendors | Lazy-loaded, PHI/BAA gap detection |
| `<DocumentIntelligencePanel />` | Documents | Score trend, category badges, coverage bar, benchmark tips |

### Architecture Decisions

- **Non-fatal enrichment:** All LE integration wrapped in try/catch — intelligence unavailability never breaks core pages
- **Lazy-loaded intelligence:** Frontend intelligence sections load on-demand (expanded cards only), not on initial page render
- **Batch enrichment:** List views use `_batch_enrich_finding_dicts()` for lightweight enrichment; detail views get full intelligence
- **Lazy imports (Vercel):** `IntelligenceAlert` model uses lazy-import pattern to avoid cold-start import failures in serverless
- **Migration v28:** Added `IntelligenceAlert` model for proactive alert types

### Database

- Migration v28: `IntelligenceAlert` model for intelligence-generated alerts

---

## Rule 4 — Enforcement Rule: Penalty Amounts Fix (2026-03-26)

**Bug:** Civil penalty amounts were wrong across all 4 tiers. Tiers 1–3 annual caps all showed `$2,067,813` (Tier 4 value). Per-violation min/max amounts were stale pre-2024 figures.

### Fixed (penalty_tiers)
- Tier 1 annual cap: `$2,067,813` → `$35,581` (OCR 2019 enforcement discretion)
- Tier 2 annual cap: `$2,067,813` → `$142,355` (OCR 2019 enforcement discretion)
- Tier 3 annual cap: `$2,067,813` → `$2,134,831` (correct 2024 value)
- All per-violation amounts updated to Aug 2024 inflation-adjusted figures per HIPAA_REQUIREMENTS.md §6.1
- Tier descriptions tightened with legal precision (e.g., "reasonable diligence" language)

### Added
- `criminal_penalties`: 3-level structure (Basic/Enhanced/Aggravated) per §1177 / 42 U.S.C. §1320d-6
- `cfr` field: `"45 CFR Part 160, Subparts C, D, E"`
- `key_points` expanded from 3 → 8: statute of limitations (6yr), 7 OCR penalty factors, Resolution Agreements, enforcement authority (OCR civil / DOJ criminal / state AG), 2019 enforcement discretion note

### Source
- HIPAA_REQUIREMENTS.md §6.1–6.5

---

## Maintenance (2026-03-26)

**Commit:** `cd82619`

### Fixed

- `overall_total` comment: `7 + 14 + 6 + 6 + 2 = 35` → `7 + 18 + 6 + 6 + 2 = 39` (security_total was 18 after Rule 2 expansion, comment said 14)
- Test mock `security_total = 14` → `18`; assertion `== 33` → `== 37` (12/12 tests pass)
- No logic change — runtime uses `len()` and was always correct

---

## Rule 3 — Breach Notification Rule (2026-03-26)

**Debate:** `shieldra-rule3-plan-20260326.debate.json` + `shieldra-rule3-review-20260326.debate.json`
**Commits:** `89f4e00` (initial 6-item expansion), `2f37595` (QA/Product-resolved fixes)

### Added

- `breach_risk_assessment` (§164.402 — missing entirely; no process for classifying whether an incident is a reportable breach)
- `breach_individual_notify` (§164.404(b) — replaces breach_workflow; workflow item only checked if any incident had a deadline, not all open ones)
- `breach_media_notify` (§164.406 — bundled into breach_workflow's generic description; media notification is a distinct obligation with different audience/logistics)
- `breach_hhs_notify` (§164.408 — two-tier HHS reporting path invisible in original; ≥500 vs <500 structure not represented)
- `breach_ba_notification` (§164.410 — BA obligation to notify CE within 60 days not represented; now role-gated by org_type)

### Changed

- `breach_plan` plain_label: vague "step-by-step plan" → comprehensive plan covering 5 required elements, 60-day timeline, substitute notice, log maintenance, and law enforcement delay procedures (§164.412, up to 30 days verbal / 90 days written) — C-P5
- `breach_plan` cfr: added `§164.400` applicability anchor alongside `§164.404` — C-Q5
- `breach_risk_assessment` plain_label: "four-factor risk assessment" jargon → plain-language 4-point checklist readable by non-lawyers at small CEs — C-P4
- `breach_individual_notify` plain_label: added substitute notice requirement (when 10+ individuals unreachable) — C-P3
- `breach_individual_notify` cfr: `§164.404` → `§164.404(b)` (sub-section granularity to distinguish from breach_plan's §164.404 coverage) — C-Q5
- `breach_ba_notification` label/plain_label: now gated by `org.org_type`; BA-role sees notification obligation, CE-role sees intake procedure — C-Q4 / C-P2
- `breach_workflow` status_logic: `any(i.notification_deadline for i in incidents)` (false positive from old closed incidents) → removed in favor of `breach_individual_notify` document upload — C-P1

### Deferred

- `breach_law_enforcement_delay` (§164.412 standalone item) — situational; covered via plain_label addition to breach_plan

---

## Rule 2 — Security Rule (2026-03-26)

**Debate:** `shieldra-rule2-review-20260326.debate.json`
**Commits:** `fd645e7` (gap fixes), `3bc758e` (QA+Product merge)

### Added

- `sec_contingency_plan` (§164.308(a)(7) — data backup, disaster recovery, and emergency operations not represented; three distinct administrative safeguards bundled under "incident response")
- `sec_evaluation` (§164.308(a)(8) — periodic review of security measures entirely absent; compliance officers had no roadmap item for scheduled security reviews)
- `sec_sanction_policy` (§164.308(a)(1)(ii)(C), §164.530(e) — workforce sanctions for security violations missing; only privacy sanctions were tracked)
- `sec_access_mgmt` (§164.312(a)(2)(i), §164.312(a)(2)(ii) — unique user ID assignment and emergency access procedures absent; access control covered permissions but not provisioning procedures)

### Changed

- All 14 existing Rule 2 items: added `cfr` field (was missing on all items — G7 pattern consistent with Rule 1 and Rule 6 gaps)
- `sec_vendor_baas` plain_label: clarified BAA scope split between CE-BA and BA-subcontractor obligations — PC1
- `sec_evaluation` plain_label: rewritten from vague "schedule reviews" to specific actionable language — PC2
- `sec_contingency_plan` status_logic: corrected doc type to `contingency_plan` (was conflating with `disaster_recovery`) — QC1

---

## Rule 1 — Privacy Rule (2026-03-26)

**Debate:** `shieldra-rule1-review-20260326.debate.json`
**Commits:** `30ccc82` (gap fixes + frontend), `49b586f` (train_status forward-ref bug fix)

### Added

- `privacy_training` (§164.530(b) — privacy-specific training entirely absent; sec_training covered security but not patient rights, minimum necessary, or breach reporting duties; note field added: training must cover §164.530(b) content)
- `privacy_sanctions` (§164.530(e) — workforce sanctions for privacy violations missing; separate from access control policy; plain_label explicitly calls out distinction from sec_access_control)
- `privacy_authorization` (§164.508 — patient authorization process for non-TPO uses entirely absent; covers marketing, research, psychotherapy notes; plain_label lists 5 required form elements)
- `privacy_complaints` (§164.530(d) — complaint process missing; NPP mentions the right to complain but does not verify an actual complaint handling process exists)

### Changed

- `privacy_npp` cfr: added `§164.520`; plain_label updated to list all 7 required NPP elements — G1, G8
- `privacy_minimum` cfr: added `§164.502(b), §164.514(d)` — G1
- `privacy_access` label: "Patient Access Policy" → "Patient Right of Access Policy"; plain_label rewritten to distinguish from Rule 6 omnibus_patient_copies (any-format vs electronic-specific) — G5, C2-P
- `privacy_authorization` plain_label: includes required §164.508 form elements (what PHI, purpose, recipient, expiration, right to revoke) — C3-Q
- `privacy_sanctions` plain_label: "separate from your access control policy" clause added to prevent confusion with sec_access_control — C4-Q
- `omnibus_patient_copies` (Rule 6) plain_label: updated to distinguish from privacy_access — "records delivered directly to another provider or app — the electronic access expansion from the 2013 Omnibus Rule" — C2-P
- Privacy rule `key_points`: added §164.530(j) 6-year retention note (info_only, no new actionable item) — G7
- `train_status` forward-reference bug: moved before `privacy_items` construction — was defined after on line 326, caused NameError at runtime — `49b586f`

---

## Rule 6 — Omnibus Rule (2026-03-26)

**Debate:** `shieldra-rule6-review-20260326.debate.json`
**Commit:** `38f2a9a`

### Added

- `omnibus_confidential_comm` (§164.522(b) — Right to Confidential Communication absent; providers must accommodate alternative communication methods; same category as the 4 other patient rights items — C3, C10)

### Changed

- `omnibus_sub_baas` cfr: added `§164.502(e), §164.504(e)` (CFR was in Python comment only, not surfaced to frontend or compliance officers) — C1, C8
- `omnibus_patient_restrictions` plain_label: added mandatory self-pay restriction callout `§164.522(a)(1)(vi)` — the one restriction a CE cannot refuse — C4
- `confirm-no-subcontractors` endpoint: toggle pattern → confirm-only; added `/confirm_withdraw` endpoint requiring explicit reason field (prevents accidental attestation withdrawal on double-click) — C2, C9
- Frontend: "Confirm None" button hidden when confirmed; "Confirmed ✓" green badge shown when `no_sub_confirmed=True` — C16
- Test suite: `test_overall_total_excludes_info_only_rules` assertion updated from 24 → 33 actionable items; renamed to reflect actual behavior; resolved test/production contract mismatch — C11, C15

---

*Format: `Added: item_id (§CFR — why it was missing)` | `Changed: what → what (why)`*
