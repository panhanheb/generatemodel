<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronDown,
  ChevronRight,
  FileJson,
  FileCode,
  ShieldCheck,
  Check,
  RefreshCw,
  Globe,
  BookOpen,
  X
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore, LANGUAGES } from '~/stores/generator.store'
import { useToast } from '~/composables/useToast'
import LanguageSelector from '../LanguageSelector.vue'
import FrameworkSelector from '../FrameworkSelector.vue'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits(['generate', 'loadSample'])

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

// Collapsible section states
const isWorkspaceOpen = ref(true)
const isConfigOpen = ref(true)
const isSamplesOpen = ref(true)
const isOutlineOpen = ref(true)

const currentOptions = computed(() => {
  const langObj = LANGUAGES.find(l => l.id === generatorStore.selectedLanguage)
  return langObj ? langObj.options : []
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

// Extract class/model names from generated code for outline
const parsedModels = computed(() => {
  const code = generatorStore.generatedCode
  if (!code) return []
  const matches = code.matchAll(/class\s+([A-Za-z0-9_]+)/g)
  const names = Array.from(matches).map(m => m[1])
  return Array.from(new Set(names))
})

// Sample templates
const loadTemplate = (type: string) => {
  if (type === 'filters') {
    editorStore.rawJson = `[
  {
    "id": 1,
    "name": "Filters",
    "icon": "filter",
    "value": ""
  },
  {
    "id": 2,
    "name": "Cuisine",
    "icon": "filter",
    "value": "cuisine"
  },
  {
    "id": 3,
    "name": "Offers",
    "icon": "filter",
    "value": "offers"
  },
  {
    "id": 4,
    "name": "Fast delivery",
    "icon": "fast-delivery",
    "value": "fast_delivery"
  }
]`
    generatorStore.rootClassName = 'SetEmailModel'
    editorStore.validateJson()
    toast.success('Loaded Filter sample (SetEmailModel)')
  } else if (type === 'ecommerce') {
    editorStore.rawJson = `{
  "id": 101,
  "title": "Wireless Noise Canceling Headphones",
  "price": 299.99,
  "inStock": true,
  "rating": 4.8,
  "category": {
    "id": 5,
    "name": "Electronics"
  },
  "tags": ["audio", "bluetooth", "premium"]
}`
    generatorStore.rootClassName = 'Product'
    editorStore.validateJson()
    toast.success('Loaded E-Commerce Product sample')
  } else {
    emit('loadSample')
  }
}
</script>

<template>
  <aside class="glass-sidebar w-64 text-[#cccccc] flex flex-col shrink-0 select-none overflow-y-auto text-xs">
    <!-- Sidebar Header -->
    <div class="h-9 px-4 flex items-center justify-between font-bold text-[11px] tracking-wider uppercase text-[#bbbbbb] border-b border-white/10 shrink-0">
      <span v-if="activeTab === 'config'">CONFIGURATION</span>
      <span v-else-if="activeTab === 'samples'">SAMPLES LIBRARY</span>
      <span v-else>EXPLORER: MODEL STUDIO</span>

      <div class="flex items-center gap-1 text-[#858585]">
        <button
          @click="emit('generate')"
          title="Regenerate Model"
          class="p-1 hover:text-white rounded cursor-pointer transition-colors"
        >
          <RefreshCw class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Section 1: OPEN EDITORS / WORKSPACE -->
    <div class="border-b border-white/10">
      <button
        @click="isWorkspaceOpen = !isWorkspaceOpen"
        class="w-full px-2 py-1.5 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-white/5 cursor-pointer"
      >
        <ChevronDown v-if="isWorkspaceOpen" class="w-3.5 h-3.5 text-[#858585]" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-[#858585]" />
        <span>OPEN EDITORS</span>
      </button>

      <div v-show="isWorkspaceOpen" class="py-1">
        <!-- input.json File -->
        <div
          @click="router.push('/')"
          class="px-5 py-1 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-colors"
          :class="route.path === '/' ? 'text-white font-medium' : 'text-[#858585]'"
        >
          <div class="flex items-center gap-2 truncate">
            <FileJson class="w-4 h-4 text-amber-400 shrink-0" />
            <span class="truncate font-mono">input.json</span>
          </div>
          <span v-if="editorStore.rawJson" class="text-[10px] text-[#858585] font-mono">
            {{ editorStore.rawJson.length }} B
          </span>
        </div>

        <!-- Output model file -->
        <div
          @click="router.push('/')"
          class="px-5 py-1 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-colors"
          :class="route.path === '/' ? 'text-white font-medium' : 'text-[#858585]'"
        >
          <div class="flex items-center gap-2 truncate">
            <FileCode class="w-4 h-4 text-sky-400 shrink-0" />
            <span class="truncate font-mono">{{ generatorStore.rootClassName }}.{{ fileExtension }}</span>
          </div>
          <span class="text-[9px] bg-sky-400/20 text-sky-300 border border-sky-400/30 px-1 py-0.5 rounded uppercase font-bold font-mono">
            {{ fileExtension }}
          </span>
        </div>

        <!-- Supported Languages (When Active) -->
        <div
          v-if="route.path === '/languages'"
          @click="router.push('/languages')"
          class="px-5 py-1 flex items-center justify-between bg-sky-500/20 text-white cursor-pointer group border-l-2 border-sky-400"
        >
          <div class="flex items-center gap-2 truncate">
            <Globe class="w-4 h-4 text-sky-400 shrink-0" />
            <span class="truncate font-mono">Supported Languages</span>
          </div>
          <button
            @click.stop="router.push('/')"
            title="Close Tab"
            class="p-0.5 rounded hover:bg-white/10 text-[#858585] hover:text-white"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Documentation (When Active) -->
        <div
          v-if="route.path === '/docs'"
          @click="router.push('/docs')"
          class="px-5 py-1 flex items-center justify-between bg-emerald-500/20 text-white cursor-pointer group border-l-2 border-emerald-400"
        >
          <div class="flex items-center gap-2 truncate">
            <BookOpen class="w-4 h-4 text-emerald-400 shrink-0" />
            <span class="truncate font-mono">Documentation</span>
          </div>
          <button
            @click.stop="router.push('/')"
            title="Close Tab"
            class="p-0.5 rounded hover:bg-white/10 text-[#858585] hover:text-white"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Section 2: TARGET CONFIGURATION & CODE GENERATION -->
    <div class="border-b border-white/10">
      <button
        @click="isConfigOpen = !isConfigOpen"
        class="w-full px-2 py-1.5 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-white/5 cursor-pointer"
      >
        <ChevronDown v-if="isConfigOpen" class="w-3.5 h-3.5 text-[#858585]" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-[#858585]" />
        <span>TARGET CONFIGURATION</span>
      </button>

      <div v-show="isConfigOpen" class="px-4 py-2 space-y-3">
        <!-- Target Language Picker -->
        <div>
          <label class="block text-[10px] font-bold text-[#858585] uppercase tracking-wider mb-1">Language</label>
          <div class="relative">
            <select
              v-model="generatorStore.selectedLanguage"
              class="glass-input w-full text-white rounded-md px-2.5 py-1.5 text-xs appearance-none cursor-pointer outline-none transition-all"
            >
              <option v-for="lang in LANGUAGES" :key="lang.id" :value="lang.id" class="bg-[#12141a] text-white">
                {{ lang.name }}
              </option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-[#aaaaaa] pointer-events-none absolute right-2 top-2.5" />
          </div>
        </div>

        <!-- Generation Style -->
        <div v-if="currentOptions.length > 1">
          <label class="block text-[10px] font-bold text-[#858585] uppercase tracking-wider mb-1">Style</label>
          <div class="space-y-1">
            <button
              v-for="opt in currentOptions"
              :key="opt.id"
              @click="generatorStore.selectedFramework = opt.id"
              class="w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between cursor-pointer"
              :class="generatorStore.selectedFramework === opt.id ? 'bg-sky-500/25 border border-sky-400/60 text-white font-semibold shadow-inner' : 'glass-pill text-[#cccccc] hover:text-white'"
            >
              <span>{{ opt.name }}</span>
              <Check v-if="generatorStore.selectedFramework === opt.id" class="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>

        <!-- Model Root Class Name -->
        <div>
          <label class="block text-[10px] font-bold text-[#858585] uppercase tracking-wider mb-1">Root Class Name</label>
          <input
            v-model="generatorStore.rootClassName"
            type="text"
            placeholder="e.g. SetEmailModel"
            class="glass-input w-full text-white rounded-md px-2.5 py-1.5 text-xs outline-none font-mono transition-all"
          />
        </div>

        <!-- Default Null or 0 Checkbox -->
        <div class="pt-1">
          <label
            class="glass-pill flex items-start gap-2 text-xs text-[#cccccc] cursor-pointer select-none hover:text-white p-2 rounded-lg transition-all"
            title="Check default values by variable type (0 for int, 0.0 for double, '' for String, false for bool, [] for List, or null if nullable)"
          >
            <input
              type="checkbox"
              v-model="generatorStore.checkDefaultValue"
              class="mt-0.5 w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-[#007acc] focus:ring-0 accent-[#007acc] cursor-pointer"
            />
            <div class="flex flex-col">
              <span class="font-semibold text-white flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-sky-400" />
                Default null / 0
              </span>
              <span class="text-[10px] text-[#858585] leading-tight mt-0.5">
                Checks variable types and assigns safe fallbacks (0, '', [])
              </span>
            </div>
          </label>
        </div>

        <!-- Word Wrap Toggle -->
        <div>
          <label class="glass-pill flex items-center gap-2 text-xs text-[#cccccc] cursor-pointer select-none hover:text-white p-2 rounded-lg transition-all">
            <input
              type="checkbox"
              v-model="generatorStore.wordWrap"
              class="w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-[#007acc] focus:ring-0 accent-[#007acc] cursor-pointer"
            />
            <span>Word Wrap</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Section 3: SAMPLES LIBRARY -->
    <div class="border-b border-white/10">
      <button
        @click="isSamplesOpen = !isSamplesOpen"
        class="w-full px-2 py-1.5 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-white/5 cursor-pointer"
      >
        <ChevronDown v-if="isSamplesOpen" class="w-3.5 h-3.5 text-[#858585]" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-[#858585]" />
        <span>SAMPLES & TEMPLATES</span>
      </button>

      <div v-show="isSamplesOpen" class="py-1">
        <button
          @click="loadTemplate('filters')"
          class="w-full text-left px-5 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-[#cccccc] hover:text-white cursor-pointer transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
          <span>Filters (SetEmailModel)</span>
        </button>

        <button
          @click="loadTemplate('saas')"
          class="w-full text-left px-5 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-[#cccccc] hover:text-white cursor-pointer transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]"></span>
          <span>Acme SaaS Platform</span>
        </button>

        <button
          @click="loadTemplate('ecommerce')"
          class="w-full text-left px-5 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-[#cccccc] hover:text-white cursor-pointer transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]"></span>
          <span>E-Commerce Product</span>
        </button>
      </div>
    </div>

    <!-- Section 4: GENERATED OUTLINE / MODELS -->
    <div v-if="parsedModels.length > 0">
      <button
        @click="isOutlineOpen = !isOutlineOpen"
        class="w-full px-2 py-1.5 flex items-center gap-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-white/5 cursor-pointer"
      >
        <ChevronDown v-if="isOutlineOpen" class="w-3.5 h-3.5 text-[#858585]" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-[#858585]" />
        <span>OUTLINE ({{ parsedModels.length }} MODELS)</span>
      </button>

      <div v-show="isOutlineOpen" class="py-1">
        <div
          v-for="modelName in parsedModels"
          :key="modelName"
          class="px-5 py-1 text-xs hover:bg-white/5 flex items-center gap-2 text-sky-400 font-mono transition-colors"
        >
          <span class="text-[#858585]">class</span>
          <span class="font-bold text-white">{{ modelName }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
