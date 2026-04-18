# Controls Library — Framework Coverage Tab — Removed from MVP

**Removed:** 2026-02-26
**Reason:** Requires controls to be imported AND requirement mappings to be set before showing meaningful data. `total_requirements_covered` always shows 0 with no seeded framework requirements in the DB, making the tab feel broken for new users.

---

## What It Does

Shows how well imported controls cover compliance framework requirements, broken into three sections:

### KPI Cards (4)
- Overall Coverage % (color-coded progress bar)
- Total Controls
- Implemented count
- Requirements Covered count

### Coverage by Category
- Stacked progress bar per category (green = implemented, yellow = partial)
- Coverage % label per category

### Gap Analysis Table
- 7 columns: Category | Total | Implemented | Partial | Gaps | Coverage % | Status
- Status badges: "Good" (≥80%) | "Needs Work" (50-80%) | "Critical Gap" (<50%)

---

## Root Cause of Limited Value

The tab works fine but only shows useful data when:
1. Controls are imported from the library
2. Implementation statuses are set (Implemented / Partial)
3. Controls are **mapped to requirement IDs** via `POST /api/v1/controls/map-to-framework`

Step 3 is the blocker — no HIPAA/SOC2/etc. requirement IDs are seeded in the DB, so `total_requirements_covered` is always 0. Category coverage % works fine but requires steps 1+2.

---

## Backend (Still in Place — Not Removed)

`GET /api/v1/controls/framework-coverage` in `apps/api/src/api/v1/endpoints/controls.py`

Aggregates controls by category, calculates `(implemented + partial*0.5) / total * 100` per category, and returns unique `mapped_requirements` across all controls.

---

## How to Re-Activate

1. In `apps/web/src/app/routes/_authenticated/controls.tsx`:
   - Change `grid-cols-2` back to `grid-cols-3` in `<TabsList>`
   - Re-add `<TabsTrigger value="coverage">` block (with `BarChart3` icon)
   - Re-add `<TabsContent value="coverage"><CoverageTab /></TabsContent>`
   - Restore the `CoverageTab` function (~173 lines, removed from around line 1118)

2. Re-add `useFrameworkCoverage` to the hook imports at the top of controls.tsx

### CoverageTab component summary
```tsx
function CoverageTab() {
  // Hooks: useFrameworkCoverage()
  // Renders: 4 KPI cards + per-category stacked progress bars + gap analysis table
  // Empty state: "No controls imported yet. Import controls from the library..."
}
```

### Fix needed to make Requirements Covered meaningful:
- Seed framework requirement IDs into the DB (e.g. HIPAA §164.312(a)(1) → unique ID)
- OR: Load from `apps/api/src/hipaa/knowledge_base.py` requirement IDs at import time
- Then auto-map imported controls to their requirements during `POST /controls/import`
