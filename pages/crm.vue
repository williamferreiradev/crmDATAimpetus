<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessageSquare, KanbanSquare, Table as TableIcon } from 'lucide-vue-next'
import KanbanBoard from '@/components/crm/KanbanBoard.vue'
import LeadTable from '@/components/crm/LeadTable.vue'
import type { Cliente, CrmStatus } from '@/types/crm'

const supabase = useSupabaseClient()

// State
const currentView = ref<'kanban' | 'table'>('kanban')
const leads = ref<Cliente[]>([])
const loading = ref(true)

// Fetch Data
const fetchLeads = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('is_active', true)
    .order('last_interaction_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
  } else {
    leads.value = (data as Cliente[]) || []
  }
  loading.value = false
}

// Update Status Action
const handleStatusUpdate = async (id: string, newStatus: CrmStatus) => {
  // Optimistic Update
  const lead = leads.value.find(l => l.id === id)
  if (lead) {
    lead.status_crm = newStatus
  }

  // DB Update
  const { error } = await supabase
    .from('clientes')
    .update({ status_crm: newStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating status:', error)
    // Revert if error (optional, simplified for now)
    await fetchLeads() 
  }
}

onMounted(() => {
  fetchLeads()
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
    <Sidebar />

    <main class="ml-64 p-8 h-screen overflow-hidden flex flex-col">
      <!-- Header -->
      <header class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-[#00E096]/10 rounded-xl text-[#00E096]">
             <MessageSquare class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight flex items-center gap-3">
              Pipeline de Leads
              <span v-if="!loading" class="text-xs font-bold bg-[#18181B] text-[#9CA3AF] px-2 py-1 rounded-full border border-[#27272A]">
                {{ leads.length }} leads
              </span>
            </h1>
            <p class="text-[#9CA3AF] text-sm mt-1">Gerencie o fluxo de negociações.</p>
          </div>
        </div>
        
        <!-- View Toggle -->
        <div class="bg-[#18181B] p-1 rounded-lg border border-[#27272A] flex gap-1">
          <button 
            @click="currentView = 'kanban'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all',
              currentView === 'kanban' ? 'bg-[#00E096] text-black shadow-lg shadow-[#00E096]/20' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
            ]"
          >
            <KanbanSquare class="w-4 h-4" /> Kanban
          </button>
          
          <button 
            @click="currentView = 'table'"
            :class="[
               'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all',
               currentView === 'table' ? 'bg-[#00E096] text-black shadow-lg shadow-[#00E096]/20' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
            ]"
          >
            <TableIcon class="w-4 h-4" /> Tabela
          </button>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden relative">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center z-10 bg-[#050505]/80">
           <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E096]"></div>
        </div>

        <Transition name="fade" mode="out-in">
          <KanbanBoard 
            v-if="currentView === 'kanban'" 
            :leads="leads" 
            @update-status="handleStatusUpdate"
          />
          <LeadTable 
            v-else 
            :leads="leads" 
          />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
