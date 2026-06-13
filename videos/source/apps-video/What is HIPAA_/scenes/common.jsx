// Shared primitives for the HIPAA video
// All scenes import these via window globals

const COLORS = {
  brand50: '#eff6ff', brand100: '#dbeafe', brand400: '#60a5fa',
  brand500: '#3b82f6', brand600: '#2563eb', brand700: '#1d4ed8',
  brand900: '#1e3a8a', brand950: '#0f1d4d',
  accent300: '#67e8f9', accent400: '#22d3ee', accent500: '#06b6d4', accent600: '#0891b2',
  violet400: '#a78bfa', violet500: '#8b5cf6', violet600: '#7c3aed',
  surface0: '#ffffff', surface50: '#f8fafc', surface100: '#f1f5f9',
  surface200: '#e2e8f0', surface300: '#cbd5e1', surface400: '#94a3b8',
  surface500: '#64748b', surface600: '#475569', surface700: '#334155',
  surface800: '#1e293b', surface900: '#0f172a', surface950: '#020617',
  success: '#22c55e', warning: '#eab308', high: '#f97316', danger: '#ef4444',
};

// Dark canvas background with mesh gradient orbs + dot pattern + noise
function DarkCanvas({ children, showBeams = true }) {
  const { progress } = useSprite();
  const t = useTime();
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #05091a 0%, #0b1228 60%, #0a0f24 100%)',
      overflow: 'hidden',
    }}>
      {/* Drifting orbs */}
      <div style={{
        position:'absolute', left: `${10 + Math.sin(t*0.3)*5}%`, top: `${15 + Math.cos(t*0.25)*4}%`,
        width: 520, height: 520, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(59,130,246,0.35), transparent 60%)',
        filter:'blur(60px)',
      }}/>
      <div style={{
        position:'absolute', right: `${5 + Math.cos(t*0.2)*4}%`, top: `${40 + Math.sin(t*0.18)*5}%`,
        width: 600, height: 600, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.28), transparent 60%)',
        filter:'blur(70px)',
      }}/>
      <div style={{
        position:'absolute', left: `${50 + Math.sin(t*0.15)*6}%`, bottom: `${-10 + Math.cos(t*0.22)*3}%`,
        width: 700, height: 700, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.22), transparent 60%)',
        filter:'blur(80px)',
      }}/>

      {/* Dot pattern */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'radial-gradient(circle, rgba(148,163,184,0.22) 1px, transparent 1px)',
        backgroundSize:'28px 28px',
        opacity: 0.5,
      }}/>

      {/* Vertical beams */}
      {showBeams && [0.18, 0.42, 0.71, 0.88].map((lx, i) => (
        <div key={i} style={{
          position:'absolute', left:`${lx*100}%`, top:0, bottom:0, width:1,
          background:`linear-gradient(180deg, transparent 0%, rgba(34,211,238,${0.15 + (i%2)*0.15}) ${20 + (t*10 + i*30)%60}%, transparent 100%)`,
          opacity: 0.8,
        }}/>
      ))}

      {/* Grain */}
      <div style={{
        position:'absolute', inset:0, opacity:0.04, mixBlendMode:'overlay',
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      }}/>

      {children}
    </div>
  );
}

// Glass card with soft gradient rim
function GlassCard({ x, y, width, height, children, style = {}, darkTheme = true, radius = 24 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      background: darkTheme ? 'rgba(15, 23, 42, 0.55)' : 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: darkTheme ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(255,255,255,0.5)',
      borderRadius: radius,
      boxShadow: darkTheme
        ? '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 20px 60px rgba(0,0,0,0.12)',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 50%, rgba(139,92,246,0.08) 100%)',
      }}/>
      <div style={{ position:'relative', width:'100%', height:'100%' }}>{children}</div>
    </div>
  );
}

// Gradient text span
function GText({ children, style }) {
  return <span style={{
    background: 'linear-gradient(90deg, #60a5fa, #22d3ee, #a78bfa)',
    WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
    ...style
  }}>{children}</span>;
}

// Eyebrow label
function Eyebrow({ children, color = '#22d3ee', style = {} }) {
  return <div style={{
    fontSize: 20, fontWeight: 700, letterSpacing: '0.2em',
    textTransform: 'uppercase', color, fontFamily:'Inter, sans-serif',
    ...style,
  }}>{children}</div>;
}

// Counter that animates from 0 to target within sprite
function Counter({ to, prefix = '', suffix = '', duration = 1.6, decimals = 0, ease = Easing.easeOutExpo }) {
  const { localTime } = useSprite();
  const t = clamp(localTime / duration, 0, 1);
  const v = to * ease(t);
  return <>{prefix}{v.toFixed(decimals)}{suffix}</>;
}

// Animated bar (horizontal fill)
function Bar({ x, y, width, height, progress, color = '#3b82f6', radius = 6, bg = 'rgba(148,163,184,0.15)' }) {
  return (
    <div style={{
      position:'absolute', left:x, top:y, width, height,
      background: bg, borderRadius: radius, overflow:'hidden',
    }}>
      <div style={{
        width: `${progress*100}%`, height:'100%',
        background: typeof color === 'string' ? color : 'linear-gradient(90deg, #3b82f6, #22d3ee)',
        borderRadius: radius,
        boxShadow: '0 0 16px rgba(59,130,246,0.5)',
        transition: 'none',
      }}/>
    </div>
  );
}

// Pulsing shield icon (SVG)
function ShieldIcon({ size = 160, color = '#22d3ee', pulse = true }) {
  const t = useTime();
  const s = pulse ? 1 + Math.sin(t*2)*0.04 : 1;
  return (
    <div style={{ width: size, height: size, transform:`scale(${s})`, transformOrigin:'center' }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="sgShield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee"/>
            <stop offset="60%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
        <path d="M50 8 L82 20 L82 50 C82 72 66 86 50 92 C34 86 18 72 18 50 L18 20 Z"
          fill="url(#sgShield)" opacity="0.95"/>
        <path d="M50 8 L82 20 L82 50 C82 72 66 86 50 92 C34 86 18 72 18 50 L18 20 Z"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6"/>
        <path d="M35 52 L45 62 L66 40" stroke="white" strokeWidth="5" fill="none"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// Background for light/white theme scenes
function LightCanvas({ children }) {
  return (
    <div style={{ position:'absolute', inset:0, background:'#f8fafc', overflow:'hidden' }}>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'radial-gradient(circle, rgba(203,213,225,0.9) 1px, transparent 1px)',
        backgroundSize:'24px 24px', opacity:0.4,
      }}/>
      <div style={{ position:'absolute', right:-200, top:-200, width:700, height:700, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(59,130,246,0.15), transparent 60%)', filter:'blur(40px)' }}/>
      <div style={{ position:'absolute', left:-200, bottom:-200, width:600, height:600, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.12), transparent 60%)', filter:'blur(40px)' }}/>
      {children}
    </div>
  );
}

Object.assign(window, { COLORS, DarkCanvas, GlassCard, GText, Eyebrow, Counter, Bar, ShieldIcon, LightCanvas });
