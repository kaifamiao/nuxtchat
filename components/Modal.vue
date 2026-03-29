<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- 背景遮罩 -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        />

        <!-- 弹窗内容 -->
        <div
          :class="[
            'relative bg-card border border-border rounded-xl shadow-2xl',
            'max-w-[90vw] w-full max-h-[90vh] overflow-hidden',
            'animate-in fade-in zoom-in duration-200',
            className,
          ]"
        >
          <!-- 头部 -->
          <div
            v-if="$slots.header || title"
            class="flex items-center justify-between px-6 py-4 border-b border-border"
          >
            <slot name="header">
              <h3 class="text-lg font-semibold">{{ title }}</h3>
            </slot>
            <button
              @click="$emit('update:modelValue', false)"
              class="p-1 rounded-lg hover:bg-accent transition-colors"
            >
              <IconX class="w-5 h-5" />
            </button>
          </div>

          <!-- 内容区域 -->
          <div
            :class="[
              'px-6 py-4 overflow-y-auto',
              $slots.header || title ? '' : 'pt-6',
              $slots.footer ? '' : 'pb-6',
            ]"
          >
            <slot />
          </div>

          <!-- 底部 -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X as IconX } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  title?: string
  className?: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
