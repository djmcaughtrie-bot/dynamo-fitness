import { useReducer, useState, useEffect, useRef } from 'react'
import { useStorage } from '../utils'
import PageHead from '../components/PageHead'

const STRETCH_LIBRARY = [
  { name:'Hip Flexor Stretch', muscles:'Hip flexors, quads', hold:45, cue:'Tuck pelvis and breathe in', sides:true },
  { name:'Pigeon Pose', muscles:'Piriformis, glutes', hold:60, cue:'Let hips relax into the floor', sides:true },
  { name:'Figure-Four Stretch', muscles:'Piriformis, outer hip', hold:45, cue:'Flex foot of crossing ankle', sides:true },
  { name:'Seated Hamstring Stretch', muscles:'Hamstrings', hold:45, cue:'Hinge at hip, not waist', sides:false },
  { name:'Standing Quad Stretch', muscles:'Quadriceps', hold:30, cue:'Keep knees together', sides:true },
  { name:'Calf Stretch', muscles:'Gastrocnemius', hold:30, cue:'Heel pressed into floor', sides:true },
  { name:'Soleus Stretch', muscles:'Soleus', hold:30, cue:'Bend knee of back leg', sides:true },
  { name:'Child\'s Pose', muscles:'Lower back, lats, hips', hold:60, cue:'Breathe into your back', sides:false },
  { name:'Cat-Cow', muscles:'Thoracic spine', hold:0, cue:'Exhale on cat, inhale on cow', sides:false },
  { name:'Thoracic Extension over Roller', muscles:'Thoracic spine', hold:60, cue:'Support head, go slowly', sides:false },
  { name:'Thoracic Rotation', muscles:'Thoracic spine, obliques', hold:30, cue:'Exhale into rotation', sides:true },
  { name:'Doorway Chest Stretch', muscles:'Pecs, front delts', hold:30, cue:'Lean forward to feel stretch', sides:false },
  { name:'Cross-Body Shoulder Stretch', muscles:'Rear delt, rotator cuff', hold:30, cue:'Pull elbow across with opposite hand', sides:true },
  { name:'Sleeper Stretch', muscles:'Posterior rotator cuff', hold:45, cue:'Gentle pressure only', sides:true },
  { name:'Overhead Tricep Stretch', muscles:'Triceps long head', hold:30, cue:'Keep elbow pointing up', sides:true },
  { name:'Neck Side Tilt', muscles:'Scalenes, upper traps', hold:30, cue:'Let ear fall to shoulder', sides:true },
  { name:'Neck Rotation', muscles:'Sternocleidomastoid', hold:20, cue:'Slow and controlled', sides:true },
  { name:'Lats Stretch (wall)', muscles:'Latissimus dorsi', hold:45, cue:'Push hips back as arms reach forward', sides:false },
  { name:'90/90 Hip Stretch', muscles:'Hip internal/external rotators', hold:60, cue:'Sit tall through both hips', sides:true },
  { name:'Butterfly Stretch', muscles:'Adductors, groin', hold:45, cue:'Use elbows to press knees gently down', sides:false },
  { name:'IT Band Stretch', muscles:'IT band, TFL', hold:30, cue:'Cross leg, lean sideways', sides:true },
  { name:'Lower Back Rotation', muscles:'QL, lower back', hold:30, cue:'Keep both shoulders on floor', sides:true },
  { name:'Prone Press-Up', muscles:'Lumbar extensors', hold:10, cue:'Hips stay on floor', sides:false },
  { name:'Knee-to-Chest', muscles:'Lower back, glutes', hold:45, cue:'Relax legs and back', sides:true },
  { name:'Spinal Twist (seated)', muscles:'Spine, obliques', hold:30, cue:'Sit tall before rotating', sides:true },
]

const STRETCH_PROGRAMS = [
  { id:'sp1',  name:'Morning Wake-Up',         group:'Morning',       duration:10, stretches:['Cat-Cow','Child\'s Pose','Thoracic Extension over Roller','Hip Flexor Stretch','Seated Hamstring Stretch','Neck Side Tilt'] },
  { id:'sp2',  name:'Post-Workout Recovery',   group:'Post-Workout',  duration:15, stretches:['Quad Stretch','Calf Stretch','Pigeon Pose','Doorway Chest Stretch','Lats Stretch (wall)','Cross-Body Shoulder Stretch','Lower Back Rotation'] },
  { id:'sp3',  name:'Lower Back Relief',       group:'Therapeutic',   duration:12, stretches:['Knee-to-Chest','Child\'s Pose','Cat-Cow','Lower Back Rotation','Figure-Four Stretch','Prone Press-Up'] },
  { id:'sp4',  name:'Hip Mobility Flow',       group:'Mobility',      duration:15, stretches:['90/90 Hip Stretch','Pigeon Pose','Hip Flexor Stretch','Butterfly Stretch','Figure-Four Stretch','IT Band Stretch'] },
  { id:'sp5',  name:'Upper Body Unwind',       group:'Post-Workout',  duration:10, stretches:['Doorway Chest Stretch','Cross-Body Shoulder Stretch','Sleeper Stretch','Overhead Tricep Stretch','Neck Side Tilt','Thoracic Rotation'] },
  { id:'sp6',  name:'Full Body Flexibility',   group:'Full Body',     duration:20, stretches:['Cat-Cow','Hip Flexor Stretch','Pigeon Pose','Seated Hamstring Stretch','Doorway Chest Stretch','Thoracic Rotation','Spinal Twist (seated)','Butterfly Stretch'] },
  { id:'sp7',  name:'Golf Pre-Round',          group:'Sport-Specific',duration:8,  stretches:['Thoracic Rotation','Hip Flexor Stretch','90/90 Hip Stretch','Thoracic Extension over Roller','Cross-Body Shoulder Stretch','Calf Stretch'] },
  { id:'sp8',  name:'Desk Worker Reset',       group:'Office',        duration:10, stretches:['Neck Side Tilt','Neck Rotation','Doorway Chest Stretch','Thoracic Extension over Roller','Hip Flexor Stretch','Lower Back Rotation'] },
  { id:'sp9',  name:'Hamstring Focus',         group:'Therapeutic',   duration:10, stretches:['Seated Hamstring Stretch','Standing Quad Stretch','Calf Stretch','Soleus Stretch','IT Band Stretch','Knee-to-Chest'] },
  { id:'sp10', name:'Evening Wind-Down',       group:'Evening',       duration:15, stretches:['Child\'s Pose','Lower Back Rotation','Figure-Four Stretch','Butterfly Stretch','Spinal Twist (seated)','Prone Press-Up','Knee-to-Chest'] },
  { id:'sp11', name:'Shoulder Health',         group:'Therapeutic',   duration:10, stretches:['Cross-Body Shoulder Stretch','Sleeper Stretch','Doorway Chest Stretch','Overhead Tricep Stretch','Neck Rotation','Thoracic Rotation'] },
  { id:'sp12', name:'Core & Back',             group:'Therapeutic',   duration:12, stretches:['Cat-Cow','Child\'s Pose','Prone Press-Up','Lower Back Rotation','Spinal Twist (seated)','Thoracic Extension over Roller','Lats Stretch (wall)'] },
]

const CSS = `
.stretch-screen { padding-bottom: 120px; }
.stretch-group-label {
  padding: 0 22px 8px; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);
  letter-spacing: 0.18em; text-transform: uppercase;
}
.stretch-program-card {
  margin: 0 22px 12px; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: var(--r-xl); padding: 18px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
}
.stretch-program-info .name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.stretch-program-info .meta { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-dim); letter-spacing: 0.06em; }
.start-stretch-btn {
  background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-md);
  padding: 10px 16px; font-family: var(--font-display); font-weight: 900; font-size: 14px;
  text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer; white-space: nowrap;
}
.stretch-done-badge {
  width: 28px; height: 28px; background: color-mix(in srgb, var(--green) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--green) 30%, transparent);
  border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--green); flex-shrink: 0;
}
/* Player */
.stretch-player {
  min-height: 100vh; background: var(--bg); display: flex; flex-direction: column;
  align-items: center; padding-bottom: 40px;
}
.player-topbar {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 14px 18px;
}
.player-back {
  width: 40px; height: 40px; background: var(--surface); border: none;
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text);
}
.player-back svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
.player-progress { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.1em; }
.player-name {
  font-family: var(--font-display); font-weight: 900; font-size: 42px;
  text-transform: uppercase; letter-spacing: -0.02em; text-align: center;
  padding: 0 22px; line-height: 0.95; margin-bottom: 8px;
}
.player-muscles { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.08em; text-align: center; margin-bottom: 24px; }
.player-ring { margin: 8px auto 24px; }
.player-cue {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: var(--r-xl); padding: 16px 20px; margin: 0 22px 24px;
  font-size: 14px; color: var(--text-dim); text-align: center; line-height: 1.5;
}
.player-controls { display: flex; gap: 12px; padding: 0 22px; width: 100%; }
.ctrl-btn {
  flex: 1; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-lg);
  padding: 14px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-dim); cursor: pointer;
}
.ctrl-primary {
  flex: 2; background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-lg);
  padding: 14px; font-family: var(--font-display); font-weight: 900; font-size: 18px;
  text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 20%, transparent);
}
.player-next { margin-top: 16px; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.08em; text-align: center; }
`

function holdFor(name) { return STRETCH_LIBRARY.find(s => s.name === name)?.hold || 30 }

function timerReducer(state, action) {
  switch (action.type) {
    case 'TICK':    return { ...state, timeLeft: state.timeLeft - 1 }
    case 'TOGGLE':  return { ...state, running: !state.running }
    case 'ADVANCE': return { ...state, idx: state.idx + 1, timeLeft: action.hold, running: false }
    case 'PREV':    return { ...state, idx: state.idx - 1, timeLeft: action.hold, running: false }
    case 'DONE':    return { ...state, phase: 'done', running: false }
    default:        return state
  }
}

function StretchPlayer({ program, onClose }) {
  const [state, dispatch] = useReducer(timerReducer, program, p => ({
    idx: 0, timeLeft: holdFor(p.stretches[0]), running: false, phase: 'ready',
  }))
  const { idx, timeLeft, running, phase } = state
  const ref = useRef(null)
  const stretch = STRETCH_LIBRARY.find(s => s.name === program.stretches[idx])
  const hold = stretch?.hold || 30

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    ref.current = setTimeout(() => {
      if (timeLeft <= 1) {
        if (idx + 1 < program.stretches.length) {
          dispatch({ type: 'ADVANCE', hold: holdFor(program.stretches[idx + 1]) })
        } else {
          dispatch({ type: 'DONE' })
        }
      } else {
        dispatch({ type: 'TICK' })
      }
    }, 1000)
    return () => clearTimeout(ref.current)
  }, [running, timeLeft, idx, program.stretches])

  const r = 54; const c = 2 * Math.PI * r
  const pct = phase === 'done' ? 1 : (timeLeft / hold)

  if (phase === 'done') return (
    <div className="stretch-player">
      <style>{CSS}</style>
      <div className="player-topbar">
        <button className="player-back" onClick={onClose}><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 64 }}>🌿</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 42, textTransform: 'uppercase' }}>Done!</div>
        <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{program.name} · {program.stretches.length} stretches</div>
        <button className="ctrl-primary" style={{ marginTop: 16, maxWidth: 200 }} onClick={onClose}>Finish</button>
      </div>
    </div>
  )

  return (
    <div className="stretch-player">
      <style>{CSS}</style>
      <div className="player-topbar">
        <button className="player-back" onClick={onClose}><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button>
        <div className="player-progress">{idx + 1} / {program.stretches.length}</div>
      </div>
      <div className="player-name">{stretch?.name || program.stretches[idx]}</div>
      <div className="player-muscles">{stretch?.muscles}</div>
      <div className="player-ring">
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s' }}
          />
          <text x="60" y="56" textAnchor="middle" fill="var(--text)" fontSize="30" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900">{timeLeft}</text>
          <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="'Geist Mono', monospace">secs</text>
        </svg>
      </div>
      {stretch?.cue && <div className="player-cue">💭 {stretch.cue}</div>}
      <div className="player-controls">
        <button className="ctrl-btn" onClick={() => idx > 0 && dispatch({ type: 'PREV', hold: holdFor(program.stretches[idx - 1]) })}>← Prev</button>
        <button className="ctrl-primary" onClick={() => dispatch({ type: 'TOGGLE' })}>
          {running ? 'Pause' : (timeLeft === hold ? 'Start' : 'Resume')}
        </button>
        <button className="ctrl-btn" onClick={() => idx + 1 < program.stretches.length ? dispatch({ type: 'ADVANCE', hold: holdFor(program.stretches[idx + 1]) }) : dispatch({ type: 'DONE' })}>Next →</button>
      </div>
      {idx + 1 < program.stretches.length && (
        <div className="player-next">Next: {program.stretches[idx + 1]}</div>
      )}
    </div>
  )
}

export default function StretchRoutine() {
  const [todayDone, saveTodayDone] = useStorage('fittrack_stretch_today', [])
  const [activeProgram, setActiveProgram] = useState(null)

  const finish = (programId) => {
    if (!todayDone.includes(programId)) saveTodayDone(prev => [...prev, programId])
    setActiveProgram(null)
  }

  if (activeProgram) return <StretchPlayer program={activeProgram} onClose={() => finish(activeProgram.id)} />

  const grouped = STRETCH_PROGRAMS.reduce((acc, p) => {
    const g = p.group || 'General'
    if (!acc[g]) acc[g] = []
    acc[g].push(p)
    return acc
  }, {})

  return (
    <div className="stretch-screen">
      <style>{CSS}</style>
      <PageHead eyebrow="Recovery" title="STRETCH" accent="TIME." />
      {Object.entries(grouped).map(([group, progs]) => (
        <div key={group}>
          <div className="stretch-group-label">{group}</div>
          {progs.map(p => (
            <div key={p.id} className="stretch-program-card">
              <div className="stretch-program-info">
                <div className="name">{p.name}</div>
                <div className="meta">{p.stretches.length} stretches · ~{p.duration}min</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {todayDone.includes(p.id) && (
                  <div className="stretch-done-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                )}
                <button className="start-stretch-btn" onClick={() => setActiveProgram(p)}>Start</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
