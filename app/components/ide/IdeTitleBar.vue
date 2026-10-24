<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Sparkles, Code2, Search, Split, Github, Sun, Moon, Check, ChevronDown } from 'lucide-vue-next'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore } from '~/stores/generator.store'
import { useThemeStore } from '~/stores/theme.store'
import { useToast } from '~/composables/useToast'
import { useShareLink } from '~/composables/useShareLink'
import { SITE } from '~/constants/site'

const emit = defineEmits(['generate', 'toggleSidebar'])

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()
const themeStore = useThemeStore()
const toast = useToast()
const { createShareUrl } = useShareLink()

const activeMenu = ref<string | null>(null)
const isCommandPaletteOpen = ref(false)

const menus = ['File', 'Edit', 'View', 'Help']

const toggleMenu = (menu: string) => {
  activeMenu.value = activeMenu.value === menu ? null : menu
}

const closeMenu = () => {
  activeMenu.value = null
}

const handleMenuHover = (menu: string) => {
  if (activeMenu.value) {
    activeMenu.value = menu
  }
}

const handleGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.ide-menu-container')) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})

const fileExtension = computed(() => {
  const lang = generatorStore.selectedLanguage
  switch (lang) {
    case 'flutter': return 'dart'
    case 'typescript': case 'nodejs': case 'nestjs': return 'ts'
    case 'javascript': return 'js'
    case 'java': case 'spring_boot': return 'java'
    case 'kotlin': return 'kt'
    case 'swift': return 'swift'
    case 'go': return 'go'
    case 'csharp': case 'asp_net': return 'cs'
    case 'php': case 'laravel': return 'php'
    case 'python': return 'py'
    case 'rust': return 'rs'
    default: return 'txt'
  }
})

const route = useRoute()

const centerTitle = computed(() => {
  if (route.path === '/languages') {
    return 'nn_panha_json_viewer — Supported Languages'
  }
  if (route.path === '/docs') {
    return 'nn_panha_json_viewer — Documentation'
  }
  return `nn_panha_json_viewer — ${generatorStore.rootClassName}.${fileExtension.value}`
})

const handleCopyShare = async () => {
  closeMenu()
  try {
    const { url } = await createShareUrl()
    await navigator.clipboard.writeText(url)
    toast.success('Share link copied to clipboard')
  } catch {
    toast.error('Could not copy share link')
  }
}
</script>

<template>
  <div class="glass-header h-8 text-[#cccccc] flex items-center justify-between px-2 text-xs select-none shrink-0 z-50">
    <!-- Left: App Icon + Menus -->
    <div class="flex items-center gap-1 ide-menu-container relative">
      <div class="flex items-center gap-1.5 px-1.5 py-1 text-sky-400 font-bold">
        <Code2 class="w-4 h-4 text-sky-400" />
      </div>

      <!-- Menu Items -->
      <div class="flex items-center">
        <div v-for="menu in menus" :key="menu" class="relative">
          <button
            @click.stop="toggleMenu(menu)"
            @mouseenter="handleMenuHover(menu)"
            class="px-2 py-0.5 rounded-sm hover:bg-white/10 transition-colors cursor-pointer text-xs"
            :class="activeMenu === menu ? 'bg-sky-500/30 text-white' : 'text-[#cccccc]'"
          >
            {{ menu }}
          </button>

          <!-- Dropdown Menus -->
          <div
            v-if="activeMenu === menu"
            class="absolute left-0 top-full mt-0.5 w-60 bg-[#161822]/90 backdrop-blur-2xl border border-white/15 rounded-lg shadow-2xl py-1 z-50 text-[#cccccc] text-xs font-normal"
          >
            <!-- File Menu -->
            <template v-if="menu === 'File'">
              <button @click="editorStore.clearJson(); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>New / Clear JSON</span>
                <span class="text-[#858585]">Ctrl+N</span>
              </button>
              <button @click="editorStore.formatJson(); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Format JSON</span>
                <span class="text-[#858585]">Ctrl+Shift+F</span>
              </button>
              <div class="my-1 border-t border-white/10"></div>
              <button @click="handleCopyShare" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Share Link...</span>
                <span class="text-[#858585]">Link</span>
              </button>
              <div class="my-1 border-t border-[#3c3c3c]"></div>
              <NuxtLink to="/languages" @click="closeMenu" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Supported Languages</span>
              </NuxtLink>
              <NuxtLink to="/docs" @click="closeMenu" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Documentation</span>
              </NuxtLink>
            </template>

            <!-- Edit Menu -->
            <template v-if="menu === 'Edit'">
              <button @click="editorStore.formatJson(); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Format Document (Beautify)</span>
                <span class="text-[#858585]">Ctrl+Shift+F</span>
              </button>
              <button @click="editorStore.minifyJson(); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Minify JSON</span>
              </button>
              <button @click="editorStore.validateJson(); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Validate Syntax</span>
              </button>
              <div class="my-1 border-t border-[#3c3c3c]"></div>
              <button @click="generatorStore.checkDefaultValue = !generatorStore.checkDefaultValue; closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between items-center cursor-pointer">
                <span>Check Default Null / 0</span>
                <Check v-if="generatorStore.checkDefaultValue" class="w-3.5 h-3.5 text-sky-400" />
              </button>
            </template>

            <!-- View Menu -->
            <template v-if="menu === 'View'">
              <button @click="emit('toggleSidebar'); closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Toggle Primary Sidebar</span>
                <span class="text-[#858585]">Ctrl+B</span>
              </button>
              <button @click="generatorStore.wordWrap = !generatorStore.wordWrap; closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between items-center cursor-pointer">
                <span>Toggle Word Wrap</span>
                <Check v-if="generatorStore.wordWrap" class="w-3.5 h-3.5 text-sky-400" />
              </button>
              <button @click="editorStore.isFullscreen = !editorStore.isFullscreen; closeMenu()" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Toggle Fullscreen</span>
                <span class="text-[#858585]">F11</span>
              </button>
            </template>

            <!-- Help Menu -->
            <template v-if="menu === 'Help'">
              <NuxtLink to="/docs" @click="closeMenu" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>Documentation</span>
              </NuxtLink>
              <a :href="SITE.githubUrl" target="_blank" @click="closeMenu" class="w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white flex justify-between cursor-pointer">
                <span>GitHub Repository</span>
              </a>
              <div class="my-1 border-t border-[#3c3c3c]"></div>
              <div class="px-3 py-1.5 text-[11px] text-[#858585]">
                {{ SITE.name }} v1.2.0
              </div>
            </template>

            <!-- Fallback for other menus -->
            <template v-if="!['File', 'Edit', 'View', 'Help'].includes(menu)">
              <div class="px-3 py-1.5 text-xs text-[#858585]">
                {{ menu }} commands available in Command Palette (Ctrl+Shift+P)
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Center: Search / Command Palette Bar -->
    <div class="flex-1 max-w-lg mx-4 flex items-center justify-center">
      <div
        @click="isCommandPaletteOpen = true"
        class="w-full max-w-md bg-white/5 hover:bg-white/10 border border-white/15 hover:border-sky-400/50 backdrop-blur-md rounded-md px-3 py-1 flex items-center justify-between text-xs text-[#9d9d9d] hover:text-[#cccccc] transition-colors cursor-pointer shadow-inner"
        title="Search files or run commands (Ctrl+P)"
      >
        <div class="flex items-center gap-2 truncate">
          <Search class="w-3.5 h-3.5 text-[#858585]" />
          <span class="truncate font-mono text-[11px]">{{ centerTitle }}</span>
        </div>
        <div class="flex items-center gap-1 text-[10px] text-[#858585] bg-white/10 px-1.5 py-0.5 rounded font-mono border border-white/10">
          Ctrl+P
        </div>
      </div>
    </div>

    <!-- Right: Quick Actions & Window Controls -->
    <div class="flex items-center gap-1.5">
      <!-- Generate Model Button -->
      <button
        @click="emit('generate')"
        class="bg-gradient-to-r from-sky-500/80 to-blue-600/80 hover:from-sky-500 hover:to-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 border border-white/20 backdrop-blur-md"
        title="Generate Model (Ctrl+Enter)"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Generate</span>
      </button>

      <!-- Split / Layout Button -->
      <button
        @click="emit('toggleSidebar')"
        title="Toggle Primary Sidebar (Ctrl+B)"
        class="p-1 rounded hover:bg-white/10 text-[#cccccc] cursor-pointer transition-colors"
      >
        <Split class="w-3.5 h-3.5" />
      </button>

      <!-- Theme Switcher -->
      <button
        @click="themeStore.toggleTheme"
        title="Toggle Theme"
        class="p-1 rounded hover:bg-white/10 text-[#cccccc] cursor-pointer transition-colors"
      >
        <Moon v-if="themeStore.isDark" class="w-3.5 h-3.5" />
        <Sun v-else class="w-3.5 h-3.5" />
      </button>

      <!-- GitHub -->
      <a
        :href="SITE.githubUrl"
        target="_blank"
        title="GitHub"
        class="p-1 rounded hover:bg-white/10 text-[#cccccc] cursor-pointer transition-colors"
      >
        <Github class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</template>
