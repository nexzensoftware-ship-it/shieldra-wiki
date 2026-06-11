// Scene — Intelligence Briefing. AI insights + peer benchmarking.
function SceneIntelligence() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  // Percentile gauge
  const pct = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 2.0) / 1.8))) * 62);
  const rank = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 2.4) / 1.8))) * 38);

  const insights = [
    { tone: 'high',    title: 'Evidence coverage insufficient', body: 'Only 0 evidence items for 26 compliant findings. Auditors expect evidence for each control.', at: 3.0 },
    { tone: 'warning', title: 'Industry signal: peers lead on Administrative Safeguards', body: "Your score is in the 38th percentile (peer average: 6%). 62% of orgs are performing better — closing this gap would lift you above the median.", at: 3.6 },
    { tone: 'info',    title: 'Top industry gap this quarter: Recurring failure — Risk Analysis (45 CFR 164.308(a)(1)(ii)(A))', body: 'Observed across 5 peer organizations in the Shieldra learning network. Review whether your controls here are stronger than the industry baseline.', at: 4.2 },
    { tone: 'success', title: 'You lead on Breach Notification', body: 'Your controls exceed 84% of comparable organizations. Keep this posture.', at: 4.8 },
  ];

  const toneColors = {
    high:    { dot: BRAND.high,    bg: '#fff7ed' },
    warning: { dot: '#eab308',     bg: '#fefce8' },
    info:    { dot: BRAND.brand500, bg: BRAND.brand50 },
    success: { dot: BRAND.success, bg: '#f0fdf4' },
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 580px', paddingTop: 50 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="violet"
            eyebrow={{ icon: <Icons.Brain size={16}/>, label: 'Intelligence Briefing' }}
            title="See how you"
            gradientWord="compare."
            subtitle="AI-powered insights benchmark your compliance posture against peer organizations — and tell you exactly where to focus next."
          />
          <div style={{ marginTop: 40, opacity: t > 2.2 ? 1 : 0, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={70} cy={70} r={60} fill="none" stroke={BRAND.surface200} strokeWidth={10}/>
                <defs>
                  <linearGradient id="percGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={BRAND.violet500}/>
                    <stop offset="100%" stopColor={BRAND.brand500}/>
                  </linearGradient>
                </defs>
                <circle cx={70} cy={70} r={60} fill="none" stroke="url(#percGrad)" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(pct/100)*377} 377`}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: BRAND.violet600, fontFamily: MONO, lineHeight: 1 }}>{rank}<span style={{ fontSize: 14 }}>th</span></div>
                <div style={{ fontSize: 9, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Percentile</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Peer Rank</div>
              <div style={{ fontSize: 19, fontWeight: 700, color: BRAND.surface900, marginTop: 4 }}>{pct}% of peers are ahead</div>
              <div style={{ fontSize: 12, color: BRAND.surface500, marginTop: 2 }}>Closing key gaps would lift you above the median.</div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.surface600, padding: '4px 10px', borderRadius: 9999, background: BRAND.surface100 }}>4 insights</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.surface600, padding: '4px 10px', borderRadius: 9999, background: BRAND.surface100 }}>— Stable</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <GlassCard style={{ width: '100%', padding: 30, opacity: t > 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND.violet50, color: BRAND.violet600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Brain size={20}/>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.surface900 }}>Intelligence Briefing</div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'white', background: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`, padding: '3px 9px', borderRadius: 9999, letterSpacing: '0.08em' }}>✦ AI</span>
            </div>
            <div style={{ fontSize: 12, color: BRAND.surface500, marginBottom: 20 }}>AI-powered insights based on your compliance data and industry patterns</div>

            {insights.map((ins, i) => {
              const op = t > ins.at ? Math.min(1, (t - ins.at) / 0.4) : 0;
              const dy = (1 - op) * 12;
              const tc = toneColors[ins.tone];
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateY(${dy}px)`,
                  display: 'flex', gap: 12, padding: '12px 0',
                  borderBottom: i < insights.length - 1 ? `1px solid ${BRAND.surface100}` : 'none',
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: tc.dot, flexShrink: 0, marginTop: 6 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.surface900 }}>{ins.title}</div>
                    <div style={{ fontSize: 12, color: BRAND.surface600, marginTop: 3, lineHeight: 1.55 }}>{ins.body}</div>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: BRAND.surface50, fontSize: 11, color: BRAND.surface600, textAlign: 'center', fontWeight: 600 }}>
              Show 1 more ⌄
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
window.SceneIntelligence = SceneIntelligence;
