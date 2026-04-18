# Shieldra AI — Master Requirements Document

> **Version:** 1.0 | **Date:** 2026-03-26 | **Status:** Definitive Reference
> **Audience:** Developers, Testers, PMs, Auditors, New Team Members
> **Source:** Codebase analysis (API + Frontend + DB), Business Plan, HIPAA Requirements, Competitive Analysis

---

## Table of Contents

- [Part 1: Product Overview](#part-1-product-overview)
- [Part 2: User Roles & Permissions](#part-2-user-roles--permissions)
- [Part 3: Core Features — Page by Page](#part-3-core-features--page-by-page)
- [Part 4: Data Flows](#part-4-data-flows)
- [Part 5: Integrations](#part-5-integrations)
- [Part 6: API Summary](#part-6-api-summary)
- [Part 7: Technical Architecture](#part-7-technical-architecture)
- [Part 8: Roadmap & Future Features](#part-8-roadmap--future-features)
- [Part 9: HIPAA Regulatory Reference](#part-9-hipaa-regulatory-reference)

---

# Part 1: Product Overview

## 1.1 Product Identity

| Field | Value |
|-------|-------|
| **Product Name** | Shieldra AI |
| **Tagline** | AI-Powered HIPAA Compliance for Healthcare |
| **Domain** | Healthcare compliance automation (GRC) |
| **Business Model** | SaaS (subscription tiers) |
| **Current Phase** | Phase 1 — MVP with advanced features |

## 1.2 Vision & Mission

**Vision:** Become the leading healthcare-first compliance automation platform, making HIPAA compliance accessible, affordable, and automated for healthcare organizations of all sizes.

**Mission:** Replace manual, expensive, and error-prone HIPAA compliance processes with AI-powered automation that continuously monitors, detects gaps, and guides organizations to full compliance — at a fraction of the cost of traditional approaches.

**Core Promise:** 10x faster compliance review at 80–90% lower cost than manual audits.

## 1.3 Target Market

| Segment | Description | Size Range |
|---------|-------------|------------|
| **Small practices** | Physician offices, clinics, dental practices, telehealth providers | 1–50 employees |
| **Mid-market healthcare** | Regional hospitals, health systems, specialty clinics | 50–500 employees |
| **Enterprise healthcare** | Large health systems, insurance companies, healthcare IT vendors | 500+ employees |
| **Business Associates** | Cloud vendors, EHR providers, billing companies, MSPs with PHI access | Any size |

**Market Opportunity:**
- TAM (Global GRC): $56B by 2030
- SAM (AI-powered compliance): $15–18B
- SOM (U.S. mid-market healthcare): $1.5B
- 60% of small healthcare providers struggle with HIPAA compliance
- Small practices face 55%+ of HIPAA fines
- External audits cost $150K–$1M/year

## 1.4 Competitive Positioning

**Healthcare-FIRST vs. General GRC Platforms**

| Differentiator | Shieldra AI | Vanta / Drata / Sprinto |
|---------------|-------------|------------------------|
| Primary framework | HIPAA (native) | SOC 2 (HIPAA bolted on) |
| Healthcare domain | Purpose-built | Generic GRC |
| Risk analysis depth | Healthcare-weighted scoring | Generic risk registers |
| HIPAA knowledge base | 73 requirements, 6 rules mapped | Mapped from SOC 2 controls |
| 2026 Security Rule | Fully mapped | Partial/unknown |
| Penalty calculator | Built-in with HHS data | Not available |
| Breach simulation | Tabletop exercises built-in | Not available |
| BAA management | Deep BAA lifecycle tracking | Basic tracking |
| Pricing (small practice) | $499/mo Starter | $7,000–$10,000/year entry |
| AI policy generation | 14+ HIPAA-specific templates | Generic policy templates |

**Key Competitor Weaknesses Exploited:**
1. **Vanta** ($10K+/yr): Not healthcare-focused; HIPAA tooling less mature than SOC 2; expensive for SMBs
2. **Drata** ($7.5K+/yr): SOC 2 foundational bias; HIPAA mapped from SOC 2, not purpose-built
3. **Sprinto** ($7K+/yr): Limited customization; shallow healthcare depth; stability issues
4. **Secureframe** ($7K+/yr): Only 150+ integrations; no healthcare specialization
5. **OneTrust** (custom): Enterprise-only; steep learning curve; privacy-first not security-first; 1.7/5 Trustpilot

## 1.5 Package Tiers

### Tier Comparison

| Feature | Starter ($499/mo) | Professional ($999/mo) | Enterprise (Custom) |
|---------|-------------------|----------------------|-------------------|
| **Max Users** | 5 | 25 | 999+ |
| **Max Documents** | 100 | 1,000 | 99,999 |
| **Max Scans/mo** | 50 | 200 | 9,999 |
| **Max AI Queries/mo** | 100 | 1,000 | 99,999 |
| **Storage** | 1 GB | 10 GB | 100 GB |
| **Frameworks** | HIPAA | HIPAA, HITRUST, SOC2 | HIPAA, HITRUST, SOC2, ISO27001, NIST |
| **SSO/SAML** | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ❌ | ✅ |
| **Custom Integrations** | ❌ | ❌ | ✅ |
| **Custom Branding** | ❌ | ❌ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ |

### Feature Gates by Tier

| Feature Slug | Starter | Professional | Enterprise |
|-------------|---------|-------------|-----------|
| `policy_templates` | ✅ | ✅ | ✅ |
| `compliance_scanning` | ✅ | ✅ | ✅ |
| `risk_register` | ❌ | ✅ | ✅ |
| `vendor_risk` | ❌ | ✅ | ✅ |
| `audit_reports` | ❌ | ✅ | ✅ |
| `security_training` | ❌ | ✅ | ✅ |
| `multi_framework` | ❌ | ✅ | ✅ |
| `enterprise_integrations` | ❌ | ✅ | ✅ |
| `ai_agent` | ❌ | ✅ | ✅ |
| `ai_assistant` | ❌ | ✅ | ✅ |
| `personnel` | ❌ | ✅ | ✅ |
| `asset_management` | ❌ | ✅ | ✅ |
| `advanced_reports` | ❌ | ✅ | ✅ |
| `questionnaires` | ❌ | ✅ | ✅ |
| `risk_management` | ❌ | ❌ | ✅ |
| `tprm` | ❌ | ❌ | ✅ |
| `auto_remediation` | ❌ | ❌ | ✅ |
| `breach_simulation` | ❌ | ❌ | ✅ |
| `compliance_code` | ❌ | ❌ | ✅ |
| `compliance_costs` | ❌ | ❌ | ✅ |
| `collaboration` | ❌ | ❌ | ✅ |
| `customer_portal` | ❌ | ❌ | ✅ |
| `trust_center` | ❌ | ❌ | ✅ |
| `digital_twin` | ❌ | ❌ | ✅ |
| `regulatory_radar` | ❌ | ❌ | ✅ |
| `ai_governance` | ❌ | ❌ | ✅ |

> Feature gates are managed in `core/feature_registry.py` and synced to packages on deploy. Frontend enforces via `<FeatureGate>` component; backend via `require_feature()` dependency.

---

# Part 2: User Roles & Permissions

## 2.1 Tenant Roles (8 Roles)

| Role | DB Value | Purpose | Typical User |
|------|----------|---------|-------------|
| **Owner** | `owner` | Business owner. Full control including billing and ownership transfer | Practice owner, CEO |
| **Admin** | `admin` | System administrator. Full control except ownership transfer | IT Director, CTO |
| **Compliance Officer** | `compliance_officer` | Designated HIPAA Compliance Officer. Full compliance access | HIPAA CO |
| **Privacy Officer** | `privacy_officer` | Designated HIPAA Privacy Officer. Same scope as CO | HIPAA PO |
| **Security Officer** | `security_officer` | Designated HIPAA Security Officer. Same scope as CO | HIPAA SO, CISO |
| **Auditor** | `auditor` | Internal/external auditor. Read-only access to all compliance data | External auditor, internal audit |
| **Analyst** | `analyst` | Compliance team member. View + create/edit selected entities | Compliance analyst, IT staff |
| **Viewer** | `viewer` | Stakeholder. Read-only access to limited pages | Executive, board member |

## 2.2 Permission System Architecture

- **Storage:** JSON array on `TenantUser.permissions` field
- **Format:** `module.action` (e.g., `documents.create`, `compliance.view`)
- **Wildcards:** `*` (global admin), `module.*` (full module access)
- **Bypass:** Owner and Admin roles bypass all permission checks
- **Officers:** Checked against their assigned permission list (no bypass)
- **Frontend enforcement:** `<PermissionGate permission="X">` hides UI; `usePermission(perm)` hook
- **Backend enforcement:** `require_permission("X")` FastAPI dependency
- **Feature gating:** `<FeatureGate feature="X">` checks package tier; shows `<UpgradePrompt>` if blocked

### 21 Permission Groups (~105 permissions)

| Group | Actions Available |
|-------|-----------------|
| `compliance` | view, create, edit, delete, manage |
| `documents` | view, create, edit, delete, manage |
| `controls` | view, create, edit, delete, manage |
| `evidence` | view, create, edit, delete, manage |
| `reports` | view, create, edit, delete, manage |
| `vendors` | view, create, edit, delete, manage |
| `incidents` | view, create, edit, delete, manage |
| `training` | view, create, edit, delete, manage |
| `settings` | view, edit, manage |
| `users` | view, create, edit, delete, manage |
| `integrations` | view, create, edit, delete, manage |
| `ai` | view, chat, manage |
| `remediation` | view, create, edit, delete, manage |
| `audit_trail` | view, export, manage |
| `risk` | view, create, edit, delete, manage |
| `monitoring` | view, edit, manage |
| `assets` | view, create, edit, delete, manage |
| `personnel` | view, create, edit, delete, manage |
| `collaboration` | view, create, edit, delete, manage |
| `questionnaires` | view, create, edit, delete, manage |

## 2.3 Permission Matrix

| Module | Owner/Admin | Officers (CO/PO/SO) | Auditor | Analyst | Viewer |
|--------|------------|---------------------|---------|---------|--------|
| Dashboard | view | view | view | view | view |
| Compliance | full | full | view | view | view |
| Controls | full | full | view | view | — |
| Documents | full | full | view | create/edit | view |
| Evidence | full | full | view | create/edit | — |
| Risk | full | full | view | view | — |
| Vendors | full | full | view | view | — |
| Incidents | full | full | view | create/edit | — |
| Remediation | full | full | view | create/edit | — |
| Reports | full | full | view | create/edit | view |
| Training | full | full | view | view | view |
| Personnel | full | full | view | view | — |
| Audit Trail | full | view | view | view | — |
| Alerts/Monitoring | full | full | view | view | — |
| Assets | full | full | view | view | — |
| AI Assistant | full | view/chat | — | view/chat | — |
| Integrations | full | view | view | — | — |
| Settings | full | — | — | — | — |
| Billing | full | — | — | — | — |
| User Management | full | — | — | — | — |
| Questionnaires | full | full | view | view | — |
| Collaboration | full | full | view | view | — |

## 2.4 Platform Admin Roles (Separate Authentication)

| Admin Role | Purpose |
|-----------|---------|
| `super_admin` | Full platform control |
| `admin` | Platform management |
| `support` | Tenant support (view tenants, errors, usage) |
| `viewer` | Read-only platform access |

- Stored in separate `admin_users` table
- Separate JWT secret (`ADMIN_SECRET_KEY`) and token type (`admin_access`)
- Accessed via `/admin/*` routes with separate login

## 2.5 Custom Roles

- `CustomRole` model allows tenants to define custom roles with specific permission sets
- System roles (owner, admin, compliance-officer, auditor, analyst, viewer) seeded as `is_system=True`
- Custom roles created by Owner/Admin via Settings → Roles
- Stored in `custom_roles` table with `tenant_id` scoping

## 2.6 Multi-Tenant Architecture

### Hierarchy

```
Tenant (billing/subscription entity)
├── Organization (compliance data container, typically 1:1 with Tenant)
│   └── All compliance data scoped by org_id AND tenant_id
├── TenantUser[] (workforce members)
├── Subscription (1:1, linked to Package)
├── Contract[] (enterprise billing)
├── Invoice[] (billing records)
└── TenantAIConfig (1:1, AI provider settings)
```

### Data Isolation

- **Dual-scoping:** Legacy entities use `org_id`; all entities also have `tenant_id`
- **PostgreSQL RLS:** Enabled on high-volume tables (event_logs, usage_logs, findings, documents)
- **Policy:** `tenant_id = current_setting('app.current_tenant_id')`
- **Context vars:** `_current_tenant_id`, `_current_user_id`, `_current_user_role` (per-request)

### Trial Period

- Duration: **14 days**
- Tenant status: `trial` → `active` (on subscription) or `suspended` (on expiry)
- Active statuses allowing login: `active`, `trial`, `pending_setup`

## 2.7 Onboarding Flow

```
Signup (POST /auth/signup)
  → Tenant created (status: trial, 14-day)
  → Organization created (linked to tenant)
  → TenantUser created (role: owner, permissions: ["*"])
  → JWT issued → redirect to /onboarding
  → 7-Step Onboarding Wizard:
    1. Welcome
    2. Organization setup (org_type, state, size)
    3. Compliance framework selection
    4. Team setup (invite users)
    5. Integrations configuration
    6. Document upload
    7. Review & complete
  → ComplianceArchetype matched based on profile
  → Controls seeded from library
  → Dashboard accessible after completion
```

---

# Part 3: Core Features — Page by Page

> **Legend:** ✅ Implemented | 🟡 Partial | ❌ Coming Soon
>
> Each page entry includes: Purpose, URL, Package Tier, Permissions, Features, User Actions, Data Entities, Connections, Status

---

## 3.1 Dashboard & Overview

### 3.1.1 Dashboard

| Field | Detail |
|-------|--------|
| **Purpose** | Central overview of HIPAA compliance posture with role-specific views |
| **URL** | `/dashboard` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.view` (role-adaptive content) |
| **Status** | ✅ Implemented |

**Features:**
- Overall compliance score (ScoreGauge component)
- HIPAA Roadmap progress bars (6 rules: Privacy, Security, Breach Notification, Enforcement, HITECH, Omnibus)
- Role-specific summary cards (Security Officer, Compliance Officer, Privacy Officer, Auditor, General)
- "What To Do Next" — up to 5 incomplete roadmap items
- Recent activity feed (last 6 items)
- Quick stats: total documents, open findings, pending reviews, compliance gaps, training %, remediation rate, total vendors, BAA gaps, PHI incidents, managed assets

**User Actions:**
- Refresh data
- Navigate to any section via quick actions or cards
- Jump to specific roadmap items

**Data Entities:** ComplianceCheck, Finding, Remediation, RiskAssessment, Vendor, TrainingRecord, Asset

**Connections:** Links to `/hipaa-roadmap`, `/documents`, `/compliance`, `/training`, `/remediation`, `/incidents`, `/risk-register`, `/risk-assessment`, `/assets`, `/vendors`, `/personnel`, `/reports`, `/evidence`, `/audit-trail`

**API Endpoints:** `useDashboardOverview()`, `useHIPAARoadmap()`

**Limitations:** No real-time WebSocket updates; depends on `useAuthStore` for role detection

---

## 3.2 HIPAA Roadmap

### 3.2.1 HIPAA Roadmap

| Field | Detail |
|-------|--------|
| **Purpose** | Step-by-step interactive guide to achieving full HIPAA compliance across all 6 rules |
| **URL** | `/hipaa-roadmap` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.view` (read), `compliance.edit` (update items) |
| **Status** | ✅ Implemented |

**Features:**
- Overall score gauge with completed/total count
- 6 Rule cards: Privacy Rule, Security Rule, Breach Notification, Enforcement Rule, HITECH Act, Omnibus Rule
- Each rule: progress bar, items with status (complete/partial/incomplete)
- Security Rule: nested subsections (Administrative, Technical, Physical safeguards)
- Enforcement Rule: penalty tiers table (4 tiers with min/max penalties)
- CFR references on each item
- Auto-detected completion badges from real DB data

**User Actions:**
- Expand/collapse rule cards and subsections
- Generate AI policy drafts for 14 policy types (NPP, Minimum Necessary, Patient Access, Incident Response, Access Control, Facility Access, Workstation Security, Media Disposal, Breach Notification, Patient Rights ×4, BAA Policy)
- Edit generated document sections inline before adopting
- Download generated document as .docx
- Adopt (save) generated policy to documents
- Acknowledge info-only rules (Enforcement, HITECH)
- Confirm "no subcontractors" for applicable items

**Data Entities:** HIPAARequirement (73 items), Finding, Gap, Vendor, Document, TrainingRecord

**Connections:** Each roadmap item links to relevant page (`/documents`, `/training`, `/vendors`, etc.)

**API Endpoints:** `useHIPAARoadmap()`, `generateRoadmapDocument()`, `saveGeneratedDocument()`, `confirmNoSubcontractors()`, `acknowledgeRule()`

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/hipaa-roadmap/` | Get roadmap with 6 rules and real status |
| PUT | `/api/v1/hipaa-roadmap/items/{id}` | Update roadmap item status |

---

## 3.3 Compliance Management

### 3.3.1 Compliance Checks

| Field | Detail |
|-------|--------|
| **Purpose** | Run and review HIPAA compliance checks against policy documents |
| **URL** | `/compliance` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.view` (read), `compliance.manage` (Quick Scan) |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Compliance Checks** — Check cards grouped by regulation with score breakdown, category summaries, findings table, scan history
2. **Requirements Graph** — RequirementTree component visualization
3. **Calendar** — Compliance deadlines (BAA renewals, training, policy reviews, risk assessments, access reviews, breach notifications)
4. **Audit Pack** — Audit Evidence Pack with completeness scoring (9 sections), generate/regenerate
5. **All Findings** — Cross-check findings table filterable by severity

**User Actions:**
- HIPAA Quick Scan (paste policy text, select org type, run analysis)
- Search compliance checks
- Expand check details and findings
- View scan history per regulation
- Filter calendar by category/status
- Generate/regenerate Audit Evidence Pack
- Filter All Findings by severity

**Data Entities:** ComplianceCheck, Finding, Gap

**Connections:** `/compliance/$checkId` (detail view), Dashboard (score)

**API Endpoints:** `useComplianceChecks()`, `useQuickScan()`, `useComplianceCalendar()`, `useAuditEvidencePack()`, `useComplianceSummary()`

### 3.3.2 Compliance Detail

| Field | Detail |
|-------|--------|
| **Purpose** | Detailed view of a single compliance check with findings and gaps |
| **URL** | `/compliance/$checkId` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.view` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Findings** — Individual findings with evidence text, location, recommendation, CFR reference; filterable by status and severity
2. **Gaps** — Gap type, impact, suggested action

**User Actions:**
- Filter findings by status (compliant/partial/non_compliant) and severity (critical/high/medium/low)
- Update finding status (open/in_progress/resolved/accepted/compliant/non_compliant/partial)
- Create remediation from non-compliant/partial findings
- Navigate back to compliance list

**Data Entities:** ComplianceCheck, Finding, Gap, Evidence

**Connections:** `/remediation` (create from finding), `/compliance` (back)

### 3.3.3 Scanning (Continuous Monitoring)

| Field | Detail |
|-------|--------|
| **Purpose** | Continuous compliance monitoring with integration scanning and drift detection |
| **URL** | `/scanning` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
1. **Overview** — Monitoring status, last scan time, active integrations
2. **Integrations** — Integration health status
3. **Alerts** — Scanning alerts
4. **Scan History** — Past scan results

**User Actions:**
- Trigger full compliance scan (runs all 6 internal scanners)
- View integration status
- Review alerts
- Browse scan history

**Data Entities:** ComplianceCheck, ScanResult, Finding, Integration

**API Endpoints:** `useMonitoringStatus()`, `useFullScan()`, `useComplianceDrift()`, `useMonitoringAlerts()`, `useScanHistory()`

### 3.3.4 Controls

| Field | Detail |
|-------|--------|
| **Purpose** | Manage compliance controls with testing and monitoring |
| **URL** | `/controls` |
| **Package Tier** | Professional+ (feature gate: `controls`) |
| **Permissions** | `controls.manage` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Controls** — Control list with effectiveness, testing status, owner
2. **Monitoring** — Continuous monitoring dashboard

**User Actions:**
- View/manage controls (CRUD)
- Create custom controls
- Import controls from library
- Create/run tests for controls
- View test result history
- Track control effectiveness

**Data Entities:** Control, ControlTest, ControlTestResult, Evidence

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/controls/` | List controls (library + tenant custom) |
| POST | `/api/v1/controls/` | Create custom control |
| POST | `/api/v1/controls/import` | Import from library |
| POST | `/api/v1/controls/{id}/tests` | Create test |
| POST | `/api/v1/controls/{id}/tests/{test_id}/run` | Run test |
| GET | `/api/v1/controls/monitoring/dashboard` | Monitoring dashboard |

### 3.3.5 Frameworks

| Field | Detail |
|-------|--------|
| **Purpose** | Multi-framework compliance management with cross-framework mapping |
| **URL** | `/frameworks` |
| **Package Tier** | Professional+ (feature gate: `multi_framework`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
1. **Overview** — Framework compliance scores per adopted framework
2. **Coverage Matrix** — Shared controls across frameworks
3. **Shared Evidence** — Evidence items satisfying multiple frameworks
4. **Gap Analysis** — Cross-framework gap identification

**User Actions:**
- Browse framework catalog (HIPAA, HITRUST, SOC2, ISO27001, NIST)
- Adopt frameworks
- View requirements per framework
- Update requirement status
- Attach evidence to requirements
- Analyze cross-framework mappings (AI-powered)

**Data Entities:** ComplianceFramework, FrameworkRequirement, CrossMapping, FrameworkEvidence

### 3.3.6 Regulations Browser

| Field | Detail |
|-------|--------|
| **Purpose** | Browse regulatory frameworks and their detailed requirements |
| **URL** | `/regulations` |
| **Package Tier** | All tiers |
| **Permissions** | Authenticated |
| **Status** | ✅ Implemented |

**Features:**
- Regulation list with framework name, status, requirement count
- Detailed requirements per regulation
- 73 HIPAA requirements in knowledge base

**Data Entities:** HIPAARequirementDB

### 3.3.7 Compliance-as-Code Engine

| Field | Detail |
|-------|--------|
| **Purpose** | Translate compliance requirements into executable, version-controlled policy rules |
| **URL** | `/compliance-code` |
| **Package Tier** | Enterprise (feature gate: `compliance_code`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Policy Studio** — Create/compile/execute/deploy policies (Rego/Python/YAML/JSON)
2. **Templates** — Code policy template library with usage counts
3. **Executions** — Execution history with pass/fail per check/resource
4. **Pipelines** — Scheduled compliance code pipelines with notifications
5. **Metrics** — Pass rate trends, compliance score trends, coverage heatmap, drift alerts

**User Actions:**
- Create policy (name, language, severity, requirement ref, source code)
- Compile, execute, deploy, delete policies
- Instantiate from templates
- Create/run pipelines (schedule, environment, policy selection)

**Data Entities:** ComplianceCodePolicy, PolicyCodeExecution, CodePolicyTemplate, CompliancePipeline

### 3.3.8 Cost & ROI Dashboard

| Field | Detail |
|-------|--------|
| **Purpose** | Track compliance program costs, measure ROI, and justify budget to executives |
| **URL** | `/compliance-costs` |
| **Package Tier** | Enterprise (feature gate: `compliance_costs`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **ROI Overview** — Total ROI %, net ROI, costs vs benefits, payback period, monthly trends, 12-month projection
2. **Cost Management** — Cost entries (10 categories: personnel, tools, training, audit, consulting, remediation, insurance, certification, legal, infrastructure)
3. **Benefits Tracker** — Estimated vs actual values, confidence levels, realization rate
4. **Budget Planning** — Allocated vs spent vs forecasted by department
5. **Executive Report** — Headline metrics, top ROI drivers, industry benchmarks, cost optimization recommendations

**Data Entities:** ComplianceCost, ComplianceBenefit, ComplianceBudget, CostBenchmark

---

## 3.4 Documents & Evidence

### 3.4.1 Documents

| Field | Detail |
|-------|--------|
| **Purpose** | Upload, manage, and analyze compliance documents with HIPAA scanning |
| **URL** | `/documents` |
| **Package Tier** | All tiers |
| **Permissions** | `documents.view` (read), `documents.create` (upload) |
| **Status** | ✅ Implemented |

**Features:**
- Required documents checklist (14 types: HIPAA Policies, SRA, BAAs, Training Records, Incident Response, Access Controls, Encryption, DR/BCP, Workforce Sanction, Data Classification, Pen Test, Vendor Assessments, Audit Logs, Other)
- Document table with title, type, status, created date
- Document details panel (metadata, version history, scan results)
- Version tracking with change notes

**User Actions:**
- Upload documents (drag & drop or file picker, with document type selection)
- Upload new version (with change notes)
- View/download document
- Delete document (soft-delete)
- Run HIPAA compliance scan on individual documents
- Filter by type, search documents

**Data Entities:** Document (with encrypted content_text for PHI)

**Document Status Lifecycle:** `uploaded → processing → analyzed → error`

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/documents/` | Create document (JSON body) |
| POST | `/api/v1/documents/upload` | Upload file (multipart) — auto-extracts text, classifies, auto-analyzes |
| GET | `/api/v1/documents/` | List documents (paginated, filtered) |
| PUT | `/api/v1/documents/{id}` | Update metadata |
| DELETE | `/api/v1/documents/{id}` | Soft-delete |
| POST | `/api/v1/documents/{id}/analyze` | Trigger HIPAA analysis |
| POST | `/api/v1/documents/{id}/new-version` | Upload new version |
| GET | `/api/v1/documents/{id}/versions` | List versions |

**Connections:** `/compliance` (scan results), `/hipaa-roadmap` (document completion), `/evidence` (as evidence source)

### 3.4.2 Evidence

| Field | Detail |
|-------|--------|
| **Purpose** | Manage compliance evidence with automated collection, scheduling, and gap analysis |
| **URL** | `/evidence` |
| **Package Tier** | All tiers |
| **Permissions** | `evidence.view`, `evidence.create`, `evidence.manage` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Overview** — Total evidence items, freshness indicators (Fresh/Aging/Stale), auto-collected count, controls list with evidence per control
2. **Gaps** — Evidence gaps analysis (missing evidence per control)
3. **Schedules** — Auto-collection schedule management, run history

**User Actions:**
- Add evidence manually (title, description, type, control mapping, file upload or URL)
- Auto-collect from integrations (AWS, Azure, Okta, Google Workspace)
- Create/edit/delete collection schedules
- Trigger manual schedule runs
- Verify evidence (status: collected → verified)

**Evidence Status Lifecycle:** `collected → verified → expired → rejected`

**Data Entities:** Evidence (with encrypted content), EvidenceValidation, EvidenceCollectionSchedule, Control

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/evidence/` | Create evidence |
| POST | `/api/v1/evidence/upload` | Upload evidence file |
| POST | `/api/v1/evidence/{id}/verify` | Verify evidence |
| GET | `/api/v1/evidence/summary` | Collection summary by control |
| GET | `/api/v1/evidence/auto-collected` | Auto-collected from integrations |

### 3.4.3 Policy Templates

| Field | Detail |
|-------|--------|
| **Purpose** | Browse and adopt pre-built HIPAA policy templates |
| **URL** | `/policy-templates` |
| **Package Tier** | All tiers (feature gate: `policy_templates`) |
| **Permissions** | `compliance.create` |
| **Status** | ✅ Implemented |

**Features:**
- Template cards by category (Privacy, Security, Breach Notification, Administrative, Technical, Organizational)
- Each template: name, description, sections preview, required flag, complexity, CFR references
- Adopted policies list
- Template detail preview with full section content

**User Actions:**
- Browse/search templates by category
- Toggle grid/list view
- Preview template content
- Adopt individual template (saves as document)
- Adopt all required templates at once
- View adopted policy status

**Data Entities:** PolicyTemplate, AIGeneratedPolicy, Document

---

## 3.5 Risk Management

### 3.5.1 Risk Assessment

| Field | Detail |
|-------|--------|
| **Purpose** | Create and manage HIPAA Security Risk Assessments (SRA) |
| **URL** | `/risk-assessment` |
| **Package Tier** | Professional+ (feature gate: `risk_assessment`) |
| **Permissions** | `risk.view`, `risk.create` |
| **Status** | ✅ Implemented |

**Features:**
- Assessment list with type, status, risk count, created date
- Guided setup questionnaire for profile-based assessment creation
- Risk item management with threat/vulnerability analysis
- Sign-off workflow (Security Officer approval with signature, title, notes)
- Auto-populate from compliance findings

**RiskAssessment Status Lifecycle:** `draft → in_progress → completed → approved`
**RiskItem Status Lifecycle:** `identified → mitigating → accepted → resolved`

**User Actions:**
- Create assessment (guided questionnaire or manual)
- Add/edit/delete risk items (threat, vulnerability, asset, likelihood 1-5, impact 1-5)
- Sign off / revoke sign-off
- Auto-populate from findings

**Data Entities:** RiskAssessment, RiskItem

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/risk-assessments/` | Create assessment |
| POST | `/api/v1/risk-assessments/{id}/items` | Add risk item |
| POST | `/api/v1/risk-assessments/{id}/sign-off` | Security officer sign-off |
| POST | `/api/v1/risk-assessments/{id}/auto-populate` | Auto-populate from findings |

### 3.5.2 Risk Register

| Field | Detail |
|-------|--------|
| **Purpose** | Centralized register of identified risks with scoring and treatment tracking |
| **URL** | `/risk-register` |
| **Package Tier** | Professional+ (feature gate: `risk_register`) |
| **Permissions** | `risk.view`, `risk.create` |
| **Status** | ✅ Implemented |

**Features:**
- Risk items with severity, likelihood, impact, score
- Risk matrix/heatmap visualization
- Treatment plan links

**Data Entities:** RiskRegister, RiskManagementItem

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/risk-register/items` | List items |
| GET | `/api/v1/risk-register/heat-map` | Heat map data |

### 3.5.3 Risk Management

| Field | Detail |
|-------|--------|
| **Purpose** | Manage risk treatments and view risk analytics |
| **URL** | `/risk-management` |
| **Package Tier** | Enterprise (feature gate: `risk_management`) |
| **Permissions** | `risk.view`, `risk.create`, `risk.edit` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Treatments** — Treatment plans with strategy (mitigate/accept/transfer/avoid), status, owner, timeline, budget
2. **Analytics** — Risk trends, distribution charts, effectiveness metrics, scoring models

**TreatmentPlan Status Lifecycle:** `planned → in_progress → completed → monitoring`

**Data Entities:** TreatmentPlan, RiskScoringModel, RiskManagementItem

### 3.5.4 Risk Prioritization

| Field | Detail |
|-------|--------|
| **Purpose** | AI-driven risk prioritization with gap ranking and breach analysis |
| **URL** | `/risk-prioritization` |
| **Package Tier** | All tiers |
| **Permissions** | `risk.view` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Overview** — Ranked gaps table with priority scores
2. **Charts** — Risk distribution, breach probability analysis
3. **Breaches** — HHS breach intelligence overlay

**User Actions:**
- View prioritized gaps (risk-weighted scoring)
- Analyze breach scenarios
- Save risk snapshots for trend tracking

**Data Entities:** RiskPrioritizationScore, BreachIntelligenceRecord, RiskSnapshot

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/risk-prioritization/calculate` | Calculate scores |
| GET | `/api/v1/risk-prioritization/roadmap` | ROI-based remediation roadmap |
| GET | `/api/v1/risk-prioritization/threat-intelligence` | HHS breach data |
| GET | `/api/v1/risk-prioritization/trends` | Historical trends |

---

## 3.6 Remediation & Auto-Remediation

### 3.6.1 Remediation

| Field | Detail |
|-------|--------|
| **Purpose** | Track and manage remediation issues from compliance findings |
| **URL** | `/remediation` |
| **Package Tier** | All tiers |
| **Permissions** | `remediation.view`, `remediation.create` |
| **Status** | ✅ Implemented |

**Features:**
- Remediation issues list with title, status, priority, assignee, due date
- AI-powered remediation suggestions
- Link to source finding

**Remediation Status Lifecycle:** `open → in_progress → completed → verified → deferred`

**User Actions:**
- Create remediation issue (title, description, priority, assignee, due date)
- Update issue status
- Get AI remediation suggestion
- Filter and search

**Data Entities:** Remediation, Finding, Gap

### 3.6.2 Auto-Remediation

| Field | Detail |
|-------|--------|
| **Purpose** | Automated compliance remediation with playbooks, rules engine, and execution tracking |
| **URL** | `/auto-remediation` |
| **Package Tier** | Enterprise (feature gate: `auto_remediation`) |
| **Permissions** | `compliance.manage`, `remediation.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Command Center** — Active remediation stats dashboard
2. **Playbooks** — Library with trigger conditions, actions, cooldown
3. **Execution History** — Success/failure details, actions taken
4. **Rules Engine** — Condition/action rules, active toggle
5. **Metrics & Savings** — Time saved, issues auto-resolved, cost savings

**Execution Status Lifecycle:** `pending → executing → completed → failed → escalated → rolled_back`

**Data Entities:** RemediationPlaybook, RemediationExecution, RemediationRule, EscalationPolicy

---

## 3.7 Incidents & Breach Management

### 3.7.1 Incidents

| Field | Detail |
|-------|--------|
| **Purpose** | Report, track, and manage security incidents with breach assessment |
| **URL** | `/incidents` |
| **Package Tier** | Professional+ (feature gate: `incidents`) |
| **Permissions** | `incidents.view`, `incidents.create` |
| **Status** | ✅ Implemented |

**Features:**
- Incident summary stats (open, resolved, PHI-involved, avg resolution time)
- Incident list with title, severity, type, status, PHI involvement flag
- AI-assisted breach determination (4-factor risk assessment per HIPAA § 164.402)
- State-specific breach notification deadlines

**Incident Status Lifecycle:** `reported → investigating → contained → resolved → closed`

**Incident Types:** security_incident, breach, near_miss

**State Notification Deadlines:** CA (15d), FL (30d), NY (expedient), TX (60d), IL, MA, CT (60d), CO (30d), OR (45d), WA (30d), HIPAA federal default (60d)

**User Actions:**
- Report new incident (title, description, type, severity, PHI flag)
- Update status and details
- Run breach determination (AI-assisted)
- Track HHS/media notification requirements

**Data Entities:** Incident (with encrypted description for PHI)

### 3.7.2 Breach Simulation

| Field | Detail |
|-------|--------|
| **Purpose** | Run tabletop breach simulation exercises with scenario management |
| **URL** | `/breach-sim` |
| **Package Tier** | Enterprise (feature gate: `breach_simulation`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features:**
- Command center with simulation overview
- Scenario library with descriptions, complexity levels
- Simulation results and response scoring
- Schedule management for recurring simulations

**TabletopExercise Status Lifecycle:** `scheduled → in_progress → completed → cancelled`

**Data Entities:** BreachScenario, TabletopExercise, ExerciseResponse, SimulationResult

### 3.7.3 Alerts

| Field | Detail |
|-------|--------|
| **Purpose** | View and manage compliance and security alerts |
| **URL** | `/alerts` |
| **Package Tier** | All tiers |
| **Permissions** | `monitoring.view`, `monitoring.edit` (preferences) |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Alerts** — Alert list with type, severity, timestamp, read status
2. **Preferences** — Notification preferences configuration

**User Actions:**
- View alerts
- Mark individual/all alerts as read
- Acknowledge/dismiss alerts
- Configure notification preferences

**Data Entities:** Finding (alert_status: active/acknowledged/dismissed), MonitoringAlert

---

## 3.8 Vendor & Third-Party Risk Management

### 3.8.1 Vendors

| Field | Detail |
|-------|--------|
| **Purpose** | Manage vendor inventory with BAA tracking and risk categorization |
| **URL** | `/vendors` |
| **Package Tier** | Professional+ (feature gate: `vendors`) |
| **Permissions** | `vendors.view`, `vendors.manage` |
| **Status** | ✅ Implemented |

**Features:**
- Vendor list with name, type, risk level, BAA status, PHI access flag
- Vendor details with contacts, services, compliance status

**BAA Status Lifecycle:** `none → draft → active → expired → needs_review`

**User Actions:**
- Add/edit/delete vendors
- Track BAA status and expiry dates
- Filter by risk level, BAA status, search

**Data Entities:** Vendor

### 3.8.2 Vendor Risk

| Field | Detail |
|-------|--------|
| **Purpose** | Assess and monitor vendor risk with scoring and continuous monitoring |
| **URL** | `/vendor-risk` |
| **Package Tier** | Professional+ (feature gate: `vendor_risk`) |
| **Permissions** | `vendors.manage` |
| **Status** | ✅ Implemented |

**Features:**
- Vendor risk dashboard with aggregate scores
- Individual vendor risk assessments (questionnaire-based)
- Risk trend charts, compliance status per vendor

**VendorRiskAssessment Status:** `draft → in_progress → completed → archived`

**Data Entities:** VendorRiskAssessment

### 3.8.3 Third-Party Risk Management (TPRM)

| Field | Detail |
|-------|--------|
| **Purpose** | Comprehensive third-party risk management with lifecycle reviews and contract tracking |
| **URL** | `/tprm` |
| **Package Tier** | Enterprise (feature gate: `tprm`) |
| **Permissions** | `vendors.manage` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
- Reviews — Lifecycle management
- Contracts — Contract tracking with expiry
- Risk Scores — Aggregate risk scoring
- Additional tab

**VendorLifecycle Stages:** `prospect → due_diligence → onboarding → active → review → offboarding → terminated`

**User Actions:**
- AI vendor security review
- Vendor discovery scan (shadow IT detection)
- Enable continuous monitoring per vendor
- Track contracts and lifecycle stages

**Data Entities:** Vendor, VendorContract, VendorMonitoring, VendorMonitoringAlert, VendorDiscovery, VendorLifecycle, VendorAIReview, VendorIntelligence

**API Routes (TPRM):**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/tprm/ai-review/{vendor_id}` | AI vendor security review |
| POST | `/api/v1/tprm/discovery/scan` | Vendor discovery scan |
| POST | `/api/v1/tprm/monitoring/{vendor_id}` | Enable monitoring |
| GET | `/api/v1/tprm/monitoring/alerts` | Monitoring alerts |
| POST | `/api/v1/tprm/contracts` | Create contract |
| POST | `/api/v1/tprm/lifecycle/{vendor_id}` | Update lifecycle stage |

### 3.8.4 Due Diligence

| Field | Detail |
|-------|--------|
| **Purpose** | Conduct vendor due diligence assessments before onboarding |
| **URL** | `/due-diligence` |
| **Package Tier** | Enterprise (feature gate: `due_diligence`) |
| **Permissions** | `vendors.manage` |
| **Status** | ✅ Implemented |

**DueDiligenceProject Status:** `planning → assessment → analysis → reporting → completed → cancelled`

**Data Entities:** DueDiligenceProject, DiligenceAssessment, DiligenceFinding, LiabilityReport

### 3.8.5 Contract Intelligence

| Field | Detail |
|-------|--------|
| **Purpose** | AI-powered contract analysis for compliance requirements extraction |
| **URL** | `/contract-intelligence` |
| **Package Tier** | All tiers |
| **Permissions** | `documents.manage` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Requirements** — Extracted contract requirements
2. **Analyze** — AI analysis interface
3. **Templates** — BAA and contract templates

**Data Entities:** ContractAnalysis, ContractClause, BAATemplate

### 3.8.6 Questionnaires

| Field | Detail |
|-------|--------|
| **Purpose** | Create and manage security/compliance questionnaires with AI-assisted responses |
| **URL** | `/questionnaires` |
| **Package Tier** | Professional+ (feature gate: `questionnaires`) |
| **Permissions** | `vendors.manage` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Questionnaires** — List with status, completion %
2. **Knowledge Base** — Entries for AI auto-fill
3. **AI Insights** — Response suggestions

**Questionnaire Status:** `draft → in_progress → review → completed → sent`
**Question Status:** `unanswered → ai_suggested → answered → reviewed`

**Data Entities:** Questionnaire, QuestionnaireQuestion, KnowledgeBaseEntry

---

## 3.9 Personnel & Training

### 3.9.1 Personnel

| Field | Detail |
|-------|--------|
| **Purpose** | Manage workforce directory with HIPAA roles, access reviews, and compliance tracking |
| **URL** | `/personnel` |
| **Package Tier** | Professional+ (feature gate: `personnel`) |
| **Permissions** | `personnel.view`, `personnel.create` |
| **Status** | ✅ Implemented |

**Features (3+ Tabs):**
- Directory — Personnel table with department, title, role, compliance status
- Access Reviews — Review schedules and status
- Additional compliance tracking

**Employee Status:** `active → inactive → onboarding → offboarding`

**User Actions:**
- Add/edit/delete personnel records
- Assign HIPAA roles
- Conduct access reviews
- Track training compliance per employee
- Manage onboarding/offboarding workflows
- Create employee groups

**Data Entities:** Employee, ComplianceTask, SystemAccess, OnboardingWorkflow, WorkflowStep, EmployeeGroup

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/v1/personnel/employees` | CRUD employees |
| GET/POST | `/api/v1/personnel/tasks` | Compliance tasks |
| GET/POST | `/api/v1/personnel/access` | System access records |
| GET/POST | `/api/v1/personnel/workflows` | Onboarding/offboarding workflows |
| GET/POST | `/api/v1/personnel/groups` | Employee groups |
| GET/POST | `/api/v1/personnel/onboarding-templates` | Templates |

### 3.9.2 Employee Compliance

| Field | Detail |
|-------|--------|
| **Purpose** | Track individual employee compliance status and assignments |
| **URL** | `/employee-compliance` |
| **Package Tier** | Professional+ (feature gate: `employee_compliance`) |
| **Permissions** | `personnel.create` |
| **Status** | ✅ Implemented |

**Features:**
- Employee list with compliance status (compliant/non-compliant/pending)
- Onboarding/offboarding checklist booleans per employee

**Data Entities:** EmployeeCompliance, OnboardingWorkflow

### 3.9.3 Training

| Field | Detail |
|-------|--------|
| **Purpose** | Manage HIPAA training programs, courses, and completion records |
| **URL** | `/training` |
| **Package Tier** | All tiers |
| **Permissions** | `training.view`, `training.create`, `training.manage` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Training Records** — Records with employee, course, completion date, score
2. **Courses** — Course library with descriptions, duration, required flag
3. **Compliance Report** — Organization-wide training metrics

**TrainingRecord Status:** `not_started → in_progress → completed → expired → overdue`

**User Actions:**
- Assign training to employees
- Create courses
- View/filter records by completion status
- Generate compliance reports

**Data Entities:** TrainingCourse, TrainingRecord, PolicyAcknowledgment

### 3.9.4 Security Training

| Field | Detail |
|-------|--------|
| **Purpose** | Interactive security awareness training with courses, quizzes, and admin management |
| **URL** | `/security-training` |
| **Package Tier** | Professional+ (feature gate: `security_training`) |
| **Permissions** | `training.view`, `training.create` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Dashboard** — Personal progress, completion rate, upcoming deadlines
2. **Courses** — Catalog with modules, difficulty, duration, quizzes
3. **Admin View** — Organization-wide enrollment and completion stats (admin-only)

**SecurityEnrollment Status:** `enrolled → in_progress → completed → failed → expired`

**User Actions:**
- View and take courses
- Submit quiz answers (auto-graded)
- Track personal progress
- Admin: manage assignments and view analytics

**Data Entities:** SecurityCourse (with content_modules JSON including quiz questions), SecurityEnrollment

### 3.9.5 Collaboration

| Field | Detail |
|-------|--------|
| **Purpose** | Team collaboration hub with task board, activity feed, and workflow management |
| **URL** | `/collaboration` |
| **Package Tier** | Enterprise (feature gate: `collaboration`) |
| **Permissions** | `collaboration.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Board** — Kanban-style task board
2. **My Tasks** — Personal task list
3. **Activity** — Activity feed
4. **Workflows** — Workflow templates
5. **Metrics** — Team metrics

**CollabTask Status:** `todo → in_progress → in_review → blocked → completed → cancelled`

**Data Entities:** CollabTask, CollabTaskComment, CollabWorkflow, CollabWorkflowInstance

---

## 3.10 AI Features

### 3.10.1 AI Agent

| Field | Detail |
|-------|--------|
| **Purpose** | AI-powered compliance agent with action-oriented capabilities |
| **URL** | `/ai-agent` |
| **Package Tier** | Professional+ (feature gate: `ai_agent`) |
| **Permissions** | `ai.chat` (chat), `ai.manage` (config) |
| **Status** | ✅ Implemented |

**Features:**
- Agent dashboard with available actions
- Chat interface for AI interaction
- Action execution results (generate policy, import/analyze policies, check evidence, map controls)
- Semantic search across compliance data

**User Actions:**
- Natural language Q&A about compliance
- Generate complete policies
- Import and analyze policy documents
- Check evidence adequacy
- Map policy text to controls

**Data Entities:** AIConversation, AIMessage, AIGeneratedPolicy

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/ai-agent/ask` | Natural language Q&A |
| POST | `/api/v1/ai-agent/search` | Semantic search |
| POST | `/api/v1/ai-agent/generate-policy` | Generate complete policy |
| POST | `/api/v1/ai-agent/import-policies` | Import and analyze |
| POST | `/api/v1/ai-agent/check-evidence` | Evidence adequacy check |
| POST | `/api/v1/ai-agent/map-controls` | Map to controls |

### 3.10.2 AI Assistant

| Field | Detail |
|-------|--------|
| **Purpose** | Conversational AI assistant for compliance questions and guidance |
| **URL** | `/ai-assistant` |
| **Package Tier** | Professional+ (feature gate: `ai_assistant`) |
| **Permissions** | `ai.chat` |
| **Status** | ✅ Implemented |

**Features:**
- Chat message history
- AI response with formatting
- Conversation management (list, delete)
- Policy analysis, remediation suggestions, policy drafting

**Data Entities:** AIConversation, AIMessage

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/ai/chat` | Send message |
| GET | `/api/v1/ai/conversations` | List conversations |
| POST | `/api/v1/ai/analyze-policy` | Policy analysis |
| POST | `/api/v1/ai/suggest-remediation` | Remediation suggestion |
| POST | `/api/v1/ai/draft-policy` | Policy drafting |

### 3.10.3 AI Governance

| Field | Detail |
|-------|--------|
| **Purpose** | Manage AI model registry, risk assessments, and governance policies (EU AI Act compliance) |
| **URL** | `/ai-governance` |
| **Package Tier** | Enterprise (feature gate: `ai_governance`) |
| **Permissions** | `ai.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Registry** — AI model registry with names, types, risk levels
2. **Risk** — AI risk assessments
3. **Policies** — Governance policies
4. **Audit** — AI usage audit logs
5. **Impact** — Impact assessments

**AISystem Risk Levels:** `unacceptable | high | limited | minimal`

**Data Entities:** AISystem, AIRiskAssessment, AIGovernancePolicy, AIAuditLog

### 3.10.4 Knowledge Graph

| Field | Detail |
|-------|--------|
| **Purpose** | Interactive visualization of compliance knowledge relationships |
| **URL** | `/knowledge-graph` |
| **Package Tier** | All tiers |
| **Permissions** | Authenticated |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Graph Explorer** — Nodes (requirements, controls, documents, risks) and links
2. **Coverage** — Mapped vs unmapped items
3. **Statistics** — Graph composition metrics

**Data Entities:** Cross-entity visualization (HIPAARequirement, Control, Document, RiskItem)

### 3.10.5 Learning Engine

| Field | Detail |
|-------|--------|
| **Purpose** | Monitor and improve AI model accuracy through feedback loops |
| **URL** | `/learning-engine` |
| **Package Tier** | All tiers |
| **Permissions** | `ai.manage` (corrections) |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Overview** — Accuracy metrics, model performance
2. **Corrections** — User-submitted corrections to AI outputs
3. **Accuracy** — Accuracy trends over time
4. **Patterns** — Detected compliance patterns
5. **Flywheel** — How user feedback improves the system

### 3.10.6 Digital Twin

| Field | Detail |
|-------|--------|
| **Purpose** | Compliance digital twin for simulation and predictive analysis |
| **URL** | `/digital-twin` |
| **Package Tier** | Enterprise (feature gate: `digital_twin`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Twin Dashboard** — Current compliance state replica
2. **Simulations** — What-if scenarios
3. **State History** — Timeline of state changes
4. **Alerts & Drift** — Divergence detection between twin and actual state
5. **Predictions** — Future compliance posture projections

**TwinSimulation Status:** `draft → running → completed → failed`

**Data Entities:** DigitalTwinState, TwinSimulation, TwinComparison, TwinAlert

---

## 3.11 Reports & Audit Trail

### 3.11.1 Reports

| Field | Detail |
|-------|--------|
| **Purpose** | Generate and view compliance reports with trend data |
| **URL** | `/reports` |
| **Package Tier** | All tiers |
| **Permissions** | `reports.view`, `reports.create` |
| **Status** | ✅ Implemented |

**Features:**
- Report list with title, type, generated date, format
- Report types: executive_summary, compliance_detail, risk_assessment, gap_analysis, training_status
- Dashboard overview and trend charts

**Data Entities:** AuditReport

### 3.11.2 Advanced Reports

| Field | Detail |
|-------|--------|
| **Purpose** | Custom report builder with scheduling capabilities |
| **URL** | `/advanced-reports` |
| **Package Tier** | Professional+ (feature gate: `advanced_reports`) |
| **Permissions** | `reports.create`, `reports.edit`, `reports.delete` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Report Builder** — Custom report configuration
2. **Scheduled Reports** — Recurring reports (frequency, recipients, format)

**Data Entities:** ScheduledReport, ReportHistory

### 3.11.3 Audit Reports

| Field | Detail |
|-------|--------|
| **Purpose** | Generate audit-ready reports from templates with professional formatting |
| **URL** | `/audit-reports` |
| **Package Tier** | Professional+ (feature gate: `audit_reports`) |
| **Permissions** | `reports.create`, `reports.delete` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Report Templates** — Pre-built audit report formats (hipaa_readiness, soc2_readiness, executive_summary, gap_analysis, risk_assessment_summary, evidence_package)
2. **Generated Reports** — Generated reports with status

**AuditReport Status:** `draft → generating → completed → archived`

**Data Entities:** AuditReport, ReportHistory

### 3.11.4 Audit Trail

| Field | Detail |
|-------|--------|
| **Purpose** | Tamper-proof audit log of all system and user activity |
| **URL** | `/audit-trail` |
| **Package Tier** | All tiers |
| **Permissions** | `audit_trail.view`, `audit_trail.export` |
| **Status** | ✅ Implemented |

**Features:**
- Audit log entries with timestamp, user, action, resource, IP address
- Filterable/searchable by date range, user, action type
- Export as CSV
- **Immutable** — PostgreSQL triggers prevent UPDATE/DELETE on audit_logs and event_logs

**Data Entities:** EventLog, AuditLog

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/audit-trail/` | List entries (paginated, filtered) |
| GET | `/api/v1/audit-trail/actions` | Distinct actions |
| GET | `/api/v1/audit-trail/summary` | Activity summary |
| GET | `/api/v1/audit-trail/export` | Export as CSV |

---

## 3.12 Integrations

### 3.12.1 Enterprise Integrations

| Field | Detail |
|-------|--------|
| **Purpose** | Connect and manage enterprise tool integrations for automated compliance |
| **URL** | `/enterprise-integrations` |
| **Package Tier** | Professional+ (feature gate: `enterprise_integrations`) |
| **Permissions** | `integrations.view`, `integrations.create`, `integrations.manage` |
| **Status** | ✅ Implemented |

**Features (3 Tabs):**
1. **Integration Catalog** — Available integrations with descriptions (14+ types)
2. **Connected** — Connected integrations with status and sync details
3. **Findings** — Compliance issues detected through integrations

**User Actions:**
- Browse integration catalog
- Connect new integration (with credentials/config)
- Test connection
- Trigger sync/scan
- View findings per integration
- Disconnect integrations
- Configure webhooks

**Data Entities:** IntegrationConfig, IntegrationFinding, IntegrationWebhook, ScanResult

> See [Part 5: Integrations](#part-5-integrations) for full integration catalog.

---

## 3.13 Settings & Platform Configuration

### 3.13.1 Settings

| Field | Detail |
|-------|--------|
| **Purpose** | Organization settings, HIPAA configuration, role management, notifications, team management |
| **URL** | `/settings` |
| **Package Tier** | All tiers |
| **Permissions** | `settings.view`, `settings.edit`, `settings.manage` |
| **Status** | ✅ Implemented |

**Features (6+ Tabs):**
1. **Organization** — Profile (name, type, industry, address)
2. **HIPAA** — Covered entity type, designated officers, BAA template
3. **Roles** — Role management with permissions matrix
4. **Notifications** — Notification preferences
5. **Team** — Member list with roles and status, invite management
6. **Additional** — AI config, billing/usage

**User Actions:**
- Edit organization details
- Configure HIPAA settings
- Manage roles and permissions
- Set notification preferences
- Invite/deactivate team members

**Data Entities:** Tenant, Organization, TenantUser, TenantAIConfig

### 3.13.2 Platform Settings

| Field | Detail |
|-------|--------|
| **Purpose** | Advanced platform configuration: SSO, SCIM, custom roles, API keys, webhooks |
| **URL** | `/platform-settings` |
| **Package Tier** | Enterprise (feature gate: `platform_settings`) |
| **Permissions** | `settings.manage`, `settings.edit` |
| **Status** | ✅ Implemented |

**Features (3+ Tabs):**
1. **SSO** — SAML 2.0, OpenID Connect configuration
2. **SCIM** — Provisioning setup, token management
3. **Roles** — Custom roles with granular permission matrix

**Data Entities:** SSOConfig, CustomRole

### 3.13.3 Onboarding

| Field | Detail |
|-------|--------|
| **Purpose** | Guided 7-step onboarding wizard for new organizations |
| **URL** | `/onboarding` |
| **Package Tier** | All tiers |
| **Permissions** | Authenticated (all new users) |
| **Status** | ✅ Implemented |

**Steps:**
1. Welcome
2. Organization setup (org_type, state, size, operating_states, phi_types)
3. Compliance framework selection
4. Team invite
5. Integrations configuration
6. Document upload
7. Review & complete

**Data Entities:** OnboardingProgress, Organization, ComplianceArchetype

### 3.13.4 HIPAA Configuration

| Field | Detail |
|-------|--------|
| **Purpose** | Tenant-specific HIPAA configuration |
| **URL** | Via Settings page |
| **Status** | ✅ Implemented |

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/hipaa-config/` | Get configuration |
| PUT | `/api/v1/hipaa-config/` | Update configuration |
| GET | `/api/v1/hipaa-config/options` | Static options (org types, PHI types, states) |

---

## 3.14 Monitoring & Analytics

### 3.14.1 Penalty Exposure

| Field | Detail |
|-------|--------|
| **Purpose** | Calculate and visualize HIPAA penalty exposure based on current compliance gaps |
| **URL** | `/penalty-exposure` |
| **Package Tier** | All tiers |
| **Permissions** | `compliance.view` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
1. **Cost Breakdown** — By category and violation type
2. **Top Gaps** — Ranked by financial exposure
3. **Violations** — Individual violation details with penalty calculations (4-tier structure)
4. **Trends** — Exposure trends over time

**Data Entities:** PenaltyExposure, ViolationMapping, ExposureSnapshot

**API Routes:**
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/penalty-calculator/calculate` | Calculate exposure |
| GET | `/api/v1/penalty-calculator/violations` | Violation mappings |
| GET | `/api/v1/penalty-calculator/trends` | Trend over time |

### 3.14.2 Behavior Analytics

| Field | Detail |
|-------|--------|
| **Purpose** | User behavior analytics for detecting anomalous access patterns |
| **URL** | `/behavior-analytics` |
| **Package Tier** | All tiers |
| **Permissions** | `monitoring.manage` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
1. **Dashboard** — Risk scores and anomaly counts
2. **Anomalies** — Anomaly list with details and severity
3. **Events** — Security events timeline
4. **Rules** — Detection rules configuration

**Data Entities:** AccessEvent, UserBaseline, BehaviorAnomaly, AnomalyRule

### 3.14.3 Regulatory Radar

| Field | Detail |
|-------|--------|
| **Purpose** | Track regulatory changes and assess their impact on compliance |
| **URL** | `/regulatory-radar` |
| **Package Tier** | Enterprise (feature gate: `regulatory_radar`) |
| **Permissions** | `compliance.manage` |
| **Status** | ✅ Implemented |

**Features (4 Tabs):**
1. **Radar** — Visualization of upcoming regulatory changes
2. **Feed** — News feed of regulatory updates
3. **Impact** — Impact assessments per regulation
4. **Trends** — Regulatory landscape analysis

**RegulatoryUpdate Status:** `new → analyzing → action_required → monitoring → archived`

**Data Entities:** RegulatoryUpdate, RegulatoryAlert, RegulatorySubscription, ImpactAssessment

### 3.14.4 Assets

| Field | Detail |
|-------|--------|
| **Purpose** | IT asset inventory with vulnerability tracking and device monitoring |
| **URL** | `/assets` |
| **Package Tier** | Professional+ (feature gate: `asset_management`) |
| **Permissions** | `assets.view`, `assets.create`, `assets.manage` |
| **Status** | ✅ Implemented |

**Features (2 Tabs):**
1. **Inventory** — Asset table with name, type, owner, criticality, PHI access, compliance status
2. **Vulnerabilities** — CVE references, severity, CVSS scores, affected assets

**Asset Status:** `active → inactive → decommissioned → unknown`
**Vulnerability Status:** `open → in_progress → resolved → accepted → false_positive`

**Data Entities:** Asset, AssetVulnerability, DeviceMonitor, MonitoringAlert, AssetAgent

### 3.14.5 Insights

| Field | Detail |
|-------|--------|
| **Purpose** | AI-powered compliance insights with flywheel metrics and pattern detection |
| **URL** | `/insights` |
| **Package Tier** | All tiers |
| **Permissions** | Authenticated |
| **Status** | ✅ Implemented |

**Features:**
- Flywheel status (AI improvement over time)
- AI-generated insights and recommendations
- Pattern library and applicable patterns
- Active learning metrics
- Cohort summaries and archetype profiles

**Data Entities:** RiskSnapshot, ExposureSnapshot, ComplianceArchetype, CohortBenchmark

---

## 3.15 Customer Portal & Trust Center

### 3.15.1 Customer Portal

| Field | Detail |
|-------|--------|
| **Purpose** | Manage customer-facing compliance portal for sharing compliance status |
| **URL** | `/customer-portal` |
| **Package Tier** | Enterprise (feature gate: `customer_portal`) |
| **Permissions** | `settings.manage` |
| **Status** | ✅ Implemented |

**Features (5 Tabs):**
1. **Portal Management** — Settings and branding
2. **Visitors** — Visitor analytics
3. **Documents** — Shared documents
4. **Inquiries** — Customer inquiries (status: new → in_progress → resolved → closed)
5. **Analytics** — Usage dashboard

**Data Entities:** CustomerPortal, PortalVisitor, PortalDocument, PortalInquiry

### 3.15.2 Trust Center Admin

| Field | Detail |
|-------|--------|
| **Purpose** | Admin panel for managing the public-facing Trust Center |
| **URL** | `/trust-center-admin` |
| **Package Tier** | Enterprise (feature gate: `trust_center`) |
| **Permissions** | `settings.manage` |
| **Status** | ✅ Implemented |

**Features (6 Tabs):**
1. **Overview** — Live status
2. **Configuration** — Branding (colors, logo, hero text), section visibility, chatbot toggle
3. **Documents** — Published documents
4. **FAQs** — FAQ management
5. **Access Requests** — Approve/deny (status: pending → approved → denied)
6. **Analytics** — Page views, document downloads

**Data Entities:** TrustCenterConfig, TrustCenterDocument, TrustCenterFAQ, TrustCenterAccessRequest, TrustCenterAnalytics

---

## 3.16 Public Pages (15 Routes)

### 3.16.1 Landing Page (`/`)

| Field | Detail |
|-------|--------|
| **Purpose** | Marketing landing page for unauthenticated visitors |
| **Status** | ✅ Implemented |

**Sections:** Hero, Social Proof, Features, How It Works, Stats, HIPAA Coverage, Integrations, Frameworks, Testimonials, Pricing Teaser, CTA, Footer

**Behavior:** Redirects to `/dashboard` if user has access token; forces light mode

### 3.16.2 Login (`/login`)

| Field | Detail |
|-------|--------|
| **Purpose** | User authentication |
| **Status** | ✅ Implemented |

Email/password login. Rate-limited: 5 attempts per 60 seconds per IP. Redirects to `/dashboard` on success.

### 3.16.3 Signup (`/signup`)

| Field | Detail |
|-------|--------|
| **Purpose** | New account registration |
| **Status** | ✅ Implemented |

Fields: full_name, email, company_name, password. Password: 8+ chars, upper, lower, digit. Redirects to `/onboarding` on success.

### 3.16.4 Forgot Password (`/forgot-password`)

Always shows success message (prevents email enumeration). ✅ Implemented

### 3.16.5 Reset Password (`/reset-password`)

Token validation on mount. New password + confirm with strength requirements. ✅ Implemented

### 3.16.6 Invite Accept (`/invite/accept`)

Token validation showing invitee email/name and tenant name. Set password, join organization. Redirects to `/dashboard`. ✅ Implemented

### 3.16.7 Complete Assignment (`/complete/$token`)

Public page for completing assigned tasks/training (no login required). Token-based assignment lookup. ✅ Implemented

### 3.16.8 Trust Center Index (`/trust-center`)

Public trust center overview: 6 compliance frameworks, 4 security practices. ✅ Implemented

### 3.16.9 Trust Center Per-Org (`/trust-center/$slug`)

Organization-specific public trust center with compliance badges, documents, FAQ, chatbot. Customizable branding. ✅ Implemented

### 3.16.10 About (`/about`)

Company about page. 3 values, 4 stats (500+ orgs, 73 HIPAA requirements, 24/7 monitoring, 10x faster). ✅ Implemented

### 3.16.11 Blog (`/blog`)

❌ **Coming Soon** — Placeholder with 3 mock posts. Newsletter signup not connected to backend.

### 3.16.12 Contact (`/contact`)

Contact form (name, email, company, subject, message). 3 contact cards (support/sales/security). ✅ Implemented

### 3.16.13 Security (`/security`)

Public security practices page. 6 sections. ✅ Implemented

### 3.16.14 Privacy Policy (`/privacy-policy`)

Legal privacy policy. 8 sections. ✅ Implemented

### 3.16.15 Terms of Service (`/terms-of-service`)

Legal terms of service. ✅ Implemented

---

## 3.17 Platform Admin Panel (8 Routes)

### 3.17.1 Admin Login (`/admin/login`)

Separate authentication flow. Stores `admin_token` and `admin_user` in localStorage. ✅ Implemented

### 3.17.2 Admin Dashboard (`/admin/dashboard`)

| Field | Detail |
|-------|--------|
| **Purpose** | Platform-wide overview for system administrators |
| **Status** | ✅ Implemented |

**Features:**
- Platform stats: total tenants, active users, MRR, error rate
- Platform health (services, databases, queues)
- Usage charts (by tenant, by plan)
- Platform alerts and recent errors

### 3.17.3 Admin Tenants (`/admin/tenants`)

| Field | Detail |
|-------|--------|
| **Purpose** | Manage all tenants on the platform |
| **Status** | ✅ Implemented |

**User Actions:** Create tenant, edit details, view detail page, search/filter, copy invite link

### 3.17.4 Admin Tenant Detail (`/admin/tenants/$tenantId`)

| Field | Detail |
|-------|--------|
| **Purpose** | Detailed view and management of individual tenant |
| **Status** | ✅ Implemented |

**User Actions:** Edit details, change plan, send notification, reset data, suspend/activate, delete tenant

### 3.17.5 Admin Packages (`/admin/packages`)

| Field | Detail |
|-------|--------|
| **Purpose** | Manage subscription packages/plans |
| **Status** | ✅ Implemented |

**User Actions:** Create/edit/delete packages. Configure tier, pricing (monthly/yearly), limits, features.

### 3.17.6 Admin Billing (`/admin/billing`)

| Field | Detail |
|-------|--------|
| **Purpose** | Platform-wide billing management |
| **Status** | ✅ Implemented |

**Features (3 Tabs):** Invoices, Contracts, Payment History
**Metrics:** MRR, ARR, churn rate, ARPU

### 3.17.7 Admin Monitoring (`/admin/monitoring`)

| Field | Detail |
|-------|--------|
| **Purpose** | Platform health monitoring and performance metrics |
| **Status** | ✅ Implemented |

**Features:** Service health, performance metrics, error rates, per-tenant resource usage, alert history

---

## 3.18 Route Summary

| Category | Page Count | Key Routes |
|----------|-----------|------------|
| Dashboard & Overview | 1 | `/dashboard` |
| HIPAA Roadmap | 1 | `/hipaa-roadmap` |
| Compliance Management | 8 | `/compliance`, `/compliance/$checkId`, `/scanning`, `/controls`, `/frameworks`, `/regulations`, `/compliance-code`, `/compliance-costs` |
| Documents & Evidence | 3 | `/documents`, `/evidence`, `/policy-templates` |
| Risk Management | 4 | `/risk-assessment`, `/risk-register`, `/risk-management`, `/risk-prioritization` |
| Remediation & Auto-Remediation | 2 | `/remediation`, `/auto-remediation` |
| Incidents & Breach | 3 | `/incidents`, `/breach-sim`, `/alerts` |
| Vendor & TPRM | 6 | `/vendors`, `/vendor-risk`, `/tprm`, `/due-diligence`, `/contract-intelligence`, `/questionnaires` |
| Personnel & Training | 5 | `/personnel`, `/employee-compliance`, `/training`, `/security-training`, `/collaboration` |
| AI Features | 6 | `/ai-agent`, `/ai-assistant`, `/ai-governance`, `/knowledge-graph`, `/learning-engine`, `/digital-twin` |
| Reports & Audit | 4 | `/reports`, `/advanced-reports`, `/audit-reports`, `/audit-trail` |
| Integrations | 1 | `/enterprise-integrations` |
| Settings & Config | 4 | `/settings`, `/platform-settings`, `/onboarding`, `/hipaa-config` (via settings) |
| Monitoring & Analytics | 5 | `/penalty-exposure`, `/behavior-analytics`, `/regulatory-radar`, `/assets`, `/insights` |
| Customer Portal & Trust Center | 2 | `/customer-portal`, `/trust-center-admin` |
| Public Pages | 15 | `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/invite/accept`, `/complete/$token`, `/trust-center`, `/trust-center/$slug`, `/about`, `/blog`, `/contact`, `/security`, `/privacy-policy`, `/terms-of-service` |
| Platform Admin | 8 | `/admin/login`, `/admin/dashboard`, `/admin/tenants`, `/admin/tenants/$tenantId`, `/admin/packages`, `/admin/billing`, `/admin/monitoring`, `/admin/` layout |
| **Total** | **78** | |

---

# Part 4: Data Flows

## 4.1 Document → Compliance Pipeline

```
Documents (/documents) — Upload document
  → Document created (status: uploaded)
  → Auto text extraction (PDF, DOCX, TXT, CSV, Excel, images via OCR)
  → Auto classification by document type
  → Auto relevance detection
  → If relevant: auto HIPAA analysis triggered
  → ComplianceCheck created (status: pending → running → completed)
  → Findings created (compliant/non_compliant/partial)
  → Gaps created (missing_policy/outdated/insufficient)
  → Compliance Detail (/compliance/$checkId) — view results
  → Dashboard — overall score updated
  → HIPAA Roadmap — requirement status updated
  → Alerts — non-compliant findings appear as active alerts
```

## 4.2 Finding → Remediation Pipeline

```
Compliance Detail or Alerts — finding identified
  → User creates Remediation from finding
  → Remediation (/remediation) — track: open → in_progress → completed → verified
  → AI suggestion available (POST /remediation/{id}/ai-suggest)
  → Auto-Remediation — playbook triggered if rule matches
  → Dashboard — remediation stats updated
  → Compliance score recalculated when finding status changes
```

## 4.3 Vendor Management Flow

```
Vendors (/vendors) — create vendor with BAA status
  → TPRM (/tprm) — full lifecycle management:
     → VendorRiskAssessment (questionnaire-based scoring)
     → VendorMonitoring (continuous health checks)
     → VendorContract tracking
     → VendorLifecycle management (prospect → active → offboarded)
     → VendorAIReview (AI security posture analysis)
     → VendorDiscovery (shadow IT detection scan)
  → Vendor Risk (/vendor-risk) — risk assessments
  → HIPAA Roadmap — BAA compliance status displayed
  → Dashboard — vendor risk summary
  → Due Diligence (/due-diligence) — pre-onboarding assessment
```

## 4.4 Integration Scan Flow

```
Enterprise Integrations (/enterprise-integrations) — connect AWS/Azure/GCP/Okta
  → Integration configured (status: connected)
  → Scan triggered (manual or scheduled)
  → ScanResult created
  → IntegrationFindings created
  → Findings created (source: integration_scan)
  → Compliance Detail — findings appear
  → Alerts — new findings trigger alerts
  → Evidence auto-collected (scan results as evidence)
  → Dashboard — integration health status
```

## 4.5 Training & Personnel Flow

```
Personnel (/personnel) — create/manage employees
  → Training (/training) — assign courses
  → TrainingRecord created (not_started → in_progress → completed)
  → PolicyAcknowledgment assigned
  → Security Training (/security-training) — interactive courses with quizzes
  → SecurityEnrollment tracks progress and quiz scores
  → Employee Compliance (/employee-compliance) — onboarding/offboarding checklists
  → HIPAA Roadmap — training completion %
  → Dashboard — training metrics
```

## 4.6 Risk Assessment Flow

```
Risk Assessment (/risk-assessment) — create assessment (draft)
  → Guided questionnaire or manual risk items
  → RiskItems: threat + vulnerability + asset → likelihood × impact = risk_score
  → Auto-populate from compliance findings
  → Risk Register (/risk-register) — organize by register, heat map
  → Risk Management (/risk-management) — treatment plans
     → Strategy: mitigate/accept/transfer/avoid
     → TreatmentPlan (planned → in_progress → completed → monitoring)
  → Risk Prioritization (/risk-prioritization) — ROI-weighted scoring
  → Sign-off workflow (Security Officer approval)
  → Dashboard — overall risk score
  → Reports — risk assessment summary
```

## 4.7 Incident Response Flow

```
Incidents (/incidents) — report incident (status: reported)
  → Investigation (status: investigating)
  → AI-assisted breach determination (4-factor risk assessment)
  → If breach: notification_deadline = 60 days
  → Containment (status: contained)
  → Resolution (status: resolved → closed)
  → If ≥500 individuals: HHS + media notification tracking
  → State-specific deadlines tracked
  → Breach Simulation (/breach-sim) — tabletop exercises
  → Dashboard — active incident count
  → Reports — incident summary
```

## 4.8 Evidence Collection Flow

```
Evidence (/evidence) — manual upload or auto-collection
  → Evidence created (status: collected)
  → Linked to Control via control_id
  → Controls page — evidence count updated
  → Verification workflow (status: verified)
  → EvidenceValidation (automated freshness/contradiction checks)
  → EvidenceCollectionSchedule (automated periodic collection)
  → Framework cross-mapping (evidence satisfies multiple frameworks)
  → Audit Reports — evidence package generation
```

## 4.9 Onboarding Flow

```
Signup → Tenant + Organization + Owner created (trial, 14 days)
  → 7-step wizard:
    1. Welcome → 2. Org setup → 3. Framework selection
    → 4. Team invite → 5. Integrations → 6. Documents → 7. Review
  → ComplianceArchetype matched
  → Controls seeded from library
  → Dashboard accessible
```

## 4.10 Report Generation Flow

```
Reports (/reports) — generate report
  → AuditReport created with report_data
  → Advanced Reports — custom builder + scheduling
  → ScheduledReport (daily|weekly|monthly|quarterly)
  → ReportHistory tracks all generated reports
  → Audit Reports — audit-ready packages
  → Export as PDF/CSV
```

## 4.11 AI Learning Flow

```
AI Assistant/Agent — user interacts with AI
  → AIConversation + AIMessages recorded
  → AI generates policy → AIGeneratedPolicy (draft)
  → User reviews/approves → saved as Document
  → Learning Engine — pattern extraction (background)
  → User corrections fed back
  → Accuracy improves over time (flywheel)
  → Insights (/insights) — applicable patterns surfaced
```

---

# Part 5: Integrations

## 5.1 Integration Catalog

| # | Connector | Type | What It Scans | Status | Config Required |
|---|-----------|------|---------------|--------|----------------|
| 1 | **AWS** | Cloud Infrastructure | S3 encryption, IAM MFA, CloudTrail, RDS, VPC flow logs, EBS encryption | 🟡 Simulated | access_key_id, secret_access_key, region |
| 2 | **Azure** | Cloud Infrastructure | Azure AD MFA, Storage encryption, SQL TDE, NSGs, Key Vault, Activity Logs | 🟡 Simulated | tenant_id, client_id, client_secret, subscription_id |
| 3 | **Okta** | Identity & Access | MFA policies, SSO config, user lifecycle, password policies, session policies | 🟡 Simulated | domain, api_token |
| 4 | **Google Workspace** | Collaboration | 2FA enforcement, admin roles, sharing policies, MDM | 🟡 Simulated | domain, service_account_json |
| 5 | **Microsoft 365** | Collaboration | Conditional Access MFA, Exchange encryption, Teams policies, SharePoint, Purview, DLP | 🟡 Simulated | tenant_id, client_id, client_secret |
| 6 | **GitHub** | DevOps | Secret scanning, branch protection, PR reviews, org 2FA, Dependabot alerts | ✅ **Live API** | org_name, pat_token (scopes: repo, read:org, security_events) |
| 7 | **Slack** | Collaboration | DLP PHI scanning, channel audit, message retention, 2FA enforcement | 🟡 Simulated | workspace_url, bot_token |
| 8 | **AWS S3** | Storage | Bucket encryption, public access blocking, logging, versioning, lifecycle, MFA Delete, Object Lock | 🟡 Simulated | access_key_id, secret_access_key, region |
| 9 | **OneDrive/SharePoint** | Storage | External sharing, PHI detection, DLP, sensitivity labels, guest access | 🟡 Simulated | tenant_id, client_id, client_secret |
| 10 | **Google Drive** | Storage | External sharing, PHI exposure, DLP rules, shared drive permissions | 🟡 Simulated | domain, service_account_json |
| 11 | **Box** | Storage | PHI detection, sharing audit, access permissions, encryption | 🟡 Simulated | client_id, client_secret, enterprise_id |
| 12 | **ServiceNow** | ITSM | Incident response SLAs, change management, CMDB accuracy, audit trail | 🟡 Simulated | instance_url, username, password |
| 13 | **CRM (Salesforce/HubSpot)** | CRM | PHI field detection, access controls, data export monitoring, encryption | 🟡 Simulated | instance_url, client_id, client_secret |
| 14 | **KnowBe4** | Training Provider | Training campaigns, phishing simulations, user completion data | ✅ **Live API** | api_key, region (us/eu/ca/uk/de) |

## 5.2 Internal Scanners (6)

| Scanner | CFR Coverage | What It Checks |
|---------|-------------|----------------|
| **PolicyScanner** | Multiple | Scans all uploaded documents against HIPAA knowledge base (73 requirements) |
| **TechnicalScanner** | 164.312 | Encryption at rest/transit, access logging, backup, patching, firewall |
| **AccessControlScanner** | 164.312(a), 164.308(a)(3-4) | MFA, RBAC, password policies, orphaned accounts, access reviews |
| **EncryptionScanner** | 164.312(a)(2)(iv), 164.312(e)(2)(ii) | Database/storage/email encryption, TLS config, certificate validity, key management |
| **NetworkScanner** | 164.312(e)(1) | Network segmentation, firewall rules, VPN, IDS, monitoring |
| **TrainingScanner** | 164.308(a)(5) | Training completion rates, currency, new hire training, role-based training |

> The Continuous Monitoring Orchestrator (`scanning/monitor.py`) runs all 6 scanners. Each returns `ScanResultData` with `ScanFinding` objects, persisted as `ScanResult` + individual `Finding` rows.

---

# Part 6: API Summary

## 6.1 Endpoint Count by Domain

| Domain | Prefix | Endpoint Count | Feature Gate |
|--------|--------|---------------|-------------|
| Auth | `/api/v1/auth` | 4 | — |
| Invites & Password | `/api/v1/invites` | 4 | — |
| Users | `/api/v1/users` | 6 | — |
| Dashboard | `/api/v1/dashboard` | 3 | — |
| Compliance | `/api/v1/compliance` | 8 | — |
| Documents | `/api/v1/documents` | 9 | — |
| Evidence | `/api/v1/evidence` | 9 | — |
| Vendors | `/api/v1/vendors` | 6 | — |
| Vendor Risk | `/api/v1/vendor-risk` | 5 | `vendor_risk` |
| TPRM | `/api/v1/tprm` | 11 | `tprm` |
| Incidents | `/api/v1/incidents` | 7 | — |
| Risk Assessment | `/api/v1/risk-assessments` | 11 | — |
| Risk Register | `/api/v1/risk-register` | 5 | `risk_register` |
| Risk Management | `/api/v1/risk-management` | 8 | `risk_management` |
| Risk Prioritization | `/api/v1/risk-prioritization` | 6 | — |
| Penalty Calculator | `/api/v1/penalty-calculator` | 5 | — |
| Remediation | `/api/v1/remediation` | 6 | — |
| Auto-Remediation | `/api/v1/auto-remediation` | 9 | `auto_remediation` |
| Controls | `/api/v1/controls` | 12 | — |
| Frameworks | `/api/v1/frameworks` | 11 | `multi_framework` |
| Compliance-as-Code | `/api/v1/compliance-code` | 9 | `compliance_code` |
| Integrations | `/api/v1/integrations` | 6 | — |
| Enterprise Integrations | `/api/v1/enterprise-integrations` | 9 | `enterprise_integrations` |
| AI Assistant | `/api/v1/ai` | 7 | — |
| AI Agent | `/api/v1/ai-agent` | 8 | `ai_agent` |
| AI Governance | `/api/v1/ai-governance` | 9 | `ai_governance` |
| Training | `/api/v1/training` | 10 | — |
| Security Training | `/api/v1/security-training` | 7 | `security_training` |
| Personnel | `/api/v1/personnel` | 18 | `personnel` |
| Reports | `/api/v1/reports` | 3 | — |
| Audit Reports | `/api/v1/audit-reports` | 4 | `audit_reports` |
| Advanced Reports | `/api/v1/advanced-reports` | 6 | `advanced_reports` |
| Audit Trail | `/api/v1/audit-trail` | 4 | — |
| Event Logs | `/api/v1/event-logs` | 4 | — |
| Alerts | `/api/v1/alerts` | 5 | — |
| Monitoring | `/api/v1/monitoring` | 4 | — |
| Assets | `/api/v1/assets` | 12 | `asset_management` |
| HIPAA Roadmap | `/api/v1/hipaa-roadmap` | 2 | — |
| HIPAA Config | `/api/v1/hipaa-config` | 3 | — |
| HIPAA Graph | `/api/v1/hipaa-graph` | 1 | — |
| Settings | `/api/v1/settings` | 5 | — |
| SSO | `/api/v1/sso` | 7 | — |
| RBAC | `/api/v1/rbac` | 6 | — |
| Subscriptions | `/api/v1/subscriptions` | 5 | — |
| Onboarding | `/api/v1/onboarding` | 9 | — |
| Additional groups | Various | 30+ | Various |
| **Estimated Total** | | **~320+ endpoints** | |

## 6.2 Authentication Flow

### Signup
1. `POST /api/v1/auth/signup` — `{ full_name, email, company_name, password }`
2. Password validated: 8+ chars, uppercase, lowercase, digit
3. Email uniqueness check (deactivated accounts freed by renaming)
4. Slug generated from company name (uniqueness with suffix)
5. Creates: Tenant (trial, 14d) → Organization → TenantUser (owner)
6. Welcome email sent (non-blocking)
7. Returns JWT access + refresh tokens

### Login
1. `POST /api/v1/auth/login` — Rate limit: 5 attempts/60s per IP (in-memory)
2. Single optimized query: JOIN TenantUser + Tenant + Organization + Package
3. bcrypt password verification
4. Check user.is_active and tenant.status (active/trial/pending_setup)
5. Update last_login_at
6. Generate JWT pair

### Token Structure
**Access Token (JWT):**
```json
{
  "sub": "user-uuid", "iat": 1711468800, "exp": 1711472400,
  "type": "access", "email": "user@example.com", "full_name": "Name",
  "role": "owner", "tenant_id": "uuid", "organization_id": "uuid",
  "tenant_name": "Company", "tenant_slug": "company", "onboarding_completed": true
}
```

**Refresh Token:** `{ sub, iat, exp, type: "refresh" }` — longer expiry

**Algorithm:** Configurable via `settings.ALGORITHM`, signed with `settings.SECRET_KEY`

### Password Reset
1. `POST /forgot-password` → generates InviteToken (type=password_reset, 1h expiry)
2. Reset email with token link
3. `POST /reset-password` → token validated, password updated, token consumed

### Invite Flow
1. Admin creates user → InviteToken (type=invite)
2. Invite email sent
3. `POST /invite/validate` → validate token
4. `POST /invite/accept` → set password, auto-login

### Logout
- `POST /logout` → adds token to in-memory blocklist
- `is_token_blocked()` checked in auth middleware

## 6.3 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login | 5 attempts per 60 seconds per IP (in-memory) |
| Other endpoints | Configurable (not explicitly documented per-endpoint) |

## 6.4 API Patterns

- **Pagination:** `?page=1&per_page=20` on all list endpoints
- **Filtering:** Query parameters per entity (e.g., `?type=policy&status=analyzed`)
- **Sorting:** `?sort_by=created_at&sort_order=desc`
- **Search:** `?search=keyword` text search
- **Soft-delete:** Most entities use `deleted_at` timestamp (not hard delete)
- **JSON responses:** Consistent envelope with data/pagination/status
- **Error format:** `{ detail: string, error_code?: string }`

---

# Part 7: Technical Architecture

## 7.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript, TanStack Router, TanStack Query, Zustand (state), Tailwind CSS, Recharts, Sonner (toasts) |
| **Backend** | Python + FastAPI |
| **Database** | PostgreSQL (with Row-Level Security) |
| **ORM** | SQLAlchemy (async) |
| **Auth** | JWT (access + refresh tokens), bcrypt password hashing |
| **AI/LLM** | Provider-agnostic: Mock, Anthropic, OpenAI, Azure OpenAI. Per-tenant config |
| **File Processing** | PDF, DOCX, TXT, CSV, Excel text extraction; OCR for images |
| **Deployment** | Vercel (frontend), PostgreSQL (managed) |

## 7.2 Database Architecture

- **100+ tables** across 15 domains
- **Multi-tenant isolation** via dual-scoping (org_id + tenant_id) and PostgreSQL RLS
- **Immutable audit tables** — PostgreSQL triggers prevent UPDATE/DELETE on event_logs, audit_logs, usage_logs, billing_events
- **Encrypted fields** — content_text_encrypted for PHI in documents, evidence, incidents, AI messages
- **Soft deletes** — deleted_at timestamp on most entities
- **JSON columns** — Used extensively for flexible data (settings, configurations, responses, metadata)

## 7.3 Security Measures

| Measure | Implementation |
|---------|---------------|
| **Authentication** | JWT with access + refresh token pair |
| **Password Security** | bcrypt hashing, 8+ char minimum with complexity |
| **Authorization** | RBAC with 21 permission groups, ~105 permissions |
| **Feature Gating** | Package-tier feature flags |
| **Data Isolation** | PostgreSQL RLS per tenant |
| **Encryption at Rest** | Encrypted columns for PHI fields |
| **Rate Limiting** | Login: 5/60s per IP |
| **CORS** | Configured (frontend origin allowlist) |
| **Token Blocklist** | In-memory logout blocklist |
| **Audit Trail** | Immutable event logs with PostgreSQL triggers |
| **Client Tracking** | Comprehensive activity tracking (page views, clicks, API mutations) batched every 30s |
| **Admin Separation** | Separate admin_users table, separate JWT secret |

## 7.4 LLM Integration Architecture

- **Provider-agnostic:** Supports mock (development), Anthropic, OpenAI, Azure OpenAI
- **Per-tenant config:** `TenantAIConfig` — provider, api_key_encrypted, model_name, max_tokens, temperature
- **Usage tracking:** AI queries counted per tenant against plan limits
- **Use cases:** AI chat, policy analysis, remediation suggestions, breach determination, policy drafting, evidence checking, contract analysis, vendor review

---

# Part 8: Roadmap & Future Features

## 8.1 Current State (Phase 1 — Complete)

All 78 routes implemented across 55 authenticated pages, 15 public pages, and 8 admin pages. Core HIPAA compliance engine operational with 73 requirements, 6 scanners, AI policy generation, and multi-tier packaging.

## 8.2 Phase 2 — Differentiation (Planned)

Based on competitive analysis and market gaps:

| Feature | Priority | Rationale |
|---------|----------|-----------|
| **EHR Integrations** (Epic, Cerner, Athenahealth) | High | No competitor has Tier 3 healthcare integrations |
| **Healthcare-specific risk templates** | High | Clinical, operational, technical risk templates |
| **Small practice pricing** ($1K–$3K/yr) | High | 60% of small practices struggle; current $499/mo may be too high |
| **State-specific HIPAA overlay** | Medium | Auto-apply stricter state requirements |
| **Live integrations** (AWS, Azure, Okta, Google) | High | Currently simulated; need real API scanning |
| **Phishing simulation** | Medium | Integrated into compliance scoring |
| **Mobile alerts app** | Medium | Push notifications for critical alerts |

## 8.3 Phase 3 — Market Leadership (Planned)

| Feature | Description |
|---------|-------------|
| **Medical device compliance** | IoT device management, PACS monitoring |
| **Telehealth platform verification** | Zoom Healthcare, Doxy.me, Teladoc compliance |
| **AI governance for healthcare AI** | Expanded AI system registry for clinical AI |
| **Multi-entity/multi-location** | Enterprise health system support |
| **Audit marketplace** | Connecting auditors with organizations |
| **Compliance benchmarking** | Anonymous peer benchmarking across healthcare verticals |
| **On-premise deployment** | Local AI container for sensitive environments |
| **FHIR/HL7 data flow mapping** | Healthcare data exchange compliance |

## 8.4 Features Preserved for Future Tiers

Several features are fully built but gated behind Enterprise tier for future expansion:
- Digital Twin (compliance simulation)
- Compliance-as-Code Engine
- Breach Simulation (tabletop exercises)
- Regulatory Radar
- AI Governance
- Customer Portal & Trust Center
- Collaboration Hub

## 8.5 SSO/SAML/OIDC Plans

- **Current:** SSO configuration API exists (`/api/v1/sso/config`) with CRUD + test + SCIM token management
- **Frontend:** Platform Settings page has SSO/SCIM configuration tabs
- **Status:** 🟡 API structure implemented; needs real IdP integration testing
- **Planned providers:** Okta, Azure AD/Entra ID, Google Workspace, OneLogin
- **SCIM:** User provisioning/deprovisioning endpoint framework ready

## 8.6 Blog & Content

- **Status:** ❌ Coming Soon — placeholder only
- **Plan:** Compliance updates, regulatory news, best practices (SEO content marketing strategy)

---

# Part 9: HIPAA Regulatory Reference

## 9.1 The 6 HIPAA Rules

| Rule | CFR Citation | Scope | Key Requirements |
|------|-------------|-------|-----------------|
| **Privacy Rule** | 45 CFR Part 164, Subpart E | All PHI (written, oral, electronic) | NPP, minimum necessary, individual rights (access, amendment, accounting), authorization, workforce training, sanctions policy, 6-year document retention |
| **Security Rule** | 45 CFR Part 164, Subpart C | Electronic PHI (ePHI) only | Administrative safeguards (risk analysis, security officer, workforce security, training, incident procedures, contingency plan), Physical safeguards (facility access, workstation security, device/media controls), Technical safeguards (access control, audit controls, integrity, authentication, transmission security) |
| **Breach Notification Rule** | 45 CFR Part 164, Subpart D | All PHI breaches | 4-factor risk assessment, individual notification ≤60 days, HHS notification, media notification if ≥500 in a state, BA must notify CE ≤60 days |
| **Enforcement Rule** | 45 CFR Part 160 | Civil & criminal penalties | 4-tier civil penalties ($141–$71,162 per violation, up to $2.13M/year), criminal penalties up to 10 years/$250K |
| **HITECH Act** | Pub. L. 111-5 (2009) | Enhanced enforcement | BA direct liability, enhanced penalties (up to $1.5M/year), mandatory breach notification, audit program |
| **Omnibus Rule** | 78 FR 5566 (2013) | Consolidated updates | BA chain liability, genetic information protections, modified authorization, expanded enforcement |

## 9.2 How Shieldra Maps to Each Rule

| HIPAA Requirement | Shieldra Feature | Page Reference |
|------------------|-----------------|----------------|
| **Risk Analysis** (§164.308(a)(1)) — #1 most cited violation | Risk Assessment with guided SRA, auto-populate from findings | Section 3.5.1 |
| **Risk Management** | Risk Register, Treatment Plans, Risk Prioritization | Sections 3.5.2–3.5.4 |
| **Security Officer** | Settings → HIPAA → designated officers | Section 3.13.1 |
| **Workforce Training** | Training, Security Training, Personnel | Sections 3.9.3–3.9.4 |
| **Incident Procedures** | Incidents, Breach Simulation | Sections 3.7.1–3.7.2 |
| **Contingency Plan** | Documented via policy templates, compliance checks | Section 3.4.3 |
| **BAA Management** | Vendors, TPRM, Contract Intelligence | Sections 3.8.1–3.8.5 |
| **Access Controls** | Personnel, Behavior Analytics, Controls | Sections 3.9.1, 3.14.2, 3.3.4 |
| **Audit Controls** | Audit Trail (immutable), Event Logs | Section 3.11.4 |
| **Encryption** | Integration scanning (encryption checks), Controls | Sections 3.12.1, 3.3.4 |
| **Breach Notification** | Incidents (state-specific deadlines, HHS tracking) | Section 3.7.1 |
| **NPP** | Policy Templates, HIPAA Roadmap (generate NPP) | Sections 3.4.3, 3.2.1 |
| **Individual Rights** | Policy Templates (patient access, amendment, accounting) | Section 3.4.3 |
| **Penalty Exposure** | Penalty Calculator with 4-tier structure | Section 3.14.1 |
| **Compliance Evaluation** | Continuous Monitoring, Scanning, Compliance Checks | Sections 3.3.1–3.3.3 |
| **Documentation Retention** | Document versioning, audit trail (immutable) | Sections 3.4.1, 3.11.4 |

## 9.3 2026 HIPAA Security Rule Changes

The NPRM (Federal Register, Jan 6, 2025) proposes major changes. Finalization targeted May 2026.

| Proposed Change | Current Rule | New Requirement | Shieldra Mapping |
|----------------|-------------|-----------------|-----------------|
| **All specs become Required** | [R] vs [A] distinction | All specifications mandatory | Roadmap tracks all as required |
| **Asset Inventory** | Not specified | Technology asset inventory + network map, updated every 12 months | Assets page (Section 3.14.4) |
| **Encryption mandatory** | Addressable | ePHI at rest and in transit must be encrypted | Integration scanning, Controls |
| **MFA mandatory** | Not required | MFA for all ePHI system access | Integration scanning (Okta, Azure AD) |
| **Patch Management** | Not specified | Written procedures, critical patches within timeframes | Controls, Auto-Remediation |
| **Audit Log Review** | No cadence | Specific review cadences required | Audit Trail with scheduled reviews |
| **Vulnerability Scanning** | Not specified | Every 6 months | Monitoring, Scanning |
| **Penetration Testing** | Not specified | Annually | Evidence tracking |
| **72-hour Recovery** | General contingency | Critical system recovery within 72 hours | Breach Simulation (DR testing) |
| **Annual Compliance Audits** | Periodic evaluation | Mandatory annual compliance audits | Audit Reports, Advanced Reports |

## 9.4 Key HIPAA Timelines

| Requirement | Deadline |
|-------------|----------|
| Individual breach notification | ≤ 60 days from discovery |
| HHS notification (≥500 individuals) | ≤ 60 days from discovery |
| HHS annual log (<500 individuals) | ≤ 60 days after calendar year end |
| Media notification (≥500 in a state) | ≤ 60 days from discovery |
| BA notification to CE | ≤ 60 days from BA discovery |
| Individual right of access | ≤ 30 days (one 30-day extension) |
| Amendment request response | ≤ 60 days (one 60-day extension) |
| Document/policy retention | 6 years from creation or last in effect |
| Security risk analysis | At least annually |
| BAA required | Before any PHI is shared |

## 9.5 HIPAA Penalty Tiers (Current)

| Tier | Culpability | Min/Violation | Max/Violation | Annual Cap |
|------|------------|--------------|--------------|-----------|
| 1 | Did not know | $141 | $71,162 | $35,581 |
| 2 | Reasonable cause | $1,424 | $71,162 | $142,355 |
| 3 | Willful neglect — corrected ≤30d | $14,232 | $71,162 | $2,134,831 |
| 4 | Willful neglect — NOT corrected | $71,162 | $71,162 | $2,134,831 |

Criminal penalties: Up to 10 years / $250,000 for aggravated violations (DOJ enforcement).

## 9.6 Most Common HIPAA Violations (Enforcement Data)

1. **Failure to conduct enterprise-wide risk analysis** — 75%+ of all penalties, 10 financial penalties in 2025 alone ($25K–$5.1M each)
2. **Unauthorized access to patient records** — Employees accessing without business need
3. **Unauthorized disclosures of PHI** — Sharing without proper authorization
4. **Failure to comply with Right of Access** — 54 fines/settlements as of Dec 2025
5. **Missing BAAs** — Vendors handling PHI without agreements
6. **Improper PHI disposal** — Unshredded documents, unwiped media
7. **Insufficient access controls** — No MFA, overly broad permissions, missing audit logging
8. **Inadequate encryption** — ePHI at rest not encrypted

> Shieldra addresses all 8 common violations through its compliance engine, risk assessment, vendor management, training, and monitoring features.

---

# Appendix A: Complete Database Model Summary

**100+ tables** organized by domain:

| Domain | Table Count | Key Tables |
|--------|------------|-----------|
| Multi-Tenancy | 6 | tenants, tenant_users, organizations, invite_tokens, onboarding_progress, admin_users |
| Compliance | 5 | hipaa_requirements (73 seeded), compliance_checks, findings, gaps, scan_results |
| Documents & Evidence | 3 | documents, evidence, evidence_validations |
| Risk Management | 6 | risk_assessments, risk_items, risk_registers, risk_management_items, treatment_plans, risk_scoring_models |
| Vendors & TPRM | 8 | vendors, vendor_risk_assessments, vendor_monitoring, vendor_monitoring_alerts, vendor_contracts, vendor_discoveries, vendor_lifecycles, vendor_ai_reviews |
| Incidents & Remediation | 6 | incidents, remediations, remediation_playbooks, remediation_executions, remediation_rules, escalation_policies |
| Training | 5 | training_courses, training_records, security_courses, security_enrollments, policy_acknowledgments |
| AI | 4 | ai_conversations, ai_messages, ai_generated_policies, tenant_ai_configs |
| Billing | 6 | packages, subscriptions, contracts, invoices, billing_events, usage_summaries |
| Frameworks | 4 | compliance_frameworks, framework_requirements, cross_mappings, framework_evidence |
| Assets | 5 | assets, asset_vulnerabilities, device_monitors, monitoring_alerts, asset_agents |
| Personnel | 8 | employees, compliance_tasks, system_access, onboarding_workflows, workflow_steps, employee_groups, access_reviews, employee_compliance |
| Audit & Logging | 5 | audit_logs, event_logs, usage_logs, error_logs, billing_events |
| Advanced Features | 30+ | questionnaires, regulatory_updates, ai_systems, compliance_code_policies, breach_scenarios, collab_tasks, digital_twin_states, customer_portals, trust_center_configs, etc. |
| Platform & Config | 10+ | schema_versions, platform_settings, sso_configs, custom_roles, workspaces, integration_configs, policy_templates, etc. |

---

# Appendix B: Frontend Code Statistics

| Category | Page Count | Total Lines |
|----------|-----------|-------------|
| Core Compliance | 6 | ~5,564 |
| Documents & Evidence | 3 | ~2,729 |
| Risk Management | 4 | ~4,120 |
| Remediation & Incidents | 5 | ~5,339 |
| Vendor Management | 6 | ~7,975 |
| AI Features | 6 | ~6,713 |
| People & Training | 5 | ~5,200 |
| Reports & Audit | 4 | ~3,038 |
| Settings & Admin | 6 | ~9,514 |
| Monitoring & Analytics | 9 | ~7,567 |
| Public Pages | 16 | ~3,019 |
| Admin Panel | 8 | ~5,136 |
| **Total** | **78 pages** | **~57,900 lines** |

---

*End of Master Requirements Document*
*Generated: 2026-03-26 | Compiled from: MASTER-REQUIREMENTS.md, FRONTEND_ROUTES_INVENTORY.md, ENTITY-DATA-FLOW-ANALYSIS.md, busines-requirement.md, HIPAA_REQUIREMENTS.md, HIPAA-competitive-analysis.md*
