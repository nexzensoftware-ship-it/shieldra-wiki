# Free Public HIPAA Compliance Assessment Tool — Implementation Plan

## Overview

A publicly accessible (no login required) HIPAA compliance self-assessment tool on shieldra.ai. Visitors answer a curated questionnaire, receive an instant compliance score with gap analysis, and are funneled toward signing up for the full Shieldra platform.

**Goal**: Lead generation — assess a prospect's compliance posture quickly, demonstrate Shieldra's expertise, and convert them into paying customers.

---

## 1. User Flow

```
Landing/Marketing Page
        │
        ▼
 [Start Free Assessment] (CTA button)
        │
        ▼
 Step 1: Basic Info (lead capture)
   - Organization name
   - Full name
   - Work email (required)
   - Organization size (dropdown: 1-50, 51-200, 201-500, 500+)
   - Role (dropdown: HIPAA Officer, IT Director, CEO/Owner, Compliance Manager, Other)
   - Industry vertical (Healthcare Provider, Health Plan, Business Associate, Hybrid)
        │
        ▼
 Step 2-8: Category Questions (one step per HIPAA category)
   - Administrative Safeguards (6-8 questions)
   - Physical Safeguards (4-5 questions)
   - Technical Safeguards (5-6 questions)
   - Organizational Requirements (3-4 questions)
   - Policies & Procedures (4-5 questions)
   - Privacy Rule (4-5 questions)
   - Breach Notification (3-4 questions)
   - Progress bar showing completion %
        │
        ▼
 Step 9: Results Page
   - Overall compliance score (0-100) with letter grade (A-F)
   - Category-level breakdown (radar chart + bar chart)
   - Top 5 critical gaps identified
   - Risk level indicator (Critical / High / Medium / Low)
   - Estimated penalty exposure range
   - Teaser: "Full detailed report with 73-point analysis available in Shieldra"
        │
        ▼
 [CTA: Sign Up for Full Assessment] → /signup
 [CTA: Download Summary PDF] → requires email (already captured)
 [CTA: Schedule a Demo] → /contact or Calendly link
```

---

## 2. Question Design

### Format
Each question uses a **4-point scale** for consistent scoring:
| Answer | Score | Label |
|--------|-------|-------|
| 0 | 0% | Not implemented |
| 1 | 33% | Partially implemented / informal |
| 2 | 66% | Mostly implemented / documented |
| 3 | 100% | Fully implemented & regularly reviewed |

Some questions may use **Yes / No / Unsure** (scored as 100 / 0 / 25).

### Question Source
Derive ~35 questions from the existing HIPAA knowledge base (`apps/api/src/hipaa/knowledge_base.py`), using the `check_questions` field per requirement. Prioritize:
- **Required** requirements over Addressable
- **Critical/High** severity over Medium/Low
- Questions that are understandable by non-technical executives

### Sample Questions by Category

**Administrative Safeguards (7 questions)**
1. Do you have a designated HIPAA Security Officer?
2. Have you conducted a formal risk assessment in the past 12 months?
3. Do you have documented workforce security policies (background checks, access authorization, termination procedures)?
4. Is there a security awareness training program for all employees?
5. Do you have documented security incident response procedures?
6. Is there a disaster recovery / contingency plan for systems containing PHI?
7. Do you maintain Business Associate Agreements with all vendors handling PHI?

**Physical Safeguards (4 questions)**
1. Are physical access controls in place for facilities housing PHI?
2. Do you have policies for workstation use and positioning in areas with PHI access?
3. Are there documented procedures for disposal/reuse of devices containing PHI?
4. Do you maintain visitor logs and escort procedures for restricted areas?

**Technical Safeguards (6 questions)**
1. Do all users have unique login credentials to access PHI systems?
2. Is role-based access control (RBAC) implemented to limit PHI access?
3. Is PHI encrypted at rest (AES-256 or equivalent)?
4. Is PHI encrypted in transit (TLS 1.2+)?
5. Are audit logs maintained for all PHI access and modifications?
6. Do you have automatic session timeout/lockout policies?

**Organizational Requirements (3 questions)**
1. Do all Business Associate contracts include required HIPAA provisions?
2. Are permitted uses and disclosures of PHI clearly documented?
3. Do you have written agreements with subcontractors who handle PHI?

**Policies & Procedures (4 questions)**
1. Do you maintain written HIPAA privacy and security policies?
2. Are policies reviewed and updated at least annually?
3. Is there a documented process for policy change management?
4. Are all personnel trained on current policies and required to acknowledge them?

**Privacy Rule (5 questions)**
1. Can patients request access to their PHI within 30 days?
2. Do you apply the Minimum Necessary standard when using/disclosing PHI?
3. Are proper authorization forms obtained before non-routine PHI disclosures?
4. Do you have a process for patients to request amendments to their records?
5. Do you maintain an accounting of PHI disclosures?

**Breach Notification (4 questions)**
1. Do you have a documented breach notification procedure?
2. Can you notify affected individuals within 60 days of discovering a breach?
3. Do you have a process for notifying HHS (and media if 500+ affected)?
4. Do you conduct a risk assessment to determine breach probability after incidents?

**Total: ~33 questions** — completable in 5-8 minutes.

---

## 3. Scoring Algorithm

### Category Score
```
category_score = (sum of answer scores) / (max possible score) × 100
```

### Overall Score (Weighted)
Categories are weighted by regulatory importance and audit focus:

| Category | Weight |
|----------|--------|
| Administrative Safeguards | 25% |
| Technical Safeguards | 20% |
| Privacy Rule | 15% |
| Breach Notification | 12% |
| Policies & Procedures | 10% |
| Physical Safeguards | 10% |
| Organizational Requirements | 8% |

```
overall_score = Σ (category_score × category_weight)
```

### Grade Mapping
| Score Range | Grade | Risk Level | Color |
|-------------|-------|------------|-------|
| 90-100 | A | Low | Green |
| 80-89 | B | Moderate | Blue |
| 70-79 | C | Elevated | Yellow |
| 50-69 | D | High | Orange |
| 0-49 | F | Critical | Red |

### Penalty Exposure Estimate
Based on score range, show an estimated annual penalty exposure:
- **A (90-100)**: Minimal — under $50K potential
- **B (80-89)**: Low — $50K-$250K potential
- **C (70-79)**: Moderate — $250K-$1M potential
- **D (50-69)**: High — $1M-$5M potential
- **F (0-49)**: Severe — $1.5M+ per violation category (up to $15M annually)

*Disclaimer: These are rough estimates for educational purposes, not legal advice.*

---

## 4. Technical Implementation

### Backend (FastAPI)

**New files:**
- `apps/api/src/api/v1/public_assessment.py` — Public (no auth) API endpoints
- `apps/api/src/assessment/questions.py` — Question bank derived from knowledge base
- `apps/api/src/assessment/scoring.py` — Scoring engine

**New DB tables (in `apps/api/src/core/db.py`):**
```python
class AssessmentLead(Base):
    """Captured lead info from free assessment"""
    __tablename__ = "assessment_leads"

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    organization_name = Column(String)
    organization_size = Column(String)      # 1-50, 51-200, etc.
    role = Column(String)
    industry = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    converted = Column(Boolean, default=False)  # Did they sign up?
    converted_at = Column(DateTime, nullable=True)

class AssessmentSubmission(Base):
    """Individual assessment completion"""
    __tablename__ = "assessment_submissions"

    id = Column(String, primary_key=True)
    lead_id = Column(String, ForeignKey("assessment_leads.id"))
    answers = Column(JSON)                  # {question_id: answer_value}
    overall_score = Column(Float)
    category_scores = Column(JSON)          # {category: score}
    grade = Column(String)
    risk_level = Column(String)
    top_gaps = Column(JSON)                 # List of identified gaps
    completed_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
```

**API Endpoints (all public, no auth):**
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/public/assessment/questions` | Return all questions grouped by category |
| POST | `/api/v1/public/assessment/start` | Submit lead info, get assessment session ID |
| POST | `/api/v1/public/assessment/submit` | Submit answers, get instant score + gaps |
| GET | `/api/v1/public/assessment/results/{id}` | Retrieve results by submission ID (shareable) |
| GET | `/api/v1/public/assessment/pdf/{id}` | Download summary PDF report |

**Rate limiting:** Apply rate limits on public endpoints (e.g., 5 submissions per IP per hour) to prevent abuse.

### Frontend (React)

**New files:**
- `apps/web/src/app/routes/hipaa-assessment.tsx` — Main public assessment page
- `apps/web/src/components/assessment/AssessmentWizard.tsx` — Multi-step form wizard
- `apps/web/src/components/assessment/QuestionCard.tsx` — Individual question component
- `apps/web/src/components/assessment/ResultsDashboard.tsx` — Score + charts + gaps + CTAs
- `apps/web/src/components/assessment/CategoryProgress.tsx` — Progress bar per category
- `apps/web/src/components/assessment/ScoreGauge.tsx` — Animated circular score gauge
- `apps/web/src/components/assessment/GapList.tsx` — Critical gaps with recommendations

**UI/UX Details:**
- Multi-step wizard with progress bar (Step 1: Info → Steps 2-8: Categories → Step 9: Results)
- Each category step shows 3-7 questions on a single scroll view
- Radio button group for each answer (Not Implemented / Partial / Mostly / Fully)
- "Back" and "Next" navigation with validation
- Smooth transitions between steps (framer-motion or CSS transitions)
- Mobile-responsive (many prospects will access on mobile)
- Results page: Radar chart (recharts) for category breakdown, animated score counter
- Share results via URL (`/hipaa-assessment/results/{id}`)

**Route:** Public (outside `_authenticated` wrapper), accessible at `/hipaa-assessment`

---

## 5. Results Page — What to Show vs. Gate

### Free (shown immediately)
- Overall score + letter grade
- Risk level (Critical/High/Medium/Low)
- Category-level scores (bar chart + radar chart)
- Top 5 critical gaps (brief description)
- Penalty exposure estimate
- General recommendations per category (1-liner each)

### Gated (requires Shieldra signup)
- Full 73-point requirement-level analysis
- Detailed remediation steps per gap
- Priority-ranked action plan with timeline
- Downloadable detailed PDF report
- Continuous monitoring & re-assessment
- Evidence collection templates
- Policy document templates

This tiered approach gives enough value to be useful while creating a clear reason to sign up.

---

## 6. Lead Nurture & Conversion

### Immediate
- Email the lead a copy of their results summary (if email integration is set up)
- Show prominent CTAs: "Sign Up Free", "Schedule Demo", "Download Report"

### Follow-up (future — not part of initial build)
- Automated email drip campaign (Day 1: results, Day 3: tips, Day 7: case study, Day 14: offer)
- Admin dashboard to view leads, scores, and conversion status
- Re-assessment reminder after 90 days

---

## 7. SEO & Marketing Value

- **URL**: `shieldra.ai/hipaa-assessment`
- **Meta title**: "Free HIPAA Compliance Assessment | Check Your Score in 5 Minutes"
- **Meta description**: "Take our free HIPAA compliance self-assessment. Answer 33 questions, get an instant compliance score, identify gaps, and understand your risk exposure."
- **Schema markup**: FAQPage schema for assessment questions (SEO boost)
- Add link to assessment from: landing page hero, navigation bar, footer, blog posts
- Consider adding a results-sharing feature (social/LinkedIn) for organic reach

---

## 8. Implementation Phases

### Phase 1: Core Assessment (MVP) — ~3-4 days
- [ ] Create question bank from HIPAA knowledge base
- [ ] Build scoring engine (backend)
- [ ] Create public API endpoints (no auth)
- [ ] Build multi-step assessment wizard (frontend)
- [ ] Build results dashboard with charts
- [ ] Add DB tables for leads + submissions
- [ ] Test end-to-end flow locally + production (PostgreSQL)

### Phase 2: Polish & Conversion — ~2 days
- [ ] Lead capture form with validation
- [ ] PDF summary generation (downloadable)
- [ ] Rate limiting on public endpoints
- [ ] SEO meta tags + Open Graph tags
- [ ] Mobile responsiveness pass
- [ ] Add CTAs on landing page, nav bar, and footer
- [ ] Track assessment funnel events (start → complete → signup)

### Phase 3: Analytics & Nurture (future)
- [ ] Admin view: leads list, scores, conversion tracking
- [ ] Email integration (send results to lead)
- [ ] Re-assessment reminders
- [ ] A/B test question order and CTA placement

---

## 9. Key Decisions Needed

1. **Question count**: ~33 questions proposed. Fewer (20) = higher completion rate but less accurate. More (40+) = higher drop-off. Recommendation: 33 is the sweet spot.
2. **Lead capture timing**: Before questions (current plan) or after? Before = more leads captured even if they don't finish. After = higher quality leads but fewer.
3. **PDF report**: Include in MVP or defer to Phase 2?
4. **Email sending**: Use a service (SendGrid/Resend) or defer to Phase 3?
5. **Custom domain path**: `/hipaa-assessment` or `/free-assessment` or `/compliance-check`?

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Assessment starts / month | 500+ |
| Completion rate | > 60% |
| Lead capture rate | > 80% of starters |
| Assessment → Signup conversion | > 5% |
| Average time to complete | < 8 minutes |
| SEO traffic to assessment page | 200+ organic visits/month (after 3 months) |

---

*This tool positions Shieldra as a trusted HIPAA authority while building a qualified lead pipeline. The free assessment gives real value — a compliance score and gap identification — while the full platform provides the depth needed to actually achieve and maintain compliance.*
