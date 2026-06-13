// Shared primitives for Shieldra demo video scenes.
// Assumes animations.jsx has been loaded (provides Stage, Sprite, useTime,
// useSprite, Easing, interpolate, animate).

const BRAND = {
  brand50: '#eff6ff',
  brand100: '#dbeafe',
  brand200: '#bfdbfe',
  brand400: '#60a5fa',
  brand500: '#3b82f6',
  brand600: '#2563eb',
  brand700: '#1d4ed8',
  violet50: '#f5f3ff',
  violet100: '#ede9fe',
  violet200: '#ddd6fe',
  violet400: '#a78bfa',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  accent50: '#ecfeff',
  accent100: '#cffafe',
  accent400: '#22d3ee',
  accent500: '#06b6d4',
  accent600: '#0891b2',
  accent700: '#0e7490',
  surface0: '#ffffff',
  surface50: '#f8fafc',
  surface100: '#f1f5f9',
  surface200: '#e2e8f0',
  surface300: '#cbd5e1',
  surface400: '#94a3b8',
  surface500: '#64748b',
  surface600: '#475569',
  surface700: '#334155',
  surface800: '#1e293b',
  surface900: '#0f172a',
  surface950: '#020617',
  success: '#22c55e',
  warning: '#eab308',
  high: '#f97316',
  danger: '#ef4444',
};

const FONT = `'Inter', system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, monospace`;

const GRADIENT_TEXT = {
  backgroundImage: `linear-gradient(90deg, ${BRAND.brand600}, ${BRAND.violet600}, ${BRAND.brand600})`,
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  animation: 'gradientShift 6s linear infinite',
};

// Mesh gradient background — echoes landing .mesh-bg
function MeshBg({ tone = 'light' }) {
  const bgColor = tone === 'dark' ? BRAND.surface950 : BRAND.surface50;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: bgColor,
      backgroundImage: tone === 'dark' ? `
        radial-gradient(at 20% 15%, rgba(59,130,246,0.18) 0%, transparent 45%),
        radial-gradient(at 80% 10%, rgba(139,92,246,0.16) 0%, transparent 50%),
        radial-gradient(at 90% 75%, rgba(6,182,212,0.14) 0%, transparent 50%),
        radial-gradient(at 15% 80%, rgba(124,58,237,0.12) 0%, transparent 50%),
        radial-gradient(at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 60%)
      ` : `
        radial-gradient(at 15% 20%, rgba(59,130,246,0.10) 0%, transparent 45%),
        radial-gradient(at 85% 15%, rgba(139,92,246,0.10) 0%, transparent 50%),
        radial-gradient(at 85% 80%, rgba(6,182,212,0.08) 0%, transparent 55%),
        radial-gradient(at 20% 85%, rgba(124,58,237,0.06) 0%, transparent 50%),
        radial-gradient(at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)
      `,
    }}>
      {/* dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35,
        backgroundImage: `radial-gradient(circle, ${tone === 'dark' ? '#1e293b' : '#cbd5e1'} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
    </div>
  );
}

// Animated vertical beams like hero
function Beams({ count = 6 }) {
  const t = useTime();
  const beams = Array.from({ length: count }, (_, i) => ({
    left: `${8 + i * (84 / count)}%`,
    delay: i * 0.7,
    dur: 4.5 + (i % 3) * 0.6,
    height: 260 + (i % 3) * 60,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {beams.map((b, i) => {
        const cycle = ((t + b.delay) % b.dur) / b.dur;
        const y = -b.height + cycle * (1080 + b.height);
        const op = cycle < 0.1 ? cycle * 10 : cycle > 0.9 ? (1 - cycle) * 10 : 1;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: b.left,
            top: y,
            width: 1,
            height: b.height,
            background: `linear-gradient(to bottom, transparent, rgba(96,165,250,0.45), transparent)`,
            opacity: op * 0.8,
          }} />
        );
      })}
    </div>
  );
}

// Soft blurred orbs drifting around
function DriftOrbs({ tone = 'light' }) {
  const t = useTime();
  const orbs = [
    { x: 200, y: 160, size: 520, color: 'rgba(59,130,246,0.18)', speed: 0.6 },
    { x: 1500, y: 200, size: 460, color: 'rgba(139,92,246,0.16)', speed: 0.4 },
    { x: 1600, y: 850, size: 420, color: 'rgba(6,182,212,0.14)', speed: 0.5 },
    { x: 250, y: 880, size: 460, color: 'rgba(124,58,237,0.10)', speed: 0.45 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {orbs.map((o, i) => {
        const dx = Math.sin(t * o.speed + i) * 60;
        const dy = Math.cos(t * o.speed * 0.7 + i) * 40;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: o.x + dx - o.size / 2,
            top: o.y + dy - o.size / 2,
            width: o.size,
            height: o.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }} />
        );
      })}
    </div>
  );
}

// Eyebrow pill
function Eyebrow({ icon, label, color = 'brand' }) {
  const themes = {
    brand:  { bg: BRAND.brand50, text: BRAND.brand700, ring: BRAND.brand100 },
    violet: { bg: BRAND.violet50, text: BRAND.violet600, ring: '#ddd6fe' },
    accent: { bg: BRAND.accent50, text: BRAND.accent700, ring: BRAND.accent100 },
    dark:   { bg: 'rgba(139,92,246,0.15)', text: '#c4b5fd', ring: 'rgba(139,92,246,0.25)' },
  };
  const th = themes[color] || themes.brand;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '10px 18px',
      borderRadius: 9999,
      background: th.bg,
      border: `1px solid ${th.ring}`,
      color: th.text,
      fontSize: 18,
      fontWeight: 700,
      fontFamily: FONT,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

// Scene title + subtitle block that fades in on progress
function SceneTitle({ eyebrow, title, gradientWord, subtitle, progress, tone = 'light', color = 'brand' }) {
  const o1 = Math.min(1, progress * 6);
  const o2 = Math.min(1, Math.max(0, progress * 6 - 0.8));
  const o3 = Math.min(1, Math.max(0, progress * 6 - 1.6));
  const y1 = (1 - o1) * 24;
  const y2 = (1 - o2) * 24;
  const y3 = (1 - o3) * 24;
  const titleColor = tone === 'dark' ? '#f8fafc' : BRAND.surface900;
  const subColor = tone === 'dark' ? '#cbd5e1' : BRAND.surface500;
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ opacity: o1, transform: `translateY(${y1}px)` }}>
        {eyebrow && <Eyebrow icon={eyebrow.icon} label={eyebrow.label} color={color} />}
      </div>
      <h1 style={{
        opacity: o2, transform: `translateY(${y2}px)`,
        margin: '24px 0 0 0',
        fontSize: 84,
        fontWeight: 800,
        letterSpacing: '-0.025em',
        lineHeight: 1.05,
        color: titleColor,
        maxWidth: 1000,
      }}>
        {title}
        {gradientWord && (
          <>
            {' '}
            <span style={GRADIENT_TEXT}>{gradientWord}</span>
          </>
        )}
      </h1>
      {subtitle && (
        <p style={{
          opacity: o3, transform: `translateY(${y3}px)`,
          marginTop: 28,
          fontSize: 26,
          lineHeight: 1.5,
          color: subColor,
          maxWidth: 820,
          fontWeight: 400,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Generic glass card
function GlassCard({ children, style = {}, tone = 'light' }) {
  const bg = tone === 'dark' ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.88)';
  const border = tone === 'dark' ? 'rgba(148,163,184,0.18)' : 'rgba(255,255,255,0.6)';
  return (
    <div style={{
      background: bg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid ${border}`,
      borderRadius: 24,
      boxShadow: '0 24px 60px -20px rgba(15,23,42,0.25), 0 2px 8px rgba(15,23,42,0.05)',
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      {/* gradient rim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(59,130,246,0.10), transparent 40%, rgba(139,92,246,0.10))',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// Lucide-like inline SVG icon (stroke=currentColor)
const Icon = ({ d, size = 24, strokeWidth = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={strokeWidth}
       strokeLinecap="round" strokeLinejoin="round">
    {children || <path d={d} />}
  </svg>
);

const Icons = {
  Shield: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Icon>,
  ShieldCheck: (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Icon>,
  Sparkles: (p) => <Icon {...p}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></Icon>,
  FileSearch: (p) => <Icon {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="m13.5 16.5 2 2"/></Icon>,
  Activity: (p) => <Icon {...p}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.5.5 0 0 1-.96 0L9.68 3.18a.5.5 0 0 0-.96 0l-2.35 8.36A2 2 0 0 1 4.44 13H2"/></Icon>,
  Bot: (p) => <Icon {...p}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></Icon>,
  Brain: (p) => <Icon {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></Icon>,
  Network: (p) => <Icon {...p}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></Icon>,
  FolderCheck: (p) => <Icon {...p}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="m9 13 2 2 4-4"/></Icon>,
  TrendingUp: (p) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>,
  Cloud: (p) => <Icon {...p}><path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 4 14.9"/></Icon>,
  Server: (p) => <Icon {...p}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/></Icon>,
  Database: (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></Icon>,
  Check: (p) => <Icon {...p} strokeWidth={3}><polyline points="20 6 9 17 4 12"/></Icon>,
  Zap: (p) => <Icon {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Icon>,
  ArrowRight: (p) => <Icon {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Icon>,
  Radar: (p) => <Icon {...p}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></Icon>,
  RefreshCw: (p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></Icon>,
  Lock: (p) => <Icon {...p}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
  AlertTriangle: (p) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>,
  Loader: (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-6.22-8.56"/></Icon>,
  GraduationCap: (p) => <Icon {...p}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Icon>,
};

// Simple shield logo mark
function ShieldLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.brand500}/>
          <stop offset="100%" stopColor={BRAND.violet600}/>
        </linearGradient>
      </defs>
      <path d="M40 6 L68 16 V38 C68 54 40 72 40 72 C40 72 12 54 12 38 V16 Z"
        fill="url(#shieldGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <path d="M28 40 L36 48 L52 32" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
window.ShieldLogo = ShieldLogo;

Object.assign(window, {
  BRAND, FONT, MONO, GRADIENT_TEXT,
  MeshBg, Beams, DriftOrbs,
  Eyebrow, SceneTitle, GlassCard,
  Icon, Icons,
});
