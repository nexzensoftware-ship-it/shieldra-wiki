// Scene 6 — Outro / CTA. ~15s
function SceneOutro() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.8 ? 1 - Math.min(1, (t - (duration - 0.8)) / 0.8) : 1;

  const logoScale = 0.6 + Easing.easeOutBack(Math.min(1, t / 1.0)) * 0.4;
  const headlineOp = t > 0.8 ? Math.min(1, (t - 0.8) / 0.6) : 0;
  const subOp = t > 1.4 ? Math.min(1, (t - 1.4) / 0.5) : 0;
  const ctaOp = t > 2.0 ? Math.min(1, (t - 2.0) / 0.5) : 0;
  const pillarsOp = t > 2.6 ? Math.min(1, (t - 2.6) / 0.6) : 0;

  const pillars = [
    { i: <Icons.Activity size={22}/>, label: 'Dashboard' },
    { i: <Icons.Radar size={22}/>, label: 'Journey' },
    { i: <Icons.Brain size={22}/>, label: 'Intelligence' },
    { i: <Icons.Bot size={22}/>, label: 'AI Agent' },
    { i: <Icons.Lock size={22}/>, label: 'Audit Trail' },
    { i: <Icons.FolderCheck size={22}/>, label: 'Evidence Pack' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp, background: BRAND.surface950 }}>
      <MeshBg tone="dark" />
      <DriftOrbs tone="dark" />
      <Beams count={10} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: 'white', padding: 80 }}>
        <div style={{ transform: `scale(${logoScale})`, marginBottom: 40 }}>
          <ShieldLogo size={140}/>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.brand400, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 20, opacity: headlineOp }}>
          Shieldra
        </div>
        <h1 style={{
          fontSize: 112, fontWeight: 800, letterSpacing: '-0.035em', margin: 0, textAlign: 'center',
          opacity: headlineOp, lineHeight: 1.0,
          backgroundImage: `linear-gradient(120deg, #f8fafc 0%, ${BRAND.brand400} 55%, ${BRAND.violet400} 100%)`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>
          Compliance that<br/>runs itself.
        </h1>

        <div style={{ fontSize: 24, color: BRAND.surface400, marginTop: 32, opacity: subOp, textAlign: 'center', maxWidth: 760 }}>
          Book a 20-minute demo. See your first gap — and its fix — before the call ends.
        </div>

        <div style={{ display: 'flex', gap: 18, marginTop: 48, opacity: ctaOp }}>
          <button style={{
            padding: '18px 36px', borderRadius: 14, border: 'none',
            background: `linear-gradient(90deg, ${BRAND.brand500}, ${BRAND.violet500})`,
            color: 'white', fontSize: 19, fontWeight: 700,
            boxShadow: `0 18px 40px -10px ${BRAND.brand500}88`,
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          }}>
            Start free trial <Icons.ArrowRight size={18}/>
          </button>
          <button style={{
            padding: '18px 36px', borderRadius: 14,
            background: 'transparent', color: 'white',
            border: '1.5px solid rgba(148,163,184,0.35)',
            fontSize: 19, fontWeight: 700, cursor: 'pointer',
          }}>
            Book a demo
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 64, opacity: pillarsOp }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              padding: '14px 22px', borderRadius: 14,
              background: 'rgba(30,41,59,0.6)',
              border: '1px solid rgba(148,163,184,0.2)',
              display: 'flex', alignItems: 'center', gap: 10,
              color: '#e2e8f0', fontSize: 16, fontWeight: 600,
            }}>
              <span style={{ color: BRAND.brand400 }}>{p.i}</span> {p.label}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 48, fontSize: 14, color: BRAND.surface500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          shieldra.io · SOC 2 · HIPAA · ISO 27001
        </div>
      </div>
    </div>
  );
}
window.SceneOutro = SceneOutro;
