const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

// ── Brand colors ──
const BRAND = "0891B2";
const BRAND_DARK = "164E63";
const BRAND_LIGHT = "ECFEFF";
const GREEN = "10B981";
const AMBER = "F59E0B";
const RED = "EF4444";
const GRAY = "6B7280";
const LIGHT_GRAY = "F3F4F6";
const WHITE = "FFFFFF";
const BLACK = "111827";

const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const TABLE_W = 9360;
const COL1 = 5800;
const COL2 = 3560;
const COL3_1 = 3120;
const COL3_2 = 3120;
const COL3_3 = 3120;

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: BRAND_DARK, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: WHITE, font: "Arial", size: 20 })] })],
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      children: [new TextRun({
        text,
        bold: opts.bold || false,
        color: opts.color || BLACK,
        font: "Arial",
        size: opts.size || 18,
      })],
    })],
  });
}

function featureTable(features) {
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: [COL1, COL2],
    rows: [
      new TableRow({ children: [headerCell("Feature", COL1), headerCell("Status", COL2)] }),
      ...features.map((f, i) => new TableRow({
        children: [
          cell(f.name, COL1, { fill: i % 2 === 0 ? WHITE : LIGHT_GRAY }),
          cell(f.status, COL2, {
            fill: i % 2 === 0 ? WHITE : LIGHT_GRAY,
            color: f.status === "Implemented" ? GREEN : f.status === "Simulated" ? AMBER : GRAY,
            bold: true,
          }),
        ],
      })),
    ],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: BRAND_DARK })],
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: BRAND })],
  });
}

function desc(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: GRAY })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

// ── Stats table ──
function statsTable() {
  const stats = [
    ["130+", "API Endpoints"],
    ["54", "Frontend Pages"],
    ["48", "React Hooks"],
    ["30+", "DB Models"],
    ["47+", "Gated Features"],
    ["12+", "Integrations"],
  ];
  return new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    columnWidths: [COL3_1, COL3_2, COL3_3],
    rows: [
      new TableRow({
        children: stats.slice(0, 3).map((s, i) => new TableCell({
          borders: noBorders,
          width: { size: COL3_1, type: WidthType.DXA },
          shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s[0], bold: true, font: "Arial", size: 36, color: BRAND })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s[1], font: "Arial", size: 18, color: GRAY })] }),
          ],
        })),
      }),
      new TableRow({
        children: stats.slice(3).map((s) => new TableCell({
          borders: noBorders,
          width: { size: COL3_1, type: WidthType.DXA },
          shading: { fill: BRAND_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s[0], bold: true, font: "Arial", size: 36, color: BRAND })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: s[1], font: "Arial", size: 18, color: GRAY })] }),
          ],
        })),
      }),
    ],
  });
}

// ── Build document ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  sections: [
    // ── COVER PAGE ──
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND, space: 1 } },
            spacing: { after: 0 },
            children: [
              new TextRun({ text: "SHIELDRA AI", bold: true, font: "Arial", size: 18, color: BRAND }),
              new TextRun({ text: "\tFeature Tracker", font: "Arial", size: 18, color: GRAY }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 1 } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Shieldra AI \u2014 AI-Driven Compliance. Zero Guesswork.  |  Page ", font: "Arial", size: 16, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({ spacing: { before: 2400 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "SHIELDRA AI", bold: true, font: "Arial", size: 56, color: BRAND_DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "AI-Driven Compliance. Zero Guesswork.", font: "Arial", size: 24, color: GRAY })],
        }),
        new Paragraph({ spacing: { after: 400 }, alignment: AlignmentType.CENTER,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 1 } },
          children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({ text: "Complete Feature Inventory", bold: true, font: "Arial", size: 36, color: BLACK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: `Last Updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, font: "Arial", size: 22, color: GRAY })],
        }),
        statsTable(),
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Multi-Tenant SaaS  \u2022  React 19 + FastAPI  \u2022  Deployed on Vercel", font: "Arial", size: 20, color: GRAY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "https://www.shieldra.ai", font: "Arial", size: 20, color: BRAND })] }),

        // ── PAGE BREAK → CONTENT ──
        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // RECENTLY ADDED FEATURES
        // ═══════════════════════════════════════════════════
        sectionHeading("Recently Added Features"),
        desc("Features implemented in the latest development cycle (March 2026)."),

        subHeading("Trial Lifecycle Emails"),
        desc("Automated email reminders for trial tenants: halfway encouragement (day 15), expiring warning (3 days left), and expired notification with account deactivation. Background worker runs every 6 hours."),
        featureTable([
          { name: "Trial halfway email (day 15)", status: "Implemented" },
          { name: "Trial expiring email (3 days before)", status: "Implemented" },
          { name: "Trial expired email + tenant deactivation", status: "Implemented" },
          { name: "Background trial lifecycle worker (6hr interval)", status: "Implemented" },
          { name: "Duplicate email prevention via settings_json", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Plan Change Notifications"),
        desc("Email notifications when a tenant upgrades, downgrades, or cancels their subscription plan."),
        featureTable([
          { name: "Plan upgrade/downgrade/cancel email", status: "Implemented" },
          { name: "Old vs new plan comparison in email", status: "Implemented" },
          { name: "New limits table in email", status: "Implemented" },
        ]),
        spacer(),

        subHeading("HIPAA Officer Designation Email"),
        desc("When a Privacy or Security Officer is designated during onboarding, they receive a role-specific email with their HIPAA responsibilities and CFR citations."),
        featureTable([
          { name: "Privacy Officer designation email (45 CFR \u00A7 164.530)", status: "Implemented" },
          { name: "Security Officer designation email (45 CFR \u00A7 164.308)", status: "Implemented" },
          { name: "Officer names passed from frontend to backend", status: "Implemented" },
          { name: "Responsibility checklist in email", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Full Activity Tracking (Audit)"),
        desc("Comprehensive client-side event tracking for super admin audit. Tracks every button click, link click, form submit, tab switch, and API mutation automatically across all pages with zero per-page instrumentation."),
        featureTable([
          { name: "Global click listener (all buttons, links, tabs, menus)", status: "Implemented" },
          { name: "Global form submit listener", status: "Implemented" },
          { name: "Axios interceptor (all POST/PUT/PATCH/DELETE)", status: "Implemented" },
          { name: "Event batching (30s interval / 20 event buffer)", status: "Implemented" },
          { name: "POST /event-logs/batch endpoint", status: "Implemented" },
          { name: "Page view tracking via router integration", status: "Implemented" },
          { name: "Super admin tenant activity endpoint", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Document Version Control"),
        desc("Upload new versions of documents while preserving the full version history. Old analysis is automatically cleared when a new version is uploaded."),
        featureTable([
          { name: "Document version fields (version, previous_version_id, is_latest)", status: "Implemented" },
          { name: "POST /documents/{id}/versions \u2014 upload new version", status: "Implemented" },
          { name: "GET /documents/{id}/versions \u2014 version history", status: "Implemented" },
          { name: "Auto-supersede old compliance checks on new version", status: "Implemented" },
          { name: "Version history UI with compliance scores per version", status: "Implemented" },
          { name: "Version badge (v2, v3) on document rows", status: "Implemented" },
          { name: "Upload New Version dialog with notes field", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Scan Contradiction Fix"),
        desc("Fixed a bug where findings from superseded compliance checks appeared alongside new findings, creating contradictory results (e.g., 'Missing' and 'Adequate' for the same requirement)."),
        featureTable([
          { name: "Filter findings to exclude superseded checks", status: "Implemented" },
          { name: "Integration scan findings preserved (no check_id)", status: "Implemented" },
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // CORE PLATFORM
        // ═══════════════════════════════════════════════════
        sectionHeading("Core Platform (Starter Tier)"),
        desc("Foundational features available to all tenants including free trials."),

        subHeading("Dashboard & Overview"),
        featureTable([
          { name: "Compliance dashboard with real-time metrics", status: "Implemented" },
          { name: "Multi-framework overview (HIPAA, SOC 2, ISO 27001, etc.)", status: "Implemented" },
          { name: "Integration status display", status: "Implemented" },
          { name: "Compliance score trends", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Authentication & Multi-Tenancy"),
        featureTable([
          { name: "Tenant-aware JWT authentication", status: "Implemented" },
          { name: "Role-based access control (RBAC)", status: "Implemented" },
          { name: "Permission gates (frontend + backend)", status: "Implemented" },
          { name: "Tenant isolation middleware", status: "Implemented" },
          { name: "Feature gating by package tier", status: "Implemented" },
          { name: "Invite system with secure tokens", status: "Implemented" },
          { name: "SSO (SAML/OIDC)", status: "Simulated" },
        ]),
        spacer(),

        subHeading("Onboarding Wizard"),
        featureTable([
          { name: "7-step guided onboarding", status: "Implemented" },
          { name: "Organization setup (type, size, industry, PHI types)", status: "Implemented" },
          { name: "Compliance framework selection", status: "Implemented" },
          { name: "Team invitation with role assignment", status: "Implemented" },
          { name: "HIPAA officer designation", status: "Implemented" },
          { name: "Integration configuration", status: "Implemented" },
          { name: "Document checklist from onboarding inventory", status: "Implemented" },
          { name: "Auto-save progress", status: "Implemented" },
        ]),
        spacer(),

        subHeading("HIPAA Compliance Analysis"),
        featureTable([
          { name: "73-requirement HIPAA knowledge base", status: "Implemented" },
          { name: "Keyword/pattern matching analyzer", status: "Implemented" },
          { name: "LLM-enhanced analyzer layer", status: "Implemented" },
          { name: "Document compliance scoring", status: "Implemented" },
          { name: "Finding and gap detection", status: "Implemented" },
          { name: "Quick-scan (no document required)", status: "Implemented" },
          { name: "Category-based analysis (7 HIPAA categories)", status: "Implemented" },
          { name: "HIPAA Roadmap with step-by-step guide", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Document Management"),
        featureTable([
          { name: "File upload (PDF, DOCX, XLSX, CSV, TXT)", status: "Implemented" },
          { name: "Auto text extraction", status: "Implemented" },
          { name: "Auto document classification", status: "Implemented" },
          { name: "Document structure detection (headings, sections)", status: "Implemented" },
          { name: "Compliance relevance detection", status: "Implemented" },
          { name: "Version control (upload new versions)", status: "Implemented" },
          { name: "Required documents checklist", status: "Implemented" },
          { name: "RAG ingestion for AI assistant", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Scanning Framework"),
        featureTable([
          { name: "Policy scanner", status: "Implemented" },
          { name: "Technical controls scanner", status: "Implemented" },
          { name: "Access control scanner", status: "Implemented" },
          { name: "Encryption scanner", status: "Implemented" },
          { name: "Network security scanner", status: "Implemented" },
          { name: "Training compliance scanner", status: "Implemented" },
          { name: "Scan scheduling and monitoring", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Evidence Vault"),
        featureTable([
          { name: "Evidence collection and management", status: "Implemented" },
          { name: "Evidence types: document, screenshot, config, attestation", status: "Implemented" },
          { name: "Evidence verification workflow", status: "Implemented" },
          { name: "Control mapping for evidence", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Alerts, Audit Trail & Remediation"),
        featureTable([
          { name: "Real-time compliance alerts", status: "Implemented" },
          { name: "Complete audit trail with IP logging", status: "Implemented" },
          { name: "Remediation task tracking", status: "Implemented" },
          { name: "Priority levels (critical/high/medium/low)", status: "Implemented" },
          { name: "Assignment with email notification", status: "Implemented" },
          { name: "AI-powered remediation suggestions", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Training & Policy Acknowledgments"),
        featureTable([
          { name: "Training course management", status: "Implemented" },
          { name: "Training record tracking with scores", status: "Implemented" },
          { name: "Training expiration and recurrence", status: "Implemented" },
          { name: "Policy acknowledgment tracking", status: "Implemented" },
          { name: "Acknowledgment expiration management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Reports & Regulations"),
        featureTable([
          { name: "Compliance summary reports (PDF)", status: "Implemented" },
          { name: "Risk, evidence, executive, and gap reports", status: "Implemented" },
          { name: "Regulatory framework library", status: "Implemented" },
          { name: "CFR citation browsing", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Email System"),
        featureTable([
          { name: "Resend API integration (production)", status: "Implemented" },
          { name: "Console logging fallback (dev mode)", status: "Implemented" },
          { name: "Welcome email", status: "Implemented" },
          { name: "Team invite email", status: "Implemented" },
          { name: "Password reset email", status: "Implemented" },
          { name: "Alert notification email", status: "Implemented" },
          { name: "Incident notification email", status: "Implemented" },
          { name: "Scan report email", status: "Implemented" },
          { name: "Weekly digest email", status: "Implemented" },
          { name: "Remediation assignment email", status: "Implemented" },
          { name: "Training reminder email", status: "Implemented" },
          { name: "Vendor BAA expiring email", status: "Implemented" },
          { name: "Invoice email", status: "Implemented" },
          { name: "Payment reminder email", status: "Implemented" },
          { name: "Trial lifecycle emails (3 types)", status: "Implemented" },
          { name: "Plan change email", status: "Implemented" },
          { name: "HIPAA officer designation email", status: "Implemented" },
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // PROFESSIONAL TIER
        // ═══════════════════════════════════════════════════
        sectionHeading("Professional Tier Features"),
        desc("Advanced features for growing compliance programs."),

        subHeading("Risk Management"),
        featureTable([
          { name: "Risk assessments with scoring", status: "Implemented" },
          { name: "Risk register with heat maps", status: "Implemented" },
          { name: "Risk treatment plans", status: "Implemented" },
          { name: "Custom scoring models", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Vendor & Third-Party Management"),
        featureTable([
          { name: "Vendor management with BAA tracking", status: "Implemented" },
          { name: "Vendor risk scoring", status: "Implemented" },
          { name: "PHI access type tracking", status: "Implemented" },
          { name: "Vendor contact management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Incident Management"),
        featureTable([
          { name: "Security incident tracking", status: "Implemented" },
          { name: "State notification requirements by jurisdiction", status: "Implemented" },
          { name: "Incident timeline and notifications", status: "Implemented" },
          { name: "Breach notification compliance", status: "Implemented" },
        ]),
        spacer(),

        subHeading("AI Assistant"),
        featureTable([
          { name: "Chat-based compliance Q&A", status: "Implemented" },
          { name: "Policy analysis and drafting", status: "Implemented" },
          { name: "Remediation suggestions", status: "Implemented" },
          { name: "Conversation history", status: "Implemented" },
          { name: "Floating AI button on all pages", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Controls & Frameworks"),
        featureTable([
          { name: "Security control tracking", status: "Implemented" },
          { name: "Control testing and results", status: "Implemented" },
          { name: "Multi-framework support (SOC 2, HITRUST, ISO, etc.)", status: "Implemented" },
          { name: "Cross-framework mapping", status: "Implemented" },
          { name: "Framework evidence collection", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Personnel & Employee Compliance"),
        featureTable([
          { name: "Personnel compliance tracking", status: "Implemented" },
          { name: "Employee onboarding/offboarding workflows", status: "Implemented" },
          { name: "PHI access level management", status: "Implemented" },
          { name: "Background check tracking", status: "Implemented" },
          { name: "Access reviews and certification", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Advanced Reports"),
        featureTable([
          { name: "Audit-ready compliance reports", status: "Implemented" },
          { name: "Custom analytics and dashboards", status: "Implemented" },
          { name: "Trend analysis", status: "Implemented" },
          { name: "Executive dashboards", status: "Implemented" },
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // ENTERPRISE TIER
        // ═══════════════════════════════════════════════════
        sectionHeading("Enterprise Tier Features"),
        desc("Premium features for large organizations and complex compliance needs."),

        subHeading("AI & Machine Learning"),
        featureTable([
          { name: "Autonomous AI agent for compliance tasks", status: "Implemented" },
          { name: "Learning engine (RAG + signal capture)", status: "Implemented" },
          { name: "Knowledge graph visualization", status: "Implemented" },
          { name: "AI governance (EU AI Act)", status: "Implemented" },
          { name: "Predictive analytics (drift, risk, regulatory impact)", status: "Implemented" },
          { name: "Pattern extraction and feedback loops", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Advanced Risk & Simulation"),
        featureTable([
          { name: "Risk-weighted gap prioritization with ROI", status: "Implemented" },
          { name: "Penalty exposure calculator", status: "Implemented" },
          { name: "Digital twin compliance modeling", status: "Implemented" },
          { name: "Breach simulation (tabletop exercises)", status: "Implemented" },
          { name: "Behavior analytics (anomaly detection)", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Contract & Regulatory Intelligence"),
        featureTable([
          { name: "BAA clause extraction and analysis", status: "Implemented" },
          { name: "Contract adequacy scoring", status: "Implemented" },
          { name: "Regulatory radar (AI-powered change monitoring)", status: "Implemented" },
          { name: "Impact assessment on compliance", status: "Implemented" },
          { name: "24hr background regulatory polling", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Third-Party Risk Management (TPRM)"),
        featureTable([
          { name: "Full TPRM lifecycle", status: "Implemented" },
          { name: "AI-powered vendor reviews", status: "Implemented" },
          { name: "Vendor monitoring with alerts", status: "Implemented" },
          { name: "Vendor contract management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Auto-Remediation"),
        featureTable([
          { name: "Automated remediation workflows", status: "Implemented" },
          { name: "Playbook management", status: "Implemented" },
          { name: "Execution rules and escalation policies", status: "Implemented" },
          { name: "Cooldown management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Compliance as Code"),
        featureTable([
          { name: "Programmatic compliance rules (Rego)", status: "Implemented" },
          { name: "Policy execution and validation", status: "Implemented" },
          { name: "Pipeline management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Enterprise Integrations"),
        featureTable([
          { name: "AWS (S3, IAM, CloudTrail, KMS, RDS)", status: "Simulated" },
          { name: "Azure (Storage, AD, Key Vault, SQL)", status: "Simulated" },
          { name: "GCP", status: "Simulated" },
          { name: "Okta", status: "Simulated" },
          { name: "Google Workspace", status: "Simulated" },
          { name: "Slack", status: "Simulated" },
          { name: "Microsoft Teams", status: "Simulated" },
          { name: "ServiceNow", status: "Simulated" },
          { name: "Jira", status: "Simulated" },
          { name: "Box / Dropbox", status: "Simulated" },
          { name: "Salesforce", status: "Simulated" },
          { name: "GitHub", status: "Simulated" },
        ]),
        spacer(),

        subHeading("Portals & Trust Center"),
        featureTable([
          { name: "Customer-facing compliance portal", status: "Implemented" },
          { name: "Public trust center", status: "Implemented" },
          { name: "Compliance badge display", status: "Implemented" },
          { name: "Subprocessor listing", status: "Implemented" },
          { name: "Access request management", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Additional Enterprise Features"),
        featureTable([
          { name: "M&A due diligence assessments", status: "Implemented" },
          { name: "Cohort benchmarking with k-anonymity", status: "Implemented" },
          { name: "Questionnaire management", status: "Implemented" },
          { name: "Team collaboration (tasks, comments, workflows)", status: "Implemented" },
          { name: "Asset management and vulnerability tracking", status: "Implemented" },
          { name: "Policy template library", status: "Implemented" },
          { name: "Evidence collection schedules", status: "Implemented" },
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // ADMIN & BILLING
        // ═══════════════════════════════════════════════════
        sectionHeading("Super Admin & Billing"),
        desc("Platform administration and billing management for the super admin."),

        subHeading("Admin Dashboard"),
        featureTable([
          { name: "Super admin authentication (separate JWT)", status: "Implemented" },
          { name: "Tenant management (CRUD, onboard, data)", status: "Implemented" },
          { name: "Package management (tier, pricing, limits)", status: "Implemented" },
          { name: "System health monitoring", status: "Implemented" },
          { name: "Tenant usage analytics", status: "Implemented" },
          { name: "Error tracking and reporting", status: "Implemented" },
          { name: "Tenant activity audit (page views, actions)", status: "Implemented" },
        ]),
        spacer(),

        subHeading("Billing & Subscriptions"),
        featureTable([
          { name: "Subscription management", status: "Implemented" },
          { name: "Contract management", status: "Implemented" },
          { name: "Invoice generation (automated hourly worker)", status: "Implemented" },
          { name: "Payment reminders", status: "Implemented" },
          { name: "Usage tracking and limits", status: "Implemented" },
          { name: "Billing events logging", status: "Implemented" },
          { name: "Revenue metrics", status: "Implemented" },
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══════════════════════════════════════════════════
        // BACKGROUND SERVICES
        // ═══════════════════════════════════════════════════
        sectionHeading("Background Services & Workers"),
        desc("Automated background processes running on the server."),

        featureTable([
          { name: "Trial lifecycle worker (6hr interval)", status: "Implemented" },
          { name: "Billing worker (hourly invoice generation)", status: "Implemented" },
          { name: "Alert checker (critical error rate monitoring)", status: "Implemented" },
          { name: "Regulatory radar fetcher (24hr polling)", status: "Implemented" },
          { name: "Evidence collection scheduler (5min interval)", status: "Implemented" },
          { name: "RAG document ingestion (on upload + analysis)", status: "Implemented" },
          { name: "Pattern extraction (post-scan analysis)", status: "Implemented" },
        ]),

        spacer(),
        sectionHeading("Frontend Architecture"),
        desc("Key frontend systems and patterns."),

        featureTable([
          { name: "React 19 + TypeScript + Vite", status: "Implemented" },
          { name: "TanStack Router (file-based routing)", status: "Implemented" },
          { name: "TanStack Query (data fetching + caching)", status: "Implemented" },
          { name: "shadcn/ui component library", status: "Implemented" },
          { name: "Light/Dark/System theme modes", status: "Implemented" },
          { name: "Mobile-responsive design", status: "Implemented" },
          { name: "Activity tracker (all clicks, views, API calls)", status: "Implemented" },
          { name: "Feature gate components", status: "Implemented" },
          { name: "Permission gate components", status: "Implemented" },
          { name: "Command palette", status: "Implemented" },
          { name: "48 custom React hooks", status: "Implemented" },
          { name: "Landing page with pricing, features, social proof", status: "Implemented" },
        ]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/shyamsedai/Documents/Compliance Vision AI/Shieldra AI - Feature Tracker.docx", buffer);
  console.log("Document created successfully!");
});
