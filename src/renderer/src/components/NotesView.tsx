import { useState } from 'react'
import type { NoteItem } from '../../../shared/types'

export function NotesView({ notes, onChange }: { notes: NoteItem[]; onChange: () => void }): JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const selected = notes.find((n) => n.id === selectedId) ?? null

  const startNew = (): void => {
    setSelectedId(null)
    setTitle('')
    setBody('')
  }

  const select = (note: NoteItem): void => {
    setSelectedId(note.id)
    setTitle(note.title)
    setBody(note.body)
  }

  const save = async (): Promise<void> => {
    if (!title.trim() && !body.trim()) return
    if (selected) {
      await window.api.updateNote(selected.id, title, body)
    } else {
      const note = await window.api.addNote(title || 'Untitled', body)
      setSelectedId(note.id)
    }
    onChange()
  }

  return (
    <div className="view split">
      <div className="split-list">
        <button onClick={startNew}>+ New note</button>
        <ul className="list">
          {notes
            .slice()
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((n) => (
              <li
                key={n.id}
                className={`list-item ${n.id === selectedId ? 'active' : ''}`}
                onClick={() => select(n)}
              >
                <span>{n.title || 'Untitled'}</span>
                <button
                  className="ghost"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await window.api.deleteNote(n.id)
                    if (n.id === selectedId) startNew()
                    onChange()
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div className="split-detail">
        <input className="note-title" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <textarea
          className="note-body"
          value={body}
          placeholder="Write something..."
          onChange={(e) => setBody(e.target.value)}
        />
        <button onClick={save}>Save</button>
      </div>
    </div>
  )
}
