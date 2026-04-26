import { useState } from 'react'
import { useStorage } from '../utils'
import PageHead from '../components/PageHead'

const CSS = `
.settings-screen { padding-bottom: 120px; }
.settings-group { margin: 0 22px 20px; }
.settings-group-label {
  font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);
  letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; padding-left: 4px;
}
.settings-card { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); overflow: hidden; }
.settings-row {
  display: flex; align-items: center; padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft); gap: 14px;
}
.settings-row:last-child { border-bottom: none; }
.settings-row-icon { width: 36px; height: 36px; background: var(--surface-2); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-dim); }
.settings-row-icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.8; }
.settings-row-info { flex: 1; }
.settings-row-label { font-size: 14.5px; font-weight: 500; }
.settings-row-sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; }
.settings-row-action { color: var(--text-muted); }
.settings-row-action svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; }
.profile-hero {
  margin: 0 22px 24px; background: var(--surface); border: 1px solid var(--border-soft);
  border-radius: var(--r-2xl); padding: 22px;
  display: flex; align-items: center; gap: 18px;
}
.profile-avatar {
  width: 60px; height: 60px; background: color-mix(in srgb, var(--accent) 15%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: 900; font-size: 28px; color: var(--accent);
  flex-shrink: 0;
}
.profile-name { font-family: var(--font-display); font-weight: 900; font-size: 28px; text-transform: uppercase; line-height: 1; }
.profile-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); margin-top: 4px; letter-spacing: 0.06em; }
.kpi-row-s { display: grid; grid-template-columns: 1fr 1fr 1fr; margin: 0 22px 24px; gap: 10px; }
.kpi-s { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 14px 16px; }
.kpi-s-val { font-family: var(--font-display); font-weight: 900; font-size: 28px; line-height: 1; }
.kpi-s-label { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em; margin-top: 4px; }
.danger-btn {
  background: color-mix(in srgb, var(--red) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--red) 25%, transparent);
  color: var(--red); border-radius: var(--r-md); padding: 12px 18px;
  font-family: var(--font-sans); font-size: 14px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center;
}
.api-input {
  width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-md);
  padding: 12px 14px; color: var(--text); font-family: var(--font-mono); font-size: 13px; outline: none;
  margin-bottom: 10px;
}
.api-input:focus { border-color: var(--accent); }
.save-btn {
  background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-md);
  padding: 10px 20px; font-family: var(--font-display); font-weight: 900; font-size: 14px;
  text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer;
}
.modal-overlay { position: fixed; inset: 0; background: color-mix(in srgb, black 70%, transparent); z-index: 400; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-2xl); padding: 28px; width: 100%; max-width: 380px; }
.modal-title { font-family: var(--font-display); font-weight: 900; font-size: 28px; text-transform: uppercase; margin-bottom: 10px; }
.modal-body { font-size: 14px; color: var(--text-dim); line-height: 1.5; margin-bottom: 24px; }
.modal-actions { display: flex; gap: 10px; }
`

const ChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>

export default function Settings({ setTab }) {
  const [apiKey, saveApiKey] = useStorage('fittrack_api_key', '')
  const [workouts] = useStorage('fittrack_workouts', [])
  const [onboarding, saveOnboarding] = useStorage('ft-onboarding', { complete: false })
  const [key, setKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const saveKey = () => { saveApiKey(key); setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const exportData = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k.startsWith('ft') || k.startsWith('fittrack')) {
        try { data[k] = JSON.parse(localStorage.getItem(k)) } catch { data[k] = localStorage.getItem(k) }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `fittrack-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k.startsWith('ft') || k.startsWith('fittrack')) keys.push(k)
    }
    keys.forEach(k => localStorage.removeItem(k))
    setConfirmClear(false)
    window.location.reload()
  }

  return (
    <div className="settings-screen">
      <style>{CSS}</style>

      <PageHead eyebrow="Account" title="THE" accent="CONTROLS." />

      <div className="profile-hero">
        <div className="profile-avatar">D</div>
        <div>
          <div className="profile-name">{onboarding.name || 'Athlete'}</div>
          <div className="profile-sub">{onboarding.focus || 'General Fitness'} · {onboarding.experience || 'Intermediate'}</div>
        </div>
      </div>

      <div className="kpi-row-s">
        <div className="kpi-s"><div className="kpi-s-val">{workouts.length}</div><div className="kpi-s-label">Workouts</div></div>
        <div className="kpi-s"><div className="kpi-s-val">{onboarding.frequency || 4}</div><div className="kpi-s-label">Days/Wk</div></div>
        <div className="kpi-s"><div className="kpi-s-val">{onboarding.units || 'kg'}</div><div className="kpi-s-label">Units</div></div>
      </div>

      <div className="settings-group">
        <div className="settings-group-label">AI Coach</div>
        <div className="settings-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>Anthropic API key — required for AI Coach</div>
          <input className="api-input" type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-…" />
          <button className="save-btn" onClick={saveKey}>{saved ? '✓ Saved' : 'Save Key'}</button>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-label">Adaptive</div>
        <div className="settings-card">
          <button className="settings-row" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => setTab && setTab('adaptive-setup')}>
            <div className="settings-row-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Adaptive Setup</div>
              <div className="settings-row-sub">Tracked joints, triggers, sensitivity</div>
            </div>
            <div className="settings-row-action"><ChevronRight /></div>
          </button>
          <button className="settings-row" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            onClick={() => setTab && setTab('flare-detail')}>
            <div className="settings-row-icon"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3" /></svg></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Flare History</div>
              <div className="settings-row-sub">Patterns, triggers, GP report</div>
            </div>
            <div className="settings-row-action"><ChevronRight /></div>
          </button>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-label">Data</div>
        <div className="settings-card">
          <div className="settings-row" style={{ cursor: 'pointer' }} onClick={exportData}>
            <div className="settings-row-icon"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
            <div className="settings-row-info">
              <div className="settings-row-label">Export Data</div>
              <div className="settings-row-sub">Download all FitTrack data as JSON</div>
            </div>
            <div className="settings-row-action"><ChevronRight /></div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info" style={{ paddingLeft: 4 }}>
              <button className="danger-btn" onClick={() => setConfirmClear(true)}>Clear All Data</button>
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row-info" style={{ paddingLeft: 4 }}>
              <button className="danger-btn" onClick={() => setConfirmReset(true)}>Reset Onboarding</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <div className="settings-group-label">About</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">FitTrack</div>
              <div className="settings-row-sub">v2.0 · React + Vite · Data stored locally</div>
            </div>
          </div>
        </div>
      </div>

      {confirmClear && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Clear all data?</div>
            <div className="modal-body">This deletes all workouts, check-ins, and settings. Cannot be undone.</div>
            <div className="modal-actions">
              <button style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setConfirmClear(false)}>Cancel</button>
              <button style={{ flex: 1 }} className="danger-btn" onClick={clearAll}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {confirmReset && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-title">Reset onboarding?</div>
            <div className="modal-body">You'll go through setup again on next launch. Your workout data is kept.</div>
            <div className="modal-actions">
              <button style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setConfirmReset(false)}>Cancel</button>
              <button style={{ flex: 1 }} className="danger-btn" onClick={() => { saveOnboarding({ complete: false }); setConfirmReset(false) }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
