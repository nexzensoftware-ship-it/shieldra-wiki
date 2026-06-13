// eslint-disable-next-line
const { useTime, useSprite, useTimeline, TimelineContext, SpriteContext, Sprite, Easing, clamp, interpolate, animate } = window;
// Scene 3: Why It Matters — enterprise unlock, breach stats
// 65s → 95s

function SceneWhy({ start, end }) {
  return (
    <Sprite start={start} end={end}>
      {({ localTime, duration }) => {
        const tIn = Math.min(1, localTime / 0.5);
        const tOut = localTime > duration - 0.5 ? (localTime - (duration - 0.5)) / 0.5 : 0;
        const opacity = tIn * (1 - tOut);

        return (
          <div style={{
            position: 'absolute', inset: 0,
            opacity,
            padding: '100px 120px',
            display: 'flex', flexDirection: 'column',
          }}>
            <DeepBg variant="dark"/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Anim delay={0.1}>
                <Eyebrow color="#22d3ee">02 · Why It Matters</Eyebrow>
              </Anim>
              <Anim delay={0.3}>
                <div style={{ marginTop: 24 }}>
                  <Headline
                    text="No SOC 2, no {enterprise deal}."
                    accent="enterprise deal"
                    size={88}
                    dark
                  />
                </div>
              </Anim>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, marginTop: 64,
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
            }}>
              <Anim delay={0.8}>
                <StatCard kpi={<><Counter to={4.88} decimals={2} duration={1.4}/>M</>} label="Avg. cost of a data breach (IBM, 2024)" hint="Per incident, globally" />
              </Anim>
              <Anim delay={1.1}>
                <StatCard kpi={<><Counter to={82} duration={1.4}/>%</>} label="Of enterprise buyers require SOC 2 before signing" hint="Procurement standard" />
              </Anim>
              <Anim delay={1.4}>
                <StatCard kpi={<><Counter to={6}/>–<Counter to={12} start={0.2}/></>} label="Months to get your first Type II report" hint="From kickoff to signed" />
              </Anim>
              <Anim delay={1.7}>
                <StatCard kpi={<>$<Counter to={50} duration={1.4}/>k+</>} label="Typical annual cost — audit + tooling + time" hint="Without automation" />
              </Anim>
            </div>

            <div style={{
              position: 'relative', zIndex: 1, marginTop: 64,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
            }}>
              <Anim delay={2.1}>
                <CheckCard
                  icon="lock"
                  title="Enterprise customers demand it"
                  body="Fortune 500 vendor risk teams won't even review your product without a current SOC 2 report on file."
                />
              </Anim>
              <Anim delay={2.4}>
                <CheckCard
                  icon="chart"
                  title="Sales cycles shrink by 40%"
                  body="Shorter security questionnaires, fewer 'can you fill out this 300-row spreadsheet?' delays."
                  color="violet"
                />
              </Anim>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

function StatCard({ kpi, label, hint }) {
  return (
    <div style={{
      padding: '28px 26px',
      background: 'rgba(15,23,42,0.75)',
      border: '1px solid rgba(34,211,238,0.25)',
      borderRadius: 18,
      backdropFilter: 'blur(20px)',
      minHeight: 200,
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(6,182,212,0.1)',
    }}>
      <div style={{
        fontSize: 56, fontWeight: 800,
        background: 'linear-gradient(135deg, #22d3ee, #60a5fa)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
      }}>{kpi}</div>
      <div style={{ marginTop: 12, fontSize: 17, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.4 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 13, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{hint}</div>
    </div>
  );
}

function CheckCard({ icon, title, body, color = 'accent' }) {
  const c = color === 'violet' ? '#a78bfa' : '#22d3ee';
  return (
    <div style={{
      padding: '28px 32px',
      background: 'rgba(15,23,42,0.6)',
      border: `1px solid ${c}44`,
      borderRadius: 18,
      display: 'flex', gap: 20, alignItems: 'flex-start',
    }}>
      <div style={{
        flexShrink: 0,
        width: 52, height: 52, borderRadius: 12,
        background: `${c}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon === 'lock' ? (
            <>
              <rect x="4" y="11" width="16" height="10" rx="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </>
          ) : (
            <>
              <path d="M3 3v18h18"/>
              <path d="M7 15l4-4 4 3 5-6"/>
            </>
          )}
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ marginTop: 8, fontSize: 17, lineHeight: 1.55, color: '#cbd5e1' }}>{body}</div>
      </div>
    </div>
  );
}

window.SceneWhy = SceneWhy;
