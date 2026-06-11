const { useState, useEffect } = React;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Features', 'HIPAA', 'Frameworks', 'Pricing', 'Docs'];

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:50, height:72,
      display:'flex', alignItems:'center',
      background: scrolled ? 'rgba(255,255,255,0.75)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(226,232,240,0.6)' : '1px solid transparent',
      transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ maxWidth:1280, width:'100%', margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', gap:32 }}>
        <a href="#" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <img src="../../assets/logo/icon-primary.svg" style={{ width:36, height:36, borderRadius:8, boxShadow:'0 0 20px rgba(59,130,246,0.25)' }} />
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:'#0f172a', letterSpacing:'-0.01em' }}>Shieldra</div>
            <div style={{ fontSize:10, fontWeight:700, color:'#2563eb', letterSpacing:'0.08em', textTransform:'uppercase' }}>AI Platform</div>
          </div>
        </a>

        <div style={{ display:'flex', gap:4, marginLeft:16 }}>
          {links.map(l => (
            <a key={l} href="#" style={{
              position:'relative', padding:'8px 14px', fontSize:14, fontWeight:500,
              color:'#334155', textDecoration:'none', borderRadius:8,
            }}
               onMouseEnter={e=>e.currentTarget.style.color='#0f172a'}
               onMouseLeave={e=>e.currentTarget.style.color='#334155'}>
              {l}
            </a>
          ))}
        </div>

        <div style={{ marginLeft:'auto', display:'flex', gap:10, alignItems:'center' }}>
          <a href="#" style={{ fontSize:14, fontWeight:500, color:'#334155', textDecoration:'none', padding:'8px 14px' }}>Sign in</a>
          <button style={{
            padding:'10px 18px', fontSize:14, fontWeight:600, color:'#fff',
            border:0, borderRadius:12, cursor:'pointer',
            background:'linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)',
            backgroundSize:'200% 100%',
            boxShadow:'0 0 20px rgba(59,130,246,0.25)',
            transition:'all 500ms cubic-bezier(0.22,1,0.36,1)',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.backgroundPosition='100% 0'; e.currentTarget.style.boxShadow='0 0 40px rgba(59,130,246,0.35)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.backgroundPosition='0 0'; e.currentTarget.style.boxShadow='0 0 20px rgba(59,130,246,0.25)'; }}
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
