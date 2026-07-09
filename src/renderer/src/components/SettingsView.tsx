import { useState } from 'react'
import type { Settings } from '../../../shared/types'

export function SettingsView({
  settings,
  onChange
}: {
  settings: Settings
  onChange: () => void
}): JSX.Element {
  const [brainName, setBrainName] = useState(settings.brainName)
  const [apiKey, setApiKey] = useState(settings.anthropicApiKey)
  const [model, setModel] = useState(settings.model)
  const [saved, setSaved] = useState(false)

  const save = async (): Promise<void> => {
    await window.api.updateSettings({ brainName, anthropicApiKey: apiKey, model })
    onChange()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="view">
      <h1>Settings</h1>

      <label className="field">
        <span>Brain name</span>
        <input value={brainName} onChange={(e) => setBrainName(e.target.value)} />
      </label>

      <label className="field">
        <span>Anthropic API key</span>
        <input
          type="password"
          value={apiKey}
          placeholder="sk-ant-..."
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Model</span>
        <input value={model} onChange={(e) => setModel(e.target.value)} />
      </label>

      <p className="muted">
        Everything you enter here — tasks, notes, habits, and this key — is stored only in a local
        file on this computer. Chat messages are sent to Anthropic's API to generate a reply; no
        other data leaves this device.
      </p>

      <button onClick={save}>{saved ? 'Saved' : 'Save'}</button>
    </div>
  )
}
