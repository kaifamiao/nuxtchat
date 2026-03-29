// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.mjs',
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
    defaultLocale: 'zh',
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
