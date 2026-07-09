import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { randomUUID } from 'crypto'
import icon from '../../resources/icon.png?asset'
import * as db from './store'
import { askBrain } from './brain'
import type { ChatMessage } from '../shared/types'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 720,
    minHeight: 520,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('state:get', () => db.getState())

  ipcMain.handle('tasks:add', (_e, title: string) => db.addTask(title))
  ipcMain.handle('tasks:toggle', (_e, id: string) => db.toggleTask(id))
  ipcMain.handle('tasks:delete', (_e, id: string) => db.deleteTask(id))

  ipcMain.handle('notes:add', (_e, title: string, body: string) => db.addNote(title, body))
  ipcMain.handle('notes:update', (_e, id: string, title: string, body: string) =>
    db.updateNote(id, title, body)
  )
  ipcMain.handle('notes:delete', (_e, id: string) => db.deleteNote(id))

  ipcMain.handle('habits:add', (_e, name: string) => db.addHabit(name))
  ipcMain.handle('habits:toggleToday', (_e, id: string) => db.toggleHabitToday(id))
  ipcMain.handle('habits:delete', (_e, id: string) => db.deleteHabit(id))

  ipcMain.handle('timers:start', (_e, label: string) => db.startTimer(label))
  ipcMain.handle('timers:stop', (_e, id: string) => db.stopTimer(id))

  ipcMain.handle('settings:update', (_e, partial) => db.updateSettings(partial))

  ipcMain.handle('chat:send', async (_e, content: string) => {
    const state = db.getState()
    const userMessage: ChatMessage = {
      id: randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now()
    }
    db.appendChatMessage(userMessage)

    try {
      const reply = await askBrain(
        [...state.chat, userMessage],
        state.settings.anthropicApiKey,
        state.settings.model
      )
      const brainMessage: ChatMessage = {
        id: randomUUID(),
        role: 'brain',
        content: reply || "I didn't get a response — try again in a moment.",
        createdAt: Date.now()
      }
      db.appendChatMessage(brainMessage)
      return { userMessage, brainMessage }
    } catch (err) {
      const brainMessage: ChatMessage = {
        id: randomUUID(),
        role: 'brain',
        content: err instanceof Error ? err.message : 'Something went wrong talking to the brain.',
        createdAt: Date.now()
      }
      db.appendChatMessage(brainMessage)
      return { userMessage, brainMessage }
    }
  })

  ipcMain.handle('chat:clear', () => db.clearChat())
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.abkreative.eesabrain')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
