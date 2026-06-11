// Scene 4 — Evidence Collection. ~25s
function SceneEvidence() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.8 ? 1 - Math.min(1, (t - (duration - 0.8)) / 0.8) : 1;

  const percent = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.5) / 2.5))) * 95);
  const evidenceCount = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 2.0) / 2.8))) * 18472);

  const timeline = [
    { time: 'Just now',  label: 'AWS CloudTrail logs collected',   icon: <Icons.Cloud size={18}/>,    src: 'aws',   at: 3.5 },
    { time: '2 min ago', label: 'Azure AD access review snapshot', icon: <Icons.Server size={18}/>,    src: 'azure', at: 4.3 },
    { time: '5 min ago', label: 'Okta SSO audit log exported',    icon: <Icons.Lock size={18}/>,      src: 'okta',  at: 5.1 },
    { time: '12 min ago',label: 'GCP KMS key rotation logged',    icon: <Icons.Database size={18}/>, src: 'gcp',   at: 5.9 },
    { time: '18 min ago',label: 'GitHub branch protection proof',  icon: <Icons.ShieldCheck size={18}/>, src: 'github', at: 6.7 },
    { time: '24 min ago',label: 'Workday training completion',     icon: <Icons.FolderCheck size={18}/>, src: 'workday', at: 7.5 },
  ];

  const integrations = ['AWS','Azure','GCP','Okta','GitHub','Workday','Slack','Jamf'];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg />
      <DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '80px 100px', fontFamily: FONT, display: 'flex', gap: 60 }}>
        <div style={{ flex: '0 0 680px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SceneTitle
            progress={Math.min(1, t / 2.0)}
            color="accent"
            eyebrow={{ icon: <Icons.FolderCheck size={16}/>, label: 'Evidence Collection' }}
            title="Audit-ready,"
            gradientWord="automatically."
            subtitle="Shieldra continuously pulls, timestamps, and organizes evidence from every cloud you run. When the auditor asks, the answer is already there."
          />

          {/* Big stat */}
          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 40, opacity: t > 2.5 ? 1 : 0 }}>
            <div style={{ position: 'relative' }}>
              <svg width={180} height={180} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={90} cy={90} r={76} fill="none" stroke={BRAND.surface200} strokeWidth={10}/>
                <defs>
                  <linearGradient id="evGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={BRAND.brand500}/>
                    <stop offset="100%" stopColor={BRAND.accent500}/>
                  </linearGradient>
                </defs>
                <circle cx={90} cy={90} r={76} fill="none" stroke="url(#evGrad)" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(percent/100)*477} 477`}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: 42, fontWeight: 800, fontFamily: MONO, color: BRAND.surface900, lineHeight: 1 }}>{percent}%</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Automated</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 56, fontWeight: 800, fontFamily: MONO, letterSpacing: '-0.02em', color: BRAND.surface900 }}>{evidenceCount.toLocaleString()}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Evidence items this quarter</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {integrations.map(i => (
                  <span key={i} style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: BRAND.surface100, color: BRAND.surface700, border: `1px solid ${BRAND.surface200}` }}>{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <GlassCard style={{ width: '100%', padding: 36, opacity: t > 1.4 ? 1 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.surface900 }}>Evidence Feed</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BRAND.accent600, fontWeight: 700 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.accent500, animation: 'pulse 1.5s infinite' }}/> LIVE
              </div>
            </div>
            {timeline.map((item, i) => {
              const op = t > item.at ? Math.min(1, (t - item.at) / 0.4) : 0;
              const dx = (1 - op) * 20;
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateX(${dx}px)`,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  padding: '14px 0',
                  borderBottom: i < timeline.length - 1 ? `1px solid ${BRAND.surface200}` : 'none',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND.accent50, color: BRAND.accent600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.surface800, lineHeight: 1.35 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: BRAND.surface500, marginTop: 2, fontFamily: MONO }}>{item.time} · hash-signed · immutable</div>
                  </div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: BRAND.accent100, color: BRAND.accent600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icons.Check size={13}/>
                  </div>
                </div>
              );
            })}
          </GlassCard>
        </div>
      </div>
      <style>{`@keyframes pulse{50%{opacity:0.4}}`}</style>
    </div>
  );
}
window.SceneEvidence = SceneEvidence;
