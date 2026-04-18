# Shieldra AI — Entity Types, Data Flows & System Architecture

> **Generated:** 2026-03-26 | **Purpose:** Master requirements reference document
> **Source:** Database models (`db.py`), frontend stores/hooks, RBAC definitions, tenant context

---

## Table of Contents
1. [Entity Types & Lifecycle](#1-entity-types--lifecycle)
2. [Cross-Page Data Flows](#2-cross-page-data-flows)
3. [User Roles & Permissions (RBAC)](#3-user-roles--permissions-rbac)
4. [Multi-Tenant Architecture](#4-multi-tenant-architecture)
5. [Notification & Activity Tracking](#5-notification--activity-tracking)

---

## 1. Entity Types & Lifecycle

### 1.1 Core Compliance Entities

#### Organization
- **Fields:** id, tenant_id, name, org_type (covered_entity|business_associate), size, state, operating_states (JSON), phi_types (JSON), config_json, created_at, updated_at
- **CRUD:** Created during signup/onboarding. Read/updated via Settings page. One per tenant.
- **Lifecycle:** Created at signup → configured during onboarding → updated via settings
- **Pages:** Settings (edit), Dashboard (read), all pages (scoping context)
- **Relationships:** Belongs to Tenant. Parent of all org-scoped entities (Documents, Findings, Vendors, etc.)

#### Document
- **Fields:** id, org_id, tenant_id, title, doc_type (policy|procedure|risk_assessment|baa|training|other), content_text, file_name, file_size, mime_type, status, classification, uploaded_at, analyzed_at, sections_json, metadata_json, page_count, word_count, version, previous_version_id, is_latest, version_notes, content_text_encrypted, deleted_at
- **CRUD:** Create on Documents page. Read on Documents, Evidence, Compliance Detail. Update on Documents. Soft-delete.
- **Status lifecycle:** `uploaded → processing → analyzed → error`
- **Pages displayed:** Documents, Evidence, Compliance Detail, HIPAA Roadmap, Contract Intelligence
- **Pages create/modify:** Documents page, Policy Templates (generate), AI Assistant (generate)
- **Relationships:** Belongs to Organization/Tenant. Has many PolicyAcknowledgments. Referenced by ContractClause, ContractAnalysis. Self-referencing versioning (previous_version_id).

#### ComplianceCheck
- **Fields:** id, org_id, tenant_id, document_id, regulation, status, overall_score, risk_level, summary, requirements_checked, score_breakdown (JSON), category_summary (JSON), initiated_by, created_at, completed_at, framework_id
- **CRUD:** Created via Scanning page or automated scan. Read on Compliance, Dashboard, Compliance Detail.
- **Status lifecycle:** `pending → running → completed → failed`
- **Pages displayed:** Dashboard (score), Compliance, Compliance Detail, Scanning
- **Pages create/modify:** Scanning page (initiate), system (automated)
- **Relationships:** Belongs to Organization/Tenant. Has many Findings, Gaps. Optionally linked to Document and ComplianceFramework.

#### Finding
- **Fields:** id, org_id, tenant_id, check_id, scan_result_id, requirement_id, cfr_reference, requirement_title, status, severity, title, description, evidence_text, location (JSON), recommendation, confidence, category, source (document_scan|integration_scan|manual), alert_status (active|acknowledged|dismissed), alert_read, framework, framework_reference, framework_requirement_id, deleted_at
- **CRUD:** Created by compliance scans or integration scans. Read on Compliance Detail, Alerts, Remediation. Updated (alert status) on Alerts page.
- **Status lifecycle:** `compliant | non_compliant | partial | not_assessed`
- **Alert lifecycle:** `active → acknowledged → dismissed`
- **Pages displayed:** Compliance Detail, Alerts, Dashboard (counts), HIPAA Roadmap, Risk Prioritization, Penalty Exposure
- **Pages create/modify:** Scanning (auto-create), Alerts (acknowledge/dismiss)
- **Relationships:** Belongs to ComplianceCheck or ScanResult. Has many Remediations, ViolationMappings, RiskPrioritizationScores.

#### Gap
- **Fields:** id, org_id, tenant_id, check_id, requirement_id, cfr_reference, requirement_title, gap_type (missing_policy|outdated|insufficient), description, impact, suggested_action, category, framework, framework_reference, framework_requirement_id, deleted_at
- **CRUD:** Created by compliance scans. Read on Compliance Detail, HIPAA Roadmap.
- **Pages displayed:** Compliance Detail, HIPAA Roadmap, Gap Analysis reports
- **Relationships:** Belongs to ComplianceCheck.

#### Evidence
- **Fields:** id, org_id, tenant_id, control_id, evidence_type (document|screenshot|config|attestation|scan_result), title, description, file_name, content_text, status, collected_at, verified_at, verified_by, source (manual|scan|integration), metadata_json, content_text_encrypted, satisfies_frameworks (JSON), framework_requirement_id, deleted_at
- **CRUD:** Create on Evidence page. Read on Evidence, Controls, Compliance Detail. Update/verify on Evidence page.
- **Status lifecycle:** `collected → verified → expired → rejected`
- **Pages displayed:** Evidence, Controls (linked), Compliance Detail, Audit Reports
- **Pages create/modify:** Evidence page, integration scans (auto-collect)
- **Relationships:** Belongs to Organization/Tenant. Linked to Controls via control_id. Has EvidenceValidations.

#### Control
- **Fields:** id, tenant_id, code, name, description, category, framework, severity, status, owner_id, implementation_notes, implementation_guidance, test_frequency, last_tested_at, is_custom, is_library, mapped_requirements (JSON), mapped_policies (JSON), evidence_ids (JSON), metadata_json
- **CRUD:** Seeded from library. Created/edited on Controls page. Custom controls can be created.
- **Status lifecycle:** `not_implemented → partial → implemented → not_applicable`
- **Pages displayed:** Controls, Compliance Detail, HIPAA Roadmap, Frameworks
- **Pages create/modify:** Controls page, onboarding (seed)
- **Relationships:** Belongs to Tenant. Has many ControlTests. Owner is TenantUser. Linked to Evidence, FrameworkRequirements.

#### ControlTest / ControlTestResult
- **Fields (Test):** id, tenant_id, control_id, name, description, test_type (manual|automated|integration), test_script, expected_result, status (pending|passing|failing|error), last_result (JSON), frequency, sla_hours, sla_status
- **Fields (Result):** id, tenant_id, test_id, control_id, status, result_data (JSON), error_message, run_by, run_at
- **Pages displayed:** Controls (detail view), Dashboard (monitoring widgets)
- **Relationships:** ControlTest belongs to Control. ControlTestResult belongs to ControlTest and Control.

#### Remediation
- **Fields:** id, org_id, tenant_id, finding_id, gap_id, title, description, priority (critical|high|medium|low), status, assigned_to, due_date, completed_at, ai_suggestion, notes, effort_estimate, deleted_at
- **CRUD:** Create on Remediation page or from Compliance Detail. Read on Remediation, Dashboard. Update on Remediation page.
- **Status lifecycle:** `open → in_progress → completed → verified → deferred`
- **Pages displayed:** Remediation, Dashboard (counts/status), Compliance Detail
- **Pages create/modify:** Remediation page, Compliance Detail (create from finding)
- **Relationships:** Belongs to Organization/Tenant. Linked to Finding and/or Gap.

### 1.2 Risk Management Entities

#### RiskAssessment
- **Fields:** id, org_id, tenant_id, title, description, status, overall_risk_score, risk_level, methodology, assessor, signed_off, signed_off_by, signed_off_by_title, signed_off_at, sign_off_notes, next_review_date, deleted_at
- **CRUD:** Create/edit on Risk Assessment page. Read on Dashboard, Reports.
- **Status lifecycle:** `draft → in_progress → completed → approved`
- **Sign-off workflow:** Security Officer approval with signature, title, and notes
- **Pages displayed:** Risk Assessment, Dashboard, Reports, HIPAA Roadmap
- **Relationships:** Belongs to Organization/Tenant. Has many RiskItems.

#### RiskItem
- **Fields:** id, org_id, tenant_id, assessment_id, requirement_id, threat, vulnerability, asset, likelihood (1-5), impact (1-5), risk_score, risk_level, current_controls, mitigation, status, owner, due_date, deleted_at
- **Status lifecycle:** `identified → mitigating → accepted → resolved`
- **Relationships:** Belongs to RiskAssessment.

#### RiskRegister / RiskManagementItem / TreatmentPlan / RiskScoringModel
- **Purpose:** Advanced risk management with custom registers, scoring models, and treatment plans
- **Pages displayed:** Risk Register, Risk Management
- **RiskManagementItem status:** `identified → assessed → treating → accepted → closed`
- **TreatmentPlan status:** `planned → in_progress → completed → monitoring`
- **Relationships:** RiskManagementItem belongs to RiskRegister, linked to TreatmentPlan.

### 1.3 Vendor / TPRM Entities

#### Vendor
- **Fields:** id, org_id, tenant_id, name, vendor_type, contact_name, contact_email, services, phi_access, phi_types (JSON), baa_status, baa_signed_date, baa_expiry_date, risk_score, risk_level, last_assessed, status, notes, deleted_at
- **CRUD:** Create/edit on Vendors page. Read on Vendors, TPRM, HIPAA Roadmap, Dashboard.
- **BAA status lifecycle:** `none → draft → active → expired → needs_review`
- **Pages displayed:** Vendors, TPRM, HIPAA Roadmap (BAA status), Dashboard
- **Relationships:** Belongs to Organization/Tenant. Has many VendorRiskAssessments, VendorContracts, VendorMonitoring, VendorAIReviews, VendorLifecycles, VendorIntelligence.

#### VendorRiskAssessment
- **Fields:** id, tenant_id, vendor_id, assessment_type, status, risk_score, risk_level, questionnaire_responses (JSON), score_breakdown (JSON), recommendations (JSON), notes, assessed_by, next_review_date
- **Status lifecycle:** `draft → in_progress → completed → archived`
- **Pages:** Vendor Risk, TPRM

#### VendorMonitoring / VendorMonitoringAlert / VendorContract / VendorDiscovery / VendorLifecycle / VendorAIReview
- **Purpose:** Continuous vendor monitoring, contract tracking, shadow IT discovery, lifecycle management, AI-powered security reviews
- **VendorLifecycle stages:** `prospect → due_diligence → onboarding → active → review → offboarding → terminated`
- **Pages:** TPRM (all sub-features)

### 1.4 Incident Management

#### Incident
- **Fields:** id, org_id, tenant_id, title, incident_type (security_incident|breach|near_miss), severity, status, description, phi_involved, phi_types_affected (JSON), individuals_affected, is_breach, breach_determination, root_cause, corrective_actions, reporter, assigned_to, detected_at, reported_at, contained_at, resolved_at, notification_deadline, notification_sent, hhs_notified, media_notified, description_encrypted, deleted_at
- **CRUD:** Create/edit on Incidents page. Read on Dashboard, Reports.
- **Status lifecycle:** `reported → investigating → contained → resolved → closed`
- **Breach notification:** 60-day deadline tracked. HHS notification and media notification flags.
- **Pages displayed:** Incidents, Dashboard, Reports, Breach Simulation (related)
- **Relationships:** Belongs to Organization/Tenant.

### 1.5 Training & Personnel

#### TrainingCourse / TrainingRecord
- **TrainingCourse fields:** id, org_id, tenant_id, title, description, training_type, duration_minutes, passing_score, is_required, frequency_days, external_id, external_provider
- **TrainingRecord status lifecycle:** `not_started → in_progress → completed → expired → overdue`
- **Pages:** Training
- **Relationships:** TrainingRecord belongs to TrainingCourse. Linked to EmployeeGroup.

#### SecurityCourse / SecurityEnrollment
- **Purpose:** Interactive security awareness training with quiz modules
- **SecurityEnrollment status:** `enrolled → in_progress → completed → failed → expired`
- **Pages:** Security Training

#### Employee / ComplianceTask / OnboardingTemplate / OnboardingWorkflow / WorkflowStep / EmployeeGroup
- **Employee status:** `active → inactive → onboarding → offboarding`
- **ComplianceTask status:** `pending → in_progress → completed → overdue → cancelled`
- **Pages:** Personnel, Employee Compliance

#### PolicyAcknowledgment
- **Status lifecycle:** `pending → acknowledged → expired`
- **Pages:** Training (acknowledgments tab), Documents (linked)

#### SystemAccess / AccessReview
- **Purpose:** Track employee system access, periodic access reviews
- **AccessReview status:** `scheduled → in_progress → completed → overdue → cancelled`
- **Pages:** Personnel, Employee Compliance, Audit Trail

### 1.6 Multi-Tenant & Billing Entities

#### Tenant
- **Fields:** id, name, slug, domain, status, plan_id, contact info, org details, compliance_frameworks (JSON), phi_types (JSON), max_users/documents/scans/ai_queries, storage limits, settings_json, onboarded_at, trial_ends_at
- **Status lifecycle:** `trial → active → suspended → deactivated → pending_setup`
- **Relationships:** Has many TenantUsers, Organizations (1:1 typically), Subscriptions (1:1), Contracts, Invoices. Has one TenantAIConfig.

#### TenantUser
- **Fields:** id, tenant_id, email, full_name, hashed_password, role (owner|admin|analyst|viewer|compliance_officer|auditor), is_active, permissions (JSON), invite_status, onboarding_completed_at, last_login_at
- **Invite lifecycle:** `direct | invited → accepted → expired`
- **Relationships:** Belongs to Tenant.

#### Package / Subscription / Contract / Invoice / BillingEvent
- **Package tiers:** Starter ($499/mo), Professional ($999/mo), Enterprise (custom)
- **Subscription status:** `active → past_due → cancelled → trial`
- **Contract status:** `draft → active → expired → cancelled → renewed`
- **Invoice status:** `draft → sent → paid → overdue → cancelled → void`
- **Pages:** Settings (billing), Platform Settings (admin)

#### InviteToken
- **Token types:** `invite | password_reset`
- **Status lifecycle:** `pending → accepted → expired → revoked`

### 1.7 Integration Entities

#### Integration / IntegrationConfig / IntegrationFinding / IntegrationWebhook
- **Integration status:** `disconnected → connected → error → scanning`
- **IntegrationFinding status:** `open → resolved → dismissed`
- **Pages:** Enterprise Integrations, Settings

#### ScanResult
- **Purpose:** Results from integration-based security scans
- **Relationships:** Belongs to Integration. Has many Findings.

### 1.8 AI & Conversation Entities

#### AIConversation / AIMessage / AIGeneratedPolicy / TenantAIConfig
- **AIGeneratedPolicy status:** `draft → review → approved → published`
- **Pages:** AI Assistant, AI Agent, Policy Templates
- **Relationships:** AIConversation has many AIMessages. Linked to TenantUser.

### 1.9 Compliance Framework Entities

#### ComplianceFramework / FrameworkRequirement / CrossMapping / FrameworkEvidence
- **FrameworkRequirement status:** `not_met → partially_met → met → not_applicable`
- **CrossMapping types:** `equivalent | partial | related`
- **Pages:** Frameworks, Controls, Compliance Detail

#### HIPAARequirementDB
- **Purpose:** Static knowledge base of 73 HIPAA requirements
- **Seeded at startup.** Not user-editable.

### 1.10 Reporting Entities

#### AuditReport / ScheduledReport / ReportHistory
- **AuditReport types:** hipaa_readiness, soc2_readiness, executive_summary, gap_analysis, risk_assessment_summary, evidence_package
- **AuditReport status:** `draft → generating → completed → archived`
- **Pages:** Reports, Audit Reports, Advanced Reports

### 1.11 Asset Management Entities

#### Asset / AssetVulnerability / DeviceMonitor / MonitoringAlert / AssetAgent
- **Asset status:** `active → inactive → decommissioned → unknown`
- **AssetVulnerability status:** `open → in_progress → resolved → accepted → false_positive`
- **MonitoringAlert status:** `active → acknowledged → resolved`
- **Pages:** Assets

### 1.12 Advanced Feature Entities

#### Questionnaire / QuestionnaireQuestion / KnowledgeBaseEntry
- **Questionnaire status:** `draft → in_progress → review → completed → sent`
- **Question status:** `unanswered → ai_suggested → answered → reviewed`
- **Pages:** Questionnaires

#### RemediationPlaybook / RemediationExecution / RemediationRule / EscalationPolicy
- **RemediationExecution status:** `pending → executing → completed → failed → escalated → rolled_back`
- **Pages:** Auto-Remediation

#### RegulatoryUpdate / RegulatoryAlert / RegulatorySubscription / ImpactAssessment
- **RegulatoryUpdate status:** `new → analyzing → action_required → monitoring → archived`
- **Pages:** Regulatory Radar

#### AISystem / AIRiskAssessment / AIGovernancePolicy / AIAuditLog
- **AISystem risk levels:** `unacceptable | high | limited | minimal`
- **Pages:** AI Governance

#### ComplianceCodePolicy / PolicyCodeExecution / CodePolicyTemplate / CompliancePipeline
- **ComplianceCodePolicy status:** `draft → compiled → failed → deployed`
- **Pages:** Compliance Code

#### ComplianceCost / ComplianceBenefit / ComplianceBudget / CostBenchmark
- **Pages:** Compliance Costs

#### BreachScenario / TabletopExercise / ExerciseResponse / SimulationResult
- **TabletopExercise status:** `scheduled → in_progress → completed → cancelled`
- **Pages:** Breach Simulation

#### CollabTask / CollabTaskComment / CollabWorkflow / CollabWorkflowInstance
- **CollabTask status:** `todo → in_progress → in_review → blocked → completed → cancelled`
- **Pages:** Collaboration

#### DigitalTwinState / TwinSimulation / TwinComparison / TwinAlert
- **TwinSimulation status:** `draft → running → completed → failed`
- **Pages:** Digital Twin

#### DueDiligenceProject / DiligenceAssessment / DiligenceFinding / LiabilityReport
- **DueDiligenceProject status:** `planning → assessment → analysis → reporting → completed → cancelled`
- **Pages:** Due Diligence

#### CustomerPortal / PortalVisitor / PortalDocument / PortalInquiry
- **PortalInquiry status:** `new → in_progress → resolved → closed`
- **Pages:** Customer Portal

#### TrustCenterConfig / TrustCenterDocument / TrustCenterFAQ / TrustCenterAccessRequest / TrustCenterAnalytics
- **TrustCenterAccessRequest status:** `pending → approved → denied`
- **Pages:** Trust Center Admin

#### Workspace / WorkspaceMember
- **Purpose:** Multi-project workspaces for organizing compliance work
- **Pages:** Settings (workspace management)

#### SSOConfig / CustomRole
- **Purpose:** SSO/SAML/OIDC configuration, custom RBAC roles
- **Pages:** Settings (security), Platform Settings

### 1.13 Analytics & Intelligence Entities

#### PenaltyExposure / ViolationMapping / ExposureSnapshot
- **Pages:** Penalty Exposure

#### RiskPrioritizationScore / BreachIntelligenceRecord / RiskSnapshot
- **Pages:** Risk Prioritization, Insights

#### ComplianceArchetype / CohortBenchmark / CohortMembership
- **Purpose:** Industry archetypes for onboarding, anonymous peer benchmarking
- **Pages:** Onboarding (archetype selection), Dashboard (benchmarks)

### 1.14 Audit & Logging Entities

#### AuditLog
- **Fields:** id, org_id, user, action, resource_type, resource_id, details (JSON), ip_address, timestamp
- **Immutable:** PostgreSQL trigger prevents UPDATE/DELETE
- **Pages:** Audit Trail

#### EventLog
- **Fields:** id, tenant_id, org_id, user_id, user_email, action, resource_type, resource_id, resource_name, details (JSON), ip_address, user_agent, created_at
- **Immutable:** PostgreSQL trigger prevents UPDATE/DELETE
- **Pages:** Audit Trail

#### UsageLog / UsageSummary
- **Purpose:** Per-tenant usage tracking for billing and monitoring
- **Pages:** Settings (usage), Platform Settings (admin)

#### ErrorLog
- **Purpose:** Per-tenant error tracking with user-facing error reporting
- **Pages:** Platform Settings (admin), error report dialog (user-facing)

#### BillingEvent
- **Purpose:** Immutable audit trail for billing events
- **Pages:** Settings (billing history), Platform Settings (admin)

---

## 2. Cross-Page Data Flows

### 2.1 Document → Compliance Pipeline

```
Documents page (upload) 
  → Document created (status: uploaded)
  → Scanning page (initiate compliance check)
  → ComplianceCheck created (status: pending → running)
  → Findings created (compliant/non_compliant/partial)
  → Gaps created (missing_policy/outdated/insufficient)
  → Compliance Detail page (view results)
  → Dashboard (overall compliance score updated)
  → HIPAA Roadmap (requirement status updated)
  → Alerts page (new non-compliant findings appear)
```

### 2.2 Finding → Remediation Pipeline

```
Compliance Detail / Alerts page (finding identified)
  → User creates Remediation from finding
  → Remediation page (track progress: open → in_progress → completed)
  → Auto-Remediation (playbook triggered if configured)
  → Dashboard (remediation stats updated)
  → Compliance score recalculated when finding status changes
```

### 2.3 Vendor Management Flow

```
Vendors page (create vendor)
  → Vendor created with BAA status
  → TPRM page (detailed vendor management)
    → VendorRiskAssessment (questionnaire-based scoring)
    → VendorMonitoring (continuous health checks)
    → VendorContract tracking
    → VendorLifecycle management
    → VendorAIReview (AI-powered security posture)
    → VendorDiscovery (shadow IT detection)
  → HIPAA Roadmap (BAA compliance status displayed)
  → Dashboard (vendor risk summary)
  → Vendor Risk page (risk assessments)
```

### 2.4 Integration Scan Flow

```
Enterprise Integrations page (connect AWS/Azure/GCP/Okta)
  → Integration configured (status: connected)
  → ScanResult created when scan runs
  → IntegrationFindings created
  → Findings created (source: integration_scan)
  → Compliance Detail (findings appear)
  → Alerts page (new findings trigger alerts)
  → Evidence auto-collected (scan results as evidence)
  → Dashboard (integration health status)
```

### 2.5 Training & Personnel Flow

```
Personnel page (create/manage employees)
  → Employee created with compliance attributes
  → Training page (assign courses)
  → TrainingRecord created (status: not_started)
  → Employee completes training → status: completed
  → PolicyAcknowledgment assigned
  → Employee Compliance page (track onboarding/offboarding)
  → Security Training page (interactive courses with quizzes)
  → SecurityEnrollment tracks progress and quiz scores
  → HIPAA Roadmap (training compliance percentage)
  → Dashboard (training completion metrics)
```

### 2.6 Risk Assessment Flow

```
Risk Assessment page (create assessment)
  → RiskAssessment created (status: draft)
  → RiskItems identified with threat/vulnerability analysis
  → Risk scoring (likelihood × impact)
  → Risk Register page (organize risks by register)
  → Risk Management page (treatment plans)
  → TreatmentPlan created (strategy: mitigate/accept/transfer/avoid)
  → Risk Prioritization page (risk-weighted scoring)
  → Dashboard (overall risk score)
  → Reports (risk assessment summary)
  → Sign-off workflow (Security Officer approval)
```

### 2.7 Incident Response Flow

```
Incidents page (report incident)
  → Incident created (status: reported)
  → Investigation phase (status: investigating)
  → Breach determination (is_breach flag)
  → If breach: notification_deadline calculated (60 days)
  → Containment (status: contained)
  → Resolution (status: resolved → closed)
  → HHS notification tracking (hhs_notified flag)
  → Media notification (if 500+ individuals affected)
  → Breach Simulation page (tabletop exercises based on scenarios)
  → Dashboard (active incident count)
  → Reports (incident summary)
```

### 2.8 Evidence Collection Flow

```
Evidence page (manual upload or auto-collection)
  → Evidence created (status: collected)
  → Linked to Control via control_id
  → Controls page (evidence count updated)
  → Verification workflow (status: verified)
  → EvidenceValidation pipeline (automated freshness/contradiction checks)
  → EvidenceCollectionSchedule (automated periodic collection)
  → Compliance Detail (evidence supports requirement satisfaction)
  → Framework cross-mapping (evidence satisfies multiple frameworks)
  → Audit Reports (evidence package generation)
```

### 2.9 Compliance Framework Flow

```
Frameworks page (adopt framework: HIPAA, SOC2, ISO27001, etc.)
  → ComplianceFramework activated
  → FrameworkRequirements populated
  → Controls mapped to requirements
  → CrossMappings link requirements across frameworks
  → Evidence linked via FrameworkEvidence
  → Compliance scoring per framework
  → Dashboard (multi-framework compliance view)
```

### 2.10 AI Assistant Flow

```
AI Assistant page (user asks compliance question)
  → AIConversation created
  → AIMessages recorded (user + assistant)
  → AI generates policy → AIGeneratedPolicy (status: draft)
  → User reviews/approves → Published as Document
  → Policy Templates page (template library)
  → Questionnaires page (AI suggests answers from knowledge base)
  → KnowledgeBaseEntry used for automated responses
```

### 2.11 Report Generation Flow

```
Reports page (generate report)
  → AuditReport created with report_data
  → ScheduledReport (configure automated generation)
  → ReportHistory (track all generated reports)
  → Advanced Reports (custom report builder)
  → Export as PDF/CSV
  → Audit Reports (audit-ready packages)
```

### 2.12 Onboarding Flow

```
Signup → Tenant + Organization + Owner User created (status: trial)
  → Onboarding wizard (7 steps)
    1. Welcome
    2. Organization setup (org_type, state, size)
    3. Compliance framework selection
    4. Team setup (invite users)
    5. Integrations configuration
    6. Document upload
    7. Review
  → OnboardingProgress tracked per step
  → ComplianceArchetype matched based on profile
  → Controls seeded from library
  → Dashboard accessible after completion
```

### 2.13 Digital Twin / What-If Flow

```
Digital Twin page (capture baseline)
  → DigitalTwinState snapshot captured
  → TwinSimulation (what-if scenarios)
  → TwinComparison (before/after analysis)
  → TwinAlert (drift detection)
  → Dashboard (predictive compliance insights)
```

### 2.14 Regulatory Radar Flow

```
Regulatory Radar page (monitor regulatory changes)
  → RegulatorySubscription (configure monitoring)
  → RegulatoryUpdate detected from sources
  → RegulatoryAlert generated
  → ImpactAssessment created (AI-powered analysis)
  → Controls/requirements updated based on changes
  → Compliance score affected
```

### 2.15 Compliance-as-Code Flow

```
Compliance Code page (write/deploy policies as code)
  → ComplianceCodePolicy created (language: rego/yaml/python)
  → CodePolicyTemplate used as starting point
  → PolicyCodeExecution run (manual/scheduled/CI-CD)
  → CompliancePipeline orchestrates multiple policies
  → Results feed into compliance scoring
  → Auto-remediation triggered on failures
```

---

## 3. User Roles & Permissions (RBAC)

### 3.1 Role Definitions

| Role | Purpose | DB Values |
|------|---------|-----------|
| **Owner** | Business owner. Full control including billing and ownership transfer | `owner` |
| **Admin** | IT/system admin. Full control except ownership transfer | `admin` |
| **Compliance Officer** | HIPAA Compliance Officer. Full compliance access, no system settings | `compliance_officer` |
| **Privacy Officer** | HIPAA Privacy Officer. Same scope as Compliance Officer | `privacy_officer` |
| **Security Officer** | HIPAA Security Officer. Same scope as Compliance Officer | `security_officer` |
| **Auditor** | Internal/external auditor. Read-only access to all compliance data | `auditor` |
| **Analyst** | Compliance team member. View + create/edit selected entities | `analyst` |
| **Viewer** | Stakeholder. Read-only access to limited pages | `viewer` |

### 3.2 Permission System

**Architecture:**
- Permissions stored as JSON array on `TenantUser.permissions`
- Format: `module.action` (e.g., `documents.create`, `compliance.view`)
- Wildcards: `*` (global), `module.*` (module-level)
- Owner and Admin bypass all permission checks in code
- Officers are checked against their permission list (no bypass)
- Frontend: `<PermissionGate permission="documents.create">` hides UI elements
- Frontend: `usePermission(permission)` hook for programmatic checks
- Backend: `require_permission("documents.create")` FastAPI dependency

**Feature Gating (Plan-based):**
- `<FeatureGate feature="advanced_reports">` checks package tier features
- `useFeatureGate(feature)` hook returns `{ allowed, isLoading }`
- Features stored on `Package.features` (JSON array of feature slugs)
- Shows `<UpgradePrompt>` component when feature not available

### 3.3 Permission Matrix

| Module | Owner/Admin | Officers | Auditor | Analyst | Viewer |
|--------|------------|----------|---------|---------|--------|
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

### 3.4 Custom Roles

- `CustomRole` model allows tenants to define custom roles with specific permission sets
- System roles (owner, admin, compliance-officer, auditor, analyst, viewer) are seeded as `is_system=True`
- Custom roles can be created by Owner/Admin via Settings

### 3.5 Admin Users (Platform-level)

Separate from tenant users. Stored in `AdminUser` table.

| Admin Role | Purpose |
|-----------|---------|
| **super_admin** | Full platform control |
| **admin** | Platform management |
| **support** | Tenant support (view tenants, errors, usage) |
| **viewer** | Read-only platform access |

Admin authentication uses separate JWT secret (`ADMIN_SECRET_KEY`) and token type (`admin_access`).

---

## 4. Multi-Tenant Architecture

### 4.1 Tenant Creation (Signup Flow)

1. User submits signup form with: email, full_name, password, company_name
2. System creates:
   - **Tenant** (status: `trial`, 14-day trial period)
   - **Organization** (linked to tenant via `tenant_id`)
   - **TenantUser** (role: `owner`, permissions: `["*"]`)
3. JWT issued with claims: `tenant_id`, `organization_id`, `role`, `onboarding_completed`
4. Welcome email sent with onboarding URL
5. User redirected to 7-step onboarding wizard

### 4.2 Hierarchy

```
Tenant (billing/subscription entity)
  └── Organization (compliance data container, typically 1:1 with Tenant)
       └── All compliance data scoped by org_id AND tenant_id
  └── TenantUser[] (workforce members)
  └── Subscription (1:1, linked to Package)
  └── Contract[] (enterprise billing)
  └── Invoice[] (billing records)
  └── TenantAIConfig (1:1, AI provider settings)
```

### 4.3 Data Isolation

**Dual-scoping strategy:**
- Legacy entities use `org_id` for scoping (Documents, Findings, Vendors, etc.)
- All entities also have `tenant_id` for multi-tenant isolation
- `tenant_id` is backfilled from Organization's `tenant_id` via migration
- Backend: `require_org_id_for_tenant()` resolves org_id from tenant context
- Backend: `TenantContext` dependency injects tenant_id/user_id/role from JWT

**PostgreSQL Row-Level Security (RLS):**
- Enabled on high-volume tables (event_logs, usage_logs, findings, documents, etc.)
- Policy: `tenant_id = current_setting('app.current_tenant_id')`
- Set via `set_current_tenant(tid)` SQL function
- Fallback: allows access when `app.current_tenant_id` is NULL/empty (admin context)

**Context Variables (per-request):**
- `_current_tenant_id` (ContextVar)
- `_current_user_id` (ContextVar)
- `_current_user_role` (ContextVar)

### 4.4 Trial Period Handling

- Trial duration: **14 days** (set in `signup()`)
- Tenant status: `trial`
- `trial_ends_at` field tracks expiration
- Active tenants: status must be `active`, `trial`, or `pending_setup`
- Suspended/deactivated tenants get 403 Forbidden

### 4.5 Package/Plan Tiers

| Tier | Price | Max Users | Max Docs | Max Scans/mo | Max AI Queries/mo | Storage | Frameworks |
|------|-------|-----------|----------|--------------|-------------------|---------|------------|
| **Starter** | $499/mo | 5 | 100 | 50 | 100 | 1 GB | HIPAA |
| **Professional** | $999/mo | 25 | 1,000 | 200 | 1,000 | 10 GB | HIPAA, HITRUST, SOC2 |
| **Enterprise** | Custom | 999+ | 99,999 | 9,999 | 99,999 | 100 GB | HIPAA, HITRUST, SOC2, ISO27001, NIST |

**Feature flags per tier** managed via `feature_registry.py`:
- Features stored as slug array on Package
- Gated in frontend via `<FeatureGate>` component
- Synced on startup via `_sync_package_features()`

**Enterprise additions:** SSO, custom branding, API access, custom integrations, priority support

---

## 5. Notification & Activity Tracking

### 5.1 Alert System

**Source: Findings-based alerts**
- Every non-compliant Finding has `alert_status` (active|acknowledged|dismissed) and `alert_read` (boolean)
- Alerts fetched via `/alerts` endpoint (proxied from Findings with alert_status = active)
- Alert page shows filterable list by severity and type

**Source: Monitoring alerts**
- `MonitoringAlert` — device/asset threshold alerts (CPU, memory, disk)
- `VendorMonitoringAlert` — vendor health score changes, security events
- `RegulatoryAlert` — new regulations, deadlines approaching
- `TwinAlert` — compliance drift detection, score drops

**Alert actions:**
- Mark as read (`PUT /alerts/{id}/read`)
- Acknowledge (`PUT /alerts/{id}/acknowledge`)
- Dismiss (`PUT /alerts/{id}/dismiss`)
- Mark all as read (`POST /alerts/mark-all-read`)

### 5.2 In-App Notification System

**Frontend: `notification-store.ts` (Zustand)**
- Maintains up to 50 notifications in memory
- Tracks unread count
- Notification shape: `{ id, type, title, message, severity (info|warning|error|success), is_read, created_at, metadata }`
- Actions: addNotification, markAsRead, markAllAsRead, setNotifications

**No persistent notification table** — notifications are derived from:
- Findings with `alert_status = active`
- Toast notifications via `sonner` library for ephemeral UI feedback

### 5.3 Activity Tracking (Audit Trail)

**Comprehensive client-side tracking** via `activity-tracker.ts`:
- **Page views** — tracked via router integration (every route change)
- **Button/link clicks** — global `document.click` listener catches ALL interactive element clicks
- **Form submissions** — global `document.submit` listener
- **API mutations** — Axios response interceptor tracks all POST/PUT/PATCH/DELETE calls
- **Batched** — events buffered and flushed every 30 seconds or when buffer reaches 20 events
- **Non-blocking** — never fails user actions on tracking failure
- Sent to `POST /event-logs/batch` endpoint

**Backend audit trail:**
- `EventLog` — detailed per-tenant event records (action, resource_type, resource_id, user, IP, user_agent)
- `AuditLog` — legacy audit records (org-scoped)
- `UsageLog` — per-tenant usage tracking (API calls, document uploads, scans, AI queries)
- `BillingEvent` — billing-specific audit trail

**Immutability (PostgreSQL):**
- Triggers on `event_logs`, `audit_logs`, `usage_logs`, `billing_events` prevent UPDATE/DELETE
- `prevent_audit_mutation()` function raises exception on modification attempts

### 5.4 Email Notifications

**Implemented emails:**
- Welcome email on signup (with onboarding URL)
- User invite email (via `InviteToken`)
- Password reset email (via `InviteToken` with type `password_reset`)
- Assignment tokens — email links for task/training completion (`AssignmentToken`)

**Scheduled reporting:**
- `ScheduledReport` model supports automated report generation (daily|weekly|monthly|quarterly)
- Recipients stored as JSON array of email addresses
- `ReportHistory` tracks generated reports

**Regulatory subscriptions:**
- `RegulatorySubscription` allows configuring email alerts for regulatory changes
- `notify_email` and `notify_in_app` boolean flags

### 5.5 Error Reporting

- `ErrorLog` tracks per-tenant errors with tracking IDs (e.g., `ERR-A1B2C3D4`)
- User-facing error dialog allows submitting `user_description` and `reported_at`
- Frontend: `error-report-store.ts` manages error reporting UI state

---

## Appendix: All 55 Authenticated Pages

| # | Page Route | Primary Entities | Key Actions |
|---|-----------|-----------------|-------------|
| 1 | `/dashboard` | ComplianceCheck, Finding, Remediation, RiskAssessment | View scores, trends, alerts |
| 2 | `/compliance` | ComplianceCheck, Finding, Gap | View compliance status |
| 3 | `/compliance-detail` | Finding, Gap, Evidence | Detailed compliance results |
| 4 | `/scanning` | ComplianceCheck, ScanResult | Initiate/view scans |
| 5 | `/documents` | Document | Upload, manage, version documents |
| 6 | `/evidence` | Evidence | Collect, verify, manage evidence |
| 7 | `/controls` | Control, ControlTest | Manage compliance controls |
| 8 | `/remediation` | Remediation | Track remediation tasks |
| 9 | `/vendors` | Vendor | Manage vendors |
| 10 | `/vendor-risk` | VendorRiskAssessment | Vendor risk assessments |
| 11 | `/tprm` | Vendor, VendorMonitoring, VendorContract, VendorLifecycle | Full TPRM suite |
| 12 | `/incidents` | Incident | Report/manage incidents |
| 13 | `/training` | TrainingCourse, TrainingRecord, PolicyAcknowledgment | Manage training program |
| 14 | `/security-training` | SecurityCourse, SecurityEnrollment | Interactive security courses |
| 15 | `/personnel` | Employee, ComplianceTask, SystemAccess | Personnel management |
| 16 | `/employee-compliance` | EmployeeCompliance, OnboardingWorkflow | Employee compliance tracking |
| 17 | `/risk-assessment` | RiskAssessment, RiskItem | Conduct risk assessments |
| 18 | `/risk-register` | RiskRegister, RiskManagementItem | Organize risk registers |
| 19 | `/risk-management` | TreatmentPlan, RiskScoringModel | Manage risk treatments |
| 20 | `/risk-prioritization` | RiskPrioritizationScore | Risk-weighted prioritization |
| 21 | `/reports` | AuditReport | Generate reports |
| 22 | `/audit-reports` | AuditReport, ReportHistory | Audit-ready reports |
| 23 | `/advanced-reports` | ScheduledReport, ReportHistory | Custom report builder |
| 24 | `/audit-trail` | EventLog, AuditLog | View activity logs |
| 25 | `/alerts` | Finding (alert_status), MonitoringAlert | View/manage alerts |
| 26 | `/assets` | Asset, AssetVulnerability, DeviceMonitor | IT asset management |
| 27 | `/settings` | Tenant, Organization, TenantUser, SSOConfig | System settings |
| 28 | `/hipaa-roadmap` | HIPAARequirement, Finding, Gap, Vendor | HIPAA compliance roadmap |
| 29 | `/frameworks` | ComplianceFramework, FrameworkRequirement, CrossMapping | Multi-framework management |
| 30 | `/regulations` | HIPAARequirementDB | Browse HIPAA regulations |
| 31 | `/policy-templates` | PolicyTemplate, AIGeneratedPolicy | Policy template library |
| 32 | `/ai-assistant` | AIConversation, AIMessage | AI compliance assistant |
| 33 | `/ai-agent` | AIConversation | Advanced AI agent |
| 34 | `/ai-governance` | AISystem, AIRiskAssessment, AIGovernancePolicy | EU AI Act compliance |
| 35 | `/enterprise-integrations` | IntegrationConfig, IntegrationFinding | Cloud/SaaS integrations |
| 36 | `/onboarding` | OnboardingProgress, Organization | Setup wizard |
| 37 | `/questionnaires` | Questionnaire, QuestionnaireQuestion, KnowledgeBaseEntry | Security questionnaires |
| 38 | `/collaboration` | CollabTask, CollabWorkflow | Team collaboration |
| 39 | `/auto-remediation` | RemediationPlaybook, RemediationExecution, RemediationRule | Automated remediation |
| 40 | `/regulatory-radar` | RegulatoryUpdate, RegulatoryAlert, RegulatorySubscription | Regulatory monitoring |
| 41 | `/compliance-code` | ComplianceCodePolicy, CompliancePipeline | Policy-as-code |
| 42 | `/compliance-costs` | ComplianceCost, ComplianceBenefit, ComplianceBudget | ROI tracking |
| 43 | `/breach-sim` | BreachScenario, TabletopExercise, SimulationResult | Breach simulations |
| 44 | `/digital-twin` | DigitalTwinState, TwinSimulation, TwinComparison | Compliance digital twin |
| 45 | `/due-diligence` | DueDiligenceProject, DiligenceAssessment | M&A due diligence |
| 46 | `/customer-portal` | CustomerPortal, PortalDocument | Customer-facing portal |
| 47 | `/trust-center-admin` | TrustCenterConfig, TrustCenterDocument, TrustCenterFAQ | Trust center management |
| 48 | `/penalty-exposure` | PenaltyExposure, ViolationMapping | Penalty calculator |
| 49 | `/contract-intelligence` | ContractAnalysis, ContractClause, BAATemplate | BAA/contract analysis |
| 50 | `/behavior-analytics` | AccessEvent, BehaviorAnomaly, UserBaseline | Staff behavior analytics |
| 51 | `/knowledge-graph` | (Cross-entity visualization) | Knowledge graph view |
| 52 | `/insights` | RiskSnapshot, ExposureSnapshot | Analytics insights |
| 53 | `/learning-engine` | (ML models) | ML learning engine |
| 54 | `/platform-settings` | AdminUser, PlatformSetting | Platform admin panel |
| 55 | `/index` | (Redirect) | Root redirect |
