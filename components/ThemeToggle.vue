<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-lg transition-colors duration-300 focus:outline-none"
    :class="isDark ? 'bg-dark-surface text-primary-500 hover:bg-dark-border' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
    aria-label="Toggle Theme"
  >
    <!-- Sun Icon (for Dark Mode) -->
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
    
    <!-- Moon Icon (for Light Mode) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>
</template>

<script setup lang="ts">
const isDark = useState('theme', () => true) // Default to dark

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateDOM()
}

const updateDOM = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  // Initialize based on state
  updateDOM()
})
</script>
