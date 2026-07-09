import { useState } from 'react'
import type { TaskItem } from '../../../shared/types'

export function TasksView({ tasks, onChange }: { tasks: TaskItem[]; onChange: () => void }): JSX.Element {
  const [title, setTitle] = useState('')

  const add = async (): Promise<void> => {
    const trimmed = title.trim()
    if (!trimmed) return
    await window.api.addTask(trimmed)
    setTitle('')
    onChange()
  }

  const open = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <div className="view">
      <h1>Tasks</h1>
      <div className="row">
        <input
          value={title}
          placeholder="What needs doing?"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add}>Add</button>
      </div>

      <ul className="list">
        {open.map((t) => (
          <li key={t.id} className="list-item">
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={async () => {
                  await window.api.toggleTask(t.id)
                  onChange()
                }}
              />
              {t.title}
            </label>
            <button
              className="ghost"
              onClick={async () => {
                await window.api.deleteTask(t.id)
                onChange()
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {done.length > 0 && (
        <details>
          <summary>{done.length} done</summary>
          <ul className="list">
            {done.map((t) => (
              <li key={t.id} className="list-item done">
                <label>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={async () => {
                      await window.api.toggleTask(t.id)
                      onChange()
                    }}
                  />
                  {t.title}
                </label>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
