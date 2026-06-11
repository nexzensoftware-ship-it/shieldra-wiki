function StatCard({ icon, tint, label, value, unit, delta, deltaPositive = true }) {
  return (
    <div style={{
      background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:20,
      boxShadow:'0 1px 2px rgba(15,23,42,0.04)',
      transition:'all 300ms',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(15,23,42,0.08)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 1px 2px rgba(15,23,42,0.04)'; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <div style={{
          width:32, height:32, borderRadius:9,
          background:tint.bg, color:tint.fg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:16, fontWeight:700,
        }}>{icon}</div>
        <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#64748b' }}>{label}</div>
      </div>
      <div style={{ fontSize:30, fontWeight:800, color:'#0f172a', letterSpacing:'-0.02em', lineHeight:1 }}>
        {value}{unit && <span style={{ fontSize:16, color:'#06b6d4', fontWeight:700, marginLeft:2 }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{ fontSize:12, fontWeight:600, marginTop:8, color: deltaPositive ? '#16a34a' : '#dc2626' }}>
          {deltaPositive ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  );
}

function StatGrid() {
  return (
    <>
      <StatCard icon="▲" tint={{bg:'#ede9fe',fg:'#7c3aed'}} label="HIPAA Readiness" value="99.2" unit="%" delta="2.1% this week"/>
      <StatCard icon="≡" tint={{bg:'#dbeafe',fg:'#2563eb'}} label="Controls Monitored" value="324" delta="12 added"/>
      <StatCard icon="△" tint={{bg:'#fee2e2',fg:'#dc2626'}} label="Open Findings" value="7" delta="3 resolved" deltaPositive={true}/>
      <StatCard icon="◇" tint={{bg:'#cffafe',fg:'#0891b2'}} label="Vendor Risk" value="Low" delta="0 drift"/>
      <StatCard icon="◎" tint={{bg:'#dcfce7',fg:'#16a34a'}} label="Evidence Collected" value="1,248" delta="86 this month"/>
      <StatCard icon="✦" tint={{bg:'#fef9c3',fg:'#a16207'}} label="Reg Alerts" value="3" delta="1 critical" deltaPositive={false}/>
    </>
  );
}

window.StatCard = StatCard;
window.StatGrid = StatGrid;
