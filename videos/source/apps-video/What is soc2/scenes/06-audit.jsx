// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 6: Audit process timeline
// 170s → 200s

function SceneAudit({ start, end }) {
  const steps = [
    { t: 'Readiness', sub: 'Month 1–2', d: 'Gap assessment. Map existing controls against Trust Services Criteria. Fix obvious holes.', c: '#22d3ee' },
    { t: 'Remediation', sub: 'Month 2–4', d: 'Write policies. Enable MFA. Wire alerting. Onboard an HR system. Document everything.', c: '#3b82f6' },
    { t: 'Observation', sub: 'Month 4–10', d: 'The audit window. Controls must operate continuously. Auditors sample evidence.', c: '#7c3aed' },
    { t: 'Fieldwork', sub: 'Month 10–11', d: 'Auditor requests evidence, tests samples, interviews your team, writes the report.', c: '#a855f7' },
    { t: 'Report', sub: 'Month 12', d: 'Signed SOC 2 Type II. Share with customers under NDA. Renew every 12 months.', c: '#06b6d4' },
  ];

  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.5);
        const tOut = localTime > duration - 0.5 ? (localTime - (duration - 0.5)) / 0.5 : 0;
        const opacity = tIn * (1 - tOut);

        return (
          <div style={{
            position: 'absolute', inset: 0, opacity,
            padding: '100px 120px',
          }}>
            <DeepBg variant="dark"/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Anim delay={0.1}><Eyebrow color="#22d3ee">05 · The Journey</Eyebrow></Anim>
              <Anim delay={0.3}>
                <div style={{ marginTop: 20 }}>
                  <Headline text="From kickoff to {signed report}." accent="signed report" size={80} dark/>
                </div>
              </Anim>
              <Anim delay={0.6}>
                <div style={{ marginTop: 14, fontSize: 24, color: '#cbd5e1', maxWidth: 1200 }}>
                  A typical Type II takes 6–12 months. Here's what happens.
                </div>
              </Anim>
            </div>

            {/* Timeline */}
            <div style={{
              position: 'relative', zIndex: 1, marginTop: 80,
              display: 'flex', alignItems: 'flex-start', gap: 0,
            }}>
              {/* Connector line */}
              <div style={{
                position: 'absolute', top: 24, left: '8%', right: '8%',
                height: 2,
                background: 'linear-gradient(90deg, #22d3ee, #3b82f6, #7c3aed, #a855f7, #06b6d4)',
                opacity: 0.4,
              }}/>
              {steps.map((s, i) => (
                <Anim key={i} delay={1.0 + i * 0.3} dy={12}>
                  <TimelineStep {...s} num={i + 1}/>
                </Anim>
              ))}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function TimelineStep({ t, sub, d, c, num }) {
  return (
    <div style={{
      flex: 1, padding: '0 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      width: 260,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: '50%',
        background: `linear-gradient(135deg, ${c}, ${c}aa)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0b1120', fontWeight: 800, fontSize: 20,
        boxShadow: `0 0 30px ${c}80`,
        border: '3px solid #0b1120',
        zIndex: 2, position: 'relative',
      }}>{num}</div>
      <div style={{
        marginTop: 24,
        padding: '22px 20px',
        background: 'rgba(15,23,42,0.8)',
        border: `1px solid ${c}44`,
        borderRadius: 14,
        textAlign: 'center',
        backdropFilter: 'blur(14px)',
        minHeight: 220,
        width: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: c, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{sub}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginTop: 8, letterSpacing: '-0.01em' }}>{t}</div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: '#cbd5e1', marginTop: 12 }}>{d}</div>
      </div>
    </div>
  );
}

window.SceneAudit = SceneAudit;
