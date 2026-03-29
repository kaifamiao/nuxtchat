<template>
  <Modal
    v-model="chatStore.settingsOpen"
    title="设置"
    class="w-full max-w-2xl max-h-[80vh]"
  >
    <div class="space-y-6">
      <!-- API 配置 -->
      <section>
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconKey class="w-5 h-5" />
          API 配置
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">API Key</label>
            <Input
              v-model="apiKey"
              type="password"
              placeholder="sk-..."
            />
            <p class="text-xs text-muted-foreground mt-1">
              API Key 存储在本地，不会上传到服务器
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">API 代理地址</label>
            <Input
              v-model="apiHost"
              placeholder="https://api.openai.com/v1"
            />
            <p class="text-xs text-muted-foreground mt-1">
              可选：使用代理时填写，例如 https://api.openai-proxy.com/v1
            </p>
          </div>

          <div v-if="apiKey">
            <Button @click="checkApiKey" variant="outline" size="sm">
              验证 API Key
            </Button>
            <span v-if="apiKeyValid" class="ml-2 text-sm text-green-600">✓ 有效</span>
            <span v-if="apiKeyValid === false" class="ml-2 text-sm text-red-600">✗ 无效</span>
          </div>
        </div>
      </section>

      <!-- 模型配置 -->
      <section>
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconCpu class="w-5 h-5" />
          模型管理
        </h3>
        <div class="space-y-3">
          <div
            v-for="model in chatStore.models"
            :key="model.name"
            class="flex items-center justify-between p-3 rounded-lg border border-border"
          >
            <div class="flex items-center gap-3">
              <input
                v-model="model.enabled"
                type="checkbox"
                class="w-4 h-4 rounded border-input"
              />
              <div>
                <div class="font-medium">{{ model.displayName }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ model.provider }} · {{ formatTokenLimit(model.maxTokens) }}
                </div>
              </div>
            </div>
            <button
              v-if="model.isCustom"
              @click="removeCustomModel(model.name)"
              class="p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <IconTrash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 添加自定义模型 -->
        <div class="mt-4 p-4 rounded-lg bg-muted/50">
          <h4 class="text-sm font-medium mb-3">添加自定义模型</h4>
          <div class="grid grid-cols-2 gap-3">
            <Input
              v-model="customModel.name"
              placeholder="模型名称 (如：gpt-4-custom)"
            />
            <Input
              v-model="customModel.displayName"
              placeholder="显示名称 (如：GPT-4 定制版)"
            />
          </div>
          <div class="flex items-center gap-2 mt-3">
            <select v-model="customModel.provider" class="input-base flex-1">
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="azure">Azure</option>
              <option value="custom">自定义</option>
            </select>
            <Button @click="addCustomModel" variant="primary" size="sm">
              添加
            </Button>
          </div>
        </div>
      </section>

      <!-- 生成参数 -->
      <section>
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconSliders class="w-5 h-5" />
          生成参数
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">
              温度 (Temperature): {{ temperature }}
            </label>
            <input
              v-model="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              class="w-full"
            />
            <p class="text-xs text-muted-foreground mt-1">
              越高越随机，越低越确定
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">
              最大 Token 数：{{ maxTokens }}
            </label>
            <input
              v-model="maxTokens"
              type="range"
              min="256"
              max="128000"
              step="256"
              class="w-full"
            />
            <p class="text-xs text-muted-foreground mt-1">
              单次响应的最大 token 数量
            </p>
          </div>
        </div>
      </section>

      <!-- 系统提示词 -->
      <section>
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconMessageSquare class="w-5 h-5" />
          系统提示词
        </h3>
        <textarea
          v-model="systemPrompt"
          placeholder="例如：你是一个有帮助的 AI 助手..."
          rows="4"
          class="w-full input-base resize-none"
        />
        <p class="text-xs text-muted-foreground mt-1">
          设置 AI 的角色和行为方式
        </p>
      </section>

      <!-- 数据管理 -->
      <section>
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <IconDatabase class="w-5 h-5" />
          数据管理
        </h3>
        <div class="flex flex-wrap gap-2">
          <Button @click="exportAllChats" variant="outline" :icon="IconDownload">
            导出所有对话
          </Button>
          <Button @click="importChat" variant="outline" :icon="IconUpload">
            导入对话
          </Button>
          <Button @click="clearAllData" variant="destructive" :icon="IconTrash2">
            清空所有数据
          </Button>
        </div>
        <input
          ref="importInput"
          type="file"
          accept=".json"
          class="hidden"
          @change="handleImport"
        />
      </section>
    </div>

    <template #footer>
      <Button @click="saveSettings" variant="primary">
        保存设置
      </Button>
      <Button @click="chatStore.settingsOpen = false" variant="ghost">
        取消
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  Key as IconKey,
  Cpu as IconCpu,
  Sliders as IconSliders,
  MessageSquare as IconMessageSquare,
  Database as IconDatabase,
  Trash2 as IconTrash2,
  Download as IconDownload,
  Upload as IconUpload,
} from 'lucide-vue-next'

const chatStore = useChatStore()

// API 配置
const apiKey = ref(chatStore.apiKey)
const apiHost = ref(chatStore.apiHost)
const apiKeyValid = ref<boolean | null>(null)

// 生成参数
const temperature = ref(0.7)
const maxTokens = ref(4096)
const systemPrompt = ref('')

// 自定义模型
const customModel = ref({
  name: '',
  displayName: '',
  provider: 'custom' as const,
})

const importInput = ref<HTMLInputElement | null>(null)

async function checkApiKey() {
  try {
    const response = await fetch(`${apiHost.value}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey.value}`,
      },
    })
    apiKeyValid.value = response.ok
  } catch {
    apiKeyValid.value = false
  }
}

function formatTokenLimit(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M tokens`
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K tokens`
  }
  return `${tokens} tokens`
}

function addCustomModel() {
  if (!customModel.value.name || !customModel.value.displayName) {
    alert('请填写模型名称和显示名称')
    return
  }

  chatStore.addCustomModel({
    name: customModel.value.name,
    displayName: customModel.value.displayName,
    provider: customModel.value.provider,
    maxTokens: 128000,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    enabled: true,
    isCustom: true,
  })

  customModel.value = { name: '', displayName: '', provider: 'custom' }
}

function removeCustomModel(name: string) {
  if (confirm('确定要移除这个自定义模型吗？')) {
    chatStore.removeCustomModel(name)
  }
}

function saveSettings() {
  chatStore.setApiKey(apiKey.value)
  chatStore.setApiHost(apiHost.value)
  chatStore.settingsOpen = false
}

function exportAllChats() {
  const data = JSON.stringify(chatStore.chatSessions, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nuxtchat-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importChat() {
  importInput.value?.click()
}

function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (Array.isArray(data)) {
        // 导入多个对话
        data.forEach(chat => {
          chatStore.importChat(JSON.stringify(chat))
        })
      } else {
        chatStore.importChat(JSON.stringify(data))
      }
      alert('导入成功！')
    } catch {
      alert('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)
}

function clearAllData() {
  if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
    localStorage.removeItem('nuxtchat-store')
    location.reload()
  }
}
</script>
