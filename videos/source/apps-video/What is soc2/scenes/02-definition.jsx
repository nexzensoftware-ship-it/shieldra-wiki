// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 2: Definition — "SOC 2 is an auditing standard..."
// 25s → 65s

function SceneDefinition({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.6);
        const tOut = localTime > duration - 0.5 ? (localTime - (duration - 0.5)) / 0.5 : 0;
        const opacity = tIn * (1 - tOut);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            opacity,
            padding: '100px 120px',
            display: 'flex', flexDirection: 'column',
          }}>
            <DeepBg variant="light"/>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>
              <Anim delay={0.1}>
                <Eyebrow color="#0891b2">01 · Definition</Eyebrow>
              </Anim>
              <Anim delay={0.3}>
                <Headline text="A report that proves you can be {trusted} with customer data." accent="trusted" size={76}/>
              </Anim>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32,
                marginTop: 24,
              }}>
                <Anim delay={0.9}>
                  <DefCard
                    num="01"
                    label="Created By"
                    big="AICPA"
                    detail="The American Institute of Certified Public Accountants — same folks behind financial audits."
                  />
                </Anim>
                <Anim delay={1.2}>
                  <DefCard
                    num="02"
                    label="Applies To"
                    big="Service Orgs"
                    detail="Any SaaS, cloud, or vendor that stores, processes, or transmits customer data on their behalf."
                    accent="violet"
                  />
                </Anim>
                <Anim delay={1.5}>
                  <DefCard
                    num="03"
                    label="What It Does"
                    big="Independent Audit"
                    detail="A licensed CPA firm tests your controls and issues a signed report your customers can rely on."
                    accent="brand"
                  />
                </Anim>
              </div>

              <Anim delay={2.0}>
                <div style={{
                  marginTop: 32,
                  padding: '28px 36px',
                  background: 'rgba(15,23,42,0.96)',
                  border: '1px solid rgba(34,211,238,0.3)',
                  borderRadius: 16,
                  color: '#f1f5f9',
                  display: 'flex', alignItems: 'center', gap: 20,
                  fontSize: 22, lineHeight: 1.55,
                  boxShadow: '0 20px 60px rgba(6,182,212,0.2)',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: 48, height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ color: '#22d3ee', fontWeight: 600, letterSpacing: '0.05em' }}>In one sentence: </span>
                    SOC 2 is a standardized way to <b style={{ color: '#fff' }}>prove to customers</b> that your systems securely handle their data — verified by an independent auditor.
                  </div>
                </div>
              </Anim>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function DefCard({ num, label, big, detail, accent = 'accent' }) {
  const colors = {
    accent: { border: 'rgba(6,182,212,0.4)', tint: '#0891b2', glow: 'rgba(6,182,212,0.12)' },
    violet: { border: 'rgba(139,92,246,0.4)', tint: '#7c3aed', glow: 'rgba(139,92,246,0.12)' },
    brand:  { border: 'rgba(59,130,246,0.4)', tint: '#2563eb', glow: 'rgba(59,130,246,0.12)' },
  }[accent];
  return (
    <div style={{
      position: 'relative',
      padding: '36px 32px',
      background: '#fff',
      border: `1px solid ${colors.border}`,
      borderRadius: 20,
      boxShadow: '0 10px 40px rgba(15,23,42,0.06)',
      overflow: 'hidden',
      minHeight: 280,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160,
        background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
        borderRadius: '50%',
      }}/>
      <div style={{ position: 'relative', fontSize: 13, fontWeight: 600, letterSpacing: '0.18em', color: colors.tint, textTransform: 'uppercase' }}>
        {num} · {label}
      </div>
      <div style={{
        position: 'relative', marginTop: 14,
        fontSize: 44, fontWeight: 800, color: '#020617',
        letterSpacing: '-0.02em',
      }}>
        {big}
      </div>
      <div style={{
        position: 'relative', marginTop: 16,
        fontSize: 19, lineHeight: 1.55, color: '#475569',
      }}>
        {detail}
      </div>
    </div>
  );
}

// Tiny entry-animate wrapper — uses current sprite's localTime
function Anim({ delay = 0, dy = 24, children, holdOut = true }) {
  const { localTime, duration } = useSprite();
  const t = Math.min(1, Math.max(0, (localTime - delay) / 0.7));
  const eased = 1 - Math.pow(1 - t, 3);
  return (
    <div style={{
      opacity: eased,
      transform: `translateY(${(1 - eased) * dy}px)`,
      transition: 'none',
    }}>
      {children}
    </div>
  );
}

window.SceneDefinition = SceneDefinition;
window.Anim = Anim;
