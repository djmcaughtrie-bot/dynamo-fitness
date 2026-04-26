import { useState } from 'react'
import { useStorage, today, dateLabel } from '../utils'

const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>

function ChipGroup({ options, value, onChange, multi }) {
  const toggle = o => {
    if (!multi) { onChange(o); return }
    const arr = Array.isArray(value) ? value : []
    onChange(arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o])
  }
  const isActive = o => multi ? (Array.isArray(value) && value.includes(o)) : value === o
  return (
    <div className="ft-chips">
      {options.map(o => (
        <button key={o} className={`ft-chip${isActive(o) ? ' active' : ''}`} onClick={() => toggle(o)}>{o}</button>
      ))}
    </div>
  )
}

export default function Scheduler() {
  const [schedule, saveSchedule] = useStorage('fittrack_schedule', {})
  const [selectedDate, setSelectedDate] = useState(today())
  const [label, setLabel] = useState('')
  const [type, setType] = useState('Gym')
  const addItem = () => {
    if (!label) return
    const cur = schedule[selectedDate] || []
    saveSchedule({ ...schedule, [selectedDate]: [...cur, { label, type, id: Date.now() }] })
    setLabel('')
  }
  const remove = (date, id) => {
    saveSchedule({ ...schedule, [date]: schedule[date].filter(i => i.id !== id) })
  }
  const next7 = Array.from({ length:7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate()+i); return d.toISOString().slice(0,10) })
  return (
    <div className="ft-screen">
      <div className="ft-h1">Scheduler</div>
      <div className="ft-scrollx" style={{ marginBottom:16 }}>
        {next7.map(d => (
          <button key={d} className={`ft-chip${selectedDate===d?' active':''}`} onClick={() => setSelectedDate(d)} style={{ minWidth:60, textAlign:'center' }}>
            <div style={{ fontSize:10 }}>{new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short'})}</div>
            <div style={{ fontWeight:700 }}>{d.slice(8)}</div>
          </button>
        ))}
      </div>
      <div className="ft-card" style={{ marginBottom:16 }}>
        <div className="ft-h3">Add to {dateLabel(selectedDate)}</div>
        <input className="ft-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Push A, 5k run…" style={{ marginBottom:8 }}/>
        <ChipGroup options={['Gym','Home','Cardio','Golf','Rest']} value={type} onChange={setType} />
        <button className="ft-btn ft-btn-primary ft-btn-sm" onClick={addItem}><IconPlus /> Add</button>
      </div>
      {next7.map(d => {
        const items = schedule[d] || []
        if (!items.length) return null
        return (
          <div key={d} className="ft-card">
            <div style={{ fontSize:12, fontWeight:700, color:'#888', marginBottom:8 }}>{dateLabel(d)}</div>
            {items.map(item => (
              <div key={item.id} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0' }}>
                <span>{item.label}</span>
                <div style={{ display:'flex', gap:8 }}>
                  <span className="ft-tag">{item.type}</span>
                  <button className="ft-icon-btn" onClick={() => remove(d, item.id)} style={{ width:20 }}><IconTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
