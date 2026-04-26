import { useState } from 'react'

export function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init }
  })
  const save = v => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }
  return [val, save]
}

export function fmt(n) { return n === '' || n === undefined || n === null ? '' : String(n) }
export function today() { return new Date().toISOString().slice(0, 10) }
export function dateLabel(d) {
  const diff = Math.round((new Date(today()) - new Date(d)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
export function kg(w) { return w ? `${w}kg` : 'BW' }
