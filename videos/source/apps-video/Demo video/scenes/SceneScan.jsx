// Scene 1 — AI Document Scanner. ~25s
function SceneScan() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.8 ? 1 - Math.min(1, (t - (duration - 0.8)) / 0.8) : 1;

  // Files list, each animates in
  const files = [
    { name: 'privacy-policy-v3.pdf', size: '2.4 MB', items: 73 },
    { name: 'BAA_Template.docx',      size: '184 KB', items: 32 },
    { name: 'Risk_Assessment.xlsx',   size: '512 KB', items: 48 },
    { name: 'Access_Control_Matrix.pdf', size: '1.1 MB', items: 61 },
  ];

  // Progress ramps 3.5s -> 9.5s, 0 -> 87%
  const scanStart = 3.5, scanEnd = 10.0;
  const scanP = Math.max(0, Math.min(1, (t - scanStart) / (scanEnd - scanStart)));
  const scanPct = Math.round(scanP * 87);

  // Detected items appear progressively
  const detected = [
    { label: 'PHI Data Handling Policy', at: 5.5 },
    { label: 'Access Control Matrix',    at: 6.5 },
    { label: 'Encryption Standards (AES-256)', at: 7.5 },
    { label: 'Breach Notification Procedure',  at: 8.5 },
    { label: 'Employee Training Records',      at: 9.5 },
  ];

  // Gaps detected chip (11s+)
  const gapsOp = t > 11 ? Math.min(1, (t - 11) / 0.6) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg />
      <DriftOrbs />

      <div style={{ position: 'absolute', inset: 0, padding: '80px 100px', fontFamily: FONT, display: 'flex', gap: 60 }}>
        {/* LEFT — Title + eyebrow */}
        <div style={{ flex: '0 0 700px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <SceneTitle
            progress={Math.min(1, t / 2.0)}
            eyebrow={{ icon: <Icons.FileSearch size={16}/>, label: 'AI Document Scanner' }}
            color="brand"
            title="Scan every policy in"
            gradientWord="seconds."
            subtitle="Upload any policy, procedure, or BAA. Shieldra's AI cross-references 73 HIPAA requirements, flags missing controls, and maps evidence — instantly."
          />
          {/* Stat callouts */}
          <div style={{
            marginTop: 48, display: 'flex', gap: 32,
            opacity: t > 2.5 ? Math.min(1, (t - 2.5) / 0.6) : 0,
          }}>
            <div>
              <div style={{ fontSize: 56, fontWeight: 800, color: BRAND.surface900, letterSpacing: '-0.02em', fontFamily: MONO }}>73</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>HIPAA requirements mapped</div>
            </div>
            <div>
              <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: MONO,
                backgroundImage: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>15s</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Average scan time</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Glass card mockup */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GlassCard style={{ width: 820, padding: 40, opacity: t > 1.4 ? Math.min(1, (t - 1.4) / 0.6) : 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: BRAND.brand50, color: BRAND.brand600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.FileSearch size={22}/>
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.surface900 }}>Document Scanner</div>
                  <div style={{ fontSize: 14, color: BRAND.surface500 }}>4 files · 4.2 MB total</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: BRAND.brand600, fontWeight: 600 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2.5px solid ${BRAND.brand600}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                AI analyzing...
              </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Scan Progress</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: BRAND.brand600, fontFamily: MONO }}>{scanPct}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: BRAND.surface200, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${scanPct}%`,
                  background: `linear-gradient(90deg, ${BRAND.brand500}, ${BRAND.violet500})`,
                  transition: 'width 0.1s linear',
                  boxShadow: `0 0 12px rgba(59,130,246,0.5)`,
                }} />
              </div>
            </div>

            {/* Files */}
            <div style={{ marginBottom: 24 }}>
              {files.map((f, i) => {
                const at = 1.8 + i * 0.3;
                const op = t > at ? Math.min(1, (t - at) / 0.4) : 0;
                const dx = (1 - op) * 20;
                const done = t > at + 0.8;
                return (
                  <div key={f.name} style={{
                    opacity: op, transform: `translateX(${dx}px)`,
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', marginBottom: 8,
                    background: BRAND.surface50, borderRadius: 12,
                    border: `1px solid ${BRAND.surface200}`,
                  }}>
                    <div style={{ color: BRAND.brand600 }}><Icons.FileSearch size={18}/></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.surface800, fontFamily: MONO }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: BRAND.surface500 }}>{f.size} · {f.items} controls detected</div>
                    </div>
                    {done && (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: BRAND.accent100, color: BRAND.accent600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icons.Check size={14}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detected items */}
            <div>
              <div style={{ fontSize: 13, color: BRAND.surface500, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 12 }}>Detected Controls</div>
              {detected.map((d, i) => {
                const op = t > d.at ? Math.min(1, (t - d.at) / 0.4) : 0;
                const dx = (1 - op) * -12;
                return (
                  <div key={d.label} style={{
                    opacity: op, transform: `translateX(${dx}px)`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    fontSize: 15, color: BRAND.surface700,
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: BRAND.accent100, color: BRAND.accent600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icons.Check size={13}/>
                    </div>
                    {d.label}
                  </div>
                );
              })}
            </div>

            {/* Gaps banner */}
            <div style={{
              opacity: gapsOp,
              marginTop: 20,
              padding: '14px 18px',
              borderRadius: 14,
              background: `linear-gradient(90deg, ${BRAND.violet50}, ${BRAND.brand50})`,
              border: `1px solid ${BRAND.brand200}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'white', color: BRAND.violet600, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(15,23,42,0.08)' }}>
                <Icons.AlertTriangle size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: BRAND.surface900 }}>3 compliance gaps identified</div>
                <div style={{ fontSize: 13, color: BRAND.surface600 }}>Encryption at rest · Audit log retention · BAA subcontractor clause</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
window.SceneScan = SceneScan;
