// Scene 0 — Intro. 0–15s.
// Logo reveal + tagline + brand positioning.

function SceneIntro() {
  const { progress, localTime, duration } = useSprite();
  const t = localTime;

  // Logo: scale + fade in 0-1.2s, sits in center, then slides up when title arrives
  const logoOp = Math.min(1, t / 0.8);
  const logoScale = 0.6 + 0.4 * Easing.easeOutBack(Math.min(1, t / 1.0));
  const logoShiftY = t < 2.0 ? 0 : -Math.min(1, (t - 2.0) / 0.8) * 60;
  const logoSize = 180;

  // Tagline "REGULATORY AI"
  const ebOp = t > 2.4 ? Math.min(1, (t - 2.4) / 0.5) : 0;
  const ebY = (1 - ebOp) * 20;

  // Title: "The regulatory AI that shields your business."
  const titleOp = t > 3.0 ? Math.min(1, (t - 3.0) / 0.6) : 0;
  const titleY = (1 - titleOp) * 30;

  // Subtitle
  const subOp = t > 4.2 ? Math.min(1, (t - 4.2) / 0.5) : 0;

  // Agenda pills appear 7-13s
  const pillsStart = 7.0;
  const pills = [
    { label: 'Dashboard', icon: <Icons.Activity size={22}/> },
    { label: 'Journey', icon: <Icons.Radar size={22}/> },
    { label: 'Intelligence', icon: <Icons.Brain size={22}/> },
    { label: 'AI Agent', icon: <Icons.Bot size={22}/> },
    { label: 'Audit Trail', icon: <Icons.Lock size={22}/> },
    { label: 'Evidence Pack', icon: <Icons.FolderCheck size={22}/> },
  ];

  // Exit fade
  const exitOp = t > duration - 0.8 ? 1 - Math.min(1, (t - (duration - 0.8)) / 0.8) : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg tone="light" />
      <DriftOrbs />
      <Beams count={6} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT,
      }}>
        {/* Logo */}
        <div style={{
          opacity: logoOp,
          transform: `translateY(${logoShiftY}px) scale(${logoScale})`,
          filter: `drop-shadow(0 20px 40px rgba(59,130,246,0.3))`,
          marginBottom: 32,
        }}>
          <img src="assets/logo.svg" width={logoSize} height={logoSize} style={{ display: 'block' }} />
        </div>

        {/* Eyebrow */}
        <div style={{ opacity: ebOp, transform: `translateY(${ebY}px)`, marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 20px',
            borderRadius: 9999,
            background: BRAND.brand50,
            border: `1px solid ${BRAND.brand200}`,
            color: BRAND.brand700,
            fontSize: 18, fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <Icons.Sparkles size={16}/>
            AI-Powered Compliance Platform
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: BRAND.brand400 }} />
            <span style={{ color: BRAND.violet600 }}>Multi-model: Claude · GPT · Gemini</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          opacity: titleOp, transform: `translateY(${titleY}px)`,
          margin: 0,
          fontSize: 108,
          fontWeight: 800,
          letterSpacing: '-0.028em',
          lineHeight: 1.05,
          color: BRAND.surface900,
          textAlign: 'center',
          maxWidth: 1500,
        }}>
          The regulatory AI that{' '}
          <span style={GRADIENT_TEXT}>shields</span>
          <br />your business.
        </h1>

        {/* Subtitle */}
        <p style={{
          opacity: subOp,
          marginTop: 36,
          fontSize: 30,
          lineHeight: 1.5,
          color: BRAND.surface500,
          textAlign: 'center',
          maxWidth: 1100,
          fontWeight: 400,
        }}>
          A guided HIPAA program — <span style={{ color: BRAND.surface800, fontWeight: 600 }}>dashboard, roadmap, AI agent, and evidence pack</span>,
          <br />all in one place.
        </p>

        {/* Agenda pills (7s+) */}
        <div style={{
          marginTop: 80,
          display: 'flex', gap: 16, alignItems: 'center',
        }}>
          {pills.map((p, i) => {
            const delay = pillsStart + i * 0.18;
            const op = t > delay ? Math.min(1, (t - delay) / 0.4) : 0;
            const sc = 0.85 + 0.15 * Easing.easeOutBack(Math.min(1, (t - delay) / 0.5));
            return (
              <div key={p.label} style={{
                opacity: op, transform: `scale(${sc})`,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 22px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.85)',
                border: `1px solid ${BRAND.surface200}`,
                color: BRAND.surface700,
                fontSize: 20, fontWeight: 600,
                boxShadow: '0 8px 24px -8px rgba(15,23,42,0.12)',
                backdropFilter: 'blur(12px)',
              }}>
                <span style={{ color: BRAND.brand600 }}>{p.icon}</span>
                {p.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.SceneIntro = SceneIntro;
