# Shieldra Wiki

Canonical home for Shieldra documentation. Everything that isn't code lives here.

The product repo ([nexzensoftware-ship-it/shieldra](https://github.com/nexzensoftware-ship-it/shieldra)) stays focused on source; this wiki holds architecture, compliance, security, product, operations, and marketing.

---

## Navigation

### [architecture/](architecture/)
System architecture, data flow, tenancy model, and worker design.

- [FRONTEND_ROUTES_INVENTORY.md](architecture/FRONTEND_ROUTES_INVENTORY.md) — every frontend route and its purpose
- [WORKERS.md](architecture/WORKERS.md) — background workers, schedules, responsibilities
- [MULTI-TENANCY-AUDIT.md](architecture/MULTI-TENANCY-AUDIT.md) — tenant isolation guarantees and audit
- [ENTITY-DATA-FLOW-ANALYSIS.md](architecture/ENTITY-DATA-FLOW-ANALYSIS.md) — how data moves across entities
- [diagrams/](architecture/diagrams/) — SVG + PDF + generator scripts
- [learning-engine/](architecture/learning-engine/) — RAG + feedback architecture and use cases

### [compliance/](compliance/)
HIPAA requirements coverage, legal protections, master requirements.

- [HIPAA_REQUIREMENTS.md](compliance/HIPAA_REQUIREMENTS.md)
- [MASTER-REQUIREMENTS.md](compliance/MASTER-REQUIREMENTS.md)
- [LEGAL-PROTECTION-CHANGES.md](compliance/LEGAL-PROTECTION-CHANGES.md)

### [security/](security/)
Security assessments, pentests, audit reports, fix summaries.

- [SECURITY-ASSESSMENT.md](security/SECURITY-ASSESSMENT.md)
- [SECURITY-AUDIT-REPORT.md](security/SECURITY-AUDIT-REPORT.md)
- [SECURITY-FIXES-SUMMARY.md](security/SECURITY-FIXES-SUMMARY.md)
- [PENTEST-REPORT.md](security/PENTEST-REPORT.md)
- [AUDIT-REPORT-2026-03-30.md](security/AUDIT-REPORT-2026-03-30.md)

### [product/](product/)
Product requirements, roadmap, specs, removed-feature history, testing checklists.

- [REQUIREMENTS.md](product/REQUIREMENTS.md)
- [CHANGELOG.md](product/CHANGELOG.md)
- [TODO.md](product/TODO.md)
- [PAGE-TESTING-CHECKLIST.md](product/PAGE-TESTING-CHECKLIST.md)
- [SHIELDRA_AUDIT_ISSUES_2026-03-12.md](product/SHIELDRA_AUDIT_ISSUES_2026-03-12.md)
- `Compliance Advanced Features Implementation.docx`
- `Shieldra AI - Feature Tracker.docx`
- [shieldra-features.js](product/shieldra-features.js) — feature-tracker doc generator
- [plans/](product/plans/) — active feature plans
- [specs/](product/specs/) — design specs
- [removed-features/](product/removed-features/) — context for features cut
- [future/](product/future/) — planned future features (SSO, etc.)

### [operations/](operations/)
Deploy, infra, runbook-style docs.

- [DEPLOY-RAILWAY.md](operations/DEPLOY-RAILWAY.md)

### [marketing/](marketing/)
SEO, go-to-market, brand assets.

- [seo/](marketing/seo/)
  - [blog-and-publication-targets.md](marketing/seo/blog-and-publication-targets.md) — curated list of publications, communities, and syndication platforms
  - [SEO-ANALYSIS-AND-STRATEGY.md](marketing/seo/SEO-ANALYSIS-AND-STRATEGY.md)
  - [SEO-IMPLEMENTATION-PLAN.md](marketing/seo/SEO-IMPLEMENTATION-PLAN.md)
  - [SEO-FIXES-IMPLEMENTED.md](marketing/seo/SEO-FIXES-IMPLEMENTED.md)
- [go-to-market/](marketing/go-to-market/) — outreach lists, strategy, listing packs
- [brand/](marketing/brand/) — social graphics, launch assets (LinkedIn infographic, etc.)

### [archive/](archive/)
Historic snapshots kept for reference. Not actively maintained.

- MVP audit, initial business & HIPAA-specific requirements, original competitor research, full bug audit, backend audit report.

---

## Contributing

- Put new docs in the topical folder, not at the root.
- Use kebab-case or SCREAMING-SNAKE for filenames; match the surrounding convention in each folder.
- If a doc is time-bound (audit, pentest, plan), include the ISO date in the filename or frontmatter.
- When a doc is retired, move it to `archive/` rather than deleting.
- Source of truth is this repo; the product repo should not re-accumulate markdown except `README.md` and `CLAUDE.md`.
