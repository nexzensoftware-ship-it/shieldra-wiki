# Shieldra AI — Master Requirements Document

> **Generated:** 2026-03-26 | **Source:** `apps/api/src/` full codebase analysis
> **Purpose:** Complete inventory of API endpoints, database models, RBAC, integrations, auth, and compliance engine.

---

## Table of Contents

1. [API Endpoints](#1-api-endpoints)
2. [Database Models](#2-database-models)
3. [RBAC System](#3-rbac-system)
4. [Integrations](#4-integrations)
5. [Auth Flow](#5-auth-flow)
6. [Compliance Engine](#6-compliance-engine)

---

## 1. API Endpoints

### 1.1 Authentication (`/api/v1/auth`)

| Method | Path | Purpose | Auth | Feature Gate |
|--------|------|---------|------|-------------|
| POST | `/signup` | Self-service signup — creates tenant + owner + org + trial (14-day) | None | — |
| POST | `/login` | Email + password login, returns JWT pair + user/tenant/package info | None (rate-limited: 5/60s per IP) | — |
| POST | `/refresh` | Exchange refresh token for new access + refresh token pair | Refresh token | — |
| POST | `/logout` | Invalidate current token (in-memory blocklist) | Bearer token | — |

**Signup Request:** `{ full_name, email, company_name, password }` — password requires 8+ chars, upper, lower, digit.
**Login Response:** `{ user: { id, email, full_name, role, organization_id, package, onboarding_completed_at }, token: { access_token, refresh_token, token_type, expires_in } }`

### 1.2 Invites & Password Reset (`/api/v1/invites`)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/invite/validate` | Validate an invite token | None |
| POST | `/invite/accept` | Accept invite, set password, auto-login | None |
| POST | `/forgot-password` | Send password reset email | None |
| POST | `/reset-password` | Reset password via token | None |

### 1.3 Users (`/api/v1/users`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | List users (paginated, search, role filter) | `users.view` |
| GET | `/me` | Current user profile from JWT | Authenticated |
| POST | `/` | Create user in tenant | `users.create` |
| PUT | `/{user_id}` | Update user (name, email, role, is_active) | `users.edit` |
| DELETE | `/{user_id}` | Deactivate/delete user | `users.delete` |
| PUT | `/{user_id}/change-password` | Change password (requires current password) | Authenticated (self) |

### 1.4 Dashboard (`/api/v1/dashboard`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | Full dashboard metrics (scores, findings, documents, risks, vendors, training, integrations) | `compliance.view` |
| GET | `/trends` | Compliance score trends over time | `compliance.view` |
| GET | `/improvement-suggestions` | Data-driven improvement suggestions by category | `compliance.view` |

### 1.5 Compliance (`/api/v1/compliance`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/check` | Run HIPAA compliance check on a document | `compliance.create` |
| POST | `/quick-scan` | Analyze text directly without uploading | `compliance.create` |
| GET | `/checks` | List compliance checks (paginated) | `compliance.view` |
| GET | `/checks/{check_id}` | Get check details with findings + gaps | `compliance.view` |
| GET | `/checks/{check_id}/findings` | List findings for a check | `compliance.view` |
| PUT | `/findings/{finding_id}` | Update finding status | `compliance.edit` |
| GET | `/score` | Get overall compliance score + breakdown | `compliance.view` |
| GET | `/summary` | Executive compliance summary | `compliance.view` |

### 1.6 Documents (`/api/v1/documents`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create document (JSON body) | `documents.create` |
| POST | `/upload` | Upload file (multipart) — auto-extracts text, classifies, auto-analyzes | `documents.create` |
| GET | `/` | List documents (paginated, filtered by type/status/search) | `documents.view` |
| GET | `/{doc_id}` | Get document detail | `documents.view` |
| PUT | `/{doc_id}` | Update document metadata | `documents.edit` |
| DELETE | `/{doc_id}` | Soft-delete document | `documents.delete` |
| POST | `/{doc_id}/analyze` | Trigger HIPAA analysis on existing document | `compliance.create` |
| POST | `/{doc_id}/new-version` | Upload new version (version tracking) | `documents.create` |
| GET | `/{doc_id}/versions` | List document versions | `documents.view` |

### 1.7 Evidence (`/api/v1/evidence`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create evidence record | `evidence.create` |
| POST | `/upload` | Upload evidence file | `evidence.create` |
| GET | `/` | List evidence (paginated, filtered) | `evidence.view` |
| GET | `/{evidence_id}` | Get evidence detail | `evidence.view` |
| PUT | `/{evidence_id}` | Update evidence | `evidence.edit` |
| DELETE | `/{evidence_id}` | Soft-delete evidence | `evidence.delete` |
| POST | `/{evidence_id}/verify` | Mark evidence as verified | `evidence.edit` |
| GET | `/summary` | Evidence collection summary by control | `evidence.view` |
| GET | `/auto-collected` | List auto-collected evidence from integrations | `evidence.view` |

### 1.8 Vendors (`/api/v1/vendors`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create vendor | `vendors.create` |
| GET | `/` | List vendors (paginated, filtered) | `vendors.view` |
| GET | `/{vendor_id}` | Get vendor detail | `vendors.view` |
| PUT | `/{vendor_id}` | Update vendor | `vendors.edit` |
| DELETE | `/{vendor_id}` | Soft-delete vendor | `vendors.delete` |
| GET | `/summary` | Vendor BAA and risk summary | `vendors.view` |

### 1.9 Vendor Risk (`/api/v1/vendor-risk`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/dashboard` | Vendor risk overview dashboard | `vendors.view` | `vendor_risk` |
| GET | `/questionnaire` | Get vendor risk questionnaire template | `vendors.view` | `vendor_risk` |
| POST | `/assessments` | Create vendor risk assessment | `vendors.create` | `vendor_risk` |
| GET | `/assessments` | List vendor risk assessments | `vendors.view` | `vendor_risk` |
| GET | `/assessments/{id}` | Get assessment detail | `vendors.view` | `vendor_risk` |

### 1.10 TPRM — Third-Party Risk Management (`/api/v1/tprm`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| POST | `/ai-review/{vendor_id}` | Trigger AI vendor security review | `vendors.create` | `tprm` |
| GET | `/ai-reviews` | List AI reviews | `vendors.view` | `tprm` |
| GET | `/discovery` | List discovered vendors | `vendors.view` | `tprm` |
| POST | `/discovery/scan` | Trigger vendor discovery scan | `vendors.create` | `tprm` |
| GET | `/monitoring` | List vendor monitoring configs | `vendors.view` | `tprm` |
| POST | `/monitoring/{vendor_id}` | Enable monitoring for vendor | `vendors.create` | `tprm` |
| GET | `/monitoring/alerts` | List monitoring alerts | `vendors.view` | `tprm` |
| GET | `/contracts` | List vendor contracts | `vendors.view` | `tprm` |
| POST | `/contracts` | Create vendor contract | `vendors.create` | `tprm` |
| GET | `/lifecycle/{vendor_id}` | Get vendor lifecycle history | `vendors.view` | `tprm` |
| POST | `/lifecycle/{vendor_id}` | Update vendor lifecycle stage | `vendors.edit` | `tprm` |

### 1.11 Incidents (`/api/v1/incidents`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create incident | `incidents.create` |
| GET | `/` | List incidents (paginated, filtered by severity/status) | `incidents.view` |
| GET | `/{id}` | Get incident detail (with state breach requirements) | `incidents.view` |
| PUT | `/{id}` | Update incident | `incidents.edit` |
| DELETE | `/{id}` | Soft-delete incident | `incidents.delete` |
| POST | `/{id}/breach-determination` | AI-assisted breach determination analysis | `incidents.edit` |
| GET | `/notification-requirements` | State-specific breach notification requirements | `incidents.view` |

**Notable:** Includes state-specific breach notification deadlines for CA (15d), FL (30d), NY (expedient), TX (60d), IL, MA, CT (60d), CO (30d), OR (45d), WA (30d) with HIPAA 60-day federal default.

### 1.12 Risk Assessment (`/api/v1/risk-assessments`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create risk assessment | `risk.create` |
| GET | `/` | List assessments | `risk.view` |
| GET | `/{id}` | Get assessment with risk items | `risk.view` |
| PUT | `/{id}` | Update assessment | `risk.edit` |
| DELETE | `/{id}` | Soft-delete assessment | `risk.delete` |
| POST | `/{id}/items` | Add risk item | `risk.create` |
| PUT | `/{id}/items/{item_id}` | Update risk item | `risk.edit` |
| DELETE | `/{id}/items/{item_id}` | Delete risk item | `risk.delete` |
| POST | `/{id}/sign-off` | Security officer sign-off | `risk.edit` |
| POST | `/{id}/revoke-sign-off` | Revoke sign-off | `risk.edit` |
| POST | `/{id}/auto-populate` | Auto-populate from compliance findings | `risk.create` |

### 1.13 Risk Register (`/api/v1/risk-register`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/items` | List risk register items | `risk.view` | `risk_register` |
| POST | `/items` | Create risk item | `risk.create` | `risk_register` |
| PUT | `/items/{id}` | Update risk item | `risk.edit` | `risk_register` |
| DELETE | `/items/{id}` | Delete risk item | `risk.delete` | `risk_register` |
| GET | `/heat-map` | Get risk heat map data | `risk.view` | `risk_register` |

### 1.14 Risk Management (`/api/v1/risk-management`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/registers` | List risk registers | `risk.view` | `risk_management` |
| POST | `/registers` | Create risk register | `risk.create` | `risk_management` |
| GET | `/treatment-plans` | List treatment plans | `risk.view` | `risk_management` |
| POST | `/treatment-plans` | Create treatment plan | `risk.create` | `risk_management` |
| PUT | `/treatment-plans/{id}` | Update treatment plan | `risk.edit` | `risk_management` |
| POST | `/treatment-plans/{id}/actions` | Add action to plan | `risk.create` | `risk_management` |
| GET | `/scoring-models` | List scoring models | `risk.view` | `risk_management` |
| POST | `/scoring-models` | Create scoring model | `risk.create` | `risk_management` |
| GET | `/analytics` | Risk analytics dashboard | `risk.view` | `risk_management` |

### 1.15 Risk Prioritization (`/api/v1/risk-prioritization`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/calculate` | Calculate risk-weighted scores for all findings | `risk.view` |
| GET | `/scores` | Get prioritized findings by risk score | `risk.view` |
| GET | `/roadmap` | Get ROI-based remediation roadmap | `risk.view` |
| GET | `/threat-intelligence` | Get HHS breach intelligence overlay | `risk.view` |
| POST | `/snapshot` | Save current risk snapshot for trends | `risk.edit` |
| GET | `/trends` | Historical risk score trends | `risk.view` |

### 1.16 Penalty Calculator (`/api/v1/penalty-calculator`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/calculate` | Calculate penalty exposure from current gaps | `compliance.view` |
| GET | `/current` | Get most recent exposure calculation | `compliance.view` |
| GET | `/violations` | List violation mappings | `compliance.view` |
| POST | `/snapshot` | Save exposure snapshot | `compliance.edit` |
| GET | `/trends` | Exposure trend over time | `compliance.view` |

### 1.17 Remediation (`/api/v1/remediation`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/` | Create remediation task | `remediation.create` |
| GET | `/` | List remediation tasks (paginated, filtered) | `remediation.view` |
| GET | `/{id}` | Get remediation detail | `remediation.view` |
| PUT | `/{id}` | Update remediation (status, assignment, etc.) | `remediation.edit` |
| DELETE | `/{id}` | Soft-delete remediation | `remediation.delete` |
| POST | `/{id}/ai-suggest` | Get AI remediation suggestion | `remediation.edit` |

### 1.18 Auto-Remediation (`/api/v1/auto-remediation`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/playbooks` | List remediation playbooks | `remediation.view` | `auto_remediation` |
| POST | `/playbooks` | Create playbook | `remediation.create` | `auto_remediation` |
| PUT | `/playbooks/{id}` | Update playbook | `remediation.edit` | `auto_remediation` |
| POST | `/playbooks/{id}/execute` | Execute playbook | `remediation.manage` | `auto_remediation` |
| GET | `/executions` | List executions | `remediation.view` | `auto_remediation` |
| GET | `/rules` | List remediation rules | `remediation.view` | `auto_remediation` |
| POST | `/rules` | Create rule | `remediation.create` | `auto_remediation` |
| GET | `/escalation-policies` | List escalation policies | `remediation.view` | `auto_remediation` |
| POST | `/escalation-policies` | Create escalation policy | `remediation.create` | `auto_remediation` |

### 1.19 Controls (`/api/v1/controls`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | List controls (library + tenant custom) | `controls.view` |
| POST | `/` | Create custom control | `controls.create` |
| GET | `/{id}` | Get control detail | `controls.view` |
| PUT | `/{id}` | Update control | `controls.edit` |
| DELETE | `/{id}` | Delete control | `controls.delete` |
| POST | `/import` | Import controls from library | `controls.create` |
| GET | `/{id}/tests` | List tests for control | `controls.view` |
| POST | `/{id}/tests` | Create test for control | `controls.create` |
| PUT | `/{id}/tests/{test_id}` | Update test | `controls.edit` |
| POST | `/{id}/tests/{test_id}/run` | Run test | `controls.manage` |
| GET | `/{id}/tests/{test_id}/results` | Test result history | `controls.view` |
| GET | `/monitoring/dashboard` | Continuous monitoring dashboard | `controls.view` |

### 1.20 Frameworks (`/api/v1/frameworks`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/` | List available frameworks | `compliance.view` | `multi_framework` |
| GET | `/catalog` | Browse framework catalog | `compliance.view` | `multi_framework` |
| POST | `/{name}/adopt` | Adopt a framework | `compliance.create` | `multi_framework` |
| GET | `/{id}` | Get framework detail with requirements | `compliance.view` | `multi_framework` |
| PUT | `/{id}` | Update framework config | `compliance.edit` | `multi_framework` |
| GET | `/{id}/requirements` | List requirements | `compliance.view` | `multi_framework` |
| PUT | `/{id}/requirements/{req_id}` | Update requirement status | `compliance.edit` | `multi_framework` |
| POST | `/{id}/requirements/{req_id}/evidence` | Attach evidence | `evidence.create` | `multi_framework` |
| GET | `/cross-mappings` | List cross-mappings | `compliance.view` | `multi_framework` |
| POST | `/cross-mappings/analyze` | AI cross-mapping analysis | `compliance.create` | `multi_framework` |
| GET | `/dashboard` | Multi-framework dashboard | `compliance.view` | `multi_framework` |

### 1.21 Compliance-as-Code (`/api/v1/compliance-code`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/policies` | List code policies | `compliance.view` | `compliance_code` |
| POST | `/policies` | Create code policy | `compliance.create` | `compliance_code` |
| PUT | `/policies/{id}` | Update policy code | `compliance.edit` | `compliance_code` |
| POST | `/policies/{id}/compile` | Compile policy | `compliance.manage` | `compliance_code` |
| POST | `/policies/{id}/execute` | Execute policy | `compliance.manage` | `compliance_code` |
| GET | `/policies/{id}/executions` | Execution history | `compliance.view` | `compliance_code` |
| GET | `/templates` | List code policy templates | `compliance.view` | `compliance_code` |
| GET | `/pipelines` | List compliance pipelines | `compliance.view` | `compliance_code` |
| POST | `/pipelines` | Create pipeline | `compliance.create` | `compliance_code` |

### 1.22 Integrations (`/api/v1/integrations`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/available` | List available integration types | `integrations.view` |
| GET | `/` | List connected integrations | `integrations.view` |
| POST | `/connect` | Connect an integration | `integrations.create` |
| POST | `/{id}/scan` | Trigger integration scan | `integrations.manage` |
| POST | `/{id}/disconnect` | Disconnect integration | `integrations.delete` |
| GET | `/{id}/findings` | Get scan findings | `integrations.view` |

### 1.23 Enterprise Integrations (`/api/v1/enterprise-integrations`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/catalog` | Full catalog (12+ types) | `integrations.view` | `enterprise_integrations` |
| GET | `/` | List configured integrations | `integrations.view` | `enterprise_integrations` |
| POST | `/connect` | Connect integration with credentials | `integrations.create` | `enterprise_integrations` |
| POST | `/{id}/disconnect` | Disconnect | `integrations.delete` | `enterprise_integrations` |
| POST | `/{id}/test` | Test connection | `integrations.manage` | `enterprise_integrations` |
| POST | `/{id}/sync` | Trigger sync/scan | `integrations.manage` | `enterprise_integrations` |
| GET | `/dashboard` | Integration dashboard summary | `integrations.view` | `enterprise_integrations` |
| GET | `/webhooks` | List webhooks | `integrations.view` | `enterprise_integrations` |
| POST | `/webhooks` | Create webhook | `integrations.create` | `enterprise_integrations` |

### 1.24 AI Assistant (`/api/v1/ai`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/chat` | Send message to compliance AI | `ai.chat` |
| GET | `/conversations` | List conversations | `ai.view` |
| GET | `/conversations/{id}` | Get conversation with messages | `ai.view` |
| DELETE | `/conversations/{id}` | Delete conversation | `ai.manage` |
| POST | `/analyze-policy` | AI policy analysis | `ai.chat` |
| POST | `/suggest-remediation` | AI remediation suggestion | `ai.chat` |
| POST | `/draft-policy` | AI policy drafting | `ai.chat` |

### 1.25 AI Agent (`/api/v1/ai-agent`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| POST | `/ask` | Natural language Q&A | `ai.chat` | `ai_agent` |
| POST | `/search` | Semantic search across compliance data | `ai.chat` | `ai_agent` |
| POST | `/generate-policy` | Generate complete policy | `ai.chat` | `ai_agent` |
| POST | `/import-policies` | Import and analyze policy documents | `ai.chat` | `ai_agent` |
| POST | `/check-evidence` | AI evidence adequacy check | `ai.chat` | `ai_agent` |
| POST | `/map-controls` | Map policy text to controls | `ai.chat` | `ai_agent` |
| GET | `/policies` | List AI-generated policies | `ai.view` | `ai_agent` |
| GET | `/status` | Agent status and capabilities | `ai.view` | `ai_agent` |

### 1.26 AI Governance (`/api/v1/ai-governance`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/systems` | List AI systems | `compliance.view` | `ai_governance` |
| POST | `/systems` | Register AI system | `compliance.create` | `ai_governance` |
| PUT | `/systems/{id}` | Update AI system | `compliance.edit` | `ai_governance` |
| GET | `/risk-assessments` | List AI risk assessments | `compliance.view` | `ai_governance` |
| POST | `/risk-assessments` | Create AI risk assessment | `compliance.create` | `ai_governance` |
| GET | `/policies` | List AI governance policies | `compliance.view` | `ai_governance` |
| POST | `/policies` | Create governance policy | `compliance.create` | `ai_governance` |
| GET | `/audit-log` | AI audit trail | `audit_trail.view` | `ai_governance` |
| GET | `/dashboard` | AI governance dashboard | `compliance.view` | `ai_governance` |

### 1.27 Training (`/api/v1/training`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/courses` | List training courses | `training.view` |
| POST | `/courses` | Create course | `training.create` |
| GET | `/courses/{id}` | Get course detail | `training.view` |
| PUT | `/courses/{id}` | Update course | `training.edit` |
| DELETE | `/courses/{id}` | Delete course | `training.delete` |
| GET | `/records` | List training records (paginated) | `training.view` |
| POST | `/records` | Create training record | `training.create` |
| PUT | `/records/{id}` | Update record | `training.edit` |
| DELETE | `/records/{id}` | Soft-delete record | `training.delete` |
| GET | `/summary` | Training compliance summary | `training.view` |

### 1.28 Security Training (`/api/v1/security-training`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/courses` | List security awareness courses | `training.view` | `security_training` |
| GET | `/courses/{id}` | Get course with content modules + quizzes | `training.view` | `security_training` |
| GET | `/enrollments` | List enrollments for current user | `training.view` | `security_training` |
| POST | `/enroll` | Enroll in a course | `training.create` | `security_training` |
| POST | `/quiz/submit` | Submit quiz answers, auto-grade | `training.create` | `security_training` |
| GET | `/progress` | Overall training progress | `training.view` | `security_training` |
| GET | `/dashboard` | Training compliance dashboard | `training.view` | `security_training` |

### 1.29 Personnel (`/api/v1/personnel`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/employees` | List employees | `personnel.view` | `personnel` |
| POST | `/employees` | Create employee | `personnel.create` | `personnel` |
| GET | `/employees/{id}` | Get employee detail | `personnel.view` | `personnel` |
| PUT | `/employees/{id}` | Update employee | `personnel.edit` | `personnel` |
| DELETE | `/employees/{id}` | Deactivate employee | `personnel.delete` | `personnel` |
| GET | `/tasks` | List compliance tasks | `personnel.view` | `personnel` |
| POST | `/tasks` | Create compliance task | `personnel.create` | `personnel` |
| PUT | `/tasks/{id}` | Update task | `personnel.edit` | `personnel` |
| GET | `/access` | List system access records | `personnel.view` | `personnel` |
| POST | `/access` | Grant system access | `personnel.create` | `personnel` |
| PUT | `/access/{id}` | Update access | `personnel.edit` | `personnel` |
| GET | `/workflows` | List onboarding/offboarding workflows | `personnel.view` | `personnel` |
| POST | `/workflows` | Create workflow | `personnel.create` | `personnel` |
| GET | `/groups` | List employee groups | `personnel.view` | `personnel` |
| POST | `/groups` | Create group | `personnel.create` | `personnel` |
| POST | `/groups/{id}/members` | Add members to group | `personnel.edit` | `personnel` |
| GET | `/onboarding-templates` | List onboarding templates | `personnel.view` | `personnel` |
| POST | `/onboarding-templates` | Create template | `personnel.create` | `personnel` |

### 1.30 Reports (`/api/v1/reports`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/generate` | Generate compliance report | `reports.create` |
| GET | `/` | List generated reports | `reports.view` |
| GET | `/{id}` | Get report detail | `reports.view` |

### 1.31 Audit Reports (`/api/v1/audit-reports`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| POST | `/generate` | Generate audit-ready report | `reports.create` | `audit_reports` |
| GET | `/` | List audit reports | `reports.view` | `audit_reports` |
| GET | `/{id}` | Get report detail | `reports.view` | `audit_reports` |
| POST | `/{id}/archive` | Archive report | `reports.edit` | `audit_reports` |

### 1.32 Advanced Reports (`/api/v1/advanced-reports`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/program-overview` | Full program overview | `reports.view` | `advanced_reports` |
| GET | `/executive-summary` | Executive summary | `reports.view` | `advanced_reports` |
| GET | `/compliance-posture` | Compliance posture report | `reports.view` | `advanced_reports` |
| GET | `/schedules` | List scheduled reports | `reports.view` | `advanced_reports` |
| POST | `/schedules` | Create scheduled report | `reports.create` | `advanced_reports` |
| GET | `/history` | Report generation history | `reports.view` | `advanced_reports` |

### 1.33 Audit Trail (`/api/v1/audit-trail`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | List audit log entries (paginated, filtered) | `audit_trail.view` |
| GET | `/actions` | List distinct audit actions | `audit_trail.view` |
| GET | `/summary` | Activity summary | `audit_trail.view` |
| GET | `/export` | Export audit trail as CSV | `audit_trail.export` |

### 1.34 Event Logs (`/api/v1/event-logs`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | List event log entries (paginated) | `audit_trail.view` |
| POST | `/` | Create event log entry | `audit_trail.manage` |
| GET | `/export` | Export event logs as CSV | `audit_trail.export` |
| GET | `/summary` | Event log summary | `audit_trail.view` |

### 1.35 Alerts (`/api/v1/alerts`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | List alerts (paginated, filtered by severity/status/unread) | `monitoring.view` |
| PUT | `/{id}/acknowledge` | Acknowledge alert | `monitoring.edit` |
| PUT | `/{id}/dismiss` | Dismiss alert | `monitoring.edit` |
| PUT | `/{id}/read` | Mark alert as read | `monitoring.view` |
| GET | `/summary` | Alert summary counts | `monitoring.view` |

### 1.36 Monitoring (`/api/v1/monitoring`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/status` | Monitoring status and config | `monitoring.view` |
| POST | `/scan` | Trigger full compliance scan | `monitoring.manage` |
| GET | `/scan-history` | List past scans | `monitoring.view` |
| GET | `/drift` | Compliance drift detection | `monitoring.view` |

### 1.37 Assets (`/api/v1/assets`)

| Method | Path | Purpose | Permission | Feature Gate |
|--------|------|---------|------------|-------------|
| GET | `/` | List assets | `assets.view` | `asset_management` |
| POST | `/` | Create asset | `assets.create` | `asset_management` |
| GET | `/{id}` | Get asset detail | `assets.view` | `asset_management` |
| PUT | `/{id}` | Update asset | `assets.edit` | `asset_management` |
| DELETE | `/{id}` | Delete asset | `assets.delete` | `asset_management` |
| GET | `/{id}/vulnerabilities` | List vulnerabilities | `assets.view` | `asset_management` |
| POST | `/{id}/vulnerabilities` | Create vulnerability | `assets.create` | `asset_management` |
| GET | `/{id}/monitor` | Get device monitor config | `assets.view` | `asset_management` |
| PUT | `/{id}/monitor` | Update monitor config | `assets.edit` | `asset_management` |
| GET | `/{id}/agent` | Get agent status | `assets.view` | `asset_management` |
| GET | `/monitoring/alerts` | List monitoring alerts | `assets.view` | `asset_management` |
| GET | `/dashboard` | Asset dashboard | `assets.view` | `asset_management` |

### 1.38 HIPAA Roadmap (`/api/v1/hipaa-roadmap`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | HIPAA compliance roadmap with 6 rules, checklist items, and real status | `compliance.view` |
| PUT | `/items/{id}` | Update roadmap item status | `compliance.edit` |

### 1.39 HIPAA Config (`/api/v1/hipaa-config`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | Get HIPAA configuration | `settings.view` |
| PUT | `/` | Update HIPAA configuration | `settings.edit` |
| GET | `/options` | Get static config options (org types, PHI types, states, etc.) | `settings.view` |

### 1.40 HIPAA Graph (`/api/v1/hipaa-graph`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/requirements/graph` | HIPAA requirement tree with compliance status | `compliance.view` |

### 1.41 Settings (`/api/v1/settings`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/` | All tenant settings (general, plan, AI, compliance, notifications, security) | `settings.view` |
| PUT | `/general` | Update general settings | `settings.edit` |
| GET | `/usage` | Current usage vs plan limits | `settings.view` |
| PUT | `/ai` | Update AI provider config (key, model, temp) | `settings.manage` |
| POST | `/ai/validate` | Validate AI API key | `settings.manage` |

### 1.42 SSO (`/api/v1/sso`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/config` | Get SSO configuration | `settings.view` |
| POST | `/config` | Create SSO config | `settings.manage` |
| PUT | `/config` | Update SSO config | `settings.manage` |
| DELETE | `/config` | Delete SSO config | `settings.manage` |
| POST | `/config/test` | Test SSO connection | `settings.manage` |
| GET | `/scim/token` | Get SCIM token | `settings.manage` |
| POST | `/scim/token/rotate` | Rotate SCIM token | `settings.manage` |

### 1.43 RBAC (`/api/v1/rbac`)

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/roles` | List roles (system + custom) | `users.view` |
| POST | `/roles` | Create custom role | `users.manage` |
| PUT | `/roles/{id}` | Update custom role | `users.manage` |
| DELETE | `/roles/{id}` | Delete custom role | `users.manage` |
| GET | `/permissions` | List all permission groups | `users.view` |
| PUT | `/users/{id}/role` | Assign role to user | `users.manage` |

### 1.44 Subscriptions (`/api/v1/subscriptions`)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/current` | Current subscription + package details | Authenticated |
| GET | `/contract` | Active contract details | Authenticated |
| GET | `/invoices` | List invoices | Authenticated |
| GET | `/packages` | Available packages for upgrade | Authenticated |
| GET | `/usage` | Usage dashboard | Authenticated |

### 1.45 Onboarding (`/api/v1/onboarding`)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/progress` | Get onboarding progress | Authenticated |
| PUT | `/step` | Update step data | Authenticated |
| POST | `/organization` | Setup organization details | Authenticated |
| POST | `/compliance-framework` | Select frameworks | Authenticated |
| POST | `/team` | Invite team members | Authenticated |
| POST | `/integrations` | Configure integrations | Authenticated |
| POST | `/documents` | Upload onboarding documents | Authenticated |
| POST | `/complete` | Mark onboarding complete | Authenticated |
| GET | `/archetype` | Get compliance archetype for org profile | Authenticated |

### 1.46 Additional Endpoint Groups

| Group | Path Prefix | Key Endpoints | Feature Gate |
|-------|-------------|---------------|-------------|
| **Questionnaires** | `/api/v1/questionnaires` | CRUD for questionnaires + AI suggestions | `questionnaires` |
| **Policy Acknowledgments** | `/api/v1/policy-acknowledgments` | Track employee policy acknowledgments | — |
| **Policy Templates** | `/api/v1/policy-templates` | Browse/adopt HIPAA policy templates | `policy_templates` |
| **Employee Compliance** | `/api/v1/employee-compliance` | Onboarding/offboarding checklists | `employee_compliance` |
| **Access Reviews** | `/api/v1/access-reviews` | Schedule & manage access reviews | — |
| **Regulations** | `/api/v1/regulations` | Browse HIPAA requirements + other frameworks | — |
| **Regulatory Radar** | `/api/v1/regulatory-radar` | Track regulatory changes, alerts, impact assessments | `regulatory_radar` |
| **Contract Intelligence** | `/api/v1/contract-intelligence` | BAA analysis, clause extraction, template generation | — |
| **Behavior Analytics** | `/api/v1/behavior-analytics` | Access events, baselines, anomaly detection | — |
| **Breach Simulation** | `/api/v1/breach-sim` | Scenarios, tabletop exercises, simulation results | `breach_simulation` |
| **Compliance Costs** | `/api/v1/compliance-costs` | Cost tracking, benefits, budget, ROI, benchmarks | `compliance_costs` |
| **Collaboration** | `/api/v1/collaboration` | Tasks, comments, workflows, workflow instances | `collaboration` |
| **Customer Portal** | `/api/v1/customer-portal` | Public compliance portal management | `customer_portal` |
| **Trust Center** | `/api/v1/trust-center` | Trust center config, documents, FAQs, analytics | `trust_center` |
| **Digital Twin** | `/api/v1/digital-twin` | Compliance snapshots, simulations, comparisons, alerts | `digital_twin` |
| **Due Diligence** | `/api/v1/due-diligence` | M&A compliance projects, assessments, liability reports | — |
| **Knowledge Graph** | `/api/v1/knowledge-graph` | Build graph, query impact/coverage/gaps | — |
| **Learning Engine** | `/api/v1/learning-engine` | RAG search, document ingestion, feedback, corrections | — |
| **Insights** | `/api/v1/insights` | Cohort benchmarking, archetype profiles | — |
| **Workspaces** | `/api/v1/workspaces` | Multi-workspace management | — |
| **Evidence Schedules** | `/api/v1/evidence-schedules` | Automated evidence collection schedules | — |
| **Error Reports** | `/api/v1/error-reports` | User-submitted error reports | — |
| **Health** | `/api/v1/health` | Health check + readiness probe | None |
| **Public Contact** | `/api/v1/public/contact` | Public contact form | None |

---

## 2. Database Models

### Summary: **100+ tables** across 15 domains

### 2.1 Core Multi-Tenancy

| Table | Key Columns | Notes |
|-------|-------------|-------|
| **tenants** | id, name, slug (unique), domain, status, plan_id→packages, org_type, org_size, industry, state, compliance_frameworks (JSON), phi_types (JSON), max_users, max_documents, max_scans_per_month, max_ai_queries_per_month, storage_used_mb, storage_limit_mb, settings_json, trial_ends_at | Central tenant table. Status: active/suspended/trial/deactivated/pending_setup |
| **tenant_users** | id, tenant_id→tenants, email (unique), full_name, hashed_password, role, is_active, permissions (JSON), invite_status, onboarding_completed_at, last_login_at | One user = one tenant. Roles: owner/admin/analyst/compliance_officer/auditor/viewer |
| **organizations** | id, tenant_id→tenants, name, org_type, size, state, operating_states, phi_types, config_json | Org within tenant |
| **invite_tokens** | id, tenant_id, user_id, token_hash (indexed), token_type (invite/password_reset), status, expires_at | Single-use tokens |
| **onboarding_progress** | id, tenant_id, user_id, current_step, total_steps (7), status, step_data (JSON), individual step booleans | Wizard tracking |
| **admin_users** | id, email (unique), full_name, hashed_password, role (super_admin/admin/support/viewer), permissions | Platform admin (separate from tenants) |

### 2.2 Compliance & Analysis

| Table | Key Columns | Relationships |
|-------|-------------|---------------|
| **hipaa_requirements** | id, cfr_reference, category, standard, title, description, requirement_type (required/addressable), severity, check_keywords (JSON), check_questions (JSON), common_gaps, parent_id, sort_order | Seed data (73 requirements) |
| **compliance_checks** | id, org_id→organizations, document_id→documents, regulation, status (pending/running/completed/failed), overall_score, risk_level, summary, requirements_checked, score_breakdown (JSON), category_summary (JSON), framework_id | Has many findings, gaps |
| **findings** | id, org_id, check_id→compliance_checks, scan_result_id→scan_results, requirement_id, cfr_reference, status (compliant/non_compliant/partial/not_assessed), severity, title, description, evidence_text, recommendation, confidence, category, source, alert_status, alert_read, framework, framework_reference, deleted_at, tenant_id | Soft-delete, multi-framework |
| **gaps** | id, org_id, check_id→compliance_checks, requirement_id, gap_type (missing_policy/outdated/insufficient), description, impact, suggested_action, framework, framework_reference, deleted_at, tenant_id | Soft-delete, multi-framework |
| **scan_results** | id, org_id, integration_id, scanner_type, status, score, findings_count, compliant_count, non_compliant_count, details (JSON), tenant_id | From scanners |

### 2.3 Documents & Evidence

| Table | Key Columns |
|-------|-------------|
| **documents** | id, org_id, title, doc_type, content_text, content_text_encrypted (PHI), file_name, file_size, mime_type, status, classification, version, previous_version_id→documents, is_latest, version_notes, page_count, word_count, deleted_at, tenant_id |
| **evidence** | id, org_id, control_id, evidence_type, title, description, file_name, content_text, content_text_encrypted (PHI), status (collected/verified/expired/rejected), verified_at, verified_by, source, satisfies_frameworks (JSON), framework_requirement_id, deleted_at, tenant_id |
| **evidence_validations** | id, evidence_id→evidence, validation_status, confidence_score, freshness_score, contradiction_details, validator_type |

### 2.4 Risk Management

| Table | Key Columns |
|-------|-------------|
| **risk_assessments** | id, org_id, title, status, overall_risk_score, risk_level, methodology, signed_off, signed_off_by, signed_off_by_title, next_review_date, deleted_at, tenant_id |
| **risk_items** | id, org_id, assessment_id→risk_assessments, threat, vulnerability, asset, likelihood (1-5), impact (1-5), risk_score, risk_level, current_controls, mitigation, status, owner, due_date, deleted_at, tenant_id |
| **risk_registers** | id, tenant_id, name, description, scope, status, owner |
| **risk_management_items** | id, tenant_id, register_id→risk_registers, title, category, source, likelihood, impact, risk_score, risk_level, status, owner, treatment_plan_id, residual_likelihood/impact/score, tags |
| **treatment_plans** | id, tenant_id, risk_id, strategy (mitigate/accept/transfer/avoid), status, priority, owner, budget, actual_cost, actions (JSON), effectiveness_rating |
| **risk_scoring_models** | id, tenant_id, name, likelihood_labels, impact_labels, risk_matrix, thresholds, is_default |
| **risk_prioritization_scores** | id, org_id, finding_id, requirement_id, baseline_severity, regulatory_weight, category_weight, time_sensitivity, threat_multiplier, final_risk_score, effort_estimate_hours, roi_score |
| **risk_snapshots** | id, org_id, snapshot_date, overall_risk_score, gap_count_by_severity, top_risks, score_delta |

### 2.5 Vendors & TPRM

| Table | Key Columns |
|-------|-------------|
| **vendors** | id, org_id, name, vendor_type, contact_name/email, services, phi_access, phi_types, baa_status, baa_signed_date, baa_expiry_date, risk_score, risk_level, status, deleted_at, tenant_id |
| **vendor_risk_assessments** | id, tenant_id, vendor_id→vendors, assessment_type, risk_score, risk_level, questionnaire_responses (JSON), score_breakdown (JSON), recommendations |
| **vendor_ai_reviews** | id, tenant_id, vendor_id, overall_score, risk_rating, strengths/weaknesses/recommendations, analysis fields |
| **vendor_monitoring** | id, tenant_id, vendor_id, is_enabled, health_score, status, health_history (JSON) |
| **vendor_monitoring_alerts** | id, tenant_id, vendor_id, alert_type, severity, title, status |
| **vendor_contracts** | id, tenant_id, vendor_id, title, contract_type, start/end_date, value, status |
| **vendor_discoveries** | id, tenant_id, vendor_name, category, source, risk_indicator, status |
| **vendor_lifecycles** | id, tenant_id, vendor_id, stage, previous_stage, changed_by, notes |
| **vendor_intelligence** | id, vendor_id, intelligence_type, source_url, summary, risk_impact |

### 2.6 Incidents & Remediation

| Table | Key Columns |
|-------|-------------|
| **incidents** | id, org_id, title, incident_type, severity, status (reported→closed), description, description_encrypted (PHI), phi_involved, individuals_affected, is_breach, notification_deadline, hhs_notified, deleted_at, tenant_id |
| **remediations** | id, org_id, finding_id→findings, title, priority, status (open→verified/deferred), assigned_to, due_date, ai_suggestion, deleted_at, tenant_id |
| **remediation_playbooks** | id, tenant_id, name, trigger_type, actions (JSON), auto_execute, cooldown_minutes |
| **remediation_executions** | id, tenant_id, playbook_id, status, actions_taken (JSON), started_at, completed_at |
| **remediation_rules** | id, tenant_id, name, condition_type, action_type, is_active |
| **escalation_policies** | id, tenant_id, name, levels (JSON), auto_escalate |

### 2.7 Training

| Table | Key Columns |
|-------|-------------|
| **training_courses** | id, org_id, title, training_type, duration_minutes, passing_score, is_required, frequency_days, external_id, external_provider, tenant_id |
| **training_records** | id, org_id, course_id, employee_name/email/role, status, score, completed_at, expires_at, group_id, external_id/provider/user_id, deleted_at, tenant_id |
| **security_courses** | id, tenant_id, title, category, duration_minutes, passing_score, total_questions, content_modules (JSON with quiz questions) |
| **security_enrollments** | id, tenant_id, user_id, course_id, status, progress (0-100), quiz_score, quiz_attempts, passed |
| **policy_acknowledgments** | id, org_id, document_id, policy_title, employee_name/email, status, acknowledged_at, version, deleted_at, tenant_id |

### 2.8 AI & Conversations

| Table | Key Columns |
|-------|-------------|
| **ai_conversations** | id, org_id, tenant_id, user_id, title, context_type |
| **ai_messages** | id, conversation_id, role (user/assistant), content, content_encrypted (PHI) |
| **ai_generated_policies** | id, tenant_id, policy_type, title, content, framework, status, version |
| **tenant_ai_configs** | id, tenant_id (unique), provider (mock/anthropic/openai/azure_openai), api_key_encrypted, model_name, max_tokens, temperature, is_configured, validation_status |

### 2.9 Billing & Subscriptions

| Table | Key Columns |
|-------|-------------|
| **packages** | id, name, slug (unique), tier, price_monthly/yearly, price_monthly_decimal (Numeric(12,2)), max_users/documents/scans/ai_queries, storage_limit_mb, features (JSON), has_sso/api_access/custom_integrations, sort_order |
| **subscriptions** | id, tenant_id (unique), package_id, status, billing_cycle, current_period_start/end, amount, amount_decimal |
| **contracts** | id, tenant_id, subscription_id, contract_number (unique), contract_type, status, start/end_date, contract_value, contract_value_decimal, billing_frequency, payment_terms, signatory_name/email/title, auto_renew |
| **invoices** | id, tenant_id, contract_id, invoice_number (unique), status, issue/due/paid_date, subtotal/tax/discount/total/amount_paid/amount_due + _decimal variants, line_items (JSON), payment_method |
| **billing_events** | id, tenant_id, event_type, event_category, subscription/contract/invoice_id, description, actor_type/id/name |
| **usage_summaries** | id, tenant_id, year, month, documents_uploaded, scans_run, ai_queries, api_calls, overage tracking. Unique: (tenant_id, year, month) |
| **usage_logs** | id, tenant_id, user_id, action, resource_type, endpoint, method, status_code, tokens_used, duration_ms |

### 2.10 Compliance Frameworks

| Table | Key Columns |
|-------|-------------|
| **compliance_frameworks** | id, tenant_id, name, display_name, version, requirement_count, is_active, current_score |
| **framework_requirements** | id, tenant_id, framework_id, requirement_id, title, category, severity, status (met/partially_met/not_met/not_applicable) |
| **cross_mappings** | id, tenant_id, source/target_framework_id, source/target_requirement_id, mapping_type, confidence_score, ai_verified |
| **framework_evidence** | id, tenant_id, framework_requirement_id, evidence_type, title, satisfies_frameworks (JSON) |

### 2.11 Assets & Monitoring

| Table | Key Columns |
|-------|-------------|
| **assets** | id, tenant_id, name, asset_type, status, ip_address, hostname, os_type, risk_level, compliance_status, tags |
| **asset_vulnerabilities** | id, tenant_id, asset_id, cve_id, title, severity, cvss_score, status |
| **device_monitors** | id, tenant_id, asset_id, monitor_type, thresholds, cpu/memory/disk_usage |
| **monitoring_alerts** | id, tenant_id, asset_id, alert_type, severity, title, status |
| **asset_agents** | id, tenant_id, asset_id, agent_version, status, platform |

### 2.12 Personnel & Workflows

| Table | Key Columns |
|-------|-------------|
| **employees** | id, tenant_id, email, full_name, department, title, role, status, training_completion_pct, background_check_status, access_level, nda_signed, hipaa_trained |
| **compliance_tasks** | id, tenant_id, title, task_type, priority, status, assigned_to, due_date, recurrence_type, group_id |
| **system_access** | id, tenant_id, employee_id, system_name, access_level, status, review_status |
| **onboarding_workflows** | id, tenant_id, employee_id, workflow_type (onboarding/offboarding), status |
| **workflow_steps** | id, tenant_id, workflow_id, title, step_order, status, required |
| **employee_groups** | id, tenant_id, name, department. Members via employee_group_memberships |
| **assignment_tokens** | id, tenant_id, token (unique), token_type, resource_id, assignee_email, expires_at |
| **access_reviews** | id, org_id, title, review_type, frequency, status, scope, reviewer, users_reviewed/total, access_changes (JSON), findings (JSON) |
| **employee_compliance** | id, org_id, employee_name/email, employment_status, onboarding/offboarding checklist booleans |

### 2.13 Regulatory, Governance & Advanced

| Table | Description |
|-------|-------------|
| **regulatory_updates/alerts/subscriptions** | Regulatory change tracking |
| **impact_assessments** | Detailed impact assessment for regulatory changes |
| **ai_systems** | EU AI Act system registry |
| **ai_risk_assessments** | AI risk assessments |
| **ai_governance_policies** | AI governance policies |
| **ai_audit_logs** | AI governance audit trail |
| **compliance_code_policies** | Compliance-as-code policy source |
| **policy_code_executions** | Code policy execution records |
| **code_policy_templates** | Built-in code policy templates |
| **compliance_pipelines** | Scheduled compliance code pipelines |
| **compliance_costs/benefits/budgets** | Compliance cost tracking |
| **cost_benchmarks** | Industry benchmarks |
| **breach_scenarios** | Breach scenario templates |
| **tabletop_exercises** | Tabletop exercise scheduling |
| **exercise_responses** | Step responses in exercises |
| **simulation_results** | Exercise scoring |
| **collab_tasks/comments** | Collaboration tasks |
| **collab_workflows/instances** | Workflow automation |
| **customer_portals** | Customer-facing portals |
| **portal_visitors/documents/inquiries** | Portal access tracking |
| **digital_twin_states** | Compliance environment snapshots |
| **twin_simulations/comparisons/alerts** | What-if simulations |
| **trust_center_configs/documents/faqs/access_requests/analytics** | Trust center |
| **scheduled_reports/report_history** | Report scheduling |
| **questionnaires/questionnaire_questions** | Questionnaire automation |
| **knowledge_base_entries** | Q&A knowledge base |
| **penalty_exposures/violation_mappings/exposure_snapshots** | Penalty calculation |
| **breach_intelligence_records** | HHS breach portal data |
| **baa_requirements** | BAA requirement knowledge base (15 items) |
| **contract_clauses/analyses** | Contract analysis |
| **baa_templates** | Generated BAA templates |
| **access_events/user_baselines/behavior_anomalies/anomaly_rules** | Behavior analytics |
| **due_diligence_projects/diligence_assessments/findings/liability_reports** | M&A due diligence |
| **compliance_archetypes** | Pre-configured compliance starting points (unique: industry+org_size+org_type) |
| **cohort_benchmarks/memberships** | Anonymous benchmarking (k-anonymity ≥3) |
| **evidence_collection_schedules** | Automated evidence collection schedules |

### 2.14 Platform & Config

| Table | Description |
|-------|-------------|
| **schema_versions** | Migration version tracking |
| **platform_settings** | Key-value settings |
| **sso_configs** | SSO/SAML/OIDC per tenant (encrypted secrets) |
| **custom_roles** | Custom RBAC roles per tenant |
| **workspaces/workspace_members** | Multi-workspace |
| **integration_configs** | Enterprise integration configs (encrypted credentials) |
| **integration_findings** | Enterprise integration scan findings |
| **integration_webhooks** | Webhook configurations |
| **integrations** | Basic integration tracking |
| **policy_templates** | Pre-built policy templates |
| **error_logs** | Error tracking with tracking_id |
| **audit_logs** | Legacy audit logs |
| **event_logs** | Detailed event logs |
| **onboarding_templates/personnel_onboarding_progress** | Personnel onboarding |

---

## 3. RBAC System

### 3.1 Roles

| Role | Purpose | Scope |
|------|---------|-------|
| **owner** | Business owner, created the account | Full access to everything including billing and ownership transfer |
| **admin** | System administrator | Full access except billing transfer |
| **compliance_officer** | Designated HIPAA CO/PO/SO | Full compliance data, cannot modify settings/billing/users |
| **auditor** | External/internal auditor | Read-only access to all compliance data |
| **analyst** | Compliance team member | View compliance + create/edit documents, evidence, incidents, remediation |
| **viewer** | Stakeholder | Read-only dashboard, compliance, documents, reports, training |

### 3.2 Permission Groups (21 groups, ~105 permissions)

| Group | Permissions |
|-------|------------|
| compliance | view, create, edit, delete, manage |
| documents | view, create, edit, delete, manage |
| controls | view, create, edit, delete, manage |
| evidence | view, create, edit, delete, manage |
| reports | view, create, edit, delete, manage |
| vendors | view, create, edit, delete, manage |
| incidents | view, create, edit, delete, manage |
| training | view, create, edit, delete, manage |
| settings | view, edit, manage |
| users | view, create, edit, delete, manage |
| integrations | view, create, edit, delete, manage |
| ai | view, chat, manage |
| remediation | view, create, edit, delete, manage |
| audit_trail | view, export, manage |
| risk | view, create, edit, delete, manage |
| monitoring | view, edit, manage |
| assets | view, create, edit, delete, manage |
| personnel | view, create, edit, delete, manage |
| collaboration | view, create, edit, delete, manage |
| questionnaires | view, create, edit, delete, manage |

### 3.3 How Permissions Are Checked

1. **JWT claims** include `role`, `tenant_id`, `organization_id`
2. **`require_permission(perm)`** FastAPI dependency extracts tenant context from JWT, loads user permissions from DB
3. Permission matching: `"*"` grants all, `"module.*"` grants all module perms, exact match for specific perms
4. **`require_tenant`** — just checks JWT has valid tenant
5. **`require_tenant_admin`** — requires owner or admin role
6. **`require_feature(slug)`** — checks tenant's package includes the feature (returns 403 `FEATURE_GATED` with upgrade info if not)

### 3.4 Custom Roles

Stored in `custom_roles` table. System roles (owner, admin, compliance-officer, auditor, analyst, viewer) are seeded with `is_system=True`. Tenants can create additional custom roles with arbitrary permission sets.

---

## 4. Integrations

### 4.1 Integration Connectors

| Connector | Type | What It Scans | Status | Config Required |
|-----------|------|---------------|--------|----------------|
| **AWS** | Cloud Infrastructure | S3 encryption, IAM MFA, CloudTrail, RDS, VPC flow logs, EBS encryption | Simulated | access_key_id, secret_access_key, region |
| **Azure** | Cloud Infrastructure | Azure AD MFA, Storage encryption, SQL TDE, NSGs, Key Vault, Activity Logs | Simulated | tenant_id, client_id, client_secret, subscription_id |
| **Okta** | Identity & Access | MFA policies, SSO config, user lifecycle, password policies, session policies | Simulated | domain, api_token |
| **Google Workspace** | Collaboration | 2FA enforcement, admin roles, sharing policies, MDM | Simulated | domain, service_account_json |
| **Microsoft 365** | Collaboration | Conditional Access MFA, Exchange encryption, Teams policies, SharePoint, Purview, DLP | Simulated | tenant_id, client_id, client_secret |
| **GitHub** | DevOps | Secret scanning, branch protection, PR reviews, org 2FA, Dependabot alerts | **Real (Live API)** | org_name, pat_token (scopes: repo, read:org, security_events) |
| **Slack** | Collaboration | DLP PHI scanning, channel audit, message retention, 2FA enforcement | Simulated | workspace_url, bot_token |
| **AWS S3** | Storage | Bucket encryption, public access blocking, logging, versioning, lifecycle, MFA Delete, Object Lock | Simulated | access_key_id, secret_access_key, region |
| **OneDrive/SharePoint** | Storage | External sharing, PHI detection, DLP, sensitivity labels, guest access | Simulated | tenant_id, client_id, client_secret |
| **Google Drive** | Storage | External sharing, PHI exposure, DLP rules, shared drive permissions | Simulated | domain, service_account_json |
| **Box** | Storage | PHI detection, sharing audit, access permissions, encryption | Simulated | client_id, client_secret, enterprise_id |
| **ServiceNow** | ITSM | Incident response SLAs, change management, CMDB accuracy, audit trail | Simulated | instance_url, username, password |
| **CRM (Salesforce/HubSpot)** | CRM | PHI field detection, access controls, data export monitoring, encryption | Simulated | instance_url, client_id, client_secret |
| **KnowBe4** | Training Provider | Training campaigns, phishing simulations, user completion data | **Real (Live API)** | api_key, region (us/eu/ca/uk/de) |

### 4.2 Scanner Types (Internal)

| Scanner | CFR Coverage | What It Checks |
|---------|-------------|----------------|
| **PolicyScanner** | Multiple | Scans all uploaded documents against HIPAA knowledge base |
| **TechnicalScanner** | 164.312 | Encryption at rest/transit, access logging, backup, patching, firewall |
| **AccessControlScanner** | 164.312(a), 164.308(a)(3-4) | MFA, RBAC, password policies, orphaned accounts, access reviews |
| **EncryptionScanner** | 164.312(a)(2)(iv), 164.312(e)(2)(ii) | Database/storage/email encryption, TLS config, certificate validity, key management |
| **NetworkScanner** | 164.312(e)(1) | Network segmentation, firewall rules, VPN, IDS, monitoring |
| **TrainingScanner** | 164.308(a)(5) | Training completion rates, currency, new hire training, role-based training |

---

## 5. Auth Flow

### 5.1 Signup Flow

1. User submits `{ full_name, email, company_name, password }` to `POST /signup`
2. Password validated: 8+ chars, uppercase, lowercase, digit
3. Email uniqueness check (deactivated accounts freed up by renaming)
4. Slug generated from company name (uniqueness ensured with suffix)
5. Creates: **Tenant** (status=trial, trial_ends_at=now+14d) → **Organization** → **TenantUser** (role=owner)
6. Welcome email sent (non-blocking)
7. Returns JWT access + refresh tokens with tenant context
8. Frontend redirects to onboarding wizard

### 5.2 Login Flow

1. Rate limit check: 5 attempts per 60 seconds per IP (in-memory)
2. Single optimized query: JOIN TenantUser + Tenant + Organization + Package
3. Verify password with bcrypt
4. Check user.is_active and tenant.status (must be active/trial/pending_setup)
5. Update last_login_at
6. Generate JWT pair with claims: sub, email, full_name, role, tenant_id, organization_id, tenant_name, tenant_slug, onboarding_completed
7. Return user object + token + package info

### 5.3 Token Structure

**Access Token (JWT):**
```json
{
  "sub": "user-uuid",
  "iat": 1711468800,
  "exp": 1711472400,
  "type": "access",
  "email": "user@example.com",
  "full_name": "User Name",
  "role": "owner",
  "tenant_id": "tenant-uuid",
  "organization_id": "org-uuid",
  "tenant_name": "Company Name",
  "tenant_slug": "company-name",
  "onboarding_completed": true
}
```

**Refresh Token:** `{ sub, iat, exp, type: "refresh" }` — expires in `REFRESH_TOKEN_EXPIRE_DAYS`

Algorithm: configurable via `settings.ALGORITHM`, signed with `settings.SECRET_KEY`

### 5.4 Password Reset Flow

1. User submits email to `POST /forgot-password`
2. System generates InviteToken (type=password_reset, expires in 1h)
3. Sends reset email with token link
4. User submits `{ token, password }` to `POST /reset-password`
5. Token validated (single-use), password updated, token marked accepted

### 5.5 Invite Flow

1. Admin creates user via `POST /users` with email and role
2. System generates InviteToken (type=invite)
3. Sends invite email with acceptance link
4. Invitee validates token via `POST /invite/validate`
5. Sets password via `POST /invite/accept` → auto-login with JWT

### 5.6 Logout

- `POST /logout` adds token to in-memory blocklist
- `is_token_blocked()` checked in auth middleware

---

## 6. Compliance Engine

### 6.1 How Compliance Checks Work

1. **Document Upload** → text extracted (PDF, DOCX, TXT, CSV, Excel, images via OCR), classified by type, relevance detected
2. **Auto-Analysis** → if document is relevant, runs keyword-based HIPAA analysis immediately
3. **Manual Check** → `POST /compliance/check` or `POST /compliance/quick-scan` triggers full analysis
4. **Analysis Process** (in `hipaa/analyzer.py`):
   - Loads 73 HIPAA requirements from knowledge base
   - For each requirement, searches document text for check_keywords
   - Calculates per-requirement status: compliant/non_compliant/partial/not_assessed
   - Generates findings and gaps
   - Calculates overall score with category breakdown
5. **Results Stored** → ComplianceCheck + Findings + Gaps persisted to DB
6. **Pattern Extraction** → background task extracts patterns for learning engine

### 6.2 Scanners

The **Continuous Monitoring Orchestrator** (`scanning/monitor.py`) runs all 6 internal scanners:

| Scanner | Method | Findings Stored |
|---------|--------|-----------------|
| PolicyScanner | Analyzes uploaded documents | → ScanResult + Finding rows |
| TechnicalScanner | Simulated infrastructure checks | → ScanResult + Finding rows |
| AccessControlScanner | Simulated IAM checks | → ScanResult + Finding rows |
| EncryptionScanner | Simulated encryption validation | → ScanResult + Finding rows |
| NetworkScanner | Simulated network security | → ScanResult + Finding rows |
| TrainingScanner | Simulated training compliance | → ScanResult + Finding rows |

Each scanner returns `ScanResultData` with a list of `ScanFinding` objects. Results are persisted as `ScanResult` (aggregate) + individual `Finding` rows linked via `scan_result_id`.

### 6.3 Score Calculation

**Overall Score** = weighted average of category scores:
- Each finding has a status: compliant (100%), partial (50%), non_compliant (0%), not_assessed (excluded)
- Category scores = average of requirement scores within that category
- **Risk Level**: ≥90 → low, ≥75 → medium, ≥50 → high, <50 → critical

**Score Breakdown** stored as JSON:
```json
{
  "overall_score": 72.5,
  "category_scores": {
    "Administrative Safeguards": 80.0,
    "Technical Safeguards": 65.0,
    "Physical Safeguards": 72.0,
    ...
  },
  "requirement_type_scores": {
    "required": 70.0,
    "addressable": 78.0
  },
  "severity_scores": {
    "critical": 60.0,
    "high": 72.0,
    "medium": 80.0,
    "low": 90.0
  }
}
```

### 6.4 HIPAA Roadmap Structure

The roadmap covers **6 HIPAA Rules** with **checklist items** per rule:

1. **Privacy Rule** — NPP, authorization forms, minimum necessary, patient rights, de-identification
2. **Security Rule (Administrative)** — Security officer, risk analysis, workforce security, training, incident procedures, contingency plan
3. **Security Rule (Physical)** — Facility access, workstation security, device/media controls
4. **Security Rule (Technical)** — Access controls, audit controls, integrity controls, transmission security, encryption
5. **Breach Notification Rule** — Response plan, risk assessment procedures, notification templates, BA notification
6. **Organizational Requirements** — BAA inventory, policies & procedures documentation, documentation retention

Each item has: `id`, `title`, `status` (complete/incomplete/in_progress), `evidence` (date/note), derived from actual DB data (documents uploaded, risk assessments completed, training records, etc.).

### 6.5 HIPAA Knowledge Base

- **73 HIPAA requirements** organized by category (Administrative/Physical/Technical Safeguards, Privacy Rule, Breach Notification, Organizational Requirements)
- Each requirement includes: CFR reference, standard name, requirement type (required/addressable), severity, check_keywords, check_questions, common_gaps
- Used by the analyzer and the HIPAA graph visualization

### 6.6 LLM Integration

- **Provider-agnostic**: supports mock, Anthropic, OpenAI, Azure OpenAI
- **Per-tenant config**: each tenant can configure their own API key + model
- Used for: AI chat, policy analysis, remediation suggestions, breach determination, policy drafting, evidence checking, contract analysis
- **Feature-gated**: AI Agent requires `ai_agent` feature in package

---

## Appendix: Feature Gates by Package Tier

| Feature Slug | Starter | Professional | Enterprise |
|-------------|---------|-------------|-----------|
| `policy_templates` | ✅ | ✅ | ✅ |
| `compliance_scanning` | ✅ | ✅ | ✅ |
| `risk_register` | — | ✅ | ✅ |
| `vendor_risk` | — | ✅ | ✅ |
| `audit_reports` | — | ✅ | ✅ |
| `security_training` | — | ✅ | ✅ |
| `multi_framework` | — | ✅ | ✅ |
| `enterprise_integrations` | — | ✅ | ✅ |
| `ai_agent` | — | ✅ | ✅ |
| `risk_management` | — | — | ✅ |
| `tprm` | — | — | ✅ |
| `auto_remediation` | — | — | ✅ |
| `breach_simulation` | — | — | ✅ |
| `compliance_code` | — | — | ✅ |
| `compliance_costs` | — | — | ✅ |
| `collaboration` | — | — | ✅ |
| `customer_portal` | — | — | ✅ |
| `trust_center` | — | — | ✅ |
| `digital_twin` | — | — | ✅ |
| `regulatory_radar` | — | — | ✅ |
| `ai_governance` | — | — | ✅ |
| `personnel` | — | ✅ | ✅ |
| `asset_management` | — | ✅ | ✅ |
| `advanced_reports` | — | ✅ | ✅ |
| `questionnaires` | — | ✅ | ✅ |

*Note: Feature lists are managed in `core/feature_registry.py` and synced to packages on deploy.*
