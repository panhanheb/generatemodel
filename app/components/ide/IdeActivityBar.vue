<script setup lang="ts">
import { computed } from 'vue'
import {
  Files,
  SlidersHorizontal,
  Search,
  Layers,
  Globe,
  BookOpen,
  Keyboard
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  activeTab: string
  isSidebarOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'selectTab', tab: string): void
  (e: 'toggleShortcuts'): void
}>()

const route = useRoute()
const router = useRouter()

const isDocActive = computed(() => route.path === '/docs')
const isLangActive = computed(() => route.path === '/languages')

const handleTabClick = (tab: string) => {
  if (route.path !== '/') {
    router.push('/')
  }
  emit('selectTab', tab)
}
</script>

<template>
  <nav
    class="shrink-0 z-30 select-none flex md:flex-col justify-between items-center px-2 py-2 md:py-3 md:w-16 glass-panel rounded-3xl mx-2 mb-2 md:mb-3 md:mt-1 border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
    aria-label="Activity Rail"
  >
    <!-- Top Action Items (Desktop) / Left Items (Mobile) -->
    <div class="flex md:flex-col items-center gap-2 w-full justify-around md:justify-start">
      <!-- Explorer Tab -->
      <button
        @click="handleTabClick('explorer')"
        title="Explorer (Workspace)"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer relative"
        :class="activeTab === 'explorer' && isSidebarOpen && route.path === '/'
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <Files class="w-4 h-4" />
        <span
          v-if="activeTab === 'explorer' && isSidebarOpen && route.path === '/'"
          class="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0A84FF] hidden md:block"
        ></span>
      </button>

      <!-- Options / Configuration Tab -->
      <button
        @click="handleTabClick('config')"
        title="Configuration & Required Fields"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer relative"
        :class="activeTab === 'config' && isSidebarOpen && route.path === '/'
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <SlidersHorizontal class="w-4 h-4" />
        <span
          v-if="activeTab === 'config' && isSidebarOpen && route.path === '/'"
          class="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0A84FF] hidden md:block"
        ></span>
      </button>

      <!-- Search in Models / Samples -->
      <button
        @click="handleTabClick('search')"
        title="Search & Filters"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer relative"
        :class="activeTab === 'search' && isSidebarOpen && route.path === '/'
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <Search class="w-4 h-4" />
        <span
          v-if="activeTab === 'search' && isSidebarOpen && route.path === '/'"
          class="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0A84FF] hidden md:block"
        ></span>
      </button>

      <!-- Samples Library Tab -->
      <button
        @click="handleTabClick('samples')"
        title="Sample Payloads"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer relative"
        :class="activeTab === 'samples' && isSidebarOpen && route.path === '/'
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <Layers class="w-4 h-4" />
        <span
          v-if="activeTab === 'samples' && isSidebarOpen && route.path === '/'"
          class="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0A84FF] hidden md:block"
        ></span>
      </button>
    </div>

    <!-- Bottom Action Items -->
    <div class="flex md:flex-col items-center gap-2">
      <!-- Languages Catalog Link -->
      <NuxtLink
        to="/languages"
        title="Supported Languages (24+)"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer"
        :class="isLangActive
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <Globe class="w-4 h-4" />
      </NuxtLink>

      <!-- Documentation Link -->
      <NuxtLink
        to="/docs"
        title="Documentation & Guide"
        class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer"
        :class="isDocActive
          ? 'bg-blue-500/25 text-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.4)] border border-blue-400/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'"
      >
        <BookOpen class="w-4 h-4" />
      </NuxtLink>

      <!-- Shortcuts Dialog -->
      <button
        @click="emit('toggleShortcuts')"
        title="Keyboard Shortcuts"
        class="w-10 h-10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 cursor-pointer hidden md:flex"
      >
        <Keyboard class="w-4 h-4" />
      </button>
    </div>
  </nav>
</template>
