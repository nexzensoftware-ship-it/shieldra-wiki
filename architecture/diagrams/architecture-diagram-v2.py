#!/usr/bin/env python3
"""
Shieldra AI — ComplianceVision AI
System Overview Architecture Diagram v2
Fixed: systematic connections, visible groups, compact legend, proper spacing
"""

import math

# =============================================================================
# Theme
# =============================================================================
T = {
    "bg": "#0B0F1A",
    "grp_fill": "#161D30",       # Brighter than before
    "grp_bdr": "#2A3A5C",        # More visible border
    "comp_fill": "#1A2035",
    "txt1": "#E8EAF0", "txt2": "#8892A8", "txt_conn": "#B0B8CC",
    "line": "#3A4A6A", "legend_bg": "#0F1420",
    "fe": "#00E5FF", "be": "#B388FF", "db": "#69F0AE", "cache": "#FFD740",
    "queue": "#FF80AB", "ext": "#FFAB40", "user": "#ECEFF1",
    "cloud": "#8C9EFF", "sec": "#FF5252", "ai": "#EA80FC",
}

W, H = 1640, 1100
TITLE_H = 90   # Reserved for title

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

# =============================================================================
# SVG Builder
# =============================================================================
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
<pattern id="dg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r=".6" fill="{T['grp_bdr']}" opacity=".2"/></pattern>
<rect width="{W}" height="{H}" fill="url(#dg)"/>
{"".join(s.e)}
</svg>'''

_fid = [0]
def nid(): _fid[0]+=1; return _fid[0]

# =============================================================================
# Drawing primitives
# =============================================================================

def _filters(s, i, c):
    s.df(f'<filter id="g{i}" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="2.5" result="b"/><feFlood flood-color="{c}" flood-opacity=".12" result="fc"/><feComposite in="fc" in2="b" operator="in" result="gl"/><feMerge><feMergeNode in="gl"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    s.df(f'<filter id="s{i}" x="-8%" y="-8%" width="116%" height="125%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity=".25"/></filter>')
    s.df(f'<linearGradient id="lg{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{c}" stop-opacity=".06"/><stop offset="100%" stop-color="{T["comp_fill"]}" stop-opacity="1"/></linearGradient>')

def box(s, x, y, w, h, name, tech, c, desc=""):
    i = nid(); _filters(s, i, c)
    dy = 22 if not desc else 18
    s.el(f'<g filter="url(#s{i})"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".35" stroke-width="1.5" filter="url(#g{i})"/>'
         f'<text x="{x+w/2}" y="{y+dy}" text-anchor="middle" fill="{T["txt1"]}" font-size="11" font-weight="600">{esc(name)}</text>'
         f'<text x="{x+w/2}" y="{y+dy+14}" text-anchor="middle" fill="{c}" font-size="8" opacity=".8">{esc(tech)}</text>'
         + (f'<text x="{x+w/2}" y="{y+dy+26}" text-anchor="middle" fill="{T["txt2"]}" font-size="7.5">{esc(desc)}</text>' if desc else '')
         + '</g>')
    # Return center coords for connections
    return (x+w/2, y+h/2, x, y, x+w, y+h)

def cyl(s, x, y, w, h, name, tech, c):
    i = nid(); eh = 11; bt = y+eh; bh = h-eh*2
    _filters(s, i, c)
    s.el(f'<g filter="url(#s{i})"><g filter="url(#g{i})">'
         f'<path d="M {x} {bt} L {x} {bt+bh} C {x} {bt+bh+eh},{x+w} {bt+bh+eh},{x+w} {bt+bh} L {x+w} {bt} Z" fill="{T["comp_fill"]}" stroke="{c}" stroke-opacity=".35" stroke-width="1.5"/>'
         f'<ellipse cx="{x+w/2}" cy="{bt}" rx="{w/2}" ry="{eh}" fill="{c}" fill-opacity=".1" stroke="{c}" stroke-opacity=".45" stroke-width="1.5"/></g>'
         f'<text x="{x+w/2}" y="{y+h/2+2}" text-anchor="middle" fill="{T["txt1"]}" font-size="10" font-weight="600">{esc(name)}</text>'
         f'<text x="{x+w/2}" y="{y+h/2+15}" text-anchor="middle" fill="{c}" font-size="8" opacity=".8">{esc(tech)}</text></g>')
    return (x+w/2, y+h/2, x, y, x+w, y+h)

def hex_shape(s, x, y, sz, name, tech, c):
    i = nid(); cx, cy = x+sz, y+sz*.85
    pts = " ".join(f"{cx+sz*.72*math.cos(math.radians(60*j-90)):.1f},{cy+sz*.72*math.sin(math.radians(60*j-90)):.1f}" for j in range(6))
    _filters(s, i, c)
    s.el(f'<g filter="url(#g{i})"><polygon points="{pts}" fill="{T["comp_fill"]}" fill-opacity=".5" stroke="{c}" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="5 3"/>'
         f'<text x="{cx}" y="{cy-1}" text-anchor="middle" fill="{T["txt1"]}" font-size="9" font-weight="600">{esc(name)}</text>'
         f'<text x="{cx}" y="{cy+10}" text-anchor="middle" fill="{c}" font-size="7" opacity=".8">{esc(tech)}</text></g>')
    return (cx, cy, x, y, x+sz*2, y+sz*1.7)

def user_icon(s, x, y, name):
    cx = x+22
    s.el(f'<g><circle cx="{cx}" cy="{y+14}" r="11" fill="{T["comp_fill"]}" stroke="{T["user"]}" stroke-opacity=".45" stroke-width="1.5"/>'
         f'<circle cx="{cx}" cy="{y+11}" r="3.5" fill="{T["user"]}" opacity=".55"/>'
         f'<path d="M {cx-6} {y+22} Q {cx} {y+17} {cx+6} {y+22}" fill="{T["user"]}" opacity=".35"/>'
         f'<text x="{cx}" y="{y+38}" text-anchor="middle" fill="{T["txt1"]}" font-size="9" font-weight="500">{esc(name)}</text></g>')
    return (cx, y+20)

def group(s, x, y, w, h, label, c):
    """Visible group with stronger background and border."""
    s.el(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" '
         f'fill="{T["grp_fill"]}" fill-opacity=".7" '
         f'stroke="{c}" stroke-opacity=".2" stroke-width="1.5"/>'
         f'<text x="{x+14}" y="{y+17}" fill="{c}" fill-opacity=".7" font-size="9" font-weight="700" letter-spacing=".1em">{esc(label.upper())}</text>')

def title(s):
    s.el(f'<text x="40" y="38" fill="{T["txt1"]}" font-size="20" font-weight="700" letter-spacing=".04em">Shieldra AI — ComplianceVision AI</text>'
         f'<text x="40" y="56" fill="{T["ai"]}" font-size="10" font-weight="400" letter-spacing=".04em">System Overview Architecture</text>'
         f'<text x="40" y="70" fill="#5A6580" font-size="9">April 2026 · v2.0</text>'
         f'<line x1="40" y1="78" x2="360" y2="78" stroke="{T["ai"]}" stroke-width="1" stroke-opacity=".25"/>')

# =============================================================================
# SYSTEMATIC CONNECTION ROUTING
# =============================================================================
# Connections use orthogonal routing (horizontal + vertical segments only)
# to avoid crossing through components.

_arrow_id = [0]

def _make_arrow_marker(s, c):
    _arrow_id[0] += 1
    aid = f"am{_arrow_id[0]}"
    s.df(f'<marker id="{aid}" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><path d="M 0 0 L 7 2.5 L 0 5 Z" fill="{c}" opacity=".75"/></marker>')
    return aid

def conn_straight(s, x1, y1, x2, y2, label="", c=None, dashed=False):
    """Simple straight connection (for short vertical/horizontal runs)."""
    c = c or T['line']
    mid = _make_arrow_marker(s, c)
    dash = 'stroke-dasharray="6 3"' if dashed else ""
    # Slight curve for visual softness
    mx, my = (x1+x2)/2, (y1+y2)/2
    dx, dy = x2-x1, y2-y1
    ln = max(math.sqrt(dx*dx+dy*dy), 1)
    off = min(12, ln*.04)
    cmx, cmy = mx + (-dy/ln*off), my + (dx/ln*off)
    s.el(f'<path d="M {x1} {y1} Q {cmx} {cmy} {x2} {y2}" fill="none" stroke="{c}" stroke-width="1.3" stroke-opacity=".5" {dash} marker-end="url(#{mid})"/>')
    if label:
        lx, ly = (x1+2*cmx+x2)/4, (y1+2*cmy+y2)/4
        tw = len(label)*5+12
        s.el(f'<rect x="{lx-tw/2}" y="{ly-6.5}" width="{tw}" height="13" rx="6.5" fill="{T["bg"]}" fill-opacity=".9" stroke="{c}" stroke-width=".5" stroke-opacity=".25"/>'
             f'<text x="{lx}" y="{ly+3}" text-anchor="middle" fill="{T["txt_conn"]}" font-size="7" font-weight="500">{esc(label)}</text>')

def conn_elbow(s, x1, y1, x2, y2, label="", c=None, dashed=False, via_y=None, via_x=None):
    """L-shaped or Z-shaped orthogonal connection that routes around components."""
    c = c or T['line']
    mid = _make_arrow_marker(s, c)
    dash = 'stroke-dasharray="6 3"' if dashed else ""

    if via_y is not None:
        # Route: down to via_y, then horizontal, then down to target
        path = f"M {x1} {y1} L {x1} {via_y} L {x2} {via_y} L {x2} {y2}"
    elif via_x is not None:
        # Route: right to via_x, then vertical, then right to target
        path = f"M {x1} {y1} L {via_x} {y1} L {via_x} {y2} L {x2} {y2}"
    else:
        # Simple L: go down first, then across
        path = f"M {x1} {y1} L {x1} {y2} L {x2} {y2}"

    s.el(f'<path d="{path}" fill="none" stroke="{c}" stroke-width="1.3" stroke-opacity=".45" {dash} marker-end="url(#{mid})" stroke-linejoin="round"/>')
    if label:
        if via_y is not None:
            lx, ly = (x1+x2)/2, via_y
        elif via_x is not None:
            lx, ly = via_x, (y1+y2)/2
        else:
            lx, ly = (x1+x2)/2, y2
        tw = len(label)*5+12
        s.el(f'<rect x="{lx-tw/2}" y="{ly-6.5}" width="{tw}" height="13" rx="6.5" fill="{T["bg"]}" fill-opacity=".9" stroke="{c}" stroke-width=".5" stroke-opacity=".25"/>'
             f'<text x="{lx}" y="{ly+3}" text-anchor="middle" fill="{T["txt_conn"]}" font-size="7" font-weight="500">{esc(label)}</text>')


# =============================================================================
# LEGEND — Horizontal multi-column
# =============================================================================
def draw_legend(s, x, y):
    items = [
        ("Frontend / UI", T['fe']), ("Backend / API", T['be']),
        ("Database", T['db']), ("Cache", T['cache']),
        ("AI / ML", T['ai']), ("External", T['ext']),
        ("Security", T['sec']), ("Cloud / Infra", T['cloud']),
        ("Async Queue", T['queue']), ("User / Actor", T['user']),
    ]
    cols = 5; cw = 145; rh = 20
    rows = math.ceil(len(items)/cols)
    lw = cols*cw+20; lh = rows*rh+28

    s.el(f'<rect x="{x}" y="{y}" width="{lw}" height="{lh}" rx="10" fill="{T["legend_bg"]}" stroke="{T["grp_bdr"]}" stroke-width="1"/>'
         f'<text x="{x+lw/2}" y="{y+15}" text-anchor="middle" fill="{T["txt2"]}" font-size="8" font-weight="700" letter-spacing=".1em">LEGEND</text>')
    for idx, (label, c) in enumerate(items):
        col = idx % cols; row = idx // cols
        ix = x + 14 + col*cw
        iy = y + 32 + row*rh
        s.el(f'<circle cx="{ix+4}" cy="{iy}" r="4" fill="{c}"/>'
             f'<text x="{ix+14}" y="{iy+3}" fill="{T["txt2"]}" font-size="8">{esc(label)}</text>')


# =============================================================================
# MAIN DIAGRAM
# =============================================================================
def main():
    s = SVG()
    title(s)

    # ═══════════════════════════════════════════════════
    # LAYOUT GRID — all Y positions account for TITLE_H
    # ═══════════════════════════════════════════════════
    Y_USERS = TITLE_H + 10         # 100
    Y_FE    = TITLE_H + 65         # 155 (group top)
    Y_BE    = TITLE_H + 190        # 280 (group top)
    Y_DATA  = TITLE_H + 425        # 515 (group top)
    Y_INFRA = TITLE_H + 560        # 650 (group top)
    Y_AI    = TITLE_H + 65         # 155 (same row as frontend, right side)
    Y_EXT   = TITLE_H + 385        # 475 (right side)

    LEFT = 50
    MID_W = 840       # Width of left-side groups
    RIGHT_X = 920     # Start of right-side groups
    RIGHT_W = 680     # Width of right-side groups

    # ═══════════════════════════════════════════════════
    # USERS
    # ═══════════════════════════════════════════════════
    u1 = user_icon(s, 200, Y_USERS, "Admin")
    u2 = user_icon(s, 350, Y_USERS, "Analyst")
    u3 = user_icon(s, 500, Y_USERS, "Auditor")
    u4 = user_icon(s, 650, Y_USERS, "Viewer")

    # ═══════════════════════════════════════════════════
    # FRONTEND LAYER
    # ═══════════════════════════════════════════════════
    group(s, LEFT, Y_FE, MID_W, 100, "Presentation Layer", T['fe'])

    fe1 = box(s, 70, Y_FE+28, 175, 55, "Landing Site", "React · Vite · SEO", T['fe'])
    fe2 = box(s, 265, Y_FE+28, 185, 55, "Web Dashboard", "React 19 · shadcn/ui", T['fe'], "110+ routes")
    fe3 = box(s, 470, Y_FE+28, 195, 55, "Compliance Analyzer", "TanStack Query · Zustand", T['fe'])
    fe4 = box(s, 685, Y_FE+28, 175, 55, "Video / Marketing", "Remotion", T['fe'])

    # ═══════════════════════════════════════════════════
    # BACKEND LAYER
    # ═══════════════════════════════════════════════════
    group(s, LEFT, Y_BE, MID_W, 200, "API & Services Layer · FastAPI · Python 3.12+", T['be'])

    # Row 1
    be_auth = box(s, 70, Y_BE+28, 148, 55, "Auth Service", "JWT · MFA · RBAC", T['sec'], "OAuth + bcrypt")
    be_api  = box(s, 238, Y_BE+28, 150, 55, "API v1 Gateway", "FastAPI · Pydantic", T['be'], "76 endpoints")
    be_doc  = box(s, 408, Y_BE+28, 148, 55, "Doc Processor", "PDF · DOCX · AI", T['ai'], "Text extraction")
    be_alert= box(s, 576, Y_BE+28, 140, 55, "Alert Engine", "Anomaly Detection", T['be'])
    be_rbac = box(s, 736, Y_BE+28, 125, 55, "RBAC Engine", "5 Roles · RLS", T['sec'])

    # Row 2
    be_bill = box(s, 70, Y_BE+100, 148, 55, "Billing Worker", "Stripe · Dunning", T['ext'])
    be_email= box(s, 238, Y_BE+100, 150, 55, "Email Service", "Resend · SMTP", T['be'])
    be_scan = box(s, 408, Y_BE+100, 148, 55, "Scan Engine", "8 Scanner Types", T['sec'], "HIPAA · SOC2 · PCI")
    be_risk = box(s, 576, Y_BE+100, 140, 55, "Risk Engine", "Assessment · Score", T['sec'])
    be_vndr = box(s, 736, Y_BE+100, 125, 55, "Vendor TPRM", "BAA · Monitoring", T['be'])

    # ═══════════════════════════════════════════════════
    # DATA LAYER
    # ═══════════════════════════════════════════════════
    group(s, LEFT, Y_DATA, MID_W, 115, "Data Persistence Layer", T['db'])

    db_pg   = cyl(s, 80, Y_DATA+28, 140, 72, "PostgreSQL 16", "155+ models · RLS", T['db'])
    db_redis= cyl(s, 255, Y_DATA+28, 115, 72, "Redis 7", "Cache · Sessions", T['cache'])
    db_minio= cyl(s, 405, Y_DATA+28, 125, 72, "MinIO / S3", "Object Storage", T['cloud'])
    db_pgv  = cyl(s, 565, Y_DATA+28, 125, 72, "pgvector", "Embeddings", T['ai'])
    db_celery=cyl(s, 725, Y_DATA+28, 120, 72, "Celery", "Task Queue", T['queue'])

    # ═══════════════════════════════════════════════════
    # INFRASTRUCTURE & WORKERS
    # ═══════════════════════════════════════════════════
    group(s, LEFT, Y_INFRA, 400, 90, "Background Workers", T['queue'])
    bw1 = box(s, 70, Y_INFRA+26, 155, 46, "Regulatory Radar", "Fetch Updates · 24h", T['queue'])
    bw2 = box(s, 243, Y_INFRA+26, 170, 46, "Evidence Collector", "Auto-collect · 5min", T['queue'])

    group(s, 480, Y_INFRA, 410, 90, "Infrastructure & Deployment", T['cloud'])
    inf1 = box(s, 500, Y_INFRA+26, 140, 46, "Docker Compose", "Container Orch.", T['cloud'])
    inf2 = box(s, 658, Y_INFRA+26, 100, 46, "Vercel", "CDN · Edge", T['cloud'])
    inf3 = box(s, 776, Y_INFRA+26, 95, 46, "GitHub CI", "Actions", T['cloud'])

    # ═══════════════════════════════════════════════════
    # AI & LEARNING ENGINE (right side)
    # ═══════════════════════════════════════════════════
    group(s, RIGHT_X, Y_AI, RIGHT_W, 285, "AI & Learning Engine · 10 Subsystems", T['ai'])

    ai1 = box(s, 940, Y_AI+28, 195, 48, "Learning Engine Core", "Signal · Calibration", T['ai'])
    ai2 = box(s, 1155, Y_AI+28, 195, 48, "Confidence Calibrator", "Accuracy Tracking", T['ai'])
    ai3 = box(s, 1385, Y_AI+28, 195, 48, "RAG Pipeline", "pgvector · Voyage AI", T['ai'])

    ai4 = box(s, 940, Y_AI+90, 195, 48, "Knowledge Graph", "NetworkX · 73 Reqs", T['ai'])
    ai5 = box(s, 1155, Y_AI+90, 195, 48, "Pattern Extractor", "Cross-org · k≥3", T['ai'])
    ai6 = box(s, 1385, Y_AI+90, 195, 48, "Drift Detector", "Proactive Gaps", T['ai'])

    ai7 = box(s, 940, Y_AI+152, 195, 48, "Compliance Agent", "Autonomous Scans", T['ai'])
    ai8 = box(s, 1155, Y_AI+152, 195, 48, "Benchmarking", "Peer Comparison", T['ai'])
    ai9 = box(s, 1385, Y_AI+152, 195, 48, "Prompt Manager", "Dynamic Prompts", T['ai'])

    # HIPAA Engine
    group(s, RIGHT_X, Y_AI+235, 330, 48, "HIPAA Engine", T['sec'])
    box(s, 940, Y_AI+248, 140, 28, "Knowledge Base", "73 Requirements", T['sec'])
    box(s, 1095, Y_AI+248, 135, 28, "Smart Analyzer", "Hybrid ML", T['sec'])

    # ═══════════════════════════════════════════════════
    # EXTERNAL INTEGRATIONS (right side, below AI)
    # ═══════════════════════════════════════════════════
    group(s, RIGHT_X, Y_EXT, RIGHT_W, 105, "External Integrations · 16+ Connectors", T['ext'])

    hex_shape(s, 940, Y_EXT+24, 36, "Stripe", "Payments", T['ext'])
    hex_shape(s, 1030, Y_EXT+24, 36, "Resend", "Email", T['ext'])
    hex_shape(s, 1120, Y_EXT+24, 36, "Okta", "SSO", T['ext'])
    hex_shape(s, 1210, Y_EXT+24, 36, "Slack", "Alerts", T['ext'])
    hex_shape(s, 1300, Y_EXT+24, 36, "Claude", "LLM", T['ai'])
    hex_shape(s, 1390, Y_EXT+24, 36, "OpenAI", "LLM", T['ai'])
    hex_shape(s, 1480, Y_EXT+24, 36, "AWS S3", "Storage", T['cloud'])

    # ═══════════════════════════════════════════════════
    # REGULATORY FRAMEWORKS (bottom right)
    # ═══════════════════════════════════════════════════
    group(s, RIGHT_X, Y_INFRA, RIGHT_W, 90, "Regulatory Frameworks", T['sec'])
    fw_x = 940
    for i, (name, sub) in enumerate([("HIPAA","Healthcare"), ("SOC 2","Trust"), ("GDPR","EU Privacy"),
                                      ("PCI DSS","Payment"), ("ISO 27001","InfoSec"), ("NIST CSF","Cyber")]):
        box(s, fw_x + i*110, Y_INFRA+26, 100, 46, name, sub, T['sec'])

    # ═══════════════════════════════════════════════════════════
    # CONNECTIONS — Systematic, orthogonal routing
    # ═══════════════════════════════════════════════════════════

    # --- USERS → FRONTEND (straight down) ---
    conn_straight(s, u1[0], Y_USERS+40, fe1[0], Y_FE+28, "HTTPS", T['fe'])
    conn_straight(s, u2[0], Y_USERS+40, fe2[0], Y_FE+28, "HTTPS", T['fe'])
    conn_straight(s, u3[0], Y_USERS+40, fe3[0], Y_FE+28, "HTTPS", T['fe'])
    conn_straight(s, u4[0], Y_USERS+40, fe4[0], Y_FE+28, "HTTPS", T['fe'])

    # --- FRONTEND → API GATEWAY (all frontends route through API) ---
    # Dashboard → API (straight down, main path)
    conn_straight(s, fe2[0], Y_FE+83, be_api[0], Y_BE+28, "REST API", T['be'])
    # Compliance Analyzer → Doc Processor
    conn_straight(s, fe3[0], Y_FE+83, be_doc[0], Y_BE+28, "Upload", T['ai'])
    # Landing → Auth
    conn_straight(s, fe1[0], Y_FE+83, be_auth[0], Y_BE+28, "Login", T['sec'])

    # --- API GATEWAY → BACKEND SERVICES (horizontal bus at Y_BE+25, then down) ---
    # API → Auth (left)
    conn_elbow(s, be_api[0]-20, Y_BE+83, be_auth[0], Y_BE+83, "Verify JWT", T['sec'], via_y=Y_BE+90)
    # API → Scan Engine
    conn_straight(s, be_api[0]+30, Y_BE+83, be_scan[0], Y_BE+100, "Trigger Scan", T['sec'])
    # API → Alert Engine
    conn_straight(s, be_api[0]+50, Y_BE+83, be_alert[0], Y_BE+28, "Events", T['be'])
    # API → Risk Engine
    conn_elbow(s, be_api[0]+60, Y_BE+83, be_risk[0], Y_BE+100, "Risk Eval", T['sec'], via_y=Y_BE+93)
    # API → Email
    conn_straight(s, be_api[0], Y_BE+83, be_email[0], Y_BE+100, "Notify", T['be'], dashed=True)
    # API → Billing (dashed, async)
    conn_elbow(s, be_api[0]-40, Y_BE+83, be_bill[0], Y_BE+100, "Billing", T['ext'], via_y=Y_BE+97, dashed=True)
    # API → Vendor TPRM
    conn_elbow(s, be_api[0]+70, Y_BE+83, be_vndr[0], Y_BE+100, "Vendor Ops", T['be'], via_y=Y_BE+96)

    # --- BACKEND → DATA LAYER (vertical down) ---
    # Auth → PostgreSQL
    conn_straight(s, be_auth[0], Y_BE+83, db_pg[0], Y_DATA+28, "User Data", T['db'])
    # API Gateway → PostgreSQL (main data path)
    conn_straight(s, be_api[0], Y_BE+155, db_pg[0]+40, Y_DATA+28, "SQL Queries", T['db'])
    # API Gateway → Redis
    conn_straight(s, be_api[0]+40, Y_BE+155, db_redis[0], Y_DATA+28, "Cache R/W", T['cache'])
    # Doc Processor → MinIO
    conn_straight(s, be_doc[0], Y_BE+155, db_minio[0], Y_DATA+28, "Store Files", T['cloud'])
    # Scan Engine → PostgreSQL
    conn_straight(s, be_scan[0], Y_BE+155, db_pg[0]+70, Y_DATA+28, "Findings", T['db'])
    # Risk Engine → PostgreSQL
    conn_elbow(s, be_risk[0], Y_BE+155, db_pg[0]+100, Y_DATA+28, "Risk Data", T['db'], via_y=Y_BE+165)

    # --- BACKEND → AI LAYER (horizontal right) ---
    # Doc Processor → Learning Engine (enrichment)
    conn_elbow(s, be_doc[4], Y_BE+56, ai1[2], Y_AI+52, "Enrich", T['ai'], via_x=RIGHT_X-10, dashed=True)
    # Scan Engine → HIPAA Engine
    conn_elbow(s, be_scan[4], Y_BE+128, 940, Y_AI+262, "HIPAA Rules", T['sec'], via_x=RIGHT_X-10)
    # Alert Engine → Drift Detector
    conn_elbow(s, be_alert[4], Y_BE+56, ai6[2], Y_AI+114, "Drift Data", T['ai'], via_x=RIGHT_X-10, dashed=True)

    # --- AI INTERNAL CONNECTIONS ---
    # Learning Engine → Confidence Calibrator
    conn_straight(s, ai1[4], Y_AI+52, ai2[2], Y_AI+52, "", T['ai'])
    # Confidence Calibrator → RAG
    conn_straight(s, ai2[4], Y_AI+52, ai3[2], Y_AI+52, "", T['ai'])
    # Knowledge Graph → Pattern Extractor
    conn_straight(s, ai4[4], Y_AI+114, ai5[2], Y_AI+114, "", T['ai'])
    # Pattern Extractor → Drift Detector
    conn_straight(s, ai5[4], Y_AI+114, ai6[2], Y_AI+114, "", T['ai'])

    # --- AI → DATA LAYER ---
    # RAG Pipeline → pgvector (embeddings)
    conn_elbow(s, ai3[0], Y_AI+76, db_pgv[0], Y_DATA+28, "Embeddings", T['ai'], via_y=Y_DATA+10, dashed=True)

    # --- AI → EXTERNAL LLMs ---
    conn_straight(s, ai7[0], Y_AI+200, 1336, Y_EXT+24, "LLM Calls", T['ai'])
    conn_straight(s, ai9[0], Y_AI+200, 1426, Y_EXT+24, "LLM Calls", T['ai'])

    # --- BACKEND → EXTERNAL ---
    # Billing → Stripe
    conn_elbow(s, be_bill[0], Y_BE+155, 976, Y_EXT+24, "Payments", T['ext'], via_y=Y_EXT+10, dashed=True)
    # Email → Resend
    conn_elbow(s, be_email[0], Y_BE+155, 1066, Y_EXT+24, "Send Email", T['ext'], via_y=Y_EXT+15, dashed=True)

    # --- DATA → WORKERS ---
    conn_straight(s, db_pg[0], Y_DATA+100, bw1[0], Y_INFRA+26, "Read/Write", T['queue'], dashed=True)
    conn_straight(s, db_celery[0], Y_DATA+100, bw2[0], Y_INFRA+26, "Task Dispatch", T['queue'], dashed=True)

    # --- DATA → INFRASTRUCTURE ---
    conn_straight(s, db_pg[0]+60, Y_DATA+100, inf1[0], Y_INFRA+26, "Docker Vol", T['cloud'], dashed=True)

    # ═══════════════════════════════════════════════════
    # LEGEND — Horizontal, compact, at bottom
    # ═══════════════════════════════════════════════════
    draw_legend(s, (W - 750)//2, H - 55)

    return s.render()


if __name__ == "__main__":
    svg = main()
    with open("shieldra-architecture-v2.svg", "w") as f:
        f.write(svg)
    print("Generated: shieldra-architecture-v2.svg")
