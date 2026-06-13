// Additional scenes: HIPAA Rules, Real Breaches, Patient Rights

function SceneRules() {
  const { localTime } = useSprite();
  const t = localTime;
  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  const rules = [
    { n:'01', name:'Privacy Rule', color:'#60a5fa',
      desc:'Sets the national standard for who can see PHI and how it can be used.',
      points:['Minimum necessary use','Patient access rights','Disclosure tracking'] },
    { n:'02', name:'Security Rule', color:'#22d3ee',
      desc:'Requires administrative, physical, and technical safeguards for electronic PHI.',
      points:['Access controls','Encryption at rest & transit','Audit logs'] },
    { n:'03', name:'Breach Notification', color:'#a78bfa',
      desc:'Mandates disclosure to patients, HHS, and sometimes the media within 60 days.',
      points:['Individual notice','HHS reporting','Media if > 500 affected'] },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 03 · The Three Rules
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          HIPAA stands on <GText>three pillars</GText>.
        </div>
        <div style={{
          fontSize: 26, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 16, opacity: sub, maxWidth: 1400,
        }}>
          Every rule works together — miss one, and the whole framework falls over.
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 28, marginTop: 50, flex:1 }}>
          {rules.map((r, i) => {
            const op = clamp((t - (1.4 + i*0.25))/0.4, 0, 1);
            return (
              <div key={i} style={{
                padding: 32,
                background:'rgba(15,23,42,0.6)',
                border:`1px solid ${r.color}45`,
                borderRadius: 22,
                opacity: op, transform:`translateY(${(1-op)*24}px)`,
                backdropFilter:'blur(20px)', position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
                  background: r.color }}/>
                <div style={{ fontSize: 72, fontWeight: 900, color: r.color,
                  fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.03em',
                  opacity: 0.35, lineHeight: 1 }}>{r.n}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color:'white',
                  letterSpacing:'-0.02em', marginTop: 12, marginBottom: 14 }}>{r.name}</div>
                <div style={{ fontSize: 19, color:'rgba(203,213,225,0.85)', lineHeight:1.5, marginBottom: 24 }}>
                  {r.desc}
                </div>
                {r.points.map((p, j) => (
                  <div key={j} style={{
                    display:'flex', alignItems:'center', gap: 12, padding:'10px 0',
                    borderTop: j===0 ? `1px solid ${r.color}30` : 'none',
                    borderBottom: `1px solid ${r.color}30`,
                  }}>
                    <div style={{ width: 6, height:6, borderRadius:3, background: r.color,
                      boxShadow:`0 0 8px ${r.color}` }}/>
                    <div style={{ fontSize: 18, color:'rgba(226,232,240,0.9)', fontWeight: 500 }}>{p}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </DarkCanvas>
  );
}

function SceneBreaches() {
  const { localTime } = useSprite();
  const t = localTime;
  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);

  const cases = [
    { org:'Anthem', year:'2015', amount:'$16M', records:'78.8M', note:'Largest HIPAA settlement · phishing attack on employee credentials' },
    { org:'Premera Blue Cross', year:'2020', amount:'$6.85M', records:'10.4M', note:'Unpatched server exploited · 9-month undetected intrusion' },
    { org:'Excellus Health', year:'2021', amount:'$5.1M', records:'9.3M', note:'Missing risk analysis · inadequate access controls' },
    { org:'Advocate Health', year:'2016', amount:'$5.55M', records:'4M', note:'Stolen unencrypted laptops · weak physical safeguards' },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 06 · Real Enforcement
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          When OCR audits, <GText>no one is too big</GText>.
        </div>

        <div style={{ marginTop: 40, display:'flex', flexDirection:'column', gap: 16, flex:1 }}>
          {cases.map((c, i) => {
            const op = clamp((t - (1 + i*0.25))/0.4, 0, 1);
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap: 24,
                padding: '24px 32px',
                background:'rgba(15,23,42,0.6)',
                border:'1px solid rgba(239,68,68,0.25)',
                borderRadius: 18,
                opacity: op, transform:`translateX(${(1-op)*-20}px)`,
                backdropFilter:'blur(20px)',
              }}>
                <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize: 20,
                  color:'#f87171', fontWeight: 700, width: 80 }}>{c.year}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color:'white',
                    letterSpacing:'-0.01em' }}>{c.org}</div>
                  <div style={{ fontSize: 17, color:'rgba(148,163,184,0.85)', marginTop: 4 }}>{c.note}</div>
                </div>
                <div style={{ textAlign:'right', minWidth: 140 }}>
                  <div style={{ fontSize: 12, color:'rgba(148,163,184,0.7)', fontWeight:700,
                    letterSpacing:'0.15em', textTransform:'uppercase' }}>Records</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color:'white',
                    fontFamily:'JetBrains Mono, monospace' }}>{c.records}</div>
                </div>
                <div style={{ textAlign:'right', minWidth: 160 }}>
                  <div style={{ fontSize: 12, color:'rgba(148,163,184,0.7)', fontWeight:700,
                    letterSpacing:'0.15em', textTransform:'uppercase' }}>Penalty</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color:'#ef4444',
                    fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.02em' }}>{c.amount}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DarkCanvas>
  );
}

function ScenePatientRights() {
  const { localTime } = useSprite();
  const t = localTime;
  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  const rights = [
    { ic:'👁', label:'Access', desc:'Inspect and copy your own records — within 30 days.' },
    { ic:'✎', label:'Amend', desc:'Request corrections to inaccurate information.' },
    { ic:'⊘', label:'Restrict', desc:'Limit who sees your PHI and for what purpose.' },
    { ic:'⇢', label:'Accounting', desc:'Get a list of every disclosure made in the last 6 years.' },
    { ic:'✉', label:'Confidential Comms', desc:'Choose how — and where — you\'re contacted.' },
    { ic:'⚠', label:'Notification', desc:'Be told within 60 days if your data was breached.' },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 08 · Patient Rights
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          HIPAA gives patients <GText>six core rights</GText>.
        </div>
        <div style={{
          fontSize: 26, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 16, opacity: sub, maxWidth: 1400,
        }}>
          And your business is legally required to honor every one — on request.
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 22, marginTop: 48, flex:1 }}>
          {rights.map((r, i) => {
            const op = clamp((t - (1.2 + i*0.18))/0.35, 0, 1);
            return (
              <div key={i} style={{
                padding: 28,
                background:'rgba(15,23,42,0.6)',
                border:'1px solid rgba(139,92,246,0.3)',
                borderRadius: 20,
                opacity: op, transform:`translateY(${(1-op)*20}px)`,
                backdropFilter:'blur(20px)', display:'flex', gap: 20, alignItems:'flex-start',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                  background:'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.2))',
                  border:'1px solid rgba(139,92,246,0.35)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 26, color:'#c4b5fd',
                }}>{r.ic}</div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color:'white', marginBottom: 6,
                    letterSpacing:'-0.01em' }}>{r.label}</div>
                  <div style={{ fontSize: 18, color:'rgba(203,213,225,0.85)', lineHeight:1.5 }}>{r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DarkCanvas>
  );
}

Object.assign(window, { SceneRules, SceneBreaches, ScenePatientRights });
