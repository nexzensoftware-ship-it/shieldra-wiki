// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 8: Outro — CTA before logo video
// 222s → 230s (then logo video takes us to 240s)

function SceneOutro({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.6);
        const tOut = localTime > duration - 0.5 ? (localTime - (duration - 0.5)) / 0.5 : 0;
        const opacity = tIn * (1 - tOut);

        return (
          <div style={{
            position: 'absolute', inset: 0, opacity,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '0 100px',
          }}>
            <DeepBg variant="dark"/>

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Anim delay={0.1}>
                <LogoMark size={96}/>
              </Anim>
              <Anim delay={0.35}>
                <div style={{ marginTop: 32 }}>
                  <div style={{
                    fontSize: 72, fontWeight: 800, color: '#f1f5f9',
                    letterSpacing: '-0.03em', lineHeight: 1.05,
                  }}>
                    Get SOC 2 ready in{' '}
                    <span style={{
                      background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient-shift 8s ease infinite',
                    }}>weeks, not years.</span>
                  </div>
                </div>
              </Anim>
              <Anim delay={0.7}>
                <div style={{
                  marginTop: 24, fontSize: 24, color: '#cbd5e1', maxWidth: 900,
                  margin: '24px auto 0',
                }}>
                  Shieldra automates the evidence, the monitoring, and the audit prep — so you can ship.
                </div>
              </Anim>
              <Anim delay={1.1}>
                <div style={{
                  marginTop: 48,
                  display: 'flex', gap: 16, justifyContent: 'center',
                }}>
                  <div style={{
                    padding: '20px 40px',
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-shift 8s ease infinite',
                    color: '#fff', fontSize: 20, fontWeight: 600,
                    borderRadius: 999,
                    letterSpacing: '0.02em',
                    boxShadow: '0 20px 60px rgba(37,99,235,0.4)',
                  }}>Start Free Trial</div>
                  <div style={{
                    padding: '20px 40px',
                    background: 'rgba(148,163,184,0.1)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    color: '#e2e8f0', fontSize: 20, fontWeight: 600,
                    borderRadius: 999,
                    backdropFilter: 'blur(10px)',
                  }}>Book a Demo</div>
                </div>
              </Anim>
              <Anim delay={1.5}>
                <div style={{
                  marginTop: 40,
                  fontSize: 18, color: '#94a3b8',
                  letterSpacing: '0.05em',
                }}>
                  shieldra.com · the regulatory AI that shields your business
                </div>
              </Anim>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

window.SceneOutro = SceneOutro;
