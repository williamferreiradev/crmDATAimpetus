<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { User, Phone, Search } from 'lucide-vue-next'
import LeadDetailsModal from '@/components/leads/LeadDetailsModal.vue'
import type { Cliente } from '@/types/crm'

const supabase = useSupabaseClient()

// State
const contacts = ref<Cliente[]>([])
const loading = ref(true)
const searchQuery = ref('')
const showModal = ref(false)
const selectedContact = ref<Cliente | null>(null)

// Fetch contacts
const fetchContacts = async () => {
  loading.value = true
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching contacts:', error)
  } else {
    contacts.value = (data as Cliente[]) || []
  }
  
  loading.value = false
}

// Filtered contacts based on search
const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) {
    return contacts.value
  }

  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact => 
    (contact.nome?.toLowerCase().includes(query)) ||
    (contact.whatsapp_id?.toLowerCase().includes(query))
  )
})

// Open modal
const openContactDetails = (contact: Cliente) => {
  selectedContact.value = contact
  showModal.value = true
}

// Handle status update from modal
const handleStatusUpdate = async (id: string, newStatus: string) => {
  const contact = contacts.value.find(c => c.id === id)
  if (contact) {
    contact.status_crm = newStatus as any
  }
}

// Handle notes update from modal
const handleNotesUpdate = async (id: string, notes: string) => {
  const contact = contacts.value.find(c => c.id === id)
  if (contact && contact.metadata) {
    contact.metadata.notes = notes
  }
}

onMounted(() => {
  fetchContacts()
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
    <Sidebar />

    <main class="ml-64 p-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-white">Contatos</h1>
        <p class="text-[#9CA3AF] text-sm mt-1">Lista de todos os contatos com filtros</p>
      </header>

      <!-- Main Card -->
      <div class="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F] overflow-hidden">
        
        <!-- Card Header with Icon and Count -->
        <div class="px-6 py-4 border-b border-[#1F1F1F] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-[#00E096]/10 rounded-lg">
              <User class="w-5 h-5 text-[#00E096]" />
            </div>
            <h2 class="text-lg font-bold text-white">Contatos</h2>
          </div>
          <span class="bg-[#1F1F1F] text-white text-xs font-bold px-3 py-1.5 rounded-full border border-[#2A2A2A]">
            {{ filteredContacts.length }} de {{ contacts.length }}
          </span>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 bg-[#0D0D0D] border-b border-[#1F1F1F]">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome ou telefone..."
              class="w-full bg-[#050505] border border-[#1F1F1F] text-white placeholder-gray-500 rounded-lg pl-14 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E096]/50 focus:border-[#00E096]/50 transition-all"
            />
          </div>
        </div>

        <!-- Table Header -->
        <div class="px-6 py-3 bg-[#0A0A0A] border-b border-[#1F1F1F] grid grid-cols-12 gap-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
          <div class="col-span-8">Nome</div>
          <div class="col-span-4 text-right">Interessado</div>
        </div>

        <!-- Contact List -->
        <div class="divide-y divide-[#1F1F1F]">
          <!-- Loading State -->
          <div v-if="loading" class="p-12 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E096]"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredContacts.length === 0" class="p-12 text-center">
            <p class="text-[#9CA3AF]">Nenhum contato encontrado</p>
          </div>

          <!-- Contact Rows -->
          <div
            v-else
            v-for="contact in filteredContacts"
            :key="contact.id"
            @click="openContactDetails(contact)"
            class="px-6 py-4 bg-[#0A0A0A] hover:bg-[#121212] cursor-pointer transition-all group grid grid-cols-12 gap-4 items-center"
          >
            <!-- Left: Avatar + Name + Phone -->
            <div class="col-span-8 flex items-center gap-4">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                {{ (contact.nome || 'D').charAt(0).toUpperCase() }}
              </div>

              <!-- Info -->
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-white text-base truncate">
                  {{ contact.nome || 'Desconhecido' }}
                </h3>
                <div class="flex items-center gap-2 text-sm text-[#9CA3AF] mt-0.5">
                  <Phone class="w-3 h-3" />
                  <span>{{ contact.whatsapp_id }}</span>
                </div>
              </div>
            </div>

            <!-- Right: Status Badges -->
            <div class="col-span-4 flex items-center justify-end gap-2">
              <!-- Interesse Badge -->
              <span
                v-if="contact.qualificado"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20"
              >
                Sim
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#1F1F1F] text-gray-400 border border-[#2A2A2A]"
              >
                Não
              </span>

              <!-- Travado Badge -->
              <span
                v-if="contact.trava"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20"
              >
                Travado
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Lead Details Modal -->
  <LeadDetailsModal
    :model-value="showModal"
    @update:model-value="showModal = $event"
    :lead="selectedContact"
    @update-status="handleStatusUpdate"
    @save-notes="handleNotesUpdate"
  />
</template>
