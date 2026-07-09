import { useState } from 'react'
import type { HabitItem } from '../../../shared/types'

const today = (): string => new Date().toISOString().slice(0, 10)

export function HabitsView({ habits, onChange }: { habits: HabitItem[]; onChange: () => void }): JSX.Element {
  const [name, setName] = useState('')

  const add = async (): Promise<void> => {
    const trimmed = name.trim()
    if (!trimmed) return
    await window.api.addHabit(trimmed)
    setName('')
    onChange()
  }

  return (
    <div className="view">
      <h1>Habits</h1>
      <div className="row">
        <input
          value={name}
          placeholder="New habit, e.g. Drink water"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add}>Add</button>
      </div>

      <ul className="list">
        {habits.map((h) => {
          const doneToday = h.checkIns.includes(today())
          const streak = computeStreak(h.checkIns)
          return (
            <li key={h.id} className="list-item">
              <label>
                <input
                  type="checkbox"
                  checked={doneToday}
                  onChange={async () => {
                    await window.api.toggleHabitToday(h.id)
                    onChange()
                  }}
                />
                {h.name}
                <span className="muted"> · streak {streak}</span>
              </label>
              <button
                className="ghost"
                onClick={async () => {
                  await window.api.deleteHabit(h.id)
                  onChange()
                }}
              >
                ✕
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function computeStreak(checkIns: string[]): number {
  const set = new Set(checkIns)
  let streak = 0
  const cursor = new Date()
  for (;;) {
    const iso = cursor.toISOString().slice(0, 10)
    if (!set.has(iso)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
