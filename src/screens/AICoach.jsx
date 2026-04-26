import { useState, useRef, useEffect } from 'react'
import { useStorage } from '../utils'
import PageHead from '../components/PageHead'

const SUGGESTED_REPLIES = [
  'What should I train today?',
  'Adjust for fatigue',
  'Build a push workout',
  'How do I progress faster?',
]

const CSS = `
.ai-screen { display: flex; flex-direction: column; height: 100vh; }
.ai-context-card {
  margin: 0 22px 16px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent 55%), var(--surface);
  border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
  border-radius: var(--r-xl); padding: 18px; position: relative; overflow: hidden;
}
.ai-context-card::before {
  content: ''; position: absolute; top: -30px; right: -30px; width: 120px; height: 120px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%); pointer-events: none;
}
.ai-context-label { font-family: var(--font-mono); font-size: 9.5px; color: var(--accent); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.ai-context-label::before { content: '◆'; font-size: 9px; }
.ai-context-title { font-family: var(--font-display); font-weight: 900; font-size: 22px; text-transform: uppercase; margin-bottom: 6px; }
.ai-context-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.04em; }
.ai-msgs {
  flex: 1; overflow-y: auto; padding: 0 16px 10px; display: flex; flex-direction: column; gap: 12px;
  scrollbar-width: none;
}
.ai-msgs::-webkit-scrollbar { display: none; }
.msg-user {
  align-self: flex-end; background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius: 16px 16px 3px 16px; padding: 11px 15px; max-width: 85%;
  font-size: 14px; line-height: 1.5;
}
.msg-ai {
  align-self: flex-start; background: var(--surface-2); border: 1px solid var(--border-soft);
  border-radius: 16px 16px 16px 3px; padding: 11px 15px; max-width: 88%;
  font-size: 14px; line-height: 1.6; color: var(--text);
}
.msg-typing {
  align-self: flex-start; background: var(--surface-2); border: 1px solid var(--border-soft);
  border-radius: 16px 16px 16px 3px; padding: 12px 16px;
  display: flex; gap: 5px;
}
.msg-typing span {
  width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim);
  animation: pulse 1.2s ease-in-out infinite;
}
.msg-typing span:nth-child(2) { animation-delay: 0.2s; }
.msg-typing span:nth-child(3) { animation-delay: 0.4s; }
.suggested-row { display: flex; gap: 8px; overflow-x: auto; padding: 10px 16px; scrollbar-width: none; }
.suggested-row::-webkit-scrollbar { display: none; }
.suggest-chip {
  padding: 8px 14px; border-radius: var(--r-pill); border: 1px solid var(--border);
  background: var(--surface); color: var(--text-dim); font-size: 12.5px;
  white-space: nowrap; cursor: pointer; flex-shrink: 0; transition: all 0.15s;
}
.suggest-chip:hover { border-color: var(--accent); color: var(--accent); }
.ai-input-bar {
  display: flex; gap: 10px; padding: 10px 16px 32px;
  background: linear-gradient(to top, var(--bg) 70%, transparent);
}
.ai-input {
  flex: 1; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-pill);
  padding: 12px 18px; color: var(--text); font-family: var(--font-sans); font-size: 14px; outline: none;
}
.ai-input:focus { border-color: var(--accent); }
.ai-send {
  width: 44px; height: 44px; background: var(--accent); border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; color: var(--on-accent); cursor: pointer;
  flex-shrink: 0;
}
.ai-send svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
`

export default function AICoach() {
  const [apiKey] = useStorage('fittrack_api_key', '')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I've reviewed your recent sessions. Push A is on the plan today — want to go over the programme, or is there something specific you want to adjust?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    const next = [...messages, { role: 'user', content: userText }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: 'You are a knowledgeable, direct personal trainer AI. Keep responses concise and actionable. British English.',
          messages: next,
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Something went wrong. Check your API key in Settings.'
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      // network error
      setMessages(m => [...m, { role: 'assistant', content: 'Network error — check your connection and API key.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-screen">
      <style>{CSS}</style>

      <PageHead eyebrow="AI Coach" title="YOUR" accent="MOVE." />

      <div className="ai-context-card">
        <div className="ai-context-label">Today's Context</div>
        <div className="ai-context-title">Push A · Week 3</div>
        <div className="ai-context-meta">6 exercises · ~55 min · Last trained 2 days ago</div>
      </div>

      <div className="ai-msgs">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'msg-user' : 'msg-ai'}>{m.content}</div>
        ))}
        {loading && <div className="msg-typing"><span /><span /><span /></div>}
        <div ref={bottomRef} />
      </div>

      <div className="suggested-row">
        {SUGGESTED_REPLIES.map(r => (
          <button key={r} className="suggest-chip" onClick={() => send(r)}>{r}</button>
        ))}
      </div>

      <div className="ai-input-bar">
        <input
          className="ai-input"
          placeholder="Ask anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="ai-send" onClick={() => send()}>
          <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        </button>
      </div>
    </div>
  )
}
