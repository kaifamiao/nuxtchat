import { defineStore } from 'pinia'
import type { ChatSession, Message, ModelConfig, AppState } from '~/types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export const useChatStore = defineStore('chat', {
  state: (): AppState => ({
    currentChatId: null,
    chatSessions: [],
    models: [
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
    ],
    selectedModel: 'gpt-4o',
    apiKey: '',
    apiHost: 'https://api.openai.com/v1',
    theme: 'system',
    language: 'zh',
    sidebarOpen: true,
    settingsOpen: false,
    isGenerating: false,
  }),

  getters: {
    currentChat: (state): ChatSession | null => {
      if (!state.currentChatId) return null
      return state.chatSessions.find(s => s.id === state.currentChatId) || null
    },

    enabledModels: (state): ModelConfig[] => {
      return state.models.filter(m => m.enabled)
    },

    getModelConfig: (state) => {
      return (modelName: string): ModelConfig | undefined => {
        return state.models.find(m => m.name === modelName)
      }
    },
  },

  actions: {
    // 创建新对话
    createChat(title?: string, model?: string): ChatSession {
      const now = Date.now()
      const newChat: ChatSession = {
        id: generateId(),
        title: title || '新对话',
        messages: [],
        model: model || this.selectedModel,
        createdAt: now,
        updatedAt: now,
      }
      this.chatSessions.unshift(newChat)
      this.currentChatId = newChat.id
      return newChat
    },

    // 删除对话
    deleteChat(chatId: string) {
      const index = this.chatSessions.findIndex(s => s.id === chatId)
      if (index !== -1) {
        this.chatSessions.splice(index, 1)
        if (this.currentChatId === chatId) {
          this.currentChatId = this.chatSessions.length > 0 ? this.chatSessions[0].id : null
        }
      }
    },

    // 更新对话标题
    updateChatTitle(chatId: string, title: string) {
      const chat = this.chatSessions.find(s => s.id === chatId)
      if (chat) {
        chat.title = title
        chat.updatedAt = Date.now()
      }
    },

    // 添加消息
    addMessage(chatId: string, message: Omit<Message, 'id' | 'createdAt'>): Message {
      const chat = this.chatSessions.find(s => s.id === chatId)
      if (!chat) throw new Error('Chat not found')

      const newMessage: Message = {
        ...message,
        id: generateId(),
        createdAt: Date.now(),
      }
      chat.messages.push(newMessage)
      chat.updatedAt = Date.now()

      // 如果是第一条用户消息，更新标题
      if (message.role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1) {
        chat.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
      }

      return newMessage
    },

    // 更新消息
    updateMessage(chatId: string, messageId: string, content: string) {
      const chat = this.chatSessions.find(s => s.id === chatId)
      if (!chat) throw new Error('Chat not found')

      const message = chat.messages.find(m => m.id === messageId)
      if (message) {
        message.content = content
        chat.updatedAt = Date.now()
      }
    },

    // 删除消息
    deleteMessage(chatId: string, messageId: string) {
      const chat = this.chatSessions.find(s => s.id === chatId)
      if (!chat) throw new Error('Chat not found')

      const index = chat.messages.findIndex(m => m.id === messageId)
      if (index !== -1) {
        chat.messages.splice(index, 1)
        chat.updatedAt = Date.now()
      }
    },

    // 清空对话
    clearChat(chatId: string) {
      const chat = this.chatSessions.find(s => s.id === chatId)
      if (chat) {
        chat.messages = []
        chat.updatedAt = Date.now()
      }
    },

    // 切换对话
    selectChat(chatId: string) {
      this.currentChatId = chatId
    },

    // 设置当前模型
    setSelectedModel(modelName: string) {
      this.selectedModel = modelName
      // 如果当前有对话，更新对话的模型
      if (this.currentChatId) {
        const chat = this.chatSessions.find(s => s.id === this.currentChatId)
        if (chat) {
          chat.model = modelName
        }
      }
    },

    // 更新模型配置
    updateModelConfig(modelName: string, config: Partial<ModelConfig>) {
      const model = this.models.find(m => m.name === modelName)
      if (model) {
        Object.assign(model, config)
      }
    },

    // 添加自定义模型
    addCustomModel(model: ModelConfig) {
      const existing = this.models.find(m => m.name === model.name)
      if (!existing) {
        this.models.push({ ...model, isCustom: true })
      }
    },

    // 移除自定义模型
    removeCustomModel(modelName: string) {
      const index = this.models.findIndex(m => m.name === modelName && m.isCustom)
      if (index !== -1) {
        this.models.splice(index, 1)
      }
    },

    // 设置 API Key
    setApiKey(key: string) {
      this.apiKey = key
    },

    // 设置 API Host
    setApiHost(host: string) {
      this.apiHost = host
    },

    // 设置主题
    setTheme(theme: 'light' | 'dark' | 'system') {
      this.theme = theme
    },

    // 设置语言
    setLanguage(lang: 'zh' | 'en' | 'ja' | 'fr') {
      this.language = lang
    },

    // 切换侧边栏
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    // 切换设置面板
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen
    },

    // 设置生成状态
    setIsGenerating(value: boolean) {
      this.isGenerating = value
    },

    // 导出对话
    exportChat(chatId?: string): string {
      const chat = chatId
        ? this.chatSessions.find(s => s.id === chatId)
        : this.currentChat
      if (!chat) return ''

      const exportData = {
        title: chat.title,
        model: chat.model,
        createdAt: new Date(chat.createdAt).toISOString(),
        messages: chat.messages,
      }
      return JSON.stringify(exportData, null, 2)
    },

    // 导入对话
    importChat(json: string): ChatSession | null {
      try {
        const data = JSON.parse(json)
        const newChat: ChatSession = {
          id: generateId(),
          title: data.title || '导入的对话',
          messages: data.messages || [],
          model: data.model || this.selectedModel,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        this.chatSessions.unshift(newChat)
        return newChat
      } catch {
        return null
      }
    },

    // 搜索对话
    searchChats(query: string): ChatSession[] {
      if (!query.trim()) return this.chatSessions
      const lowerQuery = query.toLowerCase()
      return this.chatSessions.filter(chat =>
        chat.title.toLowerCase().includes(lowerQuery) ||
        chat.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
      )
    },
  },
}, {
  persist: {
    key: 'nuxtchat-store',
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    paths: ['chatSessions', 'currentChatId', 'selectedModel', 'apiKey', 'apiHost', 'theme', 'language', 'models'],
  },
})
