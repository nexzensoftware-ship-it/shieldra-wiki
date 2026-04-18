# Shieldra AI — Comprehensive Bug & Issue Audit
**Generated:** 2026-03-17 | **MVP Deadline:** March 31, 2026
**Auditor:** Sherpa (PM) via 6 parallel audit agents

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 23 | Security vulnerabilities, broken core functionality, production-unsafe code |
| 🟠 High | 43 | Major UX issues, unwired features, architecture problems |
| 🟡 Medium | 79 | Mock data, missing features, incomplete CRUD, inconsistencies |
| 🔵 Low | 54 | Dead code, unused imports, minor polish |

**Total issues found: ~199 across 55 authenticated pages + public routes + backend API**
**Frontend: ~145 bugs | Backend: 54 bugs**

---

# PART 1: COMPLIANCE PAGES (BUG-001 → BUG-099)

## dashboard.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-002 | 🟠 High | Missing Feature | No error state handling — if `useDashboardOverview` returns an error, the component stays in loading state forever (only checks `overviewLoading || !data`). Should show error state when `isError` is true |
| BUG-003 | 🟡 Medium | Missing Feature | No refresh/reload mechanism — dashboard has no manual refresh button. Users can't force-refresh stale data |
| BUG-004 | 🟠 High | UI Bug | "What To Do Next" navigates via `navigate({ to: item.link })` but `item.link` is a string from the API. TanStack Router's `to` requires typed route paths — dynamic links with params will break |
| BUG-005 | 🟡 Medium | Missing Feature | Recent activity hard-sliced to 6 items with no pagination or "load more" |

## compliance.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-009 | 🟠 High | Mock Data | `samplePolicyText` is a ~600-word hardcoded fake HIPAA policy with fictional org "Sample Organization" and person "John Smith" |
| BUG-010 | 🟡 Medium | Hardcoded | Stat card shows `73` hardcoded for "HIPAA Requirements" — should come from API |
| BUG-011 | 🟡 Medium | UI Bug | Tab state via `useState` only checks URL param for `'findings'` — `?tab=calendar` won't work |
| BUG-012 | 🟡 Medium | UI Bug | Navigating away and back loses tab state — no URL sync |
| BUG-013 | 🟡 Medium | Unwired | Audit Pack tab has `enabled: false` — first click fetches with no loading skeleton |
| BUG-015 | 🟡 Medium | UI Bug | Running scan shows hardcoded `<Progress value={65}>` — fake progress not tied to actual analysis |
| BUG-016 | 🟡 Medium | Missing Feature | No pagination for compliance checks |
| BUG-017 | 🟡 Medium | Missing Feature | Compliance Calendar is read-only — can't create custom deadlines |
| BUG-018 | 🟡 Medium | Missing Feature | Calendar items have no edit/complete/dismiss actions |

## compliance-detail.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-021 | 🟠 High | Missing Feature | No export/download for compliance check results — auditors can't get PDF/CSV |
| BUG-022 | 🟠 High | Missing Feature | No remediation workflow from findings — `useCreateRemediationFromFinding` hook exists but never wired to UI |
| BUG-023 | 🟠 High | Missing Feature | No ability to update finding status — `updateFinding` service exists but not wired |
| BUG-025 | 🟡 Medium | Dead Code | `useScoreBreakdown(checkId)` is called but returned data is never used anywhere |
| BUG-026 | 🟡 Medium | Missing Feature | Gap cards show "Suggested Action" but no button to create a task or assign someone |

## compliance-code.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-027 | 🔵 Low | Dead Code | Unused imports: `RefreshCw`, `Zap`, `ArrowUpCircle`, `Settings2` |
| BUG-028 | 🟠 High | Unwired | Create Pipeline dialog doesn't let you select policies — `newPipeline.policies` always empty `[]` |
| BUG-029 | 🟡 Medium | Unwired | `newPipeline.notification_channels` always empty, no UI to configure |
| BUG-030 | 🟡 Medium | UI Bug | Delete policy uses browser `confirm()` instead of shadcn Dialog — inconsistent UX |
| BUG-031 | 🟡 Medium | Missing Feature | No code editor — policy source code in plain `<Textarea>` with no syntax highlighting |
| BUG-032 | 🟡 Medium | Missing Feature | No policy versioning UI — `usePolicyDiff` hook exists but never wired |
| BUG-033 | 🟡 Medium | Missing Feature | No policy validation before compile — `useValidatePolicy` hook exists but unused |
| BUG-034 | 🔵 Low | UI Bug | Template preview always appends `...` even when code < 120 characters |
| BUG-036 | 🔵 Low | Inconsistency | Local `StatusBadge` shadows shared component from `@/components/shared/status-badge` |

## compliance-costs.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-037 | 🟠 High | Hardcoded | `useBudgets(2025)` hardcodes fiscal year 2025 — will be wrong in 2026. Create Budget dialog also hardcodes 2025 |
| BUG-039 | 🟡 Medium | UI Bug | AddCostDialog hardcodes `period_start` to 30 days ago — no date picker |
| BUG-040 | 🟡 Medium | UI Bug | AddBenefitDialog hardcodes `period_start` to 1 year ago — no date picker |
| BUG-041 | 🟡 Medium | Missing Feature | Cost table limited to `.slice(0, 20)` — no pagination, excess silently hidden |
| BUG-042 | 🟡 Medium | Unwired | `useDeleteCost()` imported but no delete button exists |
| BUG-043 | 🟡 Medium | Missing Feature | No edit for cost entries — `useUpdateCost` exists but no UI |
| BUG-044 | 🟡 Medium | Missing Feature | No edit/delete for benefit entries |
| BUG-045 | 🟡 Medium | Missing Feature | No edit/delete for budget allocations |
| BUG-046 | 🔵 Low | Dead Code | `Briefcase` imported but unused |
| BUG-047 | 🔵 Low | Dead Code | `TrendingDown` imported but unused |
| BUG-048 | 🟡 Medium | UI Bug | `window.print()` prints entire page including nav/sidebar — needs print-optimized view |

## frameworks.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-051 | 🟡 Medium | Missing Feature | "Adopt Framework" has no confirmation — one-click immediately triggers mutation |
| BUG-052 | 🟡 Medium | Missing Feature | No ability to deactivate/remove an adopted framework |
| BUG-053 | 🟡 Medium | Missing Feature | Coverage Matrix has no export (CSV/PDF) |
| BUG-054 | 🟡 Medium | Missing Feature | Shared Evidence tab has no upload or link capability |

## regulations.tsx & controls.tsx & hipaa-roadmap.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-055+ | 🟡 Medium | Various | Multiple pages with no pagination, no export, limited CRUD operations |

---

# PART 2: RISK & OPERATIONS PAGES (BUG-100 → BUG-199)

## documents.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-100 | 🔵 Low | Dead Code | `Progress` imported but never used |
| BUG-101 | 🔵 Low | Dead Code | `formatNumber` imported but never used |
| BUG-103 | 🟡 Medium | Inconsistency | File filter accepts `.doc`/`.xls` but UI text only says "PDF, DOCX, XLSX" |
| BUG-104 | 🟠 High | Missing Validation | UI says "up to 50MB each" but NO client-side file size check — oversized files fail server-side with no clear feedback |
| BUG-105 | 🟡 Medium | UI Bug | Type filter missing `risk_assessment` and `training` types that upload dialog offers |
| BUG-106 | 🟠 High | Missing Feature | `Download` icon imported but NO download functionality anywhere — core feature missing |
| BUG-107 | 🟡 Medium | UI Bug | Table rows show `cursor-pointer` but clicking does nothing — no `onClick` handler |
| BUG-109 | 🟡 Medium | Missing Feature | No pagination for document table |
| BUG-110 | 🔵 Low | Code Quality | `any` type overuse — `detailsDoc`, `scanResult`, `filteredDocs.map((doc: any))` |

## evidence.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-111 | 🔵 Low | Dead Code | `ChevronRight`, `ChevronDown` imported but unused |
| BUG-113 | 🟠 High | Nonsensical | Page header says "Map evidence to controls for **SOC 2, ISO 27001**" — this is a HIPAA platform! Should reference HIPAA |
| BUG-114 | 🟠 High | Missing Feature | "Add Evidence" dialog creates metadata only — NO file upload. Evidence typically requires attached files |
| BUG-115 | 🟡 Medium | Missing Feature | No edit/delete for evidence items |
| BUG-116 | 🟡 Medium | Missing Feature | No pagination for controls list |
| BUG-117 | 🟡 Medium | Hardcoded | Evidence freshness uses hardcoded 90/180-day thresholds — should be configurable per HIPAA control |
| BUG-118 | 🟡 Medium | Missing Feature | Integration types limited to AWS/Azure/Okta/Google — missing EHR, SFTP, Microsoft 365 |

## risk-assessment.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-120 | 🔵 Low | Dead Code | `Search` imported but never used |
| BUG-121 | 🔴 Critical | Inconsistency | **Risk matrix thresholds differ between pages!** risk-assessment: Low 1-4, Med 5-9, High 10-14, Crit 15-25. risk-register: Low 1-5, Med 6-11, High 12-19, Crit 20-25. Same risk scored differently on different pages |
| BUG-122 | 🟡 Medium | UI Bug | Assessment description field uses `<Input>` instead of `<Textarea>` for multi-line text |
| BUG-123 | 🟡 Medium | Missing Feature | No delete assessment capability |
| BUG-124 | 🟡 Medium | Data Bug | Risk matrix uses `assessments.flatMap(a => a.risk_items)` but list-level data may not include full `risk_items` — matrix may show incomplete data |
| BUG-126 | 🔵 Low | Dead Code | `Calendar` imported but unused |

## risk-register.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-129 | 🟡 Medium | Missing Feature | `Search` icon imported but no search input exists |
| BUG-130 | 🟡 Medium | Missing Feature | No delete for risk items |
| BUG-132 | 🟡 Medium | Missing Feature | No pagination |
| BUG-133 | 🟡 Medium | Missing Feature | Details dialog is read-only — can't edit threat description, likelihood, impact, owner |

## risk-management.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-134 | 🔵 Low | Dead Code | Multiple unused imports: `Edit`, `Trash`, `Filter`, `Search`, `ChevronDown`, `TrendingDown` |
| BUG-135 | 🔵 Low | UI Bug | Double padding — component adds `p-6` when parent layout already provides it |
| BUG-136 | 🟠 High | Bug | Filter sends `strategy=all` and `status=all` as literal strings to API instead of omitting the param — backend may not handle "all" as a valid filter value |
| BUG-138 | 🟠 High | Unwired | Export button fetches data then discards it — `response body is discarded`, no actual file download triggered |
| BUG-139 | 🟡 Medium | Missing Feature | No delete for treatment plans or registers |
| BUG-140 | 🟡 Medium | Incomplete | Scoring model form only captures name + thresholds — API type has `likelihood_labels`, `impact_labels`, `factors`, `formula_type` all missing from form |
| BUG-141 | 🔵 Low | Dead Code | `useEffect` imported but never used |
| BUG-142 | 🟡 Medium | Code Quality | Inline `apiClient` calls bypass custom hooks — misses auth token refresh and error interceptors |

## risk-prioritization.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-144 | 🔵 Low | Inconsistency | Local `formatNumber` shadows imported util from `@/lib/utils` |
| BUG-145 | 🔵 Low | Inconsistency | Local `EmptyState` shadows shared component |
| BUG-146 | 🟡 Medium | Missing Feature | No `FeatureGate` — inconsistent with other risk pages |
| BUG-147 | 🟡 Medium | Security | "Calculate Priorities" button lacks `PermissionGate` — any user can trigger |
| BUG-150 | 🔵 Low | UI Bug | Duplicate "Calculate" buttons in both HeroSection and PageHeader |

## remediation.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-151 | 🔵 Low | Dead Code | `ArrowRight` imported but unused |
| BUG-152 | 🟡 Medium | Missing Feature | No summary stats cards (total, open, resolved counts) unlike other pages |
| BUG-153 | 🟡 Medium | UI Bug | Kanban board layout but NO drag-and-drop — status changes via dropdown only, breaks user expectations |

## auto-remediation.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-155+ | 🟡 Medium | Various | Multiple issues with mock data, missing pagination, limited CRUD |

## alerts.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-160+ | 🟡 Medium | Various | No pagination, limited actions on alerts |

## incidents.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-165+ | 🟡 Medium | Various | No pagination, limited incident management workflow |

---

# PART 3: AI & ADVANCED FEATURES (BUG-200 → BUG-274)

## ai-agent.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-200 | 🟡 Medium | Mock Data | `suggestedPrompts` — 6 static prompts, never personalized to user's compliance data |
| BUG-203 | 🟡 Medium | Mock Data | "Context" tab hardcodes "HIPAA Requirements (73 controls)" and 7 static data sources |
| BUG-204 | 🟡 Medium | Mock Data | 8 "Agent Capabilities" all show hardcoded green "active" status — never reflects real system health |
| BUG-206 | 🔴 Critical | Unwired | `handleLoadConversation` clears messages but **NEVER FETCHES conversation history** from API. User clicks a conversation → sees empty chat |
| BUG-207 | 🟡 Medium | Unwired | Source badges on AI messages have `cursor-pointer` but no `onClick` — can't view source documents |
| BUG-208 | 🟠 High | UI Bug | `controlIdInput` state is shared across 3 dialogs (Check Evidence, Generate Test, Remediation Plan) — opening one, entering value, canceling, then opening another shows stale value |
| BUG-210 | 🔵 Low | Dead Code | `Upload` icon imported but unused |
| BUG-211 | 🔵 Low | Dead Code | `Textarea` imported but never rendered |
| BUG-212 | 🔵 Low | Dead Code | `ChevronDown` imported but unused |
| BUG-213 | 🟡 Medium | Missing Feature | No streaming/SSE for AI responses — user sees "AI Agent is thinking..." with no progress |
| BUG-214 | 🟡 Medium | Missing Feature | No file upload capability for evidence or document analysis |
| BUG-215 | 🔵 Low | Missing Feature | No conversation rename — conversations show as "Untitled" with no way to change |

## ai-assistant.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-217 | 🟡 Medium | Inconsistency | `policyTypes` — 5 types vs ai-agent's 7 types. Different set, confusing |
| BUG-218 | 🔴 Critical | Unwired | Same as BUG-206 — clicking conversation in history never loads messages |
| BUG-219 | 🟠 High | UI Bug | Right sidebar hidden below `lg` breakpoint — on tablets, users lose access to insights, history, and policy generation entirely |
| BUG-220 | 🟠 High | Inconsistency | **Two separate AI chat pages** (ai-agent + ai-assistant) doing the same thing with different service layers and API endpoints. Confusing for users |
| BUG-221 | 🟡 Medium | Inconsistency | ai-assistant has minimal markdown renderer (bold + newlines only) while ai-agent has full markdown. Policy drafts render poorly on assistant |

## ai-governance.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-224 | 🟠 High | UI Bug | Delete AI system has NO confirmation dialog — single click permanently deletes |
| BUG-225 | 🟠 High | Missing Feature | No edit functionality — `useUpdateAISystem` exists but not wired to UI |
| BUG-226 | 🟡 Medium | Missing Feature | No pagination on AI systems, audit log, risk assessments, or policies |
| BUG-227 | 🟠 High | Nonsensical | Page subtitle says "EU AI Act compliance management" — this is a **HIPAA platform** for US healthcare orgs. EU AI Act framing is wrong audience |
| BUG-228 | 🟡 Medium | Nonsensical | Shows "EU AI Act Article Compliance" with article-by-article status — should show HIPAA-relevant AI governance |

## knowledge-graph.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-229 | 🟠 High | Missing Feature | "Knowledge Graph" page is actually a **list-based explorer** — no actual graph visualization. Name promises interactive network diagram, delivers filterable list |
| BUG-231 | 🟠 High | Missing Feature | No visual graph rendering (D3, Cytoscape, force-directed layout). Graph data exists (`nodes`, `links`) but displayed as lists/tables only |

## learning-engine.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-235 | 🟡 Medium | Missing Feature | No `FeatureGate` wrapper — inconsistent with other AI pages |
| BUG-236 | 🟠 High | Security | No `PermissionGate` on "Submit Correction" — any user can submit expert corrections, could corrupt training data |
| BUG-237 | 🟡 Medium | Missing Feature | No pagination on corrections, calibration cache, or pattern library |

## digital-twin.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-239 | 🟠 High | Mock Data | Simulation "Before" score hardcoded to `87.3` in multiple places — should come from simulation baseline data |
| BUG-240 | 🟡 Medium | UI Bug | Confidence interval Areas fill from 0 instead of between upper/lower bounds — visually incorrect |
| BUG-241 | 🟡 Medium | UI Bug | `Line` components inside `AreaChart` — should be `ComposedChart` for proper mixed rendering |
| BUG-243 | 🟠 High | Unwired | Simulation `parameters` hardcoded to `{ custom: true }` — no UI to specify actual simulation parameters |

## behavior-analytics.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-245 | 🔴 Critical | Security | **"Generate Demo Data" button exposed in production UI** — lets any user pollute real compliance data with fake behavioral events |
| BUG-246 | 🟠 High | Missing Feature | No ability to update anomaly status (investigate, confirm, dismiss, false positive) |
| BUG-247 | 🟡 Medium | Missing Feature | Detection rules are read-only — no create/edit/enable/disable |

## scanning.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-250+ | 🟡 Medium | Various | Limited scanning configuration options |

## insights.tsx & penalty-exposure.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-260+ | 🟡 Medium | Various | API wired but some display issues, hardcoded values |

---

# PART 4: VENDOR & PERSONNEL PAGES (BUG-300 → BUG-399)

## vendors.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-302 | 🟠 High | Missing Feature | No edit/delete for vendors — can create and assess but can't modify or remove |
| BUG-304 | 🟡 Medium | Missing Feature | No pagination |
| BUG-305 | 🟡 Medium | Bug | Risk Overview uses `baa_status_breakdown` as gate but shows risk-level data — wrong conditional |
| BUG-306 | 🟡 Medium | Inconsistency | High risk count from `summary.high_risk_vendors` but medium/low counted client-side. "Critical" level not represented at all |
| BUG-308 | 🟠 High | Missing Feature | No file upload for BAA documents — manages BAA metadata but can't attach actual BAA PDFs |

## vendor-risk.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-311 | 🟡 Medium | Missing Feature | API accepts `page` param but UI never provides pagination controls |
| BUG-313 | 🟡 Medium | UI Bug | Assessment can be submitted with only 1 of 20 questions answered — no minimum requirement |
| BUG-314 | 🟡 Medium | Missing Feature | No edit/delete for existing assessments |

## tprm.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-318 | 🟡 Medium | Dead Code | `selectedIntel` state and `intelData` query declared but NEVER rendered — fully dead/unwired code |
| BUG-319 | 🟠 High | Unwired | Discovery "View" button has empty click handler: `onClick={() => { /* view intel */ }}` — does nothing |
| BUG-321 | 🔴 Critical | UI Bug | Contract dialog uses `FormData` with Radix `Select` — Radix Select doesn't render native `<select>`, so `FormData` won't capture the vendor_id value. Contract creation silently fails to capture vendor |
| BUG-322 | 🟠 High | UI Bug | `auto_renew` Switch uses `name="auto_renew"` but Radix Switch doesn't serialize into FormData — `fd.get('auto_renew') === 'on'` always falsy |
| BUG-323 | 🟡 Medium | Missing Feature | No edit/delete for contracts |
| BUG-325 | 🟡 Medium | UI Bug | Lifecycle Pipeline 7-column grid unreadable on smaller screens — `text-[10px]` column headers |
| BUG-326 | 🟠 High | UI Bug | Clicking vendor card in Lifecycle Pipeline immediately advances to next stage — NO confirmation dialog. Accidental clicks irreversible |

## due-diligence.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-327 | 🟡 Medium | Missing Feature | No `FeatureGate` wrapper — inconsistent |
| BUG-328 | 🟡 Medium | Missing Feature | No edit/delete for projects |
| BUG-329 | 🟡 Medium | Missing Feature | No "Add Finding" or "Start Assessment" button — page is read-only display |

## contract-intelligence.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-334 | 🟠 High | Unwired | "Export Report" button has NO onClick handler — dead button |
| BUG-335 | 🟠 High | Unwired | Template "Generate" button has NO onClick — does nothing |
| BUG-336 | 🟠 High | Unwired | Template "Preview" button has NO onClick — does nothing |
| BUG-338 | 🟡 Medium | Missing Feature | No file upload for BAA documents — requires manually typing document ID |

## questionnaires.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-341 | 🔴 Critical | Bug | **`useState` misused as side-effect hook** in 3 places — `useState(() => { void loadData() })`. Data load won't re-trigger when filter dependencies change. Should be `useEffect` |
| BUG-342 | 🟡 Medium | Inconsistency | Uses raw `fetch` via `apiFetch` instead of `apiClient` (axios) used everywhere else — two auth patterns |
| BUG-343 | 🟠 High | Missing Feature | All `catch` blocks are empty — failed API calls produce NO user feedback whatsoever |
| BUG-344 | 🟠 High | Bug | Filter changes (type, status) update state but DON'T trigger data re-fetch — side effect of BUG-341 |
| BUG-347 | 🟠 High | Unwired | Export (PDF/DOCX/CSV) fires API call but has NO download logic — response silently discarded |
| BUG-348 | 🟡 Medium | UI Bug | "Send" button sends questionnaire with no confirmation dialog — single misclick sends |

## personnel.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-351 | 🔵 Low | Dead Code | `ClipboardCheck` imported but unused |
| BUG-352 | 🟡 Medium | Missing Feature | No pagination on employee directory, tasks, access records, or workflows |
| BUG-353 | 🟠 High | Bug | Employee data uses `Record<string, unknown>` with many `as string`/`as number` casts — if API returns null for `full_name`, `.split(' ')` will crash |

## employee-compliance.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-355+ | 🟡 Medium | Various | Mock data, limited CRUD, no pagination |

## training.tsx & security-training.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-360+ | 🟡 Medium | Various | Limited functionality, mock data in training modules |

## collaboration.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-370+ | 🟡 Medium | Various | Mock data, limited real-time collaboration features |

---

# PART 5: ADMIN, SETTINGS & AUTH PAGES (BUG-400 → BUG-499)

## settings.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-400 | 🟠 High | Unwired | Session Timeout `<Select>` has NO `onValueChange` handler — changing it does nothing |
| BUG-401 | 🟡 Medium | Unwired | "Edit" and "Change Role" on users permanently disabled with "Soon" badge |
| BUG-404 | 🔴 Critical | Security | `handleInviteUser` generates password with `crypto.randomUUID()` and **displays it in cleartext toast for 15 seconds**. Should use email invite flow instead |
| BUG-405 | 🟠 High | UI Bug | Deactivate user calls `DELETE /users/{id}` with NO confirmation dialog — mis-click permanently deletes |

## platform-settings.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-407 | 🟠 High | UI Bug | SSO form fields never pre-populated from existing `ssoConfig` — always shows empty even when SSO already configured |
| BUG-408 | 🟡 Medium | UI Bug | SCIM copy-to-clipboard uses single `copied` boolean for both URL and Token — clicking one shows check on both |
| BUG-409 | 🟡 Medium | Unwired | "View" button on system roles permanently disabled |
| BUG-410 | 🟠 High | Bug | Event Log JSON export fetches data but does NOTHING with it — no download triggered (CSV works) |
| BUG-411 | 🟠 High | Bug | "Switch to Workspace" calls API but doesn't reload page or update UI state — user has no feedback |

## onboarding.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-413 | 🟡 Medium | UI Bug | Team step enforces minimum 1 member but text says "You can add more later" — contradictory UX |
| BUG-414 | 🟠 High | Unwired | Documents step only records checkboxes — NO actual file upload despite Upload icon suggesting it |
| BUG-415 | 🔵 Low | Dead Code | `INDUSTRY_LABELS` map defined but `<Select>` uses hardcoded labels instead |
| BUG-417 | 🟡 Medium | Unwired | `uploadedDocTypes` saved as step data but has no effect on compliance dashboard |

## enterprise-integrations.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-418 | 🟡 Medium | Bug | `available: undefined` from catalog shows as available — no explicit false-check |
| BUG-420 | 🟡 Medium | Missing Feature | No pagination on Findings tab |

## customer-portal.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-421 | 🔴 Critical | Mock Data | Extensive hardcoded mock arrays: 3 portals, 7 visitors, 5 docs, 5 inquiries with full mock analytics. Always shows fake data |
| BUG-422 | 🟡 Medium | Mock Data | `mockAnalytics.visitor_trends` uses `Math.random()` — produces different fake data on every render |
| BUG-423 | 🟠 High | Unwired | Portal "View" button has NO onClick handler |
| BUG-424 | 🔴 Critical | Bug | `allVisitors`, `allDocuments`, `allInquiries` hardcoded to mock arrays regardless of API response — even real API data is ignored |
| BUG-426 | 🟡 Medium | Missing Feature | No file upload for portal documents |

## trust-center-admin.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-428 | 🟡 Medium | UI Bug | Color inputs require typing hex codes — no `type="color"` picker |
| BUG-429 | 🟡 Medium | Hardcoded | "View Public Page" links to `/trust-center/demo-healthcare` — should use tenant's actual slug |
| BUG-430 | 🔵 Low | Dead Code | `TrendingUp`, `ArrowUpRight`, `ChevronDown`, `ChevronUp` all unused |

## reports.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-431 | 🟠 High | Bug | XLSX download actually generates CSV — no real XLSX generation. Toast misleadingly says "open in Excel" |
| BUG-432 | 🟡 Medium | Nonsensical | Report generator offers GDPR, SOC2, PCI-DSS, ISO27001 frameworks — not yet supported, will return empty data |
| BUG-433 | 🔵 Low | Dead Code | `formatPercent` imported but never used |

## advanced-reports.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-435 | 🟠 High | Missing Feature | Generated report preview has no download button — user sees data but can't export |
| BUG-436 | 🔵 Low | Dead Code | `PieChart`, `Pie`, `Cell` imported from recharts but unused |
| BUG-437 | 🔵 Low | Dead Code | `CHART_COLORS` defined but never referenced |
| BUG-438 | 🔵 Low | Dead Code | `Search`, `Filter`, `RefreshCw`, `ArrowUpRight`, `ArrowDownRight` all unused |

## audit-reports.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-439 | 🟠 High | Bug | `handleGenerate` and `handleArchive` swallow errors silently — empty `catch {}` blocks |
| BUG-440 | 🟠 High | Missing Feature | No PDF/CSV/Excel export on generated audit reports — defeat the purpose of audit reports |
| BUG-441 | 🟡 Medium | Code Quality | Uses manual `useState` + `useEffect` + `apiClient` instead of `useQuery` hooks — inconsistent with codebase |

## audit-trail.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-442 | 🟠 High | Unwired | "Export CSV" button permanently disabled with "Coming Soon" |
| BUG-443 | 🟡 Medium | Missing Feature | No pagination — all audit logs rendered at once. HIPAA trails can be massive |
| BUG-444 | 🟠 High | Missing Feature | No date range filter — HIPAA audits need time-based queries |

## policy-templates.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-446 | 🟡 Medium | UI Bug | Markdown renderer only handles `#`, `##`, `**`, blank lines — no lists, links, code blocks. Policies likely use these |
| BUG-447 | 🟡 Medium | Missing Feature | No edit capability for adopted policies |
| BUG-448 | 🟡 Medium | UI Bug | List view "Adopt" uses Download icon — confusing. Grid view correctly uses CheckCircle |

## breach-sim.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-449 | 🟠 High | Unwired | "Export PDF" button only shows toast — no actual PDF generation or download |
| BUG-450 | 🟡 Medium | Hardcoded | AI scenario generation hardcodes `ransomware/high/EHR System` — no user customization |
| BUG-451 | 🟡 Medium | Missing Feature | Schedule Exercise dialog only has scenario selector — no fields for name, facilitator, participants |

## regulatory-radar.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-453+ | 🟡 Medium | Various | Barely wired — 1 API call, 4 mock references |

## assets.tsx
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-456+ | 🟡 Medium | Various | Heavy mock fallback — 35 API calls but 16 mock references |

## Auth Pages (login, signup, forgot-password, reset-password)
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-460+ | 🟡 Medium | Various | Need review for proper validation, error handling, rate limiting |

## Admin Routes (admin/dashboard, tenants, billing, packages, monitoring)
| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-470+ | 🟡 Medium | Various | Admin panel pages need auth verification, audit logging |

---

# CROSS-CUTTING ISSUES (Systemic)

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| SYS-001 | 🔴 Critical | Consistency | **Risk scoring thresholds differ between pages** (BUG-121/127). Same risk item gets different severity labels depending on which page you view it on |
| SYS-002 | 🟠 High | Missing Feature | **No pagination on ~40+ pages**. Every list/table renders all data at once. Will break with real production data volumes |
| SYS-003 | 🟠 High | Missing Feature | **No export/download on most pages**. Audit reports, compliance results, evidence — none can be exported for external auditors |
| SYS-004 | 🟠 High | Missing Feature | **No edit/delete CRUD on most entities**. Users can create but rarely update or delete — breaks basic usability |
| SYS-005 | 🟡 Medium | Consistency | **~30+ unused imports across the codebase**. Not functionally broken but indicates copy-paste development |
| SYS-006 | 🟠 High | Mock Data | **~26 pages still running on entirely mock/hardcoded data** (see MVP-AUDIT.md) |
| SYS-007 | 🔴 Critical | Nonsensical | **SOC 2/ISO 27001/EU AI Act references on a HIPAA-first platform**. Evidence page, AI governance page, and report generator reference wrong frameworks |
| SYS-008 | 🟠 High | Security | **Multiple delete actions without confirmation dialogs** (BUG-224, BUG-405, BUG-326) |
| SYS-009 | 🟠 High | Unwired | **Multiple export buttons that do nothing** (BUG-138, BUG-334, BUG-347, BUG-449) — fetch data then discard response |
| SYS-010 | 🔴 Critical | Duplicate | **Two AI chat pages** (ai-agent + ai-assistant) with different service layers doing the same thing |
| SYS-011 | 🟠 High | Missing Feature | **No file upload on evidence, documents detail, BAA management** — core compliance workflow requires attaching files |

---

# PART 6: BACKEND API (BUG-500 → BUG-564)

**54 backend bugs found. 13 CRITICAL (mostly security).**

## 🔴 CRITICAL — Security (IMMEDIATE ACTION REQUIRED)

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-500 | 🔴 Critical | Security | **`GET /api/v1/debug/bootstrap-admin` creates superadmin with password `superadmin123` — NO AUTH REQUIRED.** Complete platform takeover |
| BUG-501 | 🔴 Critical | Security | **`GET /api/v1/debug/delete-tenant/{id}` deletes any tenant — NO AUTH, uses GET for destructive op** |
| BUG-502 | 🔴 Critical | Security | `GET /api/v1/debug/admin-check` lists all admin users (IDs, emails, roles) — no auth |
| BUG-503 | 🔴 Critical | Security | `GET /api/v1/debug/email-config` exposes API key prefix, from email, frontend URL — no auth |
| BUG-504 | 🔴 Critical | Security | `GET /api/v1/debug/email-test` sends emails to hardcoded `shyam.sedai3@gmail.com` — no auth, potential spam relay |
| BUG-505 | 🔴 Critical | Security | `GET /api/v1/debug/list-tenants` lists ALL tenants (IDs, names, slugs) — no auth |
| BUG-506 | 🔴 Critical | Security | `SECRET_KEY` defaults to `"change-me-in-production-super-secret-key-12345"` — token forgery if .env missing |
| BUG-507 | 🔴 Critical | Security | `ADMIN_SECRET_KEY` defaults to `"admin-super-secret-key-change-in-production-98765"` |
| BUG-508 | 🔴 Critical | Security | Bootstrap admin uses hardcoded password `superadmin123` |
| BUG-509 | 🔴 Critical | Security | Logout endpoint does NOT invalidate JWT — stolen tokens remain valid until expiry |
| BUG-510 | 🔴 Critical | Security | No password complexity validation on signup — accepts single-character passwords |
| BUG-511 | 🔴 Critical | Security | Evidence schedules endpoints have NO auth guards — unauthenticated access defaults to "default" tenant |
| BUG-512 | 🔴 Critical | Security | Onboarding endpoints lack formal auth dependency — `get_tenant_id_from_request()` silently returns None |

## 🟠 HIGH — Architecture & Data

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-513 | 🟠 High | Architecture | **Dual ORM model definitions** — `models/` (dead code, never imported) vs `core/db.py` (actually used). Two completely different schemas for same concepts |
| BUG-514 | 🟠 High | Architecture | Dual async/sync database layer — `core/database.py` (async, unused) vs `core/db.py` (sync, used) |
| BUG-515 | 🟠 High | Dead Code | `api/deps.py` defines `get_db`, `get_current_user`, etc. — NONE used by any endpoint |
| BUG-516 | 🟠 High | Architecture | **No database migration system** — no Alembic. Tables created via `create_all()`. Cannot safely evolve schema |
| BUG-517 | 🟠 High | Performance | All async endpoints use synchronous DB sessions — blocks event loop, kills concurrency under load |
| BUG-518 | 🟠 High | Security | Exception handler leaks `str(exc)` when DEBUG=True (which is the default) |
| BUG-524 | 🟠 High | Security | **Cross-tenant vulnerability**: `PUT /risk-register/items/{id}` queries by ID only — no tenant scoping. User from tenant A can modify tenant B's risk items |
| BUG-545 | 🟠 High | Security | CORS allows `localhost:3000/5173/8080` with credentials in production |

## 🟡 MEDIUM — Incomplete Endpoints & Validation

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-519 | 🟡 Medium | Incomplete | Non-HIPAA compliance checks create permanently "pending" records that never analyze |
| BUG-520 | 🟡 Medium | Mock Data | Non-HIPAA regulation requirements return 3 hardcoded "Mock requirement - coming soon" items |
| BUG-521 | 🟡 Medium | Mock Data | GDPR, SOC2, PCI, ISO, NIST defined as in-memory dicts with `is_real: False` and fabricated requirement counts |
| BUG-522 | 🟡 Medium | Incomplete | Remediation `finding` and `gap` fields always return None in list endpoints |
| BUG-523 | 🟡 Medium | Missing CRUD | Risk register has no DELETE endpoint — data can never be removed |
| BUG-526 | 🟡 Medium | Security | No rate limiting on login — vulnerable to brute-force/credential stuffing |
| BUG-527 | 🟡 Medium | Security | No rate limiting on signup — unlimited tenant creation |
| BUG-528 | 🟡 Medium | Validation | `PUT /documents/{id}` accepts raw `dict` — no Pydantic model, `setattr()` on arbitrary fields |
| BUG-529 | 🟡 Medium | Validation | `PUT /findings/{id}` accepts raw `dict` — status not validated against enum |
| BUG-530 | 🟡 Medium | Validation | `POST /users` accepts raw `dict` — no email format or password validation |
| BUG-531 | 🟡 Medium | Validation | `PUT /users/{id}` accepts raw `dict` — role value not validated |
| BUG-532 | 🟡 Medium | Security | Default password `changeme123` when not provided in user creation |
| BUG-533 | 🟡 Medium | Security | Broad `Exception as e` returns `str(e)` — leaks SQL errors, file paths to client |
| BUG-534 | 🟡 Medium | Security | No file size limit on document upload — reads full file into memory, DoS risk |
| BUG-535 | 🟡 Medium | Security | No content-type validation on document upload — any file type accepted |
| BUG-546 | 🟡 Medium | Config | `DEBUG` defaults to `True` — production without explicit override runs debug mode |
| BUG-548 | 🟡 Medium | Missing Feature | Audit trail has no export endpoint — needed for external compliance audits |
| BUG-549 | 🟡 Medium | Missing Feature | No password change endpoint for authenticated users |
| BUG-550 | 🟡 Medium | Missing Feature | No user profile self-update endpoint (`PUT /users/me`) |
| BUG-558 | 🟡 Medium | Inconsistency | Trial period: code says 30 days, docstring says 14 days |

## 🔵 LOW — Code Quality

| ID | Severity | Category | Description |
|----|----------|----------|-------------|
| BUG-537 | 🔵 Low | Dead Code | `models/` directory has ~10 models, `core/db.py` has 50+. Models dir is dead code |
| BUG-539 | 🔵 Low | Dead Code | `schemas/auth.py` and `schemas/common.py` define response models never used as `response_model` |
| BUG-540 | 🔵 Low | Dead Code | `api/middleware/` package exists with empty `__init__.py` |
| BUG-555 | 🔵 Low | Inconsistency | Inconsistent `get_db_session()` usage — sometimes context manager, sometimes manual close |
| BUG-556 | 🔵 Low | Privacy | Hardcoded personal email `shyam.sedai3@gmail.com` in production code |
| BUG-557 | 🔵 Low | Architecture | Regulatory radar background worker won't complete on serverless (Vercel) |
| BUG-559 | 🔵 Low | Performance | Dashboard `_build_improvement_suggestions` runs N+1 queries |
| BUG-562 | 🔵 Low | Security | OpenAPI docs publicly accessible at `/docs` and `/redoc` in production |
| BUG-563 | 🔵 Low | Security | No HTTPS enforcement — API serves over HTTP |
| BUG-564 | 🔵 Low | Missing Feature | No request logging middleware — HIPAA requires API access audit trail |

---

# PRIORITY FIX ORDER (Recommended)

## 🚨 DAY 1 — SECURITY EMERGENCY (Do this TODAY)
1. **BUG-500→505**: DELETE or protect ALL 6 debug endpoints in `health.py` — they allow unauthenticated admin takeover RIGHT NOW
2. **BUG-506/507**: Enforce non-default SECRET_KEY and ADMIN_SECRET_KEY in production (fail startup if defaults)
3. **BUG-508**: Remove hardcoded `superadmin123` password
4. **BUG-524**: Fix cross-tenant vulnerability in risk register — add tenant scoping to PUT endpoint
5. **BUG-404**: Replace cleartext password in toast with email invite flow
6. **BUG-245**: Remove "Generate Demo Data" button from production UI
7. **BUG-546**: Change DEBUG default to False

## Week 1: Critical & High Blockers
8. **BUG-509**: Implement token invalidation on logout (Redis blocklist)
9. **BUG-510/532**: Add password complexity validation on signup + remove default password
10. **BUG-511/512**: Add auth guards to evidence_schedules and onboarding endpoints
11. **SYS-001/BUG-121/127**: Standardize risk scoring thresholds across ALL pages
12. **BUG-206/218**: Wire conversation loading in AI chat pages
13. **BUG-321/322**: Fix FormData incompatibility with Radix components in TPRM
14. **BUG-341**: Fix useState misuse as useEffect in questionnaires
15. **BUG-421/424**: Remove mock data fallbacks in customer-portal
16. **SYS-007**: Replace SOC 2/ISO/EU AI Act references with HIPAA language
17. **BUG-513/514/515**: Consolidate dual ORM model layer (remove dead `models/` dir)
18. **BUG-516**: Add Alembic database migration infrastructure

## Week 2: High Priority UX & Data
19. **SYS-002**: Add pagination to all list/table pages (~40 pages need this)
20. **SYS-004**: Add edit/delete CRUD operations across entities
21. **SYS-009**: Fix all broken export buttons (BUG-138, 334, 347, 449, etc.)
22. **SYS-011**: Add file upload to evidence, documents, BAA management
23. **BUG-526/527**: Add rate limiting to login and signup endpoints
24. **BUG-528→531**: Replace raw `dict` request bodies with Pydantic models
25. **BUG-534/535**: Add file size and content-type validation on uploads
26. Wire remaining mock-only pages to API (26 pages still on mock data)

## Week 3: Polish & Ship
27. **SYS-005**: Clean up ~30+ unused imports across frontend
28. **BUG-562**: Disable OpenAPI docs in production
29. **BUG-563/564**: Add HTTPS enforcement and request logging middleware
30. **SYS-010**: Consolidate or differentiate the two AI chat pages
31. Fix remaining medium/low bugs
32. Final regression testing on dev.shieldra.ai
