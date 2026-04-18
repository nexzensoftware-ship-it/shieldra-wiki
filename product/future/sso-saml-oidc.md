# SSO / SAML & OpenID Connect — Future Implementation

Removed from login UI for MVP. Buttons existed on the login page but were disabled (no actual auth flow).

## What's already built (keep, don't delete)

- **`apps/api/src/api/v1/endpoints/sso.py`** — SSO settings CRUD (create/read/update/delete config in DB), SP metadata XML generation, SCIM token provisioning
- **`apps/api/src/core/db.py`** — `SSOConfig` table with fields for entity_id, sso_url, slo_url, certificate, client_id, client_secret, domains, scim_token
- **Settings UI** — SSO configuration page in platform settings still works for admins to pre-configure their IdP credentials

## What needs to be built

### Backend
1. `POST /api/v1/sso/initiate` — redirect user to IdP (SAML AuthnRequest or OIDC authorization URL)
2. `POST /api/v1/sso/callback/saml` — receive and validate SAML assertion, issue JWT
3. `GET  /api/v1/sso/callback/oidc` — handle OIDC authorization code, exchange for tokens, issue JWT
4. `GET  /api/v1/sso/logout/saml` — handle SAML SLO (single logout)

### Libraries to add
- **SAML**: `python3-saml` or `pysaml2`
- **OIDC**: `authlib` (handles code exchange, token validation, JWKS)

### Frontend
- Re-add SSO/SAML and OpenID Connect buttons to `apps/web/src/app/routes/login.tsx`
- Add email-domain detection: if user types an email matching a configured SSO domain, auto-redirect to IdP instead of showing password field
- Wire buttons to `GET /api/v1/sso/initiate?provider=saml` (or `oidc`)

## Supported providers (per existing config schema)
- `saml` — generic SAML 2.0
- `oidc` — generic OpenID Connect
- `okta` — Okta (SAML or OIDC)
- `azure_ad` — Microsoft Entra ID
- `google` — Google Workspace

## Notes
- The `/test` endpoint currently only validates that required fields are filled in — it does not actually ping the IdP. Make it real when implementing the flow.
- SCIM sync log in `sso.py` returns demo data — wire to real provisioning events once SCIM inbound provisioning is implemented.
