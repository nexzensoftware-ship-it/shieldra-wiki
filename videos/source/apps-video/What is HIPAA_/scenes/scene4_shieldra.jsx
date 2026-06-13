// Scene 7: Who must comply (Covered Entities + Business Associates)
// Scene 8: How Shieldra helps

function SceneWho() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  const coveredEntities = [
    { label: 'Healthcare Providers', ex: 'Hospitals, clinics, dentists, pharmacies' },
    { label: 'Health Plans', ex: 'Insurers, HMOs, Medicare, Medicaid' },
    { label: 'Healthcare Clearinghouses', ex: 'Billing services, claims processors' },
  ];

  const businessAssociates = [
    { label: 'Cloud & SaaS', ex: 'AWS, EHR vendors, patient portals' },
    { label: 'IT & Security', ex: 'MSPs, pentesters, managed IT' },
    { label: 'Professional Services', ex: 'Law firms, accountants, consultants' },
    { label: 'Analytics & AI', ex: 'ML platforms, BI tools, data warehouses' },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 07 · Who Must Comply
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          HIPAA reaches <GText>far beyond</GText> hospitals.
        </div>
        <div style={{
          fontSize: 28, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 18, opacity: sub, maxWidth: 1400,
        }}>
          If your business touches PHI — even indirectly — you're on the hook.
          There are two categories, and both carry equal liability.
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 40, marginTop: 56, flex:1 }}>
          {/* Column 1: Covered Entities */}
          {(() => {
            const op = clamp((t-1.2)/0.4, 0, 1);
            return (
              <div style={{
                padding: 40,
                background:'rgba(15,23,42,0.6)',
                border:'1px solid rgba(59,130,246,0.35)',
                borderRadius: 24,
                opacity: op, transform:`translateY(${(1-op)*20}px)`,
                backdropFilter:'blur(20px)',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', inset:0,
                  background:'radial-gradient(circle at 0% 0%, rgba(59,130,246,0.12), transparent 50%)' }}/>
                <div style={{ position:'relative' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom: 28 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background:'linear-gradient(135deg, #3b82f6, #2563eb)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: 32, fontWeight: 900, color:'white',
                      boxShadow:'0 0 24px rgba(59,130,246,0.4)',
                    }}>01</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight:700, letterSpacing:'0.15em',
                        textTransform:'uppercase', color:'#60a5fa' }}>Group A</div>
                      <div style={{ fontSize: 38, fontWeight: 800, color:'white', letterSpacing:'-0.02em' }}>
                        Covered Entities
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, color:'rgba(203,213,225,0.85)', lineHeight:1.5, marginBottom: 28 }}>
                    Organizations that <span style={{ color:'white', fontWeight:600 }}>create, receive, or transmit PHI</span>
                    {' '}in the course of care.
                  </div>
                  {coveredEntities.map((c, i) => {
                    const iop = clamp((t - (1.6 + i*0.15))/0.3, 0, 1);
                    return (
                      <div key={i} style={{
                        padding: 18,
                        background:'rgba(59,130,246,0.08)',
                        border:'1px solid rgba(59,130,246,0.2)',
                        borderRadius: 14,
                        marginBottom: 12,
                        opacity: iop, transform:`translateX(${(1-iop)*-20}px)`,
                      }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color:'white', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 17, color:'rgba(148,163,184,0.9)' }}>{c.ex}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Column 2: Business Associates */}
          {(() => {
            const op = clamp((t-1.8)/0.4, 0, 1);
            return (
              <div style={{
                padding: 40,
                background:'rgba(15,23,42,0.6)',
                border:'1px solid rgba(139,92,246,0.35)',
                borderRadius: 24,
                opacity: op, transform:`translateY(${(1-op)*20}px)`,
                backdropFilter:'blur(20px)',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', inset:0,
                  background:'radial-gradient(circle at 100% 0%, rgba(139,92,246,0.12), transparent 50%)' }}/>
                <div style={{ position:'relative' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom: 28 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background:'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: 32, fontWeight: 900, color:'white',
                      boxShadow:'0 0 24px rgba(139,92,246,0.4)',
                    }}>02</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight:700, letterSpacing:'0.15em',
                        textTransform:'uppercase', color:'#a78bfa' }}>Group B</div>
                      <div style={{ fontSize: 38, fontWeight: 800, color:'white', letterSpacing:'-0.02em' }}>
                        Business Associates
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, color:'rgba(203,213,225,0.85)', lineHeight:1.5, marginBottom: 28 }}>
                    Any vendor that <span style={{ color:'white', fontWeight:600 }}>handles PHI on behalf of a Covered Entity</span>
                    {' '}— signed under a BAA.
                  </div>
                  {businessAssociates.map((c, i) => {
                    const iop = clamp((t - (2.2 + i*0.12))/0.3, 0, 1);
                    return (
                      <div key={i} style={{
                        padding: 14,
                        background:'rgba(139,92,246,0.08)',
                        border:'1px solid rgba(139,92,246,0.2)',
                        borderRadius: 12,
                        marginBottom: 10,
                        opacity: iop, transform:`translateX(${(1-iop)*20}px)`,
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color:'white', marginBottom: 2 }}>{c.label}</div>
                        <div style={{ fontSize: 16, color:'rgba(148,163,184,0.9)' }}>{c.ex}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bottom takeaway */}
        {(() => {
          const op = clamp((t-3.4)/0.4, 0, 1);
          return (
            <div style={{
              marginTop: 32, padding:'24px 36px',
              background:'rgba(34,211,238,0.1)',
              border:'1px solid rgba(34,211,238,0.35)',
              borderRadius: 16,
              opacity: op, transform:`translateY(${(1-op)*16}px)`,
              fontSize: 24, color:'rgba(226,232,240,0.95)', lineHeight: 1.5,
            }}>
              <span style={{ fontWeight:700, color:'#22d3ee' }}>The bottom line:</span>{' '}
              if a startup processes, analyzes, or stores patient data for a hospital,
              that startup is a Business Associate — and is <span style={{ color:'white', fontWeight:700 }}>directly liable under HIPAA</span>.
            </div>
          );
        })()}
      </div>
    </DarkCanvas>
  );
}


// Scene 8: How Shieldra helps
function SceneShieldra() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  const features = [
    { ic:'◎', title:'Continuous Policy Scanning', desc:'AI reads every policy, procedure, and BAA — flags HIPAA gaps in minutes, not months.', color:'#60a5fa' },
    { ic:'◉', title:'Live Infrastructure Monitoring', desc:'324 HIPAA controls monitored 24/7 across your cloud, EHR, and endpoints.', color:'#22d3ee' },
    { ic:'◈', title:'Auto-Remediation', desc:'Shieldra doesn\'t just find issues — it writes the fix, opens the ticket, and closes the loop.', color:'#a78bfa' },
    { ic:'◆', title:'Audit-Ready Evidence', desc:'Every control, every timestamp, every artifact. Export an OCR-ready package in one click.', color:'#67e8f9' },
  ];

  // Compliance score gauge
  const gaugeOp = clamp((t-2.4)/0.4, 0, 1);
  const gaugeProgress = clamp((t - 2.8)/1.4, 0, 1);
  const scoreTarget = 98;
  const currentScore = Math.round(scoreTarget * Easing.easeOutExpo(gaugeProgress));

  const circumference = 2 * Math.PI * 80;

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 20, opacity: eyebrow }}>
          <img src="assets/icon-white.svg" width="44" height="44" alt=""/>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing:'0.2em',
            textTransform:'uppercase', color:'#22d3ee' }}>
            Chapter 09 · How Shieldra Helps
          </div>
        </div>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          HIPAA compliance, <GText>on autopilot</GText>.
        </div>
        <div style={{
          fontSize: 28, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 18, opacity: sub, maxWidth: 1400,
        }}>
          Shieldra is the regulatory AI that scans your policies, monitors your infrastructure,
          and learns from every audit — so you stay a step ahead of every regulator.
        </div>

        {/* Features grid + gauge */}
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap: 40, marginTop: 48, flex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 20 }}>
            {features.map((f, i) => {
              const op = clamp((t - (1.4 + i*0.18))/0.35, 0, 1);
              return (
                <div key={i} style={{
                  padding: 28,
                  background:'rgba(15,23,42,0.65)',
                  border:`1px solid ${f.color}40`,
                  borderRadius: 20,
                  opacity: op, transform:`translateY(${(1-op)*20}px)`,
                  backdropFilter:'blur(20px)',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${f.color}22`,
                    border:`1px solid ${f.color}50`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 28, color: f.color, marginBottom: 18,
                  }}>{f.ic}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color:'white',
                    marginBottom: 8, letterSpacing:'-0.01em' }}>{f.title}</div>
                  <div style={{ fontSize: 17, color:'rgba(203,213,225,0.8)', lineHeight:1.5 }}>
                    {f.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Big gauge */}
          <div style={{
            padding: 32,
            background:'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.1))',
            border:'1px solid rgba(34,197,94,0.35)',
            borderRadius: 24,
            opacity: gaugeOp, transform:`translateY(${(1-gaugeOp)*20}px)`,
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing:'0.2em',
              textTransform:'uppercase', color:'#22c55e', marginBottom: 4 }}>
              HIPAA Readiness
            </div>
            <div style={{ fontSize: 14, color:'rgba(148,163,184,0.7)', marginBottom: 20 }}>
              acme health · live
            </div>

            <div style={{ position:'relative', width: 220, height: 220 }}>
              <svg width="220" height="220" viewBox="0 0 220 220">
                <defs>
                  <linearGradient id="gscore" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e"/>
                    <stop offset="100%" stopColor="#16a34a"/>
                  </linearGradient>
                </defs>
                <circle cx="110" cy="110" r="80" fill="none"
                  stroke="rgba(148,163,184,0.2)" strokeWidth="14"/>
                <circle cx="110" cy="110" r="80" fill="none"
                  stroke="url(#gscore)" strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - (gaugeProgress * scoreTarget/100))}
                  transform="rotate(-90 110 110)"
                  style={{ filter:'drop-shadow(0 0 12px rgba(34,197,94,0.5))' }}/>
              </svg>
              <div style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{ fontSize: 72, fontWeight: 900, color:'white',
                  fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.04em', lineHeight: 1 }}>
                  {currentScore}<span style={{ fontSize: 32, color:'rgba(148,163,184,0.8)' }}>%</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color:'#22c55e',
                  letterSpacing:'0.15em', textTransform:'uppercase', marginTop: 4 }}>
                  Excellent
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, background:'rgba(15,23,42,0.5)', borderRadius: 12,
                border:'1px solid rgba(148,163,184,0.15)' }}>
                <div style={{ fontSize: 11, color:'rgba(148,163,184,0.8)', fontWeight:600,
                  letterSpacing:'0.1em', textTransform:'uppercase' }}>Controls</div>
                <div style={{ fontSize: 24, fontWeight: 800, color:'white',
                  fontFamily:'JetBrains Mono, monospace' }}>324 / 324</div>
              </div>
              <div style={{ padding: 14, background:'rgba(15,23,42,0.5)', borderRadius: 12,
                border:'1px solid rgba(148,163,184,0.15)' }}>
                <div style={{ fontSize: 11, color:'rgba(148,163,184,0.8)', fontWeight:600,
                  letterSpacing:'0.1em', textTransform:'uppercase' }}>Open Findings</div>
                <div style={{ fontSize: 24, fontWeight: 800, color:'#22c55e',
                  fontFamily:'JetBrains Mono, monospace' }}>0 critical</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DarkCanvas>
  );
}

Object.assign(window, { SceneWho, SceneShieldra });
