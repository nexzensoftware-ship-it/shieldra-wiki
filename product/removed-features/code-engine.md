# Code Engine (Compliance as Code) — Removed from MVP

**Removed:** 2026-02-25
**Reason:** Overkill for MVP scope. Feature is fully implemented and preserved in source files for future re-activation.

---

## What It Is

Code Engine lets users write, compile, execute, and deploy compliance policy rules as code (Rego, Python, YAML, or JSON). It treats compliance as a software engineering discipline — policies are version-controlled, testable, and deployable to different environments.

---

## UI: 5 Tabs

### 1. Policy Studio
- Create, list, search, and filter compliance policies
- Filter by language (rego / python / yaml / json), status (deployed / compiled / draft / failed), severity
- Actions per policy: **Compile**, **Run** (execute), **Deploy**, **Delete**
- Shows: name, language, status, severity, version, pass rate, last run date
- Dialog for creating a new policy with a code editor textarea

### 2. Template Library
- Browse pre-built policy templates
- Categories: encryption, access_control, network, logging, data_protection, backup, authentication
- Preview template source code inline
- "Use Template" button to instantiate a policy from a template with variable substitution

### 3. Execution Console
- Full execution history across all policies
- Filter by status (passed / failed / running / error) and environment (prod / staging / dev)
- Shows: policy name, execution type, status, passed/failed check counts, timestamp
- Expandable rows showing individual check results

### 4. Pipelines
- Create compliance check pipelines that bundle multiple policies
- Configure: name, description, cron schedule, environment, list of policies to include
- Shows: active/inactive status, last run status, schedule, policy count, environment
- "Run" button to trigger a full pipeline execution

### 5. Metrics
- 30-day pass rate trend (area chart)
- Compliance score trend (line chart)
- Coverage heatmap by category
- Drift detection alerts
- Top failing policies table

### Dashboard Stats Bar
- Total Policies | Deployed Policies | Avg Pass Rate | Active Pipelines

---

## Backend API Endpoints

All under `/api/v1/compliance-code`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Stats, pass rates, recent executions, policy health |
| GET | `/policies` | List with filters (language, status, severity, search) |
| POST | `/policies` | Create new policy |
| GET | `/policies/{id}` | Get detail with execution history |
| PUT | `/policies/{id}` | Update policy |
| DELETE | `/policies/{id}` | Delete policy |
| POST | `/policies/{id}/compile` | Compile/validate policy syntax |
| POST | `/policies/{id}/execute` | Run policy check (simulated results) |
| POST | `/policies/{id}/deploy` | Deploy to production |
| GET | `/executions` | List execution history (filter: status, env, policy_id) |
| GET | `/executions/{id}` | Execution detail with results |
| GET | `/templates` | List templates by category |
| POST | `/templates/{id}/instantiate` | Create policy from template |
| GET | `/pipelines` | List compliance pipelines |
| POST | `/pipelines` | Create pipeline |
| PUT | `/pipelines/{id}` | Update pipeline |
| POST | `/pipelines/{id}/run` | Trigger pipeline execution |
| GET | `/metrics` | Pass rate trends, coverage, drift detection |
| GET | `/diff/{id}` | Policy version diff |
| POST | `/validate` | Validate policy syntax without saving |

---

## Data Models

### ComplianceCodePolicy
- `id`, `tenant_id`, `name`, `description`
- `language`: `rego | python | yaml | json`
- `source_code`, `compiled_status`: `draft | compiled | failed | deployed`
- `version`, `framework_id`, `requirement_ref`
- `severity`: `critical | high | medium | low`
- `auto_remediate`, `pass_rate`, `created_by`
- Timestamps: `last_compiled_at`, `last_run_at`, `created_at`, `updated_at`

### PolicyCodeExecution
- `id`, `tenant_id`, `policy_id`
- `execution_type`: `manual | scheduled | triggered | ci_cd`
- `status`: `passed | failed | running | error`
- `total_checks`, `passed_checks`, `failed_checks`
- `results` (array of check outcomes), `triggered_by`
- `environment`: `prod | staging | dev`
- Timestamps: `started_at`, `completed_at`, `created_at`

### CodePolicyTemplate
- `id`, `tenant_id`, `name`, `description`, `category`
- `language`, `template_code`, `variables` (dict)
- `is_builtin`, `usage_count`, `created_at`

### CompliancePipeline
- `id`, `tenant_id`, `name`, `description`
- `policies` (list of policy IDs), `schedule` (cron)
- `is_active`, `notification_channels`
- `environment`: `prod | staging | dev`
- `last_run_at`, `last_run_status`
- Timestamps: `created_at`, `updated_at`

---

## Feature Gate
- **Feature slug:** `compliance_code`
- **Tier:** Enterprise
- **Permissions:** `compliance.view` (read), `compliance.manage` (write/execute)

---

## Files (All Preserved — Nothing Deleted)

| File | Description |
|------|-------------|
| `apps/web/src/app/routes/_authenticated/compliance-code.tsx` | Full React page (~948 lines), 5 tabs |
| `apps/web/src/services/compliance-code.ts` | API client service (~259 lines) |
| `apps/web/src/hooks/use-compliance-code.ts` | TanStack Query hooks (~212 lines) |
| `apps/api/src/api/v1/endpoints/compliance_code.py` | FastAPI router (~880 lines) |

---

## How to Re-Activate

1. **Sidebar** (`apps/web/src/components/layout/sidebar.tsx`):
   - Add to `routePermissions`: `'/compliance-code': 'compliance.view'`
   - Add to compliance group in `navGroups`: `{ name: 'Code Engine', href: '/compliance-code', icon: Code2, feature: 'compliance_code' }`

2. **Route Tree** (`apps/web/src/app/route-tree.ts`):
   - Add import: `import { complianceCodeRoute } from './routes/_authenticated/compliance-code'`
   - Add to `authenticatedChildren`: `complianceCodeRoute`

3. **Feature Registry** (`apps/web/src/lib/feature-registry.ts`):
   - Add to `FEATURE_METADATA`: `compliance_code: { slug: 'compliance_code', name: 'Compliance as Code', description: 'Programmatic compliance rules', category: 'compliance_management', defaultTier: 'enterprise', route: '/compliance-code' }`

4. **Backend Router** (`apps/api/src/api/v1/router.py`):
   - Add to imports: `compliance_code,`
   - Add router: `api_v1_router.include_router(compliance_code.router, prefix="/compliance-code", tags=["Compliance as Code"])`
