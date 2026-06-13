// Scenes 1 & 9: Shieldra logo video bookends + Title scene

// Scene1: Logo video intro (0-8s)
function SceneIntroLogo() {
  const { localTime, progress } = useSprite();
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Sync video to localTime
    const target = Math.min(localTime, v.duration || 8);
    if (Math.abs(v.currentTime - target) > 0.15) {
      try { v.currentTime = target; } catch {}
    }
  }, [localTime]);

  // Fade out near the end
  const fade = localTime > 7 ? 1 - (localTime - 7) / 1 : 1;

  return (
    <div style={{ position:'absolute', inset:0, background:'#000', opacity: fade }}>
      <video
        ref={videoRef}
        src="assets/shieldra-logo.mp4"
        muted
        playsInline
        autoPlay
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
      />
    </div>
  );
}

// Scene9: Outro logo (reuse video, plus overlay text)
function SceneOutroLogo() {
  const { localTime } = useSprite();
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const target = Math.min(localTime, v.duration || 8);
    if (Math.abs(v.currentTime - target) > 0.15) {
      try { v.currentTime = target; } catch {}
    }
  }, [localTime]);

  const overlayOp = localTime > 1.5 ? Math.min(1, (localTime - 1.5) / 1) : 0;

  return (
    <div style={{ position:'absolute', inset:0, background:'#000' }}>
      <video
        ref={videoRef}
        src="assets/shieldra-logo.mp4"
        muted
        playsInline
        autoPlay
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', opacity: 0.55 }}
      />
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end',
        paddingBottom: 100,
        opacity: overlayOp,
        transition: 'opacity 400ms',
      }}>
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing:'-0.02em', color:'white',
          textAlign:'center', textShadow:'0 4px 30px rgba(0,0,0,0.6)' }}>
          The regulatory AI that{' '}
          <GText>shields</GText>{' '}your business.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color:'rgba(226,232,240,0.9)', fontWeight: 500 }}>
          shieldra.com &nbsp;·&nbsp; Book a Demo
        </div>
      </div>
    </div>
  );
}

// Scene2: Title — "What is HIPAA?"
function SceneTitle() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const pill = clamp(t/0.3, 0, 1);
  const title1 = clamp((t-0.2)/0.4, 0, 1);
  const title2 = clamp((t-0.5)/0.5, 0, 1);
  const sub = clamp((t-1.1)/0.5, 0, 1);
  const tagline = clamp((t-1.8)/0.5, 0, 1);

  const exit = t > duration - 0.6 ? 1 - clamp((t - (duration - 0.6))/0.6, 0, 1) : 1;

  return (
    <DarkCanvas>
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'0 120px', textAlign:'center',
        opacity: exit,
      }}>
        {/* Pill */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap: 12,
          padding:'14px 28px',
          background:'rgba(34,211,238,0.1)',
          border:'1px solid rgba(34,211,238,0.3)',
          borderRadius:999,
          color:'#67e8f9',
          fontSize: 20, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase',
          opacity: pill,
          transform:`translateY(${(1-pill)*20}px)`,
          marginBottom: 48,
        }}>
          <span style={{ width:10, height:10, borderRadius:5, background:'#22d3ee',
            boxShadow:'0 0 12px #22d3ee' }}/>
          A Compliance Primer · 5 min
        </div>

        {/* Title Line 1 */}
        <div style={{
          fontSize: 148, fontWeight: 900, letterSpacing:'-0.035em', lineHeight:1,
          color:'white',
          opacity: title1,
          transform:`translateY(${(1-title1)*32}px)`,
          marginBottom: 8,
        }}>
          What is
        </div>

        {/* Title Line 2 — Gradient HIPAA */}
        <div style={{
          fontSize: 220, fontWeight: 900, letterSpacing:'-0.04em', lineHeight:1,
          opacity: title2,
          transform:`translateY(${(1-title2)*32}px) scale(${0.94 + title2*0.06})`,
        }}>
          <GText>HIPAA</GText>
          <span style={{ color:'white' }}>?</span>
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: 40,
          fontSize: 34, fontWeight: 400, color:'rgba(226,232,240,0.82)',
          opacity: sub,
          transform:`translateY(${(1-sub)*16}px)`,
          lineHeight: 1.4, maxWidth: 1200,
        }}>
          Everything your business needs to know about{' '}
          <span style={{ fontWeight:600, color:'#67e8f9' }}>healthcare's most important privacy law</span>.
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 80,
          display:'inline-flex', alignItems:'center', gap: 20,
          padding:'18px 32px',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius: 999,
          opacity: tagline,
          transform:`translateY(${(1-tagline)*20}px)`,
        }}>
          <img src="assets/icon-white.svg" width="40" height="40" alt=""/>
          <div style={{ fontSize: 22, color:'rgba(226,232,240,0.9)', fontWeight:500 }}>
            Presented by <span style={{ color:'white', fontWeight:700 }}>Shieldra</span>
          </div>
        </div>
      </div>
    </DarkCanvas>
  );
}

Object.assign(window, { SceneIntroLogo, SceneOutroLogo, SceneTitle });
