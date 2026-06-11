function MeshBackground() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {/* Mesh orbs */}
      <div style={{
        position:'absolute', inset:0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(59,130,246,0.15), transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(139,92,246,0.12), transparent 40%),
          radial-gradient(circle at 50% 80%, rgba(6,182,212,0.12), transparent 40%),
          radial-gradient(circle at 90% 70%, rgba(99,102,241,0.08), transparent 50%),
          radial-gradient(circle at 10% 70%, rgba(168,85,247,0.08), transparent 45%)
        `,
      }}/>
      {/* Dot pattern */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
        backgroundSize:'24px 24px',
        opacity:0.35,
      }}/>
      {/* Drifting orbs */}
      <div style={{
        position:'absolute', top:'10%', left:'5%', width:380, height:380, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)',
        filter:'blur(60px)', animation:'drift1 22s ease-in-out infinite',
      }}/>
      <div style={{
        position:'absolute', top:'40%', right:'10%', width:420, height:420, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)',
        filter:'blur(60px)', animation:'drift2 25s ease-in-out infinite',
      }}/>
      <div style={{
        position:'absolute', bottom:'10%', left:'30%', width:340, height:340, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(6,182,212,0.20), transparent 70%)',
        filter:'blur(60px)', animation:'drift3 20s ease-in-out infinite',
      }}/>
      <style>{`
        @keyframes drift1 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(40px,30px) scale(1.1) } }
        @keyframes drift2 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(-30px,40px) scale(0.95) } }
        @keyframes drift3 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(50px,-20px) scale(1.05) } }
      `}</style>
    </div>
  );
}

window.MeshBackground = MeshBackground;
