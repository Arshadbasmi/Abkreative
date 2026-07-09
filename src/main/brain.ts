import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from '../shared/types'
import { getState } from './store'

function buildSystemPrompt(): string {
  const { tasks, habits, settings } = getState()
  const openTasks = tasks.filter((t) => !t.done).map((t) => `- ${t.title}`)
  const today = new Date().toISOString().slice(0, 10)
  const habitLines = habits.map((h) => `- ${h.name}: ${h.checkIns.includes(today) ? 'done today' : 'not done today'}`)

  return [
    `You are ${settings.brainName}, a warm, encouraging desk companion that lives in a small local productivity app.`,
    'You help the person decide what to work on next, celebrate small wins, and keep them unstuck.',
    'Keep replies short (1-4 sentences) and conversational, like a friendly companion, not a formal assistant.',
    '',
    openTasks.length ? `Their open tasks:\n${openTasks.join('\n')}` : 'They have no open tasks right now.',
    habitLines.length ? `Their habits today:\n${habitLines.join('\n')}` : ''
  ]
    .filter(Boolean)
    .join('\n')
}

export async function askBrain(history: ChatMessage[], apiKey: string, model: string): Promise<string> {
  if (!apiKey) {
    throw new Error('No Anthropic API key set. Add one in Settings to talk to the brain.')
  }

  const client = new Anthropic({ apiKey })

  const messages = history.map((m) => ({
    role: m.role === 'brain' ? ('assistant' as const) : ('user' as const),
    content: m.content
  }))

  const response = await client.messages.create({
    model,
    max_tokens: 512,
    system: buildSystemPrompt(),
    messages
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock && textBlock.type === 'text' ? textBlock.text : ''
}
