<template>
  <div class="min-h-screen flex items-stretch">
    <!-- Right Side - Image & Branding (Inverted for Login) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-dark-bg overflow-hidden order-last">
      <!-- Background Image -->
      <img src="/images/login-bg.png" alt="Data Impetus Workspace" class="absolute inset-0 w-full h-full object-cover" />
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      <!-- Branding Text -->
      <div class="relative z-10 w-full p-12 flex flex-col justify-between h-full items-end text-right">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-widest uppercase">
            Data Impetus
          </h1>
          <div class="h-1 w-24 bg-primary-500 mt-2 rounded-full shadow-neon ml-auto"></div>
        </div>

        <div class="space-y-4">
          <p class="text-gray-300 text-lg max-w-md leading-relaxed ml-auto">
            Acesse seu painel e controle o futuro dos seus dados. O poder está em suas mãos.
          </p>
        </div>
      </div>
    </div>

    <!-- Left Side - Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white dark:bg-dark-bg transition-colors duration-300 relative">
      <!-- Theme Toggle (Absolute Top Left) -->
      <div class="absolute top-6 left-6">
        <ThemeToggle />
      </div>

      <div class="w-full max-w-md space-y-8 animate-fade-in-up">
        <!-- Feedback Message -->
        <div v-if="feedback.message" 
             :class="[
               'p-4 rounded-lg text-center font-bold mb-4 transition-all duration-300',
               feedback.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
             ]">
          {{ feedback.message }}
        </div>

        <!-- Header -->
        <div class="text-center space-y-2">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta</h2>
          <p class="text-gray-500 dark:text-dark-muted">Faça login para continuar</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-5">
            <BaseInput 
              v-model="form.email"
              label="Endereço de E-mail"
              placeholder="nome@empresa.com"
              type="email"
              :disabled="loading"
            />
            
            <BaseInput 
              v-model="form.password"
              label="Senha"
              placeholder="••••••••"
              type="password"
              :disabled="loading"
            />
          </div>

          <BaseButton variant="primary" class="w-full py-3 text-lg pointer-events-auto" :disabled="loading">
            <span v-if="loading">Entrando...</span>
            <span v-else>Entrar</span>
          </BaseButton>
        </form>

        <!-- Footer -->
        <div class="text-center text-sm text-gray-500 dark:text-dark-muted">
          Não tem uma conta? 
          <NuxtLink to="/cadastro" class="font-bold text-primary-500 hover:text-primary-600 transition-colors">Criar conta</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const feedback = reactive({
  type: '' as 'error' | 'success' | '',
  message: ''
})

const handleLogin = async () => {
  loading.value = true
  feedback.message = ''
  feedback.type = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
      feedback.type = 'error'
      feedback.message = 'Erro ao entrar: Verifique suas credenciais.'
      console.error(error)
    } else {
      feedback.type = 'success'
      feedback.message = 'Login realizado com SUCESSO! Redirecionando...'
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  } catch (e) {
    feedback.type = 'error'
    feedback.message = 'Ocorreu um erro inesperado.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>
