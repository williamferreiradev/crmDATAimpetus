<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-vue-next'

// Mock metrics data
const metrics = ref([
  {
    title: 'Total de Leads',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Taxa de Conversão',
    value: '34.5%',
    change: '+5.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-[#00E096]',
    bgColor: 'bg-[#00E096]/10'
  },
  {
    title: 'Receita Total',
    value: 'R$ 45.2K',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    title: 'Ticket Médio',
    value: 'R$ 1.8K',
    change: '-2.1%',
    trend: 'down',
    icon: BarChart3,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
])

const selectedPeriod = ref('30d')
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
    <Sidebar />

    <main class="ml-64 p-8">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-[#00E096]/10 rounded-xl text-[#00E096]">
              <BarChart3 class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Relatórios</h1>
              <p class="text-[#9CA3AF] text-sm mt-1">Análise de performance e métricas</p>
            </div>
          </div>

          <!-- Period Selector & Export -->
          <div class="flex items-center gap-3">
            <select
              v-model="selectedPeriod"
              class="bg-[#121212] border border-[#27272A] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E096]/50"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>

            <button class="flex items-center gap-2 px-4 py-2.5 bg-[#00E096] text-black rounded-lg text-sm font-bold hover:bg-[#00B87A] transition-all">
              <Download class="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </header>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div
          v-for="metric in metrics"
          :key="metric.title"
          class="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 hover:border-[#27272A] transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="['p-3 rounded-xl', metric.bgColor]">
              <component :is="metric.icon" :class="['w-6 h-6', metric.color]" />
            </div>
            <span
              :class="[
                'text-xs font-bold px-2 py-1 rounded-full',
                metric.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              ]"
            >
              {{ metric.change }}
            </span>
          </div>
          <h3 class="text-[#9CA3AF] text-sm mb-2">{{ metric.title }}</h3>
          <p class="text-3xl font-bold text-white">{{ metric.value }}</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-2 gap-6 mb-8">
        
        <!-- Chart 1: Performance ao Longo do Tempo -->
        <div class="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-white">Performance ao Longo do Tempo</h2>
            <Calendar class="w-5 h-5 text-[#9CA3AF]" />
          </div>
          
          <!-- Chart Placeholder -->
          <div class="h-64 bg-[#050505] border border-[#1F1F1F] rounded-xl flex items-center justify-center">
            <div class="text-center">
              <BarChart3 class="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p class="text-[#9CA3AF] text-sm">Gráfico de linhas</p>
              <p class="text-[#9CA3AF] text-xs mt-1">Visualização em desenvolvimento</p>
            </div>
          </div>
        </div>

        <!-- Chart 2: Distribuição por Status -->
        <div class="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-white">Distribuição por Status</h2>
            <TrendingUp class="w-5 h-5 text-[#9CA3AF]" />
          </div>
          
          <!-- Chart Placeholder -->
          <div class="h-64 bg-[#050505] border border-[#1F1F1F] rounded-xl flex items-center justify-center">
            <div class="text-center">
              <BarChart3 class="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
              <p class="text-[#9CA3AF] text-sm">Gráfico de pizza</p>
              <p class="text-[#9CA3AF] text-xs mt-1">Visualização em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Table: Top Performers -->
      <div class="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-[#1F1F1F]">
          <h2 class="text-lg font-bold text-white">Top Leads Convertidos</h2>
        </div>

        <!-- Table Header -->
        <div class="px-6 py-3 bg-[#050505] border-b border-[#1F1F1F] grid grid-cols-12 gap-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
          <div class="col-span-4">Cliente</div>
          <div class="col-span-3">Produto</div>
          <div class="col-span-2">Data</div>
          <div class="col-span-3 text-right">Valor</div>
        </div>

        <!-- Table Rows -->
        <div class="divide-y divide-[#1F1F1F]">
          <div class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#121212] transition-all">
            <div class="col-span-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold">
                W
              </div>
              <span class="text-white font-medium">William</span>
            </div>
            <div class="col-span-3 text-[#9CA3AF]">Consultoria Premium</div>
            <div class="col-span-2 text-[#9CA3AF]">05/02/2026</div>
            <div class="col-span-3 text-right text-[#00E096] font-bold">R$ 3.500,00</div>
          </div>

          <div class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#121212] transition-all">
            <div class="col-span-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold">
                C
              </div>
              <span class="text-white font-medium">Caroline Couto Popolín</span>
            </div>
            <div class="col-span-3 text-[#9CA3AF]">Plano Básico</div>
            <div class="col-span-2 text-[#9CA3AF]">04/02/2026</div>
            <div class="col-span-3 text-right text-[#00E096] font-bold">R$ 1.200,00</div>
          </div>

          <div class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#121212] transition-all">
            <div class="col-span-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold">
                M
              </div>
              <span class="text-white font-medium">Matheus Ferreira</span>
            </div>
            <div class="col-span-3 text-[#9CA3AF]">Consultoria Avançada</div>
            <div class="col-span-2 text-[#9CA3AF]">03/02/2026</div>
            <div class="col-span-3 text-right text-[#00E096] font-bold">R$ 2.800,00</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
