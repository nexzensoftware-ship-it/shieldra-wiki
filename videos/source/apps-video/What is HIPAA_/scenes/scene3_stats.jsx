// Scene 5: Why HIPAA is important — stats on breaches
// Scene 6: Business impact — penalties

function SceneImportance() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  // 3 big stats
  const stat1 = clamp((t-1.4)/0.5, 0, 1);
  const stat2 = clamp((t-2.0)/0.5, 0, 1);
  const stat3 = clamp((t-2.6)/0.5, 0, 1);

  // Growing bar chart for breaches trend
  const chartOp = clamp((t-3.3)/0.4, 0, 1);
  const years = [
    { y: '2018', v: 0.38 },
    { y: '2019', v: 0.46 },
    { y: '2020', v: 0.51 },
    { y: '2021', v: 0.61 },
    { y: '2022', v: 0.68 },
    { y: '2023', v: 0.84 },
    { y: '2024', v: 0.96 },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 04 · Why It Matters
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          Healthcare data is the <GText>#1 target</GText> for cybercrime.
        </div>
        <div style={{
          fontSize: 28, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 18, maxWidth: 1400, opacity: sub,
        }}>
          A single medical record sells for up to{' '}
          <span style={{ color:'#67e8f9', fontWeight:600 }}>$1,000 on the dark web</span>
          {' '}— 50× more than a credit card.
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap: 28, marginTop: 50 }}>
          {[
            { op: stat1, num: 133, suf: 'M', label: 'Americans had their health records breached in 2023', color: '#ef4444' },
            { op: stat2, num: 725, suf: '', label: 'Major healthcare breaches reported to HHS last year', color: '#f97316' },
            { op: stat3, num: 10.9, dec: 1, suf: 'M', label: 'Average cost of a single healthcare data breach (USD)', color: '#eab308', prefix: '$' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: 36,
              background:'rgba(15,23,42,0.6)',
              border:`1px solid ${s.color}55`,
              borderRadius: 24,
              opacity: s.op, transform:`translateY(${(1-s.op)*20}px) scale(${0.96 + s.op*0.04})`,
              backdropFilter:'blur(20px)',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', top:-40, right:-40, width: 160, height: 160,
                borderRadius:'50%', background: s.color, opacity: 0.08, filter:'blur(30px)' }}/>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing:'0.15em',
                textTransform:'uppercase', color: s.color, marginBottom: 18 }}>
                {i === 0 ? 'Patients Affected' : i === 1 ? 'Reported Breaches' : 'Breach Cost'}
              </div>
              <div style={{ fontSize: 110, fontWeight: 900, color:'white',
                letterSpacing:'-0.04em', lineHeight:1,
                fontFamily:'JetBrains Mono, monospace',
              }}>
                {s.prefix || ''}<Counter to={s.num} suffix={s.suf} decimals={s.dec||0} duration={1.6}/>
              </div>
              <div style={{ fontSize: 20, color:'rgba(203,213,225,0.85)', lineHeight:1.5, marginTop: 20 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{
          marginTop: 40, padding: 28,
          background:'rgba(15,23,42,0.55)',
          border:'1px solid rgba(148,163,184,0.2)',
          borderRadius: 20,
          opacity: chartOp, flex:1,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color:'white' }}>
              Healthcare breaches — reported to HHS (indexed)
            </div>
            <div style={{ fontSize: 18, color:'#f87171', fontWeight:600,
              background:'rgba(239,68,68,0.12)', padding:'6px 14px', borderRadius: 999 }}>
              ▲ +153% since 2018
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap: 24, height: 140 }}>
            {years.map((yr, i) => {
              const barOp = clamp((t - (3.8 + i*0.08))/0.3, 0, 1);
              const h = yr.v * 140 * barOp;
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 10 }}>
                  <div style={{
                    width:'100%', height: h,
                    background: i >= 5
                      ? 'linear-gradient(180deg, #ef4444, #b91c1c)'
                      : 'linear-gradient(180deg, #60a5fa, #2563eb)',
                    borderRadius: '8px 8px 2px 2px',
                    boxShadow: i >= 5 ? '0 0 24px rgba(239,68,68,0.5)' : '0 0 16px rgba(59,130,246,0.3)',
                  }}/>
                  <div style={{ fontSize: 16, color:'rgba(148,163,184,0.9)',
                    fontFamily:'JetBrains Mono, monospace' }}>{yr.y}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DarkCanvas>
  );
}


// Scene 6: Penalties & why businesses need it
function ScenePenalties() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const eyebrow = clamp(t/0.3, 0, 1);
  const title = clamp((t-0.2)/0.5, 0, 1);
  const sub = clamp((t-0.8)/0.4, 0, 1);

  const tiers = [
    { label: 'Tier 1', sub: 'Unknowing', min: '$137', max: '$68,928', note: 'per violation', color:'#eab308' },
    { label: 'Tier 2', sub: 'Reasonable Cause', min: '$1,379', max: '$68,928', note: 'per violation', color:'#f97316' },
    { label: 'Tier 3', sub: 'Willful Neglect (corrected)', min: '$13,785', max: '$68,928', note: 'per violation', color:'#f87171' },
    { label: 'Tier 4', sub: 'Willful Neglect (uncorrected)', min: '$68,928', max: '$2,067,813', note: 'per violation', color:'#ef4444' },
  ];

  return (
    <DarkCanvas>
      <div style={{ position:'absolute', inset:0, padding:'90px 120px',
        display:'flex', flexDirection:'column' }}>
        <Eyebrow style={{ opacity: eyebrow, fontSize: 24 }}>
          Chapter 05 · The Cost of Non-Compliance
        </Eyebrow>
        <div style={{
          fontSize: 92, fontWeight: 800, letterSpacing:'-0.03em', lineHeight:1.05,
          color:'white', marginTop: 20,
          opacity: title, transform:`translateY(${(1-title)*20}px)`,
        }}>
          Violations are measured <GText>per record</GText>. They add up fast.
        </div>
        <div style={{
          fontSize: 28, color:'rgba(203,213,225,0.85)', lineHeight:1.5,
          marginTop: 18, opacity: sub, maxWidth: 1400,
        }}>
          The Office for Civil Rights (OCR) enforces HIPAA with a tiered penalty structure —
          and repeat offenders can face{' '}
          <span style={{ color:'#f87171', fontWeight:600 }}>criminal charges up to 10 years in prison</span>.
        </div>

        {/* Tier cards */}
        <div style={{ display:'flex', gap: 20, marginTop: 48 }}>
          {tiers.map((tier, i) => {
            const op = clamp((t - (1.4 + i*0.2))/0.4, 0, 1);
            return (
              <div key={i} style={{
                flex: 1, padding: 28,
                background:'rgba(15,23,42,0.6)',
                border:`1px solid ${tier.color}55`,
                borderRadius: 20,
                opacity: op, transform:`translateY(${(1-op)*24}px)`,
                backdropFilter:'blur(20px)',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:4,
                  background: tier.color }}/>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing:'0.15em',
                  textTransform:'uppercase', color: tier.color, marginBottom: 6, marginTop: 4 }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color:'white', marginBottom: 24,
                  lineHeight: 1.3, minHeight: 56 }}>
                  {tier.sub}
                </div>
                <div style={{ fontSize: 14, color:'rgba(148,163,184,0.7)', marginBottom: 4,
                  textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>Min</div>
                <div style={{ fontSize: 32, fontWeight: 800, color:'white',
                  fontFamily:'JetBrains Mono, monospace' }}>{tier.min}</div>
                <div style={{ height: 1, background:'rgba(148,163,184,0.2)', margin:'18px 0' }}/>
                <div style={{ fontSize: 14, color:'rgba(148,163,184,0.7)', marginBottom: 4,
                  textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600 }}>Max</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: tier.color,
                  fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.02em' }}>{tier.max}</div>
                <div style={{ fontSize: 16, color:'rgba(148,163,184,0.8)', marginTop: 6 }}>
                  {tier.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* Big callout at bottom */}
        {(() => {
          const op = clamp((t-2.8)/0.5, 0, 1);
          return (
            <div style={{
              marginTop: 40, padding:'32px 44px',
              background:'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))',
              border:'1px solid rgba(239,68,68,0.4)',
              borderRadius: 20,
              display:'flex', alignItems:'center', gap: 36,
              opacity: op, transform:`translateY(${(1-op)*16}px)`,
            }}>
              <div style={{
                fontSize: 88, fontWeight: 900, color:'#ef4444',
                fontFamily:'JetBrains Mono, monospace', letterSpacing:'-0.03em',
                lineHeight: 1,
              }}>
                $<Counter to={137} duration={1.8} />M
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color:'white', marginBottom: 6 }}>
                  Anthem, 2018.
                </div>
                <div style={{ fontSize: 22, color:'rgba(226,232,240,0.85)', lineHeight: 1.5 }}>
                  The largest HIPAA settlement on record — $16M to OCR plus $115M to affected consumers.
                  A reminder that one breach can redefine a business.
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </DarkCanvas>
  );
}

Object.assign(window, { SceneImportance, ScenePenalties });
