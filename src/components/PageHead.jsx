const CSS = `
.page-head { padding: 14px 22px 24px; }
.page-head-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 10.5px; color: var(--text-dim);
  letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px;
}
.page-head-eyebrow::before {
  content: ''; width: 18px; height: 1px; background: var(--accent);
}
.page-head-title {
  font-family: var(--font-display); font-weight: 900;
  font-size: clamp(44px, 11vw, 56px);
  line-height: 0.92; text-transform: uppercase;
  letter-spacing: -0.02em; margin-bottom: 10px;
}
.page-head-accent { color: var(--accent); font-style: italic; }
.page-head-sub {
  font-size: 14px; color: var(--text-dim); line-height: 1.5; margin-top: 8px;
}
`

let _injected = false
function injectCSS() {
  if (_injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-pagehead', '')
  el.textContent = CSS
  document.head.appendChild(el)
  _injected = true
}

export default function PageHead({ eyebrow, title, accent, sub }) {
  injectCSS()
  return (
    <div className="page-head">
      {eyebrow && <div className="page-head-eyebrow">{eyebrow}</div>}
      <div className="page-head-title">
        {title} <span className="page-head-accent">{accent}</span>
      </div>
      {sub && <div className="page-head-sub">{sub}</div>}
    </div>
  )
}
