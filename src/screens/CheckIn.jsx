import { useState } from 'react'
import { useStorage, today } from '../utils'

const DEFAULT_JOINTS = ['Left Knee', 'Right Knee', 'Lower Back', 'Left Shoulder', 'Right Shoulder', 'Left Hip', 'Right Hip', 'Left Ankle', 'Right Ankle']
const TRIGGER_OPTIONS = ['Poor Sleep', 'Stress', 'Dehydration', 'Overtraining', 'Cold Weather', 'Diet', 'Travel', 'Illness']
const SEVERITY_LABELS = ['None', 'Mild', 'Moderate', 'Severe']

const CSS = `
.checkin { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; padding: 0 22px 40px; }
.ci-progress { display: flex; gap: 8px; padding: 24px 0 0; margin-bottom: 32px; }
.ci-dot { flex: 1; height: 3px; border-radius: 2px; background: var(--surface-2); }
.ci-dot.done { background: var(--accent); }
.ci-dot.active { background: color-mix(in srgb, var(--accent) 50%, transparent); }
.ci-eyebrow { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 12px; }
.ci-title { font-family: var(--font-display); font-weight: 900; font-size: clamp(42px, 11vw, 52px); text-transform: uppercase; line-height: 0.92; letter-spacing: -0.02em; margin-bottom: 28px; }
.ci-title .accent { color: var(--accent); font-style: italic; }
.ci-scale { display: flex; gap: 10px; margin-bottom: 32px; }
.ci-scale-btn {
  flex: 1; aspect-ratio: 1; border-radius: var(--r-lg); border: 1.5px solid var(--border-soft);
  background: var(--surface); font-family: var(--font-display); font-weight: 900; font-size: 28px;
  color: var(--text-dim); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.ci-scale-btn.selected { background: color-mix(in srgb, var(--accent) 15%, transparent); border-color: var(--accent); color: var(--accent); }
.ci-scale-label { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: -16px; margin-bottom: 24px; }
.ci-joints { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.ci-joint { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 14px 18px; }
.ci-joint-name { font-size: 14px; font-weight: 500; margin-bottom: 10px; }
.ci-severity { display: flex; gap: 6px; }
.ci-sev-btn {
  flex: 1; padding: 8px 4px; border-radius: var(--r-sm); border: 1px solid var(--border-soft);
  background: none; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer; text-align: center; transition: all 0.15s;
}
.ci-sev-btn.s0.selected { background: color-mix(in srgb, var(--green) 12%, transparent); border-color: var(--green); color: var(--green); }
.ci-sev-btn.s1.selected { background: color-mix(in srgb, var(--warm) 12%, transparent); border-color: var(--warm); color: var(--warm); }
.ci-sev-btn.s2.selected { background: color-mix(in srgb, var(--orange) 12%, transparent); border-color: var(--orange); color: var(--orange); }
.ci-sev-btn.s3.selected { background: color-mix(in srgb, var(--red) 12%, transparent); border-color: var(--red); color: var(--red); }
.ci-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.ci-chip { padding: 10px 16px; border-radius: var(--r-pill); border: 1px solid var(--border-soft); background: none; color: var(--text-dim); font-size: 14px; cursor: pointer; transition: all 0.15s; }
.ci-chip.selected { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.ci-cta { margin-top: auto; width: 100%; background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-lg); padding: 18px; font-family: var(--font-display); font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer; }
.ci-cta:disabled { opacity: 0.4; cursor: not-allowed; }
`

export default function CheckIn({ onComplete }) {
  const [, saveCheckins] = useStorage('ft-checkins', [])
  const [adaptiveConfig] = useStorage('ft-adaptive-config', { trackedJoints: [] })
  const [step, setStep] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [sleep, setSleep] = useState(0)
  const [joints, setJoints] = useState(() => {
    const tracked = adaptiveConfig.trackedJoints.length ? adaptiveConfig.trackedJoints : DEFAULT_JOINTS.slice(0, 4)
    return tracked.map(id => ({ id, severity: 0 }))
  })
  const [triggers, setTriggers] = useState([])

  const setJointSeverity = (id, sev) => setJoints(j => j.map(jt => jt.id === id ? { ...jt, severity: sev } : jt))
  const toggleTrigger = t => setTriggers(tr => tr.includes(t) ? tr.filter(x => x !== t) : [...tr, t])

  const submit = () => {
    const entry = { date: today(), energy, sleep, joints, triggers }
    saveCheckins(prev => [...prev.filter(c => c.date !== today()), entry])
    onComplete()
  }

  return (
    <div className="checkin">
      <style>{CSS}</style>

      <div className="ci-progress">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`ci-dot${i < step ? ' done' : i === step ? ' active' : ''}`} />
        ))}
      </div>

      {/* Step 0: Energy */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ci-eyebrow">Morning Check-In · 1 of 4</div>
          <div className="ci-title">ENERGY<br /><span className="accent">TODAY.</span></div>
          <div className="ci-scale">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className={`ci-scale-btn${energy === n ? ' selected' : ''}`} onClick={() => setEnergy(n)}>{n}</button>
            ))}
          </div>
          <div className="ci-scale-label"><span>Drained</span><span>Energised</span></div>
          <button className="ci-cta" disabled={!energy} onClick={() => setStep(1)}>Next</button>
        </div>
      )}

      {/* Step 1: Sleep */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ci-eyebrow">Morning Check-In · 2 of 4</div>
          <div className="ci-title">SLEEP<br /><span className="accent">QUALITY.</span></div>
          <div className="ci-scale">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className={`ci-scale-btn${sleep === n ? ' selected' : ''}`} onClick={() => setSleep(n)}>{n}</button>
            ))}
          </div>
          <div className="ci-scale-label"><span>Terrible</span><span>Excellent</span></div>
          <button className="ci-cta" disabled={!sleep} onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {/* Step 2: Joints */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ci-eyebrow">Morning Check-In · 3 of 4</div>
          <div className="ci-title">JOINT<br /><span className="accent">STATUS.</span></div>
          <div className="ci-joints">
            {joints.map(jt => (
              <div key={jt.id} className="ci-joint">
                <div className="ci-joint-name">{jt.id}</div>
                <div className="ci-severity">
                  {SEVERITY_LABELS.map((label, i) => (
                    <button key={i} className={`ci-sev-btn s${i}${jt.severity === i ? ' selected' : ''}`} onClick={() => setJointSeverity(jt.id, i)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="ci-cta" onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {/* Step 3: Triggers */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ci-eyebrow">Morning Check-In · 4 of 4</div>
          <div className="ci-title">ANY<br /><span className="accent">TRIGGERS?</span></div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Select anything that applies. Skip if none.</div>
          <div className="ci-chips">
            {TRIGGER_OPTIONS.map(t => (
              <button key={t} className={`ci-chip${triggers.includes(t) ? ' selected' : ''}`} onClick={() => toggleTrigger(t)}>{t}</button>
            ))}
          </div>
          <button className="ci-cta" onClick={submit}>Complete Check-In</button>
        </div>
      )}
    </div>
  )
}
