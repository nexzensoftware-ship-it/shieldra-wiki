// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 1: Hook — "What is SOC 2?"
// 10s → 25s

function SceneHook({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.8);
        const tOut = localTime > duration - 0.6 ? (localTime - (duration - 0.6)) / 0.6 : 0;
        const opacity = tIn * (1 - tOut);
        const eyebrowT = Math.min(1, Math.max(0, (localTime - 0.2) / 0.6));
        const headlineT = Math.min(1, Math.max(0, (localTime - 0.6) / 0.8));
        const subT = Math.min(1, Math.max(0, (localTime - 1.4) / 0.8));
        const pulse = 1 + Math.sin(localTime * 2) * 0.03;

        return (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity,
            padding: '0 120px',
          }}>
            <DeepBg variant="light"/>

            {/* Big shield halo */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 700, height: 700,
              transform: `translate(-50%, -50%) scale(${pulse})`,
              background: 'radial-gradient(circle, rgba(6,182,212,0.12), rgba(59,130,246,0.08) 40%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(20px)',
            }}/>

            <div style={{
              position: 'relative', zIndex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 40,
              opacity: eyebrowT,
              transform: `translateY(${(1 - eyebrowT) * 20}px)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <LogoMark size={56}/>
                <div style={{ 
                  fontSize: 22, fontWeight: 700, 
                  letterSpacing: '0.02em', color: '#0f172a',
                }}>Shieldra</div>
              </div>
              <Eyebrow color="#0891b2">Enterprise Compliance · Explained</Eyebrow>
            </div>

            <div style={{
              position: 'relative', zIndex: 1,
              marginTop: 44,
              opacity: headlineT,
              transform: `translateY(${(1 - headlineT) * 32}px)`,
              textAlign: 'center',
            }}>
              <Headline text="What is {SOC 2}?" accent="SOC 2" size={180}/>
            </div>

            <div style={{
              position: 'relative', zIndex: 1,
              marginTop: 40,
              maxWidth: 1100,
              fontSize: 32, lineHeight: 1.5,
              color: '#475569',
              textAlign: 'center',
              textWrap: 'balance',
              opacity: subT,
              transform: `translateY(${(1 - subT) * 20}px)`,
            }}>
              The compliance standard every SaaS founder hears about — and almost nobody can explain in one sentence.
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

window.SceneHook = SceneHook;
