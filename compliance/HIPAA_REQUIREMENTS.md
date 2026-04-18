# HIPAA Compliance Requirements Reference
**Version**: 2026.02 | **Authority**: HHS Office for Civil Rights (OCR)
**Primary Law**: Health Insurance Portability and Accountability Act of 1996 (Pub. L. 104-191)
**Enhanced by**: HITECH Act 2009 | HIPAA Omnibus Rule 2013 | 42 CFR Part 2 Final Rule 2024
**Pending**: HIPAA Security Rule NPRM (Federal Register Jan 6, 2025) — finalization targeted May 2026

> **HOW TO USE THIS DOCUMENT**
> - Each rule section includes the CFR citation for machine-searchable lookup
> - `[R]` = Required implementation specification | `[A]` = Addressable (must implement, document equivalent, or justify non-implementation)
> - Sections are cross-linked for audit trail and gap analysis
> - State-specific overrides are in Section 11

---

## TABLE OF CONTENTS

1. [Who Must Comply — Entity Classification](#1-who-must-comply--entity-classification)
2. [Protected Health Information (PHI) — Definitions & Scope](#2-protected-health-information-phi--definitions--scope)
3. [Privacy Rule Requirements (45 CFR Part 164, Subpart E)](#3-privacy-rule-requirements-45-cfr-part-164-subpart-e)
4. [Security Rule Requirements (45 CFR Part 164, Subpart C)](#4-security-rule-requirements-45-cfr-part-164-subpart-c)
5. [Breach Notification Rule (45 CFR Part 164, Subpart D)](#5-breach-notification-rule-45-cfr-part-164-subpart-d)
6. [Enforcement Rule & Penalties (45 CFR Part 160)](#6-enforcement-rule--penalties-45-cfr-part-160)
7. [Business Associate Requirements](#7-business-associate-requirements)
8. [Special Categories of PHI](#8-special-categories-of-phi)
9. [Individual Rights](#9-individual-rights)
10. [Permitted Uses & Disclosures Without Authorization](#10-permitted-uses--disclosures-without-authorization)
11. [State Law Preemption & State-Specific Requirements](#11-state-law-preemption--state-specific-requirements)
12. [Employer / Health Plan Requirements by Entity Size](#12-employer--health-plan-requirements-by-entity-size)
13. [HITECH Act Extensions](#13-hitech-act-extensions)
14. [42 CFR Part 2 — Substance Use Disorder Records](#14-42-cfr-part-2--substance-use-disorder-records)
15. [Upcoming Changes — 2025/2026 Security Rule NPRM](#15-upcoming-changes--20252026-security-rule-nprm)
16. [Compliance Checklist by Entity Type](#16-compliance-checklist-by-entity-type)

---

## 1. WHO MUST COMPLY — ENTITY CLASSIFICATION

**CFR Basis**: 45 CFR § 160.102, § 160.103

### 1.1 Covered Entities (Direct HIPAA Obligation)

| Entity Type | Definition | Examples | Threshold |
|---|---|---|---|
| **Healthcare Provider** | Provider of medical/health services who transmits PHI electronically in connection with covered transactions | Hospitals, physician offices, clinics, dentists, chiropractors, psychologists, nursing homes, pharmacies, home health agencies, telehealth platforms | Must conduct at least ONE covered electronic transaction (billing, eligibility, etc.) |
| **Health Plan** | Individual or group plan providing/paying for medical care | Health insurance companies, HMOs, PPOs, Medicare, Medicaid, CHIP, TRICARE, employer-sponsored group health plans, EAPs (if covering medical care) | All health plans regardless of size (with narrow exceptions — see §1.3) |
| **Healthcare Clearinghouse** | Entity processing nonstandard health data to/from standard formats | Billing services, repricing companies, community health management information systems | All clearinghouses |

### 1.2 Business Associates (Indirect HIPAA Obligation)

Any person or organization that performs functions or activities on behalf of a covered entity that involve the creation, receipt, maintenance, or transmission of PHI. Direct HIPAA liability under HITECH Act and Omnibus Rule 2013.

**Examples include:**
- EHR/software vendors
- Cloud storage providers (AWS, Azure, GCP storing PHI)
- Medical transcription services
- Billing companies and revenue cycle management
- Data analytics and population health companies
- Legal, accounting, consulting firms with PHI access
- Document destruction companies
- Laboratories receiving PHI
- Telehealth technology platforms
- Managed service providers (MSPs) with PHI system access
- Subcontractors of business associates (chain liability)

### 1.3 Exemptions & Exceptions

| Situation | Rule |
|---|---|
| Employer acting as employer (not as health plan) | NOT a covered entity for employment records |
| Providers who never transmit PHI electronically | NOT required to comply (rare in practice) |
| Fully self-administered group health plan with **< 50 participants** | Exempt from Privacy and Security Rules (see §12) |
| Workers' compensation insurers | Generally not covered entities for WC purposes |
| Life insurance companies | Not covered if not providing medical coverage |
| School health records (FERPA-covered) | FERPA governs, not HIPAA |
| Employers accessing PHI for employment decisions | NOT a covered entity role |

### 1.4 Covered Transactions (Electronic) — 45 CFR Part 162

An entity only qualifies as a healthcare provider covered entity if it conducts one or more of these standard electronic transactions:

- Health care claims (837)
- Health care payment and remittance advice (835)
- Eligibility inquiry and response (270/271)
- Referral certification/authorization (278)
- Coordination of benefits
- Health care claim status (276/277)
- Premium payment (820)
- First report of injury

---

## 2. PROTECTED HEALTH INFORMATION (PHI) — DEFINITIONS & SCOPE

**CFR Basis**: 45 CFR § 160.103, § 164.514

### 2.1 Definition of PHI

PHI is **any individually identifiable health information** that is:
1. Created, received, maintained, or transmitted by a covered entity or business associate
2. Related to: (a) past, present, or future physical/mental health condition; (b) provision of health care; OR (c) past, present, or future payment for health care
3. Identifies (or could reasonably identify) the individual

**Formats covered**: Written, oral, and electronic (ePHI for electronic format)

### 2.2 The 18 PHI Identifiers — Safe Harbor Method (§ 164.514(b)(2))

All of the following must be removed to de-identify health information under the Safe Harbor method:

| # | Identifier | Specifics |
|---|---|---|
| 1 | **Names** | Full name or any component |
| 2 | **Geographic data** | Street address, city, county, precinct, zip code (except first 3 digits if >20,000 people), and geocodes |
| 3 | **Dates** | All except year — birth date, admission date, discharge date, death date; all ages >89 (and elements indicating such age) |
| 4 | **Phone numbers** | All telephone numbers |
| 5 | **Fax numbers** | All fax numbers |
| 6 | **Email addresses** | All email addresses |
| 7 | **Social Security numbers** | Full or partial SSN |
| 8 | **Medical record numbers** | All MRN and chart numbers |
| 9 | **Health plan beneficiary numbers** | Member IDs, policy numbers |
| 10 | **Account numbers** | All financial account numbers |
| 11 | **Certificate/license numbers** | Driver's license, professional license, etc. |
| 12 | **Vehicle identifiers** | VIN, license plate numbers |
| 13 | **Device identifiers** | Serial numbers, unique device IDs |
| 14 | **Web URLs** | Universal resource locators |
| 15 | **IP addresses** | Full or partial IP addresses |
| 16 | **Biometric identifiers** | Finger/voice prints |
| 17 | **Full-face photographs** | And any comparable images |
| 18 | **Any other unique identifier** | Any number, code, or characteristic that could identify the individual |

> **Expert Determination Method** (§ 164.514(b)(1)): Alternative to Safe Harbor — a qualified statistician applies generally accepted principles to certify very small re-identification risk.

### 2.3 What is NOT PHI

- De-identified data (meeting §164.514 standards)
- Employment records held by employer in employer capacity
- Education records covered by FERPA
- Deceased persons' information after 50 years (§ 164.502(f))
- Health information about persons who have been dead for more than 50 years

### 2.4 Electronic PHI (ePHI)

ePHI = PHI that is created, received, maintained, or **transmitted electronically**. Subject to BOTH the Privacy Rule AND the Security Rule.

---

## 3. PRIVACY RULE REQUIREMENTS (45 CFR Part 164, Subpart E)

**CFR Basis**: 45 CFR §§ 164.500–164.534
**Applicability**: All covered entities; key provisions extend to business associates via BAA

### 3.1 Minimum Necessary Standard (§ 164.502(b), § 164.514(d))

- Covered entities must make reasonable efforts to limit PHI use/disclosure to the **minimum necessary** to accomplish the intended purpose
- Must identify persons/classes who need access and the PHI needed for each
- Does **NOT** apply to: disclosures to/requests by the individual themselves, treatment purposes between providers, authorizations, required by law disclosures, HHS oversight

### 3.2 Notice of Privacy Practices (NPP) — § 164.520

**Required content**:
- Description of how the entity uses/discloses PHI
- Individual rights (access, amendment, accounting, restriction requests, complaints)
- Entity's legal duties with respect to PHI
- Effective date
- Who to contact for more information
- How to file a complaint with HHS

**Distribution requirements**:
- Health plans: Provide at enrollment, within 60 days of material revision, and upon request
- Healthcare providers: Provide at first service delivery (electronic: at first electronic service, good-faith effort to obtain written acknowledgment)
- Post in prominent location and on website (if applicable)

### 3.3 Uses and Disclosures Requiring Authorization (§ 164.508)

Authorization is required (beyond TPO — see §10) for:
- Marketing communications (with limited exceptions)
- Sale of PHI
- Most research uses (unless waived by IRB/Privacy Board — §10.3)
- Psychotherapy notes (see §8.1)
- Uses of PHI for employer decisions about individuals

**Valid authorization elements** (§ 164.508(c)):
1. Description of information to be used/disclosed
2. Who is authorized to make the use/disclosure
3. Who may receive the PHI
4. Description of purpose
5. Expiration date or event
6. Signature of individual (or representative) and date
7. Statement of right to revoke
8. Statement about conditioning of treatment/payment on authorization (if applicable)
9. Copy to be given to individual

### 3.4 Minimum Required Policies & Procedures

Covered entities must develop, implement, and maintain written policies and procedures for:
- Access and disclosure of PHI
- Individual rights requests (access, amendment, accounting, restriction)
- Notice of Privacy Practices
- Complaints handling
- Training program
- Sanctions for workforce violations
- Documentation and record retention (6 years from creation or last effective date)

### 3.5 Workforce Sanctions (§ 164.530(e))

- Must apply appropriate sanctions against workforce members who violate policies
- Sanctions must be documented
- Applies to all workforce: employees, volunteers, trainees, contractors

### 3.6 Training Requirements (§ 164.530(b))

| Requirement | Detail |
|---|---|
| Initial training | All workforce members trained on privacy policies by compliance date |
| New workforce | Trained within reasonable period of joining |
| Material change | Trained within reasonable period of policy change |
| Documentation | Retain records for 6 years |
| Scope | ALL workforce: employees, volunteers, trainees, contractors who encounter PHI |
| Content | Role-appropriate; must include minimum necessary standard, patient rights, breach reporting |

---

## 4. SECURITY RULE REQUIREMENTS (45 CFR Part 164, Subpart C)

**CFR Basis**: 45 CFR §§ 164.302–164.318
**Applicability**: All covered entities and business associates
**Scope**: Electronic PHI (ePHI) only

### 4.1 General Security Rule Obligations (§ 164.306)

All covered entities and business associates must:
1. Ensure confidentiality, integrity, and availability of all ePHI they create, receive, maintain, or transmit
2. Protect against any reasonably anticipated threats or hazards to the security/integrity of ePHI
3. Protect against any reasonably anticipated uses or disclosures not permitted by the Privacy Rule
4. Ensure compliance by their workforce

**Flexibility Factors** (§ 164.306(b)): When implementing safeguards, entities must consider:
- Size, complexity, and capabilities
- Technical infrastructure and security capabilities
- Costs of security measures
- Probability and criticality of potential risks to ePHI

---

### 4.2 Administrative Safeguards (§ 164.308)

#### 4.2.1 Security Management Process (§ 164.308(a)(1)) — REQUIRED

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Risk Analysis** | `[R]` | Conduct accurate and thorough assessment of potential risks/vulnerabilities to ePHI confidentiality, integrity, availability. Must be comprehensive. |
| **Risk Management** | `[R]` | Implement security measures sufficient to reduce risks to reasonable and appropriate level |
| **Sanction Policy** | `[R]` | Apply appropriate sanctions against workforce members who fail to comply with security policies |
| **Information System Activity Review** | `[R]` | Regularly review records of information system activity (audit logs, access reports, security incident tracking reports) |

#### 4.2.2 Assigned Security Responsibility (§ 164.308(a)(2)) — REQUIRED

- Designate a Security Officer responsible for developing and implementing policies and procedures
- No required credentials specified; must have authority and accountability
- Must be documented (name/title)

#### 4.2.3 Workforce Security (§ 164.308(a)(3))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Authorization and/or Supervision** | `[A]` | Implement procedures for authorizing workforce access to ePHI and for supervising those who work with ePHI |
| **Workforce Clearance Procedure** | `[A]` | Implement procedures to determine if workforce member's access is appropriate |
| **Termination Procedures** | `[A]` | Implement procedures for revoking access when employment ends |

#### 4.2.4 Information Access Management (§ 164.308(a)(4))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Isolating Healthcare Clearinghouse Functions** | `[R]` | If clearinghouse is part of a larger org, implement policies/procedures to protect ePHI from larger org |
| **Access Authorization** | `[A]` | Implement policies/procedures for granting access to ePHI (e.g., workstations, programs, processes) |
| **Access Establishment and Modification** | `[A]` | Implement policies/procedures for establishing, modifying, and terminating user access to workstations, transactions, and programs |

#### 4.2.5 Security Awareness and Training (§ 164.308(a)(5))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Security Reminders** | `[A]` | Periodic security updates to all workforce members |
| **Protection from Malicious Software** | `[A]` | Procedures for guarding against, detecting, and reporting malicious software |
| **Log-in Monitoring** | `[A]` | Procedures for monitoring log-in attempts and reporting discrepancies |
| **Password Management** | `[A]` | Procedures for creating, changing, and safeguarding passwords |

#### 4.2.6 Security Incident Procedures (§ 164.308(a)(6))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Response and Reporting** | `[R]` | Identify and respond to suspected/known security incidents; mitigate harmful effects; document incidents and outcomes |

#### 4.2.7 Contingency Plan (§ 164.308(a)(7))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Data Backup Plan** | `[R]` | Establish and implement procedures for exact copy of ePHI |
| **Disaster Recovery Plan** | `[R]` | Establish (and implement as needed) procedures to restore ePHI lost in emergency |
| **Emergency Mode Operation Plan** | `[R]` | Establish (and implement as needed) procedures to enable continuation of critical business processes for protection of ePHI during emergency |
| **Testing and Revision Procedures** | `[A]` | Implement procedures for periodic testing and revision of contingency plans |
| **Applications and Data Criticality Analysis** | `[A]` | Assess relative criticality of specific applications and data in support of contingency plan components |

#### 4.2.8 Evaluation (§ 164.308(a)(8)) — REQUIRED

- Perform periodic technical and non-technical evaluation based initially on standards and when environmental or operational changes occur
- Documents compliance with Security Rule
- May be internal or external evaluation

#### 4.2.9 Business Associate Contracts and Other Arrangements (§ 164.308(b)) — REQUIRED

- Covered entity must obtain satisfactory assurances from business associates that they will appropriately safeguard ePHI
- Documented in BAA (see §7)

---

### 4.3 Physical Safeguards (§ 164.310)

#### 4.3.1 Facility Access Controls (§ 164.310(a)(1))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Contingency Operations** | `[A]` | Establish procedures to allow facility access to authorized personnel in support of emergency restoration of data under disaster recovery plan |
| **Facility Security Plan** | `[A]` | Implement policies and procedures to safeguard facility and equipment from unauthorized physical access, tampering, and theft |
| **Access Control and Validation Procedures** | `[A]` | Implement procedures to control and validate a person's access to facilities based on their role or function (including visitor control and access to software programs) |
| **Maintenance Records** | `[A]` | Implement policies and procedures to document repairs and modifications to physical components of facility related to security |

#### 4.3.2 Workstation Use (§ 164.310(b)) — REQUIRED

- Implement policies and procedures specifying proper functions, manner of performance, and physical attributes of workstations that access ePHI
- Applies to all workstations (on-premises and remote)

#### 4.3.3 Workstation Security (§ 164.310(c)) — REQUIRED

- Implement physical safeguards for all workstations with access to ePHI to restrict access to authorized users only
- Includes screens facing away from public, privacy screens, locked workstations

#### 4.3.4 Device and Media Controls (§ 164.310(d)(1))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Disposal** | `[R]` | Implement policies and procedures to address final disposition of ePHI and/or hardware/media on which it is stored |
| **Media Re-use** | `[R]` | Implement procedures for removal of ePHI from electronic media before the media are made available for reuse |
| **Accountability** | `[A]` | Maintain a record of the movements of hardware and electronic media and any person responsible for them |
| **Data Backup and Storage** | `[A]` | Create a retrievable, exact copy of ePHI before movement of equipment |

---

### 4.4 Technical Safeguards (§ 164.312)

#### 4.4.1 Access Control (§ 164.312(a)(1))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Unique User Identification** | `[R]` | Assign a unique name and/or number for identifying and tracking user identity |
| **Emergency Access Procedure** | `[R]` | Establish (and implement as needed) procedures for obtaining necessary ePHI during an emergency |
| **Automatic Logoff** | `[A]` | Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity |
| **Encryption and Decryption** | `[A]` | Implement a mechanism to encrypt and decrypt ePHI |

#### 4.4.2 Audit Controls (§ 164.312(b)) — REQUIRED

- Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI
- No specific log formats required, but logs must be reviewable and retained

#### 4.4.3 Integrity (§ 164.312(c)(1))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Mechanism to Authenticate ePHI** | `[A]` | Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner |

#### 4.4.4 Person or Entity Authentication (§ 164.312(d)) — REQUIRED

- Implement procedures to verify that a person or entity seeking access to ePHI is who they claim to be
- Methods: passwords/PINs, smart cards, biometrics, telephone callbacks

#### 4.4.5 Transmission Security (§ 164.312(e)(1))

| Implementation Specification | Type | Requirement |
|---|---|---|
| **Integrity Controls** | `[A]` | Implement security measures to ensure that electronically transmitted ePHI is not improperly modified without detection until disposed of |
| **Encryption** | `[A]` | Implement a mechanism to encrypt ePHI whenever deemed appropriate |

---

### 4.5 Documentation Requirements (§ 164.316)

| Requirement | Type | Detail |
|---|---|---|
| **Policies and Procedures** | `[R]` | Implement reasonable and appropriate policies and procedures to comply with Security Rule |
| **Time Limit** | `[R]` | Retain documentation for 6 years from date of creation or date it was last in effect, whichever is later |
| **Availability** | `[R]` | Make policies and procedures available to workforce members who need them |
| **Updates** | `[R]` | Review and update policies/procedures in response to environmental or operational changes |

---

## 5. BREACH NOTIFICATION RULE (45 CFR Part 164, Subpart D)

**CFR Basis**: 45 CFR §§ 164.400–164.414

### 5.1 Definition of Breach (§ 164.402)

A breach is the **acquisition, access, use, or disclosure of PHI** in a manner not permitted by the Privacy Rule that **compromises the security or privacy** of the PHI.

**Presumption Rule**: Any impermissible use or disclosure is presumed a breach unless the covered entity or business associate demonstrates that there is a low probability that the PHI has been compromised based on the **four-factor risk assessment** (see §5.2).

### 5.2 Four-Factor Breach Risk Assessment

To rebut the presumption of breach, entities must assess:

| Factor | Questions to Evaluate |
|---|---|
| **1. Nature and extent of PHI** | What types of identifiers were involved? Is the information sensitive (e.g., financial, SSN, clinical diagnoses)? What is the likelihood of re-identification? |
| **2. Who accessed the PHI** | Was the unauthorized recipient subject to HIPAA? Another covered entity or BA? An unaffiliated external party? |
| **3. Whether PHI was actually acquired or viewed** | Can you determine if data was merely exposed or actually accessed/exfiltrated? (e.g., server log analysis) |
| **4. Extent to which risk has been mitigated** | Have satisfactory assurances been obtained that PHI was not used or disclosed? Has the data been destroyed/returned? |

### 5.3 Exclusions from Breach Definition (§ 164.402(2))

Three specific situations are NOT considered breaches:
1. Unintentional acquisition, access, or use by a workforce member acting in good faith within the scope of authority, with no further use or disclosure
2. Inadvertent disclosure between two authorized persons at the same covered entity/BA, with no further use or disclosure
3. Covered entity/BA has a good-faith belief that the unauthorized person who received the PHI could not have retained it

### 5.4 Notification Requirements

#### Individual Notification (§ 164.404)
- **Timeline**: Without unreasonable delay; **no later than 60 calendar days** after discovery
- **Discovery date**: First day breach is known or would have been known with reasonable diligence
- **Method**: Written notice by first-class mail to last known address; email if individual has agreed
- **Substitute notice**: If contact information is insufficient for <10 individuals, phone or written notice; for ≥10 individuals, post on website or major print/broadcast media
- **Content required**:
  - Brief description of what happened (dates of breach and discovery)
  - Description of types of PHI involved
  - Steps individuals should take to protect themselves
  - Description of what entity is doing to investigate, mitigate, and prevent recurrence
  - Contact information (toll-free phone number, email, website, or mailing address)

#### Media Notification (§ 164.406)
- Required when breach involves **>500 residents of a state or jurisdiction**
- Notify prominent media outlets serving that state/jurisdiction
- **Timeline**: Without unreasonable delay; no later than 60 calendar days after discovery
- Same content as individual notice

#### HHS Secretary Notification (§ 164.408)
- **Breaches affecting ≥500 individuals**: Notify HHS contemporaneously with individual notification (within 60 days of discovery)
- **Breaches affecting <500 individuals**: Log annually; submit to HHS within 60 days after end of calendar year in which breach occurred
- Submitted via HHS breach reporting portal

#### Business Associate Notification to Covered Entity (§ 164.410)
- BAs must notify covered entity without unreasonable delay, and **no later than 60 calendar days** from discovery
- BA must provide identification of individuals affected (if known)
- BA responsible for notifying covered entity even if BA cannot identify all affected individuals

### 5.5 Law Enforcement Delay (§ 164.412)

If law enforcement requests a delay in notification, covered entity may delay up to:
- 30 days (verbal request from law enforcement official) — must obtain written request within 30 days
- 90 days (written request)

---

## 6. ENFORCEMENT RULE & PENALTIES (45 CFR Part 160)

**CFR Basis**: 45 CFR Part 160, Subparts C, D, E

### 6.1 Civil Monetary Penalties — Four-Tier Structure

**Effective**: August 8, 2024 (annually adjusted for inflation)

| Tier | Culpability | Min Per Violation | Max Per Violation | Annual Cap (OCR Discretion) |
|---|---|---|---|---|
| **Tier 1** | Did not know (and with due diligence could not have known) | $141 | $71,162 | $35,581 |
| **Tier 2** | Reasonable cause (knew or should have known, not willful neglect) | $1,424 | $71,162 | $142,355 |
| **Tier 3** | Willful neglect — corrected within 30 days | $14,232 | $71,162 | $2,134,831 |
| **Tier 4** | Willful neglect — NOT corrected within 30 days | $71,162 | $71,162 | $2,134,831 |

> **Note**: OCR's 2019 Notice of Enforcement Discretion reduced annual caps for Tiers 1–3. Tier 4 remains uncapped at $2,134,831 per year per identical violation provision.

### 6.2 Criminal Penalties (§ 1177 of HIPAA / 42 U.S.C. § 1320d-6)

| Level | Conduct | Prison | Fine |
|---|---|---|---|
| Basic | Knowingly obtaining/disclosing PHI | Up to 1 year | Up to $50,000 |
| Enhanced | Under false pretenses | Up to 5 years | Up to $100,000 |
| Aggravated | For commercial advantage, personal gain, or malicious harm | Up to 10 years | Up to $250,000 |

Criminal penalties enforced by Department of Justice (DOJ), not OCR.

### 6.3 Statute of Limitations

- Civil: 6 years from date of violation (discovery rule may extend)
- OCR must impose CMP within 6 years of violation

### 6.4 Factors Considered in Penalty Determination

- Nature and extent of the violation
- Number of individuals affected
- Nature and extent of harm resulting
- Culpability of the covered entity
- History of prior compliance
- Financial condition of entity
- Whether the violation was corrected

### 6.5 Resolution Agreements

HHS/OCR may enter Resolution Agreements (RAs) with covered entities instead of formal enforcement. RAs typically include:
- Financial settlement
- Corrective action plan (CAP) with 1–3 year monitoring period
- Annual compliance reports to OCR

### 6.6 Audit Program

HHS OCR conducts periodic audits of covered entities and business associates under authority granted by HITECH Act. Audits assess:
- Privacy Rule compliance
- Security Rule compliance
- Breach Notification Rule compliance

---

## 7. BUSINESS ASSOCIATE REQUIREMENTS

**CFR Basis**: 45 CFR §§ 164.502(e), 164.504(e), 164.308(b), 160.103

### 7.1 Business Associate Agreement (BAA) Requirements

A BAA is **mandatory** before sharing PHI with a business associate. BAA must include:

**Required provisions** (§ 164.504(e)):
- Describe permitted and required uses of PHI
- Prohibit BA from using/disclosing PHI other than as permitted or required by contract or law
- Require BA to use appropriate safeguards (for non-electronic PHI) and comply with Security Rule (for ePHI)
- Require BA to report to CE any security incidents or breaches
- Require BA to ensure subcontractors agree to same restrictions via their own BAA
- Require BA to make PHI available for individual access, amendment, and accounting requests
- Make internal practices available to HHS for audit purposes
- Return or destroy all PHI upon termination of contract (or provide justification for retention)
- Authorize covered entity to terminate agreement if BA violates material term

### 7.2 Business Associate Direct Obligations (Post-HITECH/Omnibus)

Business associates are directly liable for:
- Compliance with Security Rule (all safeguards)
- Not using or disclosing PHI beyond what BAA permits
- Not using or disclosing PHI in ways that would violate the Privacy Rule if done by a CE
- Complying with Breach Notification Rule (notifying CE within 60 days)
- Ensuring subcontractors agree to same restrictions via BAA
- Providing PHI to covered entity upon individual access requests
- Returning/destroying PHI at contract termination

### 7.3 Subcontractor Chain Requirements

When a BA uses a subcontractor who will create, receive, maintain, or transmit PHI on behalf of the BA:
- BA must obtain a BAA from the subcontractor
- Subcontractor has same obligations as BA
- Chain of liability flows through all tiers

### 7.4 Exceptions to BAA Requirement

BAA is **NOT** required when:
- CE discloses PHI to a provider for treatment purposes (but some BAA provisions may still be appropriate)
- CE discloses PHI as required by law
- The recipient is not a business associate (e.g., regulatory agencies, accreditation organizations)
- Disclosure is to a health plan member directly

---

## 8. SPECIAL CATEGORIES OF PHI

### 8.1 Psychotherapy Notes (§ 164.501, § 164.508(a)(2))

**Definition**: Notes recorded by a mental health professional documenting or analyzing the contents of a private, group, joint, or family counseling session, **stored separately** from the rest of the medical record.

**What is NOT psychotherapy notes** (and therefore NOT entitled to extra protection):
- Medication prescription and monitoring
- Counseling session start and stop times
- Modalities and frequencies of treatment
- Results of clinical tests
- Summaries of diagnosis, functional status, treatment plan, symptoms, prognosis, progress

**Rules**:
- Patient authorization required for **virtually all** uses and disclosures (even for treatment by other providers)
- **Exceptions** (no authorization needed): Required by law, oversight of mental health professional, coroner/medical examiner, threat to health or safety, defense of legal action by individual, HHS required disclosures

### 8.2 Substance Use Disorder Records — 42 CFR Part 2 (Updated 2024)

**Authority**: 42 U.S.C. § 290dd-2, 42 CFR Part 2 (Final Rule effective April 16, 2024; compliance by February 16, 2026)

**Applies to**: Federally assisted substance use disorder treatment programs

**Key 2024 Changes** (aligning Part 2 more closely with HIPAA):
- Single consent now allowed for all TPO uses/disclosures (same as HIPAA)
- Breach notification requirements now aligned with HIPAA
- Criminal penalties replaced with civil/criminal enforcement same as HIPAA
- New SUD Counseling Notes category (analogous to psychotherapy notes) — requires specific consent
- Public health disclosures allowed without consent if data is de-identified per HIPAA
- Patients now have right to accounting of disclosures and restriction requests

**Still MORE restrictive than HIPAA**:
- Consent required to disclose to other providers (not just TPO-covered)
- Cannot disclose to law enforcement without specific consent or court order
- Re-disclosure restrictions flow with the record to new recipients

### 8.3 HIV/AIDS Information

- Many states have laws requiring specific written authorization for disclosure of HIV status (stricter than HIPAA)
- HIPAA does not specifically distinguish HIV information, but state laws may require additional protections
- See state-specific requirements in §11

### 8.4 Reproductive Health Information (§ 164.502(a)(5)(iii) — Added Dec 2024)

**New HIPAA Rule (effective Dec 23, 2024)**:
- Covered entities and business associates are prohibited from using or disclosing PHI to investigate or prosecute individuals seeking lawful reproductive health care
- Prohibition applies to law enforcement and similar disclosures
- New attestation requirement: When CE/BA receives a request for PHI for certain purposes (oversight, law enforcement, judicial proceedings), requester must attest that the information is NOT sought to investigate lawful reproductive health care

### 8.5 Genetic Information

**GINA** (Genetic Information Nondiscrimination Act) and HIPAA together:
- HIPAA Privacy Rule prohibits health plans from using/disclosing genetic information for underwriting purposes
- Applies to genetic information as PHI when held by a covered entity
- Enhanced state protections exist in many states (see §11)

### 8.6 Mental Health Records (General)

- Treated same as other PHI under HIPAA (with exception for psychotherapy notes)
- Many state laws provide additional protections beyond HIPAA (see §11)
- Minors' mental health records: state law governs when minors can authorize treatment independently

---

## 9. INDIVIDUAL RIGHTS

**CFR Basis**: 45 CFR §§ 164.520–164.534

| Right | CFR Section | Key Requirements |
|---|---|---|
| **Right of Access** | § 164.524 | Individual may inspect and obtain copy of PHI in designated record set. CE must respond within **30 days** (one 30-day extension allowed with written notice). Fee limitation: only actual labor, supply, and postage costs — no retrieval fees. Electronic format required if PHI is electronic. |
| **Right to Amend** | § 164.526 | Individual may request amendment to PHI in designated record set. CE must act within **60 days** (one 60-day extension with written notice). May deny if not created by CE, not part of designated record set, not available for inspection, or accurate and complete. Must accommodate or provide denial with right to submit statement of disagreement. |
| **Accounting of Disclosures** | § 164.528 | Individual may request accounting of disclosures made in prior **6 years**. Must include: date, name/address of recipient, description of PHI disclosed, purpose. Excludes: TPO disclosures, disclosures to individual, authorized disclosures. Response within **60 days** (one 60-day extension). |
| **Right to Restrict** | § 164.522(a) | Individual may request restriction on use/disclosure of PHI. CE generally not required to agree. **EXCEPTION**: Must agree to restrict disclosure to health plan if individual paid out-of-pocket in full and disclosure is not otherwise required by law. |
| **Right to Confidential Communication** | § 164.522(b) | Providers must accommodate reasonable requests for alternative means/locations for communications. Health plans must accommodate if individual states disclosure could endanger. |
| **Right to Notice** | § 164.520 | Right to receive NPP (see §3.2). |
| **Right to Complain** | § 164.530(d) | Must provide mechanism for individuals to file complaints. Cannot retaliate or require waiver of rights. |

---

## 10. PERMITTED USES & DISCLOSURES WITHOUT AUTHORIZATION

**CFR Basis**: 45 CFR §§ 164.502, 164.506, 164.510, 164.512

### 10.1 Treatment, Payment, Healthcare Operations (TPO) — § 164.506

PHI may be used and disclosed without authorization for:

| Category | Definition | Examples |
|---|---|---|
| **Treatment** | Provision, coordination, or management of health care and related services | Provider-to-provider sharing for care coordination, referrals, consultations |
| **Payment** | Activities for obtaining or providing reimbursement for health care | Billing, claims processing, prior authorization, coverage determinations |
| **Healthcare Operations** | Administrative, financial, legal, quality assurance functions | QI activities, credentialing, audits, legal services, business planning, training |

### 10.2 Other Permitted Disclosures Without Authorization (§ 164.512)

| Purpose | Key Conditions |
|---|---|
| **Required by law** | State reporting requirements, mandatory reporting laws |
| **Public health activities** | To authorized public health authorities for disease surveillance, reporting, intervention |
| **Victims of abuse/neglect** | To government authorities authorized to receive such reports |
| **Health oversight activities** | To health oversight agencies for audits, investigations, licensure |
| **Judicial and administrative proceedings** | With court order or satisfying specific procedural requirements |
| **Law enforcement** | Limited circumstances: required by law, court orders, locating fugitives/missing persons (with specific restrictions) |
| **Decedents** | To coroners, medical examiners, funeral directors |
| **Organ/tissue donation** | To organ procurement organizations |
| **Research** | With IRB/Privacy Board waiver of authorization, or meeting specific criteria (see §10.3) |
| **Serious threat to health/safety** | Serious and imminent threat, disclosure to persons who can prevent/lessen the threat |
| **Specialized government functions** | Military, national security, correctional institutions |
| **Workers' compensation** | As authorized by and to the extent necessary for workers' comp purposes |

### 10.3 Research Disclosures — § 164.512(i)

PHI may be used for research without authorization if:
- **IRB/Privacy Board waiver** is documented (criteria: minimal privacy risk, identifiers destroyed at earliest opportunity, no reuse, research couldn't practicably be conducted otherwise)
- **Preparatory to research** (not removing PHI from CE premises)
- **Research on decedents** (with documentation that PHI is necessary)
- **Limited data set** with data use agreement (DUA) — fewer than 18 identifiers removed

---

## 11. STATE LAW PREEMPTION & STATE-SPECIFIC REQUIREMENTS

**CFR Basis**: 45 CFR Part 160, Subpart B (§§ 160.201–160.205)

### 11.1 General Preemption Rule

HIPAA **preempts** (supersedes) contrary state laws UNLESS:
- State law is **more stringent** (provides greater privacy protections or more individual rights)
- State exception applies (public health activities, reporting, newborn testing, crime victims, state regulatory purpose)
- Secretary grants exception

**"More stringent" means** (§ 160.202): A state law that:
- Prohibits or restricts a use/disclosure that HIPAA would permit
- Permits greater rights of access or amendment
- Provides greater privacy protection
- Requires shorter timelines (e.g., shorter response windows)

### 11.2 Key States with Stricter Health Privacy Laws

| State | Law | Key Differences from HIPAA |
|---|---|---|
| **California** | Confidentiality of Medical Information Act (CMIA), CPRA | Broader definition of medical information; private right of action (up to $1,000 per negligent violation, $3,000 per intentional); covers employers not covered by HIPAA; stricter consent requirements |
| **Washington** | My Health My Data Act (MHMDA) — effective Mar 31, 2024 (large) / Jun 30, 2024 (small) | Broadest health data definition: includes fitness/wellness app data, inferences, location data near medical facilities; applies to ANY entity handling Washington consumer health data (not just HIPAA CEs); private right of action |
| **New York** | NY Health Information Privacy Act (NY HIPA) | Expands patient rights; AG enforcement; civil penalties up to $15,000 per violation or 20% of NY revenue |
| **Texas** | Texas Medical Records Privacy Act | Stricter limits on disclosures; criminal penalties for violations; covers additional entities |
| **Illinois** | Genetic Information Privacy Act (GIPA); Mental Health and Developmental Disabilities Confidentiality Act | Heightened protections for genetic and mental health information |
| **Nevada** | Consumer Health Data Privacy Law (SB 370) | Applies to regulated entities outside HIPAA; consent before collection/processing of consumer health data; deletion rights |
| **Connecticut** | Public Act 23-16 | Consumer health data protections; right to delete; applies to entities not covered by HIPAA |
| **Virginia** | VCDPA with health data provisions | Sensitive data category; consumer rights including deletion |
| **Florida** | Florida Health Information Act | Stricter requirements for mental health, HIV, reproductive health disclosures |

### 11.3 Universal State Requirements (Most States)

Regardless of HIPAA, virtually all states require:
- Mandatory reporting: communicable diseases, child abuse, domestic violence (varies by state)
- Specific consent for: HIV/AIDS disclosure, mental health records, reproductive health records, substance abuse records
- State-specific breach notification laws (many stricter than HIPAA's 60-day window — some require notification within 30 or 45 days)
- Specific requirements for minors' records and parental access

### 11.4 State Breach Notification Timing Comparison

| State | Notification Deadline |
|---|---|
| HIPAA (federal floor) | 60 days from discovery |
| California | 72 hours for covered entities (CMIA/AB 1130) |
| Florida | 30 days |
| Ohio | 45 days |
| New York | Most expedient time, reasonable delay |
| Texas | 60 days (matches HIPAA) |
| Washington | 30 days |

### 11.5 Reproductive Health State Laws

Post-Dobbs landscape (2022+): States have enacted conflicting laws regarding sharing of reproductive health information. Key considerations:
- Some states criminalize providing certain reproductive health services
- HIPAA's December 2024 rule prohibits CEs from disclosing PHI to investigate lawful reproductive health care
- Entities must navigate both federal prohibition and varying state laws
- Attestation requirement applies when requests could relate to reproductive health (see §8.4)

---

## 12. EMPLOYER / HEALTH PLAN REQUIREMENTS BY ENTITY SIZE

**CFR Basis**: 45 CFR § 160.103 (definition of "group health plan"), § 164.530

### 12.1 Employer Classification Matrix

| Employer Type | Employee Count | Plan Type | HIPAA Applies? |
|---|---|---|---|
| Employer with no group health plan | Any | N/A | No — pure employers are not covered entities |
| Employer with fully-insured group health plan | Any | Insured by third-party carrier | Limited — Privacy Rule applies with limited carve-out; insurer is the CE |
| Employer with self-insured, self-administered plan | **< 50 participants** | Self-funded + self-administered | **EXEMPT** from Privacy and Security Rules |
| Employer with self-insured, self-administered plan | **≥ 50 participants** | Self-funded + self-administered | **Fully subject to HIPAA** |
| Employer with self-insured plan using third-party administrator (TPA) | Any | Self-funded + TPA | **Fully subject to HIPAA** (any size) |
| EAP/Wellness plan (if covering medical care) | Any | Any | May be covered; depends on whether medical benefits provided |
| Health FSA administered by employer | < 50 participants | Self-administered FSA | Typically exempt if combined with above exemption |
| Health FSA administered by TPA | Any | Any | Fully subject to HIPAA |

### 12.2 Small Provider Considerations

HHS recognizes that small healthcare providers face greater burden. The Security Rule's flexibility clause (§ 164.306(b)) allows small entities to implement less technically complex (but still adequate) safeguards. HHS has published guidance specifically for small providers.

**Special notes for small providers**:
- Single-provider office: Security Officer can be the physician/owner
- Paper-based practices: Still subject to Privacy Rule if ANY electronic transmission of PHI occurs
- Cloud EHR users: EHR vendor is a BA; BAA required even for small practices
- Sole proprietors transmitting claims electronically: Fully covered regardless of size

### 12.3 Employee Size & Common Compliance Thresholds

| Threshold | Trigger |
|---|---|
| 1 employee with PHI access | Need Privacy and Security policies |
| Self-insured plan with 50+ participants | Full HIPAA Privacy and Security compliance |
| Breach affecting 500+ individuals in a state | Media notification required |
| Breach affecting 500+ individuals (any) | Immediate HHS notification (within 60 days) |
| Breach affecting <500 individuals | Annual HHS log reporting |

---

## 13. HITECH ACT EXTENSIONS

**Authority**: Health Information Technology for Economic and Clinical Health Act (Pub. L. 111-5, Feb. 17, 2009)

### 13.1 Key HITECH Changes

| Area | Pre-HITECH | Post-HITECH |
|---|---|---|
| BA direct liability | BAs only liable via BAA with CE | BAs directly liable for HIPAA violations |
| Penalties | Max $25,000/year per violation category | Up to $1.5M/year per violation category |
| Breach notification | No breach rule | Mandatory breach notification rule created |
| Enforcement | OCR had limited resources/authority | Enhanced enforcement; mandatory audits |
| EHR incentives | None | Meaningful Use program ($44B in incentives) |
| Accounting | Excluded EHR disclosures for TPO | Future rule to require accounting of EHR TPO disclosures (not yet finalized) |
| Subcontractors | Not directly covered | BAs must obtain BAAs from subcontractors; subcontractors directly liable |

### 13.2 HITECH Audit Program

OCR conducts three phases of audits:
- **Phase 1 (2011-2012)**: Pilot audits of 115 covered entities
- **Phase 2 (2016-2017)**: Desk audits of CEs and BAs
- **Phase 3 (ongoing)**: Risk-based selection; onsite and desk audits

Audit areas: privacy policies, notice of privacy practices, right of access, breach notification, security risk analysis, security policies

---

## 14. 42 CFR PART 2 — SUBSTANCE USE DISORDER RECORDS

**Authority**: 42 U.S.C. § 290dd-2; 42 CFR Part 2
**2024 Final Rule**: Effective April 16, 2024; compliance required by **February 16, 2026**

### 14.1 Applicability

Applies to **federally assisted** programs that hold themselves out as providing, and provide, alcohol and drug abuse diagnosis, treatment, or referral for treatment (including:)
- Federally conducted or assisted programs
- Programs certified by DEA to dispense controlled substances for opioid treatment
- Programs that receive federal funding for SUD services

### 14.2 General Rule

SUD patient records may NOT be disclosed without **patient consent** except in:
- Medical emergencies
- Research activities (with IRB approval)
- Program audit and evaluation (with data protection agreements)
- Court order (specific requirements apply)
- Crime on premises or against program staff

### 14.3 2024 Final Rule Changes

| Change | Detail |
|---|---|
| **TPO Consent** | Single consent now covers all future TPO uses (aligned with HIPAA) |
| **Re-disclosure** | Recipients of TPO-consented records may re-disclose under HIPAA rules |
| **Public Health** | Disclosure without consent allowed to public health authorities for de-identified data |
| **SUD Counseling Notes** | New category — analogous to psychotherapy notes; requires specific consent |
| **Breach Notification** | Part 2 programs now subject to same HIPAA breach notification requirements |
| **Enforcement** | Criminal penalties replaced with civil/criminal enforcement aligned with HIPAA |
| **Patient Rights** | Patients now have right to accounting of disclosures and restriction requests |
| **Record Segregation** | Segregating Part 2 records from other records is expressly not required |

---

## 15. UPCOMING CHANGES — 2025/2026 SECURITY RULE NPRM

**Federal Register**: January 6, 2025 (Docket HHS-OCR-0945-AA22)
**Status**: Comment period closed March 7, 2025 (~5,000 comments submitted). OCR finalization targeted May 2026. HHS may allow 12–24 months for compliance.

### 15.1 Major Proposed Changes

| Proposed Change | Current Rule | Proposed Rule |
|---|---|---|
| **Required vs. Addressable** | Distinction between [R] and [A] specs | Eliminate distinction; all specifications become required (with limited specific exceptions) |
| **Asset Inventory** | Not specified | **Required**: Technology asset inventory and network map showing ePHI flow; updated at least every 12 months and upon environmental changes |
| **Risk Analysis Specificity** | General risk analysis required | More specific requirements for scope, documentation, threat/vulnerability identification |
| **Patch Management** | Not specifically required | **Required**: Written patch management procedures; critical patches within specified timeframes |
| **Encryption** | Addressable | Encryption of ePHI at rest and in transit **required** (with limited exceptions) |
| **MFA** | Not required | **Required**: Multi-factor authentication for all access to ePHI systems |
| **Audit Log Review** | Required but no cadence specified | Specific review cadences required |
| **Business Continuity** | Contingency plan required | More specific requirements for recovery time objectives and testing |
| **Incident Response Testing** | Not specifically required | Annual testing of incident response and contingency plans required |
| **CISA Reporting** | Not required | Alignment with CISA cybersecurity incident reporting |
| **Documentation** | Written policies required | Policies must be reviewed, tested, and updated on a regular basis (specific periods) |

### 15.2 Planning Recommendations (Pre-Finalization)

Entities should begin planning for:
1. Comprehensive technology asset inventory and network mapping
2. Multi-factor authentication deployment for all ePHI systems
3. Encryption of all ePHI at rest and in transit
4. Formal patch management program with documented timelines
5. Annual incident response and contingency plan testing
6. Enhanced audit log review processes

---

## 16. COMPLIANCE CHECKLIST BY ENTITY TYPE

### 16.1 Healthcare Provider (Covered Entity)

- [ ] **Privacy Officer**: Designated Privacy Official (§ 164.530(a))
- [ ] **Security Officer**: Designated Security Official (§ 164.308(a)(2))
- [ ] **NPP**: Notice of Privacy Practices written, posted, distributed
- [ ] **Risk Analysis**: Annual comprehensive security risk analysis (§ 164.308(a)(1))
- [ ] **Risk Management Plan**: Documented with timelines and owners
- [ ] **Policies and Procedures**: Written privacy and security policies
- [ ] **Training**: All workforce trained; training documented; refreshed on material changes
- [ ] **BAAs**: BAAs in place for all business associates
- [ ] **Breach Response Plan**: Documented plan with four-factor assessment process
- [ ] **Sanctions Policy**: Documented and enforced
- [ ] **Access Controls**: Unique user IDs, role-based access, least privilege
- [ ] **Audit Logs**: Logging enabled and reviewed
- [ ] **Physical Safeguards**: Workstation controls, device/media policies, facility access
- [ ] **Encryption**: ePHI encrypted at rest and in transit (addressable; document reasoning if not)
- [ ] **Contingency Plan**: Backup, disaster recovery, emergency operations plans
- [ ] **Individual Rights**: Processes for access, amendment, accounting, restriction requests
- [ ] **Complaint Process**: Mechanism for receiving and handling privacy complaints
- [ ] **Document Retention**: Policies retained 6 years from creation or last in effect

### 16.2 Health Plan (Employer-Sponsored)

- [ ] **Determine Applicability**: >50 participants OR uses TPA = full HIPAA compliance required
- [ ] **Plan Amendment**: Group health plan documents amended to include HIPAA-required provisions
- [ ] **Privacy Officer**: Designated for plan
- [ ] **NPP**: Issued to plan members
- [ ] **Firewall**: If employer administers plan, "firewall" between employer HR functions and PHI
- [ ] **BAAs**: With all TPAs, PBMs, disease management programs, stop-loss carriers
- [ ] **Training**: HR/benefits staff trained on HIPAA
- [ ] **Security (if ePHI)**: If plan receives ePHI from TPA, security policies required

### 16.3 Business Associate

- [ ] **BAA**: Execute BAA with each covered entity and each sub-BA
- [ ] **Security Rule**: Full compliance with all administrative, physical, technical safeguards
- [ ] **Privacy Rule**: Comply with applicable Privacy Rule provisions per BAA
- [ ] **Breach Notification**: Report breaches to CE within 60 days of discovery
- [ ] **Training**: Workforce trained on HIPAA policies
- [ ] **Risk Analysis**: Annual comprehensive risk analysis of ePHI systems
- [ ] **Subcontractor BAAs**: BAAs in place for all subcontractors handling PHI
- [ ] **Return/Destroy PHI**: Plan for PHI disposition upon contract termination
- [ ] **Incident Response**: Documented security incident response procedures

### 16.4 Substance Use Disorder Treatment Programs (42 CFR Part 2)

*In addition to all applicable HIPAA requirements above:*
- [ ] **Patient Consent Form**: Compliant with Part 2 consent requirements
- [ ] **Re-disclosure Notices**: Include Part 2 re-disclosure prohibition notice in records
- [ ] **Law Enforcement Procedures**: Specific Part 2 procedures (more restrictive than HIPAA)
- [ ] **Court Order Process**: Documented process for handling Part 2 court orders
- [ ] **SUD Counseling Notes**: Separate storage; specific consent process
- [ ] **February 16, 2026 Compliance**: Complete implementation of 2024 Final Rule changes

---

## QUICK REFERENCE: KEY HIPAA TIMELINES

| Requirement | Deadline |
|---|---|
| Individual breach notification | ≤ 60 days from discovery |
| HHS notification (≥500 individuals) | ≤ 60 days from discovery |
| HHS annual log submission (<500 individuals) | ≤ 60 days after calendar year end |
| Media notification (≥500 in a state/jurisdiction) | ≤ 60 days from discovery |
| BA notification to CE after breach | ≤ 60 days from BA discovery |
| Individual right of access response | ≤ 30 days (one 30-day extension) |
| Amendment request response | ≤ 60 days (one 60-day extension) |
| Accounting of disclosures response | ≤ 60 days (one 60-day extension) |
| New workforce member training | Within reasonable period of hire |
| Material policy change training | Within reasonable period of change |
| Document/policy retention | 6 years from creation or last in effect |
| Security risk analysis | At least annually + upon environmental changes |
| Contingency plan testing | Periodically (no specific cadence currently) |
| Business associate agreement | Before any PHI is shared |

---

## QUICK REFERENCE: CFR CITATION INDEX

| Topic | CFR Citation |
|---|---|
| General Definitions | 45 CFR § 160.103 |
| Preemption of State Law | 45 CFR §§ 160.201–160.205 |
| Enforcement/Penalties | 45 CFR §§ 160.300–160.552 |
| Security Rule — General | 45 CFR §§ 164.302–164.306 |
| Security Rule — Administrative Safeguards | 45 CFR § 164.308 |
| Security Rule — Physical Safeguards | 45 CFR § 164.310 |
| Security Rule — Technical Safeguards | 45 CFR § 164.312 |
| Security Rule — Documentation | 45 CFR § 164.316 |
| Breach Notification — Applicability | 45 CFR § 164.400 |
| Breach Notification — Definition | 45 CFR § 164.402 |
| Breach Notification — Individuals | 45 CFR § 164.404 |
| Breach Notification — Media | 45 CFR § 164.406 |
| Breach Notification — HHS | 45 CFR § 164.408 |
| Breach Notification — Business Associates | 45 CFR § 164.410 |
| Privacy Rule — Uses and Disclosures | 45 CFR § 164.502 |
| Privacy Rule — Business Associate Contracts | 45 CFR § 164.504(e) |
| Privacy Rule — TPO | 45 CFR § 164.506 |
| Privacy Rule — Other Permitted Disclosures | 45 CFR § 164.512 |
| Privacy Rule — De-identification | 45 CFR § 164.514 |
| Privacy Rule — NPP | 45 CFR § 164.520 |
| Privacy Rule — Rights to Restrict | 45 CFR § 164.522 |
| Privacy Rule — Right of Access | 45 CFR § 164.524 |
| Privacy Rule — Amendment | 45 CFR § 164.526 |
| Privacy Rule — Accounting | 45 CFR § 164.528 |
| Privacy Rule — Administrative Requirements | 45 CFR § 164.530 |
| Psychotherapy Notes Definition | 45 CFR § 164.501 |
| Authorization Requirements | 45 CFR § 164.508 |
| SUD Records | 42 CFR Part 2 |

---

*Document compiled from official sources: HHS.gov, eCFR (ecfr.gov), Federal Register, HHS OCR guidance documents, HITECH Act (Pub. L. 111-5), HIPAA Omnibus Rule (78 FR 5566, Jan. 25, 2013), and 42 CFR Part 2 Final Rule (89 FR 12472, Feb. 16, 2024).*

*Last updated: February 2026. Verify against current eCFR for any subsequent amendments.*
