import { useStorage, today } from '../utils'
import PageHead from '../components/PageHead'

const CSS = `
.adaptive-today { padding-bottom: 120px; animation: screenIn 0.35s cubic-bezier(.2,.8,.2,1); }
.readiness-hero {
  margin: 0 22px 20px; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: var(--r-2xl); padding: 24px; display: flex; align-items: center; gap: 20px;
}
.severity-ring { flex-shrink: 0; }
.readiness-text { flex: 1; }
.readiness-title { font-family: var(--font-display); font-weight: 900; font-size: 32px; text-transform: uppercase; line-height: 0.95; margin-bottom: 6px; }
.readiness-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.06em; line-height: 1.5; }
.adapted-session { margin: 0 22px 20px; }
.adapted-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px; display: block; }
.adapted-inner {
  background: linear-gradient(135deg, color-mix(in srgb, var(--warm) 6%, transparent), transparent 55%), var(--surface);
  border: 1px solid color-mix(in srgb, var(--warm) 18%, transparent);
  border-radius: var(--r-xl); padding: 20px;
}
.adapted-name { font-family: var(--font-display); font-weight: 900; font-size: 32px; text-transform: uppercase; line-height: 0.95; margin-bottom: 8px; }
.adapted-note { font-size: 13px; color: var(--text-dim); line-height: 1.5; margin-bottom: 14px; }
.hydration-strip { margin: 0 22px 20px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 18px 20px; }
.hydration-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px; display: flex; justify-content: space-between; }
.hydration-bar { height: 8px; background: var(--surface-2); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.hydration-fill { height: 100%; background: var(--accent); border-radius: 4px; transition: width 0.6s; }
.hydration-markers { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); }
.recovery-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 0 22px 20px; }
.recovery-tile {
  background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg);
  padding: 16px 14px; text-align: center; cursor: pointer; transition: all 0.15s;
}
.recovery-tile:active { transform: scale(0.97); }
.recovery-tile.primary { background: color-mix(in srgb, var(--accent) 8%, transparent); border-color: color-mix(in srgb, var(--accent) 20%, transparent); }
.recovery-tile-icon { font-size: 22px; margin-bottom: 8px; }
.recovery-tile-name { font-size: 13px; font-weight: 600; }
.recovery-tile-sub { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); margin-top: 4px; }
.smart-streak { margin: 0 22px 20px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 20px; }
.smart-streak-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 12px; }
.smart-streak-num { font-family: var(--font-display); font-weight: 900; font-size: 52px; line-height: 0.9; color: var(--accent); }
.smart-streak-sub { font-size: 13px; color: var(--text-dim); margin-top: 6px; }
.flare-link { margin: 0 22px 20px; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); cursor: pointer; color: var(--text); }
.flare-link-label { font-size: 14px; font-weight: 500; }
.flare-link-sub { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-dim); margin-top: 3px; }
`

const SEVERITY_COLOURS = ['var(--green)', 'var(--warm)', 'var(--orange)', 'var(--red)']
const SEVERITY_LABELS = ['Mild', 'Moderate', 'High', 'Severe']

const RECOVERY_OPTIONS = [
  { icon: '🏊', name: 'Pool',     sub: 'Low impact',    primary: true },
  { icon: '🧖', name: 'Sauna',    sub: 'Heat therapy',  primary: true },
  { icon: '💨', name: 'Steam',    sub: 'Humidity',      primary: true },
  { icon: '🧘', name: 'Yoga',     sub: 'Mobility',      primary: false },
  { icon: '🚶', name: 'Walk',     sub: 'Active rest',   primary: false },
  { icon: '🛁', name: 'Ice Bath', sub: 'Cold therapy',  primary: false },
]

export default function AdaptiveToday({ setTab, flares }) {
  const [checkins] = useStorage('ft-checkins', [])
  const [workouts] = useStorage('fittrack_workouts', [])
  const [adaptiveConfig] = useStorage('ft-adaptive-config', { hydrationTargetMl: 2500 })

  const todayCheckin = checkins.find(c => c.date === today())
  const maxSeverity = todayCheckin
    ? Math.max(0, ...todayCheckin.joints.map(j => j.severity))
    : 0
  const worstJoint = todayCheckin?.joints.find(j => j.severity === maxSeverity)

  // Smart streak: counts both workout days and check-in days
  const activeDays = new Set([...workouts.map(w => w.date), ...checkins.map(c => c.date)])
  let streak = 0
  const cur = new Date()
  while (activeDays.has(cur.toISOString().slice(0, 10))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }

  const hydrationTarget = adaptiveConfig.hydrationTargetMl || 2500
  const hydrationCurrent = 800
  const hydrationPct = Math.min(100, Math.round((hydrationCurrent / hydrationTarget) * 100))

  const severityColour = SEVERITY_COLOURS[maxSeverity - 1] || 'var(--orange)'
  const ringR = 28; const ringC = 2 * Math.PI * ringR

  return (
    <div className="adaptive-today">
      <style>{CSS}</style>

      <PageHead eyebrow={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} title="STEADY" accent="DOES IT." />

      <div className="readiness-hero">
        <div className="severity-ring">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={ringR} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
            <circle cx="36" cy="36" r={ringR} fill="none" stroke={severityColour} strokeWidth="6"
              strokeDasharray={ringC} strokeDashoffset={ringC * 0.15}
              strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x="36" y="40" textAnchor="middle" fill={severityColour} fontSize="18" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900">
              {maxSeverity}
            </text>
          </svg>
        </div>
        <div className="readiness-text">
          <div className="readiness-title">{SEVERITY_LABELS[maxSeverity - 1] || 'Elevated'}<br />Severity</div>
          <div className="readiness-sub">{worstJoint?.id || 'Joint'} flagged today.<br />Training adapted accordingly.</div>
        </div>
      </div>

      <div className="adapted-session">
        <span className="adapted-label">Adapted Session</span>
        <div className="adapted-inner">
          <div className="adapted-name">{maxSeverity >= 3 ? 'Session Deferred' : 'Light Upper Body'}</div>
          <div className="adapted-note">
            {maxSeverity >= 3
              ? 'Severity 3 detected — today\'s loaded session has been deferred. Focus on recovery.'
              : 'High-load lower body work removed. Upper body volume reduced. PR prompts hidden.'}
          </div>
          {maxSeverity < 3 && (
            <button style={{ background: 'color-mix(in srgb, var(--warm) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warm) 25%, transparent)', borderRadius: 'var(--r-md)', padding: '10px 18px', color: 'var(--warm)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', cursor: 'pointer' }}
              onClick={() => setTab('active-workout')}>
              Begin Adapted
            </button>
          )}
        </div>
      </div>

      <div className="hydration-strip">
        <div className="hydration-label">
          <span>Hydration</span>
          <span style={{ color: 'var(--text)' }}>{hydrationCurrent}ml / {hydrationTarget}ml</span>
        </div>
        <div className="hydration-bar"><div className="hydration-fill" style={{ width: `${hydrationPct}%` }} /></div>
        <div className="hydration-markers"><span>0</span><span>{(hydrationTarget / 2 / 1000).toFixed(1)}L</span><span>{(hydrationTarget / 1000).toFixed(1)}L</span></div>
      </div>

      <div style={{ padding: '0 22px 12px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>What&apos;s On The Table</div>
      </div>
      <div className="recovery-grid">
        {RECOVERY_OPTIONS.map(opt => (
          <div key={opt.name} className={`recovery-tile${opt.primary ? ' primary' : ''}`}>
            <div className="recovery-tile-icon">{opt.icon}</div>
            <div className="recovery-tile-name">{opt.name}</div>
            <div className="recovery-tile-sub">{opt.sub}</div>
          </div>
        ))}
      </div>

      <div className="smart-streak">
        <div className="smart-streak-label">Smart Training Streak</div>
        <div className="smart-streak-num">{streak}</div>
        <div className="smart-streak-sub">Rest days count. Showing up counts. Keep going.</div>
      </div>

      <div className="flare-link" onClick={() => setTab('flare-detail')}>
        <div>
          <div className="flare-link-label">Flare History</div>
          <div className="flare-link-sub">{flares?.episodes?.length || 0} episodes tracked · See the pattern</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </div>
    </div>
  )
}
