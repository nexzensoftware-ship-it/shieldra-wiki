// HIPAA video scenes

const BRAND = {
  brand500: '#3b82f6',
  brand600: '#2563eb',
  brand700: '#1d4ed8',
  brand900: '#1e3a8a',
  brand950: '#0f1d4d',
  accent400: '#22d3ee',
  accent500: '#06b6d4',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  surface0: '#ffffff',
  surface50: '#f8fafc',
  surface100: '#f1f5f9',
  surface200: '#e2e8f0',
  surface300: '#cbd5e1',
  surface400: '#94a3b8',
  surface500: '#64748b',
  surface700: '#334155',
  surface800: '#1e293b',
  surface900: '#0f172a',
  surface950: '#020617',
  success: '#22c55e',
  warning: '#eab308',
  high: '#f97316',
  danger: '#ef4444',
};

// Animated counter
function useCounter(target, start, duration, ease = Easing.easeOutCubic) {
  const t = useTime();
  if (t < start) return 0;
  if (t >= start + duration) return target;
  const local = (t - start) / duration;
  return target * ease(local);
}

// Background mesh — drifting orbs + dot grid
function MeshBackground({ dark = true }) {
  const t = useTime();
  const orbs = [
    { c: BRAND.brand500, x: 200, y: 180, r: 380, o: 0.35, sp: 0.06, ph: 0 },
    { c: BRAND.violet500, x: 1500, y: 200, r: 420, o: 0.30, sp: 0.05, ph: 1.2 },
    { c: BRAND.accent500, x: 1700, y: 900, r: 360, o: 0.28, sp: 0.07, ph: 2.4 },
    { c: BRAND.brand600, x: 300, y: 880, r: 300, o: 0.25, sp: 0.04, ph: 3.6 },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: dark
        ? 'linear-gradient(180deg, #020617 0%, #0b1226 100%)'
        : 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      overflow: 'hidden',
    }}>
      {orbs.map((o, i) => {
        const dx = Math.sin(t * o.sp * 2 * Math.PI + o.ph) * 60;
        const dy = Math.cos(t * o.sp * 2 * Math.PI + o.ph) * 40;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: o.x + dx - o.r, top: o.y + dy - o.r,
            width: o.r * 2, height: o.r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${o.c}${Math.round(o.o*255).toString(16).padStart(2,'0')} 0%, transparent 65%)`,
            filter: 'blur(40px)',
          }}/>
        );
      })}
      {/* dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${dark ? 'rgba(148,163,184,0.18)' : 'rgba(100,116,139,0.25)'} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        opacity: 0.6,
      }}/>
    </div>
  );
}

// Animated vertical beam lines
function Beams() {
  const t = useTime();
  const beams = [
    { x: 240, delay: 0 },
    { x: 540, delay: 1.2 },
    { x: 960, delay: 0.4 },
    { x: 1380, delay: 2.0 },
    { x: 1680, delay: 0.8 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {beams.map((b, i) => {
        const cycle = 4;
        const local = ((t - b.delay) % cycle + cycle) % cycle;
        const p = local / cycle;
        const top = -200 + p * 1280;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: b.x, top,
            width: 1, height: 200,
            background: `linear-gradient(180deg, transparent, ${BRAND.accent400}66, transparent)`,
            opacity: 0.7,
          }}/>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 1: Title (0 - 4s)
// ─────────────────────────────────────────────────────────
function SceneTitle() {
  const sp = useSprite();
  const t = sp.localTime;

  // Title entrance
  const titleP = Easing.easeOutCubic(clamp(t / 0.9, 0, 1));
  const subP = Easing.easeOutCubic(clamp((t - 0.4) / 0.9, 0, 1));
  const eyebrowP = Easing.easeOutCubic(clamp((t - 0.1) / 0.6, 0, 1));

  // Exit fade
  const exitT = clamp((sp.duration - t) / 0.5, 0, 1);
  const opacity = exitT;

  // Pulsing shield
  const pulse = 1 + Math.sin(t * 2.2) * 0.04;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      <MeshBackground />
      <Beams />

      {/* Center stack */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
      }}>
        {/* Shield icon */}
        <div style={{
          width: 120, height: 120,
          marginBottom: 36,
          opacity: titleP,
          transform: `scale(${pulse * (0.6 + 0.4 * titleP)})`,
        }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={BRAND.accent400}/>
                <stop offset="100%" stopColor={BRAND.brand500}/>
              </linearGradient>
              <filter id="sgl"><feGaussianBlur stdDeviation="6"/></filter>
            </defs>
            <path d="M60 12 L102 28 V60 C102 86 84 104 60 112 C36 104 18 86 18 60 V28 Z"
              fill="url(#sg)" opacity="0.25" filter="url(#sgl)"/>
            <path d="M60 16 L98 30 V60 C98 84 82 100 60 108 C38 100 22 84 22 60 V30 Z"
              fill="none" stroke="url(#sg)" strokeWidth="2.5"/>
            <path d="M44 60 L56 72 L78 50" fill="none" stroke={BRAND.accent400} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Eyebrow */}
        <div style={{
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: BRAND.accent400,
          opacity: eyebrowP,
          transform: `translateY(${(1-eyebrowP)*12}px)`,
          marginBottom: 28,
        }}>
          A Quick Guide · 2026
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 124,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: '#fff',
          margin: 0,
          opacity: titleP,
          transform: `translateY(${(1-titleP)*24}px)`,
        }}>
          Understanding{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.accent400}, ${BRAND.brand500}, ${BRAND.violet500})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>HIPAA</span>
        </h1>
        <h2 style={{
          fontSize: 56,
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.78)',
          margin: '16px 0 0 0',
          opacity: subP,
          transform: `translateY(${(1-subP)*16}px)`,
        }}>
          Regulations & Fines
        </h2>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 2: What is HIPAA? (4 - 9s)
// ─────────────────────────────────────────────────────────
function SceneWhat() {
  const sp = useSprite();
  const t = sp.localTime;
  const exitT = clamp((sp.duration - t) / 0.5, 0, 1);

  const pillars = [
    { code: '§ 164.502', title: 'Privacy Rule', desc: 'Governs use & disclosure of protected health information.', color: BRAND.brand500 },
    { code: '§ 164.306', title: 'Security Rule', desc: 'Safeguards for electronic PHI — admin, physical, technical.', color: BRAND.accent500 },
    { code: '§ 164.404', title: 'Breach Notification', desc: 'Notify HHS, individuals & media after a breach.', color: BRAND.violet500 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitT }}>
      <MeshBackground />

      {/* Eyebrow + heading */}
      <div style={{ position: 'absolute', top: 110, left: 120, right: 120 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: BRAND.accent400,
          opacity: clamp(t / 0.5, 0, 1),
        }}>
          The Foundation
        </div>
        <h2 style={{
          fontSize: 84, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
          margin: '14px 0 0 0', lineHeight: 1.05,
          opacity: clamp((t - 0.15) / 0.6, 0, 1),
          transform: `translateY(${(1 - clamp((t - 0.15) / 0.6, 0, 1))*18}px)`,
        }}>
          What is{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.accent400}, ${BRAND.violet500})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>HIPAA?</span>
        </h2>
        <p style={{
          fontSize: 26, color: 'rgba(255,255,255,0.7)', maxWidth: 1100,
          margin: '20px 0 0 0', lineHeight: 1.5, fontWeight: 400,
          opacity: clamp((t - 0.5) / 0.6, 0, 1),
        }}>
          The <strong style={{ color: '#fff', fontWeight: 600 }}>Health Insurance Portability and Accountability Act</strong>, passed 1996, sets the federal standard for protecting sensitive patient health information across three core rules.
        </p>
      </div>

      {/* Three pillars */}
      <div style={{
        position: 'absolute', left: 120, right: 120, bottom: 120,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28,
      }}>
        {pillars.map((p, i) => {
          const start = 1.2 + i * 0.25;
          const cardP = clamp((t - start) / 0.6, 0, 1);
          const eased = Easing.easeOutBack(cardP);
          return (
            <div key={i} style={{
              padding: '36px 32px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
              backdropFilter: 'blur(20px)',
              opacity: cardP,
              transform: `translateY(${(1-eased)*28}px)`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${p.color}, transparent)`,
              }}/>
              <div style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.12em',
                fontFamily: 'JetBrains Mono, monospace',
                color: p.color, marginBottom: 18,
              }}>{p.code}</div>
              <div style={{
                fontSize: 38, fontWeight: 700, color: '#fff',
                letterSpacing: '-0.02em', marginBottom: 14,
              }}>{p.title}</div>
              <div style={{
                fontSize: 19, lineHeight: 1.5,
                color: 'rgba(255,255,255,0.65)',
              }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 3: Who must comply (9 - 13s)
// ─────────────────────────────────────────────────────────
function SceneWho() {
  const sp = useSprite();
  const t = sp.localTime;
  const exitT = clamp((sp.duration - t) / 0.5, 0, 1);

  const entities = [
    { name: 'Health Plans', sub: 'Insurers, HMOs, Medicare', icon: 'plan' },
    { name: 'Healthcare Providers', sub: 'Hospitals, clinics, doctors', icon: 'provider' },
    { name: 'Clearinghouses', sub: 'Billing & claims processors', icon: 'clearing' },
    { name: 'Business Associates', sub: 'Vendors handling PHI', icon: 'vendor' },
  ];

  const Icon = ({ kind, color }) => {
    if (kind === 'plan') return <svg viewBox="0 0 48 48" width="48" height="48" fill="none"><rect x="8" y="12" width="32" height="26" rx="3" stroke={color} strokeWidth="2.5"/><path d="M8 20h32" stroke={color} strokeWidth="2.5"/><circle cx="14" cy="28" r="2" fill={color}/></svg>;
    if (kind === 'provider') return <svg viewBox="0 0 48 48" width="48" height="48" fill="none"><path d="M10 38V18l14-8 14 8v20" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/><path d="M20 38v-8h8v8M24 22v6M21 25h6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>;
    if (kind === 'clearing') return <svg viewBox="0 0 48 48" width="48" height="48" fill="none"><rect x="6" y="14" width="14" height="20" rx="2" stroke={color} strokeWidth="2.5"/><rect x="28" y="14" width="14" height="20" rx="2" stroke={color} strokeWidth="2.5"/><path d="M20 24h8M24 20l4 4-4 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    return <svg viewBox="0 0 48 48" width="48" height="48" fill="none"><circle cx="24" cy="18" r="7" stroke={color} strokeWidth="2.5"/><path d="M10 40c0-7 6-12 14-12s14 5 14 12" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitT }}>
      <MeshBackground />

      <div style={{ position: 'absolute', top: 110, left: 120, right: 120 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: BRAND.accent400,
          opacity: clamp(t / 0.5, 0, 1),
        }}>Covered Entities</div>
        <h2 style={{
          fontSize: 84, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
          margin: '14px 0 0 0', lineHeight: 1.05,
          opacity: clamp((t - 0.1) / 0.5, 0, 1),
          transform: `translateY(${(1 - clamp((t - 0.1) / 0.5, 0, 1))*18}px)`,
        }}>
          Who must{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.accent400}, ${BRAND.violet500})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>comply?</span>
        </h2>
      </div>

      <div style={{
        position: 'absolute', left: 120, right: 120, bottom: 140,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22,
      }}>
        {entities.map((e, i) => {
          const start = 0.9 + i * 0.18;
          const p = clamp((t - start) / 0.55, 0, 1);
          const eased = Easing.easeOutCubic(p);
          return (
            <div key={i} style={{
              padding: '40px 28px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(34,211,238,0.18)',
              borderRadius: 20,
              backdropFilter: 'blur(20px)',
              opacity: p,
              transform: `translateY(${(1-eased)*32}px) scale(${0.92 + 0.08*eased})`,
              textAlign: 'left',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: `linear-gradient(135deg, ${BRAND.brand500}33, ${BRAND.accent500}22)`,
                border: `1px solid ${BRAND.accent500}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
              }}>
                <Icon kind={e.icon} color={BRAND.accent400}/>
              </div>
              <div style={{
                fontSize: 26, fontWeight: 700, color: '#fff',
                letterSpacing: '-0.01em', marginBottom: 8,
              }}>{e.name}</div>
              <div style={{
                fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4,
              }}>{e.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 4: Fine tiers (13 - 21s)
// ─────────────────────────────────────────────────────────
function SceneFines() {
  const sp = useSprite();
  const t = sp.localTime;
  const exitT = clamp((sp.duration - t) / 0.5, 0, 1);

  const tiers = [
    {
      tier: 'Tier 1',
      label: 'No Knowledge',
      perViolation: 137,
      annualCap: 34464,
      color: BRAND.success,
      desc: 'Did not know — and would not have known with reasonable diligence.',
    },
    {
      tier: 'Tier 2',
      label: 'Reasonable Cause',
      perViolation: 1379,
      annualCap: 137886,
      color: BRAND.warning,
      desc: 'Reasonable cause; not willful neglect.',
    },
    {
      tier: 'Tier 3',
      label: 'Willful Neglect — Corrected',
      perViolation: 13785,
      annualCap: 344638,
      color: BRAND.high,
      desc: 'Willful neglect, corrected within 30 days.',
    },
    {
      tier: 'Tier 4',
      label: 'Willful Neglect — Uncorrected',
      perViolation: 68928,
      annualCap: 2067813,
      color: BRAND.danger,
      desc: 'Willful neglect, not corrected.',
    },
  ];

  // Animated counter for each row
  const fmt = (n) => '$' + Math.round(n).toLocaleString();

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitT }}>
      <MeshBackground />

      <div style={{ position: 'absolute', top: 80, left: 120, right: 120 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: BRAND.danger,
          opacity: clamp(t / 0.4, 0, 1),
        }}>Civil Monetary Penalties · 2025 Adjusted</div>
        <h2 style={{
          fontSize: 80, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
          margin: '12px 0 0 0', lineHeight: 1.05,
          opacity: clamp((t - 0.1) / 0.5, 0, 1),
        }}>
          Four tiers of{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.warning}, ${BRAND.danger})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>fines.</span>
        </h2>
      </div>

      {/* Table */}
      <div style={{
        position: 'absolute', left: 120, right: 120, top: 320,
        background: 'rgba(15,23,42,0.55)',
        border: '1px solid rgba(148,163,184,0.18)',
        borderRadius: 20,
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        opacity: clamp((t - 0.4) / 0.5, 0, 1),
        transform: `translateY(${(1 - clamp((t - 0.4) / 0.5, 0, 1)) * 16}px)`,
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.7fr 1fr 1fr',
          padding: '20px 32px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(148,163,184,0.18)',
          fontSize: 14, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}>
          <div>Tier</div>
          <div>Culpability</div>
          <div style={{ textAlign: 'right' }}>Min / Violation</div>
          <div style={{ textAlign: 'right' }}>Annual Cap</div>
        </div>

        {tiers.map((row, i) => {
          const start = 0.9 + i * 0.45;
          const p = clamp((t - start) / 0.7, 0, 1);
          const numP = clamp((t - start - 0.15) / 0.9, 0, 1);
          const eased = Easing.easeOutCubic(numP);
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.7fr 1fr 1fr',
              padding: '28px 32px',
              alignItems: 'center',
              borderBottom: i < tiers.length - 1 ? '1px solid rgba(148,163,184,0.10)' : 'none',
              opacity: p,
              transform: `translateX(${(1-p)*-30}px)`,
              background: i === 3 ? `linear-gradient(90deg, ${BRAND.danger}11, transparent)` : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: row.color,
                  boxShadow: `0 0 16px ${row.color}`,
                }}/>
                <div style={{
                  fontSize: 26, fontWeight: 700, color: '#fff',
                  letterSpacing: '-0.01em',
                }}>{row.tier}</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{row.desc}</div>
              </div>
              <div style={{
                fontSize: 30, fontWeight: 700, color: row.color, textAlign: 'right',
                fontFamily: 'JetBrains Mono, monospace',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {fmt(row.perViolation * eased)}
              </div>
              <div style={{
                fontSize: 30, fontWeight: 700, color: '#fff', textAlign: 'right',
                fontFamily: 'JetBrains Mono, monospace',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {fmt(row.annualCap * eased)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div style={{
        position: 'absolute', bottom: 60, left: 120, right: 120,
        fontSize: 18, color: 'rgba(255,255,255,0.5)',
        opacity: clamp((t - 3.2) / 0.6, 0, 1),
        textAlign: 'center',
      }}>
        Penalties stack <em>per violation</em> — a single breach can trigger thousands.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 5: Real-world fines (21 - 27s)
// ─────────────────────────────────────────────────────────
function SceneRealWorld() {
  const sp = useSprite();
  const t = sp.localTime;
  const exitT = clamp((sp.duration - t) / 0.5, 0, 1);

  // Counter ramps to $16M+
  const big = useCounter(16000000, 0.6, 2.0);
  const fmtBig = (n) => '$' + (n / 1000000).toFixed(1) + 'M';

  const cases = [
    { org: 'Anthem Inc.', year: '2018', amount: '$16M', records: '79M records', kind: 'Cyberattack' },
    { org: 'Premera Blue Cross', year: '2020', amount: '$6.85M', records: '10.4M records', kind: 'Phishing' },
    { org: 'Excellus Health Plan', year: '2021', amount: '$5.1M', records: '9.3M records', kind: 'Network breach' },
    { org: 'Memorial Healthcare', year: '2017', amount: '$5.5M', records: '115K records', kind: 'Insider access' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitT }}>
      <MeshBackground />

      <div style={{ position: 'absolute', top: 110, left: 120, right: 120 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: BRAND.danger,
          opacity: clamp(t / 0.4, 0, 1),
        }}>By the Numbers</div>
        <h2 style={{
          fontSize: 80, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
          margin: '12px 0 0 0', lineHeight: 1.05,
          opacity: clamp((t - 0.1) / 0.5, 0, 1),
        }}>
          The cost of{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.danger}, ${BRAND.violet500})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>non-compliance.</span>
        </h2>
      </div>

      {/* Hero stat */}
      <div style={{
        position: 'absolute', left: 120, top: 340, width: 700,
        opacity: clamp((t - 0.4) / 0.6, 0, 1),
      }}>
        <div style={{
          fontSize: 14, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)', marginBottom: 18,
        }}>Largest HIPAA Settlement</div>
        <div style={{
          fontSize: 200, fontWeight: 800, lineHeight: 0.9,
          background: `linear-gradient(135deg, ${BRAND.danger}, ${BRAND.warning})`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          fontFamily: 'JetBrains Mono, monospace',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.04em',
        }}>{fmtBig(big)}</div>
        <div style={{
          fontSize: 24, color: 'rgba(255,255,255,0.7)', marginTop: 18,
          fontWeight: 500,
        }}>
          Anthem · 79 million patient records exposed
        </div>
      </div>

      {/* Right column — list */}
      <div style={{
        position: 'absolute', right: 120, top: 340, width: 720,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {cases.map((c, i) => {
          const start = 1.4 + i * 0.25;
          const p = clamp((t - start) / 0.5, 0, 1);
          return (
            <div key={i} style={{
              padding: '22px 28px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(148,163,184,0.18)',
              borderRadius: 16,
              backdropFilter: 'blur(20px)',
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr 1fr',
              gap: 20,
              alignItems: 'center',
              opacity: p,
              transform: `translateX(${(1-p)*30}px)`,
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.org}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{c.kind} · {c.year}</div>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'left' }}>{c.records}</div>
              <div style={{
                fontSize: 28, fontWeight: 700, color: BRAND.danger, textAlign: 'right',
                fontFamily: 'JetBrains Mono, monospace',
              }}>{c.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE 6: Logo outro (27 - 32s)
// ─────────────────────────────────────────────────────────
function SceneOutro() {
  const sp = useSprite();
  const t = sp.localTime;

  // Logo entry
  const logoP = Easing.easeOutCubic(clamp(t / 1.2, 0, 1));
  const tagP = Easing.easeOutCubic(clamp((t - 0.6) / 1.0, 0, 1));
  const ctaP = Easing.easeOutCubic(clamp((t - 1.4) / 0.8, 0, 1));

  // Pulse the shield rings
  const ring1 = (t * 0.6) % 1;
  const ring2 = ((t * 0.6) + 0.5) % 1;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${BRAND.brand900} 0%, ${BRAND.surface950} 70%)`,
      }}/>
      <Beams />

      {/* Pulse rings */}
      <div style={{
        position: 'absolute', left: '50%', top: '46%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        opacity: logoP,
      }}>
        {[ring1, ring2].map((r, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: `2px solid ${BRAND.accent400}`,
            transform: `scale(${0.4 + r * 0.9})`,
            opacity: (1 - r) * 0.5,
          }}/>
        ))}
      </div>

      {/* Center logo */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Shield icon */}
        <div style={{
          width: 180, height: 180,
          marginBottom: 40,
          opacity: logoP,
          transform: `scale(${0.7 + logoP * 0.3})`,
        }}>
          <svg viewBox="0 0 180 180" width="180" height="180">
            <defs>
              <linearGradient id="og1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={BRAND.accent400}/>
                <stop offset="100%" stopColor={BRAND.brand500}/>
              </linearGradient>
              <radialGradient id="og2" cx="0.5" cy="0.4" r="0.6">
                <stop offset="0%" stopColor={BRAND.brand500} stopOpacity="0.4"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
            <circle cx="90" cy="90" r="80" fill="url(#og2)"/>
            <path d="M90 18 L150 42 V90 C150 130 124 158 90 168 C56 158 30 130 30 90 V42 Z"
              fill="none" stroke="url(#og1)" strokeWidth="3"/>
            <path d="M68 92 L84 108 L116 76" fill="none" stroke={BRAND.accent400}
              strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            {/* network nodes */}
            {[
              [90, 60], [70, 80], [110, 80], [80, 110], [100, 110]
            ].map((n, i) => (
              <circle key={i} cx={n[0]} cy={n[1]} r="2.5" fill={BRAND.accent400}/>
            ))}
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{
          fontSize: 96, fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#fff',
          opacity: logoP,
          transform: `translateY(${(1-logoP)*16}px)`,
          marginBottom: 8,
        }}>
          shieldra
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28, fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          letterSpacing: '-0.005em',
          opacity: tagP,
          transform: `translateY(${(1-tagP)*12}px)`,
          maxWidth: 900,
          lineHeight: 1.4,
        }}>
          The regulatory AI that{' '}
          <span style={{
            background: `linear-gradient(90deg, ${BRAND.accent400}, ${BRAND.violet500})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            fontWeight: 600,
          }}>shields</span>{' '}
          your business.
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 50,
          padding: '18px 40px',
          background: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600})`,
          borderRadius: 999,
          fontSize: 22, fontWeight: 600, color: '#fff',
          opacity: ctaP,
          transform: `translateY(${(1-ctaP)*14}px) scale(${0.95 + ctaP*0.05})`,
          boxShadow: `0 12px 40px ${BRAND.brand600}66`,
          letterSpacing: '-0.005em',
        }}>
          Automate HIPAA Compliance →
        </div>

        {/* footer */}
        <div style={{
          position: 'absolute', bottom: 60,
          fontSize: 14, fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          opacity: ctaP,
        }}>
          shieldra.ai · A Nexzen Software product
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Top-level video
// ─────────────────────────────────────────────────────────
function HipaaVideo() {
  return (
    <React.Fragment>
      <Sprite start={0} end={4.2}><SceneTitle/></Sprite>
      <Sprite start={4.2} end={9.4}><SceneWhat/></Sprite>
      <Sprite start={9.4} end={13.6}><SceneWho/></Sprite>
      <Sprite start={13.6} end={21.4}><SceneFines/></Sprite>
      <Sprite start={21.4} end={27.4}><SceneRealWorld/></Sprite>
      <Sprite start={27.4} end={32}><SceneOutro/></Sprite>

      {/* Progress dot indicator (always visible, subtle) */}
      <ChapterDots />
    </React.Fragment>
  );
}

function ChapterDots() {
  const t = useTime();
  const chapters = [
    { start: 0, end: 4.2, label: 'Intro' },
    { start: 4.2, end: 9.4, label: 'What' },
    { start: 9.4, end: 13.6, label: 'Who' },
    { start: 13.6, end: 21.4, label: 'Fines' },
    { start: 21.4, end: 27.4, label: 'Cost' },
    { start: 27.4, end: 32, label: 'Shieldra' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 32, left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '10px 18px',
      background: 'rgba(15, 23, 42, 0.55)',
      border: '1px solid rgba(148,163,184,0.18)',
      borderRadius: 999,
      backdropFilter: 'blur(20px)',
      zIndex: 10,
    }}>
      {chapters.map((c, i) => {
        const active = t >= c.start && t < c.end;
        const past = t >= c.end;
        return (
          <div key={i} style={{
            width: active ? 32 : 8,
            height: 8,
            borderRadius: 999,
            background: active ? BRAND.accent400 : (past ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.18)'),
            transition: 'width 0.4s, background 0.4s',
          }}/>
        );
      })}
    </div>
  );
}

Object.assign(window, { HipaaVideo });
