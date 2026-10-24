<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LANGUAGES } from '~/constants/languages'
import { SITE } from '~/constants/site'
import { useGeneratorStore } from '~/stores/generator.store'
import { useEditorStore } from '~/stores/editor.store'
import { useToast } from '~/composables/useToast'
import {
  FileJson,
  FileCode,
  Globe,
  X,
  Search,
  Check,
  ArrowLeft,
  Sparkles
} from 'lucide-vue-next'

useHead({
  title: `Supported Languages — ${SITE.name}`,
  meta: [
    { name: 'description', content: `Browse all ${LANGUAGES.length} languages and frameworks supported by ${SITE.name}, from Flutter and Laravel to TypeScript, Go, and Prisma.` }
  ]
})

const router = useRouter()
const generatorStore = useGeneratorStore()
const editorStore = useEditorStore()
const toast = useToast()

const searchQuery = ref('')

const totalStyles = LANGUAGES.reduce((sum, l) => sum + l.options.length, 0)

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

const filteredLanguages = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return LANGUAGES
  return LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.id.toLowerCase().includes(q) ||
    l.options.some(o => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  )
})

const selectLanguageAndStyle = (langId: string, styleId?: string) => {
  generatorStore.selectedLanguage = langId
  if (styleId) {
    generatorStore.selectedFramework = styleId
  } else {
    const langObj = LANGUAGES.find(l => l.id === langId)
    if (langObj && langObj.options.length > 0) {
      generatorStore.selectedFramework = langObj.options[0].id
    }
  }
  toast.success(`Target set to ${generatorStore.selectedLanguage}`)
  router.push('/')
}
</script>

<template>
  <div class="glass-panel h-full flex flex-col min-h-0 overflow-hidden text-[#cccccc] select-none">
    <!-- VS Code Top Editor Tab Bar -->
    <div class="glass-header h-9 flex items-center justify-between px-2 text-xs shrink-0 select-none border-b border-white/10">
      <!-- Tabs List -->
      <div class="flex items-center h-full">
        <!-- input.json Tab (Inactive) -->
        <NuxtLink
          to="/"
          class="h-full px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FileJson class="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>input.json</span>
        </NuxtLink>

        <!-- Model Code Tab (Inactive) -->
        <NuxtLink
          to="/"
          class="h-full px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FileCode class="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{{ generatorStore.rootClassName }}.{{ fileExtension }}</span>
        </NuxtLink>

        <!-- Supported Languages Tab (ACTIVE) -->
        <div class="h-full bg-white/10 text-white border-t-2 border-t-sky-400 px-3 flex items-center gap-2 font-mono text-xs border-r border-white/10 backdrop-blur-md shadow-inner">
          <Globe class="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Supported Languages</span>
          <NuxtLink
            to="/"
            title="Close Tab (Ctrl+W)"
            class="ml-2 p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>

      <!-- Tab Actions Right -->
      <div class="flex items-center gap-2">
        <span class="hidden sm:inline text-[11px] text-white/60 font-mono">
          {{ LANGUAGES.length }} Languages &bull; {{ totalStyles }} Styles
        </span>
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 px-2.5 py-1 glass-pill hover:bg-white/15 rounded-md text-[11px] text-white transition-all cursor-pointer"
        >
          <ArrowLeft class="w-3 h-3" />
          <span>Back to Editor</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content Container with Proper Scroll and Padding -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 select-text">
      <!-- Header & Search Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Globe class="w-5 h-5 text-sky-400" />
            Supported Languages & Frameworks
          </h1>
          <p class="text-xs text-white/60 mt-1">
            Pick any language or framework style below to configure code generation and return to the editor.
          </p>
        </div>

        <!-- Filter Input -->
        <div class="relative w-full sm:w-72">
          <Search class="w-3.5 h-3.5 text-[#858585] absolute left-3 top-2.5 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter languages or styles..."
            class="glass-input w-full rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none transition-all placeholder-white/40"
          />
        </div>
      </div>

      <!-- Language Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pb-8">
        <div
          v-for="lang in filteredLanguages"
          :key="lang.id"
          class="glass-card rounded-xl p-4 flex flex-col justify-between transition-all group"
          :class="generatorStore.selectedLanguage === lang.id ? 'border-sky-400/80 ring-1 ring-sky-400/40' : ''"
        >
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  v-if="generatorStore.selectedLanguage === lang.id"
                  class="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                ></span>
                <h2 class="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                  {{ lang.name }}
                </h2>
              </div>
              <span class="font-mono text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {{ lang.id }}
              </span>
            </div>

            <!-- Style Pills -->
            <div class="mt-3 flex flex-wrap gap-1.5">
              <button
                v-for="opt in lang.options"
                :key="opt.id"
                @click="selectLanguageAndStyle(lang.id, opt.id)"
                class="px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1.5 cursor-pointer border"
                :class="generatorStore.selectedLanguage === lang.id && generatorStore.selectedFramework === opt.id
                  ? 'bg-sky-500/30 border-sky-400 text-white font-medium shadow-inner'
                  : 'glass-pill text-[#cccccc] hover:text-white'"
                title="Click to apply this style and open editor"
              >
                <span>{{ opt.name }}</span>
                <Check
                  v-if="generatorStore.selectedLanguage === lang.id && generatorStore.selectedFramework === opt.id"
                  class="w-3 h-3 text-sky-400"
                />
              </button>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span class="text-[11px] text-white/50">
              {{ lang.options.length }} {{ lang.options.length === 1 ? 'style' : 'styles' }}
            </span>
            <button
              @click="selectLanguageAndStyle(lang.id)"
              class="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>Use in Editor</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
