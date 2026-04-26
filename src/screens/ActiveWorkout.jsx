import { useState, useEffect, useRef } from 'react'
import { useStorage, today } from '../utils'

const CSS = `
.workout-screen { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; padding-bottom: 100px; }
.workout-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px 10px;
}
.workout-back {
  width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: var(--text); cursor: pointer; border: none;
}
.workout-back svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
.workout-live {
  display: inline-flex; align-items: center; gap: 6px; background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  padding: 6px 12px; border-radius: var(--r-pill);
  font-family: var(--font-mono); font-size: 10px; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase;
}
.workout-live::before { content: ''; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 1.8s infinite; }
.workout-timer-btn {
  width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  color: var(--text-dim); cursor: pointer; border: none;
}
.workout-timer-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.8; }
.ex-header { padding: 8px 22px 20px; }
.ex-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; }
.ex-name { font-family: var(--font-display); font-weight: 900; font-size: 42px; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; }
.ex-set-count { font-family: var(--font-mono); font-size: 13px; color: var(--text-dim); margin-top: 8px; letter-spacing: 0.06em; }
.rest-ring { display: flex; justify-content: center; padding: 8px 0 20px; }
.set-table { margin: 0 22px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); overflow: hidden; margin-bottom: 16px; }
.set-table-head { display: grid; grid-template-columns: 32px 1fr 1fr 1fr; gap: 0; padding: 10px 16px; border-bottom: 1px solid var(--border-soft); }
.set-table-head span { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em; text-align: center; }
.set-table-head span:first-child { text-align: left; }
.set-row { display: grid; grid-template-columns: 32px 1fr 1fr 1fr; gap: 0; padding: 12px 16px; border-bottom: 1px solid var(--border-soft); align-items: center; }
.set-row:last-child { border-bottom: none; }
.set-row.active { background: color-mix(in srgb, var(--accent) 5%, transparent); }
.set-num { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
.set-input {
  background: var(--surface-2); border: 1px solid var(--border-soft); border-radius: var(--r-sm);
  padding: 8px; color: var(--text); font-family: var(--font-mono); font-size: 14px; font-weight: 500;
  text-align: center; outline: none; width: 90%; margin: 0 auto; display: block;
}
.set-input:focus { border-color: var(--accent); }
.set-done { display: flex; align-items: center; justify-content: center; }
.set-check { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--border); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.set-check.checked { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.rpe-section { margin: 0 22px 16px; }
.rpe-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px; }
.rpe-track { display: flex; gap: 6px; }
.rpe-seg {
  flex: 1; height: 36px; border-radius: var(--r-sm); background: var(--surface-2);
  border: 1px solid var(--border-soft); cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
}
.rpe-seg.active { background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-weight: 600; }
.next-up { margin: 0 22px 16px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 16px; }
.next-up-label { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; }
.next-up-name { font-family: var(--font-display); font-weight: 900; font-size: 22px; text-transform: uppercase; }
.next-up-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); margin-top: 4px; }
.log-cta-wrap { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; padding: 14px 22px 30px; background: linear-gradient(to top, var(--bg) 60%, transparent); }
.log-cta {
  width: 100%; background: var(--accent); color: var(--on-accent); border: none;
  border-radius: var(--r-lg); padding: 18px; font-family: var(--font-display);
  font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 0.02em;
  cursor: pointer; box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 25%, transparent);
}
.rest-overlay {
  position: fixed; inset: 0; background: color-mix(in srgb, var(--bg) 95%, transparent);
  z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.rest-timer-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; }
.rest-time { font-family: var(--font-display); font-weight: 900; font-size: 88px; line-height: 1; color: var(--accent); letter-spacing: -0.04em; }
.rest-skip { margin-top: 32px; background: none; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 10px 24px; color: var(--text-dim); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
`

const DEFAULT_EXERCISES = [
  { name: 'Bench Press',       sets: [{}, {}, {}, {}], targetSets: 4, targetReps: 8 },
  { name: 'Incline DB Press',  sets: [{}, {}, {}],    targetSets: 3, targetReps: 10 },
  { name: 'Cable Flyes',       sets: [{}, {}, {}],    targetSets: 3, targetReps: 12 },
  { name: 'Shoulder Press',    sets: [{}, {}, {}],    targetSets: 3, targetReps: 10 },
  { name: 'Lateral Raises',    sets: [{}, {}, {}, {}], targetSets: 4, targetReps: 15 },
  { name: 'Tricep Pushdown',   sets: [{}, {}, {}],    targetSets: 3, targetReps: 12 },
]

export default function ActiveWorkout({ onClose }) {
  const [workouts, saveWorkouts] = useStorage('fittrack_workouts', [])
  const [exIdx, setExIdx] = useState(0)
  const [sets, setSets] = useState(() => DEFAULT_EXERCISES.map(ex => ex.sets.map(() => ({ reps: '', weight: '', done: false }))))
  const [rpe, setRpe] = useState(0)
  const [restSecs, setRestSecs] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const startTime = useRef(null)

  useEffect(() => {
    startTime.current = Date.now()
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (restSecs === null || restSecs <= 0) return
    const t = setTimeout(() => setRestSecs(s => (s <= 1 ? null : s - 1)), 1000)
    return () => clearTimeout(t)
  }, [restSecs])

  const ex = DEFAULT_EXERCISES[exIdx]
  const exSets = sets[exIdx]
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  const updateSet = (si, field, val) => {
    setSets(prev => {
      const next = prev.map(s => [...s])
      next[exIdx][si] = { ...next[exIdx][si], [field]: val }
      return next
    })
  }

  const toggleDone = si => {
    const wasUndone = !exSets[si].done
    updateSet(si, 'done', wasUndone)
    if (wasUndone) setRestSecs(90)
  }

  const logAndFinish = () => {
    const workout = {
      id: Date.now(), date: today(), name: 'Push A', duration: Math.floor(elapsed / 60),
      exercises: DEFAULT_EXERCISES.map((ex, ei) => ({
        name: ex.name,
        sets: sets[ei].filter(s => s.done).map(s => ({ reps: s.reps, weight: s.weight })),
      })).filter(ex => ex.sets.length > 0),
      rpe,
    }
    saveWorkouts([...workouts, workout])
    onClose()
  }

  const r = 48; const c = 2 * Math.PI * r

  return (
    <div className="workout-screen">
      <style>{CSS}</style>

      {restSecs !== null && (
        <div className="rest-overlay">
          <div className="rest-timer-label">Rest</div>
          <div className="rest-time">{String(Math.floor(restSecs / 60)).padStart(2, '0')}:{String(restSecs % 60).padStart(2, '0')}</div>
          <button className="rest-skip" onClick={() => setRestSecs(null)}>Skip</button>
        </div>
      )}

      <div className="workout-topbar">
        <button className="workout-back" onClick={onClose}>
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="workout-live">{mm}:{ss}</div>
        <button className="workout-timer-btn" onClick={() => setRestSecs(90)}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M12 5V3M10 3h4" /></svg>
        </button>
      </div>

      <div className="ex-header">
        <div className="ex-meta">{exIdx + 1} / {DEFAULT_EXERCISES.length}</div>
        <div className="ex-name">{ex.name}</div>
        <div className="ex-set-count">{exSets.filter(s => s.done).length} / {ex.targetSets} sets · {ex.targetReps} reps target</div>
      </div>

      <div className="rest-ring">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="6"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - (exSets.filter(s => s.done).length / ex.targetSets))}
            strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.6s' }}
          />
          <text x="60" y="55" textAnchor="middle" fill="var(--text)" fontSize="22" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900">
            {exSets.filter(s => s.done).length}/{ex.targetSets}
          </text>
          <text x="60" y="71" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="'Geist Mono', monospace">
            SETS
          </text>
        </svg>
      </div>

      <div className="set-table">
        <div className="set-table-head">
          <span>Set</span><span>Reps</span><span>Weight</span><span>Done</span>
        </div>
        {exSets.map((s, si) => (
          <div key={si} className={`set-row${s.done ? ' active' : ''}`}>
            <div className="set-num">{si + 1}</div>
            <input className="set-input" type="number" placeholder={String(ex.targetReps)} value={s.reps} onChange={e => updateSet(si, 'reps', e.target.value)} />
            <input className="set-input" type="number" placeholder="kg" value={s.weight} onChange={e => updateSet(si, 'weight', e.target.value)} />
            <div className="set-done">
              <button className={`set-check${s.done ? ' checked' : ''}`} onClick={() => toggleDone(si)}>
                {s.done && <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rpe-section">
        <div className="rpe-label">Session RPE</div>
        <div className="rpe-track">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className={`rpe-seg${rpe >= n ? ' active' : ''}`} onClick={() => setRpe(n)}>{n}</button>
          ))}
        </div>
      </div>

      {exIdx + 1 < DEFAULT_EXERCISES.length && (
        <div className="next-up">
          <div className="next-up-label">Next Up</div>
          <div className="next-up-name">{DEFAULT_EXERCISES[exIdx + 1].name}</div>
          <div className="next-up-meta">{DEFAULT_EXERCISES[exIdx + 1].targetSets} × {DEFAULT_EXERCISES[exIdx + 1].targetReps}</div>
        </div>
      )}

      <div className="log-cta-wrap">
        {exIdx + 1 < DEFAULT_EXERCISES.length ? (
          <button className="log-cta" onClick={() => setExIdx(i => i + 1)}>
            Next Exercise →
          </button>
        ) : (
          <button className="log-cta" onClick={logAndFinish}>
            Finish Workout
          </button>
        )}
      </div>
    </div>
  )
}
