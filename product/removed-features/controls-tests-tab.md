# Controls Library — Tests Tab — Removed from MVP

**Removed:** 2026-02-25
**Reason:** Broken by design for MVP — the list endpoint doesn't include tests, so the tab always shows empty. Tests can still be added/run per-control from inside the control detail dialog.

---

## What It Does

A flat, cross-control view of all compliance control tests. Aggregates tests from every control into a single searchable/filterable table.

### Stats Bar (5 cards)
- Total Tests | Passing | Failing | Pending | Pass Rate %

### Table Columns
- Test Name + description
- Control (code → name)
- Type (badge)
- Status: passing / failing / pending / error
- SLA: on_track / at_risk / breached
- Frequency
- Last Run date
- Next Run date
- Actions: **Run** (Play) | **Delete** (Trash)

### Filters
- Search by test name, control code, or control name
- Filter by status

---

## Root Cause of Emptiness

The tab reads `ctrl.tests` from the controls list response, but `GET /api/v1/controls` does **not** include the `tests` array — only `GET /api/v1/controls/{id}` (detail) does. So `allTests` is always `[]`.

**Fix needed to re-enable:**
1. Add `tests` array to the controls list serializer in `apps/api/src/api/v1/endpoints/controls.py`, OR
2. Add a dedicated `GET /api/v1/control-tests` endpoint that returns all tests across controls for a tenant

---

## Where Tests Still Work (Not Removed)

Tests are **still fully functional** from within the control detail dialog:
- Click any control row → opens detail dialog
- Bottom section shows that control's tests
- Can **Run** or **Delete** individual tests
- Can **Add Test** via `POST /api/v1/controls/{id}/tests`

---

## How to Re-Activate

1. Fix the data source (see "Root Cause" above)
2. In `apps/web/src/app/routes/_authenticated/controls.tsx`:
   - Change `grid-cols-3` back to `grid-cols-4` in `<TabsList>`
   - Re-add `<TabsTrigger value="tests">` block
   - Re-add `<TabsContent value="tests"><TestsTab /></TabsContent>`
   - Restore the `TestsTab` function (~174 lines, removed from around line 857)

### TestsTab component summary
```tsx
function TestsTab() {
  // Hooks: useControls(), useRunTest(), useDeleteControlTest(), useMonitoringStatus()
  // Flattens ctrl.tests from all controls into allTests[]
  // Renders: 5 stat cards + search/filter bar + table with run/delete actions
}
```
