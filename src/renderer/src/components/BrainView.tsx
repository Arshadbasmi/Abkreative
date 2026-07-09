import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, Settings } from '../../../shared/types'

export function BrainView({
  chat,
  settings,
  onChange
}: {
  chat: ChatMessage[]
  settings: Settings
  onChange: () => void
}): JSX.Element {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.length])

  const send = async (): Promise<void> => {
    const trimmed = input.trim()
    if (!trimmed || sending) return
    setInput('')
    setSending(true)
    try {
      await window.api.sendChatMessage(trimmed)
      onChange()
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="view chat-view">
      <h1>{settings.brainName}</h1>
      {!settings.anthropicApiKey && (
        <p className="hint">
          Add an Anthropic API key in Settings to start talking to {settings.brainName}.
        </p>
      )}

      <div className="chat-log">
        {chat.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="row">
        <input
          value={input}
          placeholder={`Ask ${settings.brainName} what to work on next...`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={sending}
        />
        <button onClick={send} disabled={sending}>
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
