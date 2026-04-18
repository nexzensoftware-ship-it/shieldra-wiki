# 🔒 Shieldra AI Multi-Tenancy Security Audit Report

**Date:** 2026-03-26
**Verdict:** Solid foundation but **critical gaps** in specific modules that could enable cross-tenant data leakage.

## Executive Summary

| Severity | Count | Summary |
|----------|-------|---------|
| 🔴 CRITICAL | 3 | Hardcoded tenant IDs bypass isolation; tenant_id fallback defaults; unscoped resource lookups |
| 🟠 HIGH | 5 | Missing tenant_id on 15+ tables; refresh tokens lack tenant scoping; nullable tenant_id columns |
| 🟡 MEDIUM | 4 | Inconsistent scoping patterns; shared encryption key; AuditLog lacks tenant_id |
| 🔵 LOW | 3 | Best practices not followed |

---

## 🔴 CRITICAL Issues

### CRIT-1: Hardcoded Tenant ID in TPRM Module
**File:** `apps/api/src/api/v1/endpoints/tprm.py` (29 occurrences)

ALL TPRM queries are hardcoded to filter by `"d0000000-0000-4000-a000-000000000001"` instead of the authenticated user's tenant_id. Every tenant sees the same TPRM data (demo tenant). New tenant TPRM data is created under the hardcoded ID.

```python
VendorAIReview.tenant_id == "d0000000-0000-4000-a000-000000000001"
```

**Fix:** Replace all 29 occurrences with `tenant_id` from request context.

### CRIT-2: Tenant ID Fallback Defaults in Multiple Modules
Multiple endpoints use `get_tenant_id_from_request(request) or "d0000000-0000-4000-a000-000000000001"` — silently falling back to demo tenant data when JWT is missing/invalid.

**Affected files:**
- `regulatory_radar.py` — 19 occurrences
- `risk_management.py` — 25+ occurrences
- `enterprise_integrations.py` — line 612
- `behavior_analytics.py` — line 241 (falls back to `"default"`)

**Fix:** Replace `get_tenant_id_from_request()` with `require_tenant` dependency (which properly rejects unauthenticated requests). Remove ALL hardcoded fallback IDs.

### CRIT-3: Cross-Tenant Resource Access via Unscoped ID Lookups
80+ queries found that filter by resource ID alone without tenant scoping. Key offenders:

- `tprm.py` — Vendor lookups by ID without org_id filter (9 occurrences)
- `contract_intelligence.py` — Document lookups by ID alone (5 occurrences)
- `compliance.py` — Document lookup by ID in analysis endpoint
- `audit_reports.py` — Report lookups without tenant verification

A user from Tenant A could access Tenant B's resources by knowing/guessing the UUID.

**Fix:** Add `Model.org_id == org_id` (or `tenant_id`) filter to every query that fetches by resource ID.

---

## 🟠 HIGH Issues

### HIGH-1: 15+ Tables Missing tenant_id Column
Tables containing tenant-specific data that lack `tenant_id`:

| Table | Has org_id? | Risk |
|-------|-------------|------|
| `ViolationMapping` | ❌ | No scoping at all — only FKs |
| `EvidenceValidation` | ❌ | No scoping — only FK to evidence_id |
| `DueDiligenceProject` | ✅ org_id only | M&A data without tenant_id |
| `ContractClause` | ❌ | Indirect via document_id |
| `ContractAnalysis` | ❌ | Indirect via document_id |
| `AuditLog` | ✅ org_id only | Legacy scoping |
| `EmployeeCompliance` | ✅ org_id only | |
| `AccessEvent` | ✅ org_id only | PHI access logs |
| `UserBaseline` | ✅ org_id only | Behavioral analytics |
| `BehaviorAnomaly` | ✅ org_id only | |
| `PenaltyExposure` | ✅ org_id only | Financial data |
| `RiskPrioritizationScore` | ✅ org_id only | |
| `RiskSnapshot` | ✅ org_id only | |
| `ExposureSnapshot` | ✅ org_id only | |

**Fix:** Add `tenant_id` column to all tenant-specific tables. Tables with org_id only are somewhat protected (org_id maps to tenant via Organization table) but direct tenant_id is more robust.

### HIGH-2: All tenant_id Columns are nullable=True
28+ tables have `tenant_id = Column(String, nullable=True)`. Records can be created without tenant scoping and become "orphaned" — potentially visible to queries that don't strictly filter NULLs.

**Fix:** Migrate to `nullable=False` for all non-global tables.

### HIGH-3: Refresh Tokens Lack Tenant Scoping
Refresh tokens include only `sub` (user_id) and `type`, no `tenant_id` claim. A refresh token from one tenant context could theoretically be used if the user has access to multiple tenants.

### HIGH-4: Single Shared Encryption Key for All Tenants
All PHI encryption (documents, evidence, incidents, AI messages, SSO configs) uses a single `ENCRYPTION_KEY` from environment. If compromised, ALL tenants' encrypted data is exposed.

**Fix (Phase 2):** Per-tenant encryption keys with key hierarchy (master key → tenant key → data key).

### HIGH-5: Integration Credentials Stored with Shared Encryption
Integration config credentials (API keys, tokens, secrets) use `EncryptedText` with the same shared key. A platform compromise exposes every tenant's third-party credentials.

---

## 🟡 MEDIUM Issues

### MED-1: Inconsistent Scoping Patterns
Some modules use `org_id`, others use `tenant_id`, and some use both. No standard enforced.

### MED-2: Admin Can Access Any Tenant Data Without Specific Audit
Admin endpoints can query/modify any tenant's data. While by design, there's no specific audit trail tracking "admin X accessed tenant Y's data."

### MED-3: No Row-Level Security (RLS) in PostgreSQL
Despite comments mentioning RLS, no actual PostgreSQL RLS policies are defined. All tenant isolation is application-level only.

### MED-4: `get_tenant_id_from_request()` Returns None Silently
The utility function returns `None` on failure instead of raising. Safe callers use `require_tenant` dependency, but many endpoints use the utility directly with dangerous fallback patterns.

---

## 🔵 LOW Issues

### LOW-1: No Admin Role Granularity for Tenant Access
Support admins can access all tenants equally — no per-tenant access scoping for admin roles.

### LOW-2: No Rate Limiting Per Tenant
Rate limiting is per-IP only, not per-tenant. A single tenant could consume disproportionate resources.

### LOW-3: Tenant Deletion is Logical Only
No evidence of hard data purge capability (GDPR "right to erasure" / data disposal).

---

## What's Working Well ✅

- **Core business tables** (Documents, Compliance, Vendors, Risk, Evidence, Incidents, Training) all have proper dual scoping (org_id + tenant_id)
- **JWT-based auth** with separate secrets for admin vs tenant tokens
- **`require_tenant` dependency** properly validates JWT and rejects unauthenticated requests
- **Token blocklist** for logout
- **PHI field-level encryption** using Fernet/AES
- **Password hashing** with bcrypt
- **Global data properly unscoped** (HIPAA requirements, policy templates, packages)
- **Admin endpoints on separate path** with separate auth

---

## Priority Fix Order

1. **CRIT-1:** Fix TPRM hardcoded tenant IDs (29 replacements in one file)
2. **CRIT-2:** Replace all `or "d0000000..."` fallbacks with `require_tenant` dependency (~60 replacements across 4 files)
3. **CRIT-3:** Add tenant scoping to all resource-by-ID lookups (~15 fixes)
4. **HIGH-2:** Change `nullable=True` to `nullable=False` on tenant_id columns
5. **HIGH-1:** Add tenant_id to tables missing it
6. **HIGH-3:** Add tenant_id to refresh token claims
