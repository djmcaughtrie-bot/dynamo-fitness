import { useState, useEffect } from 'react'

const FOCUS_OPTIONS = ['Hypertrophy', 'Strength', 'Fat Loss', 'General Fitness', 'Athletic Performance']
const EXPERIENCE_OPTIONS = ['Beginner (0–1 yr)', 'Intermediate (1–3 yrs)', 'Advanced (3+ yrs)']
const FREQUENCY_OPTIONS = [2, 3, 4, 5, 6]
const EQUIPMENT_OPTIONS = ['Full Gym', 'Home Gym', 'Dumbbells Only', 'Bodyweight', 'Resistance Bands', 'Cables']
const LIMITATION_OPTIONS = ['None', 'Lower Back', 'Knee', 'Shoulder', 'Hip', 'Wrist', 'Ankle']

const CSS = `
.onboarding { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; padding: 0 22px 40px; }
.ob-progress { display: flex; gap: 4px; padding: 24px 0 0; margin-bottom: 32px; }
.ob-dot { flex: 1; height: 3px; border-radius: 2px; background: var(--surface-2); }
.ob-dot.done { background: var(--accent); }
.ob-dot.active { background: color-mix(in srgb, var(--accent) 50%, transparent); }
.ob-step { flex: 1; display: flex; flex-direction: column; }
.ob-eyebrow { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 12px; }
.ob-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(42px, 11vw, 56px); text-transform: uppercase; line-height: 0.92; letter-spacing: -0.02em; margin-bottom: 28px; }
.ob-title .accent { color: var(--accent); font-style: italic; }
.ob-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 16px 18px; color: var(--text); font-family: var(--font-sans); font-size: 16px; outline: none; margin-bottom: 16px; }
.ob-input:focus { border-color: var(--accent); }
.ob-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.ob-option { padding: 16px 18px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg); cursor: pointer; font-size: 15px; font-weight: 500; text-align: left; color: var(--text); transition: all 0.15s; }
.ob-option.selected { background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.ob-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.ob-chip { padding: 10px 16px; border-radius: var(--r-pill); border: 1px solid var(--border-soft); background: none; color: var(--text-dim); font-family: var(--font-sans); font-size: 14px; cursor: pointer; transition: all 0.15s; }
.ob-chip.selected { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.ob-freq { display: flex; gap: 10px; margin-bottom: 24px; }
.ob-freq-btn { flex: 1; aspect-ratio: 1; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg); font-family: var(--font-display); font-weight: 900; font-size: 28px; color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ob-freq-btn.selected { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.ob-cta { margin-top: auto; width: 100%; background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-lg); padding: 18px; font-family: var(--font-display); font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer; box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 20%, transparent); }
.ob-cta:disabled { opacity: 0.4; cursor: not-allowed; }
.ob-spinner { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 24px; text-align: center; }
.ob-spinner-ring { width: 64px; height: 64px; border: 3px solid var(--surface-2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ob-summary { text-align: center; }
`

const STEPS = ['welcome', 'name', 'focus', 'experience', 'frequency', 'equipment', 'limitations', 'units', 'calibrating', 'summary']
const CALIBRATING_IDX = STEPS.indexOf('calibrating')

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', focus: '', experience: '', frequency: 4, equipment: [], limitations: [], units: 'kg' })

  // Auto-advance past the calibrating spinner
  useEffect(() => {
    if (step !== CALIBRATING_IDX) return
    const t = setTimeout(() => setStep(s => s + 1), 2200)
    return () => clearTimeout(t)
  }, [step])

  const next = () => setStep(s => s + 1)

  const finish = () => {
    onComplete(form)
  }

  const toggle = (field, val) => setForm(f => ({
    ...f,
    [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val]
  }))

  return (
    <div className="onboarding">
      <style>{CSS}</style>

      {step < CALIBRATING_IDX && (
        <div className="ob-progress">
          {STEPS.slice(0, CALIBRATING_IDX).map((_, i) => (
            <div key={i} className={`ob-dot${i < step ? ' done' : i === step ? ' active' : ''}`} />
          ))}
        </div>
      )}

      {/* Step 0: Welcome */}
      {step === 0 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Welcome to FitTrack</div>
          <div className="ob-title">LET&apos;S GET<br /><span className="accent">SET UP.</span></div>
          <div style={{ fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 32 }}>
            Takes 2 minutes. We&apos;ll personalise everything — programmes, tracking, and adaptive recommendations — around you.
          </div>
          <button className="ob-cta" onClick={next}>Get Started</button>
        </div>
      )}

      {/* Step 1: Name */}
      {step === 1 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 1 of 7</div>
          <div className="ob-title">WHAT DO WE<br /><span className="accent">CALL YOU?</span></div>
          <input className="ob-input" placeholder="First name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          <button className="ob-cta" disabled={!form.name.trim()} onClick={next}>Continue</button>
        </div>
      )}

      {/* Step 2: Focus */}
      {step === 2 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 2 of 7</div>
          <div className="ob-title">PRIMARY<br /><span className="accent">GOAL.</span></div>
          <div className="ob-options">
            {FOCUS_OPTIONS.map(o => (
              <button key={o} className={`ob-option${form.focus === o ? ' selected' : ''}`} onClick={() => { setForm(f => ({ ...f, focus: o })); next() }}>{o}</button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Experience */}
      {step === 3 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 3 of 7</div>
          <div className="ob-title">TRAINING<br /><span className="accent">HISTORY.</span></div>
          <div className="ob-options">
            {EXPERIENCE_OPTIONS.map(o => (
              <button key={o} className={`ob-option${form.experience === o ? ' selected' : ''}`} onClick={() => { setForm(f => ({ ...f, experience: o })); next() }}>{o}</button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Frequency */}
      {step === 4 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 4 of 7</div>
          <div className="ob-title">SESSIONS<br /><span className="accent">PER WEEK.</span></div>
          <div className="ob-freq">
            {FREQUENCY_OPTIONS.map(n => (
              <button key={n} className={`ob-freq-btn${form.frequency === n ? ' selected' : ''}`} onClick={() => setForm(f => ({ ...f, frequency: n }))}>{n}</button>
            ))}
          </div>
          <button className="ob-cta" onClick={next}>Continue</button>
        </div>
      )}

      {/* Step 5: Equipment */}
      {step === 5 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 5 of 7</div>
          <div className="ob-title">YOUR<br /><span className="accent">SETUP.</span></div>
          <div className="ob-chips">
            {EQUIPMENT_OPTIONS.map(o => (
              <button key={o} className={`ob-chip${form.equipment.includes(o) ? ' selected' : ''}`} onClick={() => toggle('equipment', o)}>{o}</button>
            ))}
          </div>
          <button className="ob-cta" disabled={!form.equipment.length} onClick={next}>Continue</button>
        </div>
      )}

      {/* Step 6: Limitations */}
      {step === 6 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 6 of 7</div>
          <div className="ob-title">ANYTHING<br /><span className="accent">TO KNOW?</span></div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Any areas that need extra care? This stays private.</div>
          <div className="ob-chips">
            {LIMITATION_OPTIONS.map(o => (
              <button key={o} className={`ob-chip${form.limitations.includes(o) ? ' selected' : ''}`} onClick={() => toggle('limitations', o)}>{o}</button>
            ))}
          </div>
          <button className="ob-cta" onClick={next}>Continue</button>
        </div>
      )}

      {/* Step 7: Units */}
      {step === 7 && (
        <div className="ob-step">
          <div className="ob-eyebrow">Step 7 of 7</div>
          <div className="ob-title">KG OR<br /><span className="accent">LBS?</span></div>
          <div className="ob-options">
            {['kg', 'lbs'].map(u => (
              <button key={u} className={`ob-option${form.units === u ? ' selected' : ''}`} onClick={() => { setForm(f => ({ ...f, units: u })); next() }}>{u.toUpperCase()}</button>
            ))}
          </div>
        </div>
      )}

      {/* Step 8: Calibrating (auto-advances via useEffect) */}
      {step === 8 && (
        <div className="ob-step">
          <div className="ob-spinner">
            <div className="ob-spinner-ring" />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, textTransform: 'uppercase' }}>Calibrating</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>Building your profile…</div>
          </div>
        </div>
      )}

      {/* Step 9: Summary */}
      {step === 9 && (
        <div className="ob-step">
          <div className="ob-eyebrow">All set</div>
          <div className="ob-title">READY,<br /><span className="accent">{form.name || 'ATHLETE'}.</span></div>
          <div className="ob-summary" style={{ marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20, textAlign: 'left' }}>
              {[
                { k: 'Goal', v: form.focus },
                { k: 'Level', v: form.experience.split(' ')[0] },
                { k: 'Frequency', v: `${form.frequency}× / week` },
                { k: 'Units', v: form.units.toUpperCase() },
              ].map(({ k, v }) => (
                <div key={k} style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', borderRadius: 'var(--r-lg)', padding: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="ob-cta" onClick={finish}>Start Training</button>
        </div>
      )}
    </div>
  )
}
