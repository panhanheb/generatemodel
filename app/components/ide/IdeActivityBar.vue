<script setup lang="ts">
import { Files, SlidersHorizontal, BookOpen, Layers, Settings, Keyboard, Sparkles, FolderGit2 } from 'lucide-vue-next'

import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  activeTab: string
  isSidebarOpen: boolean
}>()

const emit = defineEmits(['selectTab', 'toggleSettings', 'toggleShortcuts'])

const route = useRoute()
const router = useRouter()

const isDocActive = computed(() => route.path === '/languages' || route.path === '/docs')

const handleTabClick = (tab: string) => {
  if (route.path !== '/') {
    router.push('/')
  }
  emit('selectTab', tab)
}
</script>

<template>
  <div class="glass-activity-bar w-12 flex flex-col justify-between items-center py-2 shrink-0 z-20 select-none">
    <!-- Top Action Icons -->
    <div class="flex flex-col items-center gap-1 w-full">
      <!-- Explorer Tab -->
      <button
        @click="handleTabClick('explorer')"
        title="Explorer (Ctrl+Shift+E)"
        class="relative w-full h-11 flex items-center justify-center transition-all cursor-pointer group hover:bg-white/5"
        :class="activeTab === 'explorer' && isSidebarOpen && !isDocActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'"
      >
        <div
          v-if="activeTab === 'explorer' && isSidebarOpen && !isDocActive"
          class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        ></div>
        <Files class="w-5 h-5" />
      </button>

      <!-- Target Configuration / Styles Tab -->
      <button
        @click="handleTabClick('config')"
        title="Target Language & Model Configuration"
        class="relative w-full h-11 flex items-center justify-center transition-all cursor-pointer group hover:bg-white/5"
        :class="activeTab === 'config' && isSidebarOpen && !isDocActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'"
      >
        <div
          v-if="activeTab === 'config' && isSidebarOpen && !isDocActive"
          class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        ></div>
        <SlidersHorizontal class="w-5 h-5" />
      </button>

      <!-- Samples & Templates Tab -->
      <button
        @click="handleTabClick('samples')"
        title="JSON Samples Library"
        class="relative w-full h-11 flex items-center justify-center transition-all cursor-pointer group hover:bg-white/5"
        :class="activeTab === 'samples' && isSidebarOpen && !isDocActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'"
      >
        <div
          v-if="activeTab === 'samples' && isSidebarOpen && !isDocActive"
          class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        ></div>
        <Layers class="w-5 h-5" />
      </button>

      <!-- Documentation / Languages -->
      <NuxtLink
        to="/languages"
        title="Supported Languages & Documentation"
        class="relative w-full h-11 flex items-center justify-center transition-all cursor-pointer group hover:bg-white/5"
        :class="isDocActive ? 'text-white' : 'text-[#858585] hover:text-[#cccccc]'"
      >
        <div
          v-if="isDocActive"
          class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
        ></div>
        <BookOpen class="w-5 h-5" />
      </NuxtLink>
    </div>

    <!-- Bottom Action Icons -->
    <div class="flex flex-col items-center gap-1 w-full">
      <!-- Shortcuts Dialog Trigger -->
      <button
        @click="emit('toggleShortcuts')"
        title="Keyboard Shortcuts (Ctrl+K Ctrl+S)"
        class="w-full h-11 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer"
      >
        <Keyboard class="w-5 h-5" />
      </button>

      <!-- Settings -->
      <button
        @click="handleTabClick('config')"
        title="Generator Settings"
        class="w-full h-11 flex items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer"
      >
        <Settings class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
