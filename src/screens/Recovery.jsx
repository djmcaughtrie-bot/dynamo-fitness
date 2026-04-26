import { useState, useEffect, useRef } from 'react'
import { useStorage, today } from '../utils'

const IconBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
const IconClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconTimer = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="13" r="8"/><path d="M12 5V3M8 3h8"/><path d="M12 9v4l2 2"/></svg>
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IconPause = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
const IconRefresh = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>

function HubToggle({ tabs, value, onChange }) {
  return (
    <div className="ft-tab-bar">
      {tabs.map(t => (
        <button key={t} className={`ft-tab-btn${value === t ? ' active' : ''}`} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

const STRETCH_LIBRARY = [
  { name:'Hip Flexor Stretch', muscles:'Hip flexors, quads', hold:45, cue:'Tuck pelvis and breathe in', sides:true },
  { name:'Pigeon Pose', muscles:'Piriformis, glutes', hold:60, cue:'Let hips relax into the floor', sides:true },
  { name:'Figure-Four Stretch', muscles:'Piriformis, outer hip', hold:45, cue:'Flex foot of crossing ankle', sides:true },
  { name:'Seated Hamstring Stretch', muscles:'Hamstrings', hold:45, cue:'Hinge at hip, not waist', sides:false },
  { name:'Standing Quad Stretch', muscles:'Quadriceps', hold:30, cue:'Keep knees together', sides:true },
  { name:'Calf Stretch', muscles:'Gastrocnemius', hold:30, cue:'Heel pressed into floor', sides:true },
  { name:'Soleus Stretch', muscles:'Soleus', hold:30, cue:'Bend knee of back leg', sides:true },
  { name:"Child's Pose", muscles:'Lower back, lats, hips', hold:60, cue:'Breathe into your back', sides:false },
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
  { id:'sp1', name:'Morning Wake-Up', duration:10, stretches:['Cat-Cow',"Child's Pose",'Thoracic Extension over Roller','Hip Flexor Stretch','Seated Hamstring Stretch','Neck Side Tilt'] },
  { id:'sp2', name:'Post-Workout Recovery', duration:15, stretches:['Standing Quad Stretch','Calf Stretch','Pigeon Pose','Doorway Chest Stretch','Lats Stretch (wall)','Cross-Body Shoulder Stretch','Lower Back Rotation'] },
  { id:'sp3', name:'Lower Back Relief', duration:12, stretches:['Knee-to-Chest',"Child's Pose",'Cat-Cow','Lower Back Rotation','Figure-Four Stretch','Prone Press-Up'] },
  { id:'sp4', name:'Hip Mobility Flow', duration:15, stretches:['90/90 Hip Stretch','Pigeon Pose','Hip Flexor Stretch','Butterfly Stretch','Figure-Four Stretch','IT Band Stretch'] },
  { id:'sp5', name:'Upper Body Unwind', duration:10, stretches:['Doorway Chest Stretch','Cross-Body Shoulder Stretch','Sleeper Stretch','Overhead Tricep Stretch','Neck Side Tilt','Thoracic Rotation'] },
  { id:'sp6', name:'Full Body Flexibility', duration:20, stretches:['Cat-Cow','Hip Flexor Stretch','Pigeon Pose','Seated Hamstring Stretch','Doorway Chest Stretch','Thoracic Rotation','Spinal Twist (seated)','Butterfly Stretch'] },
  { id:'sp7', name:'Golf Pre-Round', duration:8, stretches:['Thoracic Rotation','Hip Flexor Stretch','90/90 Hip Stretch','Thoracic Extension over Roller','Cross-Body Shoulder Stretch','Calf Stretch'] },
  { id:'sp8', name:'Desk Worker Reset', duration:10, stretches:['Neck Side Tilt','Neck Rotation','Doorway Chest Stretch','Thoracic Extension over Roller','Hip Flexor Stretch','Lower Back Rotation'] },
  { id:'sp9', name:'Hamstring Focus', duration:10, stretches:['Seated Hamstring Stretch','Standing Quad Stretch','Calf Stretch','Soleus Stretch','IT Band Stretch','Knee-to-Chest'] },
  { id:'sp10', name:'Evening Wind-Down', duration:15, stretches:["Child's Pose",'Lower Back Rotation','Figure-Four Stretch','Butterfly Stretch','Spinal Twist (seated)','Prone Press-Up','Knee-to-Chest'] },
  { id:'sp11', name:'Shoulder Health', duration:10, stretches:['Cross-Body Shoulder Stretch','Sleeper Stretch','Doorway Chest Stretch','Overhead Tricep Stretch','Neck Rotation','Thoracic Rotation'] },
  { id:'sp12', name:'Core & Back', duration:12, stretches:['Cat-Cow',"Child's Pose",'Prone Press-Up','Lower Back Rotation','Spinal Twist (seated)','Thoracic Extension over Roller','Lats Stretch (wall)'] },
]

const CABLE_TUTORIALS = [
  { name:'Cable Fly', muscles:'Pecs', how:'Arms wide, slight elbow bend, bring hands together in hugging arc at chest height', tip:'Maintain stretch at start for full pec activation' },
  { name:'Cable Row', muscles:'Lats, rhomboids, biceps', how:'Feet on platform, pull handle to abdomen, squeeze shoulder blades', tip:'Lead with elbows, not hands' },
  { name:'Tricep Pushdown', muscles:'Triceps', how:'Cable overhead, push to full extension, elbows glued to sides', tip:'Squeeze hard at lockout' },
  { name:'Face Pull', muscles:'Rear delts, external rotators', how:'Rope at face height, pull to forehead elbows high', tip:'Supinate wrists at end for full external rotation' },
  { name:'Lat Pulldown', muscles:'Lats, biceps', how:'Wide overhand grip, pull to upper chest leaning slightly back', tip:'Drive elbows down and back' },
  { name:'Cable Curl', muscles:'Biceps', how:'Low pulley, curl through full range, supinate at top', tip:'Constant tension vs free weights' },
  { name:'Cable Crunch', muscles:'Abs', how:'Kneel, rope at forehead, crunch down rounding spine', tip:'Spinal flexion, not hip flexion' },
  { name:'Pallof Press', muscles:'Core anti-rotation', how:'Cable at hip height, press out resisting rotation, return', tip:'The resistance is sideways — do not rotate' },
  { name:'Straight-Arm Pulldown', muscles:'Lats, serratus', how:'High cable, straight arms, push down to hips', tip:'Feel the lats working, not biceps' },
  { name:'Cable Lateral Raise', muscles:'Medial delt', how:'Low cable to side, raise to shoulder height', tip:'Constant tension advantage over dumbbells' },
]

const CABLE_ROUTINES = [
  { name:'Cable Upper Body A', exercises:[
    { name:'Lat Pulldown', sets:4, reps:'8-10', weight:'' },
    { name:'Cable Row', sets:4, reps:'10-12', weight:'' },
    { name:'Cable Fly', sets:3, reps:'12-15', weight:'' },
    { name:'Face Pull', sets:3, reps:'15-20', weight:'' },
    { name:'Tricep Pushdown', sets:3, reps:'12-15', weight:'' },
    { name:'Cable Curl', sets:3, reps:'12', weight:'' },
  ]},
  { name:'Cable Core', exercises:[
    { name:'Pallof Press', sets:3, reps:'12 each', weight:'' },
    { name:'Cable Crunch', sets:3, reps:'15', weight:'' },
    { name:'Straight-Arm Pulldown', sets:3, reps:'12', weight:'' },
  ]},
  { name:'Cable Back & Biceps', exercises:[
    { name:'Lat Pulldown', sets:4, reps:'8-10', weight:'' },
    { name:'Cable Row', sets:4, reps:'10-12', weight:'' },
    { name:'Straight-Arm Pulldown', sets:3, reps:'12', weight:'' },
    { name:'Cable Curl', sets:3, reps:'12', weight:'' },
  ]},
]

const RECOVERY_PROTOCOLS = [
  { id:'r1', name:'Lower Back Relief', duration:20, desc:'Decompress and mobilise the lumbar spine', steps:[
    { name:'Supine Knee Hug', duration:60, cue:'Pull both knees to chest, breathe deeply' },
    { name:'Lower Back Rotation', duration:45, cue:'Keep shoulders on floor, twist from hips' },
    { name:'Cat-Cow', duration:60, cue:'Exhale on cat, inhale on cow — slow and deliberate' },
    { name:"Child's Pose", duration:90, cue:'Breathe into your back, feel the decompression' },
    { name:'Prone Press-Up', duration:30, cue:'Hips stay on floor, gentle lumbar extension' },
    { name:'Piriformis Stretch', duration:45, cue:'Figure-four — flex the top ankle for depth' },
    { name:'Hip Flexor Kneeling Stretch', duration:45, cue:'Tuck pelvis to feel hip flexor stretch' },
    { name:'Thoracic Rotation', duration:45, cue:'Rotate from mid-back, not lower back' },
    { name:'Savasana / Breathwork', duration:120, cue:'Focus on diaphragmatic breathing, relax completely' },
  ]},
  { id:'r2', name:'Post-Leg Day', duration:15, desc:'Flush the legs after heavy lower body work', steps:[
    { name:'Leg Elevation', duration:120, cue:'Legs up wall — flush metabolites' },
    { name:'Quad Stretch', duration:30, cue:'Stand tall, knee back and up' },
    { name:'Calf Raise & Stretch', duration:60, cue:'Full range — 10 slow raises then hold' },
    { name:'Pigeon Pose', duration:60, cue:'Sink into it — tight glutes need this' },
    { name:'Hamstring Stretch', duration:45, cue:'Hinge at hip, lengthen spine' },
    { name:'IT Band Foam Roll', duration:60, cue:'Slow roll, pause on tender spots' },
    { name:'Cold Shower Legs', duration:60, cue:'Cold water reduces inflammation and soreness' },
  ]},
  { id:'r3', name:'Active Recovery', duration:20, desc:'Light movement to promote blood flow without loading', steps:[
    { name:'Easy Walk', duration:300, cue:'Brisk pace, arms swinging naturally' },
    { name:'Hip Circles', duration:30, cue:'10 each direction, slow and controlled' },
    { name:'Shoulder Rolls', duration:30, cue:'10 forward, 10 backward' },
    { name:'Band Pull-Apart', duration:45, cue:'Light band, focus on scapular retraction' },
    { name:'Bodyweight Squat (slow)', duration:45, cue:'3 seconds down, 3 seconds up' },
    { name:'Deep Breathing', duration:120, cue:'Nasal inhale 4s, hold 4s, exhale 6s' },
  ]},
  { id:'r4', name:'Sleep Prep Protocol', duration:15, desc:'Calm the nervous system before bed', steps:[
    { name:'Legs Up the Wall', duration:180, cue:'Close eyes, breathe naturally' },
    { name:'Lower Back Rotation', duration:45, cue:'Slow and gentle, hold each side' },
    { name:"Child's Pose", duration:90, cue:'Eyes closed, body letting go' },
    { name:'4-7-8 Breathing', duration:120, cue:'Inhale 4s, hold 7s, exhale 8s — repeat 4x' },
    { name:'Progressive Muscle Relaxation', duration:180, cue:'Tense and release each muscle group from feet up' },
  ]},
  { id:'r5', name:'Shoulder Recovery', duration:12, desc:'Restore shoulder mobility and reduce tightness', steps:[
    { name:'Pendulum Swings', duration:60, cue:'Arm hanging, let gravity traction the joint' },
    { name:'Doorway Chest Stretch', duration:45, cue:'Multiple elbow heights for full pec coverage' },
    { name:'Cross-Body Stretch', duration:45, cue:'Gentle pull, not a yank' },
    { name:'Sleeper Stretch', duration:45, cue:'Only comfortable range — no forcing' },
    { name:'Wall Angel', duration:45, cue:'Maintain 3 contact points on wall' },
    { name:'Band External Rotation', duration:60, cue:'Light resistance, full range' },
    { name:'Neck Side Tilt', duration:30, cue:'Breathe into the stretch' },
  ]},
  { id:'r6', name:'Pool Recovery', duration:20, desc:'Use the pool for active recovery and mobility', steps:[
    { name:'Easy Freestyle', duration:300, cue:'60-70% effort, focus on long strokes' },
    { name:'Water Treading', duration:120, cue:'Keep shoulders relaxed, smooth leg kick' },
    { name:'Pool Stretches', duration:180, cue:'Use wall for hamstring and hip flexor stretches' },
    { name:'Cold Water Immersion', duration:120, cue:'15-18°C if available — powerful for recovery' },
    { name:'Sauna', duration:300, cue:'12-15 min at moderate heat to flush with blood' },
  ]},
  { id:'r7', name:'Foam Roll Full Body', duration:15, desc:'Systematic myofascial release for the whole body', steps:[
    { name:'Calves', duration:60, cue:'Cross one leg over, 10 slow rolls each calf' },
    { name:'IT Band / Quads', duration:60, cue:'Slow roll outer thigh, pause on tight spots' },
    { name:'Glutes / Piriformis', duration:60, cue:'Sit on roller, cross ankle — figure four' },
    { name:'Upper Back (thoracic)', duration:60, cue:'Arms crossed, roll between shoulder blades' },
    { name:'Lats', duration:45, cue:'Side lying, roll from armpit to mid-back' },
    { name:'Hip Flexors', duration:45, cue:'Prone, roller under front of hip' },
    { name:'Chest (lacrosse ball)', duration:45, cue:'Against wall, roll pec minor' },
  ]},
]

function RestTimer({ onClose }) {
  const [seconds, setSeconds] = useState(90)
  const [running, setRunning] = useState(true)
  const [preset, setPreset] = useState(90)
  const ref = useRef(null)
  useEffect(() => {
    if (running && seconds > 0) { ref.current = setTimeout(() => setSeconds(s => s - 1), 1000) }
    return () => clearTimeout(ref.current)
  }, [running, seconds])
  const presets = [60, 90, 120, 180]
  const pct = Math.max(0, seconds / preset)
  const r = 54; const c = 2 * Math.PI * r
  return (
    <div className="ft-overlay" onClick={onClose}>
      <div className="ft-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span className="ft-h2" style={{ marginBottom:0 }}>Rest Timer</span>
          <button className="ft-icon-btn" onClick={onClose}><IconClose /></button>
        </div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
            <circle cx="60" cy="60" r={r} fill="none" stroke="#c8f135" strokeWidth="8"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
              strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition:'stroke-dashoffset .5s' }}/>
            <text x="60" y="55" textAnchor="middle" fill="#e8e8f0" fontSize="26" fontFamily="Bebas Neue,sans-serif">
              {String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}
            </text>
            <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">
              {running ? 'resting' : seconds === 0 ? 'done!' : 'paused'}
            </text>
          </svg>
        </div>
        <div className="ft-chips" style={{ justifyContent:'center' }}>
          {presets.map(p => (
            <button key={p} className={`ft-chip${preset===p?' active':''}`} onClick={() => { setPreset(p); setSeconds(p); setRunning(true) }}>{p}s</button>
          ))}
        </div>
        <div className="ft-row" style={{ marginTop:12, justifyContent:'center', gap:12 }}>
          <button className="ft-btn ft-btn-secondary" onClick={() => setRunning(r => !r)}>
            {running ? <IconPause /> : <IconPlay />}
          </button>
          <button className="ft-btn ft-btn-secondary" onClick={() => { setSeconds(preset); setRunning(true) }}>
            <IconRefresh />
          </button>
        </div>
      </div>
    </div>
  )
}

function BendSession({ program, onClose }) {
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(program.stretches[0] ? (STRETCH_LIBRARY.find(s => s.name === program.stretches[0])?.hold || 30) : 30)
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState('ready')
  const ref = useRef(null)
  const stretch = STRETCH_LIBRARY.find(s => s.name === program.stretches[idx])
  const total = program.stretches.length

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    ref.current = setTimeout(() => {
      if (timeLeft <= 1) {
        if (idx + 1 < total) { const next = STRETCH_LIBRARY.find(s => s.name === program.stretches[idx + 1]); setIdx(i => i + 1); setTimeLeft(next?.hold || 30) }
        else { setPhase('done'); setRunning(false) }
      } else { setTimeLeft(t => t - 1) }
    }, 1000)
    return () => clearTimeout(ref.current)
  }, [running, timeLeft, idx, total, program.stretches])

  const hold = stretch?.hold || 30
  const pct = timeLeft / hold
  const r = 54; const c = 2 * Math.PI * r

  if (phase === 'done') return (
    <div className="ft-screen" style={{ textAlign:'center', paddingTop:60 }}>
      <div style={{ fontSize:60, marginBottom:16 }}>🌿</div>
      <div className="ft-h1">Complete!</div>
      <div style={{ color:'#888', marginBottom:24 }}>{program.name} · {total} stretches</div>
      <button className="ft-btn ft-btn-primary" onClick={onClose}>Done</button>
    </div>
  )
  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
        <button className="ft-icon-btn" onClick={onClose}><IconBack /></button>
        <span style={{ color:'#888', fontSize:13 }}>{idx + 1} / {total}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{stretch?.name || program.stretches[idx]}</div>
      <div style={{ color:'#888', fontSize:14, marginBottom:24 }}>{stretch?.muscles}</div>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#4ecdc4" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition:'stroke-dashoffset .8s' }}/>
          <text x="60" y="58" textAnchor="middle" fill="#e8e8f0" fontSize="28" fontFamily="Bebas Neue,sans-serif">{timeLeft}</text>
          <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">seconds</text>
        </svg>
      </div>
      {stretch?.cue && <div className="ft-card" style={{ textAlign:'center', color:'#4ecdc4', marginBottom:20 }}>💭 {stretch.cue}</div>}
      <button className="ft-btn ft-btn-primary ft-btn-full" onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : (timeLeft === hold ? 'Start' : 'Resume')}
      </button>
      {idx + 1 < total && (
        <div style={{ marginTop:12, color:'#555', fontSize:12, textAlign:'center' }}>
          Next: {program.stretches[idx + 1]}
        </div>
      )}
    </div>
  )
}

function StretchesScreen() {
  const [streak, saveStreak] = useStorage('fittrack_stretch_streak', { count:0, lastDate:'' })
  const [todayDone, saveTodayDone] = useStorage('fittrack_stretch_today', [])
  const [activeProgram, setActiveProgram] = useState(null)
  const [view, setView] = useState('programs')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (streak.lastDate === today()) return
    if (streak.lastDate === new Date(Date.now()-86400000).toISOString().slice(0,10)) {
      saveStreak({ count: streak.count + 1, lastDate: today() })
    }
  }, [])

  const markDone = id => {
    if (todayDone.includes(id)) return
    const newDone = [...todayDone, id]
    saveTodayDone(newDone)
    if (!streak.lastDate || streak.lastDate !== today()) saveStreak({ count: streak.count + 1, lastDate: today() })
  }

  if (activeProgram) return <BendSession program={activeProgram} onClose={() => { setActiveProgram(null); markDone(activeProgram.id) }} />
  return (
    <div className="ft-screen embedded">
      <div className="ft-row" style={{ marginBottom:16, gap:12 }}>
        <div className="ft-stat-box" style={{ flex:1 }}>
          <div className="ft-stat-num" style={{ color:'#4ecdc4' }}>{streak.count}</div>
          <div className="ft-stat-lbl">Day Streak</div>
        </div>
        <div className="ft-stat-box" style={{ flex:1 }}>
          <div className="ft-stat-num">{todayDone.length}</div>
          <div className="ft-stat-lbl">Done Today</div>
        </div>
      </div>
      <HubToggle tabs={['programs','library']} value={view} onChange={setView} />
      {view === 'programs' && STRETCH_PROGRAMS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.stretches.length} stretches · ~{p.duration}min</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {todayDone.includes(p.id) && <span style={{ color:'#38b87c' }}><IconCheck /></span>}
              <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActiveProgram(p)}>Start</button>
            </div>
          </div>
        </div>
      ))}
      {view === 'library' && (
        <>
          <input className="ft-input" placeholder="Search stretches…" value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom:10 }}/>
          {STRETCH_LIBRARY.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
            <div key={s.name} className="ft-card">
              <div style={{ fontWeight:600 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{s.muscles} · {s.hold}s{s.sides ? ' each side' : ''}</div>
              <div style={{ fontSize:13, color:'#4ecdc4', marginTop:6 }}>💭 {s.cue}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function RecoverySession({ protocol, onClose }) {
  const [idx, setIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(protocol.steps[0]?.duration || 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const step = protocol.steps[idx]

  useEffect(() => {
    if (!running || timeLeft <= 0) return
    ref.current = setTimeout(() => {
      if (timeLeft <= 1) {
        if (idx + 1 < protocol.steps.length) { const next = protocol.steps[idx + 1]; setIdx(i => i + 1); setTimeLeft(next.duration) }
        else { setDone(true); setRunning(false) }
      } else { setTimeLeft(t => t - 1) }
    }, 1000)
    return () => clearTimeout(ref.current)
  }, [running, timeLeft, idx, protocol.steps])

  const pct = timeLeft / (step?.duration || 60)
  const r = 54; const c = 2 * Math.PI * r
  const mm = String(Math.floor(timeLeft/60)).padStart(2,'0')
  const ss = String(timeLeft%60).padStart(2,'0')

  if (done) return (
    <div className="ft-screen" style={{ textAlign:'center', paddingTop:60 }}>
      <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
      <div className="ft-h1">{protocol.name}</div>
      <div style={{ color:'#888', marginBottom:24 }}>Complete!</div>
      <button className="ft-btn ft-btn-primary" onClick={onClose}>Done</button>
    </div>
  )
  return (
    <div className="ft-screen">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}><IconBack /></button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {protocol.steps.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{step?.name}</div>
      <div style={{ color:'#888', marginBottom:24, fontSize:14 }}>{protocol.name}</div>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#38b87c" strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" transform="rotate(-90 60 60)" style={{transition:'stroke-dashoffset .8s'}}/>
          <text x="60" y="58" textAnchor="middle" fill="#e8e8f0" fontSize="26" fontFamily="Bebas Neue,sans-serif">{mm}:{ss}</text>
          <text x="60" y="74" textAnchor="middle" fill="#888" fontSize="10" fontFamily="DM Sans,sans-serif">{running?'active':'paused'}</text>
        </svg>
      </div>
      {step?.cue && <div className="ft-card" style={{ textAlign:'center', color:'#38b87c', marginBottom:20 }}>💭 {step.cue}</div>}
      <button className="ft-btn ft-btn-primary ft-btn-full" onClick={() => setRunning(r=>!r)}>
        {running ? 'Pause' : (timeLeft === (step?.duration||60) ? 'Start' : 'Resume')}
      </button>
      {idx+1 < protocol.steps.length && (
        <div style={{ marginTop:12, color:'#555', fontSize:12, textAlign:'center' }}>Next: {protocol.steps[idx+1].name}</div>
      )}
    </div>
  )
}

function RecoveryScreen() {
  const [todayDone, saveTodayDone] = useStorage('fittrack_recovery_today', [])
  const [active, setActive] = useState(null)
  const [view, setView] = useState('protocols')
  if (active) return <RecoverySession protocol={active} onClose={() => { saveTodayDone([...todayDone, active.id]); setActive(null) }} />
  return (
    <div className="ft-screen embedded">
      <HubToggle tabs={['protocols','foam roll']} value={view} onChange={setView} />
      {view === 'protocols' && RECOVERY_PROTOCOLS.map(p => (
        <div key={p.id} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{p.steps.length} steps · ~{p.duration}min</div>
              <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{p.desc}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
              {todayDone.includes(p.id) && <span className="ft-badge ft-badge-green">Done</span>}
              <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(p)}>Start</button>
            </div>
          </div>
        </div>
      ))}
      {view === 'foam roll' && (
        <div className="ft-card">
          {RECOVERY_PROTOCOLS.find(p => p.id === 'r7')?.steps.map((s, i) => (
            <div key={i} style={{ padding:'10px 0', borderBottom: i < 6 ? '1px solid #1e1e2e' : 'none' }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{s.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{s.duration}s · {s.cue}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CableSessionRunner({ routine, onClose }) {
  const [idx, setIdx] = useState(0)
  const [sets, setSets] = useState(0)
  const [weight, setWeight] = useState('')
  const [showTimer, setShowTimer] = useState(false)
  const ex = routine.exercises[idx]
  const tut = CABLE_TUTORIALS.find(t => t.name === ex?.name)
  return (
    <div className="ft-screen">
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <button className="ft-icon-btn" onClick={onClose}><IconBack /></button>
        <button className="ft-icon-btn" onClick={() => setShowTimer(true)}><IconTimer /></button>
        <span style={{ color:'#888', fontSize:13 }}>{idx+1} / {routine.exercises.length}</span>
      </div>
      <div className="ft-h1" style={{ marginBottom:4 }}>{ex?.name}</div>
      {tut && <div style={{ color:'#888', fontSize:13, marginBottom:8 }}>{tut.muscles}</div>}
      <div className="ft-card" style={{ textAlign:'center', marginBottom:16 }}>
        <div className="ft-stat-num">{sets} / {ex?.sets}</div>
        <div className="ft-stat-lbl">Sets · {ex?.reps} reps</div>
        <div style={{ marginTop:10 }}>
          <label className="ft-label">Weight (kg)</label>
          <input className="ft-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" style={{ textAlign:'center' }}/>
        </div>
      </div>
      {tut?.tip && <div className="ft-card" style={{ color:'#c8f135', marginBottom:16, fontSize:13 }}>💡 {tut.tip}</div>}
      <div className="ft-row" style={{ gap:12 }}>
        <button className="ft-btn ft-btn-secondary" style={{ flex:1 }} onClick={() => setSets(s => Math.max(0,s-1))}>-</button>
        <button className="ft-btn ft-btn-primary" style={{ flex:2 }} onClick={() => {
          if (sets + 1 >= ex.sets) { if (idx+1 < routine.exercises.length) { setIdx(i=>i+1); setSets(0); setWeight('') } else onClose() }
          else setSets(s=>s+1)
        }}>
          {sets+1 >= ex?.sets && idx+1 >= routine.exercises.length ? 'Finish' : 'Next Set'}
        </button>
      </div>
    </div>
  )
}

function CableScreen() {
  const [view, setView] = useState('routines')
  const [active, setActive] = useState(null)
  if (active) return <CableSessionRunner routine={active} onClose={() => setActive(null)} />
  return (
    <div className="ft-screen embedded">
      <HubToggle tabs={['routines','exercises']} value={view} onChange={setView} />
      {view === 'routines' && CABLE_ROUTINES.map(r => (
        <div key={r.name} className="ft-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{r.name}</div>
              <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{r.exercises.length} exercises</div>
            </div>
            <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={() => setActive(r)}>Start</button>
          </div>
        </div>
      ))}
      {view === 'exercises' && CABLE_TUTORIALS.map(t => (
        <div key={t.name} className="ft-card">
          <div style={{ fontWeight:600 }}>{t.name}</div>
          <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{t.muscles}</div>
          <div style={{ fontSize:13, marginTop:6 }}>{t.how}</div>
          <div style={{ fontSize:13, color:'#c8f135', marginTop:4 }}>💡 {t.tip}</div>
        </div>
      ))}
    </div>
  )
}

export default function Recovery() {
  const [sub, setSub] = useState('stretches')
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>Recover</div>
      <HubToggle tabs={['stretches','recovery','cable']} value={sub} onChange={setSub} />
      {sub === 'stretches' && <StretchesScreen />}
      {sub === 'recovery' && <RecoveryScreen />}
      {sub === 'cable' && <CableScreen />}
    </div>
  )
}
