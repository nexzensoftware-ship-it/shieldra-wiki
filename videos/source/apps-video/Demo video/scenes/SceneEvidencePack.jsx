// Scene — Audit Evidence Pack. 9 sections, downloadable.
function SceneEvidencePack() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  // 9 sections that animate their status
  const sections = [
    { title: 'Risk Analysis',          sub: '3 assessments · 14 risk items',    icon: <Icons.AlertTriangle size={16}/>, at: 2.0, finalDone: true },
    { title: 'Policies & Acknowledgments', sub: '24 policies · 182/182 ack\'d', icon: <Icons.FileSearch size={16}/>,     at: 2.2, finalDone: true },
    { title: 'Training Records',       sub: '412 staff · 98% complete',         icon: <Icons.GraduationCap size={16}/>,  at: 2.4, finalDone: true },
    { title: 'BAA Inventory',          sub: '18 vendors with PHI access',      icon: <Icons.FileSearch size={16}/>,     at: 2.6, finalDone: true },
    { title: 'Incident / Breach Log',  sub: '3 incidents · 0 breaches',         icon: <Icons.AlertTriangle size={16}/>, at: 2.8, finalDone: true },
    { title: 'Audit Trail',            sub: '12,482 log entries',               icon: <Icons.Lock size={16}/>,          at: 3.0, finalDone: true },
    { title: 'Access Reviews',         sub: '4 reviews · 4 completed',          icon: <Icons.ShieldCheck size={16}/>,    at: 3.2, finalDone: true },
    { title: 'Evidence Items',         sub: '284 items · hash-signed',          icon: <Icons.FolderCheck size={16}/>,    at: 3.4, finalDone: true },
    { title: 'Compliance Scores',      sub: 'Score: 94% · strong',              icon: <Icons.TrendingUp size={16}/>,     at: 3.6, finalDone: true },
  ];

  // Percent ramps 1.5-4s from 33% to 100%
  const pctAnim = Math.round(33 + Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.5) / 2.8))) * 67);
  const sectionsDone = Math.min(9, Math.floor((pctAnim - 33) / 67 * 9) + 3);

  // Download action
  const downloadClick = t > 7.2;
  const downloadProgress = t > 7.4 ? Math.min(1, (t - 7.4) / 1.2) : 0;
  const downloaded = t > 8.8;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 560px', paddingTop: 50 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="accent"
            eyebrow={{ icon: <Icons.FolderCheck size={16}/>, label: 'Audit Evidence Pack' }}
            title="One click. Your entire"
            gradientWord="audit package."
            subtitle="When the auditor knocks, Shieldra compiles all 9 evidence sections into a single downloadable pack — timestamped, hash-signed, ready to ship."
          />
          <div style={{ marginTop: 44, display: 'flex', gap: 32, opacity: t > 2 ? 1 : 0 }}>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.accent600, fontFamily: MONO }}>9</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sections</div></div>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.brand600, fontFamily: MONO }}>PDF</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Output format</div></div>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.violet600, fontFamily: MONO }}>&lt;90s</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>To generate</div></div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <GlassCard style={{ padding: 24, opacity: t > 1 ? 1 : 0 }}>
            {/* Top bar */}
            <div style={{
              padding: 18, borderRadius: 14,
              background: downloaded ? 'linear-gradient(90deg, #f0fdf4, #ecfeff)' : 'white',
              border: `1px solid ${downloaded ? BRAND.success : BRAND.surface200}`,
              borderLeft: `4px solid ${downloaded ? BRAND.success : BRAND.brand500}`,
              marginBottom: 14,
              display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: BRAND.surface900 }}>Audit Evidence Pack</div>
                <div style={{ fontSize: 11, color: BRAND.surface500 }}>Generated 4/22/2026, 3:25:39 PM for Nexzen</div>
                <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: BRAND.surface200, overflow: 'hidden' }}>
                  <div style={{ width: `${pctAnim}%`, height: '100%', background: pctAnim < 60 ? '#f59e0b' : pctAnim < 90 ? BRAND.brand500 : BRAND.success, transition: 'all 0.3s ease' }}/>
                </div>
                <div style={{ fontSize: 11, color: BRAND.surface500, marginTop: 6 }}>
                  {pctAnim < 95 ? `Compiling: ${9 - sectionsDone} sections pending` : 'All sections ready · hash-signed'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 30, fontWeight: 800, fontFamily: MONO, color: pctAnim < 60 ? '#dc2626' : pctAnim < 90 ? BRAND.brand600 : BRAND.success, lineHeight: 1 }}>{pctAnim}%</div>
                <div style={{ fontSize: 11, color: BRAND.surface500, marginTop: 2 }}>{sectionsDone} of 9 sections</div>
              </div>
            </div>

            {/* 3x3 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {sections.map((s, i) => {
                const op = t > s.at ? Math.min(1, (t - s.at) / 0.3) : 0;
                // Section becomes "done" progressively
                const doneAt = s.at + 2.0 + (i * 0.1);
                const done = t > doneAt;
                return (
                  <div key={i} style={{
                    opacity: op,
                    padding: 14,
                    borderRadius: 12,
                    background: done ? '#f0fdf4' : 'white',
                    border: `1px solid ${done ? BRAND.success : BRAND.surface200}`,
                    transition: 'all 0.4s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: done ? '#dcfce7' : BRAND.surface100, color: done ? BRAND.success : BRAND.surface600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.icon}
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? BRAND.success : '#fef3c7', color: done ? 'white' : '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {done ? <Icons.Check size={11}/> : <Icons.AlertTriangle size={11}/>}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.surface900 }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: BRAND.surface500, marginTop: 2 }}>{s.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button style={{ fontSize: 12, fontWeight: 700, padding: '10px 18px', borderRadius: 10, background: 'white', color: BRAND.surface700, border: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icons.RefreshCw size={12}/> Regenerate Pack
              </button>
              <button style={{
                fontSize: 12, fontWeight: 700, padding: '10px 18px', borderRadius: 10, border: 'none',
                background: downloaded ? BRAND.success : `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`,
                color: 'white',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: downloadClick && !downloaded ? `0 0 0 3px ${BRAND.brand100}` : `0 6px 14px -4px ${BRAND.brand500}88`,
                transition: 'all 0.3s ease',
              }}>
                {downloaded ? <Icons.Check size={12}/> : '↓'}
                {downloaded ? 'Downloaded · audit-pack-q1.pdf' : downloadClick ? `Preparing… ${Math.round(downloadProgress * 100)}%` : 'Download Audit Pack'}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
window.SceneEvidencePack = SceneEvidencePack;
