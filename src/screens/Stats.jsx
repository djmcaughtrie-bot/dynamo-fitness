import { useState } from 'react'
import { useStorage, today, dateLabel, kg } from '../utils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function HubToggle({ tabs, value, onChange }) {
  return (
    <div className="ft-tab-bar">
      {tabs.map(t => (
        <button key={t} className={`ft-tab-btn${value === t ? ' active' : ''}`} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

function ProgressScreen() {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [cardio] = useStorage('fittrack_cardio', [])
  const monthData = (() => {
    const months = {}
    workouts.forEach(w => {
      const m = w.date.slice(0,7)
      if (!months[m]) months[m] = { month: m.slice(5), workouts:0, cardio:0 }
      months[m].workouts++
    })
    cardio.forEach(c => {
      const m = c.date.slice(0,7)
      if (!months[m]) months[m] = { month: m.slice(5), workouts:0, cardio:0 }
      months[m].cardio++
    })
    return Object.values(months).slice(-6)
  })()
  const totalVolume = workouts.reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + (Number(e.sets)||0)*(Number(e.reps)||0)*(Number(e.weight)||0), 0), 0)
  return (
    <div className="ft-screen embedded">
      <div className="ft-grid-3" style={{ marginBottom:16 }}>
        <div className="ft-stat-box">
          <div className="ft-stat-num">{workouts.length}</div>
          <div className="ft-stat-lbl">Workouts</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#4ecdc4' }}>{cardio.length}</div>
          <div className="ft-stat-lbl">Cardio</div>
        </div>
        <div className="ft-stat-box">
          <div className="ft-stat-num" style={{ color:'#f5a623', fontSize:20 }}>{(totalVolume/1000).toFixed(0)}k</div>
          <div className="ft-stat-lbl">Vol (kg)</div>
        </div>
      </div>
      <div className="ft-card">
        <div className="ft-h3">Monthly Activity</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthData}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="month" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Bar dataKey="workouts" fill="#c8f135" radius={[4,4,0,0]}/>
            <Bar dataKey="cardio" fill="#4ecdc4" radius={[4,4,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function VolumeTracker() {
  const [workouts] = useStorage('fittrack_workouts', [])
  const data = (() => {
    const weeks = {}
    workouts.forEach(w => {
      const d = new Date(w.date); const week = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2,'0')}`
      if (!weeks[week]) weeks[week] = { week, sets:0, volume:0 }
      w.exercises.forEach(e => {
        weeks[week].sets += Number(e.sets) || 0
        weeks[week].volume += (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weight) || 1)
      })
    })
    return Object.values(weeks).slice(-8)
  })()
  return (
    <div className="ft-screen embedded">
      <div className="ft-h3">Weekly Sets</div>
      <div className="ft-card">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="week" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Bar dataKey="sets" fill="#c8f135" radius={[4,4,0,0]}/></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="ft-h3" style={{ marginTop:8 }}>Weekly Volume (kg)</div>
      <div className="ft-card">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
            <XAxis dataKey="week" tick={{ fill:'#666', fontSize:10 }}/>
            <YAxis tick={{ fill:'#666', fontSize:10 }}/>
            <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
            <Line type="monotone" dataKey="volume" stroke="#6c63ff" strokeWidth={2} dot={false}/></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function OneRMCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const epley = weight && reps ? (Number(weight) * (1 + Number(reps) / 30)).toFixed(1) : null
  const brzycki = weight && reps ? (Number(weight) / (1.0278 - 0.0278 * Number(reps))).toFixed(1) : null
  const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60]
  return (
    <div className="ft-screen embedded">
      <div className="ft-card">
        <div className="ft-row" style={{ gap:12 }}>
          <div style={{ flex:1 }}>
            <label className="ft-label">Weight (kg)</label>
            <input className="ft-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="100"/>
          </div>
          <div style={{ flex:1 }}>
            <label className="ft-label">Reps</label>
            <input className="ft-input" type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="5"/>
          </div>
        </div>
      </div>
      {epley && (
        <>
          <div className="ft-grid-2" style={{ marginBottom:12 }}>
            <div className="ft-stat-box">
              <div className="ft-stat-num">{epley}</div>
              <div className="ft-stat-lbl">Epley 1RM</div>
            </div>
            <div className="ft-stat-box">
              <div className="ft-stat-num" style={{ color:'#6c63ff' }}>{brzycki}</div>
              <div className="ft-stat-lbl">Brzycki 1RM</div>
            </div>
          </div>
          <div className="ft-h3">% Chart (Epley)</div>
          {pcts.map(p => (
            <div key={p} className="ft-card" style={{ padding:'8px 12px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#888' }}>{p}%</span>
              <span style={{ fontWeight:600 }}>{(epley * p / 100).toFixed(1)} kg</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function LiftTracker() {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [selected, setSelected] = useState('')
  const lifts = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))].sort()
  const data = workouts.filter(w => w.exercises.some(e => e.name === selected)).map(w => {
    const e = w.exercises.find(ex => ex.name === selected)
    return { date: w.date.slice(5), weight: Number(e.weight) || 0, volume: (Number(e.sets)||0)*(Number(e.reps)||0)*(Number(e.weight)||0) }
  })
  const pb = data.reduce((max, d) => d.weight > max ? d.weight : max, 0)
  return (
    <div className="ft-screen embedded">
      <select className="ft-select" value={selected} onChange={e => setSelected(e.target.value)} style={{ marginBottom:12 }}>
        <option value="">Select exercise…</option>
        {lifts.map(l => <option key={l}>{l}</option>)}
      </select>
      {selected && data.length > 0 && (
        <>
          <div className="ft-stat-box" style={{ marginBottom:12, textAlign:'center' }}>
            <div className="ft-stat-num">{pb}kg</div>
            <div className="ft-stat-lbl">Personal Best</div>
          </div>
          <div className="ft-card">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e"/>
                <XAxis dataKey="date" tick={{ fill:'#666', fontSize:10 }}/>
                <YAxis tick={{ fill:'#666', fontSize:10 }}/>
                <Tooltip contentStyle={{ background:'#13131e', border:'1px solid #2e2e3e', borderRadius:8, color:'#e8e8f0' }}/>
                <Line type="monotone" dataKey="weight" stroke="#c8f135" strokeWidth={2} dot={{ fill:'#c8f135', r:3 }}/></LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {(!selected || data.length === 0) && (
        <div className="ft-empty"><div>Select an exercise to see your progress</div></div>
      )}
    </div>
  )
}

export default function Stats() {
  const [sub, setSub] = useState('progress')
  return (
    <div style={{ paddingTop:16, paddingLeft:16, paddingRight:16 }}>
      <div className="ft-h1" style={{ marginBottom:12 }}>Stats</div>
      <HubToggle tabs={['progress','volume','lifts','1rm']} value={sub} onChange={setSub} />
      {sub === 'progress' && <ProgressScreen />}
      {sub === 'volume' && <VolumeTracker />}
      {sub === 'lifts' && <LiftTracker />}
      {sub === '1rm' && <OneRMCalculator />}
    </div>
  )
}
