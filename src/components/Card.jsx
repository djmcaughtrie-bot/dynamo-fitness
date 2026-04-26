const CSS = `
.card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  padding: 20px;
}
.card-accent {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%), var(--surface);
  border-color: color-mix(in srgb, var(--accent) 20%, transparent);
  position: relative; overflow: hidden;
}
.card-accent::before {
  content: '';
  position: absolute; top: 0; left: 0; bottom: 0; width: 3px;
  background: var(--accent);
  border-radius: var(--r-xl) 0 0 var(--r-xl);
}
.card-accent::after {
  content: '';
  position: absolute; top: -40px; right: -40px; width: 160px; height: 160px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%);
  pointer-events: none;
}
.card-attention {
  background: color-mix(in srgb, var(--accent) 4%, var(--surface));
  border-color: color-mix(in srgb, var(--accent) 15%, transparent);
}
`

let _injected = false
function injectCSS() {
  if (_injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-card', '')
  el.textContent = CSS
  document.head.appendChild(el)
  _injected = true
}

export default function Card({ variant = 'base', children, className = '', style }) {
  injectCSS()
  return (
    <div className={`card card-${variant} ${className}`} style={style}>
      {children}
    </div>
  )
}
