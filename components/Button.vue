<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-lg',
      variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
      variant === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
      variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      size === 'icon' && 'p-2',
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      class,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon">
      <Icon v-if="icon" :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" />
    </slot>
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  icon?: Component
  disabled?: boolean
  class?: string
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
