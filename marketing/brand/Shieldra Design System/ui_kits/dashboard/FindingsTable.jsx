const SEV = {
  Critical: { bg:'#fee2e2', fg:'#991b1b', dot:'#ef4444' },
  High:     { bg:'#ffedd5', fg:'#9a3412', dot:'#f97316' },
  Medium:   { bg:'#fef9c3', fg:'#854d0e', dot:'#eab308' },
  Low:      { bg:'#dcfce7', fg:'#166534', dot:'#22c55e' },
};

const FINDINGS = [
  { id:'FIN-482', title:'Workstation timeout exceeds HIPAA §164.312(a)(2)(iii)', sev:'Critical', fw:'HIPAA', ctl:'AC-11', owner:'IT Ops', age:'2h' },
  { id:'FIN-479', title:'Missing BAA for new data processor (Twilio)', sev:'High', fw:'HIPAA', ctl:'§164.308(b)', owner:'Legal', age:'6h' },
  { id:'FIN-477', title:'Logging retention below SOC 2 CC7.3 requirement', sev:'High', fw:'SOC 2', ctl:'CC7.3', owner:'Security', age:'1d' },
  { id:'FIN-476', title:'Encryption-at-rest drift detected on staging-db-02', sev:'Medium', fw:'ISO 27001', ctl:'A.10.1', owner:'Platform', age:'1d' },
  { id:'FIN-471', title:'Quarterly access review not completed for 3 users', sev:'Medium', fw:'HIPAA', ctl:'§164.308(a)(4)', owner:'HR', age:'3d' },
  { id:'FIN-468', title:'Vendor questionnaire overdue — Datadog (annual)', sev:'Low', fw:'SOC 2', ctl:'CC9.2', owner:'Procurement', age:'5d' },
];

function FindingsTable() {
  return (
    <div style={{
      background:'#fff', border:'1px solid #e2e8f0', borderRadius:16,
      boxShadow:'0 1px 2px rgba(15,23,42,0.04)', gridColumn:'span 8', overflow:'hidden',
    }}>
      <div style={{ padding:'18px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'#0f172a', letterSpacing:'-0.01em' }}>Open Findings</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Prioritised by severity and age · 7 active</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ padding:'7px 12px', borderRadius:9, background:'#f8fafc', border:'1px solid #e2e8f0', fontSize:12, fontWeight:600, color:'#334155', cursor:'pointer', fontFamily:'inherit' }}>Filter ▾</button>
          <button style={{ padding:'7px 12px', borderRadius:9, background:'linear-gradient(90deg,#2563eb,#7c3aed)', border:0, fontSize:12, fontWeight:600, color:'#fff', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 0 15px rgba(139,92,246,0.2)' }}>✦ Auto-remediate</button>
        </div>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ background:'#f8fafc' }}>
            {['ID','Finding','Framework','Control','Owner','Age',''].map(h => (
              <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#64748b' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FINDINGS.map(f => {
            const s = SEV[f.sev];
            return (
              <tr key={f.id} style={{ borderTop:'1px solid #f1f5f9', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:12, color:'#64748b' }}>{f.id}</td>
                <td style={{ padding:'12px 16px', color:'#0f172a' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{
                      display:'inline-flex', alignItems:'center', gap:4,
                      padding:'2px 8px', borderRadius:99,
                      background:s.bg, color:s.fg, fontSize:10, fontWeight:700,
                    }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:s.dot }}/>
                      {f.sev}
                    </span>
                    <span style={{ fontWeight:500 }}>{f.title}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ padding:'2px 8px', borderRadius:6, background:'#f1f5f9', color:'#334155', fontSize:11, fontWeight:600 }}>{f.fw}</span>
                </td>
                <td style={{ padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:11, color:'#64748b' }}>{f.ctl}</td>
                <td style={{ padding:'12px 16px', color:'#334155' }}>{f.owner}</td>
                <td style={{ padding:'12px 16px', color:'#94a3b8', fontSize:12 }}>{f.age}</td>
                <td style={{ padding:'12px 16px', color:'#94a3b8', textAlign:'right' }}>›</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

window.FindingsTable = FindingsTable;
