<template>
  <div class="prose prose-slate dark:prose-invert max-w-none" v-html="renderedContent" />
</template>

<script setup lang="ts">
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const props = defineProps<{
  content: string
}>()

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
})

// 自定义 renderer 处理 LaTeX
const renderer = new marked.Renderer()
const originalCode = renderer.code.bind(renderer)
renderer.code = (code, language) => {
  if (language === 'latex' || language === 'tex') {
    try {
      return katex.renderToString(code, {
        displayMode: true,
        throwOnError: false,
      })
    } catch {
      return originalCode(code, language)
    }
  }
  return originalCode(code, language)
}

// 处理行内 LaTeX
const originalText = renderer.text.bind(renderer)
renderer.text = (text) => {
  // 处理行内公式 $...$
  return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      })
    } catch {
      return match
    }
  })
}

marked.use({ renderer })

const renderedContent = computed(() => {
  if (!props.content) return ''
  return marked.parse(props.content) as string
})
</script>

<style>
.prose {
  word-wrap: break-word;
}

.prose pre {
  margin: 0.5em 0;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose code {
  font-size: 0.875em;
}

.prose p {
  margin: 0.5em 0;
}

.prose ul, .prose ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.prose li {
  margin: 0.25em 0;
}

.prose blockquote {
  border-left: 3px solid rgb(var(--primary));
  padding-left: 1em;
  margin: 0.5em 0;
  color: rgb(var(--muted-foreground));
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5em 0;
}

.prose th, .prose td {
  border: 1px solid rgb(var(--border));
  padding: 0.5em;
  text-align: left;
}

.prose th {
  background: rgb(var(--muted));
  font-weight: 600;
}

.katex {
  font-size: 1.1em;
}

.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5em 0;
}
</style>
