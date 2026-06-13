// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 5: Type I vs Type II comparison
// 140s → 170s

function SceneTypes({ start, end }) {
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
            <DeepBg variant="light"/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Anim delay={0.1}><Eyebrow color="#0891b2">04 · Types of Report</Eyebrow></Anim>
              <Anim delay={0.3}>
                <div style={{ marginTop: 20 }}>
                  <Headline text="Type I vs {Type II}." accent="Type II" size={88}/>
                </div>
              </Anim>
              <Anim delay={0.6}>
                <div style={{ marginTop: 14, fontSize: 24, color: '#475569', maxWidth: 1200 }}>
                  Same criteria. Different question. Type I is a snapshot — Type II is a video.
                </div>
              </Anim>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, marginTop: 56,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
            }}>
              <Anim delay={1.0}>
                <TypeCard
                  badge="Type I"
                  tint="#3b82f6"
                  question="Are your controls designed correctly?"
                  window="Point in time"
                  windowSub="One specific date"
                  time="~4–8 weeks"
                  cost="$10k–$25k"
                  use="Fast proof for a first customer deal, or a stepping stone to Type II."
                />
              </Anim>
              <Anim delay={1.3}>
                <TypeCard
                  badge="Type II"
                  tint="#7c3aed"
                  question="Do your controls actually operate over time?"
                  window="3–12 months"
                  windowSub="Observation period"
                  time="~6–12 months"
                  cost="$30k–$80k+"
                  use="What enterprise buyers really want. Renewed every 12 months."
                  highlight
                />
              </Anim>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function TypeCard({ badge, tint, question, window, windowSub, time, cost, use, highlight }) {
  return (
    <div style={{
      position: 'relative',
      padding: '40px 40px 36px',
      background: highlight ? 'linear-gradient(180deg, #fff, #faf5ff)' : '#fff',
      border: `2px solid ${highlight ? tint : tint + '44'}`,
      borderRadius: 24,
      minHeight: 460,
      display: 'flex', flexDirection: 'column',
      boxShadow: highlight ? `0 30px 80px ${tint}25` : `0 14px 40px ${tint}12`,
      overflow: 'hidden',
    }}>
      {highlight && (
        <div style={{
          position: 'absolute', top: 20, right: 20,
          padding: '6px 14px',
          background: tint, color: '#fff',
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          borderRadius: 999,
        }}>Most Common</div>
      )}
      <div style={{
        display: 'inline-flex', alignSelf: 'flex-start',
        padding: '8px 18px',
        background: `${tint}18`, color: tint,
        fontSize: 15, fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        borderRadius: 999,
      }}>{badge}</div>

      <div style={{ marginTop: 20, fontSize: 30, fontWeight: 700, color: '#020617', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
        “{question}”
      </div>

      <div style={{
        marginTop: 28, paddingTop: 24,
        borderTop: '1px solid #e2e8f0',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24,
      }}>
        <StatRow label="Audit Window" big={window} sub={windowSub} tint={tint}/>
        <StatRow label="Timeline" big={time} sub="End-to-end" tint={tint}/>
        <StatRow label="Typical Cost" big={cost} sub="Audit + tooling" tint={tint}/>
        <StatRow label="Renewal" big="Annual" sub="Reports expire" tint={tint}/>
      </div>

      <div style={{
        marginTop: 24, padding: '18px 22px',
        background: `${tint}10`,
        borderLeft: `3px solid ${tint}`,
        borderRadius: 8,
        fontSize: 17, lineHeight: 1.55, color: '#334155',
      }}>
        <span style={{ fontWeight: 700, color: '#020617' }}>Use it when: </span>{use}
      </div>
    </div>
  );
}

function StatRow({ label, big, sub, tint }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700, color: '#020617', letterSpacing: '-0.01em' }}>{big}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

window.SceneTypes = SceneTypes;
