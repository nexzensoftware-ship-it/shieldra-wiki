const { useState: useStateSC, useEffect: useEffectSC, useRef: useRefSC } = React;

function useCounter(target, duration = 2000) {
  const [v, setV] = useStateSC(0);
  const startRef = useRefSC(null);
  useEffectSC(() => {
    let raf;
    const step = t => {
      if (!startRef.current) startRef.current = t;
      const p = Math.min((t - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function ScoreGaugeCard() {
  const v = useCounter(98, 2200);
  const C = 2 * Math.PI * 42;
  const pct = v / 100;
  return (
    <div style={{
      position:'absolute', top:60, right:-10, width:240,
      background:'rgba(255,255,255,0.85)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      border:'1px solid rgba(255,255,255,0.5)', borderRadius:20, padding:20,
      boxShadow:'0 16px 64px rgba(0,0,0,0.12)',
      animation:'floatSm 5s ease-in-out infinite',
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(59,130,246,0.1), transparent, rgba(139,92,246,0.1))', borderRadius:20, pointerEvents:'none' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#cffafe', color:'#0891b2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>◈</div>
          <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#64748b' }}>Compliance Score</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', position:'relative', marginTop:4 }}>
          <svg width={110} height={110} viewBox="0 0 100 100" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${C*pct} ${C}`}/>
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#22c55e"/><stop offset="1" stopColor="#16a34a"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position:'absolute', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ fontSize:30, fontWeight:800, color:'#0f172a', letterSpacing:'-0.02em' }}>{Math.round(v)}<span style={{ fontSize:16, color:'#06b6d4' }}>%</span></div>
            <div style={{ fontSize:10, color:'#16a34a', fontWeight:600 }}>+2.1 this week</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HipaaCard() {
  const v = useCounter(99.2, 2400);
  return (
    <div style={{
      position:'absolute', bottom:60, left:-20, width:280,
      background:'rgba(255,255,255,0.85)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      border:'1px solid rgba(255,255,255,0.5)', borderRadius:20, padding:20,
      boxShadow:'0 16px 64px rgba(0,0,0,0.12)',
      animation:'floatMd 6s ease-in-out infinite',
    }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(139,92,246,0.1), transparent, rgba(6,182,212,0.1))', borderRadius:20, pointerEvents:'none' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#ede9fe', color:'#7c3aed', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>▲</div>
          <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#64748b' }}>HIPAA Readiness</div>
        </div>
        <div style={{ fontSize:30, fontWeight:800, color:'#0f172a', letterSpacing:'-0.02em', marginTop:4 }}>{v.toFixed(1)}<span style={{ fontSize:16, color:'#06b6d4' }}>%</span></div>
        <div style={{ background:'#f1f5f9', height:8, borderRadius:99, marginTop:10, overflow:'hidden' }}>
          <div style={{ width:`${v}%`, height:'100%', background:'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)', borderRadius:99, transition:'width 200ms' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:10, color:'#94a3b8', fontWeight:500 }}>
          <span>Administrative</span><span>Physical</span><span>Technical</span>
        </div>
      </div>
    </div>
  );
}

function ControlsCard() {
  const v = useCounter(324, 2000);
  return (
    <div style={{
      position:'absolute', top:-10, left:-30, width:200,
      background:'rgba(255,255,255,0.85)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      border:'1px solid rgba(255,255,255,0.5)', borderRadius:18, padding:16,
      boxShadow:'0 16px 64px rgba(0,0,0,0.10)',
      animation:'floatLg 7s ease-in-out infinite',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
        <div style={{ width:26, height:26, borderRadius:7, background:'#dbeafe', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>≡</div>
        <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', color:'#64748b' }}>Controls</div>
      </div>
      <div style={{ fontSize:24, fontWeight:800, color:'#0f172a', letterSpacing:'-0.02em' }}>{Math.round(v)}</div>
      <div style={{ fontSize:11, fontWeight:500, color:'#16a34a', display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>
        Monitored · Active
      </div>
    </div>
  );
}

window.ScoreGaugeCard = ScoreGaugeCard;
window.HipaaCard = HipaaCard;
window.ControlsCard = ControlsCard;
