# 🔍 Shieldra Deep Audit Report — Second Pass
**Date:** March 30, 2026  
**Branch:** `develop`  
**Scope:** All 53 frontend pages, 60+ backend endpoints  
**Auditor:** Sherpa (PM) via 7 parallel code audit agents

---

## Executive Summary

| Severity | Count |
|----------|-------|
| **Critical** | 12 |
| **High** | 35 |
| **Medium** | 30 |
| **Low** | 10 |
| **Total** | **87+** |

### Top Systemic Patterns
1. **Frontend-Backend field name mismatches** — Pages render blank/broken because field names differ between TypeScript interfaces and Python API responses (14+ instances)
2. **Fake/random data presented as real** — `random.randint()`, `random.uniform()`, seeded random used across AI agent, digital twin, risk trends, auto-remediation metrics, compliance code, asset monitoring (10+ instances)
3. **Missing DELETE/PUT endpoints** — Frontend has delete/update buttons but backend has no corresponding endpoints (5+ instances)
4. **Audit integrity silently broken** — `_log_audit` references undefined `org_id` variable in multiple modules, caught by bare `except: pass` (3+ modules)
5. **Error states swallowed** — Hooks catch errors and return empty data, making API failures look like "no data exists" (system-wide)

---

## Group 1: Core Compliance & Dashboard (13 issues)

### CRITICAL — None

### HIGH

**H1. Control Detail Dialog State Sync Bug**
- **Location:** `apps/web/src/app/routes/_authenticated/controls.tsx:369-381`
- **Description:** `ControlDetailDialog` uses `useState` for deadline/assignedTo/notes but `prevId` never updates. Opening Control A (with deadline), closing, then opening Control B shows Control A's stale data.
- **Steps:** Open Control A (has deadline) → close → open Control B (no deadline) → B shows A's deadline
- **Expected:** Each control shows its own data
- **Actual:** Stale state from previous control persists

**H2. Hooks Swallow API Errors, Show Empty State Instead of Errors**
- **Location:** `apps/web/src/hooks/use-controls.ts:9-14`, `use-frameworks.ts:7-12`, and others
- **Description:** Multiple hooks wrap `queryFn` in try/catch returning empty data. React Query never sees errors — `isError` always false. Users see "No Controls Configured" when the real problem is a 500 error.
- **Steps:** Break controls API (return 500) → load /controls → see empty state, no error
- **Expected:** Error banner when API fails
- **Actual:** Shows empty state, user thinks they have no data

### MEDIUM

**M1. `useComplianceChecks` Strips Pagination — Silent Truncation at 20 Items**
- **Location:** `apps/web/src/hooks/use-compliance.ts:7-12`
- **Description:** Hook strips `total`, `page`, `page_size` from response. No pagination controls on frontend. Orgs with >20 checks see only 20, "Total Checks" shows 20.

**M2. Compliance Page Tab State Not Synced with URL**
- **Location:** `apps/web/src/app/routes/_authenticated/compliance.tsx:94-101`
- **Description:** Tab changes use local `useState`, URL doesn't update. Browser back doesn't work for tab nav, sharing URLs breaks after switching.

**M3. Calendar Tab Missing Loading State**
- **Location:** `apps/web/src/app/routes/_authenticated/compliance.tsx:97`
- **Description:** Calendar tab shows zeros/empty while loading — indistinguishable from "no deadlines exist."

**M4. Finding Status Update Bypasses React Query Mutation**
- **Location:** `apps/web/src/app/routes/_authenticated/compliance-detail.tsx:26,49-55`
- **Description:** `handleUpdateFindingStatus` calls service directly, no loading indicator, no optimistic update.

**M5. Dashboard N+1 Query — Loads All Findings Into Memory**
- **Location:** `apps/api/src/api/v1/endpoints/dashboard.py:115-120`
- **Description:** `_build_improvement_suggestions` loads ALL non-compliant findings into memory. Slow for orgs with thousands of findings.

**M6. Create Control — No Duplicate Code Validation**
- **Location:** `apps/web/src/app/routes/_authenticated/controls.tsx:508-540`
- **Description:** No check for existing control codes. Can create duplicates of "AS-1" etc.

### LOW

**L1.** Hardcoded sample policy text always in bundle (`compliance.tsx:36-90`)
**L2.** Excessive `any` types in dashboard component props (`dashboard.tsx:236+`)
**L3.** Dashboard roadmap error card has no retry button (`dashboard.tsx:148-152`)
**L4.** Dashboard cache key risk with `None` org_id (`dashboard.py:24-32`)

---

## Group 2: Risk & Assessment (12+ issues)

### CRITICAL

**C1. Penalty Exposure `/by-requirement` Complete Response Mismatch**
- **Location:** `penalty-exposure.tsx:56-65` vs `penalty_calculator.py:606-625`
- **Description:** Frontend expects `requirement_title`, `severity`, `status`, `penalty_contribution`, `gap_description`. API returns `exposure_low`, `exposure_mid`, `exposure_high`, `penalty_tier`, `finding_count` — completely different fields. Top Gaps and Violations tabs are non-functional.

**C2. Risk Prioritization Frontend Expects Different Score Shape**
- **Location:** `risk-prioritization.tsx:42-55` vs `risk_prioritization.py:235-275`
- **Description:** Frontend `RiskScore` expects `requirement` (string), `severity`, `effort_hours`, `roi_score`, `priority` ("P0"). API returns `final_risk_score`, `effort_estimate_hours`, `recommended_priority` (integer), nested `finding` object. Prioritized Gaps tab shows empty/undefined cells.

**C3. Risk Management Trends Returns Fabricated Data**
- **Location:** `apps/api/src/api/v1/endpoints/risk_management.py:1070-1095`
- **Description:** Trends endpoint generates fake historical data by multiplying current counts by arbitrary factors (`1.0 + (5 - i) * 0.15`). Shows fabricated 6-month trend as if it were real historical data.

### HIGH

**H3. Penalty Exposure Frontend-Backend Field Name Mismatches (Multiple)**
- **Location:** `penalty-exposure.tsx:43-78` vs `penalty_calculator.py:598-620`
- **Description:** `legal_costs` → API has `litigation_costs`; `reputation_costs` → API has `reputational_costs`; `business_disruption_costs` → doesn't exist; `calculated_at` → API has `calculation_date`. Cost breakdown cards show $0.

**H4. Penalty Exposure `/by-category` Field Mismatch**
- **Location:** `penalty-exposure.tsx:66-71` vs `penalty_calculator.py:633-695`
- **Description:** `total_exposure` → API has `amount`; `percentage` → API has `percentage_of_total`. Category bars show $0.

**H5. Penalty Exposure `/trends` Field Mismatch**
- **Location:** `penalty-exposure.tsx:73-78` vs `penalty_calculator.py:980-1048`
- **Description:** Frontend expects `date`, API returns `snapshot_date`. Trend chart misaligned.

**H6. Risk Prioritization Roadmap Response Mismatch**
- **Location:** `risk-prioritization.tsx:57-62` vs `risk_prioritization.py:296-350`
- **Description:** `total_items` → API has `items_selected`; `breach_probability_reduction` → API has `cumulative_risk_reduction_pct`; `items` → API has `selected_items`.

**H7. Risk Prioritization Breach Intelligence Field Mismatch**
- **Location:** `risk-prioritization.tsx:64-72` vs `risk_prioritization.py:374-427`
- **Description:** `entity` → API has `breach_entity`; `date` → API has `breach_date`; `location` → API has `location_type`. Cards show undefined text.

**H8. Auto-Remediation Dashboard Hardcoded MTTR Reduction (73.2%)**
- **Location:** `auto_remediation.py:138`
- **Description:** Always returns 73.2% regardless of actual data.

**H9. Auto-Remediation Metrics Hardcoded Before-MTTR (100.8h)**
- **Location:** `auto_remediation.py:739`
- **Description:** Before/after comparison always shows 100.8 hours.

### MEDIUM

**M7.** Penalty Exposure uses manual useState/useEffect instead of React Query (`penalty-exposure.tsx:114-166`)
**M8.** Auto-remediation hours saved uses hardcoded 2.3h/fix and $185/hr multipliers (`auto_remediation.py:133,742`)

---

## Group 3: Documents, Evidence & Audit (13+ issues)

### CRITICAL — None

### HIGH

**H10. Questionnaires `_log_audit` References Undefined `org_id`**
- **Location:** `apps/api/src/api/v1/endpoints/questionnaires.py:118`
- **Description:** `seal_audit_entry` call references `org_id` but function only has `tenant_id`. `NameError` caught by bare `except Exception: pass`. Audit entries for questionnaires are never sealed — hash chain integrity broken.

**H11. Questionnaires Frontend Uses Raw `fetch()` Instead of `apiClient`**
- **Location:** `apps/web/src/app/routes/_authenticated/questionnaires.tsx:137-148`
- **Description:** Custom `apiFetch()` with `localStorage.getItem('auth_token')` bypasses shared `apiClient`. Misses interceptors (401 refresh, tenant headers), inconsistent error handling.

**H12. Evidence Upload — No File Size/Type Validation**
- **Location:** `apps/api/src/api/v1/endpoints/evidence.py:97-134`
- **Description:** Evidence upload accepts any file of any size. No MIME type check, no extension check, no size limit. Documents endpoint has 50MB limit and MIME validation — evidence has none. DoS risk via large files.

**H13. Policy Templates `adopt-all` Skips Smart Analysis**
- **Location:** `apps/api/src/api/v1/endpoints/policy_templates.py:392-425`
- **Description:** Bulk adopt creates documents but doesn't run HIPAA analysis. Documents left in "uploaded" status — no compliance scores, findings, or gaps. Single adopt works correctly.

**H14. Questionnaires AI Answers — Hardcoded Boilerplate with Fake Confidence**
- **Location:** `apps/api/src/api/v1/endpoints/questionnaires.py:191-253`
- **Description:** Fallback AI answers are static strings per category with `random.uniform(0.72, 0.88)` confidence. Claims "Our organization implements..." which may not be true. For HIPAA compliance, fabricated answers are dangerous.

### MEDIUM

**M9.** Evidence files not stored — upload reads/discards raw bytes, no download capability (`evidence.py:97-134`)
**M10.** Policy Templates `adopt-all` duplicate check uses title instead of template ID (`policy_templates.py:406-410`)
**M11.** Audit Reports `useEffect` without abort controller — race conditions on rapid filter changes (`audit-reports.tsx:146-151`)
**M12.** Audit Reports templates show "Loading..." indefinitely on API failure (`audit-reports.tsx:240-248`)
**M13.** Questionnaires delete has no confirmation dialog (`questionnaires.tsx:347`)

### LOW

**L5.** Evidence `file` property passed via type cast — type-unsafe (`evidence.tsx:109-118`)
**L6.** Policy Templates duplicate `/adopted` route definitions (`policy_templates.py:68-93, 428-457`)
**L7.** Audit Reports archive has no confirmation dialog (`audit-reports.tsx:177-183`)

---

## Group 4: Vendors & Incidents (13+ issues)

### CRITICAL

**C4. Due Diligence Create Project — Field Name Mismatch**
- **Location:** `due-diligence.tsx:205` vs `due_diligence.py:34-38`
- **Description:** Frontend sends `{ name, type, target_org_name }` but backend expects `{ project_name, project_type, target_org_name }`. Creating a project either fails with 422 or stores null name.

**C5. Due Diligence Project Display — Field Name Mismatch**
- **Location:** `due-diligence.tsx:305-420` vs backend serializer
- **Description:** Frontend reads `project.name`, `project.type`, `project.end_date`. Backend returns `project_name`, `project_type`, `target_completion_date`. Name and Type columns blank in table.

**C6. Due Diligence Create Finding — No POST Endpoint**
- **Location:** `due-diligence.tsx:218-227` vs `due_diligence.py`
- **Description:** "Add Finding" button POSTs to `/due-diligence/projects/{id}/findings` but no POST handler exists. Always returns 405.

### HIGH

**H15. TPRM Intelligence Returns Hardcoded Mock Data**
- **Location:** `tprm.py:610-650`
- **Description:** Intelligence endpoint returns hardcoded certifications, breach history, and news keyed to specific vendor IDs. All fabricated.

**H16. TPRM AI Review Uses Random Scores**
- **Location:** `tprm.py:340-365`
- **Description:** `random.uniform(40, 95)` for scores, placeholder text for assessments. Refresh adds ±5 random delta.

**H17. Vendor Risk Intelligence Sync — Random Mock Events**
- **Location:** `vendor_risk.py:595-660`
- **Description:** Generates fake HHS breaches, SEC filings, CISA KEV entries with `random.randint()` for breach counts.

**H18. Due Diligence Delete — No DELETE Endpoint**
- **Location:** `due-diligence.tsx:231-244` vs `due_diligence.py`
- **Description:** Frontend calls DELETE but backend has no DELETE handler. Always 405.

**H19. Due Diligence Dashboard — Response Shape Mismatch**
- **Location:** `due-diligence.tsx` vs `due_diligence.py:540`
- **Description:** Frontend expects `in_progress`, `total_findings`, `deal_breakers`. Backend returns `active_projects`, `average_findings_per_project`.

**H20. Vendor Risk Delete Assessment — No DELETE Endpoint**
- **Location:** `vendor-risk.tsx:135-137`
- **Description:** Delete button calls `apiClient.delete()` but no backend DELETE handler exists. Always 405.

**H21. Vendor Risk Update Assessment Status — No PUT Endpoint**
- **Location:** `vendor-risk.tsx:139-142`
- **Description:** Status dropdown calls `apiClient.put()` but no backend PUT handler. Silently fails.

### MEDIUM

**M14.** Due Diligence findings `financial_impact` → API has `financial_impact_estimate` (`due-diligence.tsx:576`)
**M15.** TPRM Discovery scan always creates same 3 hardcoded vendors (`tprm.py:527-545`)
**M16.** Alerts page uses `(alert as any)` type assertions in 6+ places (`alerts.tsx:82-86, 102-103, 162-165`)

---

## Group 5: AI Features & Intelligence (17 issues)

### CRITICAL

**C7. AI Agent Uses Hardcoded Template Responses — No Real AI**
- **Location:** `ai_agent.py:143-370`
- **Description:** `_generate_smart_response` uses keyword matching to return pre-written templates. Confidence is `random.uniform(0.85, 0.98)`, tokens is `random.randint(800, 2500)`. The entire AI Agent chat feature is a sophisticated mock. AI Assistant (separate page) uses real LLM.

**C8. Digital Twin Simulations Use Seeded Random**
- **Location:** `digital_twin.py` (`create_simulation`)
- **Description:** `random.seed(hash(name))` generates fake score deltas, risk deltas, cost impacts. No actual compliance modeling. This is the core value prop of the feature.

### HIGH

**H22. AI Agent Policy Change Summary — Fabricated Data**
- **Location:** `ai_agent.py` (`policy_change_summary`)
- **Description:** Returns hardcoded "key changes" with `random.randint(3, 12)` for total changes. Never actually compares policy versions.

**H23. AI Agent Control Mapping — Random Confidence Scores**
- **Location:** `ai_agent.py` (`map_controls_to_policies`)
- **Description:** `random.uniform(0.75, 0.98)` per mapping. Not based on any analysis.

**H24. AI Agent Issue Triage — Random Priority/Assignees**
- **Location:** `ai_agent.py` (`issue_management`)
- **Description:** `random.randint(0, 5)` jitter on priority. `random.choice(["Security Engineer", ...])` for assignees.

**H25. AI Agent Evidence Check — Static Gaps**
- **Location:** `ai_agent.py` (`check_evidence`)
- **Description:** Always returns same two hardcoded gaps. Sufficiency score is random.

**H26. AI Agent Remediation Plan — Random Budget/Hours**
- **Location:** `ai_agent.py` (`create_remediation_plan`)
- **Description:** Hours: `random.randint(20, 120)`. Budget: `random.randint(5, 50) * 1000`. Users could make business decisions on these.

**H27. AI Assistant vs AI Agent Inconsistency**
- **Location:** `ai_assistant.py:100` vs `ai_agent.py:143`
- **Description:** AI Assistant uses real `get_llm_client()`. AI Agent (positioned as "advanced") uses hardcoded templates. The simpler feature gives better results.

**H28. Behavior Analytics Dashboard Response Shape Mismatch**
- **Location:** `behavior-analytics.tsx:36-42` vs `behavior_analytics.py`
- **Description:** Frontend expects `severity_distribution` but backend returns `anomalies_by_severity`. `recent_alerts` vs `recent_anomalies`.

### MEDIUM

**M17.** Digital Twin predictions use naive linear extrapolation, marketed as "AI-Powered" (`digital_twin.py`)
**M18.** Behavior Analytics missing FeatureGate wrapper (`behavior-analytics.tsx`)
**M19.** Insights page duplicates hooks already in `use-learning-engine.ts` (`insights.tsx:42-120`)
**M20.** Insights page silently swallows all API errors (`insights.tsx`)
**M21.** AI Agent evidence collection returns static mock data (`ai_agent.py`)

---

## Group 6: Reports, Training & People (14+ issues)

### CRITICAL

**C9. Collaboration `my-tasks` Defaults to Hardcoded "Alice Johnson"**
- **Location:** `collaboration.py:380`
- **Description:** `get_my_tasks` has default `assigned_to: str = "Alice Johnson"`. Frontend `useMyTasks()` doesn't pass user ID. Every user sees Alice Johnson's tasks.

### HIGH

**H29. Report Type Mismatch — "audit_ready" Maps to "executive"**
- **Location:** `apps/web/src/services/reports.ts:15`
- **Description:** `REPORT_TYPE_MAP` maps `audit_ready` → `'executive'`. Users requesting "Audit Readiness Package" get "Executive Summary" instead.

**H30. Security Training `_log_audit` References Undefined `org_id`**
- **Location:** `security_training.py:74`
- **Description:** Same bug as questionnaires — `org_id` undefined, `NameError` caught by bare `except: pass`. Audit entries never sealed for security training. HIPAA concern.

**H31. Training Allows "Completed" Status with Failing Score**
- **Location:** `training.py:174-195`
- **Description:** Backend accepts `status: "completed"` with any score, even 0. HIPAA training records show "completed" when employee actually failed.

**H32. Employee Compliance — Cross-Page Data Inconsistency**
- **Location:** `use-employee-compliance.ts:22-55`
- **Description:** `useEmployees` hook falls back to `/personnel` endpoint, creating synthetic mappings. Training records created via one endpoint don't appear in the other's view.

**H33. Advanced Reports — Executive Summary Returns Empty Arrays**
- **Location:** `advanced_reports.py:193-209`
- **Description:** Executive summary trends, achievements, and recommendations always return empty arrays. Dashboard shows blank charts.

### MEDIUM

**M22.** Advanced Reports download always generates JSON regardless of selected format (`advanced-reports.tsx:155-164`)
**M23.** Employee email — no format validation on create (`employee_compliance.py:55`)
**M24.** Employee email — no duplicate check (`employee_compliance.py:128-150`)
**M25.** Collaboration task board omits "blocked" and "cancelled" columns — tasks vanish (`collaboration.tsx:201-206`)
**M26.** Scheduled report delete has no confirmation dialog (`advanced-reports.tsx:289`)
**M27.** Security Training quiz exposes correct answers in response — gameable (`security_training.py:177-187`)

### LOW

**L8.** Personnel page missing loading skeleton — shows "No employees found" during load
**L9.** Reports page unused import `formatPercent` (`reports.tsx:45`)

---

## Group 7: Settings, Auth & Remaining (14+ issues)

### CRITICAL

**C10. Compliance Code Execution Returns Random Pass/Fail Counts**
- **Location:** `compliance_code.py:423-445`
- **Description:** `execute_policy` uses `random.randint()` for pass/fail counts. No actual policy evaluation. Same policy returns different results each run. Core compliance feature is entirely fake.

### HIGH

**H34. Compliance Code Metrics — Synthetic Compliance Scores**
- **Location:** `compliance_code.py:800-846`
- **Description:** `base_score = 87.0 + random.uniform(-3, 3)`. Drift alerts, pass rates all random.

**H35. Asset Monitoring Returns Random CPU/Memory/Disk Data**
- **Location:** `assets.py:849-863`
- **Description:** `random.seed(hash(monitor_id))` with `random.uniform()`. Fake telemetry in a HIPAA platform.

**H36. Platform Settings — Role Deletion Without Confirmation**
- **Location:** `platform-settings.tsx:390-396`
- **Description:** `deleteMutation.mutate(role.id)` fires immediately. Could impact all users assigned to that role.

**H37. Platform Settings — Workspace Deletion Without Confirmation**
- **Location:** `platform-settings.tsx:572-578`
- **Description:** Same pattern — immediate delete, could orphan compliance data.

### MEDIUM

**M28.** Settings page loads users but has no Users tab — dead code + wasted API calls (`settings.tsx:95-100`)
**M29.** Settings Roles tab says "Coming Soon" but Platform Settings has full RBAC — conflicting UIs (`settings.tsx:290-296`)
**M30.** SSO config save has no success/error toast (`platform-settings.tsx:164-175`)
**M31.** SCIM token displayed in plaintext — should be masked (`platform-settings.tsx:267-272`)
**M32.** Onboarding team step — no email format validation (`onboarding.tsx:505-510`)
**M33.** Onboarding team step — no skip option for small orgs (`onboarding.tsx:825-828`)
**M34.** Onboarding officers stored by name string, not user ID — fragile (`onboarding.tsx:510-515`)
**M35.** Enterprise integrations connect dialog — no required field validation (`enterprise-integrations.tsx`)

### LOW

**L10.** Session timeout dropdown fires API without debounce or save button (`settings.tsx:237-247`)

---

## Priority Fix Order (Recommendation)

### 🔴 Fix Immediately (Blocks MVP)
1. **Field name mismatches** (C1, C2, C4, C5, C6, H3-H7, H19, H28, etc.) — These make entire pages non-functional. Most are simple rename fixes.
2. **Missing backend endpoints** (C6, H18, H20, H21) — Frontend has buttons that 405. Add DELETE/PUT handlers.
3. **"Alice Johnson" hardcode** (C9) — Security/privacy issue.

### 🟠 Fix Before Launch
4. **Fake data/random scores** (C3, C7, C8, C10, H2, H8, H9, H15-H17, H22-H26, H34, H35) — Either implement real logic or clearly label as "demo/simulated."
5. **Audit integrity broken** (H10, H30) — Fix `org_id` → `tenant_id` in `_log_audit` across all modules.
6. **Error handling** (H2) — Stop swallowing errors in hooks.
7. **Evidence upload validation** (H12) — Add file size/type checks.

### 🟡 Fix Post-Launch
8. **UX improvements** — Missing confirmations, loading states, tab URL sync
9. **Code quality** — Type safety, dead code removal, hook deduplication
10. **Feature completions** — AI Agent real LLM integration, report format support
