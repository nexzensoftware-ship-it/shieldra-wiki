// Scene — Shieldra AI Agent. Conversational compliance assistant.
function SceneAIAgent() {
  const { localTime: t, duration } = useSprite();
  const exitOp = t > duration - 0.6 ? 1 - Math.min(1, (t - (duration - 0.6)) / 0.6) : 1;

  // User types question 2.0-3.2s
  const userQ = "What are the HIPAA encryption requirements for ePHI at rest?";
  const userTypedLen = t > 2.0 ? Math.min(userQ.length, Math.floor((t - 2.0) * 50)) : 0;
  const userTyped = userQ.slice(0, userTypedLen);
  const userDone = t > 2.0 + userQ.length / 50;

  // AI typing indicator 3.5-4.3s
  const aiTyping = t > 3.5 && t < 4.3;
  const aiStart = 4.3;
  const aiBody = "Under 45 CFR §164.312(a)(2)(iv), ePHI at rest must be encrypted using NIST-validated algorithms. Shieldra recommends AES-256 for all PHI storage. I reviewed your program — 3 of your 7 storage locations are missing this control. Want me to draft a policy update and create remediation tasks?";
  const aiTypedLen = t > aiStart ? Math.min(aiBody.length, Math.floor((t - aiStart) * 55)) : 0;
  const aiTyped = aiBody.slice(0, aiTypedLen);

  // Citation chips
  const chipsOp = t > aiStart + aiBody.length / 55 + 0.3 ? 1 : 0;
  const actionsOp = t > aiStart + aiBody.length / 55 + 0.8 ? 1 : 0;

  const suggestions = [
    'How should we handle a potential data breach notification?',
    'Explain the HIPAA risk assessment requirements',
    'What access control measures are required under HIPAA?',
    'What should our Business Associate Agreement include?',
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitOp }}>
      <MeshBg /><DriftOrbs />
      <div style={{ position: 'absolute', inset: 0, padding: '60px 80px', fontFamily: FONT, display: 'flex', gap: 50 }}>
        <div style={{ flex: '0 0 580px', paddingTop: 60 }}>
          <SceneTitle
            progress={Math.min(1, t / 1.6)}
            color="violet"
            eyebrow={{ icon: <Icons.Bot size={16}/>, label: 'Shieldra AI Agent' }}
            title="Your compliance"
            gradientWord="copilot."
            subtitle="Ask questions, generate policies, search your program, track SLAs. The AI Agent knows HIPAA, SOC 2, and HITRUST — and it knows your data."
          />
          <div style={{ marginTop: 32, display: 'flex', gap: 8, flexWrap: 'wrap', opacity: t > 2 ? 1 : 0 }}>
            {['Ask questions','Generate policies','Search program','Track SLAs','Cite regulations'].map(c => (
              <span key={c} style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 9999, background: BRAND.violet50, color: BRAND.violet600, border: `1px solid ${BRAND.violet200}` }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <GlassCard style={{ width: '100%', padding: 0, opacity: t > 1 ? 1 : 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${BRAND.violet500}, ${BRAND.brand500})`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Bot size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.surface900 }}>Shieldra AI Agent</div>
                <div style={{ fontSize: 11, color: BRAND.surface500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: BRAND.success }}/>
                  Online — HIPAA, SOC 2, HITRUST
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.surface700, padding: '4px 10px', borderRadius: 9999, border: `1px solid ${BRAND.surface200}`, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icons.ShieldCheck size={11}/> Enterprise
              </span>
            </div>

            {/* Chat body */}
            <div style={{ padding: 20, minHeight: 540, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Suggestions - fade out when user message appears */}
              {t < 2.0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: t > 0.6 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: `linear-gradient(135deg, ${BRAND.violet100}, ${BRAND.brand100})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.violet600, marginBottom: 14 }}>
                    <Icons.Sparkles size={28}/>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.surface900 }}>How can I help?</div>
                  <div style={{ fontSize: 12, color: BRAND.surface500, marginTop: 4, textAlign: 'center' }}>Ask about compliance, policies, controls, or evidence.</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20, width: '100%' }}>
                    {suggestions.map((s, i) => (
                      <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'white', border: `1px solid ${BRAND.surface200}`, fontSize: 12, color: BRAND.surface700, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <span style={{ color: BRAND.brand500, fontWeight: 700 }}>›</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User bubble */}
              {t >= 2.0 && (
                <div style={{ alignSelf: 'flex-end', maxWidth: '75%', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', background: `linear-gradient(135deg, ${BRAND.brand600}, ${BRAND.violet600})`, color: 'white' }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{userTyped}{!userDone && <span style={{ background: 'white', width: 2, height: 14, display: 'inline-block', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }}/>}</div>
                </div>
              )}

              {/* AI typing indicator */}
              {aiTyping && (
                <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: BRAND.surface100, display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: BRAND.violet500, animation: `bounce 1.2s ${i*0.15}s infinite` }}/>)}
                </div>
              )}

              {/* AI bubble */}
              {t >= aiStart && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${BRAND.violet500}, ${BRAND.brand500})`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icons.Bot size={12}/>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: BRAND.surface600 }}>Shieldra AI</span>
                  </div>
                  <div style={{ padding: '14px 18px', borderRadius: '4px 16px 16px 16px', background: 'white', border: `1px solid ${BRAND.surface200}`, fontSize: 14, color: BRAND.surface800, lineHeight: 1.6 }}>
                    {aiTyped}
                  </div>
                  {chipsOp > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      {['45 CFR §164.312(a)(2)(iv)','NIST SP 800-111','3 findings linked'].map(c => (
                        <span key={c} style={{ fontSize: 10, fontWeight: 700, padding: '4px 9px', borderRadius: 9999, background: BRAND.violet50, color: BRAND.violet600, border: `1px solid ${BRAND.violet200}` }}>{c}</span>
                      ))}
                    </div>
                  )}
                  {actionsOp > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, border: 'none', background: BRAND.brand600, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icons.Sparkles size={11}/> Draft policy
                      </button>
                      <button style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 8, background: 'white', color: BRAND.surface700, border: `1px solid ${BRAND.surface200}` }}>Create tasks</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Composer */}
            <div style={{ padding: 16, borderTop: `1px solid ${BRAND.surface200}`, display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, padding: '12px 14px', borderRadius: 12, background: BRAND.surface50, border: `1px solid ${BRAND.surface200}`, fontSize: 13, color: BRAND.surface400 }}>
                Ask about compliance, policies, controls, evidence…
              </div>
              <button style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.violet500}, ${BRAND.brand500})`, color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.ArrowRight size={16}/>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
      <style>{`@keyframes blink{50%{opacity:0}} @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-6px);opacity:1}}`}</style>
    </div>
  );
}
window.SceneAIAgent = SceneAIAgent;
