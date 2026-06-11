function FeatureCard({ icon, tint, eyebrow, title, description }) {
  return (
    <div style={{
      position:'relative', padding:28, borderRadius:20,
      background:'rgba(255,255,255,0.85)',
      backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      border:'1px solid rgba(255,255,255,0.5)',
      boxShadow:'0 8px 32px rgba(15,23,42,0.06)',
      transition:'all 400ms cubic-bezier(0.22,1,0.36,1)',
      cursor:'pointer',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 30px 80px rgba(15,23,42,0.12)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 32px rgba(15,23,42,0.06)'; }}
    >
      <div style={{
        width:52, height:52, borderRadius:14,
        background:tint.bg, color:tint.fg,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:24, fontWeight:700,
        boxShadow:`0 0 20px ${tint.glow}`,
      }}>{icon}</div>
      <div style={{
        marginTop:18, fontSize:11, fontWeight:700, textTransform:'uppercase',
        letterSpacing:'0.1em', color:'#64748b',
      }}>{eyebrow}</div>
      <h3 style={{ margin:'6px 0 8px', fontSize:20, fontWeight:700, color:'#0f172a', letterSpacing:'-0.01em' }}>{title}</h3>
      <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:'#475569', textWrap:'pretty' }}>{description}</p>
    </div>
  );
}

function FeatureSection() {
  const features = [
    { icon:'◈', tint:{bg:'#dbeafe', fg:'#2563eb', glow:'rgba(59,130,246,0.15)'}, eyebrow:'Automation', title:'End-to-End HIPAA', description:'Scan policies, monitor infrastructure, and close gaps automatically across Administrative, Physical, and Technical safeguards.' },
    { icon:'✦', tint:{bg:'#ede9fe', fg:'#7c3aed', glow:'rgba(139,92,246,0.15)'}, eyebrow:'Intelligence', title:'Multi-Model AI', description:'Claude, GPT, and Gemini work in concert — with calibrated confidence scores so you trust every finding.' },
    { icon:'◉', tint:{bg:'#cffafe', fg:'#0891b2', glow:'rgba(6,182,212,0.15)'}, eyebrow:'Continuous', title:'Regulatory Radar', description:'Stay ahead of every rule change with real-time alerts from 60+ regulators and AI-summarised impact briefs.' },
    { icon:'◐', tint:{bg:'#dcfce7', fg:'#16a34a', glow:'rgba(34,197,94,0.15)'}, eyebrow:'Evidence', title:'Auto-Remediation', description:'Generate policies, collect evidence, and push fixes to your stack. Auditors get one link, not a hunt.' },
    { icon:'▲', tint:{bg:'#fee2e2', fg:'#dc2626', glow:'rgba(239,68,68,0.15)'}, eyebrow:'Risk', title:'Vendor Risk Graph', description:'Every vendor, BAA, and data flow in one graph. Drift detection flags changes the moment they happen.' },
    { icon:'◆', tint:{bg:'#fef9c3', fg:'#a16207', glow:'rgba(234,179,8,0.15)'}, eyebrow:'Learning', title:'Self-Learning Engine', description:'Every audit sharpens the model. Peer benchmarking shows how you compare — anonymously — against your industry.' },
  ];
  return (
    <section style={{ maxWidth:1280, margin:'0 auto', padding:'80px 24px', position:'relative' }}>
      <div style={{ textAlign:'center', marginBottom:56 }}>
        <div style={{
          display:'inline-block', fontSize:12, fontWeight:600, textTransform:'uppercase',
          letterSpacing:'0.12em', color:'#2563eb', marginBottom:16,
        }}>What Shieldra does</div>
        <h2 style={{ margin:0, fontSize:44, fontWeight:800, color:'#0f172a', letterSpacing:'-0.02em', lineHeight:1.1 }}>
          One platform. Every{' '}
          <span style={{
            background:'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
            backgroundSize:'200% 100%',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            animation:'gradShift 8s ease infinite',
          }}>framework</span>.
        </h2>
        <p style={{ marginTop:14, fontSize:17, color:'#64748b', maxWidth:620, marginLeft:'auto', marginRight:'auto' }}>
          Built for healthcare, fintech, and enterprise teams that can't afford to fail an audit.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
        {features.map(f => <FeatureCard key={f.title} {...f}/>)}
      </div>
    </section>
  );
}

window.FeatureCard = FeatureCard;
window.FeatureSection = FeatureSection;
