# Legal Protection Changes — April 13, 2026

This document summarizes the legal / compliance protection changes shipped on
April 13, 2026 across five batches. Every change was committed and pushed
directly to `main` per the user's explicit authorization.

## Summary

| # | Item | Status | Key files |
|---|------|--------|-----------|
| 1A | Versioned policy storage + forced re-acceptance gate | ✅ | `legal.py` model, `endpoints/legal.py`, `consent-gate.tsx` |
| 1B | Admin-controlled system announcement / maintenance banner | ✅ | `admin/legal.py`, `system-announcement-banner.tsx`, `admin/legal.page.tsx` |
| 1C | Inline AI advisory disclaimers on all AI surfaces | ✅ | `ai-disclaimer.tsx` + 6 page edits |
| 1D | First-login customer responsibility acknowledgment | ✅ | seeded `responsibility` policy, served via ConsentGate |
| 2A | Public DPA, AUP, sub-processors, DMCA, privacy-request pages | ✅ | `dpa.tsx`, `aup.tsx`, `subprocessors.tsx`, `dmca.tsx`, `privacy-request.tsx` |
| 2B | Cookie consent banner with granular categories | ✅ | `cookie-consent.tsx` mounted in root |
| 3A | Email verification token + verify endpoint + nudge banner | ✅ | `auth.py`, `verify-email.tsx`, `email-verification-banner.tsx` |
| 3B | Age 18+ self-attestation + OFAC country block | ✅ | `signup.tsx`, `auth.py` SANCTIONED_COUNTRIES set |
| 3C | Mandatory-MFA enforcement banner for owner role | ✅ | `mfa-enforcement-banner.tsx` (existing MFA infra) |
| 4A | DSAR intake + admin queue with status workflow | ✅ | `privacy-requests` endpoints + admin tab |
| 4B | Daily retention worker that purges past-grace tenants | ✅ | `tasks/retention_worker.py` registered in main.py |
| 5A | BAA gate on PHI document uploads | ✅ | `documents.py` upload endpoint check |
| 5B | GDPR 72-hour deadline computed alongside HIPAA 60-day | ✅ | `incidents.py` notification timeline |

---

## Database changes

### New tables (Alembic migration `20260413_c2d3e4f5a6b7_legal_protection_tables.py`)

- **`policy_documents`** — Immutable versioned snapshots of every legal document
  (ToS, Privacy, DPA, AUP, Cookie, Responsibility, BAA template). Indexed by
  (kind, is_current). Older versions are preserved for evidentiary purposes.
- **`user_consents`** — Audit log of every acceptance event. Records user_id,
  tenant_id, policy kind/version, ip_address, user_agent, accepted_at, method.
- **`system_announcements`** — Admin-controlled global banners. Severity, audience
  (all/tenants/admins), tenant filter, role filter, time window, dismissibility,
  optional CTA.
- **`privacy_requests`** — DSAR intake. Type (access/delete/export/correct/
  optout/restrict), status workflow, due date, ip_address, admin handler.

### New columns on `tenant_users`

- `email_verified_at`, `email_verification_token_hash`, `email_verification_sent_at`
- `age_attested`, `signup_country`, `signup_ip`
- `accepted_tos_version`, `accepted_privacy_version`, `accepted_dpa_version`,
  `accepted_responsibility_version`

### Seed data

`_seed_initial_policies()` inserts an initial `is_current=true` row for every
policy kind on first boot. The `responsibility` policy ships with a real
multi-paragraph acknowledgment that customers must accept before continuing.

---

## Backend endpoints

### `/api/v1/legal` (tenant-side)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/legal/policies/current` | public | Versions of all current policies |
| GET | `/legal/policies/{kind}` | public | Full body of current policy |
| GET | `/legal/me/consent-status` | user | Which policies need re-acceptance |
| POST | `/legal/me/accept` | user | Record an acceptance |
| GET | `/legal/announcements/active` | public | Banners visible now |
| POST | `/legal/privacy-requests` | public | Submit a DSAR |

### `/admin/api/legal`

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/legal/policies` | List all versions (filterable by kind) |
| POST | `/legal/policies` | Publish a new version (auto-flips is_current) |
| GET | `/legal/policies/{id}/consents` | Audit who accepted this version |
| GET | `/legal/announcements` | List all announcements |
| POST | `/legal/announcements` | Create an announcement |
| PUT | `/legal/announcements/{id}` | Update |
| DELETE | `/legal/announcements/{id}` | Soft-delete (`is_active=false`) |
| GET | `/legal/privacy-requests` | DSAR queue |
| PUT | `/legal/privacy-requests/{id}` | Update status |

### `/api/v1/auth`

- `POST /auth/verify-email` — verify token
- `POST /auth/resend-verification` — resend the link
- `POST /auth/signup` extended:
  - `age_attested` and `country` are now required
  - Sanctioned countries (CU, IR, KP, SY, RU, BY, Crimea/DNR/LNR) rejected
  - Generates verification token, sends `send_verification_email`
  - Persists `signup_ip`, `signup_country`, `age_attested`,
    `accepted_tos_version`, `accepted_privacy_version`

---

## Frontend components (under `apps/web/src/components/legal/`)

| Component | Purpose |
|-----------|---------|
| `terms-content.ts` | Canonical inline ToS used in the signup modal |
| `consent-gate.tsx` | Modal that blocks the app until current-version policies are accepted |
| `system-announcement-banner.tsx` | Renders active admin announcements (info/warning/critical/maintenance/success) with dismiss-per-user |
| `cookie-consent.tsx` | Bottom-right banner: necessary / analytics / marketing toggles, "Reject", "Accept", "Customize", "Do Not Sell" link |
| `email-verification-banner.tsx` | Nudges unverified users with a resend button |
| `mfa-enforcement-banner.tsx` | Owner-role MFA reminder; turns red after grace deadline |
| `ai-disclaimer.tsx` | `<AIDisclaimer variant="badge\|inline\|banner">` reused across AI pages |
| `legal-page.tsx` | Generic long-form layout for DPA/AUP/DMCA pages |

### New routes

| Path | Purpose |
|------|---------|
| `/dpa` | Full Data Processing Addendum |
| `/aup` | Acceptable Use Policy |
| `/subprocessors` | Public sub-processor table with notification statement |
| `/dmca` | DMCA notice/counter-notice procedure with designated agent |
| `/privacy-request` | Public DSAR intake form |
| `/verify-email?token=…&uid=…` | Email verification handler |
| `/admin/legal` | Admin tabs: Announcements, Policies, Privacy Requests |

### Footer

`landing-footer.tsx` now links: Privacy, Terms, DPA, AUP, Sub-processors,
Security, DMCA, Privacy Request.

### Banner stack on `_authenticated` layout

The `AppShell` now stacks (top-to-bottom) under the header:

1. `SystemAnnouncementBanner` — admin-controlled
2. `EmailVerificationBanner` — unverified users
3. `MfaEnforcementBanner` — owners without MFA
4. `BillingAlertBanner` — pre-existing

Plus globally (overlay): `<ConsentGate />` blocks the app until all current
policies are accepted; `<CookieConsent />` from `__root` shows on first visit.

### AI disclaimers wired into

- `ai-assistant.page.tsx` (badge under header)
- `ai-agent.page.tsx` (top-right badge)
- `ai-governance.page.tsx` (full banner)
- `learning-engine.page.tsx` (full banner)
- `insights.page.tsx` (full banner)
- `compliance-analyzer.page.tsx` (italic notice on score page)

---

## Background workers

- `tasks/retention_worker.py` runs **daily**, finds tenants whose
  `deletion_scheduled_at` has passed, calls `offboarding_service.execute_tenant_deletion`
  if available, and audit-logs each purge with `tenant.retention.purged`.
  Registered in `apps/api/src/main.py` lifespan.

---

## Document upload BAA gate

`POST /api/v1/documents/upload` now rejects (HTTP 403) any upload where
`doc_type` is in `{phi, patient_records, medical_records, ephi, claim_forms,
treatment_plans, lab_results}` unless `tenant.settings_json.baa_signed` is true.
Error message points the user to Settings → Compliance → BAA.

---

## Breach notification

`/api/v1/incidents/{id}/notification-timeline` now also returns:

- `gdpr_deadline` — 72 hours after `detected_at`
- `gdpr_hours_remaining` — countdown

HIPAA 60-day and state-specific deadlines were already implemented.

---

## What was *not* implemented (and why)

| Item | Reason |
|------|--------|
| Database-backed sub-processor list with admin CRUD | The static page in `subprocessors.tsx` is sufficient for now; needs its own model + admin form to be worth shipping. |
| Hard MFA block (deny-all routes) for owners without MFA | Would lock out existing live customers without warning. Banner + grace deadline is the safe rollout path. Switch to hard block once 14-day grace expires per tenant. |
| Email verification hard gate on all login | Same rationale — would lock out existing accounts. Currently soft-nudge banner + endpoint ready to gate sensitive actions later. |
| Downloadable enterprise DPA PDF | The DPA page can be printed by browser; a generated PDF can be added later when sales asks for it. |
| Cyber liability / E&O insurance docs, SOC 2 | Operational, not code. |

---

## Rollback notes

Every batch is its own commit on `main`:

| Batch | Commit |
|-------|--------|
| 1 | `3ee105f` |
| 2 | `fe1fe10` |
| 3 | `4fdba8c` |
| 4+5 | (this commit) |

To revert a batch: `git revert <sha>` and push. Migrations have downgrade
functions; revert SQL with `cd apps/api && ./db.sh downgrade -1` if needed.

The new tables are additive — no existing tables were dropped or restructured.
The new `tenant_users` columns are nullable, so a downgrade simply removes
unused columns.
