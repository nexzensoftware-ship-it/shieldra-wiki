const { useEffect: useEffectSG, useState: useStateSG, useRef: useRefSG } = React;

function useCount(target, duration = 2000) {
  const [v, setV] = useStateSG(0);
  const start = useRefSG(null);
  useEffectSG(()=>{
    let raf;
    const step = t => {
      if (!start.current) start.current = t;
      const p = Math.min((t-start.current)/duration, 1);
      const eased = 1 - Math.pow(1-p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function colorForScore(s) {
  if (s >= 80) return { from:'#4ade80', to:'#16a34a', label:'Excellent' };
  if (s >= 60) return { from:'#facc15', to:'#ca8a04', label:'Good' };
  if (s >= 40) return { from:'#fb923c', to:'#c2410c', label:'At Risk' };
  return { from:'#f87171', to:'#b91c1c', label:'Critical' };
}

function ScoreGauge({ score = 98, title='Compliance Score', subtitle='Across all frameworks' }) {
  const v = useCount(score, 2400);
  const C = 2 * Math.PI * 58;
  const color = colorForScore(v);
  return (
    <div style={{
      background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:18,
      boxShadow:'0 1px 2px rgba(15,23,42,0.04)',
      gridColumn:'span 4',
      display:'flex', flexDirection:'column', gap:12,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#64748b' }}>{title}</div>
          <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{subtitle}</div>
        </div>
        <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:color.to, padding:'3px 8px', borderRadius:99, background:color.from+'22' }}>{color.label}</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ position:'relative', width:140, height:140, flexShrink:0 }}>
          <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="12"/>
            <circle cx="70" cy="70" r="58" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C*(v/100)} ${C}`}/>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor={color.from}/><stop offset="1" stopColor={color.to}/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:38, fontWeight:800, color:'#0f172a', letterSpacing:'-0.03em', lineHeight:1 }}>
              {Math.round(v)}<span style={{ fontSize:18, color:'#06b6d4', fontWeight:700 }}>%</span>
            </div>
          </div>
        </div>

        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' }}>Trend 30d</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#16a34a', marginTop:1 }}>↑ 4.2%</div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' }}>Peer avg</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginTop:1 }}>84%</div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8' }}>Last scan</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginTop:1 }}>2h ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScoreGauge = ScoreGauge;
window.useCount = useCount;
