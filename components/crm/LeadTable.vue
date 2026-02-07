<script setup lang="ts">
import { Eye, MessageCircle, Lock, Bot } from 'lucide-vue-next'
import type { Cliente, CrmStatus } from '@/types/crm'

defineProps<{
  leads: Cliente[]
}>()

const emit = defineEmits<{
  (e: 'view-details', lead: Cliente): void
}>()

const statusConfig: Record<CrmStatus, { label: string; dot: string }> = {
  novo: { label: 'Novo', dot: 'bg-blue-500' },
  em_contato: { label: 'Em Contato', dot: 'bg-yellow-500' },
  qualificado: { label: 'Qualificado', dot: 'bg-purple-500' },
  convertido: { label: 'Convertido', dot: 'bg-green-500' },
  perdido: { label: 'Perdido', dot: 'bg-red-500' },
}
</script>

<template>
  <div class="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl h-full flex flex-col">
    <div class="overflow-y-auto flex-1">
      <table class="w-full text-left border-collapse">
        <thead class="sticky top-0 z-10">
          <tr class="border-b border-[#27272A] text-[#9CA3AF] text-xs uppercase tracking-wider bg-[#18181B]">
            <th class="p-4 font-semibold">Nome</th>
            <th class="p-4 font-semibold">Telefone</th>
            <th class="p-4 font-semibold">Status (CRM)</th>
            <th class="p-4 font-semibold">Interesse</th>
            <th class="p-4 font-semibold">Modo</th>
            <th class="p-4 font-semibold text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#27272A]">
          <tr v-for="lead in leads" :key="lead.id" class="group hover:bg-[#1A1A1A] transition-colors">
            <!-- Nome -->
            <td class="p-4">
              <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold text-white border border-gray-600 shadow-lg">
                    {{ (lead.nome || 'D').charAt(0).toUpperCase() }}
                 </div>
                 <span class="font-medium text-white">{{ lead.nome || 'Desconhecido' }}</span>
              </div>
            </td>

            <!-- Telefone -->
            <td class="p-4">
               <span class="text-[#9CA3AF] text-sm font-mono">{{ lead.whatsapp_id }}</span>
            </td>

            <!-- Status -->
            <td class="p-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#18181B] border border-[#27272A]">
                <div :class="['w-2 h-2 rounded-full', statusConfig[lead.status_crm as CrmStatus]?.dot || 'bg-gray-500']"></div>
                <span class="text-white">{{ statusConfig[lead.status_crm as CrmStatus]?.label || lead.status_crm || 'Novo' }}</span>
              </div>
            </td>

            <!-- Interesse -->
            <td class="p-4">
              <span v-if="lead.qualificado" class="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20">
                Sim
              </span>
              <span v-else class="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-[#27272A] text-gray-400 border border-[#3F3F46]">
                Não
              </span>
            </td>

             <!-- Modo -->
            <td class="p-4 text-sm">
               <span v-if="lead.trava" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  <Lock class="w-3 h-3" /> Manual
               </span>
               <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20">
                  <Bot class="w-3 h-3" /> Auto
               </span>
            </td>

            <!-- Ações -->
            <td class="p-4 text-right">
               <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                 <button class="p-2 text-gray-400 hover:text-[#00E096] hover:bg-[#00E096]/10 rounded-lg transition-all" title="Abrir Chat">
                   <MessageCircle class="w-4 h-4" />
                 </button>
                 <button 
                   @click="emit('view-details', lead)"
                   class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" 
                   title="Ver Detalhes"
                 >
                   <Eye class="w-4 h-4" />
                 </button>
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
