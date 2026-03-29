<template>
  <main class="flex-1 flex flex-col h-full overflow-hidden bg-background">
    <!-- 顶部栏 -->
    <header class="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border">
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          @click="chatStore.toggleSidebar()"
          :icon="sidebarOpen ? IconPanelLeftClose : IconPanelLeft"
        />
        <div class="flex items-center gap-2">
          <span class="font-semibold">{{ currentChat?.title || '新对话' }}</span>
          <Button
            variant="ghost"
            size="sm"
            @click="showModelDropdown = !showModelDropdown"
            class="text-muted-foreground"
          >
            {{ getModelDisplayName(currentChat?.model || selectedModel) }}
            <IconChevronDown class="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button
          v-if="currentChat"
          variant="ghost"
          size="icon"
          @click="exportChat"
          :icon="IconDownload"
          title="导出对话"
        />
        <Button
          v-if="currentChat"
          variant="ghost"
          size="icon"
          @click="clearChat"
          :icon="IconTrash2"
          title="清空对话"
        />
        <ThemeToggle />
      </div>

      <!-- 模型选择下拉 -->
      <div
        v-if="showModelDropdown"
        class="absolute top-14 left-1/2 -translate-x-1/2 w-64 bg-card border border-border rounded-xl shadow-xl z-50"
      >
        <div class="p-2">
          <div class="text-xs font-medium text-muted-foreground px-3 py-2">选择模型</div>
          <button
            v-for="model in enabledModels"
            :key="model.name"
            @click="selectModel(model.name)"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
            :class="{ 'bg-accent': (currentChat?.model || selectedModel) === model.name }"
          >
            <div class="text-left">
              <div class="text-sm font-medium">{{ model.displayName }}</div>
              <div class="text-xs text-muted-foreground">{{ model.provider }}</div>
            </div>
            <IconCheck
              v-if="(currentChat?.model || selectedModel) === model.name"
              class="w-4 h-4 text-primary"
            />
          </button>
        </div>
      </div>
    </header>

    <!-- 消息列表 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto scrollbar-thin"
      @scroll="handleScroll"
    >
      <div v-if="!currentChat || currentChat.messages.length === 0" class="h-full flex items-center justify-center">
        <div class="text-center max-w-md px-4">
          <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <IconMessageSquare class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-xl font-semibold mb-2">开始新的对话</h2>
          <p class="text-muted-foreground mb-6">
            输入消息开始与 AI 助手对话，支持多种模型选择
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="sendSuggestion(suggestion)"
              class="p-3 text-sm text-left rounded-lg border border-border hover:bg-accent transition-colors"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="max-w-3xl mx-auto px-4 py-6">
        <div
          v-for="(message, index) in currentChat.messages"
          :key="message.id"
          :class="[
            'flex gap-4 mb-6',
            message.role === 'user' ? 'flex-row-reverse' : '',
          ]"
        >
          <!-- 头像 -->
          <div
            :class="[
              'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
            ]"
          >
            <IconUser v-if="message.role === 'user'" class="w-5 h-5" />
            <IconBot v-else class="w-5 h-5" />
          </div>

          <!-- 消息内容 -->
          <div
            :class="[
              'flex-1 max-w-[80%]',
              message.role === 'user' ? 'text-right' : '',
            ]"
          >
            <div
              :class="[
                'inline-block px-4 py-3 rounded-2xl',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border',
                message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm',
              ]"
            >
              <MarkdownRenderer v-if="message.role === 'assistant'" :content="message.content" />
              <div v-else class="whitespace-pre-wrap">{{ message.content }}</div>
            </div>

            <!-- 消息操作 -->
            <div
              :class="[
                'flex items-center gap-2 mt-2',
                message.role === 'user' ? 'justify-end' : '',
              ]"
            >
              <span class="text-xs text-muted-foreground">
                {{ formatTime(message.createdAt) }}
              </span>
              <button
                v-if="message.role === 'assistant'"
                @click="copyMessage(message.content)"
                class="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="复制"
              >
                <IconCopy class="w-3.5 h-3.5" />
              </button>
              <button
                @click="regenerateMessage(index)"
                v-if="message.role === 'assistant' && index === currentChat.messages.length - 1"
                class="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="重新生成"
              >
                <IconRefreshCw class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- 生成中状态 -->
        <div v-if="isGenerating" class="flex gap-4 mb-6">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <IconBot class="w-5 h-5 text-white" />
          </div>
          <div class="bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-sm">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="flex-shrink-0 border-t border-border">
      <!-- 插件管理器 -->
      <PluginManager />
      <!-- 提示词模板 -->
      <MaskSelector />
      <div class="p-4">
        <div class="max-w-3xl mx-auto">
          <div class="relative">
            <textarea
              ref="inputRef"
              v-model="inputMessage"
              :placeholder="isGenerating ? 'AI 正在回复...' : '输入消息...'"
              :disabled="isGenerating"
              :rows="textareaRows"
              class="w-full bg-card border border-border rounded-2xl px-4 py-3 pr-24 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all scrollbar-thin"
              @keydown.enter.exact.prevent="handleEnterKey"
              @input="adjustTextareaHeight"
            />
            <div class="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                v-if="isGenerating"
                variant="secondary"
                size="sm"
                @click="stopGenerating"
                :icon="IconSquare"
              >
                停止
              </Button>
              <Button
                v-else
                variant="primary"
                size="sm"
                @click="sendMessage"
                :disabled="!inputMessage.trim()"
                :icon="IconSend"
              >
                发送
              </Button>
            </div>
          </div>
          <div class="text-xs text-muted-foreground mt-2 text-center">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  PanelLeftClose as IconPanelLeftClose,
  PanelLeft as IconPanelLeft,
  ChevronDown as IconChevronDown,
  Download as IconDownload,
  Trash2 as IconTrash2,
  MessageSquare as IconMessageSquare,
  User as IconUser,
  Bot as IconBot,
  Copy as IconCopy,
  RefreshCw as IconRefreshCw,
  Send as IconSend,
  Square as IconSquare,
  Check as IconCheck,
} from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const chatStore = useChatStore()
const { sidebarOpen, currentChat, selectedModel, enabledModels, isGenerating } = storeToRefs(chatStore)

const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const inputMessage = ref('')
const textareaRows = ref(1)
const showModelDropdown = ref(false)

const suggestions = [
  '解释量子力学',
  '写一个 Python 脚本',
  '推荐几本好书',
  '如何学习编程',
]

function getModelDisplayName(modelName: string): string {
  const model = chatStore.getModelConfig(modelName)
  return model?.displayName || modelName
}

function selectModel(modelName: string) {
  chatStore.setSelectedModel(modelName)
  showModelDropdown.value = false
}

function adjustTextareaHeight() {
  const textarea = inputRef.value
  if (!textarea) return

  textarea.style.height = 'auto'
  const newHeight = Math.min(textarea.scrollHeight, 200)
  textarea.style.height = `${newHeight}px`
  textareaRows.value = Math.ceil(newHeight / 24)
}

function handleEnterKey(event: KeyboardEvent) {
  if (event.shiftKey) {
    // Shift + Enter: 换行
    return
  }
  sendMessage()
}

function sendMessage() {
  const content = inputMessage.trim()
  if (!content || isGenerating.value) return

  if (!currentChat.value) {
    chatStore.createChat()
  }

  // 添加用户消息
  chatStore.addMessage(currentChat.value!.id, {
    role: 'user',
    content,
  })

  inputMessage.value = ''
  adjustTextareaHeight()

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  // 调用 API 获取回复
  generateResponse()
}

function sendSuggestion(suggestion: string) {
  inputMessage.value = suggestion
  sendMessage()
}

async function generateResponse() {
  chatStore.setIsGenerating(true)

  try {
    const messages = currentChat.value!.messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    const response = await fetch(`${chatStore.apiHost}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${chatStore.apiKey}`,
      },
      body: JSON.stringify({
        model: currentChat.value!.model,
        messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || '请求失败')
    }

    // 创建助手消息
    const assistantMessage = chatStore.addMessage(currentChat.value!.id, {
      role: 'assistant',
      content: '',
    })

    // 处理流式响应
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content || ''
            fullContent += delta

            chatStore.updateMessage(currentChat.value!.id, assistantMessage.id, fullContent)

            // 滚动到底部
            scrollToBottom()
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error: any) {
    console.error('生成失败:', error)
    chatStore.addMessage(currentChat.value!.id, {
      role: 'assistant',
      content: `❌ 错误：${error.message || '请求失败，请检查网络或 API 配置'}`,
    })
  } finally {
    chatStore.setIsGenerating(false)
  }
}

function stopGenerating() {
  chatStore.setIsGenerating(false)
}

function regenerateMessage(index: number) {
  if (!currentChat.value || index < 1) return

  // 删除当前的助手消息和之前的用户消息
  const userMessage = currentChat.value.messages[index - 1]
  if (userMessage) {
    inputMessage.value = userMessage.content
    // 删除最后两条消息
    chatStore.deleteMessage(currentChat.value.id, currentChat.value.messages[index].id)
    chatStore.deleteMessage(currentChat.value.id, userMessage.id)

    nextTick(() => {
      sendMessage()
    })
  }
}

function copyMessage(content: string) {
  navigator.clipboard.writeText(content)
}

function clearChat() {
  if (currentChat.value && confirm('确定要清空对话吗？')) {
    chatStore.clearChat(currentChat.value.id)
  }
}

function exportChat() {
  if (!currentChat.value) return

  const data = chatStore.exportChat()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentChat.value.title}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function scrollToBottom() {
  const container = messagesContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

function handleScroll() {
  // 可以在这里添加自动加载历史消息的逻辑
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 点击外部关闭模型选择下拉
const dropdownRef = ref(null)
onClickOutside(
  dropdownRef,
  () => {
    showModelDropdown.value = false
  }
)
</script>
