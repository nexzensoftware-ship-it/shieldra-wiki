// app.jsx — orchestrates logo intro → animated timeline → logo outro

// ───────── Script/captions timeline (seconds align with ANIMATED phase, not logo phases)
// The animated phase is 210s long (3:30). Logo intro + outro add 30s → 4:00 total.
const SCRIPT = [
  // Scene 1: Hook (0–15s in animated phase)
  { t: 0.5,  d: 3.5, text: "What is SOC 2? And why does every SaaS startup trip over it?" },
  { t: 4.5,  d: 4.5, text: "In the next few minutes, you'll understand exactly what it is, why it matters, and how to get one." },
  { t: 9.5,  d: 4.5, text: "Let's start with the definition everyone gets wrong." },

  // Scene 2: Definition (15–55s)
  { t: 15.5, d: 5, text: "SOC 2 is not a law. It's not a certification. It's an auditing standard." },
  { t: 21,   d: 5, text: "It was created by the AICPA — the same institute that audits public-company finances." },
  { t: 26.5, d: 5.5, text: "It applies to any company that stores, processes, or transmits customer data on their behalf." },
  { t: 32.5, d: 5, text: "A licensed CPA firm tests your controls against the standard." },
  { t: 38,   d: 5, text: "If you pass, they issue a signed report your customers can rely on." },
  { t: 43.5, d: 6, text: "That report is what you send to procurement when they ask, 'Are you SOC 2 compliant?'" },
  { t: 50,   d: 5, text: "In one sentence: it's how you prove you can be trusted with customer data." },

  // Scene 3: Why it matters (55–90s)
  { t: 56,   d: 5, text: "So why should you care? Because without SOC 2, enterprise deals stall." },
  { t: 61.5, d: 5.5, text: "IBM's 2024 report puts the average data breach cost at 4.88 million dollars." },
  { t: 67.5, d: 5.5, text: "Around 82 percent of enterprise buyers now require SOC 2 before they'll even consider a vendor." },
  { t: 73.5, d: 5, text: "Your first Type II report typically takes 6 to 12 months and runs 50 thousand dollars or more." },
  { t: 79,   d: 5.5, text: "But the upside is huge — SOC 2 unlocks Fortune 500 pipelines and shrinks sales cycles by around 40%." },
  { t: 85,   d: 5, text: "Fewer spreadsheets. Fewer legal reviews. Faster close." },

  // Scene 4: TSC (90–135s)
  { t: 91,   d: 5, text: "SOC 2 is built on five Trust Services Criteria." },
  { t: 96.5, d: 6, text: "Security is mandatory. Every SOC 2 report includes it — it's the common criteria." },
  { t: 103,  d: 6, text: "Availability covers uptime and disaster recovery — critical for platforms with SLAs." },
  { t: 109.5, d: 6, text: "Confidentiality protects data you've classified as confidential, like source code or contracts." },
  { t: 116,  d: 6, text: "Processing Integrity ensures your systems process data accurately — think payments or billing." },
  { t: 122.5, d: 6, text: "Privacy governs how you handle personal information, aligned with your privacy policy." },
  { t: 129,  d: 5, text: "You pick the criteria that match your business. You don't need all five." },

  // Scene 5: Type I vs II (135–165s)
  { t: 135.5, d: 5, text: "Now, two flavors of report: Type I and Type II." },
  { t: 141,  d: 5.5, text: "Type I is a snapshot. It asks, are your controls designed correctly — on one specific date?" },
  { t: 147,  d: 5, text: "It's faster and cheaper. Good as a stepping stone or for a first customer deal." },
  { t: 152.5, d: 6, text: "Type II is the real deal. It asks, do your controls operate correctly over three to twelve months?" },
  { t: 159,  d: 5, text: "This is what enterprise buyers want. And you renew it every single year." },

  // Scene 6: Audit process (165–195s)
  { t: 165.5, d: 5, text: "Here's what the journey actually looks like." },
  { t: 171,  d: 5, text: "First, readiness — a gap assessment to map what you already have." },
  { t: 176.5, d: 5, text: "Then remediation — writing policies, turning on MFA, wiring up alerts." },
  { t: 182,  d: 5, text: "Then the observation window — where controls must operate continuously." },
  { t: 187.5, d: 4, text: "Fieldwork — auditors sample evidence, interview your team." },
  { t: 191.5, d: 4, text: "And finally, the signed report. Which expires in 12 months." },

  // Scene 7: Shieldra (195–215s)
  { t: 196,  d: 4.5, text: "Here's the problem: most of this is manual. Screenshots. Spreadsheets. Slack threads." },
  { t: 201,  d: 5, text: "Shieldra automates it end-to-end — continuous monitoring, evidence collection, audit-ready reports." },
  { t: 206.5, d: 5, text: "Your compliance score updates in real time. Your auditor logs in, samples, signs off." },

  // Scene 8: Outro (215–225s)
  { t: 215.5, d: 5, text: "Weeks, not years. That's the Shieldra promise." },
  { t: 221,  d: 4, text: "Start your free trial at shieldra dot com. Thanks for watching." },
];

// ───────── Chapter marks for the scrubber
const CHAPTERS = [
  { t: 0,     label: 'INTRO' },
  { t: 10,    label: 'WHAT IS SOC 2' },
  { t: 25,    label: 'DEFINITION' },
  { t: 65,    label: 'WHY IT MATTERS' },
  { t: 100,   label: 'FIVE CRITERIA' },
  { t: 145,   label: 'TYPE I VS II' },
  { t: 175,   label: 'THE JOURNEY' },
  { t: 205,   label: 'SHIELDRA' },
  { t: 227,   label: 'OUTRO' },
];

// Animated phase scene start/end times (seconds within animated phase)
const SCENES_T = {
  hook:       [0,   15],
  definition: [15,  55],
  why:        [55,  90],
  tsc:        [90, 135],
  types:      [135, 165],
  audit:      [165, 195],
  shieldra:   [195, 215],
  outro:      [215, 225],
};

const INTRO_DUR = 10;    // logo video at start
const ANIM_DUR = 225;    // animated scenes total
const OUTRO_DUR = 15;    // logo video at end
const TOTAL = INTRO_DUR + ANIM_DUR + OUTRO_DUR; // 250s

// Default tweaks (EDITMODE block for host rewrites)
const TWEAKS = /*EDITMODE-BEGIN*/{
  "speed": 1,
  "captions": true,
  "logoVideo": true
}/*EDITMODE-END*/;

// ───────── Animated phase (the Stage)
function AnimatedPhase({ time }) {
  const TC = window.TimelineContext;
  const ctx = React.useMemo(() => ({ time, duration: ANIM_DUR, playing: true }), [time]);
  return (
    <TC.Provider value={ctx}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <SceneHook       start={SCENES_T.hook[0]}       end={SCENES_T.hook[1]}/>
        <SceneDefinition start={SCENES_T.definition[0]} end={SCENES_T.definition[1]}/>
        <SceneWhy        start={SCENES_T.why[0]}        end={SCENES_T.why[1]}/>
        <SceneTSC        start={SCENES_T.tsc[0]}        end={SCENES_T.tsc[1]}/>
        <SceneTypes      start={SCENES_T.types[0]}      end={SCENES_T.types[1]}/>
        <SceneAudit      start={SCENES_T.audit[0]}      end={SCENES_T.audit[1]}/>
        <SceneShieldra   start={SCENES_T.shieldra[0]}   end={SCENES_T.shieldra[1]}/>
        <SceneOutro      start={SCENES_T.outro[0]}      end={SCENES_T.outro[1]}/>
      </div>
    </TC.Provider>
  );
}

// ───────── Main app
function App() {
  const [time, setTime] = React.useState(() => {
    try { return parseFloat(localStorage.getItem('soc2vid:t') || '0') || 0; } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [tweaks, setTweaks] = React.useState(TWEAKS);
  const [tweaksVisible, setTweaksVisible] = React.useState(false);
  const [hoverIdle, setHoverIdle] = React.useState(false);

  const introVideoRef = React.useRef(null);
  const outroVideoRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);
  const idleTimerRef = React.useRef(null);

  // Scale 1920x1080 canvas to viewport
  React.useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      if (vw < 10 || vh < 10) return;
      setScale(Math.max(0.05, Math.min(vw / 1920, vh / 1080)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Persist
  React.useEffect(() => {
    try { localStorage.setItem('soc2vid:t', String(time)); } catch {}
  }, [time]);

  // Effective timeline — skip logo if tweak disables it
  const useLogo = tweaks.logoVideo;
  const effIntro = useLogo ? INTRO_DUR : 0;
  const effOutro = useLogo ? OUTRO_DUR : 0;
  const effTotal = effIntro + ANIM_DUR + effOutro;

  // Clamp time if tweak changed
  React.useEffect(() => {
    if (time > effTotal) setTime(effTotal);
  }, [effTotal]);

  // Phase calculation
  const phase = time < effIntro ? 'intro'
    : time < effIntro + ANIM_DUR ? 'anim'
    : 'outro';
  const animTime = Math.max(0, Math.min(ANIM_DUR, time - effIntro));
  const introTime = Math.max(0, Math.min(effIntro, time));
  const outroTime = Math.max(0, time - effIntro - ANIM_DUR);

  // Drive video elements by playhead (scrub-sync)
  React.useEffect(() => {
    const iv = introVideoRef.current;
    const ov = outroVideoRef.current;
    if (iv) {
      iv.playbackRate = tweaks.speed;
      try {
        const target = Math.min(iv.duration || effIntro, introTime);
        if (Math.abs((iv.currentTime || 0) - target) > 0.3) iv.currentTime = target;
      } catch {}
      if (phase === 'intro' && playing) iv.play().catch(() => {});
      else iv.pause();
    }
    if (ov) {
      ov.playbackRate = tweaks.speed;
      try {
        const target = Math.min(ov.duration || effOutro, outroTime);
        if (Math.abs((ov.currentTime || 0) - target) > 0.3) ov.currentTime = target;
      } catch {}
      if (phase === 'outro' && playing) ov.play().catch(() => {});
      else ov.pause();
    }
  }, [phase, playing, introTime, outroTime, tweaks.speed, effIntro, effOutro]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) { lastTsRef.current = null; return; }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt * tweaks.speed;
        if (next >= effTotal) {
          next = 0; // loop
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [playing, tweaks.speed, effTotal]);

  // Keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p); }
      else if (e.code === 'ArrowLeft')  { setTime(t => Math.max(0, t - (e.shiftKey ? 5 : 1))); }
      else if (e.code === 'ArrowRight') { setTime(t => Math.min(effTotal, t + (e.shiftKey ? 5 : 1))); }
      else if (e.code === 'Home' || e.key === '0') setTime(0);
      else if (e.key === 'c') setTweaks(t => ({ ...t, captions: !t.captions }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [effTotal]);

  // Mouse idle → hide chrome
  React.useEffect(() => {
    const reset = () => {
      setHoverIdle(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setHoverIdle(true), 3000);
    };
    reset();
    window.addEventListener('mousemove', reset);
    return () => {
      window.removeEventListener('mousemove', reset);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Caption lookup — uses animTime
  const currentCaption = React.useMemo(() => {
    if (phase !== 'anim') return null;
    const cur = SCRIPT.find(s => animTime >= s.t && animTime < s.t + s.d);
    return cur ? cur.text : null;
  }, [animTime, phase]);

  // Edit mode protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      const m = e.data;
      if (!m || typeof m !== 'object') return;
      if (m.type === '__activate_edit_mode') setTweaksVisible(true);
      else if (m.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweak = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*'); } catch {}
      return next;
    });
  };

  // Expose to DOM chrome
  React.useEffect(() => {
    window.__vid = { time, setTime, playing, setPlaying, effTotal, phase, animTime, effIntro };
  }, [time, playing, effTotal, phase, animTime, effIntro]);

  return (
    <div className="stage-wrap">
      <div
        className="stage-canvas"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Intro video */}
        <video
          ref={introVideoRef}
          className="logo-video phase"
          src="assets/shieldra-logo.mp4"
          playsInline muted
          style={{
            opacity: phase === 'intro' ? 1 : 0,
            pointerEvents: 'none',
            zIndex: phase === 'intro' ? 3 : 1,
          }}
        />
        {/* Animated phase */}
        <div className="phase" style={{
          position: 'absolute', inset: 0,
          opacity: phase === 'anim' ? 1 : 0,
          zIndex: phase === 'anim' ? 3 : 1,
        }}>
          <AnimatedPhase time={animTime}/>
        </div>
        {/* Outro video */}
        <video
          ref={outroVideoRef}
          className="logo-video phase"
          src="assets/shieldra-logo.mp4"
          playsInline muted
          style={{
            opacity: phase === 'outro' ? 1 : 0,
            pointerEvents: 'none',
            zIndex: phase === 'outro' ? 3 : 1,
          }}
        />
      </div>

      {/* Captions (outside canvas, over viewport) */}
      <div
        className={`captions ${!tweaks.captions || !currentCaption ? 'hidden' : ''}`}
        style={{ display: phase === 'anim' && tweaks.captions ? 'block' : 'none' }}
      >
        {currentCaption}
      </div>

      {/* Tweaks panel */}
      <TweaksPanel visible={tweaksVisible} tweaks={tweaks} update={updateTweak}/>
    </div>
  );
}

function TweaksPanel({ visible, tweaks, update }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20,
      width: 260,
      background: 'rgba(10, 15, 28, 0.94)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(148,163,184,0.18)',
      borderRadius: 14, padding: 18,
      color: '#e2e8f0', zIndex: 60,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      fontSize: 14,
    }}>
      <h4 style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#22d3ee' }}>Tweaks</h4>

      <TweakSeg label="Playback Speed"
        options={[{v:0.5,l:'0.5×'},{v:1,l:'1×'},{v:1.5,l:'1.5×'},{v:2,l:'2×'}]}
        value={tweaks.speed} onChange={v => update('speed', v)}/>
      <TweakSeg label="Captions"
        options={[{v:true,l:'On'},{v:false,l:'Off'}]}
        value={tweaks.captions} onChange={v => update('captions', v)}/>
      <TweakSeg label="Logo Intro + Outro"
        options={[{v:true,l:'Shown'},{v:false,l:'Skipped'}]}
        value={tweaks.logoVideo} onChange={v => update('logoVideo', v)}/>
      <div style={{
        marginTop: 10, paddingTop: 12,
        borderTop: '1px solid rgba(148,163,184,0.15)',
        fontSize: 11, color: '#64748b', lineHeight: 1.5,
      }}>
        Space = play/pause · ←/→ = seek · shift+← = jump 5s · C = captions
      </div>
    </div>
  );
}
function TweakSeg({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', background: 'rgba(148,163,184,0.1)', borderRadius: 8, padding: 3, gap: 2 }}>
        {options.map(o => (
          <button key={String(o.v)} onClick={() => onChange(o.v)} style={{
            flex: 1, padding: '6px 8px', border: 'none',
            background: value === o.v ? '#3b82f6' : 'transparent',
            color: value === o.v ? '#fff' : '#cbd5e1',
            fontSize: 13, cursor: 'pointer', borderRadius: 6,
            fontFamily: 'inherit', transition: 'background 120ms',
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

// ───────── Mount React
ReactDOM.createRoot(document.getElementById('app')).render(<App/>);

// ───────── Wire DOM chrome (outside React for simplicity)
(function initChrome() {
  const chrome = document.getElementById('chrome');
  const btnPlay = document.getElementById('btn-play');
  const btnReset = document.getElementById('btn-reset');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const track = document.getElementById('track');
  const trackFill = document.getElementById('track-fill');
  const trackThumb = document.getElementById('track-thumb');
  const timestamp = document.getElementById('timestamp');
  const chapterLabel = document.getElementById('chapter-label');
  const ticks = document.getElementById('chapter-ticks');
  const captions = document.getElementById('captions');

  const fmt = (s) => {
    s = Math.max(0, s);
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${String(ss).padStart(2,'0')}`;
  };

  // Chapter ticks rendered once (based on 250s default)
  const renderTicks = () => {
    ticks.innerHTML = '';
    const total = (window.__vid && window.__vid.effTotal) || 250;
    CHAPTERS.forEach(c => {
      const pct = (c.t / total) * 100;
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;left:${pct}%;width:2px;height:10px;top:5px;background:rgba(148,163,184,0.45);border-radius:1px;`;
      ticks.appendChild(el);
    });
  };
  setTimeout(renderTicks, 100);

  btnPlay.addEventListener('click', () => {
    if (!window.__vid) return;
    window.__vid.setPlaying(!window.__vid.playing);
  });
  btnReset.addEventListener('click', () => {
    if (!window.__vid) return;
    window.__vid.setTime(0);
  });

  // Track click/drag
  let dragging = false;
  const seekFromEvent = (e) => {
    if (!window.__vid) return;
    const r = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    window.__vid.setTime(x * window.__vid.effTotal);
  };
  track.addEventListener('mousedown', e => { dragging = true; seekFromEvent(e); });
  window.addEventListener('mousemove', e => { if (dragging) seekFromEvent(e); });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Poll for UI update
  const tick = () => {
    const v = window.__vid;
    if (v) {
      const pct = (v.time / v.effTotal) * 100;
      trackFill.style.width = pct + '%';
      trackThumb.style.left = pct + '%';
      timestamp.textContent = `${fmt(v.time)} / ${fmt(v.effTotal)}`;
      iconPlay.style.display = v.playing ? 'none' : 'block';
      iconPause.style.display = v.playing ? 'block' : 'none';
      // Chapter label
      const globalT = v.time;
      const cur = [...CHAPTERS].reverse().find(c => globalT >= c.t) || CHAPTERS[0];
      chapterLabel.textContent = cur.label;
      // Re-render ticks if total changed
      if (ticks.dataset.total !== String(v.effTotal)) {
        ticks.dataset.total = String(v.effTotal);
        renderTicks();
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
