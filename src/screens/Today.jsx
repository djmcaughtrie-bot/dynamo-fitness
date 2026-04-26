import { useState } from 'react'
import { useStorage, today } from '../utils'
import PageHead from '../components/PageHead'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const CSS = `
.today-screen { padding-bottom: 120px; animation: screenIn 0.35s cubic-bezier(.2,.8,.2,1); }
.today-status {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 22px 0; font-family: var(--font-mono); font-size: 10.5px;
  color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase;
}
.today-status .live { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); }
.today-status .live::before {
  content: ''; width: 6px; height: 6px; background: var(--accent);
  border-radius: 50%; animation: pulse 1.8s infinite; box-shadow: 0 0 10px var(--accent);
}
.checkin-banner {
  margin: 12px 22px; background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: var(--r-xl); padding: 14px 18px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.checkin-banner p { font-size: 13px; color: var(--text-dim); flex: 1; line-height: 1.4; }
.checkin-banner strong { color: var(--text); display: block; font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.kpi-row { display: flex; gap: 10px; padding: 0 22px 20px; }
.kpi-cell {
  flex: 1; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: var(--r-lg); padding: 14px 16px;
}
.kpi-val {
  font-family: var(--font-display); font-weight: 900; font-size: 32px;
  line-height: 0.95; letter-spacing: -0.02em;
}
.kpi-val small { font-size: 13px; color: var(--text-dim); font-weight: 700; margin-left: 2px; }
.kpi-label {
  font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.14em; margin-top: 5px;
}
.session-wrap { margin: 0 22px 18px; }
.session-label {
  font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
  letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px; display: block;
}
.plan-inner {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%), var(--surface);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: var(--r-xl); padding: 20px; position: relative; overflow: hidden;
}
.plan-inner::after {
  content: ''; position: absolute; top: -30px; right: -30px; width: 130px; height: 130px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%);
  pointer-events: none;
}
.plan-tag {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 10px; color: var(--accent);
  letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;
}
.plan-tag::before { content: ''; width: 5px; height: 5px; background: var(--accent); border-radius: 50%; animation: pulse 1.8s infinite; }
.plan-title {
  font-family: var(--font-display); font-weight: 900; font-size: 38px;
  line-height: 0.95; text-transform: uppercase; letter-spacing: -0.015em; margin-bottom: 12px;
}
.plan-title .accent { color: var(--accent); font-style: italic; }
.plan-meta {
  display: flex; gap: 18px; font-size: 12.5px; color: var(--text-dim); margin-bottom: 16px;
  font-family: var(--font-mono); letter-spacing: 0.02em;
}
.plan-meta strong { color: var(--text); font-weight: 500; }
.intensity-row {
  display: flex; align-items: center; gap: 10px; padding-top: 14px; border-top: 1px solid var(--border-soft);
  font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
  text-transform: uppercase; letter-spacing: 0.14em;
}
.intensity-bar { display: flex; gap: 3px; flex: 1; }
.intensity-seg { flex: 1; height: 5px; background: var(--surface-3); border-radius: 1px; }
.intensity-seg.on { background: var(--accent); }
.begin-btn {
  margin-top: 16px; width: 100%; background: var(--accent); color: var(--on-accent); border: none;
  border-radius: var(--r-md); padding: 14px 20px;
  font-family: var(--font-display); font-weight: 900; font-size: 18px;
  text-transform: uppercase; letter-spacing: 0.02em; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--accent) 20%, transparent);
}
.week-card {
  margin: 0 22px 18px; background: var(--surface);
  border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 20px;
}
.week-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.week-head-label {
  font-family: var(--font-mono); font-size: 10px; color: var(--text-dim);
  letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 6px;
}
.week-vol-num {
  font-family: var(--font-display); font-weight: 900; font-size: 48px;
  line-height: 0.9; letter-spacing: -0.025em;
}
.week-vol-num small { font-size: 15px; color: var(--text-dim); font-weight: 600; margin-left: 4px; }
.week-delta {
  font-family: var(--font-mono); font-size: 10.5px; color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent); padding: 5px 9px;
  border-radius: 5px; letter-spacing: 0.08em;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
}
.week-bars { display: flex; align-items: flex-end; height: 78px; gap: 7px; margin-bottom: 10px; }
.day-bar { flex: 1; background: var(--surface-3); border-radius: 3px 3px 0 0; min-height: 5px; position: relative; }
.day-bar.is-active { background: var(--accent); opacity: 0.6; }
.day-bar.is-today { background: var(--accent); opacity: 1; box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 50%, transparent); }
.day-labels {
  display: flex; justify-content: space-between; gap: 7px;
  font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.day-labels span { flex: 1; text-align: center; }
.day-labels span.is-today { color: var(--accent); }
.week-stats {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  margin-top: 20px; padding-top: 18px; border-top: 1px dashed var(--border);
}
.week-stat { padding: 0 12px; border-left: 1px solid var(--border-soft); }
.week-stat:first-child { border-left: none; padding-left: 0; }
.week-stat-v { font-family: var(--font-display); font-weight: 800; font-size: 22px; line-height: 1; }
.week-stat-k { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 6px; }
.ai-suggestion {
  margin: 0 22px 18px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent 55%), var(--surface);
  border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
  border-radius: var(--r-xl); padding: 20px; position: relative; overflow: hidden; cursor: pointer;
}
.ai-suggestion::before {
  content: ''; position: absolute; top: -40px; right: -40px; width: 160px; height: 160px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%);
  pointer-events: none;
}
.ai-label {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--font-mono); font-size: 10px; color: var(--accent);
  letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px;
}
.ai-label::before { content: '◆'; font-size: 10px; }
.ai-suggestion h4 {
  font-family: var(--font-display); font-weight: 800; font-size: 24px;
  text-transform: uppercase; letter-spacing: -0.005em; margin-bottom: 6px; line-height: 1.05;
}
.ai-suggestion p { font-size: 13px; color: var(--text-dim); line-height: 1.45; margin-bottom: 14px; max-width: 90%; }
.ai-cta-pill {
  display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: var(--on-accent);
  font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 9px 14px; border-radius: 8px; border: none; cursor: pointer;
}
.recent-list {
  margin: 0 22px 18px; background: var(--surface);
  border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 4px 18px;
}
.recent-item {
  display: flex; align-items: center; padding: 16px 0;
  border-bottom: 1px solid var(--border-soft); gap: 14px;
}
.recent-item:last-child { border-bottom: none; }
.recent-icon {
  width: 40px; height: 40px; background: var(--surface-2); border-radius: 11px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-dim);
}
.recent-icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.8; }
.recent-info { flex: 1; min-width: 0; }
.recent-title { font-weight: 500; font-size: 14.5px; margin-bottom: 4px; }
.recent-sub { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; }
.recent-time { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-muted); text-align: right; }
.recent-time strong { display: block; color: var(--text); font-weight: 500; margin-bottom: 3px; }
.lanes {
  height: 18px; margin: 36px 22px;
  background-image: repeating-linear-gradient(90deg, transparent 0, transparent 10px, var(--border) 10px, var(--border) 22px);
  opacity: 0.5;
  -webkit-mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 15%, black 85%, transparent);
}
`

export default function Today({ setTab }) {
  const [workouts] = useStorage('fittrack_workouts', [])
  const [checkins] = useStorage('ft-checkins', [])
  const [dismissBanner, setDismissBanner] = useState(false)

  const now = new Date()
  const todayStr = today()
  const todayCheckin = checkins.find(c => c.date === todayStr)
  const showBanner = !todayCheckin && !dismissBanner

  // Smart streak: any day with a workout OR a check-in
  const activeDays = new Set([
    ...workouts.map(w => w.date),
    ...checkins.map(c => c.date),
  ])
  let streak = 0
  const cur = new Date(now)
  while (true) {
    const ds = cur.toISOString().slice(0, 10)
    if (activeDays.has(ds)) { streak++; cur.setDate(cur.getDate() - 1) }
    else break
  }

  // Weekly volume bars (last 7 days, Mon–Sun of current week)
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().slice(0, 10)
    const vol = workouts
      .filter(w => w.date === ds)
      .reduce((s, w) => s + (w.exercises || []).reduce((es, ex) =>
        es + (ex.sets || []).reduce((ss, set) =>
          ss + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0), 0), 0)
    return { ds, vol, isToday: ds === todayStr }
  })
  const weekTotal = week.reduce((s, d) => s + d.vol, 0)
  const maxVol = Math.max(...week.map(d => d.vol), 1)
  const activeDaysThisWeek = week.filter(d => d.vol > 0).length

  const recent = workouts.slice(-5).reverse()
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()

  return (
    <div className="today-screen">
      <style>{CSS}</style>

      <div className="today-status">
        <span>{dateStr}</span>
        <span className="live">Ready</span>
      </div>

      <PageHead
        eyebrow={now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
        title="LET'S MAKE IT"
        accent="COUNT."
      />

      {showBanner && (
        <div className="checkin-banner fade-up">
          <div>
            <strong>Morning check-in</strong>
            <p>How are you feeling? Takes 2 minutes.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button style={{ background: 'var(--accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--r-md)', padding: '9px 14px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', cursor: 'pointer' }}
              onClick={() => setTab('checkin')}>
              Start
            </button>
            <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '9px 10px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
              onClick={() => setDismissBanner(true)}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="kpi-row fade-up delay-1">
        <div className="kpi-cell">
          <div className="kpi-val">{streak}</div>
          <div className="kpi-label">Day Streak</div>
        </div>
        <div className="kpi-cell">
          <div className="kpi-val">
            {weekTotal > 999 ? (weekTotal / 1000).toFixed(1) : weekTotal}
            <small>{weekTotal > 999 ? 't' : 'kg'}</small>
          </div>
          <div className="kpi-label">Week Vol</div>
        </div>
        <div className="kpi-cell">
          <div className="kpi-val">{activeDaysThisWeek}</div>
          <div className="kpi-label">Active Days</div>
        </div>
      </div>

      <div className="session-wrap fade-up delay-2">
        <span className="session-label">Today&#39;s Session</span>
        <div className="plan-inner">
          <div className="plan-tag">Programme · Week 3</div>
          <div className="plan-title">Push A<br /><span className="accent">Day 1</span></div>
          <div className="plan-meta">
            <span><strong>6</strong> exercises</span>
            <span><strong>~55</strong> min</span>
            <span><strong>18</strong> sets</span>
          </div>
          <div className="intensity-row">
            <span>Intensity</span>
            <div className="intensity-bar">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className={`intensity-seg${i <= 4 ? ' on' : ''}`} />)}
            </div>
            <span>4/5</span>
          </div>
          <button className="begin-btn" onClick={() => setTab('active-workout')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Begin
          </button>
        </div>
      </div>

      <div className="week-card fade-up delay-3">
        <div className="week-head">
          <div>
            <div className="week-head-label">Weekly Volume</div>
            <div className="week-vol-num">
              {weekTotal > 999 ? (weekTotal / 1000).toFixed(1) : weekTotal}
              <small>{weekTotal > 999 ? 't' : 'kg'}</small>
            </div>
          </div>
          <div className="week-delta">This Week</div>
        </div>
        <div className="week-bars">
          {week.map((d, i) => (
            <div key={i}
              className={`day-bar${d.vol > 0 ? ' is-active' : ''}${d.isToday ? ' is-today' : ''}`}
              style={{ height: `${Math.max(5, (d.vol / maxVol) * 100)}%` }}
            />
          ))}
        </div>
        <div className="day-labels">
          {DAYS.map((d, i) => (
            <span key={i} className={week[i].isToday ? 'is-today' : ''}>{d}</span>
          ))}
        </div>
        <div className="week-stats">
          <div className="week-stat"><div className="week-stat-v">{activeDaysThisWeek}</div><div className="week-stat-k">Sessions</div></div>
          <div className="week-stat"><div className="week-stat-v">{weekTotal > 999 ? `${(weekTotal / 1000).toFixed(1)}t` : `${weekTotal}kg`}</div><div className="week-stat-k">Volume</div></div>
          <div className="week-stat"><div className="week-stat-v">{7 - activeDaysThisWeek}</div><div className="week-stat-k">Rest Days</div></div>
        </div>
      </div>

      <div className="ai-suggestion fade-up delay-4" onClick={() => setTab('ai')}>
        <div className="ai-label">AI Suggestion</div>
        <h4>Push A is right<br />for today.</h4>
        <p>Your last session was two days ago. Recovery looks good. Stick to the plan.</p>
        <button className="ai-cta-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9z" /></svg>
          Ask AI Coach
        </button>
      </div>

      {recent.length > 0 && (
        <div className="recent-list fade-up delay-5">
          {recent.slice(0, 4).map((w, i) => (
            <div key={w.id || i} className="recent-item">
              <div className="recent-icon">
                <svg viewBox="0 0 24 24"><path d="M6.5 6.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0"/><path d="M17.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0"/><path d="M6.5 6.5L17.5 17.5" /></svg>
              </div>
              <div className="recent-info">
                <div className="recent-title">{w.name || 'Workout'}</div>
                <div className="recent-sub">{(w.exercises || []).length} exercises</div>
              </div>
              <div className="recent-time">
                <strong>{w.date === todayStr ? 'Today' : w.date?.slice(5)}</strong>
                {w.duration ? `${w.duration}min` : '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lanes" />
    </div>
  )
}
