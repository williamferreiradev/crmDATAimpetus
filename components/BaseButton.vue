<template>
  <button 
    :class="[
      'px-6 py-2.5 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2',
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  disabled?: boolean
}>(), {
  variant: 'primary',
  disabled: false
})

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-black shadow-neon hover:shadow-[0_0_30px_rgba(0,224,150,0.6)]',
  secondary: 'bg-white border border-gray-200 text-gray-900 hover:border-primary-500 dark:bg-dark-surface dark:border-dark-border dark:text-white',
  ghost: 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md'
}
</script>
