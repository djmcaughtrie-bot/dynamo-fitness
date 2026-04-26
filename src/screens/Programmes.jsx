import { useState } from 'react'
import PageHead from '../components/PageHead'

const PROGRAMMES = [
  { id: 'ppl', name: 'Push Pull Legs', category: 'Full Body', weeks: 8, sessions: 6, level: 'Intermediate', desc: 'Classic hypertrophy split. High frequency, high volume.', intensity: 4 },
  { id: 'upper-lower', name: 'Upper Lower', category: 'Upper / Lower', weeks: 6, sessions: 4, level: 'Beginner', desc: 'Two upper, two lower sessions per week. Great for strength and size.', intensity: 3 },
  { id: 'full-body', name: 'Full Body 3×', category: 'Full Body', weeks: 4, sessions: 3, level: 'Beginner', desc: 'Three full body sessions per week. Ideal for general conditioning.', intensity: 2 },
  { id: 'push-a', name: 'Push Focus', category: 'Push', weeks: 4, sessions: 3, level: 'Intermediate', desc: 'Chest, shoulders, and triceps emphasis. Pairs with Pull and Legs.', intensity: 4 },
  { id: 'pull-a', name: 'Pull Focus', category: 'Pull', weeks: 4, sessions: 3, level: 'Intermediate', desc: 'Back, biceps, and rear delts. The counterpart to Push Focus.', intensity: 4 },
  { id: 'legs', name: 'Leg Emphasis', category: 'Legs', weeks: 4, sessions: 3, level: 'Intermediate', desc: 'Quads, hamstrings, glutes, and calves. Volume-focused lower programme.', intensity: 5 },
]
const FILTERS = ['All', 'Push', 'Pull', 'Legs', 'Upper / Lower', 'Full Body', 'Custom']

const CSS = `
.programmes-screen { padding-bottom: 120px; }
.filter-row {
  display: flex; gap: 8px; overflow-x: auto; padding: 0 22px 20px;
  scrollbar-width: none;
}
.filter-row::-webkit-scrollbar { display: none; }
.filter-chip {
  padding: 8px 16px; border-radius: var(--r-pill); border: 1px solid var(--border-soft);
  background: none; color: var(--text-dim); font-family: var(--font-sans); font-size: 13px;
  cursor: pointer; white-space: nowrap; transition: all 0.15s; flex-shrink: 0;
}
.filter-chip.active { background: color-mix(in srgb, var(--accent) 12%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); color: var(--accent); }
.featured-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 22px 20px; }
.prog-tile {
  background: var(--surface); border: 1px solid var(--border-soft); border-radius: 18px;
  padding: 18px; display: flex; flex-direction: column; justify-content: space-between;
  min-height: 140px; cursor: pointer; transition: transform 0.15s;
}
.prog-tile:active { transform: scale(0.97); }
.prog-tile.featured {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%), var(--surface);
  border-color: color-mix(in srgb, var(--accent) 20%, transparent);
}
.prog-tile-cat { font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 10px; }
.prog-tile-name { font-family: var(--font-display); font-weight: 900; font-size: 22px; text-transform: uppercase; line-height: 1; }
.prog-tile.featured .prog-tile-name { color: var(--accent); }
.prog-tile-meta { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); margin-top: 8px; }
.section-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.18em; text-transform: uppercase; padding: 0 22px 12px; }
.prog-list { padding: 0 22px 20px; display: flex; flex-direction: column; gap: 10px; }
.prog-row {
  background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl);
  padding: 18px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: background 0.15s;
}
.prog-row:active { background: var(--surface-2); }
.prog-row-info { flex: 1; }
.prog-row-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.prog-row-meta { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-dim); letter-spacing: 0.06em; }
.prog-row-arrow { color: var(--text-muted); }
.prog-row-arrow svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
.continuing-label { font-family: var(--font-mono); font-size: 10px; color: var(--accent); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 7px; }
.continuing-label::before { content: ''; width: 5px; height: 5px; background: var(--accent); border-radius: 50%; animation: pulse 1.8s infinite; }
.prog-progress-bar { height: 4px; background: var(--surface-3); border-radius: 2px; margin-top: 12px; }
.prog-progress-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.6s; }
.ai-build { margin: 0 22px 20px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 20px; text-align: center; }
.ai-build p { font-size: 13px; color: var(--text-dim); margin-bottom: 14px; }
.ai-build-btn {
  background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-md);
  padding: 12px 24px; font-family: var(--font-display); font-weight: 900; font-size: 15px;
  text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer;
}
`

export default function Programmes({ setTab }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? PROGRAMMES
    : PROGRAMMES.filter(p => p.category === filter || p.category.includes(filter))

  const featured = filtered.slice(0, 4)
  const rest = filtered.slice(4)

  return (
    <div className="programmes-screen">
      <style>{CSS}</style>

      <PageHead eyebrow="Train" title="PICK YOUR" accent="PRESSURE." />

      <div style={{ margin: '0 22px 18px' }}>
        <div style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%), var(--surface)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)', borderRadius: 'var(--r-xl)', padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%)', pointerEvents: 'none' }} />
          <div className="continuing-label">Continuing</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 8 }}>Push Pull Legs</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.06em' }}>Week 3 · Session 14 of 48</div>
          <div className="prog-progress-bar"><div className="prog-progress-fill" style={{ width: '29%' }} /></div>
        </div>
      </div>

      <div className="filter-row">
        {FILTERS.map(f => (
          <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="section-label">Featured</div>
      <div className="featured-grid">
        {featured.map((p, i) => (
          <div key={p.id} className={`prog-tile${i === 0 ? ' featured' : ''}`}>
            <div>
              <div className="prog-tile-cat">{p.category}</div>
              <div className="prog-tile-name">{p.name}</div>
              <div className="prog-tile-meta">{p.weeks}w · {p.sessions}×/wk</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.level}</div>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: 8 }}>All Programmes</div>
          <div className="prog-list">
            {rest.map(p => (
              <div key={p.id} className="prog-row">
                <div className="prog-row-info">
                  <div className="prog-row-name">{p.name}</div>
                  <div className="prog-row-meta">{p.weeks} weeks · {p.sessions}×/wk · {p.level}</div>
                </div>
                <div className="prog-row-arrow"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg></div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="ai-build">
        <p>Can't find the right programme? Let AI build one for you based on your goals and schedule.</p>
        <button className="ai-build-btn" onClick={() => setTab && setTab('ai')}>Build with AI</button>
      </div>
    </div>
  )
}
