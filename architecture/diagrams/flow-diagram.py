#!/usr/bin/env python3
"""
Shieldra AI — Core Compliance Workflow Flow Diagram
Architecture-diagram skill · Dark Futuristic Theme
"""

import math

T = {
    "bg": "#0B0F1A", "grp_fill": "#161D30", "grp_bdr": "#2A3A5C",
    "comp_fill": "#1A2035", "txt1": "#E8EAF0", "txt2": "#8892A8",
    "txt_conn": "#A0AAC0", "line": "#2A3555", "legend_bg": "#0F1420",
    "fe": "#00E5FF", "be": "#B388FF", "db": "#69F0AE", "cache": "#FFD740",
    "queue": "#FF80AB", "ext": "#FFAB40", "user": "#ECEFF1",
    "cloud": "#8C9EFF", "sec": "#FF5252", "ai": "#EA80FC",
    "success": "#69F0AE", "warn": "#FFD740", "err": "#FF5252",
}

W, H = 1500, 1420

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

_fid = [0]
def nid():
    _fid[0] += 1; return _fid[0]

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


# ═══════════════════════════════════════════════════
# SHAPE PRIMITIVES
# ═══════════════════════════════════════════════════

def _filters(s, i, c):
    s.df(f'<filter id="g{i}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feFlood flood-color="{c}" flood-opacity=".15" result="fc"/><feComposite in="fc" in2="b" operator="in" result="gl"/><feMerge><feMergeNode in="gl"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    s.df(f'<filter id="s{i}" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".3"/></filter>')
    s.df(f'<linearGradient id="lg{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="{c}" stop-opacity=".07"/><stop offset="100%" stop-color="{T["comp_fill"]}" stop-opacity="1"/></linearGradient>')


def start_end(s, cx, cy, label, c):
    """Rounded pill shape for start/end nodes."""
    i = nid(); w, h = 180, 44
    _filters(s, i, c)
    s.el(f'<g filter="url(#s{i})"><rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{h/2}" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".5" stroke-width="2" filter="url(#g{i})"/>'
         f'<text x="{cx}" y="{cy+4}" text-anchor="middle" fill="{T["txt1"]}" font-size="12" font-weight="600">{esc(label)}</text></g>')


def process(s, cx, cy, label, sub, c, w=200, h=60):
    """Rectangle for process steps."""
    i = nid()
    _filters(s, i, c)
    s.el(f'<g filter="url(#s{i})"><rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="14" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".4" stroke-width="1.5" filter="url(#g{i})"/>'
         f'<text x="{cx}" y="{cy-2}" text-anchor="middle" fill="{T["txt1"]}" font-size="11" font-weight="600">{esc(label)}</text>'
         f'<text x="{cx}" y="{cy+14}" text-anchor="middle" fill="{c}" font-size="8" font-weight="400" opacity=".8">{esc(sub)}</text></g>')


def decision(s, cx, cy, label, c, size=52):
    """Diamond for decision points."""
    i = nid()
    _filters(s, i, c)
    pts = f"{cx},{cy-size} {cx+size*1.3},{cy} {cx},{cy+size} {cx-size*1.3},{cy}"
    s.el(f'<g filter="url(#s{i})"><polygon points="{pts}" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".5" stroke-width="1.5" filter="url(#g{i})"/>'
         f'<text x="{cx}" y="{cy+4}" text-anchor="middle" fill="{T["txt1"]}" font-size="10" font-weight="600">{esc(label)}</text></g>')


def io_shape(s, cx, cy, label, sub, c, w=190, h=54):
    """Parallelogram for input/output."""
    i = nid()
    _filters(s, i, c)
    sk = 15
    pts = f"{cx-w/2+sk},{cy-h/2} {cx+w/2+sk},{cy-h/2} {cx+w/2-sk},{cy+h/2} {cx-w/2-sk},{cy+h/2}"
    s.el(f'<g filter="url(#s{i})"><polygon points="{pts}" fill="url(#lg{i})" stroke="{c}" stroke-opacity=".4" stroke-width="1.5" filter="url(#g{i})"/>'
         f'<text x="{cx}" y="{cy-2}" text-anchor="middle" fill="{T["txt1"]}" font-size="10" font-weight="600">{esc(label)}</text>'
         f'<text x="{cx}" y="{cy+13}" text-anchor="middle" fill="{c}" font-size="8" opacity=".8">{esc(sub)}</text></g>')


_aid = [0]
def arrow(s, x1, y1, x2, y2, label="", c=None, dashed=False, curve_dir=0):
    """Arrow with optional label. curve_dir: 0=auto, 1=right, -1=left"""
    _aid[0] += 1; aid = _aid[0]
    c = c or T['txt_conn']
    dx, dy = x2-x1, y2-y1
    ln = math.sqrt(dx*dx+dy*dy)
    if ln == 0: return

    # Calculate bezier control point
    if curve_dir != 0:
        off = curve_dir * min(40, ln * 0.15)
        if abs(dy) > abs(dx):  # mostly vertical
            cmx, cmy = (x1+x2)/2 + off, (y1+y2)/2
        else:  # mostly horizontal
            cmx, cmy = (x1+x2)/2, (y1+y2)/2 + off
    else:
        off = min(20, ln*.06)
        cmx = (x1+x2)/2 + (-dy/ln*off)
        cmy = (y1+y2)/2 + (dx/ln*off)

    dash = 'stroke-dasharray="7 4"' if dashed else ""
    s.df(f'<marker id="fa{aid}" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M 0 0 L 8 3 L 0 6 Z" fill="{c}" opacity=".8"/></marker>')
    s.el(f'<path d="M {x1} {y1} Q {cmx} {cmy} {x2} {y2}" fill="none" stroke="{c}" stroke-width="1.5" stroke-opacity=".55" {dash} marker-end="url(#fa{aid})"/>')
    if label:
        lx = (x1+2*cmx+x2)/4
        ly = (y1+2*cmy+y2)/4
        tw = len(label)*5.5+14
        s.el(f'<rect x="{lx-tw/2}" y="{ly-7}" width="{tw}" height="14" rx="7" fill="{T["bg"]}" stroke="{c}" stroke-width=".5" stroke-opacity=".3"/>'
             f'<text x="{lx}" y="{ly+3}" text-anchor="middle" fill="{c}" font-size="7.5" font-weight="500">{esc(label)}</text>')


def branch_label(s, x, y, label, c):
    """Small label for yes/no branches near decision diamonds."""
    tw = len(label)*6+10
    s.el(f'<rect x="{x-tw/2}" y="{y-7}" width="{tw}" height="14" rx="7" fill="{c}" fill-opacity=".15" stroke="{c}" stroke-width=".5" stroke-opacity=".3"/>'
         f'<text x="{x}" y="{y+3}" text-anchor="middle" fill="{c}" font-size="8" font-weight="600">{esc(label)}</text>')


def group(s, x, y, w, h, label, c):
    s.el(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{T["grp_fill"]}" fill-opacity=".7" stroke="{c}" stroke-opacity=".2" stroke-width="1.5"/>'
         f'<text x="{x+14}" y="{y+18}" fill="{c}" fill-opacity=".7" font-size="10" font-weight="700" letter-spacing=".12em">{esc(label.upper())}</text>')


def note(s, x, y, lines, c):
    """Annotation note box."""
    w = max(len(l) for l in lines)*6.5 + 20
    h = len(lines)*14 + 12
    s.el(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{T["grp_fill"]}" stroke="{c}" stroke-opacity=".3" stroke-width="1" stroke-dasharray="4 2"/>')
    for i, line in enumerate(lines):
        s.el(f'<text x="{x+10}" y="{y+16+i*14}" fill="{c}" font-size="8" opacity=".8">{esc(line)}</text>')


def legend(s, items, x, y):
    lh = len(items)*20+28; lw = 175
    s.el(f'<rect x="{x}" y="{y}" width="{lw}" height="{lh}" rx="12" fill="{T["legend_bg"]}" stroke="{T["grp_bdr"]}" stroke-width="1"/>'
         f'<text x="{x+14}" y="{y+18}" fill="{T["txt2"]}" font-size="8" font-weight="700" letter-spacing=".12em">LEGEND</text>')
    for i,(l,c,shape) in enumerate(items):
        iy = y+34+i*20
        if shape == "pill":
            s.el(f'<rect x="{x+10}" y="{iy-5}" width="16" height="10" rx="5" fill="{c}" opacity=".5"/>')
        elif shape == "diamond":
            s.el(f'<polygon points="{x+18},{iy-5} {x+24},{iy} {x+18},{iy+5} {x+12},{iy}" fill="{c}" opacity=".5"/>')
        elif shape == "para":
            s.el(f'<polygon points="{x+13},{iy-4} {x+27},{iy-4} {x+25},{iy+4} {x+11},{iy+4}" fill="{c}" opacity=".5"/>')
        else:
            s.el(f'<rect x="{x+10}" y="{iy-5}" width="16" height="10" rx="3" fill="{c}" opacity=".5"/>')
        s.el(f'<text x="{x+34}" y="{iy+3}" fill="{T["txt2"]}" font-size="8">{esc(l)}</text>')


# ═══════════════════════════════════════════════════
# BUILD THE FLOW DIAGRAM
# ═══════════════════════════════════════════════════
def main():
    s = SVG()

    # Title
    s.el(f'<text x="40" y="48" fill="{T["txt1"]}" font-size="20" font-weight="700" letter-spacing=".05em">Shieldra AI — Core Compliance Workflow</text>'
         f'<text x="40" y="68" fill="{T["ai"]}" font-size="11" font-weight="400" letter-spacing=".04em">Flow Diagram · Document Upload through Compliance Resolution</text>'
         f'<line x1="40" y1="76" x2="450" y2="76" stroke="{T["ai"]}" stroke-width="1" stroke-opacity=".3"/>')

    # ═══════════════════════════════════════════════════
    # MAIN FLOW (center column, x=420)
    # ═══════════════════════════════════════════════════
    CX = 420  # center of main flow
    RX = 900  # center of right branch (AI enrichment)
    LX = 130  # center of left branch (error/reject)

    # --- START ---
    start_end(s, CX, 120, "User Logs In", T['user'])

    # Step 1: Auth
    arrow(s, CX, 142, CX, 178, c=T['sec'])
    process(s, CX, 210, "Authenticate", "JWT + MFA Verification", T['sec'])

    # Decision: Auth OK?
    arrow(s, CX, 240, CX, 290, c=T['sec'])
    decision(s, CX, 335, "Auth OK?", T['sec'], 42)

    # No → Access Denied
    arrow(s, CX-55, 335, LX+90, 335, c=T['err'])
    branch_label(s, CX-85, 322, "NO", T['err'])
    start_end(s, LX, 335, "Access Denied", T['err'])

    # Yes → Upload Document
    arrow(s, CX, 377, CX, 410, c=T['success'])
    branch_label(s, CX+15, 390, "YES", T['success'])

    # Step 2: Upload Document
    io_shape(s, CX, 445, "Upload Document", "PDF / DOCX / Policy File", T['fe'])

    # Step 3: Process Document
    arrow(s, CX, 472, CX, 505, c=T['be'])
    process(s, CX, 538, "Process Document", "Extract Text · Parse Structure", T['be'])

    # Step 4: Auto-detect Framework
    arrow(s, CX, 568, CX, 605, c=T['be'])
    decision(s, CX, 650, "Framework?", T['be'], 42)

    note(s, CX+82, 618, ["Auto-detect:", "HIPAA, SOC 2,", "GDPR, PCI DSS,", "ISO 27001, NIST"], T['be'])

    # Step 5: Run Compliance Scan
    arrow(s, CX, 692, CX, 728, c=T['sec'])
    process(s, CX, 760, "Run Compliance Scan", "8 Specialized Scanners", T['sec'], w=220)

    note(s, CX-250, 738, ["Scanners:", "Access Control", "Encryption", "Network Security", "Policy Verification", "Technical Safeguards", "Training Compliance"], T['sec'])

    # Decision: Findings?
    arrow(s, CX, 790, CX, 832, c=T['sec'])
    decision(s, CX, 878, "Findings?", T['sec'], 42)

    # No findings → Compliant
    arrow(s, CX+55, 878, CX+200, 878, c=T['success'])
    branch_label(s, CX+85, 865, "NONE", T['success'])
    process(s, CX+280, 878, "Compliant", "All Controls Passing", T['success'], w=160, h=44)

    # Arrow from Compliant → Generate Report
    arrow(s, CX+280, 900, CX+280, 1090, c=T['success'], curve_dir=1)

    # Yes → AI Enrichment (branch right)
    arrow(s, CX, 920, CX, 955, c=T['warn'])
    branch_label(s, CX+15, 938, "YES", T['warn'])

    # ═══════════════════════════════════════════════════
    # AI ENRICHMENT (right column)
    # ═══════════════════════════════════════════════════
    group(s, 680, 92, 480, 520, "AI & Learning Engine Enrichment", T['ai'])

    # Step: Send to Learning Engine
    process(s, RX, 145, "Signal Capture", "Record scan event as signal", T['ai'], w=210)

    arrow(s, RX, 175, RX, 210, c=T['ai'])
    process(s, RX, 240, "Confidence Calibration", "Adjust scores from history", T['ai'], w=230)

    arrow(s, RX, 270, RX, 305, c=T['ai'])
    process(s, RX, 335, "RAG Context Injection", "Retrieve similar docs · pgvector", T['ai'], w=250)

    arrow(s, RX, 365, RX, 400, c=T['ai'])
    process(s, RX, 430, "Pattern Matching", "Cross-org patterns · k-anonymity", T['ai'], w=250)

    arrow(s, RX, 460, RX, 495, c=T['ai'])
    process(s, RX, 525, "Knowledge Graph Query", "HIPAA requirement mapping", T['ai'], w=250)

    arrow(s, RX, 555, RX, 580, c=T['ai'])

    # Enriched results label
    note(s, 1020, 130, ["10 Subsystems:", "Signal Capture", "Confidence Calibration", "Accuracy Tracking", "Pattern Extraction", "Knowledge Graph", "RAG Pipeline", "Cross-org Benchmark", "Drift Detection", "Gap Discovery", "Compliance Agent"], T['ai'])

    # Connect: scan → AI
    arrow(s, CX+110, 760, RX-125, 145, "Enrich", c=T['ai'], dashed=True)

    # Connect: AI back → main flow (enriched findings)
    arrow(s, RX-125, 525, CX+110, 988, "Enriched Scores", c=T['ai'], dashed=True, curve_dir=1)

    # ═══════════════════════════════════════════════════
    # MAIN FLOW CONTINUES: Findings Processing
    # ═══════════════════════════════════════════════════

    # Step: Review Findings
    process(s, CX, 988, "Review Findings", "AI confidence + expert badges", T['warn'], w=220)

    # Decision: Expert Override?
    arrow(s, CX, 1018, CX, 1055, c=T['warn'])
    decision(s, CX, 1098, "Correct?", T['warn'], 40)

    # No → Expert Override
    arrow(s, CX-52, 1098, LX+90, 1098, c=T['ext'])
    branch_label(s, CX-80, 1085, "NO", T['ext'])
    process(s, LX, 1098, "Expert Override", "Feedback → LE", T['ext'], w=150, h=44)

    # Arrow from Expert Override → feeds back to Learning Engine
    note(s, 20, 1045, ["Corrections feed", "back to Learning", "Engine calibration"], T['ai'])

    # Yes → Create Remediation
    arrow(s, CX, 1138, CX, 1170, c=T['success'])
    branch_label(s, CX+15, 1152, "YES", T['success'])

    # Step: Create Remediation Plan
    process(s, CX, 1200, "Create Remediation", "Assign owner · Set priority · Due date", T['be'], w=260)

    # Step: Collect Evidence
    arrow(s, CX, 1230, CX, 1265, c=T['be'])
    io_shape(s, CX, 1298, "Collect Evidence", "Upload proof · Map to controls", T['db'])

    # Decision: Resolved?
    arrow(s, CX, 1325, CX, 1360, c=T['be'])
    decision(s, CX, 1400, "Resolved?", T['be'], 35)

    # No → Loop back
    arrow(s, CX-46, 1400, LX+75, 1400, c=T['err'])
    branch_label(s, CX-72, 1387, "NO", T['err'])
    s.el(f'<path d="M {LX+75} {1400} L {LX} {1400} L {LX} {1200} L {CX-130} {1200}" fill="none" stroke="{T["err"]}" stroke-width="1.5" stroke-opacity=".4" stroke-dasharray="7 4" marker-end="url(#fa{_aid[0]})"/>')
    note(s, 20, 1370, ["Retry remediation", "until resolved"], T['err'])

    # Yes → Generate Report
    arrow(s, CX+46, 1400, CX+200, 1400, c=T['success'])
    branch_label(s, CX+72, 1387, "YES", T['success'])

    # ═══════════════════════════════════════════════════
    # RIGHT SIDE: Report & Complete
    # ═══════════════════════════════════════════════════

    # Generate Report
    process(s, CX+280, 1120, "Generate Report", "Executive · Detailed · Peer metrics", T['be'], w=230)

    # From Resolved Yes → Report
    s.el(f'<path d="M {CX+200} {1400} L {CX+280} {1400} L {CX+280} {1150}" fill="none" stroke="{T["success"]}" stroke-width="1.5" stroke-opacity=".5" marker-end="url(#fa{_aid[0]})"/>')

    # Store in Audit Trail
    arrow(s, CX+280, 1090, CX+280, 1050, c=T['sec'])
    process(s, CX+280, 1020, "Store Audit Trail", "Complete compliance record", T['sec'], w=210)

    # LE captures outcome
    arrow(s, CX+280, 998, CX+280, 960, c=T['ai'])
    process(s, CX+280, 930, "LE Captures Outcome", "What remediation worked", T['ai'], w=230)

    # End
    arrow(s, CX+280, 900, CX+280, 865, c=T['success'])
    start_end(s, CX+280, 840, "Workflow Complete", T['success'])

    # ═══════════════════════════════════════════════════
    # SWIM LANE LABELS (left edge)
    # ═══════════════════════════════════════════════════
    lanes = [
        (120, "AUTH", T['sec']),
        (445, "UPLOAD & SCAN", T['fe']),
        (878, "FINDINGS", T['warn']),
        (1200, "REMEDIATION", T['be']),
    ]
    for ly, label, c in lanes:
        s.el(f'<line x1="14" y1="{ly-50}" x2="14" y2="{ly+50}" stroke="{c}" stroke-width="2" stroke-opacity=".4"/>'
             f'<text x="18" y="{ly}" fill="{c}" font-size="8" font-weight="700" letter-spacing=".15em" transform="rotate(-90,18,{ly})" opacity=".6">{esc(label)}</text>')

    # ═══════════════════════════════════════════════════
    # LEGEND
    # ═══════════════════════════════════════════════════
    legend(s, [
        ("Start / End", T['user'], "pill"),
        ("Process Step", T['be'], "rect"),
        ("Decision Point", T['warn'], "diamond"),
        ("Input / Output", T['fe'], "para"),
        ("AI Enrichment", T['ai'], "rect"),
        ("Security / Auth", T['sec'], "rect"),
        ("Success Path", T['success'], "rect"),
        ("Error / Retry", T['err'], "rect"),
    ], W-200, H-210)

    return s.render()


if __name__ == "__main__":
    svg = main()
    out = "shieldra-flow-diagram.svg"
    with open(out, "w") as f:
        f.write(svg)
    print(f"Generated: {out}")
