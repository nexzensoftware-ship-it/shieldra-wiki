# 🛡️ Shieldra AI — Security Audit Report

**Auditor:** Alchi (Security Auditor & Dependency Scanner)
**Date:** 2026-04-01
**Scope:** Full application stack (FastAPI backend, React frontend, infrastructure)
**Classification:** CONFIDENTIAL

---

## Executive Summary

Shieldra AI demonstrates **solid security foundations** — environment-based config, Fernet field-level encryption, bcrypt password hashing, blockchain-style audit integrity, and comprehensive security headers. However, several **HIGH and CRITICAL** findings require immediate attention before production deployment, particularly around default credentials, dependency vulnerabilities, and HIPAA compliance gaps.

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 4 |
| 🟠 HIGH | 7 |
| 🟡 MEDIUM | 8 |
| 🔵 LOW | 5 |
| **Total** | **24** |

---

## 1. Dependency Vulnerability Matrix

### 1.1 NPM Dependencies (Frontend)

| Package | Severity | Vulnerability | CVSS | Fix Available |
|---------|----------|---------------|------|---------------|
| `lodash` ≤4.17.23 | 🟠 HIGH | Code Injection via `_.template` (GHSA-r5fr-rjxr-66jc) | 8.1 | ✅ Yes |
| `lodash` ≤4.17.23 | 🟡 MODERATE | Prototype Pollution via `_.unset`/`_.omit` (GHSA-f23m-r3pf-42rh) | 6.5 | ✅ Yes |
| `lodash-es` ≤4.17.23 | 🟠 HIGH | Code Injection via `_.template` | 8.1 | ✅ Yes |
| `lodash-es` ≤4.17.23 | 🟡 MODERATE | Prototype Pollution | 6.5 | ✅ Yes |
| `picomatch` | 🟠 HIGH | ReDoS vulnerability | — | ✅ Yes |

**npm audit summary:** 0 critical, 4 high, 1 moderate → **5 total vulnerabilities**

### 1.2 Python Dependencies (Backend)

| Package | Concern | Risk |
|---------|---------|------|
| `python-jose[cryptography]` ≥3.3.0 | Unmaintained; recommend migration to `PyJWT` or `python-jose` fork | 🟡 MEDIUM |
| `psycopg2-binary` ≥2.9.0 | Root `requirements.txt` uses `psycopg2-binary` but `pyproject.toml` uses `asyncpg` — mismatch | 🔵 LOW |
| `pypdf` ≥4.0.0 | Only in root `requirements.txt`, not in `pyproject.toml` — potentially unused | 🔵 LOW |
| `python-docx` ≥1.0.0 | Only in root `requirements.txt` — potentially unused | 🔵 LOW |
| `cryptography` ≥42.0.0 | Only in root `requirements.txt` — duplicated via `python-jose[cryptography]` | 🔵 INFO |

### 1.3 Dependency Duplication / Cleanup

The root `requirements.txt` and `apps/api/pyproject.toml` have **divergent dependency lists**:

- **Root only:** `psycopg2-binary`, `pypdf`, `python-docx`, `cryptography`, `python-dotenv`, `resend`
- **pyproject.toml only:** `uvicorn[standard]`, `asyncpg`, `alembic`, `celery`, `boto3`
- **Both:** `fastapi`, `pydantic`, `sqlalchemy`, `redis`, `httpx`, `structlog`, `anthropic`, `openai`, `networkx`

**Recommendation:** Consolidate to single source of truth (`pyproject.toml`). Remove root `requirements.txt` or make it a thin wrapper.

---

## 2. Security Findings

### 🔴 CRITICAL Findings

#### C-1: Default Credentials in Docker Compose
**File:** `infrastructure/docker-compose.yml`
**Risk:** Default passwords shipped in configuration

```yaml
SECRET_KEY: ${SECRET_KEY:-change-me-in-production-super-secret-key-12345}
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
```

While these use env-var fallbacks (good), the fallback values are predictable. The `SECRET_KEY` default contains `change-me` which the app does warn about at startup — but **does not refuse to start**.

**Impact:** If deployed without overriding env vars, JWT tokens are signed with a known key, allowing forged authentication.

**Remediation:** Make SECRET_KEY **required** (no fallback) in non-development environments. Fail startup hard.

---

#### C-2: Ephemeral Encryption Key Auto-Generation
**File:** `apps/api/src/core/encryption.py`

```python
key = Fernet.generate_key().decode()
logger.warning("ENCRYPTION_KEY not set — auto-generated an ephemeral key...")
```

If `ENCRYPTION_KEY` is not set, the system auto-generates a random key per process. In serverless (Vercel), **each cold start gets a different key**, making previously encrypted data (PHI, API keys) **permanently unreadable**.

**Impact:** Data loss and data corruption for encrypted fields. HIPAA violation — encrypted PHI becomes inaccessible.

**Remediation:** Fail startup in production if `ENCRYPTION_KEY` is empty. Add to `validate_secrets()`.

---

#### C-3: MinIO Default Credentials in Config Defaults
**File:** `apps/api/src/config.py`

```python
MINIO_ACCESS_KEY: str = "minioadmin"
MINIO_SECRET_KEY: str = "minioadmin"
MINIO_USE_SSL: bool = False
```

S3-compatible storage holding compliance documents defaults to `minioadmin/minioadmin` with **SSL disabled**. Documents containing PHI would be stored unencrypted in transit.

**Impact:** Unauthorized access to stored compliance documents. PHI exposure in transit.

**Remediation:** Remove defaults. Require env vars in production. Force `MINIO_USE_SSL=True`.

---

#### C-4: Redis Without Authentication
**File:** `infrastructure/docker-compose.yml`

```yaml
redis:
  command: redis-server --appendonly yes
```

Redis has **no password** (`--requirepass` not set). Stores rate limiting data and potentially cached session data.

**Impact:** Any network-adjacent attacker can read/write Redis data, potentially bypassing rate limits or injecting cached data.

**Remediation:** Add `--requirepass ${REDIS_PASSWORD}` to Redis command. Update `REDIS_URL` to include auth.

---

### 🟠 HIGH Findings

#### H-1: JWT Algorithm Not Restricted on Decode
**File:** `apps/api/src/core/security.py`

```python
payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
```

While `algorithms` is specified (good), `python-jose` has had historical vulnerabilities. The `ALGORITHM` setting defaults to `HS256` which is acceptable, but there's no validation that `ALGORITHM` can't be changed to `none` via environment variable.

**Remediation:** Hardcode `algorithms=["HS256"]` in decode, or validate ALGORITHM against an allowlist at startup.

---

#### H-2: CORS Wildcard Methods and Headers
**File:** `apps/api/src/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

`allow_methods=["*"]` and `allow_headers=["*"]` with `allow_credentials=True` is overly permissive.

**Remediation:** Restrict to `["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]` and explicit headers `["Authorization", "Content-Type"]`.

---

#### H-3: Token Storage in localStorage (XSS Risk)
**File:** `apps/web/src/lib/api-client.ts`

```typescript
const token = localStorage.getItem('access_token')
```

Access tokens stored in `localStorage` are accessible to any JavaScript on the page. Combined with `'unsafe-inline'` in CSP script-src, this is an XSS → token theft vector.

**Remediation:** Use `httpOnly` cookies for token storage, or move to a BFF (Backend-For-Frontend) pattern.

---

#### H-4: CSP Allows 'unsafe-inline' Scripts
**File:** `vercel.json`

```json
"Content-Security-Policy": "...script-src 'self' 'unsafe-inline'..."
```

`'unsafe-inline'` in `script-src` defeats most of CSP's XSS protections.

**Remediation:** Use nonce-based CSP or remove `'unsafe-inline'` and refactor inline scripts.

---

#### H-5: Debug Exception Details Leak in Production
**File:** `apps/api/src/main.py`

```python
"detail": str(exc) if settings.DEBUG else "An unexpected error occurred",
```

The `ValueError` handler **always** exposes `str(exc)`:
```python
content={"error": "Validation error", "detail": str(exc), ...}
```

This can leak internal state, SQL errors, or file paths.

**Remediation:** Apply same `settings.DEBUG` gate to ValueError handler.

---

#### H-6: Raw SQL in Admin Tenant Management
**File:** `apps/api/src/api/admin/tenants.py`

```python
cursor.execute(f"SAVEPOINT sp_trig_dis")
```

Multiple raw SQL `cursor.execute()` calls in admin code. While admin-only, parameterization should be verified for all user inputs.

**Remediation:** Audit all raw SQL for proper parameterization. Use SQLAlchemy's `text()` with bind parameters.

---

#### H-7: Print Statements in Production Code
**Files:** Multiple (`llm_client.py`, `seeds/`, `agent_base.py`, `ai_agent.py`)

```python
print(f"[LLM] {self.provider} auth failed, falling back to mock: {error_msg[:100]}")
print(json.dumps(result, indent=2))
```

Print statements bypass structured logging, can't be filtered, and may leak sensitive data to stdout/container logs.

**Remediation:** Replace all `print()` with `logger.info/warning/debug()` calls.

---

### 🟡 MEDIUM Findings

#### M-1: Test File Contains Hardcoded Password
**File:** `apps/api/tests/test_auth.py:167`
```python
self._password = "LoginP@ss1"
```
**Remediation:** Use environment variables or fixtures for test credentials.

#### M-2: Access Token Expiry Too Short for UX, Refresh Too Short for Security
- Access: 20 min (good for security, may cause UX friction)
- Refresh: 2 days (relatively short, but acceptable)
- **Admin token: 8 hours** — too long for an admin session.
**Remediation:** Reduce admin token to 1-2 hours with refresh.

#### M-3: No Token Revocation / Blacklist Mechanism
JWT tokens cannot be revoked once issued. If a token is compromised, it remains valid until expiry.
**Remediation:** Implement Redis-backed token blacklist for logout/password-change.

#### M-4: OpenAPI Docs Exposed in Debug Mode
```python
docs_url="/docs" if settings.DEBUG else None,
```
Good practice, but ensure `DEBUG=False` in all production deployments. No runtime enforcement exists.

#### M-5: SQLite Fallback in Production
If no database URL is configured, the system falls back to SQLite:
```python
object.__setattr__(self, "DATABASE_URL", "sqlite:///./shieldra.db")
```
SQLite has no encryption at rest, limited concurrency, and is unsuitable for multi-tenant production.
**Remediation:** Fail startup if DATABASE_URL resolves to SQLite in non-debug mode.

#### M-6: Backward-Compatible Plaintext Decryption
```python
except Exception:
    logger.debug("decrypt_value: value appears to be plaintext (legacy), returning as-is")
    return ciphertext
```
Failed decryption silently returns plaintext. An attacker could store plaintext in encrypted fields.
**Remediation:** Add migration deadline. After cutover, fail on decryption errors.

#### M-7: No Request Size Limits Configured
No `max_upload_size` or request body limits visible in FastAPI config or middleware.
**Remediation:** Add request body size limits to prevent DoS via large payloads.

#### M-8: Multiple Worktrees with Dependency Files
7+ Claude worktrees in `.claude/worktrees/` contain their own `package.json`/`requirements.txt`. These may have different dependency versions.
**Remediation:** Add `.claude/worktrees/` to `.gitignore` (already done, but ensure no drift).

---

### 🔵 LOW Findings

#### L-1: Deprecated `datetime.utcnow()` Usage
`apps/api/src/core/audit_integrity.py` uses `datetime.utcnow()` which is deprecated in Python 3.12+.
**Remediation:** Use `datetime.now(timezone.utc)`.

#### L-2: `X-XSS-Protection: 1; mode=block` Header
This header is deprecated in modern browsers and can actually introduce vulnerabilities in IE.
**Remediation:** Remove or set to `X-XSS-Protection: 0` and rely on CSP instead.

#### L-3: Permissive Referrer-Policy
`strict-origin-when-cross-origin` leaks the origin on cross-origin requests.
**Remediation:** Consider `strict-origin` or `no-referrer` for HIPAA compliance.

#### L-4: No Subresource Integrity (SRI) for External Resources
CSP allows fonts from `fonts.googleapis.com` and `fonts.gstatic.com` but no SRI hashes.

#### L-5: `docx` Package at Root Level
Root `package.json` has `"docx": "^9.6.1"` as a dependency, also in `apps/web`. Unnecessary duplication.

---

## 3. HIPAA Compliance Assessment

### ✅ Strengths

| Control | Implementation | Status |
|---------|---------------|--------|
| **Encryption in Transit** | HSTS with preload, TLS enforced via Vercel | ✅ GOOD |
| **Security Headers** | X-Frame-Options, X-Content-Type-Options, CSP, Permissions-Policy | ✅ GOOD |
| **Password Hashing** | bcrypt with salt | ✅ GOOD |
| **Audit Trail Integrity** | SHA-256 hash-chain (blockchain-style) tamper detection | ✅ EXCELLENT |
| **Structured Logging** | `structlog` for audit events | ✅ GOOD |
| **Field-Level Encryption** | Fernet via `EncryptedText` SQLAlchemy type | ✅ GOOD |
| **Multi-Tenancy Isolation** | Tenant context middleware, org_id filtering | ✅ GOOD |
| **Rate Limiting** | Redis-backed sliding window with in-memory fallback | ✅ GOOD |
| **RBAC** | Permission-based access control with `require_permission()` | ✅ GOOD |

### ❌ HIPAA Compliance Gaps

| Gap | HIPAA Requirement | Risk | Priority |
|-----|-------------------|------|----------|
| **No BAA with Vercel** | §164.502(e) — BAA required for all business associates | Regulatory | 🔴 P0 |
| **Ephemeral encryption key** | §164.312(a)(2)(iv) — Encryption/decryption | Data loss | 🔴 P0 |
| **No data backup/recovery plan documented** | §164.308(a)(7) — Contingency plan | Compliance | 🟠 P1 |
| **No session timeout enforcement** | §164.312(a)(2)(iii) — Automatic logoff | Security | 🟠 P1 |
| **No PHI access logging review** | §164.312(b) — Audit controls | Compliance | 🟡 P2 |
| **Redis unencrypted** | §164.312(e)(1) — Transmission security | Data exposure | 🟠 P1 |
| **MinIO without TLS** | §164.312(e)(1) — Transmission security | Data exposure | 🟠 P1 |
| **No data retention policy** | §164.530(j) — Retention requirement | Compliance | 🟡 P2 |
| **No breach notification workflow** | §164.408 — Notification to individuals | Compliance | 🟡 P2 |
| **localStorage token storage** | §164.312(d) — Person/entity authentication | Token theft | 🟠 P1 |

---

## 4. Remediation Roadmap

### Phase 1: Critical (Week 1) 🔴
1. **[C-1]** Remove default SECRET_KEY fallback; fail startup without it
2. **[C-2]** Add ENCRYPTION_KEY to `validate_secrets()`; fail if empty in production
3. **[C-3]** Remove MinIO default credentials; enforce SSL
4. **[C-4]** Add Redis authentication (`--requirepass`)
5. **[H-3]** Migrate token storage from localStorage to httpOnly cookies

### Phase 2: High Priority (Week 2-3) 🟠
6. **[H-2]** Restrict CORS methods and headers
7. **[H-4]** Replace `'unsafe-inline'` with nonce-based CSP
8. **[H-5]** Gate all error handlers behind `settings.DEBUG`
9. **[H-6]** Audit and parameterize all raw SQL
10. **[H-7]** Replace all `print()` with structured logging
11. **npm:** Run `npm audit fix` to resolve lodash/picomatch vulnerabilities
12. Implement token revocation blacklist

### Phase 3: Medium Priority (Week 4-6) 🟡
13. **[M-5]** Block SQLite fallback in production
14. **[M-6]** Add migration deadline for plaintext backward compatibility
15. **[M-7]** Add request body size limits
16. Migrate from `python-jose` to `PyJWT`
17. Consolidate `requirements.txt` → `pyproject.toml`
18. Implement automatic session timeout (frontend idle detection)
19. Document backup/recovery procedures

### Phase 4: Compliance Hardening (Ongoing) 🔵
20. Establish BAA with Vercel (or move to HIPAA-eligible hosting)
21. Implement PHI access logging and periodic review
22. Create data retention and destruction policies
23. Build breach notification workflow
24. Remove deprecated `X-XSS-Protection` header
25. Add SRI for external resources

---

## 5. Clean-Up Recommendations

### Unused / Duplicate Dependencies to Remove
| Location | Package | Reason |
|----------|---------|--------|
| Root `requirements.txt` | `psycopg2-binary` | `pyproject.toml` uses `asyncpg` |
| Root `requirements.txt` | `pypdf` | Not in `pyproject.toml`, verify if used |
| Root `requirements.txt` | `python-docx` | Not in `pyproject.toml`, verify if used |
| Root `requirements.txt` | `cryptography` | Pulled transitively via `python-jose[cryptography]` |
| Root `package.json` | `docx` | Already in `apps/web/package.json` |
| Root `requirements.txt` | **Entire file** | Should be generated from `pyproject.toml` or removed |

### Code Clean-Up
- Remove all `print()` statements (8 instances found)
- Replace `datetime.utcnow()` with `datetime.now(timezone.utc)`
- Remove test password from `test_auth.py`
- Clean up `.claude/worktrees/` (7 stale worktrees with deps)

---

## Appendix: Files Reviewed

- `package.json` (root, `apps/web`, `apps/landing`)
- `requirements.txt` (root, `api/`)
- `apps/api/pyproject.toml`
- `apps/api/src/config.py`
- `apps/api/src/main.py`
- `apps/api/src/core/security.py`
- `apps/api/src/core/encryption.py`
- `apps/api/src/core/audit_integrity.py`
- `apps/api/src/core/db/connection.py`
- `apps/api/src/core/rate_limiter.py`
- `apps/api/src/api/admin/auth.py`
- `apps/web/src/lib/api-client.ts`
- `infrastructure/docker-compose.yml`
- `vercel.json`
- `.gitignore`

---

*Report generated by Alchi — Security Auditor & Dependency Scanner*
*Shieldra AI v0.1.0 | Audit Date: 2026-04-01*
