function Header() {
  return (
    <header style={{
      height:64, padding:'0 28px',
      borderBottom:'1px solid #e2e8f0',
      background:'rgba(255,255,255,0.85)',
      backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
      position:'sticky', top:0, zIndex:10,
      display:'flex', alignItems:'center', gap:16,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#64748b' }}>
        <span>Overview</span>
        <span style={{ color:'#cbd5e1' }}>/</span>
        <span style={{ color:'#0f172a', fontWeight:600 }}>Dashboard</span>
      </div>

      <div style={{ flex:1, maxWidth:400, marginLeft:32, position:'relative' }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', fontSize:14 }}>⌕</span>
        <input placeholder="Search controls, policies, vendors…" style={{
          width:'100%', height:38, padding:'0 40px 0 36px',
          border:'1px solid #e2e8f0', borderRadius:10,
          background:'#f8fafc', fontSize:13, fontFamily:'inherit', color:'#0f172a',
          outline:'none',
        }}/>
        <span style={{
          position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
          fontSize:10, color:'#94a3b8', background:'#fff', padding:'2px 6px',
          borderRadius:4, border:'1px solid #e2e8f0', fontFamily:'var(--font-mono)',
        }}>⌘K</span>
      </div>

      <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
        <button style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'7px 12px', borderRadius:10,
          background:'linear-gradient(90deg, #2563eb, #7c3aed)',
          color:'#fff', fontSize:12, fontWeight:600, border:0, cursor:'pointer',
          fontFamily:'inherit',
          boxShadow:'0 0 15px rgba(139,92,246,0.25)',
        }}>
          <span>✦</span> Ask AI
        </button>
        <button style={{ width:36, height:36, borderRadius:10, background:'transparent', border:'1px solid #e2e8f0', cursor:'pointer', position:'relative', color:'#475569' }}>
          🔔
          <span style={{ position:'absolute', top:6, right:7, width:7, height:7, borderRadius:'50%', background:'#ef4444' }}/>
        </button>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#2563eb)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>MH</div>
      </div>
    </header>
  );
}

window.Header = Header;
