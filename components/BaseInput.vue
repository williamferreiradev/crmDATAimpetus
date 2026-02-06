<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-dark-muted">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full px-4 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-dark-surface dark:border-dark-border dark:text-white dark:placeholder-dark-muted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  id?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
