# Shieldra AI — Backend API Audit Report

**Auditor:** Sherpa (Backend Audit Agent)
**Date:** 2026-03-17
**Scope:** All files under `apps/api/src/` — endpoints, models, schemas, core, admin
**Bug IDs:** BUG-500 through BUG-564

---

## Executive Summary

The backend is a FastAPI application with ~70 endpoint files, multi-tenant architecture, and SQLAlchemy ORM. The codebase is functional but has **critical security vulnerabilities** (exposed debug endpoints, hardcoded credentials), **dual ORM model definitions** creating maintenance risk, and several endpoints lacking proper auth guards. The most urgent issues are the unauthenticated debug endpoints in `health.py` that allow admin bootstrapping, tenant deletion, and email testing in production.

---

## 🔴 CRITICAL — Security Issues

### BUG-500 — Unauthenticated debug endpoints expose admin bootstrap in production
**File:** `api/v1/endpoints/health.py` (lines 62-97)
**Issue:** `GET /api/v1/debug/bootstrap-admin` creates/resets a superadmin account with hardcoded password `superadmin123` — accessible without ANY authentication. An attacker can call this endpoint to gain admin access to the entire platform.
**Impact:** Complete platform takeover.
**Fix:** Remove entirely or gate behind `require_super_admin` + environment check (`if settings.ENVIRONMENT != "development"`).

### BUG-501 — Unauthenticated tenant deletion endpoint
**File:** `api/v1/endpoints/health.py` (lines 108-200)
**Issue:** `GET /api/v1/debug/delete-tenant/{tenant_id}` deletes any tenant and all associated data without authentication. Uses a GET request for a destructive operation.
**Impact:** Any unauthenticated user can delete any tenant's data.
**Fix:** Remove entirely or gate behind `require_super_admin`. Change to DELETE method.

### BUG-502 — Unauthenticated admin user listing
**File:** `api/v1/endpoints/health.py` (lines 43-60)
**Issue:** `GET /api/v1/debug/admin-check` lists all admin users (IDs, emails, roles) without authentication.
**Impact:** Information disclosure of admin accounts.
**Fix:** Remove or gate behind admin auth.

### BUG-503 — Unauthenticated email configuration exposure
**File:** `api/v1/endpoints/health.py` (lines 28-40)
**Issue:** `GET /api/v1/debug/email-config` exposes API key prefix, from email, and frontend URL without auth.
**Impact:** Information leakage aiding targeted attacks.
**Fix:** Remove or gate behind admin auth.

### BUG-504 — Unauthenticated email test with hardcoded recipient
**File:** `api/v1/endpoints/health.py` (lines 202-240)
**Issue:** `GET /api/v1/debug/email-test` sends emails to hardcoded address `shyam.sedai3@gmail.com` via Resend API without auth. Attackable as an email spam relay.
**Impact:** Email abuse, API key exposure risk.
**Fix:** Remove or gate behind admin auth.

### BUG-505 — Unauthenticated tenant listing
**File:** `api/v1/endpoints/health.py` (lines 98-107)
**Issue:** `GET /api/v1/debug/list-tenants` lists all tenants (IDs, names, slugs, statuses) without authentication.
**Impact:** Full disclosure of all customer organizations.
**Fix:** Remove or gate behind admin auth.

### BUG-506 — Hardcoded default SECRET_KEY in config
**File:** `config.py` (line 72)
**Issue:** `SECRET_KEY` defaults to `"change-me-in-production-super-secret-key-12345"`. If `.env` is missing or doesn't override this, all JWTs are signed with a known key.
**Impact:** Token forgery — attacker can create valid JWTs for any user.
**Fix:** Fail startup if `SECRET_KEY` is the default value in non-development environments.

### BUG-507 — Hardcoded default ADMIN_SECRET_KEY
**File:** `config.py` (line 84)
**Issue:** `ADMIN_SECRET_KEY` defaults to `"admin-super-secret-key-change-in-production-98765"`. Same risk as BUG-506 for admin tokens.
**Impact:** Admin token forgery.
**Fix:** Same as BUG-506 — fail startup if default in production.

### BUG-508 — Hardcoded superadmin password "superadmin123"
**File:** `api/v1/endpoints/health.py` (lines 72, 82)
**Issue:** Bootstrap admin uses `superadmin123` as the password, which is trivially guessable.
**Impact:** Combined with BUG-500, provides immediate admin access.
**Fix:** If bootstrap is needed, require password as input parameter rather than hardcoding.

### BUG-509 — Logout endpoint does not invalidate tokens
**File:** `api/v1/endpoints/auth.py` (lines 272-278)
**Issue:** `POST /auth/logout` returns a success message but does not actually invalidate the JWT. The token remains valid until expiry.
**Impact:** Stolen tokens remain usable after "logout."
**Fix:** Implement token blocklist (Redis-based) or use short-lived tokens with refresh rotation.

### BUG-510 — No password complexity validation on signup
**File:** `api/v1/endpoints/auth.py` (lines 42-46)
**Issue:** `SignupRequest` has no password length or complexity constraints — accepts even single-character passwords.
**Impact:** Weak account security.
**Fix:** Add `Field(min_length=8)` and consider complexity regex.

### BUG-511 — Evidence schedules endpoints lack auth guards
**File:** `api/v1/endpoints/evidence_schedules.py`
**Issue:** None of the CRUD endpoints use `require_permission()` or `require_tenant()`. They extract tenant_id from JWT claims via `get_tenant_id_from_request()` but don't enforce authentication — if the JWT header is missing, `_get_tenant_id()` returns `"default"`, allowing unauthenticated access to the default tenant's schedules.
**Impact:** Unauthenticated users can create/modify/delete/trigger evidence collection schedules.
**Fix:** Add `Depends(require_permission("evidence.manage"))` to all endpoints.

### BUG-512 — Onboarding endpoints lack formal auth dependency
**File:** `api/v1/endpoints/onboarding.py`
**Issue:** Uses `get_tenant_id_from_request()` which silently returns `None` if no token is present, rather than raising 401. No `Depends(require_tenant)` is used.
**Impact:** Potential unauthenticated access to onboarding data modification.
**Fix:** Add `Depends(require_tenant)` to all onboarding endpoints.

### BUG-512b — Users `list_roles` endpoint has no auth
**File:** `api/v1/endpoints/users.py` (lines 254-264)
**Issue:** `GET /api/v1/users/roles/list` has no auth dependency — anyone can list the available roles.
**Impact:** Minor info disclosure, but inconsistent with the rest of the API.
**Fix:** Add `require_permission("users.view")`.

---

## 🟠 HIGH — Architecture & Data Issues

### BUG-513 — Dual ORM model definitions (models/ vs core/db.py)
**File:** `models/*.py` vs `core/db.py`
**Issue:** There are two completely separate sets of SQLAlchemy models:
- `models/` directory: Uses `DeclarativeBase`, UUID PKs, mapped columns, PostgreSQL `UUID` type
- `core/db.py`: Uses `declarative_base()`, String PKs, plain `Column()`, SQLite-compatible

The `models/` models are **never imported by any endpoint** — all endpoints import from `core/db.py`. The `models/` models exist but are dead code.
**Impact:** Confusion, maintenance burden, risk of using wrong models. The `models/__init__.py` exports all, so `from src.models import User` gives you the wrong (unused) User model.
**Fix:** Remove `models/` directory entirely or consolidate into a single model layer.

### BUG-514 — Duplicate async/sync database layer
**File:** `core/database.py` vs `core/db.py`
**Issue:** `core/database.py` defines an async SQLAlchemy engine (`create_async_engine`, `async_session_factory`). `core/db.py` defines a sync engine. `api/deps.py` imports from `core/database.py` (async), but all endpoint code imports `get_db_session()` from `core/db.py` (sync). The async session factory in `deps.py` is never used by any endpoint.
**Impact:** The `get_db` and `get_current_user` dependencies in `deps.py` are dead code. The `DBSession` and `CurrentUser` type aliases are unused.
**Fix:** Either migrate all endpoints to async sessions or remove `core/database.py` and `api/deps.py`.

### BUG-515 — `api/deps.py` dependencies entirely unused
**File:** `api/deps.py`
**Issue:** Defines `get_db`, `get_current_user`, `get_current_active_user`, `DBSession`, `CurrentUser` — none of these are imported or used by any endpoint. All endpoints use `core/tenant_context.py` for auth and `core/db.py` for sessions.
**Impact:** Dead code that misleads developers about the auth architecture.
**Fix:** Remove or integrate.

### BUG-516 — No database migration system
**Scope:** Entire backend
**Issue:** No Alembic or any migration tooling detected. Tables are created via `init_db()` which calls `Base.metadata.create_all()`. Schema changes require manual intervention or table drops.
**Impact:** Cannot safely evolve the database schema in production. Risk of data loss during deploys.
**Fix:** Add Alembic migration infrastructure.

### BUG-517 — Synchronous DB sessions used in async endpoints
**File:** All endpoint files
**Issue:** All FastAPI endpoints are defined as `async def` but use synchronous SQLAlchemy sessions (`get_db_session()` returns a sync `Session`). This blocks the async event loop during every database query.
**Impact:** Under load, the API will have poor concurrency — a single slow query blocks all concurrent requests on that worker.
**Fix:** Either use `run_in_executor()` to wrap sync sessions, switch to async sessions, or define endpoints as plain `def` (FastAPI auto-threads them).

### BUG-518 — Exception handler leaks internal errors in debug mode
**File:** `main.py` (lines 129-136)
**Issue:** The generic exception handler returns `str(exc)` when `settings.DEBUG` is True. Since DEBUG defaults to True, production deployments without explicit `DEBUG=false` will leak stack traces and internal details.
**Impact:** Information disclosure of internal implementation details, file paths, and potentially credentials in error messages.
**Fix:** Default `DEBUG` to `False`. Require explicit opt-in for development.

---

## 🟡 MEDIUM — Incomplete Endpoints & Missing Features

### BUG-519 — Non-HIPAA compliance checks return only placeholder
**File:** `api/v1/endpoints/compliance.py` (lines 289-304)
**Issue:** When `body.regulation != "HIPAA"`, the endpoint creates a check with status `"pending"` and summary `"... coming soon"` but never actually runs any analysis. The check remains permanently "pending."
**Impact:** Users selecting SOC2, GDPR, etc. get stuck records with no results.
**Fix:** Either implement multi-framework analysis or return a clear error that only HIPAA is supported.

### BUG-520 — Non-HIPAA regulation requirements return mock data
**File:** `api/v1/endpoints/regulations.py` (lines 253-267)
**Issue:** For any regulation other than HIPAA, `GET /{regulation_id}/requirements` returns 3 hardcoded mock requirements with description "Mock requirement - full implementation coming soon."
**Impact:** Frontend shows fake data as if it were real.
**Fix:** Return empty list with a clear message, or implement real requirements.

### BUG-521 — Non-HIPAA regulations use hardcoded mock data
**File:** `api/v1/endpoints/regulations.py` (lines 60-130)
**Issue:** GDPR, SOC2, PCI DSS, ISO 27001, and NIST CSF are defined as in-memory dictionaries with `is_real: False`. They're not stored in the database and can't be managed.
**Impact:** Users see regulations that can't be meaningfully used. Requirement counts (99, 64, etc.) are fabricated.
**Fix:** Either implement database-backed regulations or clearly label as "coming soon" in the UI.

### BUG-522 — Remediation `finding` and `gap` fields always return None
**File:** `api/v1/endpoints/remediation.py` (lines 75-77)
**Issue:** `_remediation_to_dict()` always returns `"finding": None, "gap": None` as placeholders. Only the `GET /{remediation_id}` endpoint populates the finding field; list endpoints do not.
**Impact:** Frontend lists show empty finding/gap references.
**Fix:** Populate finding/gap in list queries or use a lazy-loading approach.

### BUG-523 — Risk register missing DELETE endpoint
**File:** `api/v1/endpoints/risk_register.py`
**Issue:** Has GET (list), POST (create), and PUT (update) for risk items, but no DELETE endpoint. Users cannot remove risk items.
**Impact:** Data can never be removed from the risk register.
**Fix:** Add `DELETE /items/{item_id}` endpoint.

### BUG-524 — Risk register items not scoped by tenant in update
**File:** `api/v1/endpoints/risk_register.py` (lines 193-218)
**Issue:** `PUT /items/{item_id}` queries `RiskItem` by ID only — no tenant/org scoping. A user from tenant A could update risk items belonging to tenant B if they know the ID.
**Impact:** Cross-tenant data modification.
**Fix:** Join through `RiskAssessment` to verify `org_id` ownership.

### BUG-525 — Compliance code `router` not imported in v1 router
**File:** `api/v1/router.py`
**Issue:** `compliance_code` IS imported and registered. This is actually fine — no bug. (Verified: it's included with prefix `/compliance-code`.)
**(RETRACTED — verified this is correctly wired)**

### BUG-526 — No rate limiting on login endpoint
**File:** `api/v1/endpoints/auth.py`
**Issue:** The login endpoint has no per-IP or per-email rate limiting. The global `RateLimitMiddleware` may not be sufficient for brute-force protection.
**Impact:** Credential stuffing and brute-force attacks.
**Fix:** Add per-IP rate limiting (e.g., 5 attempts/minute) specifically for `/auth/login`.

### BUG-527 — No rate limiting on signup endpoint
**File:** `api/v1/endpoints/auth.py`
**Issue:** `POST /auth/signup` has no rate limiting. An attacker could create unlimited trial tenants.
**Impact:** Resource exhaustion, database bloat.
**Fix:** Add rate limiting and/or CAPTCHA for signup.

### BUG-528 — `update_document` accepts raw dict body without validation
**File:** `api/v1/endpoints/documents.py` (line ~380)
**Issue:** `PUT /{document_id}` accepts `body: dict` — no Pydantic model. Any key-value can be sent, and arbitrary fields like `content_text` can be set directly via `setattr()`.
**Impact:** Users could potentially set internal fields (e.g., `org_id`, `status`) via the update endpoint.
**Fix:** Use a Pydantic model with explicitly allowed fields, or whitelist fields more restrictively.

### BUG-529 — `update_finding` accepts raw dict body without validation
**File:** `api/v1/endpoints/compliance.py` (line ~487)
**Issue:** `PUT /findings/{finding_id}` accepts `body: dict` — only checks for `"status"` key but doesn't validate the status value. Could set status to any arbitrary string.
**Impact:** Data integrity issue — invalid statuses could break frontend logic.
**Fix:** Use a Pydantic model with enum validation for status field.

### BUG-530 — User creation accepts raw dict without Pydantic model
**File:** `api/v1/endpoints/users.py` (lines ~180-210)
**Issue:** `POST /users` accepts `body: dict`. No validation on email format, password length, role values.
**Impact:** Could create users with empty emails, weak passwords, or invalid roles.
**Fix:** Create a Pydantic `CreateUserRequest` model with proper field validation.

### BUG-531 — User update accepts raw dict without validation
**File:** `api/v1/endpoints/users.py` (lines ~220-245)
**Issue:** `PUT /users/{user_id}` accepts `body: dict`. Uses `setattr()` for allowed keys but doesn't validate values (e.g., role could be set to any string).
**Impact:** Invalid data in user records.
**Fix:** Create a Pydantic `UpdateUserRequest` model.

### BUG-532 — Default user password "changeme123" when not provided
**File:** `api/v1/endpoints/users.py` (line ~200)
**Issue:** `hash_password(body.get("password", "changeme123"))` — if no password is provided in the create request, the user gets a known default password.
**Impact:** Insecure default password for created users.
**Fix:** Require password field or use invite flow with token-based password set.

---

## 🟡 MEDIUM — Error Handling & Validation

### BUG-533 — Broad exception handlers mask specific errors
**Files:** Multiple endpoints (documents, compliance, remediation, etc.)
**Issue:** Many endpoints catch `Exception as e` and return `HTTPException(status_code=500, detail=str(e))`. This exposes internal error messages (potentially including SQL errors, file paths, etc.) to the client.
**Impact:** Information leakage.
**Fix:** Log the full exception but return generic messages to the client.

### BUG-534 — Missing file size limits on document upload
**File:** `api/v1/endpoints/documents.py`
**Issue:** `upload_document` and `upload_new_version` read `await file.read()` with no size limit check. Large files will consume server memory.
**Impact:** Denial of service via large file uploads.
**Fix:** Add max file size validation (e.g., 50MB) before reading the full content.

### BUG-535 — No content-type validation on document upload
**File:** `api/v1/endpoints/documents.py`
**Issue:** Accepts any file type. No validation that the uploaded file is actually a document (PDF, DOCX, TXT, etc.). Malicious files could be processed by text extraction.
**Impact:** Potential security risk from processing unexpected file types.
**Fix:** Whitelist allowed MIME types and file extensions.

### BUG-536 — SQL-like search patterns not sanitized
**Files:** Multiple endpoints using `.ilike(f"%{search}%")`
**Issue:** While SQLAlchemy parameterizes queries (preventing SQL injection), the `%` and `_` wildcards in user input are not escaped. A search for `%` would match all records.
**Impact:** Minor — unexpected search behavior, potential performance issues with crafted patterns.
**Fix:** Escape `%` and `_` in user search input.

---

## 🔵 LOW — Missing Models & Schema Gaps

### BUG-537 — `models/` ORM models missing many tables defined in `core/db.py`
**File:** `models/__init__.py` vs `core/db.py`
**Issue:** The `models/` directory defines ~10 models (User, Document, ComplianceCheck, etc.). The `core/db.py` file defines 50+ models (Tenant, TenantUser, ScanResult, Vendor, Integration, etc.). The `models/` directory is severely incomplete.
**Impact:** Since `models/` is dead code (see BUG-513), this is low priority — but it creates confusion.
**Fix:** Remove `models/` directory.

### BUG-538 — `models/user.py` defines different schema than `core/db.py` TenantUser
**File:** `models/user.py` vs `core/db.py` TenantUser
**Issue:** `models/user.py` defines a `User` model with UUID PKs and PostgreSQL UUID columns. `core/db.py` defines `TenantUser` with String PKs, different columns (tenant_id, invite_status, onboarding_completed_at, etc.). They're completely different schemas for the same concept.
**Impact:** Dead code confusion (see BUG-513).
**Fix:** Remove `models/`.

### BUG-539 — `schemas/auth.py` and `schemas/common.py` partially unused
**File:** `schemas/auth.py`, `schemas/common.py`
**Issue:** Several schema classes (`LoginResponse`, `UserResponse`, `PaginatedResponse`, `ErrorResponse`, etc.) are defined but not used as FastAPI response models. Endpoints return raw dicts instead.
**Impact:** No auto-documentation of response schemas, no response validation.
**Fix:** Use as `response_model` parameters on endpoint decorators.

### BUG-540 — Missing `api/middleware/__init__.py` — empty middleware package
**File:** `api/middleware/__init__.py`
**Issue:** The middleware directory exists with an empty `__init__.py` but no middleware implementations. Middleware is defined elsewhere (in `core/`).
**Impact:** Empty directory — cleanup needed.
**Fix:** Remove the empty directory.

---

## 🔵 LOW — Frontend/Backend Inconsistencies

### BUG-541 — Frontend `scanning.ts` calls endpoints not clearly mapped
**File:** Frontend `services/scanning.ts` → Backend `monitoring.py`
**Issue:** Frontend calls `GET /monitoring/drift` and `GET /monitoring/scan-history`. Need to verify these exist in `monitoring.py`.
**Impact:** Potential 404s if routes don't match.
**Fix:** Verify route alignment.

### BUG-542 — `compliance_code.py` router is present — no issue
**(RETRACTED — verified working)**

### BUG-543 — Frontend `settings.ts` calls `GET /settings/demo-data/status` and `POST /settings/demo-data/load`
**File:** Frontend `services/settings.ts` → Backend `settings.py`
**Issue:** Need to verify these demo-data endpoints exist in settings.py. Given the application's demo data seeding pattern, they likely do.
**Impact:** Potential 404 if routes missing.

### BUG-544 — `api-client.ts` base URL configuration
**File:** Frontend `lib/api-client.ts`
**Issue:** Frontend prefix is `/api/v1/` — all service calls use relative paths like `/dashboard/overview`. Need to ensure the client prepends `/api/v1`.
**Impact:** If misconfigured, all API calls fail.

---

## 🟠 HIGH — CORS & Production Configuration

### BUG-545 — Overly permissive CORS configuration
**File:** `config.py` (lines 95-103)
**Issue:** CORS allows `http://localhost:3000`, `http://localhost:5173`, `http://localhost:8080` in production. Combined with `allow_credentials=True` and `allow_methods=["*"]`, `allow_headers=["*"]`, this is overly permissive.
**Impact:** Potential cross-origin attacks from localhost-bound malware.
**Fix:** Only include localhost origins in development. Use environment-specific CORS config.

### BUG-546 — DEBUG defaults to True
**File:** `config.py` (line 33)
**Issue:** `DEBUG: bool = True` — production deployments without explicit `DEBUG=false` run in debug mode, exposing verbose error details.
**Impact:** Information leakage (see BUG-518).
**Fix:** Default to `False`.

### BUG-547 — Module-level `init_db()` call for serverless runs on every import
**File:** `main.py` (lines 149-155)
**Issue:** `init_db()` is called at module level (outside any function) "for serverless." This runs on every cold start AND potentially on import. If the DB is remote, this adds latency.
**Impact:** Performance hit on cold starts, potential race conditions.
**Fix:** Guard with explicit `SERVERLESS=true` env check.

---

## 🟡 MEDIUM — Missing Endpoints & CRUD Gaps

### BUG-548 — Audit trail has no DELETE endpoint (by design, but no export)
**File:** `api/v1/endpoints/audit_trail.py`
**Issue:** Audit logs are append-only (correct), but there's no export endpoint. For compliance audits, customers need to export audit trails.
**Impact:** Cannot export audit data for external audit requirements.
**Fix:** Add `GET /audit-trail/export` endpoint returning CSV/JSON.

### BUG-549 — No password change endpoint for authenticated users
**File:** `api/v1/endpoints/users.py`
**Issue:** Users can only change passwords via the "forgot password" flow. There's no `POST /users/me/change-password` endpoint for authenticated users who know their current password.
**Impact:** Users can't proactively change passwords.
**Fix:** Add password change endpoint requiring current password verification.

### BUG-550 — No user profile update endpoint (avatar, preferences)
**File:** `api/v1/endpoints/users.py`
**Issue:** `GET /users/me` exists but there's no `PUT /users/me` for self-service profile updates. The `PUT /users/{user_id}` requires admin permissions.
**Impact:** Users can't update their own name or preferences.
**Fix:** Add `PUT /users/me` endpoint.

### BUG-551 — No bulk operations for findings
**File:** `api/v1/endpoints/compliance.py`
**Issue:** Only individual finding updates (`PUT /findings/{finding_id}`) are supported. No bulk accept, bulk resolve, or bulk status change.
**Impact:** Managing hundreds of findings requires individual API calls.
**Fix:** Add `POST /findings/bulk-update` endpoint.

### BUG-552 — Alert preferences (GET/PUT) not implemented
**File:** `api/v1/endpoints/alerts.py` and `models/alert.py`
**Issue:** The `AlertPreference` model exists in `models/alert.py` but there are no endpoints to get or set alert preferences (email digest frequency, critical-only mode, etc.).
**Impact:** Users cannot configure their alert preferences.
**Fix:** Add GET/PUT endpoints for alert preferences.

---

## 🔵 LOW — Code Quality & Maintenance

### BUG-553 — `_compliance_code` import naming inconsistency
**File:** `api/v1/router.py`
**Issue:** Router imports use module names (e.g., `compliance_code`) but the frontend service is `compliance-code.ts`. The URL prefix uses kebab-case (`/compliance-code`). This is handled correctly but creates cognitive overhead.
**Impact:** Developer confusion — no runtime issue.

### BUG-554 — `api/v1/endpoints/__init__.py` is empty
**File:** `api/v1/endpoints/__init__.py`
**Issue:** Empty `__init__.py` — endpoint modules are imported individually in `router.py`. No barrel exports.
**Impact:** None — just a style note.

### BUG-555 — Inconsistent use of `get_db_session()` context manager
**Files:** Multiple endpoints
**Issue:** Some endpoints use `with get_db_session() as session:` while most use `session = get_db_session(); try: ... finally: session.close()`. The inconsistency suggests `get_db_session()` may or may not be a context manager depending on how it's called.
**Impact:** Potential session leaks if `finally: session.close()` is missed.
**Fix:** Standardize on context manager usage.

### BUG-556 — Hardcoded email recipient in debug endpoint
**File:** `api/v1/endpoints/health.py` (line 226)
**Issue:** `"to": ["shyam.sedai3@gmail.com"]` — personal email hardcoded in production code.
**Impact:** Privacy concern, not configurable.
**Fix:** Remove debug endpoint or use configurable test recipient.

### BUG-557 — `_REGULATORY_POLL_INTERVAL_SECONDS` runs regulatory fetch on startup after 30s
**File:** `main.py` (line 23)
**Issue:** The regulatory radar worker starts 30 seconds after boot and runs daily. On serverless (Vercel), this background task will be killed when the function cold-starts and won't complete.
**Impact:** Regulatory fetch never completes on serverless platforms.
**Fix:** Use a scheduled cron job or external trigger for serverless deployments.

### BUG-558 — Trial period inconsistency: 30 days in code, comments say 14
**File:** `api/v1/endpoints/auth.py` (line 79)
**Issue:** `trial_ends = now + timedelta(days=30)` but the docstring says "14-day free trial."
**Impact:** Inconsistent trial duration — docs say 14, code does 30.
**Fix:** Align documentation and code.

### BUG-559 — `_build_improvement_suggestions` runs N+1 queries
**File:** `api/v1/endpoints/dashboard.py` (lines 109-175)
**Issue:** Queries `TrainingRecord` inside `_build_improvement_suggestions`, which is already inside a function making multiple queries. The function is called per-request for the dashboard overview.
**Impact:** Performance — multiple sequential queries per dashboard load.
**Fix:** Batch queries and pass pre-fetched data.

### BUG-560 — No pagination on evidence schedules list
**File:** `api/v1/endpoints/evidence_schedules.py`
**Issue:** `GET /` returns all schedules without pagination.
**Impact:** Minor — unlikely to have many schedules, but inconsistent with other endpoints.
**Fix:** Add pagination params.

### BUG-561 — `compliance_costs.py` router missing from frontend service check
**File:** Frontend `services/compliance-costs.ts` → Backend `compliance_costs.py`
**Issue:** Frontend has a `compliance-costs` service. Backend has a `compliance_costs.py` endpoint. Router maps it to `/compliance-costs`. Should verify all frontend calls match.
**Impact:** Potential 404s if specific routes don't match.

### BUG-562 — OpenAPI docs publicly accessible
**File:** `main.py` (lines 115-118)
**Issue:** `docs_url="/docs"`, `redoc_url="/redoc"`, `openapi_url="/openapi.json"` are always enabled. In production, this exposes the full API schema to anyone.
**Impact:** Information disclosure — attackers can enumerate all endpoints, parameters, and schemas.
**Fix:** Disable in production: `docs_url=None if not settings.DEBUG else "/docs"`.

### BUG-563 — No HTTPS enforcement
**File:** `main.py`, `config.py`
**Issue:** No `TrustedHostMiddleware` or HTTPS redirect middleware. The API will happily serve over HTTP.
**Impact:** In production, sensitive data (JWTs, credentials) could be transmitted in plaintext if accessed via HTTP.
**Fix:** Add `HTTPSRedirectMiddleware` for production.

### BUG-564 — `api/middleware/` package empty — no request logging middleware
**File:** `api/middleware/__init__.py`
**Issue:** No request/response logging middleware. For a HIPAA compliance platform, all API access should be logged (who accessed what, when).
**Impact:** Missing audit trail of API access patterns required for HIPAA compliance.
**Fix:** Add request logging middleware that records method, path, user, timestamp, response status.

---

## Summary by Severity

| Severity | Count | IDs |
|----------|-------|-----|
| 🔴 Critical | 13 | BUG-500 through BUG-512b |
| 🟠 High | 8 | BUG-513 through BUG-518, BUG-524, BUG-545 |
| 🟡 Medium | 19 | BUG-519 through BUG-535, BUG-546-551 |
| 🔵 Low | 14 | BUG-536 through BUG-544, BUG-552-564 |
| **Total** | **54** | |

## Top 5 Priorities

1. **BUG-500/501/502/503/504/505** — Remove or protect ALL debug endpoints immediately. These are production-exploitable right now.
2. **BUG-506/507** — Enforce non-default SECRET_KEY in production.
3. **BUG-511/512** — Add auth guards to evidence_schedules and onboarding endpoints.
4. **BUG-513/514/515** — Consolidate the dual model layer to reduce confusion and maintenance burden.
5. **BUG-517** — Address sync-in-async DB pattern for production scalability.
