// Scene 3: Definition of HIPAA — acronym breakdown (30-70s, dur 40s)
// Scene 4: Why HIPAA exists / PHI (70-115s, dur 45s)

function SceneDefinition() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrowOp = clamp(t/0.3, 0, 1);
  const headlineOp = clamp((t-0.2)/0.5, 0, 1);
  const yearOp = clamp((t-0.8)/0.4, 0, 1);

  // Acronym letters stagger in starting at t=3s
  const letters = [
    { L: 'H', word: 'Health', color: '#60a5fa' },
    { L: 'I', word: 'Insurance', color: '#22d3ee' },
    { L: 'P', word: 'Portability', color: '#a78bfa' },
    { L: 'A', word: 'and', color: '#94a3b8', muted: true },
    { L: 'A', word: 'Accountability', color: '#60a5fa' },
    { L: '', word: 'Act', color: '#22d3ee', appended: true },
  ];

  // Bottom paragraph
  const paraOp = clamp((t-3.5)/0.5, 0, 1);

  const exit = t > duration - 1 ? 1 - clamp((t - (duration - 1))/1, 0, 1) : 1;

  return (
    <DarkCanvas>
      <div style={{
        position:'absolute', inset:0, padding:'100px 120px',
        display:'flex', flexDirection:'column', justifyContent:'center',
        opacity: exit,
      }}>
        <Eyebrow style={{ opacity: eyebrowOp, marginBottom: 28, fontSize: 24 }}>
          Chapter 01 · Definition
        </Eyebrow>

        <div style={{
          fontSize: 92, fontWeight: 800, lineHeight: 1.1, letterSpacing:'-0.03em',
          color:'white', maxWidth: 1500, marginBottom: 40,
          opacity: headlineOp, transform: `translateY(${(1-headlineOp)*20}px)`,
        }}>
          A U.S. federal law that protects{' '}
          <GText>sensitive patient health information</GText>.
        </div>

        <div style={{
          display:'inline-flex', alignItems:'center', gap: 24,
          padding:'16px 28px', background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(148,163,184,0.2)', borderRadius:999,
          width:'fit-content', marginBottom: 64,
          opacity: yearOp,
        }}>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize: 28,
            fontWeight: 700, color:'#67e8f9',
          }}>
            1996
          </div>
          <div style={{ width: 1, height: 28, background:'rgba(148,163,184,0.3)' }}/>
          <div style={{ fontSize: 22, color:'rgba(226,232,240,0.8)' }}>
            Signed by President Bill Clinton
          </div>
        </div>

        {/* Acronym breakdown */}
        <div style={{ display:'flex', gap: 20, alignItems:'flex-start', marginBottom: 48 }}>
          {letters.map((l, i) => {
            const op = clamp((t - (1.2 + i*0.18))/0.35, 0, 1);
            if (l.appended) {
              return (
                <div key={i} style={{
                  opacity: op, transform:`translateY(${(1-op)*24}px)`,
                  display:'flex', flexDirection:'column', gap: 6,
                  alignSelf:'flex-end', paddingBottom: 12,
                }}>
                  <div style={{ fontSize: 42, fontWeight: 700, color: l.color, letterSpacing:'-0.02em' }}>
                    {l.word}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} style={{
                opacity: op, transform:`translateY(${(1-op)*30}px)`,
                display:'flex', flexDirection:'column', alignItems:'flex-start',
              }}>
                <div style={{
                  fontSize: 160, fontWeight: 900, lineHeight: 1,
                  color: l.muted ? 'rgba(148,163,184,0.5)' : l.color,
                  letterSpacing:'-0.05em',
                  textShadow: l.muted ? 'none' : `0 0 40px ${l.color}40`,
                }}>
                  {l.L}
                </div>
                <div style={{
                  fontSize: 28, fontWeight: 600,
                  color: l.muted ? 'rgba(148,163,184,0.6)' : 'rgba(226,232,240,0.95)',
                  marginTop: 6, letterSpacing:'-0.01em',
                }}>
                  {l.word}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          fontSize: 32, lineHeight: 1.55, color:'rgba(203,213,225,0.88)',
          maxWidth: 1500, opacity: paraOp,
          transform:`translateY(${(1-paraOp)*16}px)`,
          fontWeight: 400,
        }}>
          HIPAA sets the national standard for{' '}
          <span style={{ color:'white', fontWeight:600 }}>how patient data is stored, transmitted, and shared</span>
          {' '}— and holds every healthcare organization legally accountable for protecting it.
        </div>
      </div>
    </DarkCanvas>
  );
}


// Scene 4: PHI (Protected Health Information) — what is actually protected
function ScenePHI() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  // 8 PHI items animate in
  const items = [
    { ic: '◉', label: 'Names', detail: 'Full, first, last' },
    { ic: '▦', label: 'Dates', detail: 'Birth, admission, discharge' },
    { ic: '☏', label: 'Phone & Fax', detail: 'Any direct contact' },
    { ic: '✉', label: 'Email Addresses', detail: 'Personal & work' },
    { ic: '#', label: 'SSN & MRN', detail: 'Any unique identifier' },
    { ic: '⚕', label: 'Medical Records', detail: 'Diagnoses, labs, notes' },
    { ic: '◈', label: 'Biometrics', detail: 'Fingerprints, voice, face' },
    { ic: '◎', label: 'Images', detail: 'Photos, X-rays, scans' },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 02 · Protected Health Information
        </Eyebrow>

        <div style={{
          fontSize: 96, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          What counts as <GText>PHI</GText>?
        </div>

        <div style={{
          fontSize: 30, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 20, maxWidth: 1400, opacity: sub,
          transform:`translateY(${(1-sub)*12}px)`,
        }}>
          HIPAA protects{' '}
          <span style={{ color:'white', fontWeight:600 }}>18 specific identifiers</span>
          {' '}— anything that can link a person to their health record. Here are the most common:
        </div>

        {/* Grid */}
        <div style={{
          marginTop: 60, display:'grid',
          gridTemplateColumns:'repeat(4, 1fr)',
          gap: 24, flex: 1, alignContent:'start',
        }}>
          {items.map((it, i) => {
            const op = clamp((t - (1.5 + i*0.12))/0.3, 0, 1);
            const col = i * 94 + 24;
            return (
              <div key={i} style={{
                padding: 28,
                background:'rgba(15,23,42,0.55)',
                border:'1px solid rgba(148,163,184,0.22)',
                borderRadius: 20,
                opacity: op, transform:`translateY(${(1-op)*24}px) scale(${0.96 + op*0.04})`,
                backdropFilter:'blur(20px)',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background:'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.15))',
                  border:'1px solid rgba(34,211,238,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 30, color:'#67e8f9', marginBottom: 18,
                }}>{it.ic}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color:'white', marginBottom: 6 }}>
                  {it.label}
                </div>
                <div style={{ fontSize: 18, color:'rgba(148,163,184,0.85)', lineHeight:1.4 }}>
                  {it.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer stat */}
        {(() => {
          const op = clamp((t - 3.5)/0.4, 0, 1);
          return (
            <div style={{
              marginTop: 36, display:'flex', alignItems:'center', gap: 20,
              padding:'20px 32px',
              background:'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))',
              border:'1px solid rgba(139,92,246,0.3)',
              borderRadius: 20, width:'fit-content',
              opacity: op, transform:`translateY(${(1-op)*16}px)`,
            }}>
              <div style={{ fontSize: 52, fontWeight: 900, color:'#a78bfa',
                fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.02em' }}>
                <Counter to={18} duration={1.4} />
              </div>
              <div style={{ fontSize: 24, color:'rgba(226,232,240,0.9)', lineHeight:1.3 }}>
                distinct identifiers<br/>
                <span style={{ color:'rgba(148,163,184,0.8)', fontSize: 18 }}>make data "PHI" under HIPAA</span>
              </div>
            </div>
          );
        })()}
      </div>
    </DarkCanvas>
  );
}

Object.assign(window, { SceneDefinition, ScenePHI });
