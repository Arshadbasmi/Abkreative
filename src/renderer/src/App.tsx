import { useState } from 'react'
import { useAppState } from './lib/useAppState'
import { TasksView } from './components/TasksView'
import { NotesView } from './components/NotesView'
import { HabitsView } from './components/HabitsView'
import { TimerView } from './components/TimerView'
import { BrainView } from './components/BrainView'
import { SettingsView } from './components/SettingsView'

type Tab = 'brain' | 'tasks' | 'notes' | 'habits' | 'timer' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'brain', label: 'Brain', icon: '\u{1F9E0}' },
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'notes', label: 'Notes', icon: '✎' },
  { id: 'habits', label: 'Habits', icon: '\u{1F501}' },
  { id: 'timer', label: 'Timer', icon: '⏱' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
]

function App(): JSX.Element {
  const { state, refresh } = useAppState()
  const [tab, setTab] = useState<Tab>('brain')

  if (!state) {
    return <div className="loading">Waking up...</div>
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">{state.settings.brainName}</div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'brain' && <BrainView chat={state.chat} settings={state.settings} onChange={refresh} />}
        {tab === 'tasks' && <TasksView tasks={state.tasks} onChange={refresh} />}
        {tab === 'notes' && <NotesView notes={state.notes} onChange={refresh} />}
        {tab === 'habits' && <HabitsView habits={state.habits} onChange={refresh} />}
        {tab === 'timer' && <TimerView timers={state.timers} onChange={refresh} />}
        {tab === 'settings' && <SettingsView settings={state.settings} onChange={refresh} />}
      </main>
    </div>
  )
}

export default App
