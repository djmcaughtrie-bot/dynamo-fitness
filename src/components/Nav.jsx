import { useState } from 'react'

const CSS = `
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; padding: 14px 18px 26px;
  background: linear-gradient(to top, var(--bg) 55%, color-mix(in srgb, var(--bg) 85%, transparent) 80%, transparent);
  display: flex; justify-content: center; z-index: 100; pointer-events: none;
}
.nav-inner {
  display: flex; justify-content: space-between; align-items: center;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  border: 1px solid var(--border); border-radius: var(--r-pill); padding: 8px;
  width: 100%; pointer-events: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
}
.nav-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 8px 0 6px; color: var(--text-muted); background: none; border: none;
  cursor: pointer; transition: color 0.2s;
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
}
.nav-btn.active { color: var(--text); }
.nav-btn.active svg { stroke: var(--accent); }
.nav-btn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; }
.nav-fab {
  width: 58px; height: 58px; background: var(--accent); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: #000;
  font-family: var(--font-display); font-weight: 900; font-size: 21px;
  border: none; cursor: pointer; margin: -18px 2px; position: relative; letter-spacing: -0.02em;
  box-shadow: 0 8px 28px color-mix(in srgb, var(--accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.25);
}
.nav-fab::after {
  content: ''; position: absolute; inset: -2px; border-radius: 50%;
  border: 1.5px solid var(--accent); opacity: 0.35;
  animation: ring 2.6s infinite; z-index: -1;
}
/* More drawer */
.more-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 200; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
}
.more-sheet {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; z-index: 201;
  background: var(--surface-2); border-radius: 28px 28px 0 0;
  border-top: 1px solid var(--border); padding: 12px 0 32px;
}
.more-handle {
  width: 36px; height: 4px; background: var(--border);
  border-radius: 2px; margin: 8px auto 20px;
}
.more-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 22px; cursor: pointer; transition: background 0.15s;
  font-size: 16px; font-weight: 500; color: var(--text);
  background: none; border: none; width: 100%; text-align: left;
}
.more-item:active { background: var(--surface-3); }
.more-item svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; color: var(--text-dim); }
.more-item-new {
  font-family: var(--font-mono); font-size: 9px; color: var(--accent);
  letter-spacing: 0.1em; text-transform: uppercase; margin-left: auto;
}
`

const MORE_ITEMS = [
  { id: 'cardio',  label: 'Cardio',         icon: <svg viewBox="0 0 24 24"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg> },
  { id: 'golf',    label: 'Golf',            icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="19" r="2"/><path d="M12 17V3l7 4-7 4"/></svg> },
  { id: 'recover', label: 'Recovery',        icon: <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { id: 'schedule', label: 'Schedule',       icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
  { id: 'settings', label: 'Settings',       icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
  { id: 'adaptive-setup', label: 'Adaptive Setup', icon: <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3"/></svg>, isNew: true },
  { id: 'flare-detail',   label: 'Flare Detail',   icon: <svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.5 10.677a2 2 0 1 0 2.823 2.823"/><path d="M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6c3.718 0 7.113 3.009 9 6-.59.942-1.28 1.832-2.058 2.587"/></svg>, isNew: true },
]

let _injected = false
function injectCSS() {
  if (_injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-nav', '')
  el.textContent = CSS
  document.head.appendChild(el)
  _injected = true
}

export default function Nav({ tab, setTab }) {
  injectCSS()
  const [showMore, setShowMore] = useState(false)

  const handleMore = id => { setShowMore(false); setTab(id) }

  return (
    <>
      <nav className="bottom-nav">
        <div className="nav-inner">
          <button className={`nav-btn${tab === 'today' ? ' active' : ''}`} onClick={() => setTab('today')}>
            <svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>
            Today
          </button>
          <button className={`nav-btn${tab === 'train' ? ' active' : ''}`} onClick={() => setTab('train')}>
            <svg viewBox="0 0 24 24"><path d="M4 9v6M20 9v6M8 7v10M16 7v10M8 12h8"/></svg>
            Train
          </button>
          <button className="nav-fab" aria-label="AI Coach" onClick={() => setTab('ai')}>AI</button>
          <button className={`nav-btn${tab === 'stats' ? ' active' : ''}`} onClick={() => setTab('stats')}>
            <svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>
            Stats
          </button>
          <button className={`nav-btn${showMore ? ' active' : ''}`} onClick={() => setShowMore(true)}>
            <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
            More
          </button>
        </div>
      </nav>

      {showMore && (
        <>
          <div className="more-overlay" onClick={() => setShowMore(false)} />
          <div className="more-sheet">
            <div className="more-handle" />
            {MORE_ITEMS.map(item => (
              <button key={item.id} className="more-item" onClick={() => handleMore(item.id)}>
                {item.icon}
                {item.label}
                {item.isNew && <span className="more-item-new">New</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}
