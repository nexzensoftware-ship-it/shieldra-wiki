# Shieldra AI — MVP Page Audit & Task Tracker
**Generated:** 2026-03-17 | **Deadline:** March 31, 2026
**Status:** 🔴 = Mock data only (no API) | 🟡 = Partially wired | 🟢 = API wired

---

## Summary

| Status | Count | Description |
|--------|-------|-------------|
| 🟢 Wired | 7 | Pages with API calls and no/minimal mock data |
| 🟡 Partial | 21 | Pages with some API calls BUT still heavy mock data |
| 🔴 Mock Only | 26 | Pages with ZERO API calls, entirely mock/hardcoded data |

**54 total pages. 47 need work. 13 days.**

---

## 🔴 MOCK DATA ONLY — No API Wiring (Priority Fix)

These pages render but use entirely hardcoded/mock data. Backend endpoints exist but frontend isn't calling them.

| # | Page | Mock Refs | Backend Endpoint Exists | Notes |
|---|------|-----------|------------------------|-------|
| 1 | ai-agent.tsx | 5 | ✅ ai_agent.py | |
| 2 | ai-assistant.tsx | 1 | ✅ ai_assistant.py | |
| 3 | ai-governance.tsx | 17 | ✅ ai_governance.py | Heavy mock data |
| 4 | alerts.tsx | 1 | ✅ alerts.py | |
| 5 | audit-trail.tsx | 2 | ✅ audit_trail.py | |
| 6 | auto-remediation.tsx | 9 | ✅ auto_remediation.py | |
| 7 | breach-sim.tsx | 9 | ✅ breach_sim.py | |
| 8 | collaboration.tsx | 6 | ✅ collaboration.py | |
| 9 | compliance-code.tsx | 12 | ✅ compliance_code.py | Heavy mock data |
| 10 | compliance-costs.tsx | 14 | ✅ compliance_costs.py | Heavy mock data |
| 11 | compliance-detail.tsx | 2 | ✅ compliance.py | |
| 12 | compliance.tsx | 6 | ✅ compliance.py | |
| 13 | controls.tsx | 11 | ✅ controls.py | Heavy mock data |
| 14 | customer-portal.tsx | 10 | ✅ customer_portal.py | Heavy mock data |
| 15 | digital-twin.tsx | 2 | ✅ digital_twin.py | |
| 16 | employee-compliance.tsx | 5 | ✅ employee_compliance.py | |
| 17 | evidence.tsx | 7 | ✅ evidence.py | |
| 18 | frameworks.tsx | 1 | ✅ frameworks.py | |
| 19 | incidents.tsx | 8 | ✅ incidents.py | |
| 20 | knowledge-graph.tsx | 2 | ✅ knowledge_graph.py | Core AI feature |
| 21 | learning-engine.tsx | 5 | ✅ learning_engine.py | Core AI feature |
| 22 | policy-templates.tsx | 1 | ✅ policy_templates.py | |
| 23 | regulations.tsx | 1 | ✅ regulations.py | |
| 24 | remediation.tsx | 5 | ✅ remediation.py | |
| 25 | reports.tsx | 1 | ✅ reports.py | |
| 26 | risk-assessment.tsx | 4 | ✅ risk_assessment.py | |
| 27 | risk-register.tsx | 8 | ✅ risk_register.py | |
| 28 | training.tsx | 3 | ✅ training.py | |
| 29 | vendors.tsx | 8 | ✅ vendors.py | |

## 🟡 PARTIALLY WIRED — Has API Calls But Still Mock Data

These pages have some API integration but still fall back to mock/placeholder data.

| # | Page | API Calls | Mock Refs | Notes |
|---|------|-----------|-----------|-------|
| 1 | advanced-reports.tsx | 20 | 3 | |
| 2 | assets.tsx | 35 | 16 | Heavy mock fallback |
| 3 | audit-reports.tsx | 6 | 4 | |
| 4 | behavior-analytics.tsx | 16 | 2 | |
| 5 | contract-intelligence.tsx | 11 | 2 | |
| 6 | documents.tsx | 2 | 3 | |
| 7 | due-diligence.tsx | 17 | 2 | |
| 8 | enterprise-integrations.tsx | 35 | 16 | Heavy mock fallback |
| 9 | onboarding.tsx | 3 | 9 | Heavy mock |
| 10 | personnel.tsx | 53 | 17 | Heavy mock fallback |
| 11 | platform-settings.tsx | 48 | 15 | Heavy mock fallback |
| 12 | questionnaires.tsx | 1 | 16 | Barely wired |
| 13 | regulatory-radar.tsx | 1 | 4 | Barely wired |
| 14 | risk-management.tsx | 31 | 8 | |
| 15 | security-training.tsx | 17 | 3 | |
| 16 | settings.tsx | 19 | 5 | |
| 17 | tprm.tsx | 31 | 4 | |
| 18 | trust-center-admin.tsx | 42 | 12 | Heavy mock fallback |
| 19 | vendor-risk.tsx | 22 | 6 | |

## 🟢 CLEAN — Wired or No Mock Data Issues

| # | Page | Notes |
|---|------|-------|
| 1 | dashboard.tsx | ✅ Clean |
| 2 | hipaa-roadmap.tsx | ✅ Clean |
| 3 | index.tsx | ✅ Clean |
| 4 | insights.tsx | ✅ API wired (16 calls) |
| 5 | penalty-exposure.tsx | ✅ API wired (6 calls) |
| 6 | risk-prioritization.tsx | ✅ API wired (13 calls) |
| 7 | scanning.tsx | ✅ Clean |

## Non-Authenticated Routes (Also Need Review)

| Page | Purpose |
|------|---------|
| login.tsx | Auth |
| signup.tsx | Registration |
| forgot-password.tsx | Password reset |
| reset-password.tsx | Password reset |
| landing.tsx | Marketing landing |
| invite-accept.tsx | Team invites |
| about.tsx | About page |
| blog.tsx | Blog |
| contact.tsx | Contact form |
| privacy-policy.tsx | Legal |
| terms-of-service.tsx | Legal |
| security.tsx | Security page |
| trust-center-index.tsx | Public trust center |
| trust-center.tsx | Public trust center |

---

## Execution Plan

### Week 1 (Mar 18-22): Core HIPAA Flow
**Gadha** wires up the critical path pages:
1. compliance.tsx + compliance-detail.tsx
2. documents.tsx
3. evidence.tsx
4. risk-assessment.tsx + risk-register.tsx
5. controls.tsx
6. frameworks.tsx + regulations.tsx
7. reports.tsx + audit-trail.tsx
8. alerts.tsx + incidents.tsx
9. remediation.tsx

**Alchi** tests each page as Gadha completes it on dev.shieldra.ai

### Week 2 (Mar 24-28): AI, Vendor, & Admin
**Gadha** wires up:
1. ai-agent.tsx + ai-assistant.tsx + ai-governance.tsx
2. knowledge-graph.tsx + learning-engine.tsx
3. vendor-risk.tsx + vendors.tsx + tprm.tsx
4. personnel.tsx + employee-compliance.tsx + training.tsx
5. settings.tsx + platform-settings.tsx
6. All remaining 🔴 pages

**Alchi** regression tests Week 1 pages + tests Week 2

### Mar 29-31: Polish & Ship
- Bug fixes from Alchi's testing
- Final regression
- Prod deploy verification

---

## Bug Tracking

_Bugs found during audit/testing go here_

| ID | Page | Description | Severity | Assigned | Status |
|----|------|-------------|----------|----------|--------|
| | | | | | |
