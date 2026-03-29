// API 服务层
import type { Message } from '~/types'

export interface ChatCompletionRequest {
  model: string
  messages: Array<{
    role: string
    content: string
  }>
  stream?: boolean
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  system_prompt?: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string | null
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface StreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
}

export class ChatAPI {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async chat(
    request: ChatCompletionRequest
  ): Promise<AsyncGenerator<string, void, unknown>> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...request,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: '请求失败' } }))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    const decoder = new TextDecoder()

    return (async function* () {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed: StreamChunk = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content || ''
              if (content) {
                yield content
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    })()
  }

  async models(): Promise<Array<{ id: string; name: string }>> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('获取模型列表失败')
    }

    const data = await response.json()
    return data.data || []
  }

  async balance(): Promise<{ available: number; total: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/billing/credit_grants`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error('查询余额失败')
      }

      const data = await response.json()
      return {
        available: data.available ?? 0,
        total: data.total_available ?? 0,
      }
    } catch {
      return { available: 0, total: 0 }
    }
  }
}

// 创建 API 实例
export function createChatApi(baseUrl: string, apiKey: string): ChatAPI {
  return new ChatAPI(baseUrl, apiKey)
}
