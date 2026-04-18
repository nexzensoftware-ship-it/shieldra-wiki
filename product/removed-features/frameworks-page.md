# Frameworks Page — Removed from MVP

**Removed:** 2026-02-26
**Reason:** Professional-tier feature with complex multi-framework cross-mapping. Overkill for MVP — most early customers are focused on a single framework (HIPAA). Requires populated framework requirement data and evidence mappings to be useful.

---

## What It Does

4-tab interface for managing multiple compliance frameworks (SOC 2, HITRUST, ISO 27001, etc.) alongside HIPAA.

### Overview Tab
- Active Frameworks list with circular progress indicators and requirement counts
- Available Frameworks that can be adopted
- Stats: Active Frameworks count, Overall Compliance %, Cross-Mappings total, Evidence items
- API: `GET /frameworks/`, `GET /frameworks/dashboard`, `POST /frameworks/{id}/adopt`

### Coverage Matrix Tab
- Cross-tabular view: frameworks (columns) vs requirement categories (rows)
- Coverage % per framework-category intersection
- API: `GET /frameworks/coverage-matrix`

### Shared Evidence Tab
- Evidence items that satisfy multiple frameworks simultaneously
- Shows which frameworks each evidence item covers, evidence freshness
- API: `GET /frameworks/shared-evidence`

### Gap Analysis Tab
- Marginal effort cards per framework (gaps count, estimated hours, estimated cost)
- Quick-wins and gap tables sorted by priority
- API: `GET /frameworks/marginal-effort`, `GET /frameworks/{id}/gap-analysis`

---

## Backend (Still in Place — Not Removed)

`apps/api/src/api/v1/endpoints/frameworks.py` — all endpoints kept, only removed from router registration.

---

## How to Re-Activate

1. **Sidebar** (`apps/web/src/components/layout/sidebar.tsx`):
   - Add `Layers` back to lucide-react imports
   - Add `'/frameworks': 'compliance.view'` to `NAV_ROUTE_PERMISSIONS`
   - Add `{ name: 'Frameworks', href: '/frameworks', icon: Layers, feature: 'frameworks' }` to compliance group (after Compliance, before Controls)

2. **Route Tree** (`apps/web/src/app/route-tree.ts`):
   - Add `import { frameworksRoute } from './routes/_authenticated/frameworks'`
   - Add `frameworksRoute` to `authenticatedChildren`

3. **Feature Registry** (`apps/web/src/lib/feature-registry.ts`):
   - Add `frameworks: { slug: 'frameworks', name: 'Multi-Framework', description: 'SOC 2, HITRUST, ISO 27001 frameworks', category: 'compliance_management', defaultTier: 'professional', route: '/frameworks' }`

4. **Backend Router** (`apps/api/src/api/v1/router.py`):
   - Add `frameworks,` to imports
   - Add `api_v1_router.include_router(frameworks.router, prefix="/frameworks", tags=["Frameworks"])`

5. **Route Permissions** (`apps/web/src/app/routes/_authenticated.tsx`):
   - Add `'/frameworks': 'compliance.view'`

### Hooks file
`apps/web/src/hooks/use-frameworks.ts` — kept in place.
### Service file
`apps/web/src/services/frameworks.ts` — kept in place.
### Page component
`apps/web/src/app/routes/_authenticated/frameworks.tsx` — kept in place.
