// 插件系统类型定义
export interface Plugin {
  id: string
  name: string
  description: string
  icon: string
  version: string
  enabled: boolean
  config?: Record<string, any>
  handler: (input: string, config?: Record<string, any>) => Promise<string>
}

export interface PluginRegistry {
  register(plugin: Plugin): void
  unregister(pluginId: string): void
  get(pluginId: string): Plugin | undefined
  getAll(): Plugin[]
  getEnabled(): Plugin[]
}

// 创建插件注册表
export function createPluginRegistry(): PluginRegistry {
  const plugins = new Map<string, Plugin>()

  return {
    register(plugin) {
      plugins.set(plugin.id, plugin)
    },
    unregister(pluginId) {
      plugins.delete(pluginId)
    },
    get(pluginId) {
      return plugins.get(pluginId)
    },
    getAll() {
      return Array.from(plugins.values())
    },
    getEnabled() {
      return Array.from(plugins.values()).filter(p => p.enabled)
    },
  }
}

// 内置插件：网络搜索
export const webSearchPlugin: Plugin = {
  id: 'web-search',
  name: '网络搜索',
  description: '使用搜索引擎查找相关信息',
  icon: '🔍',
  version: '1.0.0',
  enabled: false,
  config: {
    engine: 'google',
    maxResults: 5,
  },
  handler: async (query) => {
    // 这里需要实际的搜索 API
    return `搜索 "${query}" 的结果...`
  },
}

// 内置插件：计算器
export const calculatorPlugin: Plugin = {
  id: 'calculator',
  name: '计算器',
  description: '执行数学计算',
  icon: '🧮',
  version: '1.0.0',
  enabled: true,
  handler: async (input) => {
    try {
      // 简单的数学表达式计算
      const expression = input.replace(/[^0-9+\-*/().]/g, '')
      if (!expression) return '无效的数学表达式'

      // 使用 Function 安全地计算
      const result = new Function('return ' + expression)()
      return `计算结果：${result}`
    } catch {
      return '无法计算该表达式'
    }
  },
}

// 内置插件：代码执行
export const codeExecutorPlugin: Plugin = {
  id: 'code-executor',
  name: '代码执行',
  description: '执行简单的代码片段',
  icon: '💻',
  version: '1.0.0',
  enabled: false,
  config: {
    language: 'javascript',
  },
  handler: async (code, config) => {
    if (config?.language === 'javascript') {
      try {
        const result = eval(code)
        return `执行结果：${result}`
      } catch (e: any) {
        return `执行错误：${e.message}`
      }
    }
    return '不支持的语言'
  },
}

// 内置插件：时间日期
export const dateTimePlugin: Plugin = {
  id: 'datetime',
  name: '日期时间',
  description: '获取当前日期和时间信息',
  icon: '📅',
  version: '1.0.0',
  enabled: true,
  handler: async (input) => {
    const now = new Date()
    const info = {
      current: now.toISOString(),
      date: now.toLocaleDateString('zh-CN'),
      time: now.toLocaleTimeString('zh-CN'),
      weekday: now.toLocaleDateString('zh-CN', { weekday: 'long' }),
    }

    if (input.includes('日期')) {
      return `今天日期：${info.date} ${info.weekday}`
    }
    if (input.includes('时间')) {
      return `当前时间：${info.time}`
    }
    return `当前日期时间：${info.date} ${info.time} ${info.weekday}`
  },
}

// 内置插件：翻译
export const translatePlugin: Plugin = {
  id: 'translate',
  name: '翻译',
  description: '翻译文本到指定语言',
  icon: '🌐',
  version: '1.0.0',
  enabled: false,
  config: {
    targetLanguage: 'zh',
  },
  handler: async (text, config) => {
    // 这里需要实际的翻译 API
    const targetLang = config?.targetLanguage || 'zh'
    return `[翻译到 ${targetLang}]: ${text}`
  },
}
