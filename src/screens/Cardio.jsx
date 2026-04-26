import { useState } from 'react'
import { useStorage, today, dateLabel } from '../utils'

const CARDIO_TYPES = [
  { name: 'Running', icon: '🏃', met: 9.8 },
  { name: 'Cycling', icon: '🚴', met: 7.5 },
  { name: 'Swimming', icon: '🏊', met: 8.0 },
  { name: 'Rowing', icon: '🚣', met: 7.0 },
  { name: 'Elliptical', icon: '⚙️', met: 5.0 },
  { name: 'Walking', icon: '🚶', met: 3.5 },
]

export default function Cardio() {
  const [entries, saveEntries] = useStorage('fittrack_cardio', [])
  const [type, setType] = useState('Running')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const weight = 80
  const save = () => {
    if (!duration) return
    const ct = CARDIO_TYPES.find(c => c.name === type)
    const cal = ct ? Math.round(ct.met * weight * (Number(duration) / 60)) : 0
    saveEntries([...entries, { id: Date.now(), type, duration: Number(duration), distance: Number(distance) || 0, notes, cal, date: today() }])
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setDuration(''); setDistance(''); setNotes('')
  }
  const recent = entries.slice(-10).reverse()
  return (
    <div className="ft-screen">
      <div className="ft-h1">Cardio</div>
      <div className="ft-card" style={{ marginBottom: 16 }}>
        <div className="ft-chips">
          {CARDIO_TYPES.map(c => (
            <button key={c.name} className={`ft-chip${type === c.name ? ' active' : ''}`} onClick={() => setType(c.name)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <div className="ft-row" style={{ marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label className="ft-label">Duration (min)</label>
            <input className="ft-input" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="ft-label">Distance (km)</label>
            <input className="ft-input" type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="5" />
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <label className="ft-label">Notes</label>
          <input className="ft-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did it feel?" />
        </div>
        <button className="ft-btn ft-btn-primary ft-btn-full" style={{ marginTop: 12 }} onClick={save}>
          {saved ? '✓ Logged!' : 'Log Cardio'}
        </button>
      </div>
      {recent.length > 0 && (
        <>
          <div className="ft-h3">Recent</div>
          {recent.map(e => (
            <div key={e.id} className="ft-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{e.type}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {e.duration}min{e.distance ? ` · ${e.distance}km` : ''} · {dateLabel(e.date)}
                  </div>
                </div>
                {e.cal > 0 && <span className="ft-badge ft-badge-orange">{e.cal} kcal</span>}
              </div>
              {e.notes && <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>{e.notes}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
