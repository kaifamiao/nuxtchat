<template>
  <div class="relative">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full bg-background border border-input rounded-lg px-4 py-2',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'transition-all placeholder:text-muted-foreground',
        icon && 'pl-10',
        class,
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <Icon
      v-if="icon"
      :class="['absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground']"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  icon?: Component
  class?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
