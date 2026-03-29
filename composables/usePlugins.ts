import { createPluginRegistry, type Plugin } from '~/types/plugins'

// 创建全局插件注册表
const registry = createPluginRegistry()

// 注册内置插件
import {
  calculatorPlugin,
  dateTimePlugin,
  webSearchPlugin,
  codeExecutorPlugin,
  translatePlugin,
} from '~/types/plugins'

registry.register(calculatorPlugin)
registry.register(dateTimePlugin)
registry.register(webSearchPlugin)
registry.register(codeExecutorPlugin)
registry.register(translatePlugin)

export function usePlugins() {
  const chatStore = useChatStore()

  // 检测是否需要调用插件
  function detectPlugin(input: string): Plugin | null {
    const enabledPlugins = registry.getEnabled()

    for (const plugin of enabledPlugins) {
      // 简单的关键词匹配
      if (plugin.id === 'calculator' && /[\d]+[\s]*[+\-*/]/.test(input)) {
        return plugin
      }
      if (plugin.id === 'datetime' && (input.includes('时间') || input.includes('日期'))) {
        return plugin
      }
      if (plugin.id === 'web-search' && (input.includes('搜索') || input.includes('查找'))) {
        return plugin
      }
    }

    return null
  }

  // 执行插件
  async function executePlugin(plugin: Plugin, input: string): Promise<string> {
    try {
      return await plugin.handler(input, plugin.config)
    } catch (error: any) {
      return `插件执行失败：${error.message}`
    }
  }

  // 获取所有插件
  function getAllPlugins(): Plugin[] {
    return registry.getAll()
  }

  // 获取启用的插件
  function getEnabledPlugins(): Plugin[] {
    return registry.getEnabled()
  }

  // 切换插件状态
  function togglePlugin(pluginId: string): void {
    const plugin = registry.get(pluginId)
    if (plugin) {
      plugin.enabled = !plugin.enabled
    }
  }

  // 更新插件配置
  function updatePluginConfig(pluginId: string, config: Record<string, any>): void {
    const plugin = registry.get(pluginId)
    if (plugin && plugin.config) {
      Object.assign(plugin.config, config)
    }
  }

  return {
    detectPlugin,
    executePlugin,
    getAllPlugins,
    getEnabledPlugins,
    togglePlugin,
    updatePluginConfig,
  }
}
