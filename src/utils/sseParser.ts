import type { SSEMessage } from '@/types/message'

export interface SSEParseResult {
  messages: SSEMessage[]
  done: boolean
  error?: Error
}

export function parseSSEChunk(chunk: string, buffer: string): {
  messages: SSEMessage[]
  remainingBuffer: string
  done: boolean
} {
  const text = buffer + chunk
  const lines = text.split('\n\n')
  const remainingBuffer = lines.pop() || ''
  const messages: SSEMessage[] = []
  let done = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('data: ')) {
      const data = trimmed.slice(6)
      if (data === '[DONE]') {
        done = true
        continue
      }
      try {
        const msg = JSON.parse(data) as SSEMessage
        messages.push(msg)
      } catch {
        // 忽略无法解析的数据
      }
    }
  }

  return { messages, remainingBuffer, done }
}

export async function* streamSSE(
  response: Response
): AsyncGenerator<SSEMessage, void, unknown> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const result = parseSSEChunk(chunk, buffer)
      buffer = result.remainingBuffer

      for (const msg of result.messages) {
        yield msg
      }

      if (result.done) break
    }
  } finally {
    reader.releaseLock()
  }
}
