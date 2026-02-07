<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessageSquare, Phone, Search, FileText } from 'lucide-vue-next'

// Mock chat data
const chats = ref([
  {
    id: '1',
    name: 'William',
    phone: '5561955432398',
    lastMessage: 'Obrigado pelo atendimento!',
    timestamp: '10:30',
    unread: 0,
    avatar: 'W'
  },
  {
    id: '2',
    name: 'Caroline Couto Popolín',
    phone: '5561944695678',
    lastMessage: 'Quando posso agendar?',
    timestamp: '09:15',
    unread: 2,
    avatar: 'C'
  },
  {
    id: '3',
    name: 'Matheus Ferreira',
    phone: '5561939463414',
    lastMessage: 'Perfeito, vou aguardar',
    timestamp: 'Ontem',
    unread: 0,
    avatar: 'M'
  },
  {
    id: '4',
    name: 'Ashley Ferreira',
    phone: '5561932292492',
    lastMessage: 'Qual o valor?',
    timestamp: 'Ontem',
    unread: 1,
    avatar: 'A'
  }
])

const selectedChat = ref(chats.value[0])
const searchQuery = ref('')

// Mock messages for selected chat
const messages = ref([
  {
    id: '1',
    sender: 'user',
    text: 'Olá! Gostaria de saber mais sobre os serviços.',
    timestamp: '10:25'
  },
  {
    id: '2',
    sender: 'me',
    text: 'Olá! Claro, temos diversos serviços disponíveis. Qual seria seu interesse?',
    timestamp: '10:26'
  },
  {
    id: '3',
    sender: 'user',
    text: 'Estou interessado em consultoria.',
    timestamp: '10:28'
  },
  {
    id: '4',
    sender: 'me',
    text: 'Ótimo! Vou te enviar mais informações.',
    timestamp: '10:29'
  },
  {
    id: '5',
    sender: 'user',
    text: 'Obrigado pelo atendimento!',
    timestamp: '10:30'
  }
])

const selectChat = (chat: any) => {
  selectedChat.value = chat
}

// On mount, check for clientId query parameter
onMounted(() => {
  const route = useRoute()
  const clientId = route.query.clientId as string
  
  if (clientId) {
    // Find chat by client ID (matching against phone number or ID)
    const chat = chats.value.find(c => c.id === clientId || c.phone === clientId)
    if (chat) {
      selectChat(chat)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary-500 selection:text-black">
    <Sidebar />

    <main class="ml-64 h-screen flex flex-col">
      <!-- Header -->
      <header class="px-8 py-6 border-b border-[#1F1F1F]">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-[#00E096]/10 rounded-xl text-[#00E096]">
            <MessageSquare class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">Chats</h1>
            <p class="text-[#9CA3AF] text-sm mt-1">Visualização de conversas</p>
          </div>
        </div>
      </header>

      <!-- Chat Container -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- Chat List Sidebar -->
        <div class="w-96 border-r border-[#1F1F1F] flex flex-col bg-[#0A0A0A]">
          
          <!-- Search -->
          <div class="p-4 border-b border-[#1F1F1F]">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar conversas..."
                class="w-full bg-[#050505] border border-[#1F1F1F] text-white placeholder-gray-500 rounded-lg pl-14 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00E096]/50 focus:border-[#00E096]/50 transition-all"
              />
            </div>
          </div>

          <!-- Chat List -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="chat in chats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="[
                'p-4 border-b border-[#1F1F1F] cursor-pointer transition-all hover:bg-[#121212]',
                selectedChat.id === chat.id ? 'bg-[#121212] border-l-2 border-l-[#00E096]' : ''
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold text-lg flex-shrink-0 overflow-hidden">
                  {{ chat.avatar }}
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="font-bold text-white text-sm truncate">{{ chat.name }}</h3>
                    <span class="text-xs text-[#9CA3AF]">{{ chat.timestamp }}</span>
                  </div>
                  <p class="text-sm text-[#9CA3AF] truncate">{{ chat.lastMessage }}</p>
                </div>

                <!-- Unread Badge -->
                <div v-if="chat.unread > 0" class="w-5 h-5 rounded-full bg-[#00E096] flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                  {{ chat.unread }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Display Area -->
        <div class="flex-1 flex flex-col bg-[#050505]">
          
          <!-- Chat Header -->
          <div class="px-6 py-4 border-b border-[#1F1F1F] bg-[#0A0A0A]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E096] to-[#00B87A] flex items-center justify-center text-black font-bold overflow-hidden">
                {{ selectedChat.avatar }}
              </div>
              <div>
                <h2 class="font-bold text-white">{{ selectedChat.name }}</h2>
                <div class="flex items-center gap-2 text-sm text-[#9CA3AF]">
                  <Phone class="w-3 h-3" />
                  <span>{{ selectedChat.phone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'flex',
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-md px-4 py-3 rounded-2xl',
                  message.sender === 'me' 
                    ? 'bg-[#00E096] text-black rounded-br-none' 
                    : 'bg-[#1F1F1F] text-white rounded-bl-none'
                ]"
              >
                <p class="text-sm">{{ message.text }}</p>
                <span 
                  :class="[
                    'text-xs mt-1 block',
                    message.sender === 'me' ? 'text-black/70' : 'text-gray-400'
                  ]"
                >
                  {{ message.timestamp }}
                </span>
              </div>
            </div>
          </div>

          <!-- Generate Summary Button -->
          <div class="px-6 py-4 border-t border-[#1F1F1F] bg-[#0A0A0A]">
            <button class="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#00E096] text-black rounded-lg text-sm font-bold hover:bg-[#00B87A] transition-all">
              <FileText class="w-5 h-5" />
              Gerar Resumo
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
