import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Faithful port of logo-anomation/project/scene.jsx (the design handoff).
// Canvas: 1280x720, 10s timeline rendered deterministically by Remotion.

// ── Logo node positions (viewBox 0..120) ──
const LOGO_NODES = [
  { x: 60, y: 30, r: 4.0, op: 1.0 },
  { x: 45, y: 42, r: 3.5, op: 0.9 },
  { x: 60, y: 42, r: 3.5, op: 1.0 },
  { x: 75, y: 42, r: 3.5, op: 0.9 },
  { x: 38, y: 55, r: 3.0, op: 0.7 },
  { x: 52, y: 55, r: 3.5, op: 1.0 },
  { x: 68, y: 55, r: 3.5, op: 1.0 },
  { x: 82, y: 55, r: 3.0, op: 0.7 },
  { x: 45, y: 68, r: 3.0, op: 0.8 },
  { x: 60, y: 68, r: 4.0, op: 1.0 },
  { x: 75, y: 68, r: 3.0, op: 0.8 },
  { x: 52, y: 80, r: 2.5, op: 0.6 },
  { x: 60, y: 80, r: 3.0, op: 0.8 },
  { x: 68, y: 80, r: 2.5, op: 0.6 },
  { x: 60, y: 90, r: 2.0, op: 0.5 },
];

const LOGO_LINES: [number, number][] = [
  [0, 1], [0, 3], [0, 2], [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
  [5, 8], [5, 9], [6, 9], [6, 10], [8, 11], [9, 12], [10, 13], [12, 14],
];

const CW = 1280;
const CH = 720;
const LOGO_SIZE = 520;
const LOGO_X = (CW - LOGO_SIZE) / 2;
const LOGO_Y = (CH - LOGO_SIZE) / 2 - 20;
const LOGO_SCALE = LOGO_SIZE / 120;

const nodeCanvasX = (lx: number) => LOGO_X + lx * LOGO_SCALE;
const nodeCanvasY = (ly: number) => LOGO_Y + ly * LOGO_SCALE;
const nodeCanvasR = (lr: number) => lr * LOGO_SCALE;

const SHIELD_PATH =
  "M60 18L28 34V60C28 78 41 93 60 98C79 93 92 78 92 60V34L60 18Z";
const SHIELD_PATH_LEN = 285;

// ── Helpers ──
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

const easeOutCubic = (t: number) => {
  const u = t - 1;
  return u * u * u + 1;
};

function seededRand(seed: number) {
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ── Starfield particles (220) ──
const NUM_STARS = 220;
const STARS = Array.from({ length: NUM_STARS }, (_, i) => {
  const r1 = seededRand(i * 7 + 1);
  const r2 = seededRand(i * 7 + 2);
  const r3 = seededRand(i * 7 + 3);
  const r4 = seededRand(i * 7 + 4);
  const r5 = seededRand(i * 7 + 5);
  const r6 = seededRand(i * 7 + 6);
  return {
    id: i,
    seedX: r1,
    seedY: r2,
    angle: r3 * Math.PI * 2,
    speed: 40 + r4 * 180,
    size: 0.6 + r5 * 2.4,
    twinkle: r6,
    cyan: r6 > 0.7,
  };
});

function starPosition(star: (typeof STARS)[number], t: number) {
  const margin = 120;
  const startX = star.seedX * (CW + margin * 2) - margin;
  const startY = star.seedY * (CH + margin * 2) - margin;
  const vx = Math.cos(star.angle) * star.speed;
  const vy = Math.sin(star.angle) * star.speed;
  let x = startX + vx * t;
  let y = startY + vy * t;
  const wW = CW + margin * 2;
  const wH = CH + margin * 2;
  x = (((x + margin) % wW) + wW) % wW - margin;
  y = (((y + margin) % wH) + wH) % wH - margin;
  return { x, y };
}

function heroChaosPosition(i: number, t: number) {
  const ax = seededRand(i * 11 + 100);
  const ay = seededRand(i * 11 + 200);
  const sp = seededRand(i * 11 + 300);
  const ph = seededRand(i * 11 + 400) * Math.PI * 2;
  const dir = seededRand(i * 11 + 500) * Math.PI * 2;

  const startX = ax * CW;
  const startY = ay * CH;

  const speed = 60 + sp * 100;
  const x =
    startX +
    Math.cos(dir) * speed * t * 0.5 +
    Math.cos(t * (0.6 + sp) + ph) * 40;
  const y =
    startY +
    Math.sin(dir) * speed * t * 0.5 +
    Math.sin(t * (0.8 + sp) * 1.3 + ph) * 35;

  const boundX = Math.max(-60, Math.min(CW + 60, x));
  const boundY = Math.max(-60, Math.min(CH + 60, y));
  return { x: boundX, y: boundY };
}

function heroChaosRadius(i: number, t: number) {
  const base = 2.5 + seededRand(i + 31) * 2.5;
  const pulse = 1 + Math.sin(t * 2 + i) * 0.15;
  return base * pulse;
}

export const LogoAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // ── Phase markers ──
  const chaosEnd = 3.2;
  const convergeEnd = 4.8;
  const shieldEnd = 5.8;
  const linesEnd = 6.6;
  const totalDur = 10.0;
  const flickerStart = 8.0;

  const convergeT =
    t < chaosEnd
      ? 0
      : t > convergeEnd
        ? 1
        : easeInOutCubic((t - chaosEnd) / (convergeEnd - chaosEnd));

  const starOpacity =
    t < chaosEnd
      ? 1
      : t > convergeEnd + 0.4
        ? 0
        : 1 -
          easeInOutCubic(
            clamp((t - chaosEnd) / (convergeEnd + 0.4 - chaosEnd), 0, 1)
          );

  const nebulaOpacity =
    t < chaosEnd
      ? 1
      : t > convergeEnd
        ? 0.25
        : 1 - 0.75 * easeInOutCubic((t - chaosEnd) / (convergeEnd - chaosEnd));

  const shieldT =
    t < convergeEnd
      ? 0
      : t > shieldEnd
        ? 1
        : easeOutCubic((t - convergeEnd) / (shieldEnd - convergeEnd));

  const linesT =
    t < shieldEnd
      ? 0
      : t > linesEnd
        ? 1
        : easeOutCubic((t - shieldEnd) / (linesEnd - shieldEnd));

  const revealT =
    t < linesEnd
      ? 0
      : t > totalDur
        ? 1
        : easeOutCubic(clamp((t - linesEnd) / 1.2, 0, 1));

  const finalHold = clamp(
    (t - linesEnd) / Math.max(0.1, totalDur - linesEnd),
    0,
    1
  );

  // Single neon glow pulse on the shield border
  let glowPulse = 0;
  if (t >= flickerStart) {
    const ft = t - flickerStart;
    const pulseDur = 1.4;
    if (ft <= pulseDur) {
      glowPulse = Math.sin((ft / pulseDur) * Math.PI);
    }
  }

  const dots = LOGO_NODES.map((target, i) => {
    const chaos = heroChaosPosition(i, t);
    const cR = heroChaosRadius(i, t);

    const stagger = (i % 5) * 0.05;
    const localConv = clamp(
      (convergeT - stagger) / (1 - stagger * 0.5),
      0,
      1
    );
    const eased = easeInOutCubic(localConv);

    const tx = nodeCanvasX(target.x);
    const ty = nodeCanvasY(target.y);
    const tr = nodeCanvasR(target.r);

    const x = chaos.x + (tx - chaos.x) * eased;
    const y = chaos.y + (ty - chaos.y) * eased;
    const r = cR + (tr - cR) * eased;
    const op = 0.85 + (target.op - 0.85) * eased;

    const settleHover =
      finalHold > 0 ? Math.sin(t * 1.4 + i * 0.5) * 0.8 * finalHold : 0;

    return { x, y: y + settleHover, r, op, key: i };
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, #050a18 0%, #02040c 70%, #000004 100%)",
        overflow: "hidden",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Nebula / smoke layers */}
      <div
        style={{
          position: "absolute",
          left: `${30 + Math.sin(t * 0.2) * 6}%`,
          top: `${40 + Math.cos(t * 0.15) * 5}%`,
          width: 900,
          height: 900,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 60%)",
          filter: "blur(50px)",
          opacity: 0.6 * nebulaOpacity + 0.15,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${70 + Math.cos(t * 0.18) * 5}%`,
          top: `${55 + Math.sin(t * 0.22) * 4}%`,
          width: 820,
          height: 820,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0) 60%)",
          filter: "blur(60px)",
          opacity: 0.7 * nebulaOpacity + 0.12,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${50 + Math.sin(t * 0.12) * 10}%`,
          top: `${30 + Math.cos(t * 0.1) * 6}%`,
          width: 1000,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0) 60%)",
          filter: "blur(70px)",
          opacity: 0.8 * nebulaOpacity + 0.08,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "75%",
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0) 60%)",
          filter: "blur(70px)",
          opacity: 0.8 * nebulaOpacity,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Subtle dot grid (after settle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.3 * revealT,
        }}
      />

      <svg
        width={CW}
        height={CH}
        viewBox={`0 0 ${CW} ${CH}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <radialGradient id="flake-white">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flake-cyan">
            <stop offset="0%" stopColor="#ecfeff" stopOpacity="1" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g-border" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="g-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C1222" />
            <stop offset="100%" stopColor="#162032" />
          </linearGradient>
          <linearGradient id="g-node" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <filter id="shieldGlow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background stars */}
        <g opacity={starOpacity}>
          {STARS.map((star) => {
            const p = starPosition(star, t);
            const twinkle =
              0.5 + 0.5 * Math.sin(t * (2 + star.twinkle * 3) + star.id);
            const op = (0.35 + 0.65 * star.twinkle) * twinkle;
            return (
              <circle
                key={`s${star.id}`}
                cx={p.x}
                cy={p.y}
                r={star.size}
                fill={star.cyan ? "url(#flake-cyan)" : "url(#flake-white)"}
                opacity={op}
              />
            );
          })}
        </g>

        {/* Card background + border (reveal) */}
        {revealT > 0 && (
          <g opacity={revealT}>
            <rect
              x={LOGO_X}
              y={LOGO_Y}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              rx={26 * LOGO_SCALE}
              fill="url(#g-bg)"
              fillOpacity={0.6 * revealT}
              stroke="url(#g-border)"
              strokeWidth={1.5 * LOGO_SCALE}
              strokeOpacity={0.55}
            />
          </g>
        )}

        {/* Inner glow disc behind dots once shield forms */}
        <circle
          cx={nodeCanvasX(60)}
          cy={nodeCanvasY(55)}
          r={20 * LOGO_SCALE}
          fill="#22D3EE"
          opacity={0.06 * shieldT}
        />

        {/* Shield outline */}
        <g transform={`translate(${LOGO_X}, ${LOGO_Y}) scale(${LOGO_SCALE})`}>
          {glowPulse > 0 && (
            <path
              d={SHIELD_PATH}
              stroke="#22D3EE"
              strokeWidth={1.5 + glowPulse * 2.5}
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={glowPulse * 0.7}
              filter="url(#shieldGlow)"
            />
          )}
          <path
            d={SHIELD_PATH}
            stroke="url(#g-border)"
            strokeWidth={1.5}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={Math.min(1, 0.55 * shieldT + glowPulse * 0.45)}
            strokeDasharray={SHIELD_PATH_LEN}
            strokeDashoffset={SHIELD_PATH_LEN * (1 - shieldT)}
            filter="url(#shieldGlow)"
          />
          {shieldT > 0 && shieldT < 1 && (
            <path
              d={SHIELD_PATH}
              stroke="#22D3EE"
              strokeWidth={2 + (1 - shieldT) * 4}
              fill="none"
              opacity={(1 - shieldT) * 0.6}
            />
          )}
        </g>

        {/* Connection lines */}
        {linesT > 0 &&
          LOGO_LINES.map(([a, b], idx) => {
            const A = LOGO_NODES[a];
            const B = LOGO_NODES[b];
            const ls = idx / LOGO_LINES.length;
            const localL = clamp((linesT - ls * 0.35) / 0.65, 0, 1);
            if (localL <= 0) return null;
            const ax = nodeCanvasX(A.x);
            const ay = nodeCanvasY(A.y);
            const bx = nodeCanvasX(B.x);
            const by = nodeCanvasY(B.y);
            const x2 = ax + (bx - ax) * localL;
            const y2 = ay + (by - ay) * localL;
            const baseOp = 0.4;
            return (
              <line
                key={`l${idx}`}
                x1={ax}
                y1={ay}
                x2={x2}
                y2={y2}
                stroke="#22D3EE"
                strokeWidth={1 * LOGO_SCALE}
                opacity={baseOp * localL}
                strokeLinecap="round"
              />
            );
          })}

        {/* Hero dots */}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="url(#g-node)"
            opacity={d.op}
          />
        ))}

        {/* Shockwave on shield completion */}
        {shieldT >= 1 && t < shieldEnd + 0.5 && (
          <circle
            cx={nodeCanvasX(60)}
            cy={nodeCanvasY(55)}
            r={50 + (t - shieldEnd) * 400}
            fill="none"
            stroke="#22D3EE"
            strokeWidth={3 * Math.max(0, 1 - (t - shieldEnd) / 0.5)}
            opacity={Math.max(0, 1 - (t - shieldEnd) / 0.5) * 0.5}
          />
        )}
      </svg>

      {/* Wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: LOGO_Y + LOGO_SIZE + 48,
          transform: `translateX(-50%) translateY(${(1 - revealT) * 16}px)`,
          opacity: revealT,
          textAlign: "center",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#f1f5f9",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #22D3EE, #3B82F6, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}
        >
          Shieldra
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(148,163,184,0.8)",
          }}
        >
          The regulatory AI that shields your business
        </div>
      </div>
    </AbsoluteFill>
  );
};
