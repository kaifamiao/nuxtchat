// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    'pinia/nuxt',
    '~/modules/lucide-icons',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    viewer: true,
  },

  colorMode: {
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'theme',
    preference: 'system',
    fallback: 'light',
  },

  i18n: {
    vueI18n: '~/i18n.config.ts',
    locales: [
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.ts' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.ts' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja-JP.ts' },
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr-FR.ts' },
    ],
    defaultLocale: 'zh',
    lazy: true,
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: true,
  },

  app: {
    head: {
      title: 'NuxtChat',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '轻量、快速的 AI 助手界面' },
        { name: 'theme-color', content: '#3b82f6' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  nitro: {
    preset: 'node-server',
  },

  runtimeConfig: {
    public: {
      defaultModel: 'gpt-4o',
    },
  },

  typescript: {
    strict: true,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-core': ['vue', 'vue-router', 'pinia'],
            'vendor-markdown': ['marked', 'highlight.js', 'katex'],
          },
        },
      },
    },
  },
})
