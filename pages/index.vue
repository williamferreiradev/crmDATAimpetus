<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center">
    <h1 class="text-5xl font-bold text-white tracking-tight">
      Nuxt <span class="text-primary-500">Tailwind</span> Setup
    </h1>
    <p class="text-xl text-dark-muted max-w-lg">
      Your project is configured with the Neon Green & Dark Deep palette.
    </p>
    <NuxtLink to="/design-system" 
      class="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-black font-bold rounded-lg transition-all duration-300 shadow-neon hover:shadow-[0_0_30px_rgba(0,224,150,0.6)]">
      View Design System
    </NuxtLink>
  </div>
</template>
