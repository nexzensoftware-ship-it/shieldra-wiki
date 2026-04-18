# Unified Feedback Affordance — Design Spec

**Date:** 2026-04-16
**Author:** Design session with Shyam Sedai
**Status:** Design approved — ready for implementation planning
**Workstream:** Phase 1 of the 5-workstream "Shieldra feels like one system" initiative

---

## 1. Problem

The Learning Engine's flywheel depends on tenant feedback (expert corrections + recommendation outcomes), but today feedback is a chore:

- Correction submission lives on a dedicated `/learning-engine` page behind 2 tabs and a modal (~6 clicks to file one correction).
- The modal demands a requirement ID the user must copy from another page.
- Recommendation outcomes (`accepted` / `effective` / `ineffective`) have zero UI despite fully-working backend endpoints.
- AI chat thumbs-up/down writes to a separate isolated table that doesn't train the Learning Engine.
- Risk scores, incident breach determinations, vendor risk levels, document classifications, control test predictions — all AI-generated judgments across the app — have no feedback affordance at all.

Net result: of 49 authenticated pages in the Shieldra web app, **only 2 have Learning Engine feedback hooks.** The flywheel can't flywheel.

## 2. Goal

Every AI-generated judgment in the Shieldra app gets a consistent, low-friction feedback affordance that captures either acceptance (high-volume, coarse signal) or correction (lower-volume, rich signal) — routed into the Learning Engine's existing `ExpertCorrection` / `LearningSignal` / `RecommendationOutcome` tables.

Non-goals for Phase 1:
- Consolidating overlapping pages (risk triad, finding streams). That's Workstream B.
- Full cross-page contextual link mesh. That's Workstream C.
- Workflow wizards / task inbox. That's Workstream D.
- Tenant-visible LE dashboards showing peer comparisons. That's Workstream E (a minimal "Your Contributions" card is included here).

## 3. Scope

**In scope:**
1. A reusable `<FeedbackAffordance>` React component with 3 placement modes and 8 drawer variants.
2. A shared drawer shell with per-entity-type content.
3. Thumb-up acceptance signal endpoint (`POST /learning-engine/feedback/acceptance`) — new.
4. Extended correction endpoint (`POST /learning-engine/feedback/correction`) — accepts new `entity_type` field.
5. Placement on 17 AI-surface pages.
6. `/review` page — active-learning queue with batch keyboard shortcuts.
7. Outcome follow-up — immediate 3-button card on remediation close + 30-day nudge.
8. "Your Contributions" card on `/learning-engine` and dashboard.

**Out of scope:**
- Consolidating existing pages.
- Full contextual link mesh between all entities.
- Auditor-specific portal (auditors use the same component with `ai.manage` permission).
- Gamification (streaks, badges, leaderboards).
- Email digests beyond the one 30-day nudge.

## 4. Component architecture

### 4.1 The `<FeedbackAffordance>` component

```tsx
<FeedbackAffordance
  entityType="finding" | "risk_item" | "remediation" | "incident"
            | "vendor_risk" | "control_test" | "document_class"
            | "ai_answer"
  entityId={string}
  aiJudgment={{
    field: string              // "severity" | "likelihood" | ...
    value: string | number
    confidence?: number        // 0-1, shown subtly in drawer if present
  }}
  requirementId?: string       // auto-pre-fills correction payload
  cfrReference?: string
  placement="inline-subtle" | "card-footer" | "detail-header"
  size="xs" | "sm"
/>
```

**Visual states:**

| State | Appearance |
|---|---|
| Rest | Two 24×24 icon buttons, 40% opacity, no label |
| Hover | 100% opacity, tooltip "Agree" / "Disagree" |
| Thumb-up clicked | Icon flashes green for 600ms, button disables for 300ms debounce |
| Thumb-down clicked | Drawer slides in from right (380px desktop) or up (bottom sheet mobile) |
| Post-submit | Badge next to value: "✓ You corrected this" (persists 7 days) |

**Three placement modes** (chosen per surface, not per user):
1. `inline-subtle` — right of a badge/value in a table row or heat-map cell
2. `card-footer` — bottom-right of a card (AI-suggested remediation, insight, anomaly, AI answer)
3. `detail-header` — top-right of a detail panel/sheet

**Permission gate:** component renders null unless user has `ai.manage` permission. No phantom buttons.

### 4.2 Drawer variants (one file per entity type)

| Entity type | Drawer fields |
|---|---|
| `finding` | Severity picker · Status picker · "False positive" toggle |
| `risk_item` | Likelihood 1-5 slider · Impact 1-5 slider |
| `remediation` | "Not useful" toggle · Alternative approach (free text, optional) |
| `incident` | Breach determination toggle · Actual breach type (if differs) |
| `vendor_risk` | Risk level picker (low/med/high/critical) |
| `control_test` | Expected outcome (pass/fail) |
| `document_class` | Correct class picker (from known classes) |
| `ai_answer` | Free-text correction only |

**All drawers share:**
- Header: "What should it be?" with AI's current judgment shown inline
- Optional "Why? (optional)" single-line reason field
- Submit button labeled "Save correction"
- Cancel / close (X) in top-right
- Keyboard: Esc closes, Cmd+Enter submits

### 4.3 Quality scoring

Initial defaults (tunable by `SignalQualityScorer` based on reason length, user history, peer agreement):

| Signal | Quality |
|---|---|
| Thumb-up (acceptance) | 0.5 |
| Correction without reason | 0.7 |
| Correction with reason | 1.0 |
| Skip in review queue | 0.1 |

## 5. Data flow

### 5.1 Thumb-up (acceptance)
```
User clicks thumb-up on severity=critical
  → POST /learning-engine/feedback/acceptance
      body: { entity_type, entity_id, requirement_id, field: "severity",
              value: "critical" }
  → backend inserts LearningSignal(signal_type="acceptance", quality=0.5)
  → no toast, no spinner; button flash-confirms
```

### 5.2 Correction
```
User clicks thumb-down on severity=critical, picks "medium" + optional reason
  → POST /learning-engine/feedback/correction
      body: { entity_type, entity_id, requirement_id, cfr_reference,
              correction_type: "severity_change",
              original_value: "critical", corrected_value: "medium",
              reasoning: "..." | null }
  → backend:
      1. scrub PHI from reasoning (Sprint 0 scrubber)
      2. upsert ExpertCorrection (keyed on user_id + entity_id + field)
      3. insert LearningSignal(quality=1.0 if reason else 0.7)
      4. flag source entity has_user_correction=true
  → frontend:
      5. invalidate relevant React Query keys
      6. toast "Thanks — this will train future analyses"
         + contextual next-step link when available (see §7)
      7. 5-second Undo window in toast — click deletes correction before ingestion
```

### 5.3 Recommendation outcome
```
User marks remediation "done"
  → completion card: "Was this fix effective?" [Yes / Partial / No] + notes
  → POST /learning-engine/recommendations/{id}/outcome
  → backend writes RecommendationOutcome row
```

## 6. Placement matrix — 17 surfaces

| Page | Surface | Entity type | Placement mode |
|---|---|---|---|
| `/compliance` | Finding row/card | `finding` | inline-subtle |
| `/compliance/$checkId` | Per-requirement result | `finding` | inline-subtle |
| `/risk-register` | Heat-map cell + risk row | `risk_item` | inline-subtle |
| `/risk-assessment` | Risk row in assessment | `risk_item` | inline-subtle |
| `/risk-prioritization` | Score column | `risk_item` | inline-subtle |
| `/remediation` | AI-suggested action card | `remediation` | card-footer |
| `/remediation` | Estimated effort (on close) | `remediation` | detail-header |
| `/incidents` | Breach determination badge | `incident` | detail-header |
| `/penalty-exposure` | Tier assignment badge | `finding` | inline-subtle |
| `/controls` | Mapped requirements list | `control_test` | inline-subtle |
| `/vendors`, `/vendor-risk` | Risk level badge | `vendor_risk` | inline-subtle |
| `/documents` | AI classification badge | `document_class` | inline-subtle |
| `/contract-intelligence` | BAA adequacy score | `document_class` | card-footer |
| `/due-diligence` | Liability assessment card | `finding` | card-footer |
| `/ai-assistant` | Every AI answer | `ai_answer` | card-footer |
| `/insights` | Anomaly / pattern card | `ai_answer` | card-footer |
| `/regulatory-radar` | Urgency + affected controls | `finding` | inline-subtle |
| `/review` (new) | Every queue item | varies | card-footer |

**Excluded from Phase 1** (no AI judgment to correct): `/training`, `/personnel`, `/settings`, `/profile`, `/enterprise-integrations`, `/audit-trail`, `/frameworks`, `/regulations`, `/customer-portal`, `/trust-center-admin`, `/policy-templates`, `/compliance-code`, `/onboarding`, `/collaboration`, `/reports`, `/advanced-reports`, `/audit-reports`, `/hipaa-roadmap`, `/compliance-costs`, `/knowledge-graph`, `/behavior-analytics`, `/employee-compliance`, `/tprm`, `/digital-twin`, `/breach-sim`, `/ai-governance`, `/ai-agent`, `/alerts`, `/assets`.

## 7. Contextual next-step toasts (minimal glue)

Only the correction paths with exactly one obvious next action get a secondary link in the success toast. Everything else gets a plain "Thanks."

| After correcting… | Toast offers | Deep-link target |
|---|---|---|
| Finding severity/status | "Open remediation" | `/remediation/new?finding_id={id}` |
| Risk score | "Create treatment plan" | `/risk-management/new?risk_item_id={id}` |
| Incident breach determination | "Calculate penalty exposure" | `/penalty-exposure?incident_id={id}` |
| Vendor risk level | "Open BAA" | `/documents/{baa_id}` |
| Document classification | "Run compliance check" | `/compliance?document_id={id}` |

This is a deliberately thin slice of Workstream C. The full contextual mesh lives in its own spec.

## 8. The `/review` page

**Purpose:** Batch review for operators and internal auditors. The active-learning queue surfaced as a dedicated UX.

**Data source:** new endpoint `GET /learning-engine/review-queue` unions:
- Active-learning picks (existing `/active-learning` endpoint)
- Items where prediction confidence dropped below calibration threshold
- Peer corrections on same requirements ("12 orgs corrected this — do you agree?")
- Remediations awaiting outcome follow-up

**Layout:** single-column feed of review cards. Each card = AI judgment + minimum context + embedded `<FeedbackAffordance>` in `card-footer` mode.

**Filters:** entity type · requirement · severity · "my org" vs "peer corrections."

**Keyboard shortcuts (batch mode):**
- `J / K` — next / previous card
- `A` — thumb-up (accept), advance to next
- `D` — open drawer
- `S` — skip (signal quality=0.1, moves to next)

**Pacing feedback:** single progress bar at top: "12 of 47 reviewed this week." No streaks, badges, or leaderboards.

## 9. Outcome follow-up

**Immediate phase** — On remediation/treatment plan/control marked "done," append completion card:

> **Was this fix effective?**
> `[✅ Yes]` `[⚠️ Partially]` `[❌ No]`
> _What happened? (optional)_

Skip button → "I'll tell you later" defers to the 30-day phase.

**30-day phase** — Background job `recommendation_outcome_nudge` queries for remediations closed 30 days ago with no outcome. Creates an in-app notification and (by default, user-disabable in profile settings) an email:

> "You resolved '{title}' 30 days ago. Is it still holding up?"
> `[Still effective]` `[Regressed]` `[Lost track]`

**Cap:** 3 touchpoints total — the immediate card, the 30-day in-app nudge, the 30-day email. No further chasing. Users can disable the email channel in profile notification preferences; in-app nudges cannot be disabled (they're non-blocking dismissable cards).

## 10. "Your Contributions" card

Lives on `/learning-engine` and the dashboard. Three numbers + one sentence.

```
Your team's feedback this quarter

   47              12               89%
   corrections     recommendations   recommendation
   submitted       marked effective  effectiveness rate

   Your corrections improved model accuracy on
   12 HIPAA requirements by an average of 3.4%.

   [See what you taught the model →]
```

**Data sources:**
- `corrections submitted` — count of `ExpertCorrection` rows where `org_id = current_org` in last 90 days
- `recommendations marked effective` — count of `RecommendationOutcome` rows with outcome="effective"
- `effectiveness rate` — effective / (effective + partial + ineffective)
- `accuracy improvement` — delta on `AccuracyTracker` metrics for requirements the org has corrected

**Peer comparison** (secondary line, shown only when ≥k peer orgs of similar size exist):
> "Teams like yours typically submit 30-50 corrections per quarter."

Uses existing k-anonymous pattern library.

**Link target:** `[See what you taught the model →]` goes to `/learning-engine?tab=contributions`, which shows a per-requirement breakdown of the org's corrections and their downstream effect on model accuracy.

## 11. Edge cases and error handling

| Case | Behavior |
|---|---|
| Rage-click thumbs | Debounce 300ms; only first click fires |
| User submits then regrets | `Thanks · Undo` toast for 5 seconds; Undo deletes correction before LE ingestion |
| Same user corrects same entity twice | Upsert keyed on `(user_id, entity_id, field)` — replace, not duplicate |
| AI re-runs and overwrites corrected value (findings / risk items only) | Source entity flagged `has_user_correction=true`; UI shows "Reverted by AI — review?" banner with one-click restore to the user's corrected value |
| Two users in same org disagree | Both corrections persist; `SignalQualityScorer` weights by reason + user history + peer agreement |
| Offline click | Queued in localStorage; replayed on reconnect with idempotency key |
| LE degraded / down | Thumbs succeed optimistically to localStorage; drawer submits show "Saved — will sync" with exponential-backoff retry |
| User lacks `ai.manage` permission | Component renders null |

## 12. Backend changes

| Change | Status |
|---|---|
| `POST /learning-engine/feedback/correction` accepts new `entity_type` field | Extend existing endpoint |
| `POST /learning-engine/feedback/acceptance` | New endpoint |
| `GET /learning-engine/review-queue` | New endpoint (unions active-learning + calibration drift + peer corrections + outcome-pending) |
| `GET /learning-engine/contributions?window=90` | New endpoint returning the card's 3 numbers + accuracy improvement summary |
| `ExpertCorrection` upsert keyed on `(user_id, entity_id, field)` | Migration to add unique index |
| `has_user_correction` flag on `findings` and `risk_items` tables | Denormalized — only on entities that get re-overwritten by AI scans/assessments. Other entity types don't need the flag because AI doesn't re-overwrite them without explicit user action. |
| `recommendation_outcome_nudge` cron job | New — runs daily, emits notifications for 30-day-old closed remediations without outcome |
| PHI scrubbing on `reasoning` field | Reuses Sprint 0 scrubber |

## 13. Frontend changes

| Change | Status |
|---|---|
| `<FeedbackAffordance>` component | New |
| 8 drawer variants (`FeedbackDrawerFinding`, `FeedbackDrawerRiskItem`, …) | New |
| `useSubmitCorrection` hook — extend to accept `entity_type` | Modify existing |
| `useSubmitAcceptance` hook | New |
| `useReviewQueue` hook | New |
| `useContributions` hook | New |
| `<OutcomeFollowUpCard>` component | New |
| `<YourContributionsCard>` component | New |
| `<ReviewQueuePage>` route + sidebar nav | New — `/review` |
| Placement on 17 existing pages | Modify existing |
| Offline queue in localStorage with replay | New — small helper module |

## 14. Testing strategy

1. **Component tests** — one per drawer variant (8 total): renders correct fields, submits correct payload shape, disables submit when invalid, Esc and Cmd+Enter keybindings work.
2. **Hook tests** — `useSubmitCorrection` + `useSubmitAcceptance`: optimistic update, rollback on error, query invalidation, offline queue replay.
3. **Backend integration** — `POST /feedback/correction` with each of the 8 `entity_type` values writes `ExpertCorrection` + `LearningSignal` with correct quality score. PHI scrubbing verified on `reasoning` field.
4. **E2E smoke** — Playwright on `/compliance`: click thumb-down on a finding → drawer opens → pick severity → submit → toast appears → new row in `ExpertCorrection` table.
5. **Review queue** — item moves out of queue after correction; all 4 keyboard shortcuts fire correct actions; skip creates quality=0.1 signal.
6. **30-day nudge job** — fake-clock test: remediation closed 30 days ago with no outcome produces exactly one notification; after 3 notifications no further emit.
7. **Permission gate** — component renders null for users without `ai.manage`.
8. **Undo window** — submitting then clicking Undo within 5s removes the correction before LE ingestion.

## 15. Success metrics (post-launch)

- **Correction submission rate:** baseline today is near-zero outside the Learning Engine page. Target: at least 10× within 30 days of Phase 1 launch.
- **Coverage:** ≥ 80% of active users submit at least one signal (thumb or correction) within 14 days.
- **Outcome reporting rate:** ≥ 40% of closed remediations get an outcome signal within 30 days.
- **Review queue throughput:** ≥ 30% of items in the queue get a signal within 7 days of appearing.
- **No regressions:** thumb-click flow completes in under 150ms end-to-end.

## 16. What this unlocks

Phase 1 on its own doesn't "make the app feel like one system" — that's Workstreams B, C, D. But Phase 1 is the **pre-condition** for the Learning Engine to compound: without this, consolidating pages (B) or adding contextual links (C) has nothing to learn from. With this, every subsequent workstream gets richer signal automatically because the feedback plumbing is already running on every AI surface.

Phase 1 is the foundation the other four workstreams build on top of.

---

## Appendix A — Phase relationships

This spec is Phase 1 of a 5-workstream initiative:

- **Phase 1: Unified Feedback Affordance** (this spec) — unblocks flywheel signal collection
- **Phase 2: IA Consolidation** — collapses risk triad, unifies finding streams, merges vendor pages
- **Phase 3: Contextual Cross-Page Linking** — full relationship mesh between entities
- **Phase 4: Workflow Orchestration** — Task Inbox + post-action nudges + multi-page wizards
- **Phase 5: LE Observability** — richer tenant-facing dashboards showing flywheel value

Each phase ships independently. Each subsequent phase benefits from Phase 1 being in place — no phase should be implemented before Phase 1 or it will ship without feedback hooks.
