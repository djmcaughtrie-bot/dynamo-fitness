const CSS = `
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 0 20px; border: none; border-radius: var(--r-md);
  font-family: var(--font-sans); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: transform 0.1s ease, opacity 0.15s ease;
  text-decoration: none; white-space: nowrap;
}
.btn:active { transform: scale(0.985); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-primary {
  background: var(--accent); color: #000;
  font-family: var(--font-display); font-weight: 900; font-size: 15px;
  text-transform: uppercase; letter-spacing: 0.04em;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 20%, transparent);
}
.btn-secondary {
  background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
}
.btn-ghost {
  background: transparent; border: 1px solid var(--border); color: var(--text-dim);
}
.btn-danger {
  background: color-mix(in srgb, var(--red) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--red) 30%, transparent);
  color: var(--red);
}
.btn-cta {
  background: var(--accent); color: #000; width: 100%; padding: 18px 20px;
  font-family: var(--font-display); font-weight: 900; font-size: 17px;
  text-transform: uppercase; letter-spacing: 0.04em;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--accent) 20%, transparent);
}
.btn-sm { min-height: 36px; padding: 0 14px; font-size: 13px; }
`

let _injected = false
function injectCSS() {
  if (_injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.setAttribute('data-btn', '')
  el.textContent = CSS
  document.head.appendChild(el)
  _injected = true
}

export default function Button({ variant = 'primary', size = 'md', onClick, children, icon, type = 'button', disabled }) {
  injectCSS()
  return (
    <button
      type={type}
      className={`btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {children}
    </button>
  )
}
