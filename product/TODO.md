
## Deadlines / Secret rotations

- [ ] **2028-03-01 — Rotate Microsoft OAuth client secret** (`MICROSOFT_OAUTH_CLIENT_SECRET` on Railway)
  - Azure App: `Shieldra` (client ID `258cdc69-1f3a-4a12-ac08-dd0daf17995c`) under `support@shieldra.ai` tenant (`supportshieldra.onmicrosoft.com`)
  - Current secret `shieldra prod` **expires 2028-04-15** — rotate ~6 weeks early
  - Flow: portal.azure.com → App registrations → Shieldra → Certificates & secrets → + New client secret → copy Value → update `MICROSOFT_OAUTH_CLIENT_SECRET` in Railway (api service) → delete old secret once new deploy is live
  - **If you miss this deadline**, every OneDrive OAuth call returns 401 and all connected users must reconnect.

---

## Rule 1 (Privacy Rule) — Missing Individual Rights

These were identified during the Rule 6 audit (2026-03-26) and scoped out per Product debate.
Both are required HIPAA rights that predate the Omnibus Rule and belong in Rule 1.

- [ ] **Right to Confidential Communication (§164.522(b))** — Patients can request PHI be communicated via alternative means/locations (e.g., "call my cell, not my home"). Needs new checklist item in Privacy Rule + document upload check.

- [ ] **Right to Complain (§164.530(d))** — Covered entities must have a process for individuals to file complaints about privacy practices. Referenced in the NPP itself. Needs new checklist item in Privacy Rule + document upload check.

**Priority:** P2 | **Owner:** Builder | **Depends on:** Nothing — independent of Rule 6 work
**Ref:** Product debate 2026-03-26, commit 1882f77

---

## Learning Engine Use Cases — ✅ ALL COMPLETE (2026-03-30)

All 8 Learning Engine use cases have been implemented and verified on dev.shieldra.ai:

- [x] UC1: Dashboard — Smart Compliance Briefing
- [x] UC2: Compliance — AI Confidence + Expert Corrections
- [x] UC3: Remediation — "What Actually Works"
- [x] UC4: Reports — Intelligence-Enhanced
- [x] UC5: AI Assistant — Feedback Loop
- [x] UC6: Alerts — Proactive Intelligence
- [x] UC7: Vendor — Smart Vendor Risk
- [x] UC8: Document Analysis — Smarter Over Time

### What's Next for the Learning Engine

The integration layer is live, but the intelligence will get significantly richer as real usage data accumulates:

- [ ] **Expert corrections:** As compliance officers correct AI findings, the calibrator improves confidence scores and corrections feed into future assessments
- [ ] **Cross-org patterns:** As more tenants use the platform, k-anonymous pattern library grows — remediation success rates, common failure modes, and benchmark data become more accurate
- [ ] **Prediction accuracy:** As predictions are validated against actual outcomes, calibrated confidence becomes genuinely meaningful
- [ ] **Feedback signals:** As users provide 👍/👎 feedback, signal quality improves AI responses over time
- [ ] **Replace mock embeddings** with real Voyage AI for configured tenants (P1)
- [ ] **Background intelligence workers** — nightly pattern extraction, calibration refresh, proactive gap discovery (P1)
- [ ] **Adaptive prompt engineering** — track which prompts lead to accurate predictions, A/B test variants (P2)
