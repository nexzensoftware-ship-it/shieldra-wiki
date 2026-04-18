# Shieldra AI — Page Testing Checklist

Track testing progress for every page in the system. Mark each page `[x]` once tested and verified.

## Core Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 1 | [ ] | Dashboard | `/dashboard` | Role-dependent title |
| 2 | [x] | Documents | `/documents` | Upload, versioning, analysis |
| 3 | [ ] | Compliance Checks | `/compliance` | Quick scan, checks list |
| 4 | [ ] | Compliance Detail | `/compliance/$checkId` | Dynamic per-check view |
| 5 | [ ] | HIPAA Roadmap | `/hipaa-roadmap` | Step-by-step roadmap |
| 6 | [ ] | Scanning & Monitoring | `/scanning` | Drift, alerts, scan history |
| 7 | [ ] | Risk Assessment | `/risk-assessment` | Risk analysis |
| 8 | [ ] | Incidents | `/incidents` | Incident & breach management |
| 9 | [ ] | Remediation | `/remediation` | Kanban-style issue tracker |
| 10 | [ ] | Evidence Management | `/evidence` | Evidence collection |
| 11 | [ ] | Reports & Analytics | `/reports` | Report generation |
| 12 | [ ] | Alerts & Notifications | `/alerts` | Alert preferences |
| 13 | [ ] | Training | `/training` | HIPAA training compliance |
| 14 | [ ] | Audit Trail | `/audit-trail` | Immutable log |
| 15 | [ ] | Vendors & BAAs | `/vendors` | Vendor management |
| 16 | [ ] | Settings | `/settings` | Account & org settings |
| 17 | [ ] | Onboarding | `/onboarding` | Welcome / setup wizard |
| 18 | [x] | Regulations Library | `/regulations` | Regulation reference |

## AI & Intelligence Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 19 | [ ] | AI Assistant | `/ai-assistant` | HIPAA compliance chat |
| 20 | [ ] | AI Agent | `/ai-agent` | Shieldra AI agent |
| 21 | [ ] | AI Insights | `/insights` | AI-generated insights |
| 22 | [ ] | AI Governance | `/ai-governance` | AI governance controls |
| 23 | [ ] | Learning Engine | `/learning-engine` | Adaptive learning |

## Risk & Assessment Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 24 | [ ] | Risk Register | `/risk-register` | Risk catalog |
| 25 | [ ] | Risk Management | `/risk-management` | Risk management dashboard |
| 26 | [ ] | Risk Prioritization | `/risk-prioritization` | Risk-weighted prioritization |
| 27 | [ ] | Penalty Exposure | `/penalty-exposure` | Penalty calculator |

## Vendor & Third-Party Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 28 | [ ] | Vendor Risk | `/vendor-risk` | Vendor risk management |
| 29 | [ ] | TPRM | `/tprm` | Third-party risk management |
| 30 | [ ] | Due Diligence | `/due-diligence` | M&A due diligence |
| 31 | [ ] | Contract Intelligence | `/contract-intelligence` | BAA contract analysis |

## Advanced / Enterprise Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 32 | [ ] | Advanced Reports | `/advanced-reports` | Advanced reporting |
| 33 | [ ] | Audit Reports | `/audit-reports` | Audit report generation |
| 34 | [ ] | Controls Library | `/controls` | Control catalog |
| 35 | [ ] | Frameworks | `/frameworks` | Framework cross-mapping |
| 36 | [ ] | Policy Templates | `/policy-templates` | Policy template library |
| 37 | [ ] | Questionnaires | `/questionnaires` | Questionnaire automation |
| 38 | [ ] | Compliance-as-Code | `/compliance-code` | Code-based compliance |
| 39 | [ ] | Compliance Costs | `/compliance-costs` | Cost & ROI dashboard |
| 40 | [ ] | Auto-Remediation | `/auto-remediation` | Auto-remediation engine |

## People & Organization Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 41 | [ ] | Personnel | `/personnel` | Personnel management |
| 42 | [ ] | Employee Compliance | `/employee-compliance` | Employee tracking |
| 43 | [ ] | Security Training | `/security-training` | Security awareness training |
| 44 | [ ] | Asset Management | `/assets` | IT asset tracking |

## Monitoring & Analytics Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 45 | [ ] | Behavior Analytics | `/behavior-analytics` | User behavior analysis |
| 46 | [ ] | Breach Simulation | `/breach-sim` | Breach tabletop engine |
| 47 | [ ] | Digital Twin | `/digital-twin` | Compliance digital twin |
| 48 | [ ] | Knowledge Graph | `/knowledge-graph` | Compliance knowledge graph |
| 49 | [x] | Regulatory Radar | `/regulatory-radar` | Regulatory change tracking |

## Platform & Portal Pages

| # | Status | Page | Route | Notes |
|---|--------|------|-------|-------|
| 50 | [ ] | Platform Settings | `/platform-settings` | Platform-level config |
| 51 | [ ] | Enterprise Integrations | `/enterprise-integrations` | Integration connectors |
| 52 | [ ] | Collaboration Hub | `/collaboration` | Team collaboration |
| 53 | [ ] | Trust Center | `/trust-center-admin` | Public trust center |
| 54 | [ ] | Client Portal | `/customer-portal` | Customer-facing portal |

---

**Total: 54 pages** (excluding the `/` redirect)

## Testing Notes

- Test on: `dev.shieldra.ai` (develop branch) and `shieldra.ai` (production)
- Check: page loads, data displays, loading skeletons show, CRUD operations work
- Mark `[x]` once verified on production
