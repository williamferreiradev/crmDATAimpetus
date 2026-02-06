<script setup lang="ts">
import { 
  LayoutDashboard, 
  KanbanSquare, 
  MessageSquare, 
  Users, 
  BarChart3, 
  LogOut 
} from 'lucide-vue-next'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const navigation = [
  { name: 'PRINCIPAL', items: [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { name: 'CRM / Kanban', icon: KanbanSquare, route: '/crm', badge: '12+' },
    { name: 'Contatos', icon: Users, route: '/contatos' },
  ]},
  { name: 'GESTÃO', items: [
    { name: 'Chats', icon: MessageSquare, route: '/chats' },
    { name: 'Relatórios', icon: BarChart3, route: '/relatorios' },
  ]}
]

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <aside class="h-screen w-64 bg-[#121212] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0 overflow-hidden z-50">
    <!-- Header / Logo -->
    <div class="h-20 flex items-center px-8">
      <div class="flex items-center gap-3 group cursor-pointer">
         <!-- Logo Icon with Glow -->
         <div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,224,150,0.3)] group-hover:shadow-[0_0_25px_rgba(0,224,150,0.5)] transition-all duration-300">
            <div class="w-3 h-3 bg-primary-500 rounded-full"></div>
         </div>
         <span class="text-white font-bold text-xl tracking-wider uppercase group-hover:text-primary-500 transition-colors">Data Impetus</span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
      <div v-for="section in navigation" :key="section.name">
        <h3 class="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest px-4 mb-4 opacity-80">
          {{ section.name }}
        </h3>
        
        <ul class="space-y-1">
          <li v-for="item in section.items" :key="item.name">
            <NuxtLink 
              :to="item.route" 
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group relative"
              active-class="!text-[#00E096] !bg-[#00E096]/10 shadow-[inner_0_0_20px_rgba(0,224,150,0.05)]"
            >
              <!-- Active Indicator Bar -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#00E096] rounded-r-full opacity-0 transition-opacity duration-300 group-[.router-link-active]:opacity-100 shadow-[0_0_8px_#00E096]"></div>

              <component 
                :is="item.icon" 
                class="w-5 h-5 transition-all duration-300 group-[.router-link-active]:drop-shadow-[0_0_5px_rgba(0,224,150,0.5)]" 
              />
              
              <span>{{ item.name }}</span>

              <!-- Badge -->
              <span v-if="item.badge" class="ml-auto bg-[#00E096] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,224,150,0.4)]">
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer / User Profile -->
    <div class="p-4 border-t border-[#1F1F1F] bg-[#121212]">
      <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {{ user?.user_metadata?.full_name?.charAt(0) || 'U' }}
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-white truncate max-w-[100px]">
            {{ user?.user_metadata?.full_name || 'Usuário' }}
          </p>
          <p class="text-xs text-[#9CA3AF]">Admin</p>
        </div>

        <button @click="handleLogout" class="text-gray-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all" title="Sair">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
