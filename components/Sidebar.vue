<template>
  <aside
    :class="[
      'flex-shrink-0 h-full bg-card border-r border-border transition-all duration-300',
      sidebarOpen ? 'w-72' : 'w-0',
      'overflow-hidden',
    ]"
  >
    <div class="flex flex-col h-full" :class="sidebarOpen ? 'w-72' : 'w-0'">
      <!-- 头部：新建对话 -->
      <div class="p-4 border-b border-border">
        <Button @click="createNewChat" variant="primary" className="w-full" :icon="IconPlus">
          新建对话
        </Button>
      </div>

      <!-- 搜索框 -->
      <div class="p-4 pb-2">
        <Input
          v-model="searchQuery"
          placeholder="搜索对话..."
          :icon="IconSearch"
        />
      </div>

      <!-- 历史记录列表 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin p-2">
        <div v-if="filteredChats.length === 0" class="text-center py-8 text-muted-foreground">
          <IconInbox class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p class="text-sm">{{ searchQuery ? '未找到相关对话' : '暂无历史记录' }}</p>
        </div>

        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          :class="[
            'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1',
            chat.id === currentChatId ? 'bg-primary/10 text-primary' : 'hover:bg-accent',
          ]"
          @click="selectChat(chat.id)"
        >
          <IconMessageSquare class="w-5 h-5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ chat.title }}</div>
            <div class="text-xs text-muted-foreground truncate">
              {{ formatDate(chat.updatedAt) }}
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="pinChat(chat)"
              class="p-1 rounded hover:bg-accent"
              :title="chat.pinned ? '取消置顶' : '置顶'"
            >
              <IconPin v-if="chat.pinned" class="w-4 h-4" />
              <IconPinOff v-else class="w-4 h-4" />
            </button>
            <button
              @click.stop="deleteChat(chat.id)"
              class="p-1 rounded hover:bg-destructive hover:text-destructive-foreground"
            >
              <IconTrash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- 底部：设置和主题 -->
      <div class="p-4 border-t border-border">
        <div class="flex items-center justify-between">
          <Button variant="ghost" size="icon" @click="openSettings" :icon="IconSettings">
            设置
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  Plus as IconPlus,
  Search as IconSearch,
  MessageSquare as IconMessageSquare,
  Inbox as IconInbox,
  Pin as IconPin,
  PinOff as IconPinOff,
  Trash2 as IconTrash2,
  Settings as IconSettings,
} from 'lucide-vue-next'

const chatStore = useChatStore()
const { sidebarOpen, currentChatId } = storeToRefs(chatStore)

const searchQuery = ref('')

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) {
    return chatStore.chatSessions
  }
  return chatStore.searchChats(searchQuery.value)
})

function createNewChat() {
  chatStore.createChat()
}

function selectChat(chatId: string) {
  chatStore.selectChat(chatId)
}

function deleteChat(chatId: string) {
  if (confirm('确定要删除这个对话吗？')) {
    chatStore.deleteChat(chatId)
  }
}

function pinChat(chat: any) {
  chat.pinned = !chat.pinned
  // 重新排序：置顶的放前面
  if (chat.pinned) {
    const index = chatStore.chatSessions.findIndex(c => c.id === chat.id)
    if (index > 0) {
      chatStore.chatSessions.splice(index, 1)
      chatStore.chatSessions.unshift(chat)
    }
  }
}

function openSettings() {
  chatStore.toggleSettings()
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}
</script>
