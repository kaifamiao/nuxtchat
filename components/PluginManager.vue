<template>
  <div class="p-4 border-t border-border">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium">已启用插件</span>
      <Button
        variant="ghost"
        size="sm"
        @click="showPluginManager = true"
        :icon="IconPuzzle"
      >
        管理
      </Button>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="plugin in enabledPlugins"
        :key="plugin.id"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
      >
        <span>{{ plugin.icon }}</span>
        {{ plugin.name }}
      </span>
      <span v-if="enabledPlugins.length === 0" class="text-xs text-muted-foreground">
        暂无启用插件
      </span>
    </div>

    <!-- 插件管理器 -->
    <Modal v-model="showPluginManager" title="插件管理" class="w-full max-w-2xl">
      <div class="space-y-3">
        <div
          v-for="plugin in allPlugins"
          :key="plugin.id"
          class="flex items-center justify-between p-3 rounded-lg border border-border"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ plugin.icon }}</span>
            <div>
              <div class="font-medium text-sm">{{ plugin.name }}</div>
              <div class="text-xs text-muted-foreground">{{ plugin.description }}</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="plugin.enabled"
              @change="togglePlugin(plugin.id)"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div class="mt-6 p-4 rounded-lg bg-muted/50">
        <h4 class="text-sm font-medium mb-2">关于插件</h4>
        <p class="text-xs text-muted-foreground">
          插件可以扩展 AI 助手的功能，如网络搜索、计算器、代码执行等。
          启用的插件会在对话中自动调用。
        </p>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Puzzle as IconPuzzle } from 'lucide-vue-next'
import type { Plugin } from '~/types/plugins'

const { getAllPlugins, getEnabledPlugins, togglePlugin } = usePlugins()

const showPluginManager = ref(false)

const allPlugins = ref<Plugin[]>(getAllPlugins())
const enabledPlugins = computed(() => getEnabledPlugins())

// 定期更新插件列表
watch(showPluginManager, (open) => {
  if (open) {
    allPlugins.value = getAllPlugins()
  }
})
</script>
