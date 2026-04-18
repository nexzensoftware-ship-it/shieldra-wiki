# 🛡️ Shieldra AI — Comprehensive Security Assessment Report

**Date:** April 1, 2026  
**Assessor:** Guide (Security Researcher)  
**Scope:** Full codebase review — `apps/api` (FastAPI backend), `apps/web` (React frontend), `infrastructure/` (Docker)  
**Methodology:** OWASP Top 10 (2021), HIPAA Security Rule, manual source code review

---

## Executive Summary

Shieldra AI is a multi-tenant HIPAA compliance SaaS platform. The codebase demonstrates **solid security fundamentals** in many areas — bcrypt password hashing, JWT-based auth with token blocklisting, RBAC with granular permissions, rate limiting, audit trail integrity via hash chains, and field-level encryption. However, several **critical and high-severity issues** were identified that must be remediated before handling real ePHI in production.

### Vulnerability Tally

| Severity | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟠 High | 6 |
| 🟡 Medium | 7 |
| 🔵 Low | 5 |
| **Total** | **21** |

---

## 🔴 CRITICAL Findings

### C-1: Default Secret Key Shipped in Docker Compose & .env.example

**File:** `infrastructure/docker-compose.yml` line ~65, `.env.example`  
**CVSS:** 9.8 (Critical)  
**OWASP:** A07:2021 — Identification & Authentication Failures

The docker-compose file hardcodes `SECRET_KEY: change-me-in-production-super-secret-key-12345` as a default. The `.env.example` ships the same value. While the `validate_secrets()` method logs a critical warning in non-development environments, **it does not actually halt the application** — it only logs. An operator who forgets to change the key will have a fully functional but completely compromised deployment.

**Attack Vector:** Any attacker who reads the public `.env.example` can forge arbitrary JWT tokens, including admin tokens, gaining full access to every tenant's data.

**PoC:**
```python
from jose import jwt
# Forge an admin token using the known default secret
token = jwt.encode(
    {"sub": "any-user-id", "tenant_id": "any-tenant", "role": "owner", "type": "access"},
    "change-me-in-production-super-secret-key-12345",
    algorithm="HS256"
)
```

**Remediation:**
- `validate_secrets()` MUST raise a fatal error (not just log) when `SECRET_KEY` contains `change-me` or `12345` in production mode
- Generate a random secret at first startup if none is provided
- Remove the default value from docker-compose; use `${SECRET_KEY}` with no fallback

**HIPAA Impact:** §164.312(a)(1) — Access Control. Hardcoded secrets bypass all access controls.

---

### C-2: JWT Tokens Stored in localStorage — XSS Token Theft

**File:** `apps/web/src/stores/auth-store.ts`, `apps/web/src/lib/api-client.ts`  
**CVSS:** 8.1 (High → Critical in context of ePHI)  
**OWASP:** A07:2021 — Identification & Authentication Failures

Both `access_token` and `refresh_token` are stored in `localStorage`:
```typescript
localStorage.setItem('access_token', data.access_token)
localStorage.setItem('refresh_token', data.refresh_token)
```

`localStorage` is accessible to **any JavaScript running on the page**, including injected scripts from XSS vulnerabilities, compromised third-party dependencies, or browser extensions.

**Attack Vector:** A single XSS vulnerability (even in a third-party dependency like `recharts` or `framer-motion`) allows an attacker to steal both tokens, giving persistent access to the victim's account and all tenant data including ePHI.

**Remediation:**
- Store tokens in **HttpOnly, Secure, SameSite=Strict cookies** set by the backend
- If localStorage must be used for access tokens, store refresh tokens ONLY in HttpOnly cookies
- Implement token binding or fingerprinting

**HIPAA Impact:** §164.312(d) — Person or Entity Authentication. Token theft enables impersonation.

---

### C-3: In-Memory Token Blocklist Does Not Survive Restarts

**File:** `apps/api/src/api/v1/endpoints/auth.py` lines 43-52  
**CVSS:** 7.5 (High)  
**OWASP:** A07:2021 — Identification & Authentication Failures

```python
_token_blocklist: set[str] = set()
```

The logout blocklist is a Python `set` in process memory. On server restart, deployment, or scale-out:
- All previously-revoked tokens become valid again
- In multi-process/serverless deployments, a token blocked in one process is valid in another

**Attack Vector:** An attacker who obtains a token can use it indefinitely even after the user logs out, because the blocklist is lost on restart.

**Remediation:**
- Store blocklisted token JTIs (not full tokens) in Redis with TTL matching token expiry
- The Redis infrastructure already exists in the stack

**HIPAA Impact:** §164.312(a)(2)(iii) — Automatic Logoff. Logout must be effective across all instances.

---

## 🟠 HIGH Findings

### H-1: SQL Injection in Migration Script via f-strings

**File:** `apps/api/src/core/db/migrations.py` (multiple lines), `apps/api/src/api/admin/tenants.py` line 567-631  
**CVSS:** 7.5  
**OWASP:** A03:2021 — Injection

Migration code uses f-strings to construct SQL:
```python
result = conn.execute(text(f"SELECT name FROM sqlite_master WHERE type='index' AND name='{index_name}'"))
conn.execute(text(f"CREATE INDEX {idx_name} ON {table}({column})"))
```

While these values are currently derived from internal code (not user input), this is a dangerous pattern. The admin tenants endpoint (`tenants.py:567-631`) also uses f-strings with table/column names.

**Remediation:**
- Use parameterized queries even for DDL when possible
- Validate all dynamic identifiers against a strict allowlist
- Use SQLAlchemy's DDL constructs instead of raw SQL strings

---

### H-2: No Content Security Policy (CSP)

**Files:** No CSP headers found anywhere in the codebase  
**CVSS:** 7.1  
**OWASP:** A05:2021 — Security Misconfiguration

The application serves no `Content-Security-Policy` header. This means:
- Inline scripts execute freely
- External resources load without restriction
- XSS attacks have no mitigation layer

**Remediation:**
- Add a strict CSP header via middleware or `vercel.json`:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.shieldra.ai
  ```
- Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`

**HIPAA Impact:** §164.312(e)(1) — Transmission Security. CSP is a defense-in-depth measure for web interfaces handling ePHI.

---

### H-3: Ephemeral Auto-Generated Encryption Key

**File:** `apps/api/src/core/encryption.py` lines 28-35  
**CVSS:** 7.4  
**OWASP:** A02:2021 — Cryptographic Failures

When `ENCRYPTION_KEY` is not set, the system auto-generates a Fernet key:
```python
key = Fernet.generate_key().decode()
logger.warning("ENCRYPTION_KEY not set — auto-generated an ephemeral key...")
```

In serverless deployments (Vercel), **every cold start generates a different key**, making all previously encrypted data (API keys, integration credentials) permanently unreadable.

**Remediation:**
- Make `ENCRYPTION_KEY` a required secret in production (fail startup if missing)
- Document key rotation procedures
- Add key versioning to support rotation without data loss

---

### H-4: CORS Allows Credentials with Broad Origins

**File:** `apps/api/src/main.py` lines 132-138  
**CVSS:** 6.8  
**OWASP:** A05:2021 — Security Misconfiguration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

`allow_credentials=True` combined with `allow_methods=["*"]` and `allow_headers=["*"]` is overly permissive. Additionally, `CORS_EXTRA_ORIGINS` allows adding arbitrary origins via environment variable without validation.

**Remediation:**
- Restrict `allow_methods` to actually used methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
- Restrict `allow_headers` to specific headers (`Authorization`, `Content-Type`)
- Validate `CORS_EXTRA_ORIGINS` format (must be HTTPS, no wildcards)

---

### H-5: Admin Secret Key Also Defaults to Insecure Value

**File:** `apps/api/src/config.py`, `infrastructure/docker-compose.yml`  
**CVSS:** 8.5  
**OWASP:** A07:2021 — Identification & Authentication Failures

`ADMIN_SECRET_KEY` defaults to empty string. The `validate_secrets()` only checks `settings.ADMIN_SECRET_KEY` is set (non-empty), but in debug mode it's never validated. The admin panel uses a **separate JWT signing key**, so even if `SECRET_KEY` is changed, the admin panel may remain compromised.

**Remediation:**
- Require `ADMIN_SECRET_KEY` to be set in all non-development environments
- Ensure it's different from `SECRET_KEY`

---

### H-6: Password Policy Insufficient for HIPAA

**File:** `apps/api/src/api/v1/endpoints/auth.py` `SignupRequest` class  
**CVSS:** 5.3  
**OWASP:** A07:2021 — Identification & Authentication Failures

Current password policy requires: 8+ chars, 1 uppercase, 1 lowercase, 1 digit. Missing:
- No special character requirement
- No password history enforcement
- No check against common/breached passwords (haveibeenpwned)
- Account lockout is only rate-limit based (5/min by IP), not per-account
- No MFA support anywhere in the codebase

**HIPAA Impact:** §164.312(d) — Person or Entity Authentication. HIPAA requires strong authentication. The NIST SP 800-63B guidelines (referenced by HHS) recommend checking against breached password lists and supporting MFA.

**Remediation:**
- Add special character requirement (HIPAA compliance)
- Implement per-account lockout (not just IP-based)
- Add MFA (TOTP/WebAuthn) — this is essentially required for HIPAA compliance
- Check passwords against haveibeenpwned API or local breached list

---

## 🟡 MEDIUM Findings

### M-1: In-Memory Login Rate Limiter Not Distributed

**File:** `apps/api/src/api/v1/endpoints/auth.py` lines 34-45  
**CVSS:** 5.3

The login-specific rate limiter uses a Python dict (`_login_attempts`). In multi-process or serverless deployments, each instance has its own counter, allowing attackers to bypass rate limits by distributing requests.

**Note:** The global `RateLimitMiddleware` does use Redis with fallback, but the login endpoint has its *own* in-memory limiter that runs first.

**Remediation:** Remove the endpoint-level rate limiter and rely solely on the Redis-backed middleware, or move the login limiter to Redis.

---

### M-2: Refresh Token Rotation Without Old Token Invalidation

**File:** `apps/api/src/api/v1/endpoints/auth.py` `refresh_token` endpoint  
**CVSS:** 5.9

When refreshing, a new refresh token is issued but the old one is never invalidated. An attacker who steals a refresh token can use it indefinitely (until expiry), even after the legitimate user has refreshed.

**Remediation:** Implement refresh token rotation with family tracking — when a refresh token is reused, invalidate the entire token family.

---

### M-3: Verbose Error Messages in Debug Mode Leak Internals

**File:** `apps/api/src/main.py` generic exception handler  
**CVSS:** 5.3  
**OWASP:** A04:2021 — Insecure Design

```python
"detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
```

In debug mode, full exception messages including stack traces and internal paths are returned to the client. If `DEBUG=true` is accidentally left on in production (as it is in docker-compose defaults), this leaks information.

**Remediation:** Ensure `DEBUG` defaults to `false` in docker-compose and production configs.

---

### M-4: Docker Compose Exposes Database Ports Publicly

**File:** `infrastructure/docker-compose.yml`  
**CVSS:** 6.5

```yaml
postgres:
  ports:
    - "5432:5432"
redis:
  ports:
    - "6379:6379"
```

PostgreSQL and Redis are bound to `0.0.0.0` (all interfaces), making them accessible from the network. Redis has **no authentication** configured.

**Remediation:**
- Bind to `127.0.0.1:5432:5432` for local dev
- For production, remove port mappings entirely (services communicate via Docker network)
- Add Redis AUTH (`requirepass`)
- Use strong PostgreSQL passwords

---

### M-5: No Request Size Limits on API Endpoints

**File:** `apps/api/src/main.py`  
**CVSS:** 5.3  
**OWASP:** A05:2021 — Security Misconfiguration

While file uploads have a 50MB limit, there's no global request body size limit. JSON endpoints could accept arbitrarily large payloads, enabling memory exhaustion DoS.

**Remediation:** Add uvicorn `--limit-concurrency` and `--limit-max-requests` flags. Consider adding a middleware that rejects bodies over a configurable limit (e.g., 10MB for non-upload endpoints).

---

### M-6: RLS Failure Silently Ignored

**File:** `apps/api/src/core/tenant_middleware.py` lines 78-93  
**CVSS:** 6.5

```python
except Exception:
    pass  # RLS is defense-in-depth; don't block requests if it fails
```

If PostgreSQL Row-Level Security setup fails, the request continues **without tenant isolation at the database level**. While application-level filtering exists, silently degrading the defense-in-depth layer is risky.

**Remediation:** Log the failure at WARNING level (currently silent). In production with PostgreSQL, consider failing the request if RLS cannot be established.

---

### M-7: Swagger/OpenAPI Docs Gating by DEBUG Flag Only

**File:** `apps/api/src/main.py` lines 126-128  
**CVSS:** 4.3

```python
docs_url="/docs" if settings.DEBUG else None,
```

API documentation is enabled/disabled solely by the `DEBUG` flag. Since `DEBUG=true` is the default in docker-compose and `.env.example`, documentation (including all endpoint schemas) would be exposed in misconfigured deployments.

**Remediation:** Use a separate `ENABLE_DOCS` flag or restrict docs to authenticated admin users.

---

## 🔵 LOW Findings

### L-1: No Account Lockout After Failed Login Attempts

The system only rate-limits by IP. A distributed attacker using many IPs can brute-force a specific account without triggering any lockout. There's no per-account failed attempt counter.

### L-2: JWT Claims Include Sensitive Data

Access tokens include `email`, `full_name`, `tenant_name`, `organization_id` in claims. These are base64-encoded (not encrypted) and visible to anyone who intercepts the token.

**Remediation:** Minimize JWT claims to `sub`, `tenant_id`, `role`, `type`. Look up other data server-side.

### L-3: Demo Credentials in README

`admin@compliancevision.ai / admin123` are documented in README.md. While demo-only, these could be tried against production if demo seeding runs accidentally.

### L-4: No Audit Log for Failed Permission Checks

RBAC denials (`require_permission`) raise HTTP 403 but don't create audit log entries. For HIPAA compliance, all access attempts (successful and failed) should be logged.

### L-5: `allow_credentials=True` with Potentially Attacker-Controlled Origins

`CORS_EXTRA_ORIGINS` accepts a comma-separated string from environment variables. If an attacker can influence environment variables (e.g., via CI/CD misconfiguration), they could add their own origin and exploit the `allow_credentials=True` setting.

---

## OWASP Top 10 (2021) Summary

| # | Category | Status | Key Findings |
|---|----------|--------|-------------|
| A01 | Broken Access Control | ⚠️ Partial | Good RBAC + permissions, but RLS failures silently ignored; no per-account lockout |
| A02 | Cryptographic Failures | 🔴 Issues | Ephemeral encryption key (H-3); JWT secret defaults (C-1); no encryption at rest for DB |
| A03 | Injection | ⚠️ Risk | f-string SQL in migrations/admin (H-1); SQLAlchemy ORM usage is safe for main queries |
| A04 | Insecure Design | ⚠️ Partial | No MFA; in-memory blocklist (C-3); verbose debug errors (M-3) |
| A05 | Security Misconfiguration | 🔴 Issues | No CSP (H-2); exposed DB ports (M-4); DEBUG=true defaults |
| A06 | Vulnerable Components | ✅ OK | Dependencies appear current; no known CVEs found in quick scan |
| A07 | Identification & Auth Failures | 🔴 Issues | Default secrets (C-1); localStorage tokens (C-2); weak password policy (H-6); no MFA |
| A08 | Software & Data Integrity | ✅ Good | Audit hash chain; Pydantic validation; signed JWTs |
| A09 | Logging & Monitoring | ⚠️ Partial | Good audit trail with hash chain; but no logging of RBAC denials (L-4); no SIEM integration |
| A10 | SSRF | ✅ OK | No apparent SSRF vectors in reviewed code |

---

## HIPAA Security Rule Compliance Gaps

| HIPAA Section | Requirement | Status | Gap |
|---------------|-------------|--------|-----|
| §164.312(a)(1) | Access Control | ⚠️ | Default secret keys allow bypass (C-1) |
| §164.312(a)(2)(i) | Unique User Identification | ✅ | UUID-based user IDs |
| §164.312(a)(2)(ii) | Emergency Access Procedure | ❌ | No emergency/break-glass procedure documented |
| §164.312(a)(2)(iii) | Automatic Logoff | ⚠️ | 20-min token expiry, but in-memory blocklist (C-3) |
| §164.312(a)(2)(iv) | Encryption and Decryption | ⚠️ | Fernet encryption exists but key management is weak (H-3) |
| §164.312(b) | Audit Controls | ✅ | Hash-chain audit trail |
| §164.312(c)(1) | Integrity | ✅ | Audit integrity verification |
| §164.312(d) | Authentication | 🔴 | No MFA support (H-6); weak password policy |
| §164.312(e)(1) | Transmission Security | ⚠️ | TLS assumed but not enforced; no CSP; no HSTS header |

---

## Positive Security Findings

The assessment also identified several well-implemented security controls:

1. **bcrypt password hashing** with proper salt generation
2. **Granular RBAC** with 7 role levels and permission wildcards
3. **Audit trail with SHA-256 hash chain** — blockchain-style tamper detection (excellent for HIPAA)
4. **Tenant isolation** at multiple layers: JWT claims, application-level filtering, PostgreSQL RLS
5. **Rate limiting** with Redis backend and in-memory fallback
6. **File upload validation** — MIME type, extension, and size checks
7. **Pydantic v2 validation** on all request schemas
8. **Separate admin JWT secret** — admin panel uses different signing key
9. **Token type validation** — access vs refresh tokens distinguished in claims
10. **Tracking IDs on errors** — enables incident correlation

---

## Priority Remediation Roadmap

### Immediate (Week 1) — Ship Blockers
1. **C-1:** Make SECRET_KEY/ADMIN_SECRET_KEY validation fatal in production
2. **C-2:** Move tokens to HttpOnly cookies (or at minimum, refresh tokens)
3. **C-3:** Move token blocklist to Redis
4. **H-5:** Ensure ADMIN_SECRET_KEY is always validated

### Short-term (Weeks 2-3) — Pre-Launch
5. **H-2:** Implement Content Security Policy and security headers
6. **H-3:** Make ENCRYPTION_KEY required in production
7. **H-4:** Tighten CORS configuration
8. **M-4:** Lock down Docker compose port bindings
9. **M-2:** Implement refresh token family rotation

### Medium-term (Weeks 4-6) — HIPAA Hardening
10. **H-6:** Implement MFA (TOTP at minimum)
11. **H-1:** Replace f-string SQL with parameterized queries
12. **M-1:** Consolidate rate limiting to Redis-backed middleware
13. **M-6:** Log RLS failures; consider fail-closed in production

### Ongoing
14. Implement SIEM integration for centralized log monitoring
15. Add automated dependency vulnerability scanning (Dependabot/Snyk)
16. Conduct penetration testing before production ePHI handling
17. Document emergency access (break-glass) procedures

---

*This report was generated from static source code analysis. Dynamic testing (penetration testing) is recommended as a follow-up to validate findings and discover runtime-specific vulnerabilities.*
