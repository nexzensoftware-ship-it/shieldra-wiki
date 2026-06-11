# Shieldra Security Audit — 2026-04-18

**Scope:** `apps/api/`, `apps/web/`, `apps/landing/` (no `apps/worker/` in repo).
**Method:** Static review only — no exploits attempted, no files modified.
**Reviewer lens:** Multi-tenant HIPAA SaaS, so cross-tenant leaks and auth bypass are P0 by default.
**Baseline verdict:** No P0 exploitable-today findings confirmed. Several P1 auth-layer weaknesses that materially reduce defense-in-depth and should be fixed before the next external audit cycle. Tenant isolation on DB-scoped endpoints is consistently enforced.

---

## Executive summary

Tenant isolation is the single biggest risk for a HIPAA-compliance SaaS, and Shieldra does the important things right: every tenant-scoped table carries `tenant_id` (and usually `org_id`), and the core access path — `require_tenant` / `require_permission` — enforces token-blocklist, token-type, tenant-status, and permission checks with a short-TTL cache. Admin routes are split under a separate `ADMIN_SECRET_KEY` signer with their own `require_admin` / `require_super_admin` guards. Config refuses to boot in non-debug with known weak keys. CORS is an allowlist, not a wildcard. CSP/HSTS/X-Frame-Options are set. File uploads enforce MIME allowlist, extension allowlist, 50 MB cap, and a per-tenant storage quota. Downloads go through R2 presigned URLs after an `org_id` ownership check.

Where the story weakens is a **parallel weak auth path**: helpers in `apps/api/src/core/tenant_utils.py` (`get_tenant_id_from_request`, `get_user_id_from_request`, `get_user_email_from_request`) decode JWTs with only the HS256 signature check — they do **not** consult the Redis blocklist, do **not** enforce `type="access"`, and do **not** check tenant/user status. About forty endpoint files import these helpers. For the endpoints that also sit behind `Depends(require_permission(...))` the helpers are just redundant (the Depends already validated the request), but for the `/users/me` family they are the *primary* auth path. That means a **logged-out access token can still read / update the profile**, a **refresh token can be presented as an access token to /me**, and a **deactivated user can continue to call /me and change their password with just the old token in memory**. This is a P1, not a P0, because an attacker still needs a valid token to start with — but for a HIPAA product it is a session-revocation defect that is almost certainly caught in a SOC 2 audit.

Other P1 items: `/auth/refresh` validates the refresh token signature and `type` but does not call the blocklist and does not check `user.is_active` or tenant status, so a stolen refresh token (or one revoked via logout) keeps minting fresh access tokens until natural expiry. Admin `/admin/api/auth/login` has no rate limit — brute-force against a known admin email is bounded only by bcrypt cost and the attacker's concurrency budget. Public `/api/v1/contact` and `/api/v1/newsletter/subscribe` have no rate limit and send outbound email with user-supplied values, so they can be abused as spam amplifiers against `support@shieldra.ai` and any third party. Admin bearer tokens live in `localStorage` (persistent, XSS-readable) while tenant tokens live in `sessionStorage` — the admin console should match or beat the tenant console, not fall behind it.

Nothing in the repo evaluates user-supplied code. No `eval`, `exec`, `pickle.loads`, `yaml.load` (unsafe), `subprocess(..., shell=True)`, `os.system`, or `dangerouslySetInnerHTML` was found in application code. All outbound HTTP is to pinned base URLs (GitHub, KnowBe4 regional, Resend) so there is no SSRF surface today. Every `text(...)` SQL fragment I reviewed uses bound parameters for user input and only interpolates hardcoded table/column names. CSP forbids inline scripts and locks `frame-ancestors 'none'`. The weakest crypto is bcrypt at gensalt default (cost 12) — fine. `ENCRYPTION_KEY` is required in production via config validation. `PATTERN_ORG_SALT` is required to be non-default in production.

Bottom line: the frame is solid. Fix the five P1s and the posture is auditor-presentable. The P2s are hygiene. The P3s are defense-in-depth.

---

## Findings

### P0 — Exploitable today

**None confirmed.** I found no route that returns cross-tenant data, no admin route without an admin guard, no unauthenticated path to an admin primitive, no SQL injection, no command injection, no deserialization gadget, no SSRF primitive, and no secret committed to the repo.

### P1 — High-risk pattern, fix before next audit

| # | Finding | Location | Why it matters | Exploit sketch (not executed) |
|---|---|---|---|---|
| P1-1 | `/users/me`, `PUT /users/me`, `POST /users/me/change-password` use `get_user_id_from_request` + `get_tenant_id_from_request` instead of `Depends(require_tenant)`. These helpers skip the Redis token blocklist, do not assert `token.type == "access"`, and do not check `user.is_active`. | `apps/api/src/api/v1/endpoints/users.py:135-293`; helpers at `apps/api/src/core/tenant_utils.py:17-88` | Session revocation is broken on the most sensitive self-service endpoints. Logout/blocklist is a no-op on `/me`. A deactivated user with a still-valid token can continue to read their profile and change their password. A refresh token presented in the `Authorization: Bearer` header satisfies the helper (it only checks signature, not `type`). | Call `POST /api/v1/auth/logout` with access token `T`. `T` is added to the Redis blocklist. Immediately `GET /api/v1/users/me` with the same `T` — it succeeds, because the route never calls `is_token_blocked(T)`. Same `T` works on `PUT /users/me` and `POST /users/me/change-password` (old password required, but old password is what the attacker *has*). |
| P1-2 | `POST /auth/refresh` decodes the refresh token and checks `type == "refresh"` but does not call `is_token_blocked(refresh_token_value)`, does not check `user.is_active`, and does not check tenant status. | `apps/api/src/api/v1/endpoints/auth.py:837-905` | A stolen refresh token keeps minting access tokens for the full refresh window (2 days) even after logout or account deactivation. For an HttpOnly cookie this mostly matters for deactivation / offboarding and for incident response after a successful exfiltration. | Offboard a user (set `is_active=False`). Their still-valid refresh token, replayed to `/auth/refresh`, returns a fresh access token carrying the same `tenant_id` / `role`, re-granting access for up to `REFRESH_TOKEN_EXPIRE_DAYS` (2 days). |
| P1-3 | Admin `POST /admin/api/auth/login` has no rate limit. Tenant login is rate-limited at 5/min/IP (`_check_rate_limit`); admin login is not. | `apps/api/src/api/admin/auth.py:215-…` (decorator at 215). Rate limit helper exists but only used for `/forgot-password` at line 530. | Admin credential stuffing / brute force against a known admin email is bounded only by bcrypt cost (~300ms) and the attacker's parallelism. At 10 threads that is thousands of guesses per hour from a single IP. Admin compromise means cross-tenant PHI access. | From one IP, POST `{email: known-admin, password: guess_i}` repeatedly. No 429. Only the bcrypt compare slows the attacker; there is no lockout, no IP ban, no CAPTCHA. |
| P1-4 | Admin bearer token is stored in `localStorage` (`admin_token`), not `sessionStorage`. Tenant tokens use `sessionStorage`. | `apps/web/src/app/routes/admin/login.tsx:39-41`, `apps/web/src/app/routes/admin/_admin-layout.tsx:27-29`, `apps/web/src/services/admin.ts:14-25` | `localStorage` survives tab close and is readable by any script on the same origin. Given the blast radius of admin tokens (multi-tenant read), they should have *stronger* storage than tenant tokens, not weaker. An XSS on the admin domain/path persists until the user manually logs out. | Any stored-XSS or supply-chain script executes `fetch('/api/v1/...', {headers:{Authorization: 'Bearer '+localStorage.admin_token}})` and exfiltrates. Because the admin UI is under the same origin as the tenant app, the CSP/headers are shared — if an XSS slips in anywhere on `www.shieldra.ai`, the admin token goes with it. |
| P1-5 | `/api/v1/legal/me/accept`, `/api/v1/legal/me/consent-status`, `/api/v1/legal/announcements/*/dismiss`, and the other self-service legal endpoints use `get_user_id_from_request` only — same weak helper as P1-1. Also: `POST /api/v1/legal/privacy-requests` is public and unauthenticated. | `apps/api/src/api/v1/endpoints/legal.py` (same helper import; plus public `privacy-requests` route) | Same session-revocation gap as P1-1. Plus: the public DSAR/privacy-request endpoint has no rate limit, so an attacker can flood the privacy-request queue (which legal is contractually obligated to acknowledge within a window) and tie up legal operations. | (a) Replay of blocklisted token against `/legal/me/consent-status` returns data. (b) Scripted POST to `/legal/privacy-requests` at 100 req/s with rotating fake-resident strings floods the compliance inbox and the `PrivacyRequest` table. |

### P2 — Hygiene / abuse risk

| # | Finding | Location | Why it matters |
|---|---|---|---|
| P2-1 | Public `POST /api/v1/contact` has no rate limit and triggers an outbound Resend email to `support@shieldra.ai` with user-supplied `html_body` content (escaped by the template but not bounded in size). | `apps/api/src/api/v1/endpoints/public_contact.py:24-76` | Spam/DoS against the support inbox. No CAPTCHA, no per-IP cap. At 10 req/s this fills the inbox and costs Resend credits. |
| P2-2 | Public `POST /api/v1/newsletter/subscribe` has no rate limit and triggers a welcome email to the user-supplied address. | `apps/api/src/api/v1/endpoints/public_contact.py:86-153` | Email-bomb amplifier: attacker POSTs `{email: victim@example.com}` a few thousand times; each new subscribe sends a welcome email from Shieldra. Abuse signal to inbox providers, reputation hit for `@shieldra.ai` sender domain, unsubscribe handling required. |
| P2-3 | `GET /api/v1/users/roles/list` is unauthenticated. | `apps/api/src/api/v1/endpoints/users.py:525` (no `Depends`) | Low-severity information disclosure: role slugs + descriptions leaked without auth. Normally fine, but it also reveals the set of admin-adjacent role names (`officer`, `owner`, etc.) which helps target social engineering. |
| P2-4 | `get_tenant_id_from_request` is called *after* `Depends(require_permission(...))` in `tprm.py`, `sso.py`, `enterprise_integrations.py`. Not a vuln today (the `Depends` already authenticated), but the same helper is the *primary* guard elsewhere. The dual pattern invites future mistakes where someone copies a handler and drops the `Depends`. | `apps/api/src/api/v1/endpoints/tprm.py:195-…`, `sso.py:89-…` | Maintenance hazard. Standardize on `ctx.tenant_id` / `ctx.user_id` everywhere so the weak helper can be deleted. |
| P2-5 | Admin user model lookup in `admin_users.page.tsx:362` parses `localStorage.admin_user` with `JSON.parse` inside a `try/catch`. Together with P1-4, any XSS gets both the token *and* a cached admin identity. | `apps/web/src/app/routes/admin/admin-users.page.tsx:362` | Defense-in-depth degradation, not a direct exploit. |

### P3 — Defense-in-depth

| # | Finding | Location | Why it matters |
|---|---|---|---|
| P3-1 | Admin client route guard is a pure client-side `localStorage` existence check (`beforeLoad: () => { if (!localStorage.admin_token) redirect('/admin/login') }`). Any non-empty string passes. | `apps/web/src/app/routes/admin/_admin-layout.tsx:26-31` | Not a vulnerability — the server is the real guard. But a stronger pattern is to call `/admin/api/auth/me` in `beforeLoad` and let the server say yes/no. Prevents a confused admin from thinking they are logged in when the token is already rejected by the server. |
| P3-2 | `bcrypt` gensalt default cost (12) is fine today but should be bumped as hardware gets faster. Document the cost knob in ops runbooks. | `apps/api/src/core/security.py` | Future-proofing. |
| P3-3 | `list_users` handler has `if tenant_id:` conditional filters. Today `require_permission` guarantees `tenant_id` is present, but the defensive pattern should be "fail closed if `tenant_id` is falsy" not "silently drop the tenant filter." | `apps/api/src/api/v1/endpoints/users.py:95-120` | Contract drift hazard — if the dependency chain ever changes, the handler degrades to cross-tenant listing. |
| P3-4 | `get_org_id_for_tenant` auto-creates an `Organization` row if missing. Defensive, but also means a request with a tenant_id that happens to exist can cause an Organization write. Safe given `tenant_id` is validated upstream by `require_tenant`. Keep in mind when auditing write paths. | `apps/api/src/core/tenant_context.py` (`get_org_id_for_tenant`) | Surprise side-effect, not a vuln. |
| P3-5 | `apps/web/src/app/routes/admin/leads.page.tsx:17` reads `localStorage.admin_token` directly instead of going through a single helper. Same concern as P1-4, but worth noting that admin token access is scattered across 4+ files, making future rotation to HttpOnly cookies mechanical. | `apps/web/src/app/routes/admin/leads.page.tsx:17`, `admin/_admin-layout.tsx:27`, `admin/login.tsx:39`, `services/admin.ts:14` | Refactor cost. |
| P3-6 | `main.py` CORS allows credentials and uses an allowlist — correct. Verify at deploy time that `CORS_ORIGINS` env var is set to the production origins only and does not include `*` or `null`. | `apps/api/src/main.py` (CORS middleware) | Operational check. |

---

## Tenant-isolation spot-check

Methodology: for each high-value mutating route, verify (a) an auth dependency is present, (b) the dependency is the strong one (`require_tenant` / `require_permission` / `require_admin`), and (c) every DB query filters on `tenant_id` or `org_id` derived from the authenticated context.

| Route (file:line) | Auth guard | tenant/org filter on queries | Verdict |
|---|---|---|---|
| `POST /api/v1/documents` upload (`documents.py`) | `Depends(require_permission("documents.create"))` | `Document.org_id = org_id` on insert | PASS |
| `GET /api/v1/documents/{id}/download` (`documents.py`) | `Depends(require_permission("documents.view"))` | `.filter(Document.id==id, Document.org_id==org_id)` | PASS |
| `DELETE /api/v1/documents/{id}` (`documents.py`) | `Depends(require_permission("documents.delete"))` | `org_id` filter + FK cascade with parameterized `text()` | PASS |
| `POST /api/v1/incidents` (`incidents.py:584`) | `Depends(require_permission("incidents.create"))` | `org_id = get_org_id_for_tenant(ctx.tenant_id)` on insert | PASS |
| `GET /api/v1/incidents/{id}` (`incidents.py:934`) | `Depends(require_permission("incidents.view"))` | `org_id` scoped | PASS |
| `PUT /api/v1/incidents/{id}` (`incidents.py:1023`) | `Depends(require_permission("incidents.edit"))` | `org_id` scoped | PASS |
| `POST /api/v1/remediation` (`remediation.py:111`) | `Depends(require_permission("remediation.create"))` | `ctx.tenant_id` / `org_id` scoped | PASS |
| `GET /api/v1/remediation/{id}` (`remediation.py:358`) | `Depends(require_permission("remediation.view"))` | tenant-scoped | PASS |
| `DELETE /api/v1/remediation/{id}` (`remediation.py:455`) | `Depends(require_permission("remediation.delete"))` | tenant-scoped | PASS |
| `POST /api/v1/vendors` (`vendors.py`) | `Depends(require_permission("vendors.create"))` | `Vendor.org_id=org_id` | PASS |
| `GET/PUT/DELETE /api/v1/vendors/{id}` (`vendors.py:451-907`) | `Depends(require_permission("vendors.view|edit|delete"))` | every by-id query uses `.filter(Vendor.id==id, Vendor.org_id==org_id)` | PASS |
| `GET/POST/PUT /api/v1/evidence/{id}` (`evidence.py`) | `Depends(require_permission("evidence.*"))` | `.filter(Evidence.id==id, Evidence.org_id==org_id)` | PASS |
| `GET/POST /api/v1/tprm/dashboard`, `ai-review`, etc. (`tprm.py`) | `Depends(require_permission("vendors.*"))` | queries filter on `tenant_id = get_tenant_id_from_request(request)` — redundant extraction but upstream `Depends` already authenticated | PASS (redundant, see P2-4) |
| `GET/POST/PUT/DELETE /api/v1/sso/config` (`sso.py`) | `Depends(require_permission("settings.manage"))` | tenant-scoped | PASS (redundant extraction) |
| `POST /api/v1/mfa/totp/setup`, `/verify`, `/disable`, `/backup-codes` | `Depends(require_tenant)` | user-scoped via `ctx.user_id` | PASS |
| `GET /api/v1/users` list (`users.py:85`) | `Depends(require_permission("users.view"))` | `tenant_id` filter (but behind a `if tenant_id:` — see P3-3) | PASS (hardening recommended) |
| `GET /api/v1/users/me` (`users.py:135`) | none — uses `get_user_id_from_request` + `get_tenant_id_from_request` | user/tenant scoped after weak decode | FAIL — P1-1 |
| `PUT /api/v1/users/me` (`users.py:196`) | none — weak helpers only | user/tenant scoped after weak decode | FAIL — P1-1 |
| `POST /api/v1/users/me/change-password` (`users.py:249`) | none — weak helpers only | user/tenant scoped after weak decode | FAIL — P1-1 |
| `POST /api/v1/auth/refresh` (`auth.py:837`) | signature + `type=="refresh"` only | n/a | FAIL — P1-2 (no blocklist, no `is_active`) |
| `POST /api/v1/legal/me/*` (`legal.py`) | weak helpers only | user-scoped after weak decode | FAIL — P1-5 |
| `POST /api/v1/legal/privacy-requests` (`legal.py`) | none (public) | n/a | FAIL — P1-5 (no rate limit) |
| `POST /api/v1/contact` (`public_contact.py`) | none (public, by design) | n/a | PASS for auth, FAIL for abuse — P2-1 |
| `POST /api/v1/newsletter/subscribe` (`public_contact.py`) | none (public, by design) | n/a | PASS for auth, FAIL for abuse — P2-2 |
| All `/admin/api/*` mutating routes (tenants, packages, ai_config, billing, analyzer, learning_intelligence, baa_templates, legal, errors, monitoring) | `Depends(require_admin)` or `Depends(require_super_admin)` (verified via grep across all sub-routers) | AdminUser is a separate model, admin routes do not query tenant tables directly except via explicit `tenant_id=<param>` | PASS |

Cross-tenant leak probability on reviewed routes: **zero confirmed**. Every tenant-scoped `Model` class (`Document`, `Finding`, `Gap`, `Evidence`, `Remediation`, `Vendor`, `Incident`, `Organization`, `AuditLog`, `VendorAIReview`, `VendorMonitoring`, `VendorLifecycle`, `VendorContract`) carries both `tenant_id` and `org_id` columns with FK + index, and the filters on those columns are consistent.

---

## Secrets scan

| Check | Result |
|---|---|
| `sk_live_` / `sk_test_` string literals in repo | Not found outside config comments describing Stripe format |
| AWS `AKIA*` keys | Not found |
| Google `AIza*` keys | Not found |
| `-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----` | Not found |
| Hardcoded `api_key = "…"` / `SECRET = "…"` with ≥20-char literal | Not found |
| `.env` / `.env.local` committed | Not committed (checked via git status and `.gitignore`) |
| `DATABASE_URL` with credentials in code | Only the SQLite default `sqlite:///./compliance_vision.db` |
| Weak `SECRET_KEY` fallback | Rejected at startup by `config.py`'s `WEAK_KEY_PATTERNS = ["change-me", "change-in-production", "12345", "local-dev", "example", "placeholder"]` when `DEBUG=False` |
| Weak `ADMIN_SECRET_KEY` fallback | Rejected at startup by same validator |
| `ENCRYPTION_KEY` required in prod | Yes — config refuses to boot without it in non-debug |
| `PATTERN_ORG_SALT` non-default in prod | Yes — `main.py` startup checks for default and refuses in non-dev |
| Secrets leaked via `console.log` on frontend | Not found — no `console.log` containing `token` / `password` / `secret` |

One residual watch-item: `apps/api/src/config.py` declares `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `VOYAGE_API_KEY` with `= ""` defaults. Good — these are env-sourced only. Verify at deploy time that Railway env has the expected non-empty values for production and that they are not logged in the app's structured logs.

---

## Admin-route coverage

Admin router mounted at `/admin/api` in `apps/api/src/api/admin/router.py`. Eleven sub-routers, all mutating routes guarded:

| Sub-router | File | Auth guard pattern |
|---|---|---|
| auth | `admin/auth.py` | Public: `/login`, `/forgot-password` (rate-limited), `/reset-password` (token-gated), `/bootstrap` (BOOTSTRAP_SECRET + zero-admins precondition, `include_in_schema=False`). Authenticated: `/me`, `/logout` use `Depends(require_admin)`. **Gap: `/login` has no rate limit — see P1-3.** |
| tenants | `admin/tenants.py` | All mutating routes `Depends(require_admin)`; destructive tenant deletion gated behind `Depends(require_super_admin)`. |
| packages | `admin/packages.py` | `Depends(require_super_admin)` on create/update/delete; `Depends(require_admin)` on list/get. |
| monitoring | `admin/monitoring.py` | `Depends(require_admin)` on all. |
| ai_config | `admin/ai_config.py` | `Depends(require_super_admin)` on writes. |
| billing | `admin/billing.py` | `Depends(require_admin)` — some reports gated super-admin. |
| errors | `admin/errors.py` | `Depends(require_admin)`. |
| analyzer | `admin/analyzer.py` | `Depends(require_admin)`. |
| learning_intelligence | `admin/learning_intelligence.py` | `Depends(require_super_admin)` on config writes. |
| baa_templates | `admin/baa_templates.py` | `Depends(require_super_admin)` on writes. |
| legal | `admin/legal.py` | `Depends(require_admin)` on DSAR handling; `Depends(require_super_admin)` on announcement publish. |

`AdminUser` is a separate SQLAlchemy model from `TenantUser`. Admin JWTs are signed with `settings.ADMIN_SECRET_KEY` (distinct from `settings.SECRET_KEY`) and carry `type: "admin_access"`. `require_admin` verifies signature on `ADMIN_SECRET_KEY`, asserts `type == "admin_access"`, checks `AdminUser.is_active`, and checks the Redis blocklist. `require_super_admin` additionally asserts `admin_user.role == "super_admin"`. Bootstrap is gated behind `BOOTSTRAP_SECRET` env var, requires zero existing admins, and is hidden from OpenAPI.

**Admin-route coverage verdict: PASS, except for the missing rate limit on `/admin/api/auth/login` (P1-3) and the `localStorage` admin token (P1-4).**

---

## Recommended fixes (prioritized)

1. **P1-1 / P1-5 (same root cause).** Delete `get_tenant_id_from_request`, `get_user_id_from_request`, and `get_user_email_from_request` from `tenant_utils.py`. Replace every call site with `ctx: TenantContext = Depends(require_tenant)` and read `ctx.tenant_id` / `ctx.user_id` / `ctx.user_email`. For `/users/me` family specifically, switch to `Depends(require_tenant)` and add `if not user.is_active: raise HTTPException(401)` in the handler. This one refactor closes P1-1, P1-5, and P2-4.
2. **P1-2.** In `/auth/refresh`, call `is_token_blocked(refresh_token_value)` before issuing new tokens and re-check `user.is_active` and `tenant.status in ("active","trial","pending_setup")`. Also blocklist the *old* refresh JTI on rotation so a stolen refresh can't be used twice.
3. **P1-3.** Add `_check_rate_limit(client_ip)` to `/admin/api/auth/login` with a stricter threshold than the tenant login (e.g. 3/min/IP + 10/hour/IP). Add a per-account lockout after N failed attempts using a Redis counter keyed on email.
4. **P1-4.** Move admin tokens to `sessionStorage` at minimum. Better: put the admin refresh in an HttpOnly, Secure, SameSite=Strict cookie scoped to `/admin/api` and let the admin `/login` response not return the bearer in JSON at all — mint a short-lived access cookie too.
5. **P2-1 / P2-2.** Add a per-IP rate limit to `/api/v1/contact` (e.g. 3/hour/IP) and `/api/v1/newsletter/subscribe` (e.g. 3/hour/IP + email confirmation before first newsletter send, i.e. double opt-in). CAPTCHA on both.
6. **P2-3.** Require any authenticated user for `/users/roles/list`. Low cost, trivial fix.
7. **P3-3.** In `list_users`, change `if tenant_id:` to `if not tenant_id: raise HTTPException(401)` so the handler fails closed.

---

## What I did not try to exploit

Per the scope rules, I did not attempt live exploitation. All findings are derived from static review of the checked-in source at `/Users/shyamsedai/Documents/Compliance Vision AI/` on 2026-04-18. Numbers of request/second and token lifetimes referenced in exploit sketches are the documented limits from the code, not measured values.

---

## Files referenced (absolute paths)

- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/core/tenant_utils.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/core/tenant_context.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/core/security.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/core/security_headers.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/config.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/main.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/auth.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/users.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/legal.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/public_contact.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/documents.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/incidents.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/remediation.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/vendors.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/evidence.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/tprm.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/sso.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/mfa.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/invites.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/v1/endpoints/enterprise_integrations.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/admin/auth.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/api/src/api/admin/router.py`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/lib/api-client.ts`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/services/admin.ts`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/app/routes/admin/login.tsx`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/app/routes/admin/_admin-layout.tsx`
- `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/hooks/use-auth.ts`
