import Store from 'electron-store'
import { randomUUID } from 'crypto'
import type {
  AppState,
  TaskItem,
  NoteItem,
  HabitItem,
  TimerSession,
  ChatMessage
} from '../shared/types'
import { DEFAULT_SETTINGS } from '../shared/types'

const defaults: AppState = {
  tasks: [],
  notes: [],
  habits: [],
  timers: [],
  chat: [],
  settings: DEFAULT_SETTINGS
}

// Everything lives in a single local JSON file under the OS user-data
// directory (see electron-store docs). No network calls, no accounts,
// no sync — this is the "local-first" guarantee EesaBrain makes to users.
export const store = new Store<AppState>({
  name: 'eesabrain-data',
  defaults
})

export function getState(): AppState {
  return {
    tasks: store.get('tasks'),
    notes: store.get('notes'),
    habits: store.get('habits'),
    timers: store.get('timers'),
    chat: store.get('chat'),
    settings: store.get('settings')
  }
}

export function addTask(title: string): TaskItem {
  const task: TaskItem = { id: randomUUID(), title, done: false, createdAt: Date.now() }
  store.set('tasks', [...store.get('tasks'), task])
  return task
}

export function toggleTask(id: string): void {
  const tasks = store.get('tasks').map((t) =>
    t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : undefined } : t
  )
  store.set('tasks', tasks)
}

export function deleteTask(id: string): void {
  store.set(
    'tasks',
    store.get('tasks').filter((t) => t.id !== id)
  )
}

export function addNote(title: string, body: string): NoteItem {
  const now = Date.now()
  const note: NoteItem = { id: randomUUID(), title, body, createdAt: now, updatedAt: now }
  store.set('notes', [...store.get('notes'), note])
  return note
}

export function updateNote(id: string, title: string, body: string): void {
  const notes = store.get('notes').map((n) =>
    n.id === id ? { ...n, title, body, updatedAt: Date.now() } : n
  )
  store.set('notes', notes)
}

export function deleteNote(id: string): void {
  store.set(
    'notes',
    store.get('notes').filter((n) => n.id !== id)
  )
}

export function addHabit(name: string): HabitItem {
  const habit: HabitItem = { id: randomUUID(), name, createdAt: Date.now(), checkIns: [] }
  store.set('habits', [...store.get('habits'), habit])
  return habit
}

export function toggleHabitToday(id: string): void {
  const today = new Date().toISOString().slice(0, 10)
  const habits = store.get('habits').map((h) => {
    if (h.id !== id) return h
    const has = h.checkIns.includes(today)
    return { ...h, checkIns: has ? h.checkIns.filter((d) => d !== today) : [...h.checkIns, today] }
  })
  store.set('habits', habits)
}

export function deleteHabit(id: string): void {
  store.set(
    'habits',
    store.get('habits').filter((h) => h.id !== id)
  )
}

export function startTimer(label: string): TimerSession {
  const session: TimerSession = {
    id: randomUUID(),
    label,
    startedAt: Date.now(),
    durationSec: 0
  }
  store.set('timers', [...store.get('timers'), session])
  return session
}

export function stopTimer(id: string): void {
  const timers = store.get('timers').map((t) => {
    if (t.id !== id || t.endedAt) return t
    const endedAt = Date.now()
    return { ...t, endedAt, durationSec: Math.round((endedAt - t.startedAt) / 1000) }
  })
  store.set('timers', timers)
}

export function appendChatMessage(message: ChatMessage): void {
  store.set('chat', [...store.get('chat'), message])
}

export function clearChat(): void {
  store.set('chat', [])
}

export function updateSettings(partial: Partial<AppState['settings']>): AppState['settings'] {
  const next = { ...store.get('settings'), ...partial }
  store.set('settings', next)
  return next
}
