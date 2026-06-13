// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Shared building blocks for all scenes — backgrounds, eyebrows, glass cards.

// ───────── Background: mesh + dot grid + drifting orbs + beams
function DeepBg({ variant = 'light' }) {
  const t = useTime();
  // gentle drift for orbs
  const drift = (seed, speed = 18) => {
    const p = (t / speed + seed) % 1;
    const x = Math.sin(p * Math.PI * 2) * 40;
    const y = Math.cos(p * Math.PI * 2) * 30;
    const s = 1 + Math.sin(p * Math.PI * 2 + seed) * 0.12;
    return { x, y, s };
  };
  const o1 = drift(0.1, 22);
  const o2 = drift(0.45, 26);
  const o3 = drift(0.8, 20);

  const isDark = variant === 'dark';
  const base = isDark
    ? 'linear-gradient(180deg, #0C1222 0%, #0f172a 60%, #0b1120 100%)'
    : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)';

  return (
    <div style={{ position: 'absolute', inset: 0, background: base, overflow: 'hidden' }}>
      {/* Dot pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: isDark
          ? 'radial-gradient(circle, rgba(148,163,184,0.18) 1px, transparent 1px)'
          : 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: isDark ? 0.25 : 0.35,
      }}/>
      {/* Drifting orbs */}
      <div style={{
        position: 'absolute', left: `${15 + o1.x}%`, top: `${20 + o1.y * 0.4}%`,
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)',
        filter: 'blur(60px)', transform: `scale(${o1.s})`,
      }}/>
      <div style={{
        position: 'absolute', right: `${10 + o2.x}%`, top: `${30 + o2.y * 0.3}%`,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)',
        filter: 'blur(80px)', transform: `scale(${o2.s})`,
      }}/>
      <div style={{
        position: 'absolute', left: `${40 + o3.x}%`, bottom: `${15 + o3.y * 0.3}%`,
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.16), transparent 70%)',
        filter: 'blur(70px)', transform: `scale(${o3.s})`,
      }}/>
      {/* Vertical beams */}
      {[0.12, 0.28, 0.52, 0.72, 0.88].map((x, i) => {
        const p = ((t + i * 0.7) / 4) % 1;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x * 100}%`, top: `${-10 + p * 110}%`,
            width: 1, height: '22%',
            background: `linear-gradient(180deg, transparent, ${isDark ? 'rgba(34,211,238,0.55)' : 'rgba(59,130,246,0.4)'}, transparent)`,
            opacity: 0.6,
          }}/>
        );
      })}
      {/* Noise-ish vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
          : 'radial-gradient(ellipse at center, transparent 60%, rgba(15,23,42,0.05) 100%)',
      }}/>
    </div>
  );
}

// ───────── Eyebrow label
function Eyebrow({ children, color = 'var(--accent-500)' }) {
  return (
    <div style={{
      fontSize: 18, fontWeight: 600,
      letterSpacing: '0.22em', textTransform: 'uppercase',
      color,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 28, height: 1, background: color, opacity: 0.6,
      }}/>
      {children}
    </div>
  );
}

// ───────── Headline with optional gradient word
function Headline({ text, accent = null, size = 92, dark = false }) {
  const parts = accent ? text.split(accent) : [text];
  return (
    <h1 style={{
      fontSize: size, fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.05,
      color: dark ? '#f1f5f9' : '#020617',
      textWrap: 'balance',
      margin: 0,
    }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < parts.length - 1 && (
            <span style={{
              background: 'linear-gradient(90deg, #2563eb, #7c3aed, #06b6d4)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 8s ease infinite',
            }}>{accent}</span>
          )}
        </React.Fragment>
      ))}
    </h1>
  );
}

// ───────── Glass card
function GlassCard({ children, style, dark = false }) {
  return (
    <div style={{
      position: 'relative',
      background: dark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: dark ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(255,255,255,0.6)',
      borderRadius: 24,
      boxShadow: dark
        ? '0 20px 60px rgba(0,0,0,0.4)'
        : '0 20px 60px rgba(15,23,42,0.08)',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08), transparent 50%, rgba(139,92,246,0.08))',
      }}/>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

// ───────── AI / Sparkle pill
function Pill({ children, variant = 'brand' }) {
  const grads = {
    brand: 'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
    accent: 'linear-gradient(90deg, #0891b2, #06b6d4)',
    subtle: 'rgba(148,163,184,0.12)',
  };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 18px',
      background: grads[variant],
      backgroundSize: '200% 100%',
      color: variant === 'subtle' ? 'var(--fg-muted)' : '#fff',
      borderRadius: 9999,
      fontSize: 14, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      animation: variant !== 'subtle' ? 'gradient-shift 8s ease infinite' : 'none',
      boxShadow: variant !== 'subtle' ? '0 8px 24px rgba(37,99,235,0.25)' : 'none',
    }}>
      {children}
    </div>
  );
}

// ───────── Logo mark (SVG inline, small)
function LogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C1222"/>
          <stop offset="100%" stopColor="#162032"/>
        </linearGradient>
        <linearGradient id="lm-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06B6D4"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="26" fill="url(#lm-bg)"/>
      <path d="M60 18L28 34V60C28 78 41 93 60 98C79 93 92 78 92 60V34L60 18Z" stroke="url(#lm-g1)" strokeWidth="2" fill="none" opacity="0.5"/>
      {[
        [60,30,4,1],[45,42,3.5,0.8],[60,42,3.5,1],[75,42,3.5,0.8],
        [38,55,3,0.6],[52,55,3.5,0.9],[68,55,3.5,0.9],[82,55,3,0.6],
        [45,68,3,0.7],[60,68,4,1],[75,68,3,0.7],
        [52,80,2.5,0.5],[60,80,3,0.7],[68,80,2.5,0.5],[60,90,2,0.4],
      ].map(([x,y,r,o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#22D3EE" opacity={o}/>
      ))}
    </svg>
  );
}

// ───────── Animated counter
function Counter({ to, suffix = '', duration = 1.2, decimals = 0, start = 0 }) {
  const { localTime } = useSprite();
  const t = Math.min(1, Math.max(0, (localTime - start) / duration));
  const eased = 1 - Math.pow(1 - t, 3);
  const val = to * eased;
  return <>{decimals ? val.toFixed(decimals) : Math.round(val)}{suffix}</>;
}

// ───────── Caption bar (bottom)
function Caption({ text, show = true }) {
  if (!text) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 56,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: 1400,
      padding: '18px 32px',
      background: 'rgba(2,6,23,0.82)',
      color: '#f1f5f9',
      fontSize: 28, fontWeight: 500,
      lineHeight: 1.35,
      textAlign: 'center',
      borderRadius: 12,
      textWrap: 'balance',
      backdropFilter: 'blur(8px)',
      opacity: show ? 1 : 0,
      transition: 'opacity 200ms',
      pointerEvents: 'none',
      fontFeatureSettings: '"cv02","cv03","cv11"',
    }}>
      {text}
    </div>
  );
}

Object.assign(window, {
  DeepBg, Eyebrow, Headline, GlassCard, Pill, LogoMark, Counter, Caption,
});
