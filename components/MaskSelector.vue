<template>
  <div class="p-4 border-t border-border">
    <Button @click="showMasks = true" variant="secondary" className="w-full" :icon="IconBoxes">
      选择提示词模板
    </Button>
  </div>

  <Modal v-model="showMasks" title="选择提示词模板" class="w-full max-w-3xl">
    <!-- 分类筛选 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          selectedCategory === cat
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 模板列表 -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
      <button
        v-for="mask in filteredMasks"
        :key="mask.id"
        @click="selectMask(mask)"
        class="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
      >
        <div class="text-2xl mb-2">{{ mask.icon }}</div>
        <div class="font-medium text-sm mb-1">{{ mask.name }}</div>
        <div class="text-xs text-muted-foreground line-clamp-2">{{ mask.description }}</div>
      </button>
    </div>

    <!-- 自定义提示词 -->
    <div class="mt-6 pt-4 border-t border-border">
      <h4 class="text-sm font-medium mb-3">或创建自定义模板</h4>
      <Input
        v-model="customMaskName"
        placeholder="模板名称"
        class="mb-2"
      />
      <textarea
        v-model="customMaskPrompt"
        placeholder="系统提示词..."
        rows="3"
        class="w-full input-base resize-none"
      />
      <Button @click="createCustomMask" variant="primary" className="mt-2 w-full" :icon="IconPlus">
        创建模板
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Boxes as IconBoxes, Plus as IconPlus } from 'lucide-vue-next'
import type { MaskTemplate } from '~/types/masks'
import { BUILTIN_MASKS } from '~/types/masks'

const chatStore = useChatStore()
const showMasks = ref(false)
const selectedCategory = ref('全部')

const customMaskName = ref('')
const customMaskPrompt = ref('')

const categories = computed(() => {
  const cats = new Set(BUILTIN_MASKS.map(m => m.category))
  return ['全部', ...Array.from(cats)]
})

const filteredMasks = computed(() => {
  if (selectedCategory.value === '全部') {
    return BUILTIN_MASKS
  }
  return BUILTIN_MASKS.filter(m => m.category === selectedCategory.value)
})

function selectMask(mask: MaskTemplate) {
  // 更新当前对话的系统提示词
  if (chatStore.currentChatId) {
    const chat = chatStore.currentChat
    if (chat) {
      chat.systemPrompt = mask.systemPrompt
      // 添加系统消息
      const existingSystemMessage = chat.messages.find(m => m.role === 'system')
      if (existingSystemMessage) {
        existingSystemMessage.content = mask.systemPrompt
      } else {
        chatStore.addMessage(chat.id, {
          role: 'system',
          content: mask.systemPrompt,
        })
      }
    }
  }
  showMasks.value = false
}

function createCustomMask() {
  if (!customMaskName.value || !customMaskPrompt.value) {
    alert('请填写模板名称和系统提示词')
    return
  }

  const newMask: MaskTemplate = {
    id: `custom-${Date.now()}`,
    name: customMaskName.value,
    description: '自定义模板',
    systemPrompt: customMaskPrompt.value,
    icon: '⭐',
    category: '自定义',
    createdAt: Date.now(),
  }

  selectMask(newMask)
  customMaskName.value = ''
  customMaskPrompt.value = ''
}
</script>
