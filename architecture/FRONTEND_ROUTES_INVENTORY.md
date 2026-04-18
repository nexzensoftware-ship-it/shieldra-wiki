# Shieldra AI — Frontend Routes Inventory (Master Requirements Document)

> Generated: 2026-03-26 | Source: `apps/web/src/app/routes/`
> Total authenticated routes: 55 | Public routes: 15 | Admin routes: 7

---

## Table of Contents

1. [Core Compliance](#1-core-compliance)
2. [Documents & Evidence](#2-documents--evidence)
3. [Risk Management](#3-risk-management)
4. [Remediation & Incidents](#4-remediation--incidents)
5. [Vendor Management](#5-vendor-management)
6. [AI Features](#6-ai-features)
7. [People & Training](#7-people--training)
8. [Reports & Audit](#8-reports--audit)
9. [Settings & Admin](#9-settings--admin)
10. [Monitoring & Analytics](#10-monitoring--analytics)
11. [Public Pages](#11-public-pages)
12. [Admin Panel](#12-admin-panel)

---

## 1. Core Compliance

### 1.1 Dashboard (`/dashboard`)
- **File:** `_authenticated/dashboard.tsx` (570 lines)
- **Purpose:** Central overview of HIPAA compliance posture with role-specific views
- **Data displayed:**
  - Overall compliance score (ScoreGauge component)
  - HIPAA Roadmap progress bars (6 rules: Privacy, Security, Breach Notification, Enforcement, HITECH, Omnibus)
  - Role-specific summary cards (Security, Compliance, Privacy, Auditor, General)
  - "What To Do Next" — up to 5 incomplete roadmap items
  - Recent activity feed (last 6 items)
  - Quick stats: total documents, open findings, pending reviews, compliance gaps, training %, remediation rate, total vendors, BAA gaps, PHI incidents, managed assets
- **User actions:** Refresh data, navigate to any section via quick actions or cards, jump to roadmap items
- **API endpoints:** `useDashboardOverview()`, `useHIPAARoadmap()`
- **Tabs/sections:** None (single page, but 3 rows: Score+Roadmap+QuickActions → Role Summary → What To Do Next + Activity)
- **Dialogs/modals:** None
- **Navigation links:** `/hipaa-roadmap`, `/documents`, `/compliance`, `/training`, `/remediation`, `/incidents`, `/risk-register`, `/risk-assessment`, `/assets`, `/vendors`, `/personnel`, `/reports`, `/evidence`, `/audit-trail`
- **Role/permission requirements:** Role-adaptive greeting and cards based on user role (admin/owner, security_officer, compliance_officer, privacy_officer, auditor, viewer)
- **Current limitations:** No real-time WebSocket updates; depends on `useAuthStore` for role detection

### 1.2 Compliance Checks (`/compliance`)
- **File:** `_authenticated/compliance.tsx` (870 lines)
- **Purpose:** Run and review HIPAA compliance checks against policy documents
- **Data displayed:**
  - Quick stats: Total Checks, Completed, HIPAA Requirements count, HIPAA Engine status
  - Compliance check cards grouped by regulation (latest scan + collapsible history)
  - Score breakdown per card with category summaries (e.g., Administrative Safeguards, Technical Safeguards)
  - Findings table (expandable per check)
  - Calendar of compliance deadlines (BAA renewals, training, policy reviews, risk assessments, access reviews, breach notifications)
  - Audit Evidence Pack with completeness scoring (9 sections)
  - All Findings table (cross-check)
  - Requirements Graph (RequirementTree component)
- **User actions:** 
  - HIPAA Quick Scan (paste policy text, select org type, run analysis)
  - Search compliance checks
  - Expand check details and findings
  - View scan history per regulation
  - Filter calendar by category/status
  - Generate/regenerate Audit Evidence Pack
  - Filter All Findings by severity
- **API endpoints:** `useComplianceChecks()`, `useQuickScan()` (mutation), `useComplianceCalendar()`, `useAuditEvidencePack()`, `useComplianceSummary()`
- **Tabs:** Compliance Checks | Requirements Graph | Calendar | Audit Pack | All Findings
- **Dialogs:** Quick Scan dialog (paste document text, select org type: covered_entity/business_associate/hybrid_entity)
- **Navigation links:** `/compliance/$checkId`
- **Permissions:** `PermissionGate permission="compliance.manage"` for Quick Scan button
- **Current limitations:** Requirements Graph is a separate component (RequirementTree); Quick Scan only supports text paste (no file upload)

### 1.3 Compliance Detail (`/compliance/$checkId`)
- **File:** `_authenticated/compliance-detail.tsx` (460 lines)
- **Purpose:** Detailed view of a single compliance check with findings and gaps
- **Data displayed:**
  - Overall score, compliant count, non-compliant count, gaps count
  - Risk level indicator with color-coded border
  - Category score breakdown (per HIPAA safeguard category)
  - AI Analysis Summary
  - Individual findings with evidence text, location, recommendation, CFR reference
  - Gaps with gap type, impact, suggested action
- **User actions:**
  - Filter findings by status (compliant/partial/non_compliant) and severity (critical/high/medium/low)
  - Update finding status (open/in_progress/resolved/accepted/compliant/non_compliant/partial)
  - Create remediation from non-compliant/partial findings
  - Navigate back to compliance list
- **API endpoints:** `useComplianceCheck(checkId)`, `useFindings(checkId)`, `useGaps(checkId)`, `useScoreBreakdown(checkId)`, `useCreateRemediationFromFinding()`, `updateFinding()`
- **Tabs:** Findings | Gaps
- **Navigation:** Back link to `/compliance`
- **Permissions:** None specific (inherits authenticated)

### 1.4 HIPAA Roadmap (`/hipaa-roadmap`)
- **File:** `_authenticated/hipaa-roadmap.tsx` (992 lines)
- **Purpose:** Step-by-step interactive guide to achieving full HIPAA compliance across all 6 rules
- **Data displayed:**
  - Overall score gauge with completed/total count
  - 6 Rule cards: Privacy Rule, Security Rule, Breach Notification, Enforcement Rule, HITECH Act, Omnibus Rule
  - Each rule shows progress bar, items with status (complete/partial/incomplete)
  - Security Rule has nested subsections (Administrative, Technical, Physical safeguards)
  - Enforcement Rule shows penalty tiers table (4 tiers with min/max penalties)
  - HITECH Act shows info text with key points
  - CFR references on each item
  - Auto-detected completion badges
- **User actions:**
  - Expand/collapse rule cards and subsections
  - Generate AI policy drafts for 14 policy types (NPP, Minimum Necessary, Patient Access, Incident Response, Access Control, Facility Access, Workstation Security, Media Disposal, Breach Notification, Patient Rights x4, BAA Policy)
  - Edit generated document sections inline before adopting
  - Download generated document as .docx
  - Adopt (save) generated policy to documents
  - Acknowledge info-only rules (Enforcement, HITECH)
  - Confirm "no subcontractors" for applicable items
  - Navigate to relevant pages for each action item
- **API endpoints:** `useHIPAARoadmap()`, `generateRoadmapDocument()`, `saveGeneratedDocument()`, `confirmNoSubcontractors()`, `acknowledgeRule()`
- **Dialogs:** Generate Document Dialog (multi-step: confirm → generating → result/edit → saving → saved)
- **Navigation:** Each roadmap item has a link to the relevant page (e.g., `/documents`, `/training`, `/vendors`)
- **Permissions:** None specific (actions available to all authenticated users)
- **Current limitations:** Document generation takes 10-30 seconds; edit mode is section-based textarea only

### 1.5 Compliance-as-Code Engine (`/compliance-code`)
- **File:** `_authenticated/compliance-code.tsx` (1004 lines)
- **Purpose:** Translate compliance requirements into executable, version-controlled policy rules
- **Data displayed:**
  - Dashboard stats: Total Policies, Deployed, Avg Pass Rate, Active Pipelines
  - Policy table with name, language, status, severity, version, pass rate, last run
  - Template library cards with code preview and usage count
  - Execution history with pass/fail details and expandable results
  - Pipeline configurations with schedules and policy assignments
  - Metrics: Pass rate trend (30-day chart), compliance score trend, coverage heatmap by category, drift alerts, top failing policies
- **User actions:**
  - Create policy (name, language: Rego/Python/YAML/JSON, severity, requirement ref, source code)
  - Compile, Execute, Deploy, Delete policies
  - Filter policies by language, status, search
  - Instantiate policy from templates
  - Create pipeline (name, schedule, environment, policy selection, notification channels)
  - Run pipelines manually
  - View execution details (pass/fail per check/resource)
- **API endpoints:** `useCodeDashboard()`, `usePolicies()`, `useCreatePolicy()`, `useCompilePolicy()`, `useExecutePolicy()`, `useDeployPolicy()`, `useDeletePolicy()`, `useExecutions()`, `useTemplates()`, `useInstantiateTemplate()`, `usePipelines()`, `useCreatePipeline()`, `useRunPipeline()`, `useCodeMetrics()`
- **Tabs:** Policy Studio | Templates | Executions | Pipelines | Metrics
- **Dialogs:** Create Policy dialog, Policy Detail dialog, Delete confirmation, Create Pipeline dialog
- **Permissions:** `FeatureGate feature="compliance_code"`, `PermissionGate permission="compliance.manage"` on write operations
- **Current limitations:** No inline code editor (uses textarea); no git version control integration

### 1.6 Cost & ROI Dashboard (`/compliance-costs`)
- **File:** `_authenticated/compliance-costs.tsx` (1698 lines)
- **Purpose:** Track compliance program costs, measure ROI, and justify budget to executives
- **Data displayed:**
  - ROI Overview: Total ROI %, net ROI, total costs, total benefits, budget utilization, recurring/one-time costs, payback period
  - Monthly trends (costs vs benefits area chart), category pie chart, 12-month ROI projection
  - Cost table with category, description, amount, department, vendor, recurring flag
  - Benefits tracker with estimated vs actual values, confidence levels, realization rate
  - Budget planning with allocated vs spent vs forecasted, utilization bars
  - Executive report: headline metrics, top 5 ROI drivers, top 5 cost items, industry benchmark comparison (percentile bar chart), cost optimization recommendations, confidence-weighted ROI analysis
- **User actions:**
  - Add/edit/delete cost entries (10 categories: personnel, tools, training, audit, consulting, remediation, insurance, certification, legal, infrastructure)
  - Add/edit/delete benefit entries (8 categories: breach prevention, fine avoidance, efficiency gain, etc.)
  - Add/edit/delete budget allocations by department
  - Sort costs by amount/date/category
  - Print executive report
- **API endpoints:** `useCostDashboard()`, `useCosts()`, `useCreateCost()`, `useUpdateCost()`, `useDeleteCost()`, `useBenefits()`, `useCreateBenefit()`, `useUpdateBenefit()`, `useDeleteBenefit()`, `useBudgets()`, `useCreateBudget()`, `useUpdateBudget()`, `useDeleteBudget()`, `useROIAnalysis()`, `useBenchmarks()`, `useCostTrends()`, `useExecutiveSummary()`, `useForecast()`, `useDepartmentBreakdown()`, `useCategoryAnalysis()`
- **Tabs:** ROI Overview | Cost Management | Benefits Tracker | Budget Planning | Executive Report
- **Dialogs:** Add/Edit Cost, Add/Edit Benefit, Add/Edit Budget, Delete confirmations
- **Permissions:** `FeatureGate feature="compliance_costs"`, `PermissionGate permission="compliance.manage"` on write operations
- **Current limitations:** Benchmarks are industry comparison (may use mock/estimated data initially)

---

## 2. Documents & Evidence

### 2.1 Documents (`/documents`)
- **File:** `_authenticated/documents.tsx` (905 lines)
- **Purpose:** Upload, manage, and analyze compliance documents with HIPAA scanning
- **Data displayed:**
  - Required documents checklist (14 types: HIPAA Policies, SRA, BAAs, Training Records, Incident Response, Access Controls, Encryption, DR/BCP, Workforce Sanction, Data Classification, Pen Test, Vendor Assessments, Audit Logs, Other)
  - Document table with title, type, status, created date
  - Document details panel (full metadata, version history, scan results)
  - Scan result panel showing compliance findings
- **User actions:**
  - Upload documents (drag & drop or file picker, with document type selection)
  - Upload new version of existing document (with change notes)
  - View document details
  - Download document
  - Delete document
  - Run HIPAA compliance scan on individual documents
  - Filter by document type
  - Search documents
  - Upload directly from required documents checklist
  - View version history
- **API endpoints:** `useDocuments()`, `useCreateDocument()`, `useDeleteDocument()`, `useRequiredDocuments()`, `analyzeDocument()`, `getDocument()`, `uploadNewVersion()`, `getVersionHistory()`
- **Tabs/sections:** Required Documents checklist + Document table
- **Dialogs:** Upload Document dialog, Document Details dialog, Version Upload dialog, Scan Result display, Delete confirmation
- **Permissions:** `PermissionGate permission="documents.create"` for upload
- **Current limitations:** File upload is multipart form-data; version tracking is basic (notes + file)

### 2.2 Evidence (`/evidence`)
- **File:** `_authenticated/evidence.tsx` (1003 lines)
- **Purpose:** Manage compliance evidence with automated collection, scheduling, and gap analysis
- **Data displayed:**
  - Overview stats: Total evidence items, freshness indicators (Fresh/Aging/Stale), auto-collected count
  - Controls list with evidence status per control
  - Evidence items per control with type (document/screenshot/link), freshness, collection date
  - Evidence gaps analysis (missing evidence per control)
  - Auto-collection schedule management
  - Schedule run history
- **User actions:**
  - Add evidence manually (title, description, type, control mapping, file upload or URL)
  - Auto-collect evidence from integrations (AWS, Azure, Okta, Google Workspace)
  - Create/edit/delete collection schedules
  - Trigger manual schedule runs
  - Filter by control
  - Search evidence items
  - Toggle auto-collection per schedule
- **API endpoints:** `useEvidence()`, `useControls()`, `useCreateEvidence()`, `useAutoCollectEvidence()`, `useEvidenceGaps()`, `useScheduleStatus()`, `useSchedules()`, `useCreateSchedule()`, `useUpdateSchedule()`, `useDeleteSchedule()`, `useTriggerRun()`
- **Tabs:** Overview | Gaps | Schedules
- **Dialogs:** Add Evidence dialog (manual or linked)
- **Permissions:** `PermissionGate permission="evidence.manage"` and `evidence.create`
- **Current limitations:** Auto-collection depends on enterprise integrations being configured

### 2.3 Policy Templates (`/policy-templates`)
- **File:** `_authenticated/policy-templates.tsx` (821 lines)
- **Purpose:** Browse and adopt pre-built HIPAA policy templates
- **Data displayed:**
  - Template cards organized by category (Privacy, Security, Breach Notification, Administrative, Technical, Organizational)
  - Each template: name, description, sections preview, required flag, complexity, CFR references
  - Adopted policies list
  - Template detail preview with full section content
- **User actions:**
  - Browse templates by category
  - Search templates
  - Toggle grid/list view
  - Preview template content
  - Adopt individual template (saves as document)
  - Adopt all required templates at once
  - View adopted policy status
- **API endpoints:** `usePolicyTemplates()`, `usePolicyTemplate()`, `useAdoptPolicyTemplate()`, `useAdoptAllRequired()`, `useAdoptedPolicies()`
- **Tabs:** Category-based tab switcher (All, Privacy, Security, etc.)
- **Dialogs:** Template detail/preview dialog
- **Permissions:** `FeatureGate feature="policy_templates"`, `PermissionGate permission="compliance.create"`
- **Current limitations:** Templates are read-only previews; customization happens after adoption in Documents

---

## 3. Risk Management

### 3.1 Risk Assessment (`/risk-assessment`)
- **File:** `_authenticated/risk-assessment.tsx` (1120 lines)
- **Purpose:** Create and manage HIPAA Security Risk Assessments (SRA)
- **Data displayed:**
  - Assessment list with type, status, risk count, created date
  - Assessment progress and completion metrics
  - Guided setup questionnaire for profile-based assessment creation
- **User actions:**
  - Create new assessment (guided questionnaire or manual)
  - View assessment details
  - Filter assessments
- **API endpoints:** Various risk assessment hooks
- **Tabs:** Assessments | (detail view)
- **Dialogs:** Create Assessment dialog, Guided Setup/Questionnaire dialog
- **Permissions:** `FeatureGate feature="risk_assessment"`, `PermissionGate permission="risk.create"`

### 3.2 Risk Register (`/risk-register`)
- **File:** `_authenticated/risk-register.tsx` (1024 lines)
- **Purpose:** Maintain a centralized register of identified risks with scoring and treatment tracking
- **Data displayed:**
  - Risk items with severity (critical/high/medium/low), likelihood, impact, score
  - Risk details with treatment plans
  - Risk matrix/heatmap visualization
- **User actions:**
  - Create new risk entry
  - View/edit risk details
  - Delete risks (with confirmation)
  - Filter and search risks
- **API endpoints:** Risk register CRUD hooks
- **Tabs:** Register | (visualization tab)
- **Dialogs:** Create Risk dialog, Risk Details dialog, Delete confirmation
- **Permissions:** `FeatureGate feature="risk_register"`, `PermissionGate permission="risk.create"`

### 3.3 Risk Management (`/risk-management`)
- **File:** `_authenticated/risk-management.tsx` (1113 lines)
- **Purpose:** Manage risk treatments and view risk analytics
- **Data displayed:**
  - Treatment plans with status, owner, timeline
  - Risk analytics: trends, distribution charts, effectiveness metrics
- **User actions:**
  - Create/manage treatment plans
  - View analytics dashboards
- **API endpoints:** Risk management hooks
- **Tabs:** Treatments | Analytics
- **Dialogs:** Treatment creation/edit dialogs
- **Permissions:** `FeatureGate feature="risk_management"`, `PermissionGate permission="risk.create"`

### 3.4 Risk Prioritization (`/risk-prioritization`)
- **File:** `_authenticated/risk-prioritization.tsx` (863 lines)
- **Purpose:** AI-driven risk prioritization with gap ranking and breach analysis
- **Data displayed:**
  - Ranked gaps table with priority scores
  - Risk distribution charts
  - Breach probability analysis
  - Historical trends
- **User actions:**
  - View prioritized gaps
  - Analyze breach scenarios
  - Filter and sort by risk factors
- **API endpoints:** Risk prioritization hooks
- **Tabs:** Overview | Charts | Breaches
- **Permissions:** None specific (inherits authenticated)

---

## 4. Remediation & Incidents

### 4.1 Remediation (`/remediation`)
- **File:** `_authenticated/remediation.tsx` (435 lines)
- **Purpose:** Track and manage remediation issues arising from compliance findings
- **Data displayed:**
  - Remediation issues list with title, status, priority, assignee, due date
  - Issue details with description and progress
- **User actions:**
  - Create remediation issue (title, description, priority, assignee, due date)
  - Update issue status
  - Filter and search issues
- **API endpoints:** `useRemediationIssues()`, `useCreateRemediationIssue()`, `useUpdateRemediationIssue()`
- **Dialogs:** Create Remediation Issue dialog
- **Permissions:** `PermissionGate permission="remediation.create"`

### 4.2 Auto-Remediation (`/auto-remediation`)
- **File:** `_authenticated/auto-remediation.tsx` (1995 lines)
- **Purpose:** Automated compliance remediation with playbooks, rules engine, and execution tracking
- **Data displayed:**
  - Command Center dashboard with active remediation stats
  - Playbook library with descriptions, trigger conditions
  - Execution history with success/failure details
  - Rules engine configuration
  - Metrics & Savings: time saved, issues auto-resolved, cost savings
- **User actions:**
  - View and manage playbooks
  - Configure automation rules
  - Review execution history
  - View savings metrics
- **API endpoints:** Auto-remediation hooks
- **Tabs:** Command Center | Playbooks | Execution History | Rules Engine | Metrics & Savings
- **Dialogs:** Various configuration dialogs
- **Permissions:** `FeatureGate feature="auto_remediation"`, `PermissionGate permission="compliance.manage"`

### 4.3 Alerts (`/alerts`)
- **File:** `_authenticated/alerts.tsx` (276 lines)
- **Purpose:** View and manage compliance and security alerts with notification preferences
- **Data displayed:**
  - Alert list with type, severity, timestamp, read status
  - Notification preferences configuration
- **User actions:**
  - View alerts
  - Mark individual alert as read
  - Mark all alerts as read
  - Configure notification preferences
- **API endpoints:** `useAlerts()`, `useMarkAlertRead()`, `useMarkAllAlertsRead()`
- **Tabs:** Alerts | Preferences
- **Permissions:** `PermissionGate permission="monitoring.edit"` for preference changes

### 4.4 Incidents (`/incidents`)
- **File:** `_authenticated/incidents.tsx` (1010 lines)
- **Purpose:** Report, track, and manage security incidents with breach assessment
- **Data displayed:**
  - Incident summary stats (open, resolved, PHI-involved, average resolution time)
  - Incident list with title, severity, type, status, PHI involvement flag
  - Incident details with timeline, assessment, breach determination
  - Breach assessment results
- **User actions:**
  - Report new security incident (title, description, type, severity, PHI flag)
  - Update incident status and details
  - Run breach assessment on incident
  - Filter incidents by status/severity/type
- **API endpoints:** `useIncidents()`, `useCreateIncident()`, `useUpdateIncident()`, `useBreachAssessment()`, `useIncidentSummary()`
- **Tabs:** List | (detail views)
- **Dialogs:** Report Incident dialog
- **Permissions:** `FeatureGate feature="incidents"`, `PermissionGate permission="incidents.create"`

### 4.5 Breach Simulation (`/breach-sim`)
- **File:** `_authenticated/breach-sim.tsx` (1623 lines)
- **Purpose:** Run tabletop breach simulation exercises with scenario management
- **Data displayed:**
  - Command center with simulation overview
  - Scenario library with descriptions, complexity levels
  - Simulation results and response scoring
  - Schedule management for recurring simulations
- **User actions:**
  - Browse and select simulation scenarios
  - Schedule simulations
  - Run response exercises
  - View detailed scenario outcomes
- **API endpoints:** Breach simulation hooks
- **Tabs:** Command Center + multiple views
- **Dialogs:** Schedule dialog, Response dialog, Scenario Detail dialog
- **Permissions:** `FeatureGate feature="breach_sim"`, `PermissionGate permission="compliance.manage"`

---

## 5. Vendor Management

### 5.1 Vendors (`/vendors`)
- **File:** `_authenticated/vendors.tsx` (1141 lines)
- **Purpose:** Manage vendor inventory with BAA tracking and risk categorization
- **Data displayed:**
  - Vendor list with name, type, risk level, BAA status, PHI access flag
  - Vendor details with contacts, services, compliance status
- **User actions:**
  - Add new vendor
  - Edit vendor details
  - Delete vendor (with confirmation)
  - Filter by risk level, BAA status
  - Search vendors
- **API endpoints:** Vendor CRUD hooks
- **Tabs:** List | (detail views)
- **Dialogs:** Create Vendor dialog, Edit Vendor dialog, Delete confirmation
- **Permissions:** `FeatureGate feature="vendors"`, `PermissionGate permission="vendors.manage"`

### 5.2 Vendor Risk (`/vendor-risk`)
- **File:** `_authenticated/vendor-risk.tsx` (1511 lines)
- **Purpose:** Assess and monitor vendor risk with scoring and continuous monitoring
- **Data displayed:**
  - Vendor risk dashboard with aggregate scores
  - Individual vendor risk assessments
  - Risk trend charts
  - Compliance status per vendor
- **User actions:**
  - Create/manage risk assessments
  - View risk details per vendor
  - Filter by risk level
- **API endpoints:** Vendor risk hooks
- **Tabs:** Dashboard | (detail views)
- **Dialogs:** Risk assessment dialogs
- **Permissions:** `FeatureGate feature="vendor_risk"`, `PermissionGate permission="vendors.manage"`

### 5.3 Third-Party Risk Management (TPRM) (`/tprm`)
- **File:** `_authenticated/tprm.tsx` (1157 lines)
- **Purpose:** Comprehensive third-party risk management with lifecycle reviews and contract tracking
- **Data displayed:**
  - TPRM review lifecycle status
  - Contract details and expiration tracking
  - Risk scores and compliance metrics
- **User actions:**
  - Manage vendor reviews
  - Track contract details
  - View risk assessments
- **API endpoints:** TPRM hooks
- **Tabs:** Reviews | Contracts | Risk Scores | (4th tab)
- **Dialogs:** Contract dialog, review dialogs
- **Permissions:** `FeatureGate feature="tprm"`, `PermissionGate permission="vendors.manage"`

### 5.4 Due Diligence (`/due-diligence`)
- **File:** `_authenticated/due-diligence.tsx` (1546 lines)
- **Purpose:** Conduct vendor due diligence assessments before onboarding
- **Data displayed:**
  - Due diligence assessment list
  - Assessment details and findings
  - Vendor questionnaire responses
- **User actions:**
  - Create new due diligence assessment
  - Delete assessment (with confirmation)
  - View assessment results
- **API endpoints:** Due diligence hooks
- **Dialogs:** Create dialog, Delete confirmation
- **Permissions:** `FeatureGate feature="due_diligence"`, `PermissionGate permission="vendors.manage"`

### 5.5 Contract Intelligence (`/contract-intelligence`)
- **File:** `_authenticated/contract-intelligence.tsx` (942 lines)
- **Purpose:** AI-powered contract analysis for compliance requirements extraction
- **Data displayed:**
  - Contract requirements list
  - AI analysis results
  - Contract templates
- **User actions:**
  - Analyze contracts
  - View extracted requirements
  - Manage contract templates
- **API endpoints:** Contract intelligence hooks
- **Tabs:** Requirements | Analyze | Templates
- **Permissions:** `PermissionGate permission="documents.manage"`

### 5.6 Questionnaires (`/questionnaires`)
- **File:** `_authenticated/questionnaires.tsx` (1678 lines)
- **Purpose:** Create and manage security/compliance questionnaires with AI-assisted responses
- **Data displayed:**
  - Questionnaire list with status, completion percentage
  - Knowledge base for AI-powered auto-fill
  - AI insights and response suggestions
- **User actions:**
  - Create/manage questionnaires
  - Fill out questionnaire responses
  - Use AI to auto-suggest answers
  - Manage knowledge base entries
  - View AI insights
- **API endpoints:** Questionnaire hooks
- **Tabs:** Questionnaires | Knowledge Base | AI Insights
- **Dialogs:** Various creation/edit dialogs
- **Permissions:** `FeatureGate feature="questionnaires"`, `PermissionGate permission="vendors.manage"`

---

## 6. AI Features

### 6.1 AI Agent (`/ai-agent`)
- **File:** `_authenticated/ai-agent.tsx` (1589 lines)
- **Purpose:** AI-powered compliance agent with action-oriented capabilities
- **Data displayed:**
  - Agent dashboard with available actions
  - Chat interface for AI interaction
  - Action execution results
- **User actions:**
  - Chat with AI agent
  - Execute compliance actions through AI
  - View action results
  - Manage AI agent configuration
- **API endpoints:** AI agent hooks
- **Tabs:** Multiple via Tabs component
- **Dialogs:** Action execution dialogs
- **Permissions:** `FeatureGate feature="ai_agent"`, `PermissionGate permission="ai.manage"` for config, `permission="ai.chat"` for chat

### 6.2 AI Assistant (`/ai-assistant`)
- **File:** `_authenticated/ai-assistant.tsx` (669 lines)
- **Purpose:** Conversational AI assistant for compliance questions and guidance
- **Data displayed:**
  - Chat message history
  - AI response with formatting
- **User actions:**
  - Send messages to AI
  - View AI responses
  - Clear chat history
- **API endpoints:** AI assistant hooks
- **Permissions:** `FeatureGate feature="ai_assistant"`, `PermissionGate permission="ai.chat"`

### 6.3 AI Governance (`/ai-governance`)
- **File:** `_authenticated/ai-governance.tsx` (1545 lines)
- **Purpose:** Manage AI model registry, risk assessments, and governance policies
- **Data displayed:**
  - AI model registry with names, types, risk levels
  - AI risk assessments
  - Governance policies
  - Audit logs for AI usage
  - Impact assessments
- **User actions:**
  - Register AI models
  - Create risk assessments for AI models
  - Define governance policies
  - Review audit logs
  - Create impact assessments
  - Delete entries (with confirmation)
- **API endpoints:** AI governance hooks
- **Tabs:** Registry | Risk | Policies | Audit | Impact (5 tabs)
- **Dialogs:** Various CRUD dialogs, delete confirmations
- **Permissions:** `FeatureGate feature="ai_governance"`, `PermissionGate permission="ai.manage"`

### 6.4 Knowledge Graph (`/knowledge-graph`)
- **File:** `_authenticated/knowledge-graph.tsx` (826 lines)
- **Purpose:** Interactive visualization of compliance knowledge relationships
- **Data displayed:**
  - Graph explorer with nodes (requirements, controls, documents, risks) and links
  - Coverage analysis showing mapped vs unmapped items
  - Statistics on graph composition
- **User actions:**
  - Explore graph interactively
  - Filter by node type
  - View coverage metrics
  - View statistics
- **API endpoints:** Knowledge graph hooks
- **Tabs:** Graph Explorer | Coverage | Statistics
- **Permissions:** None specific (inherits authenticated)

### 6.5 Learning Engine (`/learning-engine`)
- **File:** `_authenticated/learning-engine.tsx` (1013 lines)
- **Purpose:** Monitor and improve AI model accuracy through feedback loops
- **Data displayed:**
  - Overview: accuracy metrics, model performance stats
  - Corrections: user-submitted corrections to AI outputs
  - Accuracy trends over time
  - Detected patterns
  - Flywheel metrics (how user feedback improves the system)
- **User actions:**
  - Submit corrections to AI outputs
  - View accuracy trends
  - Review detected patterns
  - Monitor flywheel effectiveness
- **API endpoints:** Learning engine hooks
- **Tabs:** Overview | Corrections | Accuracy | Patterns | Flywheel
- **Dialogs:** Submit correction dialog
- **Permissions:** `PermissionGate permission="ai.manage"` for corrections

### 6.6 Digital Twin (`/digital-twin`)
- **File:** `_authenticated/digital-twin.tsx` (1071 lines)
- **Purpose:** Compliance digital twin for simulation and predictive analysis
- **Data displayed:**
  - Twin dashboard with current compliance state replica
  - Simulation results (what-if scenarios)
  - State history timeline
  - Drift alerts (divergence between twin and actual state)
  - Predictions for future compliance posture
- **User actions:**
  - Run simulations
  - View state history
  - Monitor drift alerts
  - Review predictions
- **API endpoints:** Digital twin hooks
- **Tabs:** Twin Dashboard | Simulations | State History | Alerts & Drift | Predictions
- **Dialogs:** Simulation configuration dialogs
- **Permissions:** `FeatureGate feature="digital_twin"`, `PermissionGate permission="compliance.manage"`

---

## 7. People & Training

### 7.1 Personnel (`/personnel`)
- **File:** `_authenticated/personnel.tsx` (1782 lines)
- **Purpose:** Manage workforce directory with HIPAA roles, access reviews, and compliance tracking
- **Data displayed:**
  - Personnel directory table
  - Access review status
  - Compliance training status per employee
  - Role assignments
- **User actions:**
  - Add/edit/delete personnel records
  - Assign HIPAA roles
  - Conduct access reviews
  - Track training compliance
  - Search and filter personnel
- **API endpoints:** Personnel CRUD hooks
- **Tabs:** Directory | Access Reviews | (3rd tab)
- **Dialogs:** Add/Edit personnel dialogs, Delete confirmation
- **Permissions:** `FeatureGate feature="personnel"`, `PermissionGate permission="personnel.create"`

### 7.2 Employee Compliance (`/employee-compliance`)
- **File:** `_authenticated/employee-compliance.tsx` (642 lines)
- **Purpose:** Track individual employee compliance status and assignments
- **Data displayed:**
  - Employee list with compliance status (compliant/non-compliant/pending)
  - Per-employee compliance details
- **User actions:**
  - Add new employee
  - Filter by compliance status
  - View individual compliance details
- **API endpoints:** Employee compliance hooks
- **Tabs:** All | (filtered views by status)
- **Dialogs:** Add New Employee dialog
- **Permissions:** `FeatureGate feature="employee_compliance"`, `PermissionGate permission="personnel.create"`

### 7.3 Training (`/training`)
- **File:** `_authenticated/training.tsx` (801 lines)
- **Purpose:** Manage HIPAA training programs, courses, and completion records
- **Data displayed:**
  - Training records with employee, course, completion date, score
  - Course library with descriptions, duration, required flag
  - Compliance report showing organization-wide training metrics
- **User actions:**
  - Assign training to employees
  - Create new courses
  - View training records
  - Filter by completion status
  - Generate compliance reports
- **API endpoints:** Training hooks
- **Tabs:** Training Records | Courses | Compliance Report
- **Dialogs:** Assign Training dialog, Create Course dialog
- **Permissions:** `PermissionGate permission="training.manage"` (implied from structure)

### 7.4 Security Training (`/security-training`)
- **File:** `_authenticated/security-training.tsx` (1173 lines)
- **Purpose:** Interactive security awareness training with courses and admin management
- **Data displayed:**
  - Dashboard: personal progress, completion rate, upcoming deadlines
  - Course catalog with modules, difficulty, duration
  - Admin view: organization-wide enrollment and completion stats
- **User actions:**
  - View and take courses
  - Track personal progress
  - Admin: manage course assignments and view analytics
- **API endpoints:** Security training hooks
- **Tabs:** Dashboard | Courses | Admin View (admin-only tab)
- **Permissions:** `FeatureGate feature="security_training"`, admin tab conditionally shown

### 7.5 Collaboration (`/collaboration`)
- **File:** `_authenticated/collaboration.tsx` (802 lines)
- **Purpose:** Team collaboration hub with task board, activity feed, and workflow management
- **Data displayed:**
  - Kanban-style task board
  - Personal task list
  - Activity feed
  - Workflow templates
  - Team metrics
- **User actions:**
  - Create/manage tasks
  - View task board
  - Track activity
  - Configure workflows
  - View team metrics
- **API endpoints:** Collaboration hooks
- **Tabs:** Board | My Tasks | Activity | Workflows | Metrics
- **Dialogs:** Task creation/edit dialogs
- **Permissions:** `FeatureGate feature="collaboration"`, `PermissionGate permission="collaboration.manage"` (implied)

---

## 8. Reports & Audit

### 8.1 Reports (`/reports`)
- **File:** `_authenticated/reports.tsx` (444 lines)
- **Purpose:** Generate and view compliance reports with trend data
- **Data displayed:**
  - Report list with title, type, generated date, format
  - Dashboard overview data (overall score, trends)
  - Trend charts
- **User actions:**
  - Generate new report (select type: executive_summary, compliance_detail, risk_assessment, gap_analysis, training_status)
  - View/download existing reports
  - View trend data
- **API endpoints:** `useReports()`, `useGenerateReport()`, `useDashboardTrends()`, `useDashboardOverview()`
- **Tabs:** Reports | (trends)
- **Dialogs:** Generate Report dialog (select type, format)
- **Permissions:** `PermissionGate permission="reports.create"`

### 8.2 Advanced Reports (`/advanced-reports`)
- **File:** `_authenticated/advanced-reports.tsx` (1054 lines)
- **Purpose:** Custom report builder with scheduling capabilities
- **Data displayed:**
  - Report builder interface
  - Scheduled reports list with frequency, recipients, status
- **User actions:**
  - Build custom reports
  - Schedule recurring reports (frequency, recipients, format)
  - Edit/delete scheduled reports
  - Run scheduled reports manually
- **API endpoints:** Advanced reports hooks
- **Tabs:** Report Builder | Scheduled Reports
- **Dialogs:** Create/Edit Scheduled Report dialog
- **Permissions:** `FeatureGate feature="advanced_reports"` (implied), `PermissionGate permission="reports.create"`, `reports.edit`, `reports.delete`

### 8.3 Audit Reports (`/audit-reports`)
- **File:** `_authenticated/audit-reports.tsx` (1239 lines)
- **Purpose:** Generate audit-ready reports from templates with professional formatting
- **Data displayed:**
  - Report template library (pre-built audit report formats)
  - Generated reports list with status, date, template used
- **User actions:**
  - Generate report from template
  - View/download generated reports
  - Delete generated reports
- **API endpoints:** Audit report hooks
- **Tabs:** Report Templates | Generated Reports
- **Dialogs:** Report generation dialogs
- **Permissions:** `FeatureGate feature="audit_reports"`, `PermissionGate permission="reports.create"`, `reports.delete`

### 8.4 Audit Trail (`/audit-trail`)
- **File:** `_authenticated/audit-trail.tsx` (301 lines)
- **Purpose:** View tamper-proof audit log of all system and user activity
- **Data displayed:**
  - Audit log entries with timestamp, user, action, resource, IP address
  - Filterable/searchable log table
- **User actions:**
  - Search audit logs
  - Filter by date range, user, action type
  - View log entry details
- **API endpoints:** `useAuditLogs()`
- **Permissions:** None specific (inherits authenticated)

---

## 9. Settings & Admin

### 9.1 Settings (`/settings`)
- **File:** `_authenticated/settings.tsx` (1780 lines)
- **Purpose:** Organization settings, HIPAA configuration, role management, notifications, and team management
- **Data displayed:**
  - Organization profile (name, type, industry, address)
  - HIPAA-specific settings (covered entity type, designated officers, BAA template)
  - Role management with permissions matrix
  - Notification preferences
  - Team member list with roles and status
  - Invite management
- **User actions:**
  - Edit organization details
  - Configure HIPAA settings
  - Manage roles and permissions
  - Set notification preferences
  - Invite team members
  - Deactivate team members
- **API endpoints:** Settings hooks
- **Tabs:** Organization | HIPAA | Roles | Notifications | Team | (additional tabs)
- **Dialogs:** Invite dialog, Deactivate confirmation, Role edit dialogs
- **Permissions:** `PermissionGate permission="settings.manage"` (implied from context)

### 9.2 Platform Settings (`/platform-settings`)
- **File:** `_authenticated/platform-settings.tsx` (1758 lines)
- **Purpose:** Advanced platform configuration including SSO, SCIM, and custom role management
- **Data displayed:**
  - SSO configuration (SAML 2.0, OpenID Connect settings)
  - SCIM provisioning setup
  - Custom roles with granular permission matrix
  - API key management
  - Webhook configuration
- **User actions:**
  - Configure SSO providers
  - Enable/configure SCIM
  - Create/edit/delete custom roles with fine-grained permissions
  - Manage API keys
  - Configure webhooks
- **API endpoints:** Platform settings hooks
- **Tabs:** SSO | SCIM | Roles | (additional tabs)
- **Dialogs:** Create/Edit Role dialogs, SSO configuration dialogs
- **Permissions:** `FeatureGate feature="platform_settings"` (implied), `PermissionGate permission="settings.manage"`, `settings.edit`

### 9.3 Onboarding (`/onboarding`)
- **File:** `_authenticated/onboarding.tsx` (1488 lines)
- **Purpose:** Guided onboarding wizard for new organizations
- **Data displayed:**
  - Multi-step wizard with progress indicator
  - Organization setup form
  - HIPAA configuration
  - Team invite
  - Initial document upload
  - First compliance scan setup
- **User actions:**
  - Complete step-by-step onboarding
  - Skip optional steps
  - Navigate between steps
- **API endpoints:** Onboarding-specific hooks
- **Permissions:** None (available to all new users)

### 9.4 Enterprise Integrations (`/enterprise-integrations`)
- **File:** `_authenticated/enterprise-integrations.tsx` (2141 lines)
- **Purpose:** Connect and manage enterprise tool integrations for automated compliance
- **Data displayed:**
  - Integration catalog (available integrations with descriptions)
  - Connected integrations with status and sync details
  - Integration findings (compliance issues detected through integrations)
- **User actions:**
  - Browse integration catalog
  - Connect new integrations (with configuration)
  - View connected integration details
  - Review integration findings
  - Disconnect integrations
- **API endpoints:** Enterprise integration hooks
- **Tabs:** Integration Catalog | Connected | Findings
- **Dialogs:** Connect Integration dialog, Integration Detail dialog
- **Permissions:** `FeatureGate feature="enterprise_integrations"`, `PermissionGate permission="settings.manage"` (implied)

### 9.5 Customer Portal (`/customer-portal`)
- **File:** `_authenticated/customer-portal.tsx` (869 lines)
- **Purpose:** Manage customer-facing compliance portal for sharing compliance status
- **Data displayed:**
  - Portal management settings (branding, configuration)
  - Visitor analytics
  - Shared documents
  - Customer inquiries
  - Analytics dashboard
- **User actions:**
  - Configure portal settings and branding
  - Manage shared documents
  - Respond to inquiries
  - View visitor analytics
- **API endpoints:** Customer portal hooks
- **Tabs:** Portal Management | Visitors | Documents | Inquiries | Analytics
- **Dialogs:** Configuration dialogs
- **Permissions:** `FeatureGate feature="customer_portal"`, `PermissionGate permission="settings.manage"`

### 9.6 Trust Center Admin (`/trust-center-admin`)
- **File:** `_authenticated/trust-center-admin.tsx` (1398 lines)
- **Purpose:** Admin panel for managing the public-facing Trust Center page
- **Data displayed:**
  - Trust Center overview with live status
  - Configuration settings (branding, colors, hero text, enabled sections)
  - Document management for trust center
  - FAQ management
  - Access request handling
  - Analytics (page views, document downloads)
- **User actions:**
  - Configure trust center appearance
  - Manage published documents
  - Create/edit/delete FAQs
  - Approve/deny access requests
  - View analytics
- **API endpoints:** Trust center admin hooks
- **Tabs:** Overview | Configuration | Documents | FAQs | Access Requests | Analytics
- **Dialogs:** Various configuration and management dialogs
- **Permissions:** `FeatureGate feature="trust_center"`, `PermissionGate permission="settings.manage"` (implied)

---

## 10. Monitoring & Analytics

### 10.1 Scanning (`/scanning`)
- **File:** `_authenticated/scanning.tsx` (529 lines)
- **Purpose:** Continuous compliance monitoring with integration scanning and drift detection
- **Data displayed:**
  - Monitoring status overview with last scan time, active integrations
  - Compliance drift indicators
  - Alert list from scanning
  - Scan history with results
- **User actions:**
  - Trigger full compliance scan
  - View integration status
  - Review alerts
  - Browse scan history
- **API endpoints:** `useMonitoringStatus()`, `useFullScan()`, `useComplianceDrift()`, `useMonitoringAlerts()`, `useScanHistory()`
- **Tabs:** Overview | Integrations | Alerts | Scan History
- **Permissions:** `PermissionGate permission="compliance.manage"`

### 10.2 Insights (`/insights`)
- **File:** `_authenticated/insights.tsx` (746 lines)
- **Purpose:** AI-powered compliance insights with flywheel metrics and pattern detection
- **Data displayed:**
  - Flywheel status (how AI improves over time)
  - AI-generated insights and recommendations
  - Pattern library (detected compliance patterns)
  - Applicable patterns for current organization
  - Active learning metrics
  - Cohort summaries
  - Archetype profiles
- **User actions:**
  - Browse insights
  - Explore patterns
  - View cohort and archetype analysis
- **API endpoints:** Custom hooks: `useFlywheelStatus()`, `useFlywheelInsights()`, `usePatternLibrary()`, `useApplicablePatterns()`, `useActiveLearning()`, `useCohortSummary()`, `useArchetypeProfile()`
- **Permissions:** None specific

### 10.3 Penalty Exposure (`/penalty-exposure`)
- **File:** `_authenticated/penalty-exposure.tsx` (1137 lines)
- **Purpose:** Calculate and visualize HIPAA penalty exposure based on current compliance gaps
- **Data displayed:**
  - Cost breakdown by category and violation type
  - Top gaps ranked by financial exposure
  - Individual violation details with penalty calculations
  - Exposure trends over time
- **User actions:**
  - View penalty exposure breakdown
  - Analyze top gaps
  - Review individual violations
  - Track trends
- **API endpoints:** Penalty exposure hooks
- **Tabs:** Cost Breakdown | Top Gaps | Violations | Trends
- **Permissions:** None specific

### 10.4 Behavior Analytics (`/behavior-analytics`)
- **File:** `_authenticated/behavior-analytics.tsx` (942 lines)
- **Purpose:** User behavior analytics for detecting anomalous access patterns
- **Data displayed:**
  - Dashboard with risk scores and anomaly counts
  - Anomaly list with details and severity
  - Security events timeline
  - Detection rules configuration
- **User actions:**
  - View anomalies
  - Configure detection rules
  - Browse events
  - Manage rule thresholds
- **API endpoints:** Behavior analytics hooks
- **Tabs:** Dashboard | Anomalies | Events | Rules
- **Permissions:** `PermissionGate permission="monitoring.manage"`

### 10.5 Regulatory Radar (`/regulatory-radar`)
- **File:** `_authenticated/regulatory-radar.tsx` (1310 lines)
- **Purpose:** Track regulatory changes and assess their impact on compliance
- **Data displayed:**
  - Radar visualization of upcoming regulatory changes
  - News feed of regulatory updates
  - Impact assessments per regulation
  - Trend analysis of regulatory landscape
- **User actions:**
  - Browse regulatory updates
  - View impact assessments
  - Track regulatory trends
  - Configure monitoring preferences
- **API endpoints:** Regulatory radar hooks
- **Tabs:** Radar | Feed | Impact | Trends
- **Dialogs:** Impact assessment dialogs
- **Permissions:** `FeatureGate feature="regulatory_radar"`, `PermissionGate permission="compliance.manage"` (implied)

### 10.6 Assets (`/assets`)
- **File:** `_authenticated/assets.tsx` (1050 lines)
- **Purpose:** Manage IT asset inventory with vulnerability tracking
- **Data displayed:**
  - Asset inventory table with name, type, owner, criticality, PHI access
  - Vulnerability list with CVE references, severity, affected assets
- **User actions:**
  - Add/edit assets
  - View asset details
  - Track vulnerabilities
  - Filter by type, criticality
- **API endpoints:** Asset hooks
- **Tabs:** Inventory | Vulnerabilities
- **Dialogs:** Asset creation/edit dialogs
- **Permissions:** `FeatureGate feature="assets"`, `PermissionGate permission="assets.manage"` (implied)

### 10.7 Controls (`/controls`)
- **File:** `_authenticated/controls.tsx` (1177 lines)
- **Purpose:** Manage compliance controls with testing and monitoring
- **Data displayed:**
  - Control list with effectiveness, testing status, owner
  - Control monitoring dashboard
- **User actions:**
  - View/manage controls
  - Track control effectiveness
  - Monitor control status
- **API endpoints:** Control hooks
- **Tabs:** Controls | Monitoring
- **Permissions:** `FeatureGate feature="controls"`, `PermissionGate permission="controls.manage"` (implied)

### 10.8 Frameworks (`/frameworks`)
- **File:** `_authenticated/frameworks.tsx` (659 lines)
- **Purpose:** Multi-framework compliance management with cross-framework mapping
- **Data displayed:**
  - Framework overview with compliance scores per framework
  - Coverage matrix showing shared controls across frameworks
  - Shared evidence items
  - Gap analysis between frameworks
- **User actions:**
  - View framework coverage
  - Analyze cross-framework gaps
  - Map evidence to frameworks
- **API endpoints:** Framework hooks
- **Tabs:** Overview | Coverage Matrix | Shared Evidence | Gap Analysis
- **Permissions:** `FeatureGate feature="frameworks"`, `PermissionGate permission="compliance.manage"` (implied)

### 10.9 Regulations (`/regulations`)
- **File:** `_authenticated/regulations.tsx` (223 lines)
- **Purpose:** Browse regulatory frameworks and their detailed requirements
- **Data displayed:**
  - Regulation list with framework name, status, requirement count
  - Detailed requirements per regulation
- **User actions:**
  - Browse regulations
  - View requirement details
  - Select regulation to see requirements
- **API endpoints:** `useRegulations()`, `useRequirements()`
- **Permissions:** None specific

---

## 11. Public Pages

### 11.1 Landing Page (`/`)
- **File:** `routes/landing.tsx` (89 lines)
- **Purpose:** Marketing landing page for unauthenticated visitors
- **Sections:** Hero, Social Proof, Features, How It Works, Stats, HIPAA Coverage, Integrations, Frameworks, Testimonials, Pricing Teaser, CTA, Footer
- **Behavior:** Redirects to `/dashboard` if user has access token; forces light mode
- **Navigation:** Links to `/login`, `/signup`, `/about`, `/blog`, `/contact`, `/security`, `/trust-center`, `/privacy-policy`, `/terms-of-service`

### 11.2 Login (`/login`)
- **File:** `routes/login.tsx` (192 lines)
- **Purpose:** User authentication
- **Data/actions:** Email/password login, password visibility toggle, loading state, auto-load notifications on success
- **API endpoints:** `authService.login()`, `alertsService.getAlerts()`
- **Navigation:** Links to `/signup`, `/forgot-password`; redirects to `/dashboard` on success

### 11.3 Signup (`/signup`)
- **File:** `routes/signup.tsx` (173 lines)
- **Purpose:** New account registration
- **Data/actions:** Full name, email, company name, password; minimum 8 character password validation
- **API endpoints:** `POST /auth/signup`
- **Navigation:** Links to `/login`; redirects to `/onboarding` on success

### 11.4 Forgot Password (`/forgot-password`)
- **File:** `routes/forgot-password.tsx` (124 lines)
- **Purpose:** Request password reset email
- **Data/actions:** Email input, submit; always shows success (prevents email enumeration)
- **API endpoints:** `POST /auth/forgot-password`
- **Navigation:** Back to `/login`

### 11.5 Reset Password (`/reset-password`)
- **File:** `routes/reset-password.tsx` (238 lines)
- **Purpose:** Set new password via reset token
- **Data/actions:** Token validation on mount, new password + confirm, password strength requirements
- **API endpoints:** `POST /auth/validate-reset-token`, `POST /auth/reset-password`
- **Navigation:** Link to `/login` on success

### 11.6 Invite Accept (`/invite/accept`)
- **File:** `routes/invite-accept.tsx` (255 lines)
- **Purpose:** Accept team invitation and set up account
- **Data/actions:** Token validation showing invitee email/name and tenant name, set password, join organization
- **API endpoints:** `POST /auth/validate-invite`, `POST /auth/accept-invite`
- **Navigation:** Redirects to `/dashboard` on success

### 11.7 Complete Assignment (`/complete/$token`)
- **File:** `routes/complete-assignment.tsx` (231 lines)
- **Purpose:** Public page for completing assigned tasks or training (no login required)
- **Data/actions:** Token-based assignment lookup, completion form with notes and optional score, supports task and training types
- **API endpoints:** `GET /assignments/$token`, `POST /assignments/$token/complete`

### 11.8 Trust Center Index (`/trust-center`)
- **File:** `routes/trust-center-index.tsx` (127 lines)
- **Purpose:** Public trust center overview showcasing compliance frameworks and security practices
- **Data displayed:** 6 compliance frameworks (HIPAA, HITRUST CSF, SOC 2, NIST CSF, GDPR, ISO 27001), 4 security practices (Encryption, Access Controls, Monitoring, Incident Response)
- **Navigation:** CTA to request access

### 11.9 Trust Center (Per-Org) (`/trust-center/$slug`)
- **File:** `routes/trust-center.tsx` (875 lines)
- **Purpose:** Organization-specific public trust center with compliance badges, documents, and chatbot
- **Data displayed:** Organization info, compliance badges, security measures, downloadable documents, subprocessor list, FAQ, contact form, optional chatbot
- **API endpoints:** Dynamic loading via `apiClient` using org slug
- **Customizable:** Branding (colors, logo, hero text), section visibility, chatbot toggle

### 11.10 About (`/about`)
- **File:** `routes/about.tsx` (125 lines)
- **Purpose:** Company about page with values and stats
- **Content:** 3 values (Security First, Healthcare Focus, AI-Powered), 4 stats (500+ orgs, 73 HIPAA requirements, 24/7 monitoring, 10x faster)

### 11.11 Blog (`/blog`)
- **File:** `routes/blog.tsx` (85 lines)
- **Purpose:** Blog placeholder with newsletter signup
- **Current status:** **Coming Soon** — shows 3 placeholder posts, newsletter subscription form
- **Limitations:** No actual blog content; newsletter subscription not connected to backend

### 11.12 Contact (`/contact`)
- **File:** `routes/contact.tsx` (160 lines)
- **Purpose:** Contact form for support, sales, and security inquiries
- **Data/actions:** Contact form (name, email, company, subject, message), 3 contact cards (support/sales/security emails)
- **API endpoints:** Form submission to backend

### 11.13 Security (`/security`)
- **File:** `routes/security.tsx` (122 lines)
- **Purpose:** Public security practices page
- **Content:** Data Encryption, Access Controls, Infrastructure Security, Monitoring & Logging, Incident Response, Bug Bounty/Responsible Disclosure

### 11.14 Privacy Policy (`/privacy-policy`)
- **File:** `routes/privacy-policy.tsx` (78 lines)
- **Purpose:** Legal privacy policy
- **Content:** 8 sections: Info Collection, Use, Sharing, Security, Retention, Rights, Changes, Contact

### 11.15 Terms of Service (`/terms-of-service`)
- **File:** `routes/terms-of-service.tsx` (89 lines)
- **Purpose:** Legal terms of service
- **Content:** Acceptance, Description, Account, Subscription/Payment, etc.

### 11.16 Test (`/test`)
- **File:** `routes/test.tsx` (8 lines)
- **Purpose:** Redirect to `/login` — development utility

---

## 12. Admin Panel

### 12.1 Admin Layout (`/admin/*`)
- **File:** `admin/_admin-layout.tsx` (180 lines)
- **Purpose:** Admin panel shell with sidebar navigation
- **Auth:** Separate `admin_token` in localStorage; redirects to `/admin/login` if not present
- **Navigation:** Dashboard, Tenants, Packages, Billing, Monitoring
- **Features:** Collapsible sidebar, mobile responsive, logout

### 12.2 Admin Login (`/admin/login`)
- **File:** `admin/login.tsx` (150 lines)
- **Purpose:** Admin-specific authentication
- **Data/actions:** Email/password login, stores `admin_token` and `admin_user`
- **API endpoints:** `adminService.adminLogin()`

### 12.3 Admin Dashboard (`/admin/dashboard`)
- **File:** `admin/dashboard.tsx` (509 lines)
- **Purpose:** Platform-wide overview for system administrators
- **Data displayed:**
  - Platform stats: total tenants, active users, MRR, error rate
  - Platform health status (services, databases, queues)
  - Usage charts (bar chart by tenant, pie chart by plan)
  - Platform alerts
  - Recent errors
- **API endpoints:** `adminService.getPlatformStats()`, `adminService.getPlatformAlerts()`, `adminService.getPlatformHealth()`, `adminService.getPlatformErrors()`, usage queries

### 12.4 Admin Tenants (`/admin/tenants`)
- **File:** `admin/tenants.tsx` (1140 lines)
- **Purpose:** Manage all tenants (organizations) on the platform
- **Data displayed:**
  - Tenant list with name, status, plan, users, compliance score, created date
  - Quick stats cards
  - Search and filter
- **User actions:**
  - Create new tenant
  - Edit tenant details
  - View tenant detail page
  - Search/filter tenants
  - Copy invite link
- **API endpoints:** `adminService.listTenants()`, `adminService.createTenant()`, etc.
- **Navigation:** Links to `/admin/tenants/$tenantId`

### 12.5 Admin Tenant Detail (`/admin/tenants/$tenantId`)
- **File:** `admin/tenant-detail.tsx` (980 lines)
- **Purpose:** Detailed view and management of individual tenant
- **Data displayed:**
  - Tenant overview (name, plan, status, created, contact info)
  - Usage metrics (users, documents, scans, AI queries, storage)
  - Compliance summary (score, risk level)
  - Activity timeline
  - Financial info (plan, billing)
- **User actions:**
  - Edit tenant details
  - Change plan/package
  - Send notification
  - Reset data
  - Suspend/activate tenant
  - Delete tenant
- **API endpoints:** `adminService.getTenant()`, `adminService.updateTenant()`, various admin actions
- **Tabs:** Overview | Usage | Compliance | Activity | (more)
- **Dialogs:** Edit dialog, action confirmation dialogs

### 12.6 Admin Packages (`/admin/packages`)
- **File:** `admin/packages.tsx` (774 lines)
- **Purpose:** Manage subscription packages/plans
- **Data displayed:**
  - Package cards with tier, pricing (monthly/yearly), limits, features
  - Subscriber counts per package
- **User actions:**
  - Create new package
  - Edit package details (name, pricing, limits, features)
  - Delete package
  - Set tier level
- **API endpoints:** `adminService.listPackages()`, CRUD operations
- **Dialogs:** Create/Edit Package dialog

### 12.7 Admin Billing (`/admin/billing`)
- **File:** `admin/billing.tsx` (660 lines)
- **Purpose:** Platform-wide billing management
- **Data displayed:**
  - Billing metrics: MRR, ARR, churn rate, ARPU
  - Invoice list with tenant, amount, status, due date
  - Contract list with terms, renewal dates
  - Payment history
- **User actions:**
  - View/manage invoices
  - Send invoice reminders
  - View contracts
  - Track payment history
- **API endpoints:** `adminService.getBillingMetrics()`, `adminService.listInvoices()`, `adminService.listContracts()`
- **Tabs:** Invoices | Contracts | Payment History

### 12.8 Admin Monitoring (`/admin/monitoring`)
- **File:** `admin/monitoring.tsx` (743 lines)
- **Purpose:** Platform health monitoring and performance metrics
- **Data displayed:**
  - Service health status (API, database, cache, queue, AI)
  - Performance metrics charts (response times, throughput)
  - Error rates and trends
  - Per-tenant resource usage
  - Alert history
- **User actions:**
  - Refresh health checks
  - View performance details
  - Filter by time range
  - Resolve alerts
- **API endpoints:** `adminService.getPlatformHealth()`, monitoring queries

---

## Additional Routes

### Index Route (`/` authenticated)
- **File:** `_authenticated/index.tsx` (10 lines)
- **Purpose:** Redirects authenticated root to `/dashboard`

### Root Layout
- **File:** `__root.tsx`
- **Purpose:** Root route for TanStack Router

### Authenticated Layout
- **File:** `_authenticated.tsx`
- **Purpose:** Auth guard wrapper; redirects to `/login` if no token

---

## Permission & Feature Summary

### Feature Gates (Package-gated features)
| Feature Flag | Routes |
|---|---|
| `compliance_code` | `/compliance-code` |
| `compliance_costs` | `/compliance-costs` |
| `policy_templates` | `/policy-templates` |
| `risk_assessment` | `/risk-assessment` |
| `risk_register` | `/risk-register` |
| `risk_management` | `/risk-management` |
| `incidents` | `/incidents` |
| `auto_remediation` | `/auto-remediation` |
| `breach_sim` | `/breach-sim` |
| `vendors` | `/vendors` |
| `vendor_risk` | `/vendor-risk` |
| `tprm` | `/tprm` |
| `due_diligence` | `/due-diligence` |
| `questionnaires` | `/questionnaires` |
| `ai_agent` | `/ai-agent` |
| `ai_assistant` | `/ai-assistant` |
| `ai_governance` | `/ai-governance` |
| `digital_twin` | `/digital-twin` |
| `personnel` | `/personnel` |
| `employee_compliance` | `/employee-compliance` |
| `security_training` | `/security-training` |
| `collaboration` | `/collaboration` |
| `audit_reports` | `/audit-reports` |
| `enterprise_integrations` | `/enterprise-integrations` |
| `customer_portal` | `/customer-portal` |
| `trust_center` | `/trust-center-admin` |
| `regulatory_radar` | `/regulatory-radar` |
| `assets` | `/assets` |
| `controls` | `/controls` |
| `frameworks` | `/frameworks` |

### Permission Keys Used
| Permission | Used In |
|---|---|
| `compliance.manage` | Compliance, Compliance Code, Compliance Costs, Scanning, Breach Sim, Digital Twin, Auto-Remediation |
| `compliance.create` | Policy Templates |
| `documents.create` | Documents |
| `documents.manage` | Contract Intelligence |
| `evidence.manage` | Evidence |
| `evidence.create` | Evidence |
| `risk.create` | Risk Assessment, Risk Register, Risk Management |
| `remediation.create` | Remediation |
| `incidents.create` | Incidents |
| `vendors.manage` | Vendors, Vendor Risk, TPRM, Due Diligence, Questionnaires |
| `personnel.create` | Personnel, Employee Compliance |
| `ai.manage` | AI Agent, AI Governance, Learning Engine |
| `ai.chat` | AI Agent, AI Assistant |
| `reports.create` | Reports, Advanced Reports, Audit Reports |
| `reports.edit` | Advanced Reports |
| `reports.delete` | Advanced Reports, Audit Reports |
| `settings.manage` | Platform Settings, Customer Portal, Trust Center Admin |
| `settings.edit` | Platform Settings |
| `monitoring.edit` | Alerts |
| `monitoring.manage` | Behavior Analytics |

---

## Summary Statistics

| Category | Page Count | Total Lines |
|---|---|---|
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
| **Total** | **78** | **~57,900** |
