import { useEffect, useState } from 'react'
import type { TimerSession } from '../../../shared/types'

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export function TimerView({
  timers,
  onChange
}: {
  timers: TimerSession[]
  onChange: () => void
}): JSX.Element {
  const [label, setLabel] = useState('Focus session')
  const [, forceTick] = useState(0)

  const running = timers.find((t) => !t.endedAt) ?? null

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => forceTick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const start = async (): Promise<void> => {
    if (running) return
    await window.api.startTimer(label.trim() || 'Focus session')
    onChange()
  }

  const stop = async (): Promise<void> => {
    if (!running) return
    await window.api.stopTimer(running.id)
    onChange()
  }

  const elapsed = running ? Math.floor((Date.now() - running.startedAt) / 1000) : 0
  const history = timers.filter((t) => t.endedAt).sort((a, b) => b.startedAt - a.startedAt)

  return (
    <div className="view">
      <h1>Timer</h1>
      {!running ? (
        <div className="row">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What are you doing?" />
          <button onClick={start}>Start</button>
        </div>
      ) : (
        <div className="timer-running">
          <div className="timer-clock">{formatDuration(elapsed)}</div>
          <div className="muted">{running.label}</div>
          <button onClick={stop}>Stop</button>
        </div>
      )}

      {history.length > 0 && (
        <>
          <h2>History</h2>
          <ul className="list">
            {history.map((t) => (
              <li key={t.id} className="list-item">
                <span>{t.label}</span>
                <span className="muted">{formatDuration(t.durationSec)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
