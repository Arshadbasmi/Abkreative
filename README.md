# EesaBrain

A local-first desk companion app, in the spirit of [Hey Taby](https://www.heytaby.com/): tasks, notes, habits, and a timer in one place, plus a conversational "brain" that helps you decide what to work on next.

## What this is (v0.1)

- **Desktop app** — Electron + React + TypeScript, built with [electron-vite](https://electron-vite.org/).
- **Local-first data** — tasks, notes, habits, timer history, and settings are stored in a single JSON file on your machine (via `electron-store`). No accounts, no cloud sync. Deleting the app's data file resets EesaBrain completely.
- **The Brain** — a chat panel backed by the Anthropic API (Claude). It's given your open tasks and today's habit status as context, so it can nudge you toward what to do next. This is the one feature that needs the internet: your chat messages (and a summary of your tasks/habits) are sent to Anthropic to generate a reply. Nothing else leaves your computer.
- **Views**: Brain (chat), Tasks, Notes, Habits, Timer, Settings.

## Getting started

```bash
npm install
npm run dev        # launch the app in development
```

On first launch, open **Settings** and paste an Anthropic API key (from https://console.anthropic.com/) to talk to the Brain. Everything else (tasks/notes/habits/timer) works with no key at all.

## Building

```bash
npm run build        # typecheck + bundle main/preload/renderer into out/
npm run build:mac    # package a macOS app (also build:win, build:linux)
```

## Project layout

```
src/
  main/       Electron main process: window creation, IPC handlers, local data store, Anthropic calls
  preload/    contextBridge API exposed to the renderer as window.api
  renderer/   React UI (Brain, Tasks, Notes, Habits, Timer, Settings views)
  shared/     Types shared between main and renderer
```

## Roadmap: physical companion

Hey Taby ships both a digital app and a small desk gadget with a screen. This app's architecture keeps that door open on purpose:

- All state lives behind a small set of IPC calls (`src/main/store.ts`) that map cleanly onto whatever transport a physical device would use (serial/BLE/local HTTP).
- The Brain's context-building (`src/main/brain.ts`) already summarizes state into short text — the same summary a small screen or a physical device's display logic could consume.

A future physical version would add a companion process/firmware that talks to this same local data store rather than re-implementing tasks/notes/habits from scratch.

## Privacy

Tasks, notes, habits, and timer history never leave your device. The only outbound network call this app makes is the Brain's chat request to Anthropic's API, and only when you send a message.
