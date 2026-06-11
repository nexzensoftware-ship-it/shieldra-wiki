const FRAMEWORKS = [
  { name:'HIPAA',     pct:99.2, controls:'164 / 165',  color:'#2563eb' },
  { name:'SOC 2 Type II', pct:94, controls:'61 / 64',  color:'#7c3aed' },
  { name:'ISO 27001', pct:87, controls:'99 / 114',     color:'#06b6d4' },
  { name:'PCI DSS 4.0', pct:72, controls:'220 / 306',  color:'#f97316' },
  { name:'GDPR',      pct:91, controls:'38 / 42',      color:'#16a34a' },
];

function FrameworkProgress() {
  return (
    <div style={{
      background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:20,
      boxShadow:'0 1px 2px rgba(15,23,42,0.04)', gridColumn:'span 4',
    }}>
      <div style={{ fontSize:15, fontWeight:700, color:'#0f172a', letterSpacing:'-0.01em' }}>Frameworks</div>
      <div style={{ fontSize:12, color:'#64748b', marginTop:2, marginBottom:16 }}>Coverage across active standards</div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {FRAMEWORKS.map(f => (
          <div key={f.name}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{f.name}</div>
              <div style={{ fontSize:12, fontFamily:'var(--font-mono)', color:'#64748b' }}>{f.controls}</div>
            </div>
            <div style={{ position:'relative', height:8, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
              <div style={{
                position:'absolute', inset:0,
                width:`${f.pct}%`, height:'100%',
                background:`linear-gradient(90deg, ${f.color}, ${f.color}CC)`,
                borderRadius:99,
                boxShadow:`0 0 8px ${f.color}40`,
              }}/>
            </div>
            <div style={{ fontSize:11, color:f.color, fontWeight:700, marginTop:4 }}>{f.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIRadar() {
  return (
    <div style={{
      gridColumn:'span 4',
      borderRadius:16, padding:20, position:'relative', overflow:'hidden',
      background:'linear-gradient(135deg, #0C1222, #162032)',
      color:'#fff',
      boxShadow:'0 20px 60px rgba(15,23,42,0.2), 0 0 40px rgba(59,130,246,0.15)',
    }}>
      <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)', filter:'blur(30px)' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>
          <span style={{ color:'#c4b5fd' }}>✦</span> Regulatory Radar
        </div>
        <div style={{ fontSize:14, fontWeight:600, marginTop:14, lineHeight:1.4 }}>
          <b style={{ color:'#fbbf24' }}>3 new alerts</b> affecting HIPAA and SOC 2 controls in the last 24h.
        </div>
        <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:12 }}>
            <div style={{ fontSize:10, color:'#c4b5fd', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>HHS · Proposed Rule</div>
            <div style={{ marginTop:3, color:'#e2e8f0' }}>HIPAA Security Rule update — encryption requirement expanded to all PHI at rest.</div>
          </div>
          <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:12 }}>
            <div style={{ fontSize:10, color:'#67e8f9', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>AICPA · Guidance</div>
            <div style={{ marginTop:3, color:'#e2e8f0' }}>New SOC 2 illustrative controls for AI/ML systems published.</div>
          </div>
        </div>
        <button style={{
          marginTop:14, padding:'9px 14px', border:0, borderRadius:10,
          background:'linear-gradient(90deg, #2563eb, #7c3aed)',
          color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
          width:'100%',
        }}>View all alerts →</button>
      </div>
    </div>
  );
}

window.FrameworkProgress = FrameworkProgress;
window.AIRadar = AIRadar;
