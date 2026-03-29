<template>
  <div class="flex h-screen">
    <Sidebar />
    <ChatPanel />
    <SettingsPanel />
  </div>
</template>

<script setup lang="ts">
// 页面初始化
const chatStore = useChatStore()
const { locale } = useI18n()

// 从 store 恢复语言设置
onMounted(() => {
  if (chatStore.language) {
    locale.value = chatStore.language
  }

  // 如果没有当前对话，创建一个
  if (!chatStore.currentChatId) {
    chatStore.createChat()
  }
})
</script>
