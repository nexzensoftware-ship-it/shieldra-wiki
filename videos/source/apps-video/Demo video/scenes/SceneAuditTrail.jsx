// Scene — Audit Trail. Immutable log with Verify Integrity.
function SceneAuditTrail() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  const entries = [
    { time: '9:23 PM', user: 'System',   action: 'viewed',       res: 'Compliance', details: 'overall_score: 74, completed: 29, total: 39', at: 2.0, sys: true },
    { time: '9:16 PM', user: 'sarah@nexzen.com', action: 'policy update', res: 'Document',   details: 'Privacy Notice v3.2', at: 2.3 },
    { time: '9:13 PM', user: 'System',   action: 'viewed',       res: 'Compliance', details: 'overall_score: 74, completed: 29, total: 39', at: 2.6, sys: true },
    { time: '9:10 PM', user: 'marcus@nexzen.com', action: 'evidence upload',res: 'Evidence',   details: 'Q1 access-review-matrix.pdf', at: 2.9 },
    { time: '8:56 PM', user: 'sarah@nexzen.com', action: 'risk accept',  res: 'Finding',    details: 'FND-284: Logging gap', at: 3.2 },
    { time: '8:45 PM', user: 'elena@nexzen.com',  action: 'baa signed',    res: 'Vendor',     details: 'AWS Business Associate Agreement', at: 3.5 },
    { time: '8:36 PM', user: 'sarah@nexzen.com', action: 'token refresh',res: 'User',       details: 'session renewed', at: 3.8 },
    { time: '8:25 PM', user: 'marcus@nexzen.com', action: 'incident close',res: 'Incident',   details: 'INC-41: Phishing report', at: 4.1 },
  ];

  // Verify Integrity action
  const verifyClick = t > 5.5;
  const verifyProgress = t > 5.8 ? Math.min(1, (t - 5.8) / 1.2) : 0;
  const verified = t > 7.2;

  const actionColors = {
    'viewed':         { bg: '#fef3c7', fg: '#b45309' },
    'policy update':  { bg: BRAND.brand50, fg: BRAND.brand600 },
    'evidence upload':{ bg: '#f0fdf4', fg: BRAND.success },
    'risk accept':    { bg: '#fff7ed', fg: BRAND.high },
    'baa signed':     { bg: BRAND.violet50, fg: BRAND.violet600 },
    'token refresh':  { bg: BRAND.surface100, fg: BRAND.surface600 },
    'incident close': { bg: '#fef2f2', fg: BRAND.danger },
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 540px', paddingTop: 40 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="brand"
            eyebrow={{ icon: <Icons.Lock size={16}/>, label: 'Audit Trail' }}
            title="Immutable.  Tamper-"
            gradientWord="proof."
            subtitle="Every action in Shieldra is cryptographically sealed and hash-chained. When an auditor asks 'who did what, when,' the answer is already there — and already verified."
          />
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, opacity: t > 2 ? 1 : 0 }}>
            {[
              { n: '452', l: 'Total entries', s: '30 days' },
              { n: '170', l: "Today's events", s: 'so far' },
              { n: '2',   l: 'Active users',   s: '30 days' },
              { n: '25',  l: 'Sealed on page', s: 'hash-chained' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 32, fontWeight: 800, color: BRAND.surface900, fontFamily: MONO, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.l}</div>
                <div style={{ fontSize: 10, color: BRAND.surface400 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <GlassCard style={{ padding: 24, opacity: t > 1 ? 1 : 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: BRAND.brand600 }}>Audit Trail</div>
                <div style={{ fontSize: 11, color: BRAND.surface500 }}>Immutable, tamper-proof log of all compliance actions and system events</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8,
                  background: verified ? '#f0fdf4' : verifyClick ? BRAND.brand50 : 'white',
                  color: verified ? BRAND.success : verifyClick ? BRAND.brand600 : BRAND.surface700,
                  border: `1px solid ${verified ? BRAND.success : verifyClick ? BRAND.brand500 : BRAND.surface200}`,
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'all 0.3s ease',
                  boxShadow: verifyClick && !verified ? `0 0 0 3px ${BRAND.brand100}` : 'none',
                }}>
                  {verified ? <Icons.Check size={11}/> : <Icons.ShieldCheck size={11}/>}
                  {verified ? 'Integrity verified · 452/452' : verifyClick ? 'Verifying…' : 'Verify Integrity'}
                </button>
                <button style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, background: 'white', color: BRAND.surface700, border: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ↓ Export
                </button>
              </div>
            </div>

            {/* Filters row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, padding: '7px 12px', borderRadius: 8, background: BRAND.surface50, border: `1px solid ${BRAND.surface200}`, fontSize: 11, color: BRAND.surface400 }}>🔍 Search actions, users, resources…</div>
              <div style={{ padding: '7px 12px', borderRadius: 8, background: 'white', border: `1px solid ${BRAND.surface200}`, fontSize: 11, color: BRAND.surface600, fontWeight: 600 }}>▽ All Resources</div>
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 120px 120px 1fr', gap: 10, padding: '6px 8px', fontSize: 9, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Timestamp</span><span>User</span><span>Action</span><span>Resource</span><span>Details</span>
            </div>

            {/* Rows */}
            {entries.map((e, i) => {
              const op = t > e.at ? Math.min(1, (t - e.at) / 0.3) : 0;
              const dx = (1 - op) * 16;
              const ac = actionColors[e.action] || actionColors['viewed'];
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateX(${dx}px)`,
                  display: 'grid', gridTemplateColumns: '110px 1fr 120px 120px 1fr', gap: 10,
                  alignItems: 'center',
                  padding: '9px 8px',
                  borderBottom: `1px solid ${BRAND.surface100}`,
                  fontSize: 11,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: BRAND.surface600 }}>
                    <Icons.Lock size={11}/> {e.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: e.sys ? BRAND.surface200 : BRAND.violet100, color: e.sys ? BRAND.surface600 : BRAND.violet600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>
                      {e.sys ? '⚙' : e.user.slice(0,2).toUpperCase()}
                    </div>
                    <span style={{ color: BRAND.surface800, fontWeight: 500 }}>{e.user}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, background: ac.bg, color: ac.fg, justifySelf: 'start' }}>{e.action}</span>
                  <span style={{ color: BRAND.surface700, fontWeight: 600 }}>{e.res}</span>
                  <span style={{ color: BRAND.surface500, fontFamily: MONO, fontSize: 10 }}>{e.details}</span>
                </div>
              );
            })}

            {/* Integrity callout */}
            {verified && (
              <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(90deg, #f0fdf4, #ecfeff)', border: `1px solid ${BRAND.success}`, display: 'flex', alignItems: 'center', gap: 12, opacity: Math.min(1, (t - 7.2) / 0.4) }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: BRAND.success, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.ShieldCheck size={16}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.surface900 }}>Chain verified · no tampering detected</div>
                  <div style={{ fontSize: 11, color: BRAND.surface600, fontFamily: MONO }}>SHA-256 root: 0xA4F2·9B3E·7C81·5D0A</div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
window.SceneAuditTrail = SceneAuditTrail;
