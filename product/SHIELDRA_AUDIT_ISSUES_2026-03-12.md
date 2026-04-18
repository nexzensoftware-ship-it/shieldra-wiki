# Shieldra UI Audit Issues

Date: March 12, 2026
Target: `https://www.shieldra.ai`
Scope: Public UI, public API behavior, auth flows, requirement alignment

## Summary

- Total issues logged: 10
- Critical: 2
- High: 4
- Medium: 4

## Issue List

### 1. Critical: Public admin login exposes working super-admin credentials

- Area: Admin auth
- Live finding: `/admin/login` is prefilled with `superadmin@shieldra.ai` and `superadmin123`, and those credentials successfully authenticate against `POST /admin/api/auth/login`.
- Impact: Full platform admin compromise.
- Repo evidence:
  - [admin/login.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/admin/login.tsx#L18)
  - [db.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/core/db.py#L4165)
  - [db.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/core/db.py#L4548)

### 2. Critical: Unauthenticated debug endpoints are exposed in production

- Area: API security
- Live finding:
  - `GET /api/v1/debug/admin-check` returned admin inventory.
  - `GET /api/v1/debug/email-config` returned email configuration and the Resend key prefix.
- Additional exposed source routes include:
  - `GET /api/v1/debug/bootstrap-admin`
  - `GET /api/v1/debug/list-tenants`
  - `GET /api/v1/debug/delete-tenant/{tenant_id}`
- Impact: Information disclosure and potential destructive/admin-reset access.
- Repo evidence:
  - [health.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/health.py#L24)
  - [health.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/health.py#L61)
  - [health.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/health.py#L96)
  - [health.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/health.py#L116)

### 3. High: Public trust center is broken and redirects to login

- Area: Trust center
- Requirement/intent: Public trust center pages should be viewable without auth.
- Live finding: `/trust-center/demo-healthcare` lands on `/login` instead of rendering a public trust center.
- Root cause:
  - Frontend calls a supposed public API route.
  - Backend “public” endpoint is wrapped by feature gating that depends on tenant auth.
  - Frontend 401 handling redirects unauthenticated users to `/login`.
- Impact: Public trust center feature is unusable.
- Repo evidence:
  - [trust-center.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/trust-center.tsx#L13)
  - [trust_center.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/trust_center.py#L611)
  - [feature_gate.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/core/feature_gate.py#L24)
  - [api-client.ts](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/lib/api-client.ts#L82)

### 4. High: Free public HIPAA assessment is missing

- Area: Requirements coverage
- Requirement doc says a public assessment should exist at `/hipaa-assessment` with public assessment APIs.
- Live finding:
  - `/hipaa-assessment` renders `Not Found`
  - `/free-assessment` renders `Not Found`
  - `/compliance-check` renders `Not Found`
  - `GET /api/v1/public/assessment/questions` returns `404`
- Impact: A documented lead-generation feature is not implemented on the live site.
- Requirement evidence:
  - [PLAN-free-hipaa-assessment.md](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/PLAN-free-hipaa-assessment.md#L1)
  - [PLAN-free-hipaa-assessment.md](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/PLAN-free-hipaa-assessment.md#L218)

### 5. High: Contact form is fake and accepts blank submissions

- Area: Lead capture / contact
- Live finding: Clicking `Send Message` immediately shows “Message Received” with no validation and no network request.
- Impact: Users think they contacted the company when no message is actually sent.
- Repo evidence:
  - [contact.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/contact.tsx#L20)

### 6. Medium: Blog “Notify Me” form is a no-op

- Area: Blog / lead capture
- Live finding: Clicking `Notify Me` makes no request and produces no subscription flow.
- Impact: Broken newsletter capture and misleading CTA.
- Repo evidence:
  - [blog.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/blog.tsx#L18)

### 7. High: Public SSO claims do not match actual implementation

- Area: Security/trust claims
- Live finding:
  - Public pages claim SSO via SAML/OIDC is supported or enforced.
  - Live login page has no SSO entry point.
- Documentation conflict:
  - Internal doc marks SSO/OIDC as future work removed from MVP login.
  - Feature tracker marks SSO as `Simulated`.
- Impact: Misleading security/compliance claims.
- Repo evidence:
  - [security.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/security.tsx#L21)
  - [trust-center-index.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/trust-center-index.tsx#L22)
  - [sso-saml-oidc.md](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/docs/future/sso-saml-oidc.md#L1)
  - [shieldra-features.js](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/shieldra-features.js)

### 8. Medium: Public navigation uses broken landing-page anchor links

- Area: UX / navigation
- Live finding:
  - On `/about`, `/contact`, `/security`, and `/trust-center`, navbar links like `Platform`, `Features`, and `Pricing` change the URL hash but do not navigate to valid content.
  - On the homepage, `Watch Demo` points to `#demo`, but no `#demo` section exists.
- Impact: Broken navigation and misleading CTAs.
- Repo evidence:
  - [landing-navbar.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/components/landing/landing-navbar.tsx#L5)
  - [hero.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/components/landing/hero.tsx#L293)

### 9. Medium: Trial messaging is inconsistent across site, backend, and legal text

- Area: Product messaging / legal consistency
- Live and source findings:
  - Signup page says `30 days free`.
  - Landing sections say `14-day free trial`.
  - Signup backend docstring says `14-day free trial` but code sets `30` days.
  - Terms say access requires a paid subscription.
- Impact: User confusion, potential trust/legal issues.
- Repo evidence:
  - [signup.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/signup.tsx#L87)
  - [pricing-teaser.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/components/landing/pricing-teaser.tsx#L92)
  - [cta-section.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/components/landing/cta-section.tsx#L58)
  - [auth.py](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/api/src/api/v1/endpoints/auth.py#L43)
  - [terms-of-service.tsx](/Users/shyamsedai/Documents/Compliance%20Vision%20AI/apps/web/src/app/routes/terms-of-service.tsx#L38)

### 10. Medium: Missing baseline security and SEO files/headers on public site

- Area: Security headers / operational hygiene
- Live finding:
  - Public responses only exposed `Strict-Transport-Security`; no observed CSP, `X-Frame-Options`, `Referrer-Policy`, or `Permissions-Policy`.
  - `/.well-known/security.txt`, `/robots.txt`, and `/sitemap.xml` all returned the SPA HTML shell instead of expected resources.
- Impact: Weaker browser hardening, missing disclosure/SEO assets, lower trust posture.

## Notes

- I did not invoke destructive debug endpoints.
- I did not perform deeper post-auth exploration after confirming the live super-admin credential issue.
- The most urgent fixes are Issue 1 and Issue 2.
