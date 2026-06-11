# Shieldra Web (apps/web) — Enterprise Code Audit

**Scope:** `/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/src/`
**Date:** 2026-04-18
**Reviewer model:** Claude Opus 4.7

**Quick numbers:**
- TypeScript files scanned: ~105,605 LOC across ~300 files
- Pages > 1000 lines: 38
- Pages > 300 lines total: 79
- `any` / `as any` occurrences in `src/`: 168
- Pages calling `apiClient` directly (bypassing `services/` + `hooks/`): 24 of 54
- Routes registered in `route-tree.ts` but not linked from `sidebar.tsx`: 24
- Orphan route stub files not registered anywhere: 4
- Dead `.tsx` / `.ts` modules never imported: 10
- Unused npm `dependencies`: 8

## Summary

The frontend is an ambitious TanStack Router + React 19 SPA with ~50 feature pages, but its quality is dominated by a handful of runaway page files (4,193-line `enterprise-integrations.page.tsx`, 2,451-line `settings.page.tsx`, 1,998-line `auto-remediation.page.tsx`) that inline their own data-fetching, duplicate service logic, and lean on `any` instead of the hand-written service/hook layer the codebase otherwise provides. There are four orphan route modules (`test.tsx`, `hipaa-compliance-software.page.tsx`, `compliance-code.page.tsx`, `frameworks.page.tsx`) that ship in the bundle only as unreachable dead weight, plus an entire duplicated source tree at `apps/web/apps/web/` that was left behind untracked. Twenty-four registered feature routes have no entry in the sidebar — users can only reach them via typed URLs — and `ROUTE_PERMISSIONS` still gates two routes that no longer exist. The highest-risk findings are real: the admin shell reads its token from `localStorage` (XSS-reachable) while the main app uses `sessionStorage`; the public Trust Center hard-codes "HITRUST Certified / SOC 2 Type II Certified / GDPR Compliant" marketing claims that will be libelous if they aren't true; and several pages ship disabled "Coming Soon" controls that violate the project's "no fake UI" memory rule. Once the orphan routes, unused deps, and nested duplicate tree are removed, bundle size and review surface should drop meaningfully with zero behavior change.

## Nested-path duplicate investigation (`apps/web/apps/web/`)

`/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/apps/web/src/components/legal/ai-disclaimer.tsx` exists as a one-file mirror of the canonical component at `apps/web/src/components/legal/ai-disclaimer.tsx`. `diff` returns zero differences. `git status` reports the entire `apps/web/apps/` subtree as untracked, and `git ls-files` returns nothing under that path — so no commit, import, or build path references it. The sibling `apps/web/tsconfig.json` uses `"rootDir": "src"` and excludes paths outside `src/`, so the nested file is invisible to TypeScript and Vite today.

**Conclusion: delete the entire `apps/web/apps/` directory.** It is dead weight, likely a stray output from a copy-paste or `rsync` mishap during a refactor. No `rg "apps/web/apps"` references exist anywhere in the repo. One shell command removes it:

```bash
rm -rf "/Users/shyamsedai/Documents/Compliance Vision AI/apps/web/apps"
```

## P0 — Security / broken behavior

| File:line | Issue | Suggested fix |
|---|---|---|
| `src/app/routes/admin/_admin-layout.tsx:27,55,63,64` | Admin panel stores JWT in `localStorage` (`admin_token`) and user record in `localStorage` (`admin_user`). Main app uses `sessionStorage` (see `stores/auth-store.ts`). `localStorage` is readable by any injected script and survives tab close — strictly worse for a privileged admin console. | Switch to `sessionStorage` (or HttpOnly cookie parity with the refresh flow) and align with `stores/auth-store.ts`. Audit any XSS vector before shipping. |
| `src/app/routes/trust-center-index.tsx:14,15,16,18` | Public marketing page hard-codes `status: 'Compliant'` for HIPAA & GDPR and `status: 'Certified'` for HITRUST CSF and SOC 2 Type II. These are legally meaningful claims on a customer-facing page. If the company isn't actually HITRUST- or SOC 2-certified yet, this is misrepresentation. | Pull status from the backend Trust Center admin API (already exists per `trust-center-admin.page.tsx`) so certification states mirror reality. Until then, change to "In progress" / "Targeted Q2 2026" etc., with a legal review. |
| `src/app/routes/_authenticated.tsx:128,147` | `ROUTE_PERMISSIONS` guards `/compliance-code` → `compliance.view` and `/frameworks` → `compliance.view`, but neither route is registered in `route-tree.ts` (they are orphan files — see P1). Stale permission entries hide intent drift and will re-enable inaccessible routes silently if someone re-registers them. | Remove the two entries when the orphan pages are deleted (P1), or register the pages if they are actually wanted. |
| `src/app/routes/_authenticated/breach-sim.page.tsx:1367-1368` | Ships a disabled "Export PDF (Coming Soon)" button as production UI. Violates the memory rule: "Would a user feel deceived by this UI element? … Never ship decorative UI that pretends to work." | Remove the button entirely. Re-introduce only when the endpoint is live. |
| `src/app/routes/_authenticated/reports.page.tsx:762-765` | Four framework `SelectItem`s (GDPR / SOC 2 / PCI-DSS / ISO 27001) rendered with `disabled` and the text "(Coming Soon)". Same violation as above. | Remove the disabled items (or hide behind a feature flag) — don't list frameworks you can't actually generate reports for. |
| `src/components/legal/system-announcement-banner.tsx:50-54` | Dismiss POST silently swallows errors; comment acknowledges "the next poll will still show the announcement". Users who hit an intermittent network error will see the banner bounce back after five minutes with no indication something went wrong. | Either surface a toast on failure or retry with backoff. Otherwise the UX reads as broken. |
| `src/lib/query-client.ts` (whole file) | Global `retry: 1`, `staleTime: 30_000`, `refetchOnWindowFocus: false`. Combined with `refetchOnMount: 'always'` on many queries (grep shows 20+), this produces inconsistent freshness across pages and complicates debugging data staleness. | Document the global contract, remove per-query `refetchOnMount` overrides that just reassert defaults, and bump `retry` only on mutations that can safely dedupe. |

## P1 — Dead code / orphan routes / mock data / fake UI

| File:line | Issue | Suggested fix |
|---|---|---|
| `src/app/routes/_authenticated/frameworks.page.tsx` (652 LOC) + `src/app/routes/_authenticated/frameworks.tsx` | Both files exist but `frameworksRoute` is not imported in `src/app/route-tree.ts`. Unreachable. Pulls in `hooks/use-frameworks.ts` (105 LOC) and `services/frameworks.ts` (283 LOC) that are only referenced by this dead page. | Delete `frameworks.page.tsx`, `frameworks.tsx`, `hooks/use-frameworks.ts`, `services/frameworks.ts`. Remove the `/frameworks` entry from `ROUTE_PERMISSIONS`. |
| `src/app/routes/_authenticated/compliance-code.page.tsx` (998 LOC) + `src/app/routes/_authenticated/compliance-code.tsx` | Not registered in `route-tree.ts`. Unreachable. | Delete both files and the `/compliance-code` entry in `ROUTE_PERMISSIONS`. |
| `src/app/routes/test.tsx:1-8` | `testRoute` is a redirect stub to `/login` and is not imported in `route-tree.ts`. Dead. | Delete the file. |
| `src/app/routes/hipaa-compliance-software.page.tsx` (210 LOC) | No stub file, no import in `route-tree.ts`. Orphan. | Delete or wire up if this was meant to be a public SEO page. |
| `src/lib/mock-data.ts` (185 LOC) | `mockDashboardStats` and friends — no imports anywhere. | Delete. |
| `src/components/settings/usage-display.tsx` (132 LOC) | `UsageDisplay` never imported outside itself. | Delete, or surface it on the settings/billing page. |
| `src/components/dashboard/action-items.tsx` (294 LOC) | Never imported. | Delete. |
| `src/hooks/use-auth.ts` (83 LOC) | Exports `useLogin`, `useLogout`, `useCurrentUser` — zero external imports. Live auth flow uses `stores/auth-store.ts` directly. | Delete. |
| `src/hooks/use-scanning.ts` (155 LOC) | Never imported. `enterprise-integrations.page.tsx` defined its own inline `useIntegrationsList()` instead (line ~510). | Delete, OR extract the inline hook in `enterprise-integrations` into this module so it serves its purpose. |
| `src/hooks/use-policy-acknowledgments.ts` (62 LOC) | Never imported anywhere. | Delete, or wire it up on the Training / Policy pages where it belongs. |
| `src/stores/onboarding-store.ts` (20 LOC) | `useOnboardingStore` never imported outside itself. | Delete. |
| `src/app/routes/_authenticated/enterprise-integrations.page.tsx:~510` | Private `useIntegrationsList()` hook defined inline inside a 4,193-line page file. The stand-alone `hooks/use-scanning.ts` already exists for exactly this data. | Move to `hooks/use-integrations.ts` (or revive `use-scanning.ts`) so the other pages can share it. |
| `src/app/routes/_authenticated/settings.page.tsx` (2,451 LOC) | File calls `apiClient` directly for over a dozen endpoints instead of going through `services/` + `hooks/` layers used elsewhere. Also renders 12 `any` casts. | Split into a `settings/` feature directory with one file per tab (general / security / billing / roles / MFA / etc.), each backed by a typed service + hook. |
| `src/app/routes/_authenticated/enterprise-integrations.page.tsx` (4,193 LOC) | Same pattern as settings; contains 8 `: any` and ~24 total any-like usages. Render tree is a single monolith. | Extract each vendor section (AWS / Azure / Okta / Google / Slack / etc.) into `components/integrations/<vendor>/` with a shared `useIntegration(vendorId)` hook. Treat as a multi-PR refactor. |
| `src/app/routes/_authenticated/documents.page.tsx:237,238,260,309,365,543,…` | 6 `: any` (14 `any`-like overall). | Add domain types under `types/documents.ts` and replace. |
| `src/app/routes/_authenticated/regulations.page.tsx:27-47` | 14 `any` usages, mostly in a recursive `filterRequirements(items: any[])` that re-declares the shape on every call. | Define `HipaaRequirementNode` once in `types/` and type the recursion. |
| `src/app/routes/_authenticated/auto-remediation.page.tsx` (1,998 LOC) | Massive page, mixes API calls, modal state, data transforms, and presentation. | Extract rule table, rule editor, execution log, and metrics into separate components. |
| `src/app/routes/_authenticated/incidents.page.tsx` (1,795 LOC) | Monolithic page. | Split the breach-notification-timeline block and incident-editor modal into their own files. |
| `src/app/routes/_authenticated/personnel.page.tsx` (1,786 LOC) | Monolithic page. | Extract personnel table, role-change modal, and onboarding tracker. |
| `src/app/routes/_authenticated/platform-settings.page.tsx` (1,776 LOC) | Monolithic page with duplicated section scaffolding. | Split per-section (system health / feature flags / tenants / domains). |

## P2 — Complexity / maintainability

| File:line | Issue | Suggested fix |
|---|---|---|
| 24 of 54 `app/routes/_authenticated/*.page.tsx` files import `apiClient` directly | Violates the established architecture of `services/*.ts` (typed boundaries) + `hooks/use-*.ts` (cache/loading) + page. Mixes transport, caching, and presentation in one component. | Mandate a lint rule that bans direct `apiClient` imports from `app/routes/` and re-route through the hooks layer. |
| 168 `any` / `as any` occurrences across `src/` | Concentrated in `enterprise-integrations` (8), `settings` (12), `regulations` (14), `documents` (6). Erodes the benefit of TypeScript on the most-changed surfaces. | Add `"noImplicitAny": true` (already likely set) and a `no-explicit-any` ESLint rule with per-line `// eslint-disable-next-line` so new code can't add more. |
| `src/app/routes/_authenticated.tsx` (397 LOC) | Single file owns authenticated layout + `beforeLoad` + `ROUTE_PERMISSIONS` map + onboarding redirect + MFA enforcement redirect + tier gating. | Split `ROUTE_PERMISSIONS` into its own file (`src/config/route-permissions.ts`) and extract `beforeLoad` helpers. |
| `src/components/layout/sidebar.tsx` (464 LOC) | Hard-codes `pinnedItems`, `navGroups`, `bottomItems`. Adding a page means editing this file. | Generate nav from a declarative `src/config/navigation.ts` that each page can extend via a registry, OR derive from `route-tree.ts` with a `meta: { nav: {...} }` per route. |
| `src/data/blog-posts.ts` (1,156 LOC) | Blog content inlined as a TypeScript module. Ships in the main bundle. | Move to `.mdx` under `content/blog/` and lazy-load per slug; or serve from the backend. |
| `src/types/index.ts` (392 LOC) | Single barrel type file. | Split per domain (`types/incidents.ts`, `types/compliance.ts`, etc.) so editing one domain doesn't conflict-merge every branch. |
| `src/lib/activity-tracker.ts` (386 LOC) | Large utility with no tests under `tests/`. | Add unit tests for the debounce/batch behavior — it runs on every page. |
| `src/services/admin.ts` (511 LOC) | Largest service file — all admin endpoints in one module. | Split by domain (`services/admin/tenants.ts`, `.../billing.ts`, etc.). |
| 27 routes registered in `route-tree.ts` have no sidebar entry | See "Routes dead-in-nav" table below. Users can't discover these features without the URL. | Either link them from sidebar, hide them from `route-tree.ts`, or move them behind `showInNav: false` meta with a deliberate "by URL only" rationale. |

## P3 — Style / polish

Grouped rather than itemized. Fix as part of a lint pass.

- **Inconsistent toast provider:** `sonner` is used in 89 files but `@radix-ui/react-toast` is still in `package.json` and unused — remove the unused dep (see table below).
- **Mixed time-of-day formatting:** some pages use `toLocaleDateString`, others use `date-fns`-style helpers via hand-rolled `formatDate()` in individual files. Centralize in `src/lib/format.ts` (already exists — just use it everywhere).
- **Route stub + page file duplication:** every `_authenticated/<name>.tsx` is a ~5-line `lazy()` stub for `<name>.page.tsx`. Fine, but the 4 orphan pairs (see P1) show the pattern also silently accumulates dead pairs. A codegen script could enforce 1-to-1 parity with `route-tree.ts`.
- **Inline Tailwind arbitrary values:** scattered `className="min-w-[320px]"`-style values; consider lifting common sizes to `tailwind.config.js`.
- **Icon imports from `lucide-react` per-file:** tree-shakes fine, but many pages import 15+ icons at the top. No action required; flag only if bundle analysis shows regression.
- **Mixed component export style:** some files `export function Name`, others `export const Name = () =>`. Pick one (project seems to lean toward `export function`).
- **Commented-out nav entries in `sidebar.tsx:111,133`** (`Knowledge Graph`, `Evidence`). Either uncomment or delete — dead comments rot.
- **`Announcement` type duplicated** between `system-announcement-banner.tsx:5-15` and backend schema. Move to `src/types/announcements.ts` and share.

## Components / files over 300 lines

| File | LOC |
|---|---|
| `src/app/routes/_authenticated/enterprise-integrations.page.tsx` | 4,193 |
| `src/app/routes/_authenticated/settings.page.tsx` | 2,451 |
| `src/app/routes/_authenticated/auto-remediation.page.tsx` | 1,998 |
| `src/app/routes/_authenticated/incidents.page.tsx` | 1,795 |
| `src/app/routes/_authenticated/personnel.page.tsx` | 1,786 |
| `src/app/routes/_authenticated/platform-settings.page.tsx` | 1,776 |
| `src/app/routes/_authenticated/breach-sim.page.tsx` | 1,737 |
| `src/app/routes/_authenticated/compliance-costs.page.tsx` | 1,698 |
| `src/app/routes/_authenticated/questionnaires.page.tsx` | 1,678 |
| `src/app/routes/_authenticated/vendors.page.tsx` | 1,641 |
| `src/app/routes/_authenticated/ai-agent.page.tsx` | 1,587 |
| `src/app/routes/_authenticated/due-diligence.page.tsx` | 1,568 |
| `src/app/routes/_authenticated/onboarding.page.tsx` | 1,555 |
| `src/app/routes/_authenticated/vendor-risk.page.tsx` | 1,549 |
| `src/app/routes/_authenticated/ai-governance.page.tsx` | 1,547 |
| `src/app/routes/_authenticated/documents.page.tsx` | 1,480 |
| `src/app/routes/_authenticated/trust-center-admin.page.tsx` | 1,398 |
| `src/app/routes/_authenticated/controls.page.tsx` | 1,374 |
| `src/app/routes/_authenticated/regulatory-radar.page.tsx` | 1,355 |
| `src/app/routes/_authenticated/risk-management.page.tsx` | 1,338 |
| `src/app/routes/_authenticated/risk-assessment.page.tsx` | 1,334 |
| `src/app/routes/admin/monitoring.page.tsx` | 1,262 |
| `src/app/routes/_authenticated/audit-reports.page.tsx` | 1,251 |
| `src/app/routes/admin/tenant-detail.page.tsx` | 1,235 |
| `src/app/routes/_authenticated/security-training.page.tsx` | 1,169 |
| `src/app/routes/_authenticated/tprm.page.tsx` | 1,159 |
| `src/data/blog-posts.ts` | 1,156 |
| `src/app/routes/_authenticated/learning-engine.page.tsx` | 1,153 |
| `src/app/routes/_authenticated/risk-register.page.tsx` | 1,136 |
| `src/app/routes/admin/tenants.page.tsx` | 1,135 |
| `src/app/routes/_authenticated/penalty-exposure.page.tsx` | 1,119 |
| `src/app/routes/_authenticated/advanced-reports.page.tsx` | 1,113 |
| `src/app/routes/_authenticated/hipaa-roadmap.page.tsx` | 1,103 |
| `src/app/routes/_authenticated/evidence.page.tsx` | 1,077 |
| `src/app/routes/_authenticated/assets.page.tsx` | 1,066 |
| `src/app/routes/_authenticated/digital-twin.page.tsx` | 1,065 |
| `src/app/routes/_authenticated/reports.page.tsx` | 1,062 |
| `src/app/routes/_authenticated/compliance-code.page.tsx` (orphan) | 998 |
| `src/app/routes/_authenticated/behavior-analytics.page.tsx` | 959 |
| `src/app/routes/_authenticated/contract-intelligence.page.tsx` | 943 |
| `src/app/routes/_authenticated/compliance.page.tsx` | 909 |
| `src/app/routes/_authenticated/training.page.tsx` | 900 |
| `src/app/routes/_authenticated/risk-prioritization.page.tsx` | 886 |
| `src/app/routes/_authenticated/policy-templates.page.tsx` | 877 |
| `src/app/routes/trust-center.page.tsx` | 871 |
| `src/app/routes/_authenticated/customer-portal.page.tsx` | 867 |
| `src/app/routes/_authenticated/knowledge-graph.page.tsx` | 856 |
| `src/app/routes/_authenticated/ai-assistant.page.tsx` | 806 |
| `src/app/routes/_authenticated/collaboration.page.tsx` | 798 |
| `src/app/routes/admin/packages.page.tsx` | 768 |
| `src/app/routes/_authenticated/insights.page.tsx` | 752 |
| `src/app/routes/_authenticated/remediation.page.tsx` | 730 |
| `src/app/routes/admin/billing.page.tsx` | 666 |
| `src/app/routes/_authenticated/frameworks.page.tsx` (orphan) | 652 |
| `src/app/routes/_authenticated/employee-compliance.page.tsx` | 636 |
| `src/app/routes/admin/dashboard.page.tsx` | 617 |
| `src/app/routes/compliance-analyzer.page.tsx` | 613 |
| `src/app/routes/_authenticated/dashboard.page.tsx` | 573 |
| `src/app/routes/_authenticated/audit-trail.page.tsx` | 560 |
| `src/app/routes/admin/admin-users.page.tsx` | 552 |
| `src/services/admin.ts` | 511 |
| `src/app/routes/_authenticated/profile.page.tsx` | 477 |
| `src/app/routes/_authenticated/compliance-detail.page.tsx` | 466 |
| `src/components/layout/sidebar.tsx` | 464 |
| `src/components/mfa/mfa-management.tsx` | 402 |
| `src/app/routes/_authenticated.tsx` | 397 |
| `src/types/index.ts` | 392 |
| `src/app/routes/_authenticated/alerts.page.tsx` | 392 |
| `src/app/routes/admin/legal.page.tsx` | 389 |
| `src/lib/activity-tracker.ts` | 386 |
| `src/services/breach-sim.ts` | 373 |
| `src/app/routes/signup.tsx` | 359 |
| `src/services/compliance-costs.ts` | 358 |
| `src/app/routes/_authenticated/regulations.page.tsx` | 355 |
| `src/components/compliance/findings-detail-panel.tsx` | 337 |
| `src/services/controls.ts` | 336 |
| `src/components/landing/hero.tsx` | 332 |
| `src/services/regulatory-radar.ts` | 320 |
| `src/services/ai-agent.ts` | 320 |

## Routes dead-in-nav (registered in `route-tree.ts`, missing from sidebar)

These URLs load if pasted into the address bar but have no sidebar link, so users cannot discover them. Some (e.g. `/profile`, `/onboarding`, `/compliance-detail`) are intentional; most look like feature rot.

| Route path | Likely status |
|---|---|
| `/advanced-reports` | Feature missing from nav |
| `/ai-governance` | Feature missing from nav |
| `/audit-reports` | Feature missing from nav |
| `/auto-remediation` | Feature missing from nav |
| `/behavior-analytics` | Feature missing from nav |
| `/breach-sim` | Feature missing from nav |
| `/collaboration` | Feature missing from nav |
| `/compliance-costs` | Feature missing from nav |
| `/compliance-detail` | Intentional (deep-link from compliance list) |
| `/contract-intelligence` | Feature missing from nav |
| `/customer-portal` | Feature missing from nav |
| `/digital-twin` | Feature missing from nav |
| `/due-diligence` | Feature missing from nav |
| `/employee-compliance` | Feature missing from nav |
| `/insights` | Feature missing from nav |
| `/knowledge-graph` | Commented out in sidebar.tsx:111 — decide or delete |
| `/evidence` | Commented out in sidebar.tsx:133 — decide or delete |
| `/onboarding` | Intentional (redirect target during first-login) |
| `/penalty-exposure` | Feature missing from nav |
| `/platform-settings` | Intentional (super-admin only; maybe gate in sidebar) |
| `/profile` | Intentional (user-menu link) |
| `/questionnaires` | Feature missing from nav |
| `/risk-prioritization` | Feature missing from nav |
| `/security-training` | Feature missing from nav |
| `/tprm` | Feature missing from nav |
| `/trust-center-admin` | Feature missing from nav |
| `/ai-assistant` | Replaced by `/ai-agent` in sidebar — either delete route or re-link |

## Unused `package.json` dependencies

Verified by grepping all `.ts`/`.tsx` files under `src/` for each package name.

| Package | Version | Evidence | Action |
|---|---|---|---|
| `@radix-ui/react-accordion` | `^1.2.0` | 0 imports | Remove |
| `@radix-ui/react-collapsible` | `^1.1.0` | 0 imports | Remove |
| `@radix-ui/react-toast` | `^1.2.0` | 0 imports (project uses `sonner`) | Remove |
| `react-hook-form` | `^7.53.0` | 0 imports | Remove |
| `@hookform/resolvers` | `^3.9.0` | 0 imports (would pair with `react-hook-form`) | Remove |
| `zod` | `^3.23.0` | 0 imports | Remove |
| `date-fns` | `^4.1.0` | 0 imports | Remove |
| `react-force-graph-2d` | `^1.29.1` | 0 imports (knowledge-graph page doesn't actually use it) | Remove, OR wire up on `/knowledge-graph` if that was the intent |

## Suggested cleanup order

1. **Zero-risk deletes (single PR):** `apps/web/apps/` (nested dup), orphan routes (`test.tsx`, `compliance-code*`, `frameworks*`, `hipaa-compliance-software.page.tsx`), dead modules (`mock-data.ts`, `usage-display.tsx`, `action-items.tsx`, `use-auth.ts`, `use-scanning.ts`, `use-policy-acknowledgments.ts`, `onboarding-store.ts`, `use-frameworks.ts`, `services/frameworks.ts`), 8 unused deps, stale `ROUTE_PERMISSIONS` entries.
2. **Trust + fake-UI fixes (one PR):** trust-center-index certifications, breach-sim "Coming Soon" button, reports framework "Coming Soon" SelectItems, admin-layout `localStorage` → `sessionStorage`.
3. **Sidebar nav audit (one PR):** decide fate of each of the 27 dead-in-nav routes; either link, hide, or delete.
4. **Refactor program (multi-PR):** split the top-10 largest pages (`enterprise-integrations`, `settings`, `auto-remediation`, `incidents`, `personnel`, `platform-settings`, `breach-sim`, `compliance-costs`, `questionnaires`, `vendors`) into feature directories backed by `services/` + `hooks/`.
5. **TypeScript tightening:** `no-explicit-any` ESLint rule + a per-file TODO campaign until the 168 `any` count trends to zero.
