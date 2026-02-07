<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { User, Phone, Calendar, Package, X } from 'lucide-vue-next'
import type { Cliente } from '@/types/crm'

const props = defineProps<{
  modelValue: boolean
  lead: Cliente | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update-status', id: string, status: string): void
  (e: 'save-notes', id: string, notes: string): void
}>()

const supabase = useSupabaseClient()
const localNotes = ref('')
const localStatus = ref('')

// Sync state when lead changes
watch(() => props.lead, (newLead) => {
  if (newLead) {
    localNotes.value = newLead.metadata?.notes || ''
    localStatus.value = newLead.status_crm || 'novo'
  }
}, { immediate: true })

const statusOptions = [
  { label: 'Novo', value: 'novo', color: 'bg-blue-500' },
  { label: 'Em Contato', value: 'em_contato', color: 'bg-yellow-500' },
  { label: 'Qualificado', value: 'qualificado', color: 'bg-purple-500' },
  { label: 'Convertido', value: 'convertido', color: 'bg-green-500' },
  { label: 'Perdido', value: 'perdido', color: 'bg-red-500' }
]

const currentStatusColor = computed(() => {
  const status = statusOptions.find(s => s.value === localStatus.value)
  return status ? status.color : 'bg-gray-500'
})

const close = () => emit('update:modelValue', false)

const handleStatusChange = async (event: Event) => {
  const newStatus = (event.target as HTMLSelectElement).value
  if (!props.lead) return
  localStatus.value = newStatus
  emit('update-status', props.lead.id, newStatus)
  
  // Auto-save to database
  const { error } = await supabase
    .from('clientes')
    .update({ status_crm: newStatus })
    .eq('id', props.lead.id)
    
  if (error) console.error('Error updating status:', error)
}

const handleSaveNotes = async () => {
  if (!props.lead) return
  
  const currentNotes = props.lead.metadata?.notes || ''
  if (localNotes.value !== currentNotes) {
    emit('save-notes', props.lead.id, localNotes.value)
    
    // Auto-save to database
    const { error } = await supabase
      .from('clientes')
      .update({ 
        metadata: { 
          ...props.lead.metadata, 
          notes: localNotes.value 
        } 
      })
      .eq('id', props.lead.id)
      
    if (error) console.error('Error saving notes:', error)
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Desconhecido'
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <!-- Teleport to body for true popup behavior -->
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="modelValue && lead" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <!-- Modal Card -->
        <div class="relative bg-[#121212] border border-[#27272A] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-[#27272A] sticky top-0 bg-[#121212] z-10">
            <div class="flex items-center gap-3">
              <User class="w-5 h-5 text-[#00E096]" />
              <h2 class="text-xl font-bold text-white">Detalhes do Lead</h2>
            </div>
            <button 
              @click="close" 
              class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6">
            
            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-6">
              
              <!-- Nome -->
              <div class="space-y-1">
                <span class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Nome</span>
                <p class="text-2xl font-bold text-white">{{ lead.nome || 'Desconhecido' }}</p>
              </div>

              <!-- Telefone -->
              <div class="space-y-1">
                <span class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Telefone</span>
                <div class="flex items-center gap-2 text-lg text-white">
                  <Phone class="w-4 h-4 text-[#00E096]" />
                  <span>{{ lead.whatsapp_id }}</span>
                </div>
              </div>

              <!-- Data de Cadastro -->
              <div class="space-y-1">
                <span class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Cadastrado em</span>
                <div class="flex items-center gap-2 text-white">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <span>{{ formatDate(lead.created_at) }}</span>
                </div>
              </div>

              <!-- Interesse -->
              <div class="space-y-1">
                <span class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Interessado</span>
                <div>
                  <span 
                    v-if="lead.qualificado" 
                    class="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20"
                  >
                    Sim
                  </span>
                  <span 
                    v-else 
                    class="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#27272A] text-gray-400 border border-[#3F3F46]"
                  >
                    Não
                  </span>
                </div>
              </div>

              <!-- Produto -->
              <div class="col-span-2 space-y-1">
                <span class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Produto de Interesse</span>
                <div class="flex items-center gap-2 text-white">
                  <Package class="w-4 h-4 text-[#00E096]" />
                  <span>{{ lead.metadata?.produto_interesse || 'Não informado' }}</span>
                </div>
              </div>

            </div>

            <!-- Divider -->
            <div class="h-px bg-[#27272A]"></div>

            <!-- Actions -->
            <div class="space-y-4">
              
              <!-- Status Selector -->
              <div class="space-y-2">
                <label class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Status CRM</label>
                <div class="relative">
                  <select
                    v-model="localStatus"
                    @change="handleStatusChange"
                    class="w-full bg-[#050505] border border-[#27272A] text-white rounded-lg px-4 py-3 pl-8 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00E096]/50"
                  >
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span :class="['w-2 h-2 rounded-full inline-block', currentStatusColor]"></span>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="space-y-2">
                <label class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">Notas</label>
                <textarea
                  v-model="localNotes"
                  placeholder="Adicione observações sobre este lead..."
                  rows="4"
                  @blur="handleSaveNotes"
                  class="w-full bg-[#050505] border border-[#27272A] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00E096]/50 resize-none"
                ></textarea>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-[#27272A] text-xs text-[#9CA3AF] bg-[#0A0A0A]">
            <span>Follow-ups: {{ lead.metadata?.followups || 0 }} tentativas</span>
            <span>Último: {{ formatDate(lead.metadata?.last_followup) }}</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
