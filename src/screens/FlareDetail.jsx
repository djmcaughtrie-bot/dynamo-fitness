import { useState } from 'react'
import { useStorage } from '../utils'
import PageHead from '../components/PageHead'

const CSS = `
.flare-detail { padding-bottom: 120px; }
.episode-card {
  margin: 0 22px 20px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--orange) 6%, transparent), transparent 55%), var(--surface);
  border: 1px solid color-mix(in srgb, var(--orange) 20%, transparent);
  border-radius: var(--r-xl); padding: 20px; position: relative; overflow: hidden;
}
.episode-label { font-family: var(--font-mono); font-size: 10px; color: var(--orange); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.episode-label::before { content: ''; width: 6px; height: 6px; background: var(--orange); border-radius: 50%; animation: pulse 1.8s infinite; }
.episode-title { font-family: var(--font-display); font-weight: 900; font-size: 32px; text-transform: uppercase; margin-bottom: 6px; }
.episode-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.06em; }
.flare-kpi-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 0 22px 20px; }
.flare-kpi { background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 14px 16px; }
.flare-kpi-val { font-family: var(--font-display); font-weight: 900; font-size: 28px; line-height: 1; }
.flare-kpi-label { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 5px; }
.heatmap-section { margin: 0 22px 20px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 20px; }
.heatmap-label { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 14px; }
.heatmap-grid { display: grid; grid-template-columns: repeat(13, 1fr); gap: 3px; }
.heatmap-cell { aspect-ratio: 1; border-radius: 2px; background: var(--surface-2); }
.heatmap-cell.s1 { background: color-mix(in srgb, var(--warm) 30%, transparent); }
.heatmap-cell.s2 { background: color-mix(in srgb, var(--orange) 50%, transparent); }
.heatmap-cell.s3 { background: var(--red); }
.trigger-bars { margin: 0 22px 20px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-xl); padding: 20px; }
.trigger-bar-row { margin-bottom: 12px; }
.trigger-bar-row:last-child { margin-bottom: 0; }
.trigger-bar-label { display: flex; justify-content: space-between; margin-bottom: 5px; }
.trigger-bar-name { font-size: 13px; font-weight: 500; }
.trigger-bar-pct { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); }
.trigger-track { height: 6px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.trigger-fill { height: 100%; background: var(--orange); border-radius: 3px; }
.gp-cta { margin: 0 22px 20px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 22px; text-align: center; }
.gp-cta p { font-size: 13px; color: var(--text-dim); line-height: 1.5; margin-bottom: 16px; }
.gp-btn { background: var(--accent); color: var(--on-accent); border: none; border-radius: var(--r-md); padding: 14px 24px; font-family: var(--font-display); font-weight: 900; font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; }
.gp-report { margin-top: 16px; padding: 16px; background: var(--surface); border: 1px solid var(--border-soft); border-radius: var(--r-md); font-size: 13px; color: var(--text-dim); line-height: 1.6; text-align: left; white-space: pre-wrap; }
`

export default function FlareDetail({ flares }) {
  const [checkins] = useStorage('ft-checkins', [])
  const [apiKey] = useStorage('fittrack_api_key', '')
  const [gpReport, setGpReport] = useState('')
  const [generating, setGenerating] = useState(false)

  const episodes = flares?.episodes || []
  const activeEpisode = episodes.find(e => !e.resolved)
  const yearStart = new Date(new Date().getFullYear(), 0, 1)
  const episodesYTD = episodes.filter(e => new Date(e.startDate) >= yearStart).length
  const avgDuration = episodes.length
    ? Math.round(episodes.reduce((s, e) => s + (e.duration || 1), 0) / episodes.length)
    : 0

  const heatmapCells = Array.from({ length: 91 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (90 - i))
    const ds = d.toISOString().slice(0, 10)
    const checkin = checkins.find(c => c.date === ds)
    if (!checkin) return { ds, sev: 0 }
    const max = Math.max(0, ...checkin.joints.map(j => j.severity))
    return { ds, sev: max }
  })

  const triggerCounts = {}
  checkins.forEach(c => (c.triggers || []).forEach(t => { triggerCounts[t] = (triggerCounts[t] || 0) + 1 }))
  const topTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxCount = Math.max(1, ...Object.values(triggerCounts))

  const generateReport = async () => {
    setGenerating(true)
    const summary = {
      episodesYTD,
      avgDuration,
      topTriggers: topTriggers.map(([t, n]) => `${t} (${n}×)`).join(', '),
      recentCheckins: checkins.slice(-14).map(c => ({
        date: c.date,
        maxSeverity: Math.max(0, ...c.joints.map(j => j.severity)),
        triggers: c.triggers,
      })),
    }
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey, 'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true', 'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001', max_tokens: 800,
          system: 'You produce concise, factual summaries for patients to share with their GP. Professional tone. British English. No diagnosis.',
          messages: [{ role: 'user', content: `Generate a brief GP report based on this training and symptom data: ${JSON.stringify(summary)}` }],
        }),
      })
      const data = await res.json()
      setGpReport(data.content?.[0]?.text || 'Could not generate report. Check your API key in Settings.')
    } catch { setGpReport('Network error — check your connection.') }
    finally { setGenerating(false) }
  }

  return (
    <div className="flare-detail">
      <style>{CSS}</style>

      <PageHead eyebrow="History" title="THE" accent="PATTERN." />

      {activeEpisode && (
        <div className="episode-card">
          <div className="episode-label">Active Episode</div>
          <div className="episode-title">Day {activeEpisode.duration || 1}</div>
          <div className="episode-meta">Started {activeEpisode.startDate} · {activeEpisode.joints?.join(', ')}</div>
        </div>
      )}

      <div className="flare-kpi-row">
        <div className="flare-kpi"><div className="flare-kpi-val">{episodesYTD}</div><div className="flare-kpi-label">Episodes YTD</div></div>
        <div className="flare-kpi"><div className="flare-kpi-val">{avgDuration || '—'}</div><div className="flare-kpi-label">Avg Duration</div></div>
        <div className="flare-kpi"><div className="flare-kpi-val">{checkins.length}</div><div className="flare-kpi-label">Check-ins</div></div>
      </div>

      <div className="heatmap-section">
        <div className="heatmap-label">13-Week Severity Map</div>
        <div className="heatmap-grid">
          {heatmapCells.map((cell, i) => (
            <div key={i} className={`heatmap-cell${cell.sev > 0 ? ` s${cell.sev}` : ''}`} title={`${cell.ds}: severity ${cell.sev}`} />
          ))}
        </div>
      </div>

      {topTriggers.length > 0 && (
        <div className="trigger-bars">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Top Triggers</div>
          {topTriggers.map(([trigger, count]) => (
            <div key={trigger} className="trigger-bar-row">
              <div className="trigger-bar-label">
                <span className="trigger-bar-name">{trigger}</span>
                <span className="trigger-bar-pct">{Math.round((count / maxCount) * 100)}%</span>
              </div>
              <div className="trigger-track"><div className="trigger-fill" style={{ width: `${(count / maxCount) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      )}

      <div className="gp-cta">
        <p>Generate a plain-English summary of your symptom patterns to share with your GP or physio.</p>
        <button className="gp-btn" onClick={generateReport} disabled={generating}>
          {generating ? 'Generating…' : 'Generate GP Report'}
        </button>
        {gpReport && <div className="gp-report">{gpReport}</div>}
      </div>
    </div>
  )
}
