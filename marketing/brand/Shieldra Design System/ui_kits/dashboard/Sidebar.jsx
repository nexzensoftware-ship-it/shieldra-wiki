const { useState: useStateSB } = React;

const NAV = [
  { kind:'item', label:'Dashboard', icon:'◉', active:true },
  { kind:'item', label:'HIPAA Roadmap', icon:'▤' },
  { kind:'group', label:'Compliance' },
  { kind:'item', label:'Compliance', icon:'◈' },
  { kind:'item', label:'Controls', icon:'☰' },
  { kind:'item', label:'Regulatory Radar', icon:'✦', badge:'3' },
  { kind:'item', label:'Frameworks', icon:'▣' },
  { kind:'group', label:'Risk & Security' },
  { kind:'item', label:'Risk Register', icon:'△' },
  { kind:'item', label:'Incidents', icon:'▲', badge:'1' },
  { kind:'item', label:'Vendor Risk', icon:'◇' },
  { kind:'group', label:'AI & Intelligence' },
  { kind:'item', label:'AI Assistant', icon:'✧' },
  { kind:'item', label:'Knowledge Graph', icon:'⬡' },
  { kind:'group', label:'Evidence' },
  { kind:'item', label:'Evidence Library', icon:'▨' },
  { kind:'item', label:'Audits', icon:'◎' },
];

function Sidebar() {
  const [active, setActive] = useStateSB('Dashboard');
  return (
    <aside style={{
      width:264, flexShrink:0,
      background:'#fff',
      borderRight:'1px solid #e2e8f0',
      display:'flex', flexDirection:'column',
      height:'100vh', position:'sticky', top:0,
    }}>
      {/* Logo */}
      <div style={{ padding:'18px 18px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #f1f5f9' }}>
        <img src="../../assets/logo/icon-primary.svg" style={{ width:34, height:34, borderRadius:8, boxShadow:'0 0 15px rgba(59,130,246,0.2)' }}/>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:'#0f172a', letterSpacing:'-0.01em' }}>Shieldra</div>
          <div style={{ fontSize:10, fontWeight:700, color:'#2563eb', letterSpacing:'0.08em', textTransform:'uppercase' }}>AI Platform</div>
        </div>
      </div>

      {/* Org switcher */}
      <div style={{ padding:'10px 12px' }}>
        <button style={{
          width:'100%', display:'flex', alignItems:'center', gap:10,
          padding:'8px 10px', borderRadius:8,
          background:'#f8fafc', border:'1px solid #e2e8f0', cursor:'pointer',
          fontFamily:'inherit', textAlign:'left',
        }}>
          <div style={{ width:26, height:26, borderRadius:6, background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800 }}>CV</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>ComplianceVision AI</div>
            <div style={{ fontSize:10, color:'#64748b' }}>Healthcare · Enterprise</div>
          </div>
          <span style={{ color:'#94a3b8', fontSize:10 }}>▾</span>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding:'4px 8px 16px', overflowY:'auto', flex:1 }}>
        {NAV.map((n,i) => n.kind === 'group' ? (
          <div key={i} style={{
            fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em',
            color:'#94a3b8', padding:'14px 10px 6px',
            display:'flex', alignItems:'center', gap:6,
          }}>
            {n.label}
          </div>
        ) : (
          <button key={i} onClick={()=>setActive(n.label)} style={{
            width:'100%', display:'flex', alignItems:'center', gap:10,
            padding:'8px 10px', margin:'1px 0', borderRadius:8,
            border:0, background:active===n.label?'#dbeafe':'transparent',
            color:active===n.label?'#1d4ed8':'#334155',
            fontWeight:active===n.label?600:500, fontSize:13,
            cursor:'pointer', fontFamily:'inherit', textAlign:'left',
            transition:'background 150ms',
          }}
            onMouseEnter={e=>{ if(active!==n.label) e.currentTarget.style.background='#f1f5f9'; }}
            onMouseLeave={e=>{ if(active!==n.label) e.currentTarget.style.background='transparent'; }}
          >
            <span style={{ width:16, textAlign:'center', opacity:0.85 }}>{n.icon}</span>
            <span style={{ flex:1 }}>{n.label}</span>
            {n.badge && (
              <span style={{
                padding:'1px 6px', borderRadius:99, fontSize:10, fontWeight:700,
                background:'#fef2f2', color:'#b91c1c',
              }}>{n.badge}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer: user */}
      <div style={{ padding:12, borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#2563eb)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>MH</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:'#0f172a' }}>Dr. Miriam Hart</div>
          <div style={{ fontSize:10, color:'#64748b' }}>Compliance Officer</div>
        </div>
        <span style={{ color:'#94a3b8', fontSize:14, cursor:'pointer' }}>⚙</span>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
