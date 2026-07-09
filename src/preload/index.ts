import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { AppState, Settings } from '../shared/types'

const api = {
  getState: (): Promise<AppState> => ipcRenderer.invoke('state:get'),

  addTask: (title: string) => ipcRenderer.invoke('tasks:add', title),
  toggleTask: (id: string) => ipcRenderer.invoke('tasks:toggle', id),
  deleteTask: (id: string) => ipcRenderer.invoke('tasks:delete', id),

  addNote: (title: string, body: string) => ipcRenderer.invoke('notes:add', title, body),
  updateNote: (id: string, title: string, body: string) =>
    ipcRenderer.invoke('notes:update', id, title, body),
  deleteNote: (id: string) => ipcRenderer.invoke('notes:delete', id),

  addHabit: (name: string) => ipcRenderer.invoke('habits:add', name),
  toggleHabitToday: (id: string) => ipcRenderer.invoke('habits:toggleToday', id),
  deleteHabit: (id: string) => ipcRenderer.invoke('habits:delete', id),

  startTimer: (label: string) => ipcRenderer.invoke('timers:start', label),
  stopTimer: (id: string) => ipcRenderer.invoke('timers:stop', id),

  updateSettings: (partial: Partial<Settings>) => ipcRenderer.invoke('settings:update', partial),

  sendChatMessage: (content: string) => ipcRenderer.invoke('chat:send', content),
  clearChat: () => ipcRenderer.invoke('chat:clear')
}

export type EesaBrainApi = typeof api

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
