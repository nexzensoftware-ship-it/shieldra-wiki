# Smart Document-Type-Aware HIPAA Analysis — Implementation Plan

## Problem
Currently, every document is checked against ALL 73 HIPAA requirements regardless of document type. A "Patient Access Policy" gets scored against encryption, physical security, breach notification, etc. — producing misleading scores (e.g., 35%) when the document may actually be excellent for its purpose.

## Solution
Build a **document-type-to-requirements mapping** with **mandatory content checklists** per document type. Score documents only against relevant requirements, flag missing key content, and show actionable remediation guidance.

---

## Architecture Overview

### New Files
```
apps/api/src/hipaa/document_requirements.py   — Document type → requirements mapping + mandatory content
apps/api/src/hipaa/smart_analyzer.py           — New analyzer that uses type-aware logic
```

### Modified Files
```
apps/api/src/hipaa/analyzer.py                 — Add type-filtered analysis function
apps/api/src/services/document_processor.py    — Enhanced classification (20+ types)
apps/api/src/api/v1/endpoints/documents.py     — Wire smart analysis, version score comparison
apps/api/src/core/db.py                        — Add document_type_detected, version score tracking
apps/web/src/app/routes/_authenticated/documents.tsx — Version upload UI, score comparison
apps/web/src/services/documents.ts             — New API calls
apps/web/src/hooks/use-documents.ts            — New hooks
```

---

## 1. Document Type Classification (Enhanced)

### Expand from 7 types to 20+ HIPAA-specific document types:

| Document Type Key | Display Name | Example Documents |
|---|---|---|
| `risk_assessment` | Risk Analysis / Assessment | SRA, vulnerability assessment |
| `risk_management_plan` | Risk Management Plan | Remediation plan, risk treatment |
| `security_policy` | Security Policies & Procedures | General security policy manual |
| `patient_access_policy` | Patient Access to ePHI | Right of access, request process |
| `notice_of_privacy` | Notice of Privacy Practices (NPP) | NPP document |
| `baa` | Business Associate Agreement | BAA contracts |
| `breach_notification` | Breach Notification Policy | Breach response, notification procedures |
| `training_policy` | Workforce Training Policy | Security awareness training program |
| `sanctions_policy` | Sanctions Policy | Workforce disciplinary policy |
| `contingency_plan` | Contingency / Disaster Recovery Plan | DR plan, backup procedures |
| `access_control_policy` | Access Control Policy | RBAC, authentication policy |
| `audit_log_policy` | Audit Log / Activity Review Policy | Log review, monitoring policy |
| `encryption_policy` | Encryption Policy | Data encryption standards |
| `facility_security` | Facility Security Plan | Physical safeguards, facility access |
| `device_media_controls` | Device & Media Controls | Device disposal, media reuse |
| `minimum_necessary` | Minimum Necessary Policy | PHI use/disclosure limits |
| `authorization_policy` | Authorization Forms / Policy | PHI authorization procedures |
| `accounting_disclosures` | Accounting of Disclosures | PHI disclosure tracking |
| `complaint_policy` | Complaint / Grievance Policy | Patient complaint process |
| `incident_response` | Incident Response Plan | Security incident procedures |
| `data_backup_policy` | Data Backup Policy | Backup procedures, recovery testing |
| `password_policy` | Password / Authentication Policy | Password standards, MFA |
| `workforce_clearance` | Workforce Clearance Policy | Background checks, access authorization |
| `termination_policy` | Termination Procedures | Access revocation on termination |
| `other` | Other / General | Unclassified documents |

### Enhanced Classification Logic
1. Pattern-match against expanded keyword dictionaries per type
2. Analyze document structure (headings, sections) for type indicators
3. Consider filename patterns (e.g., "BAA" in filename)
4. Return top-1 classification with confidence score
5. If confidence < 0.4, return "other" (check against all requirements)

---

## 2. Document Type → Requirements Mapping

### Structure (in `document_requirements.py`):

```python
@dataclass
class MandatoryContentItem:
    """A specific piece of content that MUST be in this document type."""
    id: str                    # e.g., "pat-access-timeframe"
    title: str                 # "Response Timeframe"
    description: str           # "Must specify 30-day response window per §164.524(b)(2)"
    check_keywords: list[str]  # ["30 days", "thirty days", "response time", "timeframe"]
    cfr_reference: str         # "45 CFR § 164.524(b)(2)"
    severity: str              # "critical" | "high" | "medium"
    remediation: str           # "Add a section specifying the organization will respond to access requests within 30 days"

@dataclass
class DocumentTypeRequirements:
    """Maps a document type to its relevant HIPAA requirements and mandatory content."""
    document_type: str                         # e.g., "patient_access_policy"
    display_name: str
    description: str
    applicable_requirement_ids: list[str]       # HIPAA requirement IDs to check against
    mandatory_content: list[MandatoryContentItem]  # Key content that MUST be present
    category_weights: dict[str, float]          # Custom weights for scoring this doc type
```

### Example: Patient Access to ePHI Policy

```python
DocumentTypeRequirements(
    document_type="patient_access_policy",
    display_name="Patient Access to ePHI Policy",
    description="Policy governing individual right of access to their PHI",
    applicable_requirement_ids=[
        "hipaa-priv-524",      # Access of Individuals to PHI
        "hipaa-priv-520",      # Notice of Privacy Practices
        "hipaa-sec-312-a1",    # Access Control
        "hipaa-sec-312-a2-i",  # Unique User Identification
        "hipaa-sec-312-d",     # Person/Entity Authentication
        "hipaa-sec-308-a4",    # Information Access Management
        "hipaa-sec-308-a4-i-A",# Isolating Healthcare Clearinghouse Functions
        "hipaa-sec-308-a4-i-B",# Access Authorization
        "hipaa-sec-308-a4-i-C",# Access Establishment and Modification
        "hipaa-priv-522",      # Uses and Disclosures: Minimum Necessary
        "hipaa-sec-312-b",     # Audit Controls
    ],
    mandatory_content=[
        MandatoryContentItem(
            id="pat-access-right",
            title="Right of Access Statement",
            description="Must state that individuals have the right to access their PHI",
            check_keywords=["right to access", "right of access", "individual access", "patient access", "request access to"],
            cfr_reference="45 CFR § 164.524(a)(1)",
            severity="critical",
            remediation="Add a clear statement that individuals have the right to inspect and obtain a copy of their PHI in a designated record set."
        ),
        MandatoryContentItem(
            id="pat-access-timeframe",
            title="Response Timeframe",
            description="Must specify 30-day response window",
            check_keywords=["30 days", "thirty days", "30 calendar days", "response time", "within 30"],
            cfr_reference="45 CFR § 164.524(b)(2)",
            severity="critical",
            remediation="Specify that the organization will act on access requests no later than 30 days after receipt, with one 30-day extension permitted."
        ),
        MandatoryContentItem(
            id="pat-access-format",
            title="Format Options",
            description="Must offer PHI in format requested by individual",
            check_keywords=["requested format", "electronic format", "electronic copy", "paper copy", "form and format"],
            cfr_reference="45 CFR § 164.524(c)(2)",
            severity="high",
            remediation="Include provision that PHI will be provided in the format requested by the individual, if readily producible, or in a readable hard copy or other agreed-upon format."
        ),
        MandatoryContentItem(
            id="pat-access-fees",
            title="Fee Schedule",
            description="Must address reasonable cost-based fees",
            check_keywords=["fee", "cost", "charge", "reasonable cost", "cost-based", "no charge", "free"],
            cfr_reference="45 CFR § 164.524(c)(4)",
            severity="high",
            remediation="Document the fee policy for providing PHI copies. Fees must be reasonable and cost-based, limited to copying costs, postage, and preparation of summary if requested."
        ),
        MandatoryContentItem(
            id="pat-access-denial",
            title="Grounds for Denial",
            description="Must list permissible reasons for denying access",
            check_keywords=["denial", "deny", "denied", "grounds for denial", "reasons for denial", "unreviewable", "reviewable"],
            cfr_reference="45 CFR § 164.524(a)(2)-(3)",
            severity="high",
            remediation="List the specific grounds for denial (both reviewable and unreviewable), such as: endangerment to individual/others, reference to another person, psychotherapy notes, legal proceedings."
        ),
        MandatoryContentItem(
            id="pat-access-appeal",
            title="Appeal / Review Process",
            description="Must provide review process for denied requests",
            check_keywords=["appeal", "review", "reconsideration", "designated reviewer", "complaint"],
            cfr_reference="45 CFR § 164.524(d)(4)",
            severity="high",
            remediation="Include a process for individuals to have denials reviewed by a licensed healthcare professional not involved in the original denial decision."
        ),
        MandatoryContentItem(
            id="pat-access-designated-record-set",
            title="Designated Record Set Definition",
            description="Must define what constitutes the designated record set",
            check_keywords=["designated record set", "medical record", "billing record", "enrollment record", "record set"],
            cfr_reference="45 CFR § 164.501",
            severity="medium",
            remediation="Define what constitutes the designated record set, including medical records, billing records, and other records used to make decisions about individuals."
        ),
    ],
    category_weights={
        "Privacy Rule": 0.40,
        "Technical Safeguards": 0.25,
        "Administrative Safeguards": 0.25,
        "Policies and Procedures": 0.10,
    }
)
```

---

## 3. Smart Scoring Algorithm

### Two-Tier Scoring:

**Tier 1: Requirement Compliance Score (60% of total)**
- Only check applicable requirements for the document type
- Same keyword matching + negative pattern detection
- Score = compliant requirements / total applicable requirements (weighted by severity)

**Tier 2: Mandatory Content Score (40% of total)**
- Check each mandatory content item
- Each item: found (100%) / partially found (50%) / missing (0%)
- Weight by severity: critical=3x, high=2x, medium=1x

**Combined Score:**
```
document_score = (requirement_score × 0.60) + (mandatory_content_score × 0.40)
```

**For "other" type documents (unclassified):**
- Fall back to current behavior (all 73 requirements)
- No mandatory content check
- Score = 100% requirement-based

### Missing Content Flagging:
Each missing mandatory content item generates a **Gap** with:
- Clear description of what's missing
- CFR reference for why it's required
- Specific remediation text telling user exactly what to add
- Severity level (critical items shown first)

---

## 4. Document Versioning Enhancements

### Existing Infrastructure (already built):
- `Document.version` (int, default=1)
- `Document.previous_version_id` (FK to documents.id)
- `Document.is_latest` (bool, default=True)
- `Document.version_notes` (str)
- `POST /documents/{id}/versions` endpoint
- `GET /documents/{id}/versions` endpoint
- Old compliance checks set to "superseded" on new version

### New Additions:

#### Backend:
- **Auto-analyze new versions** — when `POST /documents/{id}/versions` is called, auto-analyze immediately
- **Score comparison endpoint** — `GET /documents/{id}/version-comparison` returns score changes between versions
- **Version response includes**: previous_score, current_score, score_delta, new_gaps, resolved_gaps

#### Frontend:
- **"Upload New Version" button** on document detail view
- **Version timeline** showing: version number, upload date, score, score delta (↑↓)
- **Score trend sparkline** across versions
- **Diff view**: what gaps were resolved vs. what new gaps appeared

---

## 5. Tenant Isolation

### Already Handled:
- All DB models have `tenant_id` (indexed)
- All endpoints use `require_permission()` → `TenantContext`
- Queries always filter by `org_id` + `tenant_id`

### Verify During Implementation:
- New analysis results always inherit tenant_id from the document
- Version history queries scoped to tenant
- Score aggregation (official compliance number) scoped per tenant

---

## 6. Implementation Order

### Phase 1: Document Requirements Mapping (Backend)
1. Create `apps/api/src/hipaa/document_requirements.py`
   - Define all 20+ DocumentTypeRequirements with full mappings
   - Each with applicable_requirement_ids + mandatory_content
   - Include MandatoryContentItem for every key content piece
2. Enhance `document_processor.py` classification to detect all 20+ types

### Phase 2: Smart Analyzer (Backend)
1. Create `apps/api/src/hipaa/smart_analyzer.py`
   - `smart_analyze_document()` — type-aware analysis
   - Detects document type → fetches applicable requirements → analyzes only those
   - Checks mandatory content → generates missing content gaps
   - Calculates two-tier score
2. Wire into `_auto_analyze_document()` in documents endpoint
3. Wire into manual analysis endpoint
4. Add mandatory_content findings to ComplianceCheck results

### Phase 3: Version Score Tracking (Backend)
1. Add version comparison endpoint
2. Enhance version upload to auto-analyze + return score delta
3. Add "official score" concept per document type per tenant

### Phase 4: Frontend UI
1. Show document type detection + applicable requirements count
2. Display mandatory content checklist (found/missing) with remediation
3. Version upload button + version timeline with scores
4. Score delta indicators (↑↓) on version history
5. Findings organized by: Missing Content → Non-Compliant → Partial → Compliant

### Phase 5: Testing & Polish
1. Test with real HIPAA document samples
2. Verify tenant isolation
3. Verify PostgreSQL compatibility
4. Edge cases: empty docs, non-HIPAA docs, very large docs

---

## 7. Key Design Decisions

1. **Scoring split**: 60% requirement compliance / 40% mandatory content — mandatory content is critical for audit readiness
2. **Unknown document types**: Fall back to full 73-requirement analysis (no degradation)
3. **Multi-type documents**: If a doc spans multiple types (e.g., combined policy manual), detect primary type but also check secondary type requirements
4. **Confidence threshold**: Only classify if confidence ≥ 0.4, otherwise treat as "other"
5. **No breaking changes**: Old analysis results remain valid; new analysis adds type-aware metadata
6. **Version score = official score**: Latest version's score is the tenant's compliance score for that document type
