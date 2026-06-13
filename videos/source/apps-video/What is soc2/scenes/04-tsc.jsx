// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 4: Trust Services Criteria — 5 pillars
// 95s → 140s

function SceneTSC({ start, end }) {
  const criteria = [
    { k: 'Security', sub: '(Required)', c: '#22d3ee', desc: 'Systems are protected against unauthorized access. The "Common Criteria" — every SOC 2 includes this.', icon: 'shield' },
    { k: 'Availability', sub: '(Optional)', c: '#3b82f6', desc: 'Systems are available for operation and use as committed. SLAs, uptime, disaster recovery.', icon: 'activity' },
    { k: 'Confidentiality', sub: '(Optional)', c: '#8b5cf6', desc: 'Information designated as confidential is protected — NDAs, encryption, access controls.', icon: 'lock' },
    { k: 'Processing Integrity', sub: '(Optional)', c: '#06b6d4', desc: 'Processing is complete, valid, accurate, timely, and authorized. Think: payments, calculations.', icon: 'check' },
    { k: 'Privacy', sub: '(Optional)', c: '#a855f7', desc: 'Personal information is collected, used, retained, and disposed of in line with your privacy notice.', icon: 'user' },
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
            padding: '90px 100px',
          }}>
            <DeepBg variant="light"/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Anim delay={0.1}><Eyebrow color="#0891b2">03 · The Framework</Eyebrow></Anim>
              <Anim delay={0.3}>
                <div style={{ marginTop: 20 }}>
                  <Headline text="Five {Trust Services Criteria}." accent="Trust Services Criteria" size={76}/>
                </div>
              </Anim>
              <Anim delay={0.6}>
                <div style={{ marginTop: 14, fontSize: 24, color: '#475569', maxWidth: 1200 }}>
                  You pick which apply to your business. Security is mandatory — the other four are scoped to what you actually do.
                </div>
              </Anim>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, marginTop: 56,
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20,
            }}>
              {criteria.map((c, i) => (
                <Anim key={i} delay={1.0 + i * 0.25}>
                  <TSCCard {...c} required={i === 0}/>
                </Anim>
              ))}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function TSCCard({ k, sub, c, desc, icon, required }) {
  const iconSvg = {
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    check: <><path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></>,
  }[icon];

  return (
    <div style={{
      position: 'relative',
      padding: '32px 24px 28px',
      background: '#fff',
      border: `1.5px solid ${c}44`,
      borderRadius: 18,
      minHeight: 380,
      display: 'flex', flexDirection: 'column',
      boxShadow: `0 12px 40px ${c}18`,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${c}, ${c}88)`,
      }}/>
      {required && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          padding: '4px 10px',
          background: c, color: '#fff',
          fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          borderRadius: 999,
        }}>Required</div>
      )}
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: `${c}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {iconSvg}
        </svg>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#020617', letterSpacing: '-0.02em' }}>{k}</div>
      <div style={{ fontSize: 13, color: c, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{sub}</div>
      <div style={{ marginTop: 14, fontSize: 16, lineHeight: 1.55, color: '#475569', flex: 1 }}>{desc}</div>
    </div>
  );
}

window.SceneTSC = SceneTSC;
