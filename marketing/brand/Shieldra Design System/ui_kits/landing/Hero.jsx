function Hero() {
  return (
    <section style={{ position:'relative', paddingTop:160, paddingBottom:120, overflow:'hidden' }}>
      <MeshBackground/>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', position:'relative', display:'grid', gridTemplateColumns:'1.15fr 1fr', gap:60, alignItems:'center' }}>
        <div>
          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px',
            background:'rgba(255,255,255,0.7)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(59,130,246,0.2)', borderRadius:999,
            fontSize:12, fontWeight:600, color:'#334155',
            boxShadow:'0 0 20px rgba(59,130,246,0.08)',
          }}>
            <span style={{ color:'#7c3aed' }}>✦</span>
            AI-Powered Compliance Platform
            <span style={{ color:'#cbd5e1' }}>·</span>
            <span style={{ color:'#64748b', fontWeight:500 }}>Claude · GPT · Gemini</span>
          </div>

          <h1 style={{
            marginTop:24, fontSize:68, fontWeight:800, color:'#0f172a',
            letterSpacing:'-0.03em', lineHeight:1.05, textWrap:'balance',
          }}>
            The regulatory AI that{' '}
            <span style={{
              background:'linear-gradient(90deg, #2563eb, #7c3aed, #06b6d4, #2563eb)',
              backgroundSize:'200% 100%',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'gradShift 8s ease infinite',
            }}>shields</span>
            <br/>your business.
          </h1>

          <p style={{
            marginTop:20, fontSize:19, lineHeight:1.6, color:'#475569',
            maxWidth:560, textWrap:'pretty',
          }}>
            Shieldra automates HIPAA compliance end-to-end — scanning your policies, monitoring your infrastructure, and{' '}
            <b style={{ color:'#0f172a', fontWeight:600 }}>learning from every audit</b> to keep you a step ahead of every regulator.
          </p>

          <div style={{ display:'flex', gap:12, marginTop:32 }}>
            <button style={{
              padding:'16px 28px', fontSize:16, fontWeight:600, color:'#fff',
              border:0, borderRadius:16, cursor:'pointer',
              background:'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
              backgroundSize:'200% 100%',
              boxShadow:'0 0 30px rgba(59,130,246,0.25)',
              transition:'all 500ms cubic-bezier(0.22,1,0.36,1)',
              display:'inline-flex', alignItems:'center', gap:8,
            }}
              onMouseEnter={e=>{ e.currentTarget.style.backgroundPosition='100% 0'; e.currentTarget.style.boxShadow='0 0 50px rgba(59,130,246,0.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.backgroundPosition='0 0'; e.currentTarget.style.boxShadow='0 0 30px rgba(59,130,246,0.25)'; }}
            >
              Start Free Trial <span>→</span>
            </button>
            <button style={{
              padding:'16px 24px', fontSize:16, fontWeight:600, color:'#334155',
              background:'rgba(255,255,255,0.7)', backdropFilter:'blur(12px)',
              border:'1px solid rgba(203,213,225,0.8)', borderRadius:16, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:8,
              transition:'all 300ms',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#94a3b8'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(203,213,225,0.8)'; }}
            >
              <span>▶</span> Book a Demo
            </button>
          </div>

          {/* Trust bar */}
          <div style={{ marginTop:40, display:'flex', gap:28, fontSize:13, color:'#64748b', alignItems:'center' }}>
            {['HIPAA','SOC 2','ISO 27001','PCI DSS','GDPR'].map(t=>(
              <span key={t} style={{ fontWeight:600, letterSpacing:'0.03em' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right column: logo + floating cards */}
        <div style={{ position:'relative', height:520 }}>
          <div style={{
            position:'absolute', inset:'10% 10%',
            background:'linear-gradient(135deg, #0C1222, #162032)',
            borderRadius:32,
            boxShadow:'0 30px 80px rgba(15,23,42,0.3), 0 0 60px rgba(59,130,246,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            overflow:'hidden',
          }}>
            {/* subtle network lines */}
            <svg width="100%" height="100%" style={{ position:'absolute', opacity:0.3 }}>
              {Array.from({length:12}).map((_,i)=>(
                <line key={i} x1={Math.random()*400} y1={Math.random()*400} x2={Math.random()*400} y2={Math.random()*400} stroke="#22d3ee" strokeWidth="0.5"/>
              ))}
            </svg>
            <img src="../../assets/logo/icon-monochrome-white.svg" style={{ width:180, height:180, filter:'drop-shadow(0 0 30px rgba(34,211,238,0.5))' }}/>
          </div>
          <ControlsCard/>
          <ScoreGaugeCard/>
          <HipaaCard/>
        </div>
      </div>

      <style>{`
        @keyframes gradShift { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
        @keyframes floatSm { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        @keyframes floatMd { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
        @keyframes floatLg { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-16px) } }
      `}</style>
    </section>
  );
}

window.Hero = Hero;
