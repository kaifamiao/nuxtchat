<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-lg shadow-sm',
      variant === 'primary' && 'bg-primary text-white hover:bg-primary/90 hover:shadow-md',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
      variant === 'outline' && 'border-2 border-input hover:bg-accent hover:text-accent-foreground',
      variant === 'destructive' && 'bg-destructive text-white hover:bg-destructive/90',
      size === 'sm' && 'px-4 py-2 text-sm',
      size === 'md' && 'px-5 py-2.5 text-base',
      size === 'lg' && 'px-6 py-3 text-base',
      size === 'icon' && 'p-2',
      disabled && variant !== 'primary' && 'opacity-50 cursor-not-allowed',
      disabled && variant === 'primary' && 'opacity-70 cursor-not-allowed',
      className,
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon">
      <component :is="icon" v-if="icon" :class="size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'" />
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
  className?: string
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
