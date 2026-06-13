// Scene — HIPAA Compliance Journey. Phase tree + progress ring.
function SceneJourney() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  const pct = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.2) / 2.0))) * 78);
  const stepsDone = Math.round(Easing.easeOutCubic(Math.max(0, Math.min(1, (t - 1.4) / 1.8))) * 9);

  const phases = [
    { n: 1, title: 'Understand HIPAA',  sub: 'Know the rules and consequences before you start', done: '1/1', status: 'done',    at: 2.0, icon: <Icons.FileSearch size={18}/>, tint: BRAND.violet50 },
    { n: 2, title: 'Set the Foundation',sub: 'Assign ownership and assess your starting point',  done: '2/2', status: 'done',    at: 2.3, icon: <Icons.Bot size={18}/>,        tint: BRAND.brand50 },
    { n: 3, title: 'Build Your Policies',sub: 'Create the policies and procedures that protect patient data', done: '5/6', status: 'active', at: 2.6, icon: <Icons.FileSearch size={18}/>, tint: '#fef3c7' },
    { n: 4, title: 'Secure Systems & Data', sub: 'Technical safeguards for ePHI',                 done: '10/18', status: 'active', at: 2.9, icon: <Icons.Lock size={18}/>,       tint: BRAND.accent50 },
    { n: 5, title: 'Train Your Workforce', sub: 'HIPAA awareness and attestations',               done: '1/1', status: 'done', at: 3.2, icon: <Icons.GraduationCap size={18}/>, tint: BRAND.violet50 },
    { n: 6, title: 'Plan for Data Breaches', sub: 'Incident response and notification procedures', done: '6/6', status: 'done', at: 3.5, icon: <Icons.AlertTriangle size={18}/>, tint: '#ffedd5' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 620px', paddingTop: 60 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="violet"
            eyebrow={{ icon: <Icons.Radar size={16}/>, label: 'Compliance Journey' }}
            title="A guided path, not a"
            gradientWord="checklist."
            subtitle="13 steps. 37 requirements. Shieldra walks you through HIPAA phase by phase — so you always know exactly what's next."
          />
          <div style={{ marginTop: 40, display: 'flex', gap: 32, opacity: t > 2 ? 1 : 0 }}>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.surface900, fontFamily: MONO }}>13</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phases</div></div>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.brand600, fontFamily: MONO }}>37</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Requirements</div></div>
            <div><div style={{ fontSize: 52, fontWeight: 800, color: BRAND.violet600, fontFamily: MONO }}>6</div><div style={{ fontSize: 12, fontWeight: 700, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>HIPAA rules</div></div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, opacity: t > 1 ? 1 : 0 }}>
          <GlassCard style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={60} cy={60} r={52} fill="none" stroke={BRAND.surface200} strokeWidth={10}/>
                  <circle cx={60} cy={60} r={52} fill="none" stroke="#f59e0b" strokeWidth={10} strokeLinecap="round" strokeDasharray={`${(pct/100)*327} 327`}/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.surface900, fontFamily: MONO }}>{pct}<span style={{ fontSize: 14, color: '#f59e0b' }}>%</span></div>
                </div>
                <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: 9999 }}>GOOD</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: BRAND.surface900 }}>{stepsDone} of 13 <span style={{ color: BRAND.surface500, fontWeight: 500 }}>steps complete</span></div>
                <div style={{ fontSize: 12, color: BRAND.surface500, marginTop: 2 }}>29 of 37 requirements covered</div>
                <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: BRAND.surface200, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: BRAND.brand600 }}/>
                </div>
                <div style={{ fontSize: 11, color: BRAND.surface500, marginTop: 6 }}>Almost there. Just a few more steps to go.</div>
              </div>
            </div>
          </GlassCard>

          {phases.map((p, i) => {
            const op = t > p.at ? Math.min(1, (t - p.at) / 0.35) : 0;
            const dx = (1 - op) * 24;
            const done = p.status === 'done';
            const active = p.status === 'active';
            return (
              <div key={p.n} style={{ opacity: op, transform: `translateX(${dx}px)`, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: done ? '#f0fdf4' : active ? '#fef3c7' : 'white',
                  border: `2px solid ${done ? BRAND.success : active ? '#f59e0b' : BRAND.surface300}`,
                  color: done ? BRAND.success : active ? '#d97706' : BRAND.surface500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {done ? <Icons.Check size={14}/> : p.n}
                </div>
                <div style={{ flex: 1, padding: '10px 16px', borderRadius: 12, background: 'white', border: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: p.tint, color: BRAND.surface700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 9, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>PHASE {p.n}</span>
                      {done && <span style={{ fontSize: 9, fontWeight: 700, color: 'white', background: BRAND.success, padding: '2px 7px', borderRadius: 9999 }}>✓ Complete</span>}
                      {active && <span style={{ fontSize: 9, fontWeight: 700, color: '#d97706', background: '#fef3c7', padding: '2px 7px', borderRadius: 9999 }}>In progress</span>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.surface900, marginTop: 1 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: BRAND.surface500 }}>{p.sub}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: BRAND.surface800, fontFamily: MONO }}>{p.done}<div style={{ fontSize: 9, color: BRAND.surface500, fontWeight: 500, textAlign: 'right' }}>steps</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
window.SceneJourney = SceneJourney;
