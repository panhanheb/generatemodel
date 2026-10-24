<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  Sparkles,
  Code2,
  Share2,
  Copy,
  Download,
  AlignLeft,
  Github,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  Globe,
  FileCode,
  Sliders,
  FileText
} from 'lucide-vue-next'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore } from '~/stores/generator.store'
import { useThemeStore } from '~/stores/theme.store'
import { useToast } from '~/composables/useToast'
import { useShareLink } from '~/composables/useShareLink'
import { useClipboard } from '~/composables/useClipboard'
import { useDownload } from '~/composables/useDownload'
import { SITE } from '~/constants/site'

const emit = defineEmits(['generate', 'toggleSidebar'])

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()
const themeStore = useThemeStore()
const toast = useToast()
const { createShareUrl } = useShareLink()
const { copy } = useClipboard()
const { download } = useDownload()

const activeMenu = ref<string | null>(null)
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

const handleCopyCode = async () => {
  if (!generatorStore.generatedCode) {
    toast.error('No generated code to copy')
    return
  }
  await copy(generatorStore.generatedCode)
  toast.success('Generated code copied')
}

const handleDownload = () => {
  if (!generatorStore.generatedCode) {
    toast.error('No generated code to download')
    return
  }
  download(generatorStore.generatedCode, `${generatorStore.rootClassName}.${fileExtension.value}`)
  toast.success(`Downloaded ${generatorStore.rootClassName}.${fileExtension.value}`)
}
</script>

<template>
  <header class="px-3 pt-2.5 pb-1 shrink-0 z-40 select-none">
    <div class="glass-toolbar-capsule h-11 px-3 flex items-center justify-between text-xs transition-all duration-300">
      <!-- Left: App Brand & Context Menus -->
      <div class="flex items-center gap-2 ide-menu-container relative">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-2 py-1 rounded-xl text-white font-semibold hover:bg-white/10 transition-colors cursor-pointer"
        >
          <div class="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md">
            <Code2 class="w-3.5 h-3.5 text-white" />
          </div>
          <span class="text-xs font-bold tracking-tight text-white hidden sm:inline">JSON Model</span>
        </NuxtLink>

        <!-- Divider -->
        <div class="h-4 w-px bg-white/15 hidden md:block"></div>

        <!-- Desktop Context Menus -->
        <div class="hidden md:flex items-center gap-0.5">
          <div
            v-for="menu in menus"
            :key="menu"
            class="relative"
            @mouseenter="handleMenuHover(menu)"
          >
            <button
              @click.stop="toggleMenu(menu)"
              class="px-2.5 py-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer font-medium text-[11px]"
              :class="activeMenu === menu ? 'bg-white/15 text-white' : ''"
            >
              <span>{{ menu }}</span>
              <ChevronDown class="w-2.5 h-2.5 opacity-60" />
            </button>

            <!-- iOS Glass Context Menu Popover -->
            <div
              v-if="activeMenu === menu"
              class="absolute left-0 top-full mt-1.5 w-52 rounded-2xl glass-sheet-panel border border-white/20 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 text-xs backdrop-blur-2xl"
            >
              <!-- FILE MENU -->
              <template v-if="menu === 'File'">
                <button
                  @click="emit('generate'); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span class="flex items-center gap-2"><Sparkles class="w-3.5 h-3.5 text-blue-400" /> Generate</span>
                  <span class="text-[10px] text-white/40 font-mono">Ctrl+Enter</span>
                </button>
                <button
                  @click="handleCopyShare"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span class="flex items-center gap-2"><Share2 class="w-3.5 h-3.5 text-emerald-400" /> Share Link</span>
                </button>
                <button
                  @click="handleDownload(); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span class="flex items-center gap-2"><Download class="w-3.5 h-3.5 text-sky-400" /> Export File</span>
                </button>
              </template>

              <!-- EDIT MENU -->
              <template v-if="menu === 'Edit'">
                <button
                  @click="editorStore.formatJson(); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span class="flex items-center gap-2"><AlignLeft class="w-3.5 h-3.5 text-blue-400" /> Format JSON</span>
                  <span class="text-[10px] text-white/40 font-mono">Ctrl+Shift+F</span>
                </button>
                <button
                  @click="handleCopyCode(); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span class="flex items-center gap-2"><Copy class="w-3.5 h-3.5 text-sky-400" /> Copy Code</span>
                  <span class="text-[10px] text-white/40 font-mono">Ctrl+Shift+C</span>
                </button>
                <button
                  @click="editorStore.clearJson(); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-red-500/20 text-red-300 flex items-center justify-between text-left transition-colors"
                >
                  <span>Clear Input</span>
                </button>
              </template>

              <!-- VIEW MENU -->
              <template v-if="menu === 'View'">
                <button
                  @click="emit('toggleSidebar'); closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span>Toggle Sidebar</span>
                  <span class="text-[10px] text-white/40 font-mono">Ctrl+B</span>
                </button>
                <NuxtLink
                  to="/languages"
                  @click="closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span>All Languages</span>
                </NuxtLink>
              </template>

              <!-- HELP MENU -->
              <template v-if="menu === 'Help'">
                <NuxtLink
                  to="/docs"
                  @click="closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center gap-2 text-left text-white transition-colors"
                >
                  <FileText class="w-3.5 h-3.5 text-blue-400" />
                  <span>Documentation</span>
                </NuxtLink>
                <button
                  @click="generatorStore.showShortcuts = true; closeMenu()"
                  class="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/15 flex items-center justify-between text-left text-white transition-colors"
                >
                  <span>Keyboard Shortcuts</span>
                  <span class="text-[10px] text-white/40 font-mono">Ctrl+K Ctrl+S</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: High-Value Actions (Capsules) -->
      <div class="flex items-center gap-1.5">
        <!-- Generate Button (Hero Capsule) -->
        <button
          @click="emit('generate')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF] text-white font-semibold text-xs shadow-[0_2px_12px_rgba(10,132,255,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Generate</span>
        </button>

        <!-- Format Button -->
        <button
          @click="editorStore.formatJson()"
          title="Format JSON (Ctrl+Shift+F)"
          class="glass-pill px-2.5 py-1.5 flex items-center gap-1 text-xs text-white/80 hover:text-white cursor-pointer active:scale-95"
        >
          <AlignLeft class="w-3.5 h-3.5" />
          <span class="hidden lg:inline">Format</span>
        </button>

        <!-- Copy Code Button -->
        <button
          @click="handleCopyCode"
          title="Copy Generated Code (Ctrl+Shift+C)"
          class="glass-pill px-2.5 py-1.5 flex items-center gap-1 text-xs text-white/80 hover:text-white cursor-pointer active:scale-95"
        >
          <Copy class="w-3.5 h-3.5" />
          <span class="hidden lg:inline">Copy</span>
        </button>

        <!-- Share Button -->
        <button
          @click="handleCopyShare"
          title="Create & Copy Share Link"
          class="glass-pill px-2.5 py-1.5 flex items-center gap-1 text-xs text-white/80 hover:text-white cursor-pointer active:scale-95"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span class="hidden lg:inline">Share</span>
        </button>
      </div>

      <!-- Right: Target Chip, Theme & Sidebar Controls -->
      <div class="flex items-center gap-1.5">
        <!-- Active Language Pill -->
        <NuxtLink
          to="/languages"
          title="Change Target Language"
          class="glass-pill px-2.5 py-1 flex items-center gap-1.5 text-xs text-white/90 hover:text-white cursor-pointer"
        >
          <Globe class="w-3.5 h-3.5 text-blue-400" />
          <span class="font-medium capitalize">{{ generatorStore.selectedLanguage }}</span>
          <span class="text-[10px] text-white/40 uppercase font-mono">({{ generatorStore.selectedFramework }})</span>
        </NuxtLink>

        <!-- Theme Toggle -->
        <button
          @click="themeStore.toggleTheme()"
          title="Toggle Theme"
          class="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
        >
          <Sun v-if="themeStore.isDark" class="w-3.5 h-3.5 text-amber-300" />
          <Moon v-else class="w-3.5 h-3.5 text-blue-400" />
        </button>

        <!-- GitHub -->
        <a
          :href="SITE.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          class="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90 hidden sm:flex"
        >
          <Github class="w-3.5 h-3.5" />
        </a>

        <!-- Sidebar Toggle -->
        <button
          @click="emit('toggleSidebar')"
          title="Toggle Primary Sidebar (Ctrl+B)"
          class="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-90"
        >
          <PanelLeftClose v-if="generatorStore.isSidebarOpen" class="w-3.5 h-3.5" />
          <PanelLeft v-else class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </header>
</template>
