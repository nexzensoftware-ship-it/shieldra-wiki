// Scene — Dashboard. The compliance command center.
// Compliance score gauge + metric grid + HIPAA Roadmap (6 rules) + Quick Actions.

function SceneDashboard() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  // Score animation 1.2 → 3.2s, 0 → 74
  const scoreP = Math.max(0, Math.min(1, (t - 1.2) / 2.0));
  const score = Math.round(Easing.easeOutCubic(scoreP) * 74);
  const findings = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.6) / 2.0))) * 1170);

  const tiles = [
    { label: 'Open Findings',   val: '1,170', sub: 'Prioritised by severity', icon: <Icons.AlertTriangle size={14}/>, tone: 'danger',  at: 2.0 },
    { label: 'HIPAA Readiness', val: '74%',   sub: 'All safeguards',          icon: <Icons.ShieldCheck size={14}/>,   tone: 'violet',  at: 2.2 },
    { label: 'Controls',        val: '37',    sub: 'Active',                  icon: <Icons.Activity size={14}/>,      tone: 'brand',   at: 2.4 },
    { label: 'Critical / High', val: '838',   sub: '0 resolved',              icon: <Icons.AlertTriangle size={14}/>, tone: 'warning', at: 2.6 },
    { label: 'Documents',       val: '21',    sub: '5 pending review',        icon: <Icons.FileSearch size={14}/>,    tone: 'accent',  at: 2.8 },
    { label: 'Incidents',       val: '0',     sub: '0 PHI related',           icon: <Icons.Activity size={14}/>,      tone: 'surface', at: 3.0 },
    { label: 'Training',        val: '0%',    sub: 'Tenant average',          icon: <Icons.GraduationCap size={14}/>, tone: 'accent',  at: 3.2 },
    { label: 'Vendors',         val: '0',     sub: '0 BAA gaps',              icon: <Icons.ShieldCheck size={14}/>,   tone: 'surface', at: 3.4 },
    { label: 'Remediation',     val: '0%',    sub: '↑ 26 resolved',           icon: <Icons.TrendingUp size={14}/>,    tone: 'success', at: 3.6 },
  ];

  // Roadmap rules — the actual 6 HIPAA rules
  const roadmap = [
    { name: 'Protect Patient Info',  done: 6,  total: 7,  color: BRAND.brand500,  at: 4.2 },
    { name: 'Secure Systems & Data', done: 10, total: 18, color: BRAND.violet500, at: 4.4 },
    { name: 'Plan for Breaches',     done: 6,  total: 6,  color: BRAND.accent500, at: 4.6 },
    { name: 'Extended Compliance',   done: 5,  total: 6,  color: BRAND.high,      at: 4.8 },
    { name: 'Train Workforce',       done: 1,  total: 1,  color: BRAND.success,   at: 5.0 },
    { name: 'Govern Third Parties',  done: 1,  total: 1,  color: BRAND.accent600, at: 5.2 },
  ];

  const toneMap = {
    danger:  { bg: '#fef2f2', fg: BRAND.danger  },
    violet:  { bg: BRAND.violet50, fg: BRAND.violet600 },
    brand:   { bg: BRAND.brand50,  fg: BRAND.brand600 },
    warning: { bg: '#fffbeb', fg: '#d97706' },
    accent:  { bg: BRAND.accent50, fg: BRAND.accent600 },
    surface: { bg: BRAND.surface100, fg: BRAND.surface600 },
    success: { bg: '#f0fdf4', fg: BRAND.success },
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg />
      <DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 40 }}>
        {/* LEFT — title block */}
        <div style={{ flex: '0 0 560px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 40 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="brand"
            eyebrow={{ icon: <Icons.Activity size={16}/>, label: 'Compliance Dashboard' }}
            title="One screen. Your whole"
            gradientWord="program."
            subtitle="Your HIPAA readiness, findings, controls, and remediation — all in one view. No spreadsheets. No guesswork."
          />
          <div style={{ marginTop: 36, opacity: t > 2 ? 1 : 0, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Dashboard','Roadmap','Findings','Policies','AI Agent','Reports'].map((k, i) => (
              <span key={k} style={{
                fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 8,
                background: i === 0 ? BRAND.brand600 : 'white',
                color: i === 0 ? 'white' : BRAND.surface600,
                border: `1px solid ${i === 0 ? BRAND.brand600 : BRAND.surface200}`,
              }}>{k}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — dashboard mockup */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, opacity: t > 1 ? Math.min(1, (t - 1) / 0.5) : 0 }}>
          {/* Top row: score card + 3×3 metric grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
            {/* Compliance Score card */}
            <GlassCard style={{ padding: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compliance Score</div>
              <div style={{ fontSize: 11, color: BRAND.surface500, marginTop: 2 }}>Across all active HIPAA safeguards</div>
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={60} cy={60} r={50} fill="none" stroke={BRAND.surface200} strokeWidth={10}/>
                    <circle cx={60} cy={60} r={50} fill="none" stroke="#f59e0b" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(score/100)*314} 314`} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: BRAND.surface900, fontFamily: MONO }}>{score}<span style={{ fontSize: 15, color: '#f59e0b' }}>%</span></div>
                  </div>
                  <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.08em' }}>GOOD</div>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, minWidth: 0, flex: 1 }}>
                  <div style={{ color: BRAND.surface500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9 }}>Open findings</div>
                  <div style={{ color: BRAND.danger, fontWeight: 800, fontSize: 16, fontFamily: MONO }}>{findings.toLocaleString()}</div>
                  <div style={{ color: BRAND.surface500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9, marginTop: 8 }}>Documents</div>
                  <div style={{ color: BRAND.surface800, fontWeight: 700, fontSize: 16, fontFamily: MONO }}>21</div>
                  <div style={{ color: BRAND.surface500, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9, marginTop: 8 }}>Remediation</div>
                  <div style={{ color: BRAND.accent600, fontWeight: 700, fontSize: 16, fontFamily: MONO }}>0%</div>
                </div>
              </div>
            </GlassCard>

            {/* Metric tiles grid 3×3 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {tiles.map((tile, i) => {
                const op = t > tile.at ? Math.min(1, (t - tile.at) / 0.3) : 0;
                const sc = 0.92 + 0.08 * op;
                const tm = toneMap[tile.tone];
                return (
                  <div key={i} style={{
                    opacity: op, transform: `scale(${sc})`,
                    padding: '14px 14px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${BRAND.surface200}`,
                    boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, minHeight: 24 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: tm.bg, color: tm.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{tile.icon}</div>
                      <span style={{ fontSize: 9, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tile.label}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: BRAND.surface900, fontFamily: MONO, lineHeight: 1 }}>{tile.val}</div>
                    <div style={{ fontSize: 10, color: BRAND.surface500, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tile.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom row: HIPAA Roadmap + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16 }}>
            <GlassCard style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.surface900 }}>HIPAA Roadmap Progress</div>
                  <div style={{ fontSize: 11, color: BRAND.surface500 }}>Your coverage across the 6 HIPAA rules</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.surface600, padding: '4px 10px', borderRadius: 9999, border: `1px solid ${BRAND.surface200}` }}>29/39 complete</span>
              </div>
              {roadmap.map((r, i) => {
                const op = t > r.at ? Math.min(1, (t - r.at) / 0.4) : 0;
                const pct = Math.round((r.done / r.total) * 100);
                return (
                  <div key={i} style={{ marginBottom: 10, opacity: op }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.surface700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                      <span style={{ fontSize: 11, color: BRAND.surface600, fontFamily: MONO, flexShrink: 0 }}>{r.done}/{r.total} · <span style={{ color: r.color, fontWeight: 700 }}>{pct}%</span></span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: BRAND.surface200, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct * op}%`, background: r.color, borderRadius: 3, transition: 'width 0.2s ease' }}/>
                    </div>
                  </div>
                );
              })}
            </GlassCard>
            <GlassCard style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Icons.Zap size={14}/><span style={{ fontSize: 13, fontWeight: 700, color: BRAND.surface900 }}>Quick Actions</span>
              </div>
              <div style={{ fontSize: 10, color: BRAND.surface500, marginBottom: 12 }}>Jump to common tasks</div>
              {[
                { i: <Icons.FileSearch size={14}/>, label: 'Upload Document', sub: 'Add policies & procedures' },
                { i: <Icons.AlertTriangle size={14}/>, label: 'Run Assessment', sub: 'Check your risk posture' },
                { i: <Icons.Radar size={14}/>, label: 'View Roadmap', sub: 'See your HIPAA progress' },
              ].map((a, i) => {
                const at = 4.8 + i * 0.15;
                const op = t > at ? Math.min(1, (t - at) / 0.3) : 0;
                return (
                  <div key={i} style={{
                    opacity: op,
                    padding: '9px 10px', marginBottom: 6, borderRadius: 10,
                    background: BRAND.surface50, border: `1px solid ${BRAND.surface200}`,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'white', color: BRAND.brand600, border: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.i}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.surface900 }}>{a.label}</div>
                      <div style={{ fontSize: 9, color: BRAND.surface500 }}>{a.sub}</div>
                    </div>
                  </div>
                );
              })}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
window.SceneDashboard = SceneDashboard;
