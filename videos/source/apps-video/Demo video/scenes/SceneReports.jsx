// Scene — Reports & Analytics. Generate compliance reports.
function SceneReports() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  // Generate Report button click -> modal fills in -> report list appears
  const clickAt = 3.2;
  const generatingAt = 3.5;
  const finishedAt = 6.5;

  const reports = [
    { name: 'HIPAA Annual Risk Assessment', type: 'Risk Analysis', fmt: 'PDF',  status: 'Ready',       created: 'Just now', at: finishedAt + 0.0 },
    { name: 'Q1 Evidence Summary',          type: 'Evidence',     fmt: 'PDF',  status: 'Ready',       created: '2m ago',    at: finishedAt + 0.3 },
    { name: 'Access Control Review',        type: 'Audit',        fmt: 'XLSX', status: 'Ready',       created: '14m ago',   at: finishedAt + 0.6 },
    { name: 'Security Awareness Training',  type: 'Training',     fmt: 'PDF',  status: 'Ready',       created: '1h ago',    at: finishedAt + 0.9 },
    { name: 'BAA Vendor Inventory',         type: 'Vendors',      fmt: 'CSV',  status: 'Ready',       created: 'Yesterday', at: finishedAt + 1.2 },
  ];

  const statusColors = { Ready: { bg: '#f0fdf4', fg: BRAND.success } };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 560px', paddingTop: 60 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="violet"
            eyebrow={{ icon: <Icons.FileSearch size={16}/>, label: 'Reports & Analytics' }}
            title="Board-ready reports,"
            gradientWord="on demand."
            subtitle="Risk assessments. Evidence summaries. Access reviews. Training rosters. Generate any compliance report in seconds — with live data from your program."
          />
          <div style={{ marginTop: 36, display: 'flex', gap: 8, flexWrap: 'wrap', opacity: t > 2 ? 1 : 0 }}>
            {['Risk Analysis','Evidence','Audit','Training','Vendors','Incidents'].map(c => (
              <span key={c} style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 9999, background: BRAND.violet50, color: BRAND.violet600, border: `1px solid ${BRAND.violet200}` }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <GlassCard style={{ padding: 24, opacity: t > 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800,
                  backgroundImage: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`,
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Reports &amp; Analytics</div>
                <div style={{ fontSize: 11, color: BRAND.surface500 }}>Generate compliance reports and view analytics</div>
              </div>
              <button style={{
                fontSize: 12, fontWeight: 700, padding: '10px 18px', borderRadius: 10, border: 'none',
                background: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`,
                color: 'white',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: t > clickAt && t < finishedAt ? `0 0 0 4px ${BRAND.violet100}` : `0 6px 14px -4px ${BRAND.violet500}88`,
              }}>+ Generate Report</button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 14, borderBottom: `1px solid ${BRAND.surface200}` }}>
              <div style={{ padding: '8px 12px', borderBottom: `2px solid ${BRAND.brand600}`, fontSize: 12, fontWeight: 700, color: BRAND.brand600 }}>Generated Reports</div>
              <div style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: BRAND.surface500 }}>Analytics</div>
            </div>

            <div style={{ padding: '7px 12px', borderRadius: 8, background: BRAND.surface50, border: `1px solid ${BRAND.surface200}`, fontSize: 11, color: BRAND.surface400, marginBottom: 12 }}>🔍 Search reports…</div>

            {/* Generating state */}
            {t > generatingAt && t < finishedAt && (
              <div style={{ padding: '14px 18px', borderRadius: 12, background: BRAND.violet50, border: `1px dashed ${BRAND.violet500}`, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2.5px solid ${BRAND.violet500}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.surface900 }}>Generating: HIPAA Annual Risk Assessment</div>
                  <div style={{ fontSize: 11, color: BRAND.surface600 }}>Pulling findings · compiling evidence · rendering PDF…</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.violet600, fontFamily: MONO }}>{Math.round(Math.min(1, (t - generatingAt) / 2.8) * 100)}%</span>
              </div>
            )}

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.7fr 0.9fr 0.9fr', gap: 10, padding: '6px 8px', fontSize: 9, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Report</span><span>Type</span><span>Format</span><span>Status</span><span>Created</span>
            </div>

            {/* Empty state before reports arrive */}
            {t < finishedAt && (
              <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 1 - Math.min(1, Math.max(0, (t - finishedAt + 0.3) / 0.3)) }}>
                <div style={{ fontSize: 32, color: BRAND.surface300, marginBottom: 6 }}>📄</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.surface600 }}>No reports generated yet</div>
                <div style={{ fontSize: 11, color: BRAND.surface500 }}>Click "Generate Report" to create your first HIPAA compliance report</div>
              </div>
            )}

            {/* Reports */}
            {reports.map((r, i) => {
              const op = t > r.at ? Math.min(1, (t - r.at) / 0.3) : 0;
              const dy = (1 - op) * 12;
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateY(${dy}px)`,
                  display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.7fr 0.9fr 0.9fr', gap: 10,
                  alignItems: 'center', padding: '10px 8px',
                  borderBottom: `1px solid ${BRAND.surface100}`,
                  fontSize: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: BRAND.brand50, color: BRAND.brand600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.FileSearch size={13}/></div>
                    <span style={{ color: BRAND.surface900, fontWeight: 600 }}>{r.name}</span>
                  </div>
                  <span style={{ color: BRAND.surface600 }}>{r.type}</span>
                  <span style={{ fontSize: 10, fontFamily: MONO, fontWeight: 700, color: BRAND.surface600, padding: '2px 7px', borderRadius: 5, background: BRAND.surface100, justifySelf: 'start' }}>{r.fmt}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 9999, background: statusColors.Ready.bg, color: statusColors.Ready.fg, justifySelf: 'start' }}>● {r.status}</span>
                  <span style={{ color: BRAND.surface500 }}>{r.created}</span>
                </div>
              );
            })}
          </GlassCard>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
window.SceneReports = SceneReports;
