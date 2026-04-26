import { useState } from 'react'
import { useStorage } from '../utils'

const IconBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>

const GOLF_PROGRAMS = [
  { id:'g1', name:'Power & Distance', weeks:6, desc:'Build rotational power for more yards off the tee', exercises:[
    { name:'Hip Hinge with Rotation', sets:3, reps:'10 each side', cue:'Drive hips through impact' },
    { name:'Med Ball Rotational Throw', sets:3, reps:'8 each side', cue:'Explosive hip rotation' },
    { name:'Cable Chop (High to Low)', sets:3, reps:'12 each side', cue:'Transfer force through core' },
    { name:'Landmine Rotation', sets:3, reps:'10 each side', cue:'X-factor stretch at top' },
    { name:'Glute Bridge', sets:3, reps:'15', cue:'Activate glutes for hip drive' },
    { name:'Pallof Press', sets:3, reps:'12 each side', cue:'Resist rotation to build anti-rotation' },
  ]},
  { id:'g2', name:'Stability & Control', weeks:6, desc:'Improve balance and shot consistency', exercises:[
    { name:'Single-Leg Deadlift', sets:3, reps:'10 each', cue:'Level hips through movement' },
    { name:'Bird Dog', sets:3, reps:'12 each side', cue:'Extend and hold 2s at top' },
    { name:'Side Plank', sets:3, reps:'30-45s each', cue:'Stack feet, maintain alignment' },
    { name:'Step-Up with Hold', sets:3, reps:'10 each', cue:'Pause at top for balance' },
    { name:'Anti-Rotation Pallof', sets:3, reps:'15 each', cue:'Isometric hold with extended arms' },
    { name:'Single-Leg Calf Raise', sets:3, reps:'15 each', cue:'Feel ankle stability' },
  ]},
  { id:'g3', name:'Hip Mobility', weeks:4, desc:'Free up hip rotation for a full swing', exercises:[
    { name:'Hip 90/90 Stretch', sets:3, reps:'60s each side', cue:'Sit tall, breathe into the stretch' },
    { name:'Hip Flexor Stretch (kneeling)', sets:3, reps:'45s each', cue:'Posterior pelvic tilt to feel hip flexor' },
    { name:'Lateral Band Walk', sets:3, reps:'20 steps each way', cue:'Maintain tension throughout' },
    { name:'Hip Circle', sets:3, reps:'10 each direction', cue:'Slow controlled circles' },
    { name:'Pigeon Pose', sets:3, reps:'60s each', cue:'Breathe and relax into stretch' },
    { name:'Glute Activation Bridge', sets:3, reps:'20', cue:'Squeeze hard at top' },
  ]},
  { id:'g4', name:'Shoulder & Thoracic', weeks:4, desc:'Improve shoulder turn and backswing range', exercises:[
    { name:'Thoracic Extension over Roller', sets:3, reps:'60s', cue:'Arms overhead if able' },
    { name:'Wall Angel', sets:3, reps:'10', cue:'Keep lower back against wall' },
    { name:'Band Pull-Apart', sets:3, reps:'20', cue:'Squeeze shoulder blades' },
    { name:'Sleeper Stretch', sets:3, reps:'45s each', cue:'Gentle pressure, no pain' },
    { name:'Thoracic Rotation', sets:3, reps:'12 each side', cue:'Exhale into rotation' },
    { name:'Face Pull', sets:3, reps:'15', cue:'Finish with external rotation' },
  ]},
  { id:'g5', name:'Injury Prevention', weeks:6, desc:'Protect the lower back, hips, and wrists', exercises:[
    { name:'McGill Big 3: Bird Dog', sets:3, reps:'10 each', cue:'Neutral spine always' },
    { name:'McGill Big 3: Side Plank', sets:3, reps:'30s each', cue:'Maintain straight line' },
    { name:'McGill Big 3: Modified Curl-Up', sets:3, reps:'10', cue:'Neck in neutral' },
    { name:'Hip Hinge Drill', sets:3, reps:'10', cue:'Dowel on spine — 3 contact points' },
    { name:'Wrist Mobility Circle', sets:2, reps:'10 each direction', cue:'Full pain-free range' },
    { name:'Nordic Curl (eccentric)', sets:2, reps:'5', cue:'Lower as slowly as possible' },
  ]},
  { id:'g6', name:'In-Season Maintenance', weeks:12, desc:'Keep performance high throughout the season', exercises:[
    { name:'Hip Flexor Stretch', sets:2, reps:'45s each', cue:'Post-round priority' },
    { name:'Thoracic Rotation', sets:2, reps:'10 each', cue:'Keep hips square' },
    { name:'Band Pull-Apart', sets:2, reps:'15', cue:'Warm-up and cool-down' },
    { name:'Single-Leg Balance', sets:2, reps:'30s each', cue:'Eyes closed for challenge' },
    { name:'Glute Bridge', sets:2, reps:'15', cue:'Activate before round' },
    { name:'Calf Raise', sets:2, reps:'15', cue:'Maintain ankle stability' },
  ]},
]

function GolfSessionRunner({ program, onClose }) {
  const [idx, setIdx] = useState(0)
  const [sets, setSets] = useState(0)
  const ex = program.exercises[idx]
  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}><IconBack /></button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {program.exercises.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{ex.name}</div>
      <div style={{ color:'#888', marginBottom:20, fontSize:14 }}>{program.name}</div>
      <div className="ft-card" style={{ textAlign:'center', marginBottom:20 }}>
        <div className="ft-stat-num">{sets} / {ex.sets}</div>
        <div className="ft-stat-lbl">Sets</div>
        <div style={{ color:'#888', fontSize:13, marginTop:4 }}>Reps: {ex.reps}</div>
      </div>
      {ex.cue && <div className="ft-card" style={{ color:'#c8f135', marginBottom:20 }}>⛳ {ex.cue}</div>}
      <div className="ft-row" style={{ gap:12 }}>
        <button className="ft-btn ft-btn-secondary" style={{ flex:1 }} onClick={() => setSets(s => Math.max(0, s-1))}>-</button>
        <button className="ft-btn ft-btn-primary" style={{ flex:2 }} onClick={() => {
          if (sets + 1 >= ex.sets) { if (idx + 1 < program.exercises.length) { setIdx(i=>i+1); setSets(0) } else onClose() }
          else setSets(s => s+1)
        }}>
          {sets + 1 >= ex.sets && idx + 1 >= program.exercises.length ? 'Finish' : 'Next Set'}
        </button>
      </div>
    </div>
  )
}

export default function Golf() {
  const [active, setActive] = useState(null)
  if (active) return <GolfSessionRunner program={active} onClose={() => setActive(null)} />
  return (
    <div className="ft-screen">
      <div className="ft-h1">Golf Programs</div>
      {GOLF_PROGRAMS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.weeks} weeks · {p.exercises.length} exercises</div>
              <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{p.desc}</div>
            </div>
            <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(p)}>Start</button>
          </div>
        </div>
      ))}
    </div>
  )
}
