import { useState } from 'react'
import { useStorage } from '../utils'
import PageHead from '../components/PageHead'

const ALL_JOINTS = ['Left Knee', 'Right Knee', 'Lower Back', 'Left Shoulder', 'Right Shoulder', 'Left Hip', 'Right Hip', 'Left Ankle', 'Right Ankle', 'Left Wrist', 'Right Wrist', 'Neck']
const ALL_TRIGGERS = ['Poor Sleep', 'Stress', 'Dehydration', 'Overtraining', 'Cold Weather', 'Diet', 'Travel', 'Illness', 'Alcohol', 'Long Sitting']
const FACILITIES = [
  { id: 'pool',  icon: '🏊', label: 'Pool' },
  { id: 'sauna', icon: '🧖', label: 'Sauna' },
  { id: 'steam', icon: '💨', label: 'Steam Room' },
]
const SENSITIVITY_LABELS = ['Gentle', 'Balanced', 'Proactive']

const CSS = `
.adaptive-setup { padding-bottom: 120px; }
.setup-section { margin: 0 22px 28px; }
.setup-section-title { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 14px; }
.joint-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.joint-chip { padding: 10px 16px; border-radius: var(--r-pill); border: 1px solid var(--border-soft); background: none; color: var(--text-dim); font-size: 13px; cursor: pointer; transition: all 0.15s; }
.joint-chip.selected { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.trigger-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.trigger-chip { padding: 10px 16px; border-radius: var(--r-pill); border: 1px solid var(--border-soft); background: none; color: var(--text-dim); font-size: 13px; cursor: pointer; transition: all 0.15s; }
.trigger-chip.selected { background: color-mix(in srgb, var(--warm) 10%, transparent); border-color: color-mix(in srgb, var(--warm) 30%, transparent); color: var(--warm); }
.hydration-stepper { display: flex; align-items: center; gap: 16px; }
.stepper-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.stepper-val { font-family: var(--font-display); font-weight: 900; font-size: 36px; flex: 1; text-align: center; }
.stepper-unit { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); text-align: center; margin-top: 2px; }
.facility-row { display: flex; gap: 12px; }
.facility-toggle { flex: 1; background: var(--surface); border: 1.5px solid var(--border-soft); border-radius: var(--r-lg); padding: 16px 14px; text-align: center; cursor: pointer; transition: all 0.15s; }
.facility-toggle.on { background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 35%, transparent); }
.facility-icon { font-size: 24px; margin-bottom: 6px; }
.facility-label { font-size: 13px; font-weight: 500; }
.sensitivity-track { display: flex; gap: 8px; }
.sensitivity-btn { flex: 1; padding: 14px 8px; background: var(--surface); border: 1.5px solid var(--border-soft); border-radius: var(--r-lg); cursor: pointer; text-align: center; transition: all 0.15s; }
.sensitivity-btn.selected { background: color-mix(in srgb, var(--accent) 10%, transparent); border-color: color-mix(in srgb, var(--accent) 35%, transparent); }
.sensitivity-num { font-family: var(--font-display); font-weight: 900; font-size: 28px; color: var(--accent); }
.sensitivity-label { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
.save-cta { margin: 0 22px; width: calc(100% - 44px); background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-lg); padding: 18px; font-family: var(--font-display); font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer; }
`

export default function AdaptiveSetup() {
  const [config, saveConfig] = useStorage('ft-adaptive-config', {
    trackedJoints: [], triggers: [], hydrationTargetMl: 2500, facilities: [], sensitivityLevel: 2
  })

  const [joints, setJoints] = useState(config.trackedJoints || [])
  const [triggers, setTriggers] = useState(config.triggers || [])
  const [hydration, setHydration] = useState(config.hydrationTargetMl || 2500)
  const [facilities, setFacilities] = useState(config.facilities || [])
  const [sensitivity, setSensitivity] = useState(config.sensitivityLevel || 2)
  const [saved, setSaved] = useState(false)

  const toggleArr = (arr, setArr, val) => setArr(a => a.includes(val) ? a.filter(v => v !== val) : [...a, val])

  const save = () => {
    saveConfig({ trackedJoints: joints, triggers, hydrationTargetMl: hydration, facilities, sensitivityLevel: sensitivity })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="adaptive-setup">
      <style>{CSS}</style>

      <PageHead eyebrow="Adaptive" title="YOUR" accent="RULES." />

      <div className="setup-section">
        <div className="setup-section-title">Tracked Joints</div>
        <div className="joint-grid">
          {ALL_JOINTS.map(j => (
            <button key={j} className={`joint-chip${joints.includes(j) ? ' selected' : ''}`} onClick={() => toggleArr(joints, setJoints, j)}>{j}</button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <div className="setup-section-title">Known Triggers</div>
        <div className="trigger-chips">
          {ALL_TRIGGERS.map(t => (
            <button key={t} className={`trigger-chip${triggers.includes(t) ? ' selected' : ''}`} onClick={() => toggleArr(triggers, setTriggers, t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <div className="setup-section-title">Daily Hydration Target</div>
        <div className="hydration-stepper">
          <button className="stepper-btn" onClick={() => setHydration(h => Math.max(500, h - 250))}>−</button>
          <div>
            <div className="stepper-val">{(hydration / 1000).toFixed(1)}</div>
            <div className="stepper-unit">Litres per day</div>
          </div>
          <button className="stepper-btn" onClick={() => setHydration(h => Math.min(6000, h + 250))}>+</button>
        </div>
      </div>

      <div className="setup-section">
        <div className="setup-section-title">Available Facilities</div>
        <div className="facility-row">
          {FACILITIES.map(f => (
            <div key={f.id} className={`facility-toggle${facilities.includes(f.id) ? ' on' : ''}`} onClick={() => toggleArr(facilities, setFacilities, f.id)}>
              <div className="facility-icon">{f.icon}</div>
              <div className="facility-label">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <div className="setup-section-title">Intervention Sensitivity</div>
        <div className="sensitivity-track">
          {[1, 2, 3].map(n => (
            <div key={n} className={`sensitivity-btn${sensitivity === n ? ' selected' : ''}`} onClick={() => setSensitivity(n)}>
              <div className="sensitivity-num">{n}</div>
              <div className="sensitivity-label">{SENSITIVITY_LABELS[n - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="save-cta" onClick={save}>{saved ? '✓ Saved' : 'Save Settings'}</button>
    </div>
  )
}
