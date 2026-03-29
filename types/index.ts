// 类型定义
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
  model?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  systemPrompt?: string
  createdAt: number
  updatedAt: number
  pinned?: boolean
}

export interface ModelConfig {
  name: string
  displayName: string
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom'
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  enabled: boolean
  isCustom?: boolean
}

export interface AppState {
  currentChatId: string | null
  chatSessions: ChatSession[]
  models: ModelConfig[]
  selectedModel: string
  apiKey: string
  apiHost: string
  theme: 'light' | 'dark' | 'system'
  language: 'zh' | 'en' | 'ja' | 'fr'
  sidebarOpen: boolean
  settingsOpen: boolean
  isGenerating: boolean
}

export const DEFAULT_MODELS: ModelConfig[] = [
  // OpenAI
  { name: 'gpt-4o', displayName: 'GPT-4o', provider: 'openai', maxTokens: 128000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: true },
  { name: 'gpt-4o-mini', displayName: 'GPT-4o Mini', provider: 'openai', maxTokens: 128000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: true },
  { name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', provider: 'openai', maxTokens: 128000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: true },
  { name: 'gpt-4', displayName: 'GPT-4', provider: 'openai', maxTokens: 8192, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: true },
  { name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 16385, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: true },
  // Anthropic
  { name: 'claude-sonnet-4-20250514', displayName: 'Claude Sonnet 4', provider: 'anthropic', maxTokens: 200000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  { name: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', provider: 'anthropic', maxTokens: 200000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  { name: 'claude-3-opus-20240229', displayName: 'Claude 3 Opus', provider: 'anthropic', maxTokens: 200000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  // Google
  { name: 'gemini-2.0-flash', displayName: 'Gemini 2.0 Flash', provider: 'google', maxTokens: 1048576, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  { name: 'gemini-1.5-pro', displayName: 'Gemini 1.5 Pro', provider: 'google', maxTokens: 2097152, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  // DeepSeek
  { name: 'deepseek-chat', displayName: 'DeepSeek Chat', provider: 'custom', maxTokens: 128000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
  { name: 'deepseek-coder', displayName: 'DeepSeek Coder', provider: 'custom', maxTokens: 128000, temperature: 0.7, topP: 1, frequencyPenalty: 0, presencePenalty: 0, enabled: false },
]

export const DEFAULT_STATE: AppState = {
  currentChatId: null,
  chatSessions: [],
  models: DEFAULT_MODELS,
  selectedModel: 'gpt-4o',
  apiKey: '',
  apiHost: 'https://api.openai.com/v1',
  theme: 'system',
  language: 'zh',
  sidebarOpen: true,
  settingsOpen: false,
  isGenerating: false,
}
