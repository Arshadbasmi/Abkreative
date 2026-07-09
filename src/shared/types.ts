export type TaskItem = {
  id: string
  title: string
  done: boolean
  createdAt: number
  doneAt?: number
}

export type NoteItem = {
  id: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
}

export type HabitItem = {
  id: string
  name: string
  createdAt: number
  /** ISO date strings (YYYY-MM-DD) the habit was checked off on */
  checkIns: string[]
}

export type TimerSession = {
  id: string
  label: string
  startedAt: number
  endedAt?: number
  durationSec: number
}

export type ChatRole = 'user' | 'brain'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: number
}

export type Settings = {
  brainName: string
  anthropicApiKey: string
  model: string
}

export type AppState = {
  tasks: TaskItem[]
  notes: NoteItem[]
  habits: HabitItem[]
  timers: TimerSession[]
  chat: ChatMessage[]
  settings: Settings
}

export const DEFAULT_SETTINGS: Settings = {
  brainName: 'EesaBrain',
  anthropicApiKey: '',
  model: 'claude-sonnet-4-5'
}
