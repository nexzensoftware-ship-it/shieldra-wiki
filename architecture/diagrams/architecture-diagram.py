#!/usr/bin/env python3
"""
Shieldra AI — ComplianceVision AI
System Overview Architecture Diagram
Generated using architecture-diagram skill · Dark Futuristic Theme
"""

import math

# =============================================================================
# Theme: Dark Futuristic
# =============================================================================
T = {
    "bg": "#0B0F1A", "grp_fill": "#141929", "grp_bdr": "#1E2740",
    "comp_fill": "#1A2035", "txt1": "#E8EAF0", "txt2": "#8892A8",
    "txt_conn": "#A0AAC0", "line": "#2A3555", "legend_bg": "#0F1420",
    # Semantic colors
    "fe": "#00E5FF", "be": "#B388FF", "db": "#69F0AE", "cache": "#FFD740",
    "queue": "#FF80AB", "ext": "#FFAB40", "user": "#ECEFF1",
    "cloud": "#8C9EFF", "sec": "#FF5252", "ai": "#EA80FC",
}

W, H = 1680, 1200
PAD = 40

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

class SVG:
    def __init__(s): s.d, s.e = [], []
    def df(s, c): s.d.append(c)
    def el(s, c): s.e.append(c)
    def render(s):
        return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
<style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&amp;display=swap');*{{font-family:'JetBrains Mono','SF Mono','Fira Code',monospace;}}</style>
{"".join(s.d)}
</defs>
<rect width="{W}" height="{H}" fill="{T['bg']}"/>
<pattern id="dg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".5" fill="{T['grp_bdr']}" opacity=".3"/></pattern>
<rect width="{W}" height="{H}" fill="url(#dg)"/>
{"".join(s.e)}
</svg>'''

_fid = 0
def _id():
    global _fid; _fid += 1; return _fid

def box(s, x, y, w, h, name, tech, c, desc=""):
    i = _id()
    s.df(f'<filter id="g{i}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feFlood flood-color="{c}" flood-opacity=".15" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    s.df(f'<filter id="s{i}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".3"/></filter>')
    s.df(f'<linearGradient id="lg{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{c}" stop-opacity=".07"/><stop offset="100%" stop-color="{T["comp_fill"]}" stop-opacity="1"/></linearGradient>')
    dy = 24 if not desc else 20
    s.el(f'<g filter="url(#s{i})"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".4" stroke-width="1.5" filter="url(#g{i})"/>'
         f'<text x="{x+w/2}" y="{y+dy}" text-anchor="middle" fill="{T["txt1"]}" font-size="12" font-weight="600" letter-spacing=".02em">{esc(name)}</text>'
         f'<text x="{x+w/2}" y="{y+dy+16}" text-anchor="middle" fill="{c}" font-size="9" font-weight="400" opacity=".8">{esc(tech)}</text>'
         + (f'<text x="{x+w/2}" y="{y+dy+30}" text-anchor="middle" fill="{T["txt2"]}" font-size="8">{esc(desc)}</text>' if desc else '')
         + '</g>')

def cyl(s, x, y, w, h, name, tech, c):
    i = _id()
    eh = 12; bt = y + eh; bh = h - eh*2
    s.df(f'<filter id="g{i}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feFlood flood-color="{c}" flood-opacity=".15" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    s.df(f'<filter id="s{i}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".3"/></filter>')
    s.el(f'<g filter="url(#s{i})"><g filter="url(#g{i})">'
         f'<path d="M {x} {bt} L {x} {bt+bh} C {x} {bt+bh+eh},{x+w} {bt+bh+eh},{x+w} {bt+bh} L {x+w} {bt} Z" fill="{T["comp_fill"]}" stroke="{c}" stroke-opacity=".4" stroke-width="1.5"/>'
         f'<ellipse cx="{x+w/2}" cy="{bt}" rx="{w/2}" ry="{eh}" fill="{c}" fill-opacity=".12" stroke="{c}" stroke-opacity=".5" stroke-width="1.5"/></g>'
         f'<text x="{x+w/2}" y="{y+h/2+2}" text-anchor="middle" fill="{T["txt1"]}" font-size="11" font-weight="600">{esc(name)}</text>'
         f'<text x="{x+w/2}" y="{y+h/2+16}" text-anchor="middle" fill="{c}" font-size="8" opacity=".8">{esc(tech)}</text></g>')

def hex_shape(s, x, y, sz, name, tech, c):
    i = _id()
    cx, cy = x+sz, y+sz*.85
    pts = " ".join(f"{cx+sz*.75*math.cos(math.radians(60*j-90)):.1f},{cy+sz*.75*math.sin(math.radians(60*j-90)):.1f}" for j in range(6))
    s.df(f'<filter id="g{i}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="b"/><feFlood flood-color="{c}" flood-opacity=".12" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    s.el(f'<g filter="url(#g{i})"><polygon points="{pts}" fill="{T["comp_fill"]}" fill-opacity=".5" stroke="{c}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="6 3"/>'
         f'<text x="{cx}" y="{cy-2}" text-anchor="middle" fill="{T["txt1"]}" font-size="9" font-weight="600">{esc(name)}</text>'
         f'<text x="{cx}" y="{cy+10}" text-anchor="middle" fill="{c}" font-size="7" opacity=".8">{esc(tech)}</text></g>')

def user(s, x, y, name):
    cx = x+25
    s.el(f'<g><circle cx="{cx}" cy="{y+16}" r="12" fill="{T["comp_fill"]}" stroke="{T["user"]}" stroke-opacity=".5" stroke-width="1.5"/>'
         f'<circle cx="{cx}" cy="{y+12}" r="4" fill="{T["user"]}" opacity=".6"/>'
         f'<path d="M {cx-7} {y+24} Q {cx} {y+18} {cx+7} {y+24}" fill="{T["user"]}" opacity=".4"/>'
         f'<text x="{cx}" y="{y+42}" text-anchor="middle" fill="{T["txt1"]}" font-size="9" font-weight="500">{esc(name)}</text></g>')

_aid = 0
def arrow(s, x1, y1, x2, y2, label="", dashed=False, c=None):
    global _aid; _aid += 1
    c = c or T['line']
    mx, my = (x1+x2)/2, (y1+y2)/2
    dx, dy = x2-x1, y2-y1
    ln = math.sqrt(dx*dx+dy*dy)
    if ln == 0: return
    off = min(25, ln*.08)
    cmx, cmy = mx + (-dy/ln*off), my + (dx/ln*off)
    dash = 'stroke-dasharray="7 4"' if dashed else ""
    s.df(f'<marker id="a{_aid}" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M 0 0 L 7 2.5 L 0 5 Z" fill="{c}" opacity=".7"/></marker>')
    s.el(f'<path d="M {x1} {y1} Q {cmx} {cmy} {x2} {y2}" fill="none" stroke="{c}" stroke-width="1.5" stroke-opacity=".45" {dash} marker-end="url(#a{_aid})"/>')
    if label:
        lx, ly = (x1+2*cmx+x2)/4, (y1+2*cmy+y2)/4
        tw = len(label)*5+14
        s.el(f'<rect x="{lx-tw/2}" y="{ly-7}" width="{tw}" height="14" rx="7" fill="{T["bg"]}" stroke="{c}" stroke-width=".5" stroke-opacity=".25"/>'
             f'<text x="{lx}" y="{ly+3}" text-anchor="middle" fill="{T["txt_conn"]}" font-size="7.5" font-weight="500">{esc(label)}</text>')

def group(s, x, y, w, h, label, c):
    s.el(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{T["grp_fill"]}" fill-opacity=".6" stroke="{T["grp_bdr"]}" stroke-width="1" stroke-dasharray="8 4"/>'
         f'<text x="{x+14}" y="{y+18}" fill="{c}" fill-opacity=".8" font-size="10" font-weight="700" letter-spacing=".12em">{esc(label.upper())}</text>')

def title(s, t, sub, date):
    s.el(f'<text x="{PAD}" y="{PAD+8}" fill="{T["txt1"]}" font-size="20" font-weight="700" letter-spacing=".05em">{esc(t)}</text>'
         f'<text x="{PAD}" y="{PAD+26}" fill="{T["ai"]}" font-size="11" font-weight="400" letter-spacing=".04em">{esc(sub)}</text>'
         f'<text x="{PAD}" y="{PAD+40}" fill="#5A6580" font-size="9">{esc(date)}</text>'
         f'<line x1="{PAD}" y1="{PAD+48}" x2="380" y2="{PAD+48}" stroke="{T["ai"]}" stroke-width="1" stroke-opacity=".3"/>')

def legend(s, items, x, y):
    lh = len(items)*20+28; lw = 170
    s.el(f'<rect x="{x}" y="{y}" width="{lw}" height="{lh}" rx="12" fill="{T["legend_bg"]}" stroke="{T["grp_bdr"]}" stroke-width="1"/>'
         f'<text x="{x+14}" y="{y+18}" fill="{T["txt2"]}" font-size="8" font-weight="700" letter-spacing=".12em">LEGEND</text>')
    for i,(l,c) in enumerate(items):
        iy = y+34+i*20
        s.el(f'<circle cx="{x+18}" cy="{iy}" r="4" fill="{c}"/><text x="{x+30}" y="{iy+3}" fill="{T["txt2"]}" font-size="8">{esc(l)}</text>')


# =============================================================================
# BUILD SHIELDRA DIAGRAM
# =============================================================================
def main():
    s = SVG()
    title(s, "Shieldra AI — ComplianceVision AI", "System Overview Architecture · Full Platform", "April 2026 · v1.0")

    # ═══════════════════════════════════════════════════════════
    # ROW 1: USERS (y=80)
    # ═══════════════════════════════════════════════════════════
    user(s, 180, 74, "Admin")
    user(s, 330, 74, "Analyst")
    user(s, 480, 74, "Auditor")
    user(s, 630, 74, "Viewer")

    # ═══════════════════════════════════════════════════════════
    # ROW 2: FRONTEND LAYER (y=140)
    # ═══════════════════════════════════════════════════════════
    group(s, 60, 138, 830, 100, "Presentation Layer", T['fe'])

    box(s, 80, 160, 175, 60, "Landing Site", "React · Vite · SEO", T['fe'])
    box(s, 275, 160, 185, 60, "Web Dashboard", "React 19 · shadcn/ui", T['fe'], "110+ routes")
    box(s, 480, 160, 195, 60, "Compliance Analyzer", "TanStack Query · Zustand", T['fe'])
    box(s, 695, 160, 175, 60, "Video / Marketing", "Remotion · Animation", T['fe'])

    # ═══════════════════════════════════════════════════════════
    # ROW 3: BACKEND CORE (y=270)
    # ═══════════════════════════════════════════════════════════
    group(s, 60, 268, 830, 200, "API & Services Layer · FastAPI · Python 3.12+", T['be'])

    # Top row of backend
    box(s, 80, 295, 150, 58, "Auth Service", "JWT · MFA · RBAC", T['sec'], "OAuth + bcrypt")
    box(s, 250, 295, 155, 58, "API v1 Gateway", "FastAPI · Pydantic", T['be'], "76 endpoints")
    box(s, 425, 295, 155, 58, "Doc Processor", "PDF/DOCX · AI", T['ai'], "Text extraction")
    box(s, 600, 295, 135, 58, "Alert Engine", "Anomaly Detection", T['be'])
    box(s, 755, 295, 115, 58, "RBAC", "5 Roles · RLS", T['sec'])

    # Bottom row of backend
    box(s, 80, 370, 145, 58, "Billing Worker", "Stripe · Dunning", T['ext'])
    box(s, 245, 370, 140, 58, "Email Service", "Resend · SMTP", T['be'])
    box(s, 405, 370, 155, 58, "Scan Engine", "8 Scanner Types", T['sec'], "HIPAA/SOC2/PCI")
    box(s, 580, 370, 150, 58, "Risk Engine", "Assessment · Scoring", T['sec'])
    box(s, 750, 370, 120, 58, "Vendor TPRM", "BAA · Monitoring", T['be'])

    # ═══════════════════════════════════════════════════════════
    # ROW 3 RIGHT: AI & LEARNING ENGINE (y=138)
    # ═══════════════════════════════════════════════════════════
    group(s, 920, 138, 720, 220, "AI & Learning Engine · 10 Subsystems", T['ai'])

    box(s, 940, 168, 210, 52, "Learning Engine Core", "Signal Capture · Calibration", T['ai'], "Self-learning AI")
    box(s, 1170, 168, 210, 52, "Confidence Calibrator", "Accuracy Tracking", T['ai'], "Expert corrections")
    box(s, 1400, 168, 220, 52, "RAG Pipeline", "pgvector · Voyage AI", T['ai'], "Document corpus")

    box(s, 940, 235, 210, 52, "Knowledge Graph", "NetworkX · HIPAA Map", T['ai'], "73 requirements")
    box(s, 1170, 235, 210, 52, "Pattern Extractor", "Cross-org Patterns", T['ai'], "k-anonymity ≥3")
    box(s, 1400, 235, 220, 52, "Drift Detector", "Proactive Gap Finder", T['ai'], "Emerging risks")

    box(s, 940, 302, 210, 42, "Compliance Agent", "Autonomous Scanning", T['ai'])
    box(s, 1170, 302, 210, 42, "Benchmarking", "Peer Comparison", T['ai'])
    box(s, 1400, 302, 220, 42, "Prompt Manager", "Dynamic Prompts", T['ai'])

    # ═══════════════════════════════════════════════════════════
    # ROW 4 RIGHT: HIPAA ENGINE (y=375)
    # ═══════════════════════════════════════════════════════════
    group(s, 920, 375, 430, 95, "HIPAA Engine · Domain Knowledge", T['sec'])

    box(s, 940, 398, 125, 50, "Knowledge Base", "73 Requirements", T['sec'])
    box(s, 1080, 398, 125, 50, "LLM Analyzer", "Claude · OpenAI", T['ai'])
    box(s, 1220, 398, 110, 50, "Smart Analyzer", "Hybrid ML", T['ai'])

    # ═══════════════════════════════════════════════════════════
    # ROW 4: DATA LAYER (y=500)
    # ═══════════════════════════════════════════════════════════
    group(s, 60, 500, 830, 120, "Data Persistence Layer", T['db'])

    cyl(s, 100, 525, 145, 78, "PostgreSQL 16", "155+ models · RLS", T['db'])
    cyl(s, 280, 525, 115, 78, "Redis 7", "Cache · Sessions", T['cache'])
    cyl(s, 430, 525, 120, 78, "MinIO / S3", "Object Storage", T['cloud'])
    cyl(s, 585, 525, 130, 78, "pgvector", "Embeddings · RAG", T['ai'])
    cyl(s, 750, 525, 115, 78, "Celery", "Task Queue", T['queue'])

    # ═══════════════════════════════════════════════════════════
    # ROW 5: BACKGROUND WORKERS (y=650)
    # ═══════════════════════════════════════════════════════════
    group(s, 60, 650, 580, 95, "Background Workers · Async Tasks", T['queue'])

    box(s, 80, 672, 150, 52, "Regulatory Radar", "Fetch Updates · 24h", T['queue'])
    box(s, 248, 672, 168, 52, "Evidence Collector", "Auto-collect · 5min", T['queue'])
    box(s, 434, 672, 130, 52, "LE Worker", "Patterns · 6h", T['queue'])
    box(s, 582, 672, 40, 52, "...", "", T['queue'])

    # ═══════════════════════════════════════════════════════════
    # ROW 5: INFRASTRUCTURE (y=650)
    # ═══════════════════════════════════════════════════════════
    group(s, 670, 650, 490, 95, "Infrastructure & Deployment", T['cloud'])

    box(s, 690, 672, 140, 52, "Docker Compose", "Container Orch.", T['cloud'])
    box(s, 848, 672, 120, 52, "Vercel", "Frontend CDN", T['cloud'])
    box(s, 986, 672, 155, 52, "GitHub Actions", "CI/CD Pipeline", T['cloud'])

    # ═══════════════════════════════════════════════════════════
    # ROW RIGHT: EXTERNAL INTEGRATIONS (y=500)
    # ═══════════════════════════════════════════════════════════
    group(s, 920, 500, 430, 115, "External Integrations · 16+ Connectors", T['ext'])

    hex_shape(s, 940, 525, 38, "Stripe", "Payments", T['ext'])
    hex_shape(s, 1030, 525, 38, "Resend", "Email", T['ext'])
    hex_shape(s, 1120, 525, 38, "Okta", "SSO/SAML", T['ext'])
    hex_shape(s, 1210, 525, 38, "Slack", "Alerts", T['ext'])
    hex_shape(s, 940, 570, 38, "AWS S3", "Storage", T['cloud'])
    hex_shape(s, 1030, 570, 38, "GitHub", "Config", T['ext'])
    hex_shape(s, 1120, 570, 38, "Claude", "LLM API", T['ai'])
    hex_shape(s, 1210, 570, 38, "OpenAI", "LLM API", T['ai'])

    # ═══════════════════════════════════════════════════════════
    # REGULATORY FRAMEWORKS (y=650)
    # ═══════════════════════════════════════════════════════════
    group(s, 920, 645, 720, 100, "Regulatory Frameworks Supported", T['sec'])

    box(s, 940, 668, 105, 52, "HIPAA", "Healthcare", T['sec'])
    box(s, 1060, 668, 100, 52, "SOC 2", "Trust", T['sec'])
    box(s, 1175, 668, 95, 52, "GDPR", "EU Privacy", T['sec'])
    box(s, 1285, 668, 105, 52, "PCI DSS", "Payment", T['sec'])
    box(s, 1405, 668, 105, 52, "ISO 27001", "InfoSec", T['sec'])
    box(s, 1525, 668, 95, 52, "NIST CSF", "Cyber", T['sec'])

    # ═══════════════════════════════════════════════════════════
    # MULTI-TENANCY SIDEBAR (y=770)
    # ═══════════════════════════════════════════════════════════
    group(s, 60, 775, 580, 100, "Multi-Tenancy & Security", T['sec'])

    box(s, 80, 798, 155, 55, "Tenant Isolation", "Row-Level Security", T['sec'], "tenant_id on all tables")
    box(s, 253, 798, 175, 55, "Encryption", "AES-256 · TLS 1.3", T['sec'], "At-rest & in-transit")
    box(s, 446, 798, 175, 55, "Audit Trail", "All Actions Logged", T['sec'], "Full compliance audit")

    # ═══════════════════════════════════════════════════════════
    # INTEGRATION POINTS (y=770)
    # ═══════════════════════════════════════════════════════════
    group(s, 670, 775, 970, 100, "Intelligence Surfaces · 8 Pages Enhanced by Learning Engine", T['ai'])

    box(s, 690, 798, 110, 52, "Dashboard", "Smart Briefing", T['ai'])
    box(s, 815, 798, 115, 52, "Compliance", "AI Confidence", T['ai'])
    box(s, 945, 798, 115, 52, "Remediation", "Pattern Suggest", T['ai'])
    box(s, 1075, 798, 100, 52, "Reports", "Peer Metrics", T['ai'])
    box(s, 1190, 798, 110, 52, "AI Assistant", "Feedback Loop", T['ai'])
    box(s, 1315, 798, 95, 52, "Alerts", "Proactive Intel", T['ai'])
    box(s, 1425, 798, 95, 52, "Vendors", "Risk Patterns", T['ai'])
    box(s, 1535, 798, 90, 52, "Documents", "Coverage", T['ai'])

    # ═══════════════════════════════════════════════════════════
    # CONNECTIONS
    # ═══════════════════════════════════════════════════════════

    # Users → Frontend
    arrow(s, 205, 116, 167, 160, "HTTPS", c=T['fe'])
    arrow(s, 355, 116, 367, 160, "HTTPS", c=T['fe'])
    arrow(s, 505, 116, 577, 160, "HTTPS", c=T['fe'])

    # Frontend → Backend
    arrow(s, 167, 220, 155, 295, "JWT", c=T['sec'])
    arrow(s, 367, 220, 327, 295, "REST API", c=T['be'])
    arrow(s, 577, 220, 502, 295, "Upload", c=T['ai'])

    # API → Sub-services
    arrow(s, 327, 353, 185, 370, "Billing", dashed=True, c=T['ext'])
    arrow(s, 327, 353, 315, 370, "Notify", dashed=True, c=T['be'])
    arrow(s, 327, 353, 482, 370, "Scan", c=T['sec'])
    arrow(s, 327, 353, 655, 370, "Risk", c=T['sec'])

    # Backend → Data Layer
    arrow(s, 327, 353, 172, 525, "SQL", c=T['db'])
    arrow(s, 327, 353, 337, 525, "Cache R/W", c=T['cache'])
    arrow(s, 502, 353, 490, 525, "Files", c=T['cloud'])
    arrow(s, 502, 353, 650, 525, "Embeddings", c=T['ai'])

    # Backend → AI/Learning Engine
    arrow(s, 667, 324, 940, 194, "Enrichment", c=T['ai'])
    arrow(s, 667, 324, 940, 261, "Patterns", dashed=True, c=T['ai'])
    arrow(s, 502, 353, 940, 398, "HIPAA Scan", c=T['sec'])

    # Backend → External
    arrow(s, 152, 428, 978, 525, "Payments", dashed=True, c=T['ext'])
    arrow(s, 315, 428, 1068, 525, "Email", dashed=True, c=T['ext'])

    # AI → LLM External
    arrow(s, 1275, 323, 1158, 525, "LLM", c=T['ai'])
    arrow(s, 1275, 323, 1248, 525, "LLM", c=T['ai'])

    # Data → Background Workers
    arrow(s, 172, 603, 155, 672, "Volumes", dashed=True, c=T['cloud'])

    # AI → Intelligence Surfaces
    arrow(s, 1045, 344, 745, 798, "Intelligence", dashed=True, c=T['ai'])

    # ═══════════════════════════════════════════════════════════
    # LEGEND
    # ═══════════════════════════════════════════════════════════
    legend(s, [
        ("Frontend / UI", T['fe']),
        ("Backend / API", T['be']),
        ("Database / Storage", T['db']),
        ("Cache / Memory", T['cache']),
        ("AI / ML Engine", T['ai']),
        ("External Service", T['ext']),
        ("Security / Auth", T['sec']),
        ("Cloud / Infra", T['cloud']),
        ("Async / Queue", T['queue']),
        ("User / Actor", T['user']),
    ], W-200, H-250)

    return s.render()


if __name__ == "__main__":
    svg = main()
    out = "shieldra-architecture.svg"
    with open(out, "w") as f:
        f.write(svg)
    print(f"Generated: {out}")
