// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 7: How Shieldra automates SOC 2
// 200s → 222s

function SceneShieldra({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.5);
        const tOut = localTime > duration - 0.5 ? (localTime - (duration - 0.5)) / 0.5 : 0;
        const opacity = tIn * (1 - tOut);

        return (
          <div style={{
            position: 'absolute', inset: 0, opacity,
            padding: '100px 120px',
          }}>
            <DeepBg variant="light"/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Anim delay={0.1}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <LogoMark size={44}/>
                  <Eyebrow color="#0891b2">06 · Shieldra for SOC 2</Eyebrow>
                </div>
              </Anim>
              <Anim delay={0.3}>
                <div style={{ marginTop: 20 }}>
                  <Headline text="SOC 2, {automated end-to-end}." accent="automated end-to-end" size={76}/>
                </div>
              </Anim>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, marginTop: 56,
              display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Anim delay={0.7}>
                  <FeatureRow icon="scan" title="Continuous control monitoring" body="324 controls watched 24/7 across AWS, Okta, GitHub, and your HR stack. Drift is flagged the moment it happens."/>
                </Anim>
                <Anim delay={1.0}>
                  <FeatureRow icon="brain" title="Evidence collected automatically" body="Screenshots, logs, access reviews, policy attestations — pulled on a schedule, timestamped, audit-ready." color="violet"/>
                </Anim>
                <Anim delay={1.3}>
                  <FeatureRow icon="file" title="Audit-ready report workspace" body="Every finding links to evidence. Your auditor logs in, samples, signs off. No more 3am Dropbox hunts." color="brand"/>
                </Anim>
              </div>

              <Anim delay={1.6}>
                <ScoreGauge/>
              </Anim>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function FeatureRow({ icon, title, body, color = 'accent' }) {
  const c = { accent: '#06b6d4', violet: '#7c3aed', brand: '#2563eb' }[color];
  const iconSvg = {
    scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></>,
    brain: <><path d="M12 5a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z"/><path d="M9 8a3 3 0 1 0 0 6"/><path d="M15 8a3 3 0 1 1 0 6"/></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="m9 15 2 2 4-4"/></>,
  }[icon];
  return (
    <div style={{
      padding: '22px 26px',
      background: '#fff',
      border: `1px solid ${c}33`,
      borderRadius: 16,
      display: 'flex', gap: 18, alignItems: 'flex-start',
      boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    }}>
      <div style={{
        flexShrink: 0,
        width: 48, height: 48, borderRadius: 12,
        background: `${c}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {iconSvg}
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 21, fontWeight: 700, color: '#020617', letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 16, lineHeight: 1.55, color: '#475569' }}>{body}</div>
      </div>
    </div>
  );
}

function ScoreGauge() {
  const { localTime } = useSprite();
  const target = 94;
  const t = Math.min(1, Math.max(0, (localTime - 1.6) / 1.6));
  const eased = 1 - Math.pow(1 - t, 3);
  const val = target * eased;
  const r = 130;
  const circ = 2 * Math.PI * r;
  const pct = val / 100;
  const dash = circ * pct;

  return (
    <div style={{
      padding: '48px 40px',
      background: '#fff',
      border: '1px solid rgba(34,211,238,0.3)',
      borderRadius: 28,
      boxShadow: '0 30px 80px rgba(6,182,212,0.15)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(6,182,212,0.06), transparent 60%)',
      }}/>
      <div style={{
        fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: '#0891b2',
      }}>SOC 2 · Compliance Score</div>

      <div style={{ position: 'relative', marginTop: 24, width: 320, height: 320 }}>
        <svg width="320" height="320" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r={r} fill="none" stroke="#e2e8f0" strokeWidth="18"/>
          <circle cx="160" cy="160" r={r} fill="none"
            stroke="url(#gaugeGrad)" strokeWidth="18" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform="rotate(-90 160 160)"/>
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 88, fontWeight: 800, color: '#020617',
            letterSpacing: '-0.04em', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>{Math.round(val)}</div>
          <div style={{ fontSize: 20, color: '#64748b', marginTop: 4 }}>/ 100</div>
        </div>
      </div>

      <div style={{
        marginTop: 16,
        display: 'flex', gap: 24,
        fontSize: 14, color: '#475569',
      }}>
        <div><span style={{ color: '#22c55e', fontWeight: 700 }}>●</span> 312 passing</div>
        <div><span style={{ color: '#eab308', fontWeight: 700 }}>●</span> 9 monitoring</div>
        <div><span style={{ color: '#ef4444', fontWeight: 700 }}>●</span> 3 at risk</div>
      </div>
    </div>
  );
}

window.SceneShieldra = SceneShieldra;
