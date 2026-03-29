<template>
  <ClientOnly>
    <div class="flex items-center gap-2">
      <button
        @click="toggleTheme"
        class="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        :title="`主题：${colorMode.preference}`"
      >
        <IconSun v-if="colorMode.preference === 'light'" class="w-5 h-5" />
        <IconMoon v-else-if="colorMode.preference === 'dark'" class="w-5 h-5" />
        <IconMonitor v-else class="w-5 h-5" />
      </button>

      <div class="relative" v-if="showLanguage">
        <button
          @click="showLangDropdown = !showLangDropdown"
          class="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <IconGlobe class="w-5 h-5" />
        </button>

        <div
          v-if="showLangDropdown"
          class="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg z-50"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="switchLanguage(lang.code as any)"
            class="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
            :class="{ 'bg-accent': locale === lang.code }"
          >
            {{ lang.name }}
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Sun as IconSun, Moon as IconMoon, Monitor as IconMonitor, Globe as IconGlobe } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

const colorMode = useColorMode()
const { locale, setLocale } = useI18n()
const chatStore = useChatStore()

const showLanguage = defineProps({
  showLanguage: {
    type: Boolean,
    default: true,
  },
})

const showLangDropdown = ref(false)

const languages = [
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'fr', name: 'Français' },
]

function toggleTheme() {
  const themes: Record<string, 'light' | 'dark' | 'system'> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  }
  const nextTheme = themes[colorMode.preference]
  colorMode.preference = nextTheme
  chatStore.setTheme(nextTheme)
}

function switchLanguage(lang: 'zh' | 'en' | 'ja' | 'fr') {
  setLocale(lang)
  chatStore.setLanguage(lang)
  showLangDropdown.value = false
}

// 点击外部关闭下拉菜单
const langDropdownRef = ref<HTMLElement | null>(null)
onClickOutside(
  langDropdownRef,
  () => {
    showLangDropdown.value = false
  }
)
</script>
