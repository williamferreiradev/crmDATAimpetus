<script setup lang="ts">
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Filter, 
  Eye, 
  Lock, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import LeadDetailsModal from '@/components/leads/LeadDetailsModal.vue'
import type { Cliente } from '@/types/crm'

const supabase = useSupabaseClient()

definePageMeta({
  // middleware: 'auth'
})

interface Lead {
  id: string
  name: string
  avatar: string
  phone: string
  interested: boolean
  product: string
  status: 'active' | 'locked'
}

// Reactive State
const leads = ref<Lead[]>([])
const metrics = reactive({
  total: 0,
  interested: 0,
  newLeads: 0,
  locked: 0
})
const loading = ref(true)
const showModal = ref(false)
const selectedLead = ref<Cliente | null>(null)
const fullLeadsData = ref<any[]>([])

// Helper to calculate date 7 days ago
const sevenDaysAgo = new Date()
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
const dateISO = sevenDaysAgo.toISOString()

// Fetch Data
const fetchData = async () => {
  loading.value = true
  try {
    // 1. Fetch Metrics (Parallelly usually better but sequential for clarity here is fine, or Promise.all)
    const metricsPromise = Promise.all([
      supabase.from('clientes').select('*', { count: 'exact', head: true }),
      supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('qualificado', true),
      supabase.from('clientes').select('*', { count: 'exact', head: true }).gte('created_at', dateISO),
      supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('trava', true)
    ])

    // 2. Fetch Table Data (Last 7)
    const tablePromise = supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(7)

    const [[totalRes, interestedRes, newRes, lockedRes], tableRes] = await Promise.all([metricsPromise, tablePromise])

    // Update Metrics
    metrics.total = totalRes.count || 0
    metrics.interested = interestedRes.count || 0
    metrics.newLeads = newRes.count || 0
    metrics.locked = lockedRes.count || 0

    // Update Leads Table
    if (tableRes.data) {
      fullLeadsData.value = tableRes.data // Store full data for modal
      leads.value = tableRes.data.map((item: any) => ({
        id: item.id,
        name: item.nome || 'Sem nome',
        avatar: (item.nome || item.whatsapp_id || 'U').charAt(0).toUpperCase(),
        phone: item.whatsapp_id,
        interested: item.qualificado || false,
        product: item.metadata?.product || 'Não informado',
        status: item.trava ? 'locked' : (item.is_active ? 'active' : 'active')
      }))
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Open Lead Details Modal
const openLeadDetails = (leadId: string) => {
  const fullLead = fullLeadsData.value.find((l: any) => l.id === leadId)
  if (fullLead) {
    selectedLead.value = fullLead as Cliente
    showModal.value = true
  }
}

// Open Chat Page
const openChat = (leadId: string) => {
  navigateTo(`/chats?clientId=${leadId}`)
}

// Handle Status Update
const handleStatusUpdate = async (id: string, newStatus: string) => {
  const lead = fullLeadsData.value.find(l => l.id === id)
  if (lead) {
    lead.status_crm = newStatus
  }
}

// Handle Notes Update
const handleNotesUpdate = async (id: string, notes: string) => {
  const lead = fullLeadsData.value.find(l => l.id === id)
  if (lead && lead.metadata) {
    lead.metadata.notes = notes
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
    <Sidebar />

    <main class="ml-64 p-8">
      <!-- Header -->
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p class="text-[#9CA3AF] mt-1">Bem-vindo ao seu painel de controle.</p>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-sm text-[#9CA3AF]">
            {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </div>
        </div>
      </header>

      <!-- 1. Metrics Section (Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Card 1: Total de Leads -->
        <div class="bg-[#121212] border-l-4 border-[#00E096] p-6 rounded-r-xl shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-[#9CA3AF] text-xs uppercase tracking-wider font-bold mb-1">Total de Leads</p>
              <h3 class="text-3xl font-bold text-white">{{ metrics.total }}</h3>
            </div>
            <div class="p-2 bg-[#00E096]/10 rounded-lg text-[#00E096]">
              <Phone class="w-6 h-6" />
            </div>
          </div>
          <p class="text-xs text-[#9CA3AF]">Contatos no WhatsApp</p>
        </div>

        <!-- Card 2: Leads Interessados -->
        <div class="bg-[#121212] border-l-4 border-[#00E096] p-6 rounded-r-xl shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-[#9CA3AF] text-xs uppercase tracking-wider font-bold mb-1">Leads Interessados</p>
              <h3 class="text-3xl font-bold text-white">{{ metrics.interested }}</h3>
            </div>
            <div class="p-2 bg-[#00E096]/10 rounded-lg text-[#00E096]">
              <MessageSquare class="w-6 h-6" />
            </div>
          </div>
          <p class="text-xs text-[#9CA3AF]">Responderam positivamente</p>
        </div>

        <!-- Card 3: Novos (7 dias) -->
        <div class="bg-[#121212] border-l-4 border-blue-500 p-6 rounded-r-xl shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-[#9CA3AF] text-xs uppercase tracking-wider font-bold mb-1">Novos (7 dias)</p>
              <h3 class="text-3xl font-bold text-white">{{ metrics.newLeads }}</h3>
            </div>
            <div class="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock class="w-6 h-6" />
            </div>
          </div>
          <p class="text-xs text-[#9CA3AF]">Novos contatos esta semana</p>
        </div>

        <!-- Card 4: Conversas Travadas -->
        <div class="bg-[#121212] border-l-4 border-red-500 p-6 rounded-r-xl shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-[#9CA3AF] text-xs uppercase tracking-wider font-bold mb-1">Conversas Travadas</p>
              <h3 class="text-3xl font-bold text-white">{{ metrics.locked }}</h3>
            </div>
            <div class="p-2 bg-red-500/10 rounded-lg text-red-500">
              <AlertCircle class="w-6 h-6" />
            </div>
          </div>
          <p class="text-xs text-[#9CA3AF]">Conversas pausadas/travadas</p>
        </div>
      </div>

      <!-- 2. Recent Leads Table -->
      <div class="bg-[#121212] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-xl">
        <!-- Table Header -->
        <div class="p-6 border-b border-[#1F1F1F] flex justify-between items-center bg-[#151515]">
          <div class="flex items-center gap-3">
             <div class="p-2 bg-[#00E096]/10 rounded-lg text-[#00E096]">
               <Phone class="w-5 h-5" />
             </div>
             <div>
               <h3 class="text-lg font-bold text-white">Clientes do WhatsApp</h3>
               <p class="text-xs text-[#9CA3AF]">Listagem recente de contatos</p>
             </div>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="bg-[#2A2A2A] text-white text-xs font-bold px-3 py-1.5 rounded-full border border-[#333]">
              {{ leads.length }} clientes
            </span>
            <button class="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#2A2A2A] transition-colors border border-transparent hover:border-[#333]">
              <Filter class="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#1F1F1F] text-[#9CA3AF] text-xs uppercase tracking-wider bg-[#181818]">
                <th class="p-4 font-semibold">Nome</th>
                <th class="p-4 font-semibold">Telefone</th>
                <th class="p-4 font-semibold">Interessado</th>
                <th class="p-4 font-semibold">Produto</th>
                <th class="p-4 font-semibold">Status</th>
                <th class="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1F1F1F]">
              <tr v-for="lead in leads" :key="lead.id" class="group hover:bg-[#1A1A1A] transition-colors">
                <!-- Nome -->
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white border border-gray-600 shadow-lg">
                      {{ lead.avatar }}
                    </div>
                    <span class="font-medium text-white">{{ lead.name }}</span>
                  </div>
                </td>
                
                <!-- Telefone -->
                <td class="p-4">
                  <div class="flex items-center gap-2 text-[#9CA3AF] text-sm">
                    <Phone class="w-3 h-3" />
                    {{ lead.phone }}
                  </div>
                </td>

                <!-- Interessado -->
                <td class="p-4">
                  <span v-if="lead.interested" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20">
                    Sim
                  </span>
                  <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                    Não
                  </span>
                </td>

                <!-- Produto -->
                <td class="p-4 text-sm text-[#9CA3AF]">
                  {{ lead.product }}
                </td>

                <!-- Status (Crucial Logic) -->
                <td class="p-4">
                  <span v-if="lead.status === 'active'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Ativo
                  </span>
                  <span v-else-if="lead.status === 'locked'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                     <Lock class="w-3 h-3" />
                     Travado
                  </span>
                </td>

                <!-- Ações -->
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="openLeadDetails(lead.id)"
                      class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" 
                      title="Ver Detalhes"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button 
                      @click="openChat(lead.id)" 
                      class="p-1.5 text-gray-400 hover:text-[#00E096] hover:bg-[#00E096]/10 rounded-lg transition-colors" 
                      title="Abrir Chat"
                    >
                      <MessageSquare class="w-4 h-4" />
                    </button>
                    <button class="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors" title="Travar/Destravar">
                      <Lock class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer / Pagination -->
        <div class="p-4 border-t border-[#1F1F1F] bg-[#151515] flex justify-between items-center">
          <p class="text-xs text-[#9CA3AF]">Mostrando <span class="text-white font-bold">1-{{ leads.length }}</span> de {{ metrics.total }} clientes</p>
          
          <div class="flex gap-2">
            <button disabled class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2A2A2A] text-gray-500 text-xs font-bold border border-[#333] opacity-50 cursor-not-allowed">
              <ChevronLeft class="w-3 h-3" /> Anterior
            </button>
            <button disabled class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2A2A2A] text-gray-500 text-xs font-bold border border-[#333] opacity-50 cursor-not-allowed">
              Próxima <ChevronRight class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Lead Details Modal (Outside main container) -->
  <LeadDetailsModal
    :model-value="showModal"
    @update:model-value="showModal = $event"
    :lead="selectedLead"
    @update-status="handleStatusUpdate"
    @save-notes="handleNotesUpdate"
  />
</template>
