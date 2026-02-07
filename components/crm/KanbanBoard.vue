<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { MoreHorizontal, Phone, Lock, Bot, Eye } from 'lucide-vue-next'
import type { Cliente, CrmStatus } from '@/types/crm'

const props = defineProps<{
  leads: Cliente[]
}>()

const emit = defineEmits<{
  (e: 'update-status', id: string, newStatus: CrmStatus): void
  (e: 'view-details', lead: Cliente): void
}>()

// Columns Configuration
const columnsConfig = [
  { key: 'novo' as CrmStatus, label: 'Novo', color: 'bg-blue-500', dot: 'bg-blue-500' },
  { key: 'em_contato' as CrmStatus, label: 'Em Contato', color: 'bg-yellow-500', dot: 'bg-yellow-500' },
  { key: 'qualificado' as CrmStatus, label: 'Qualificado', color: 'bg-purple-500', dot: 'bg-purple-500' },
  { key: 'convertido' as CrmStatus, label: 'Convertido', color: 'bg-green-500', dot: 'bg-green-500' },
  { key: 'perdido' as CrmStatus, label: 'Perdido', color: 'bg-red-500', dot: 'bg-red-500' }
]

// Create a computed property for each column to handle drag & drop
const columnsData = computed(() => {
  const map: Record<string, any> = {}
  columnsConfig.forEach(col => {
    map[col.key] = computed({
      get: () => {
        // Force null/empty status_crm into 'novo' column
        if (col.key === 'novo') {
          return props.leads.filter(l => !l.status_crm || l.status_crm === '' || l.status_crm === 'novo')
        }
        return props.leads.filter(l => l.status_crm === col.key)
      },
      set: (newVal: Cliente[]) => {
        // Identify the item that doesn't belong to this column yet (status mismatch)
        const movedLead = newVal.find(l => l.status_crm !== col.key)
        if (movedLead) {
           emit('update-status', movedLead.id, col.key)
        }
      }
    })
  })
  return map
})
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)]">
    <div 
      v-for="col in columnsConfig" 
      :key="col.key" 
      class="min-w-[300px] w-[300px] flex flex-col bg-[#050505]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 px-2">
        <div class="flex items-center gap-2">
          <div :class="['w-2 h-2 rounded-full', col.dot]"></div>
          <span class="text-sm font-bold text-gray-200 uppercase tracking-wide">{{ col.label }}</span>
          <span class="bg-[#18181B] text-[#9CA3AF] text-xs font-bold px-2 py-0.5 rounded-full border border-[#27272A]">
            {{ columnsData[col.key].value.length }}
          </span>
        </div>
      </div>

      <!-- Draggable Area -->
      <VueDraggable
        v-model="columnsData[col.key].value"
        :group="{ name: 'crm-leads' }"
        :animation="200"
        ghost-class="ghost-card"
        class="flex-1 flex flex-col gap-3 min-h-[100px] p-1"
      >
        <div 
          v-for="lead in columnsData[col.key].value"
          :key="lead.id" 
          class="bg-[#18181B] border border-[#27272A] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-gray-700 transition-colors group shadow-sm flex flex-col gap-3"
        >
          <!-- Header: Avatar + Name -->
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white border border-gray-600 shadow-md">
              {{ (lead.nome || 'D').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
               <span class="font-bold text-white text-sm block truncate">{{ lead.nome || 'Desconhecido' }}</span>
            </div>
            <button 
              @click="emit('view-details', lead)"
              class="p-1.5 text-[#9CA3AF] hover:text-[#00E096] hover:bg-[#00E096]/10 rounded-lg transition-all"
              title="Ver Detalhes"
            >
              <Eye class="w-4 h-4" />
            </button>
          </div>

          <!-- Body: Phone -->
          <div class="flex items-center gap-2 text-[#9CA3AF] text-xs bg-[#121212] p-2 rounded-lg border border-[#27272A]">
             <Phone class="w-3 h-3" />
             <span class="font-mono">{{ lead.whatsapp_id }}</span>
          </div>

          <!-- Footer: Badges -->
          <div class="flex items-center justify-between mt-1">
             <!-- Interest Badge -->
            <span 
              v-if="lead.qualificado" 
              class="text-[10px] font-bold px-2 py-1 rounded-full bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20"
            >
              Interesse: Sim
            </span>
            <span 
              v-else 
              class="text-[10px] font-bold px-2 py-1 rounded-full bg-[#27272A] text-gray-500 border border-[#3F3F46]"
            >
               Não
            </span>

            <!-- Mode Icon -->
             <div v-if="lead.trava" class="text-orange-500" title="Modo Manual (Humano)">
                <Lock class="w-4 h-4" />
             </div>
             <div v-else class="text-[#00E096]" title="Modo Automático (IA)">
                <Bot class="w-4 h-4" />
             </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="columnsData[col.key].value.length === 0" class="flex-1 flex items-center justify-center border-2 border-dashed border-[#18181B] rounded-xl m-1 min-h-[100px]">
          <span class="text-[#9CA3AF] text-xs font-medium opacity-50">Vazio</span>
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<style scoped>
.ghost-card {
  opacity: 0.4;
  background: #18181B;
  border: 1px dashed #52525B;
}
</style>
