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
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Search,
  Eye,
  Hash
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore, LANGUAGES } from '~/stores/generator.store'
import { useJsonParser, toPascalCase } from '~/composables/useJsonParser'
import { useToast } from '~/composables/useToast'
import LanguageSelector from '../LanguageSelector.vue'
import FrameworkSelector from '../FrameworkSelector.vue'
import GlassSegmented from '../ui/GlassSegmented.vue'
import GlassToggle from '../ui/GlassToggle.vue'
import GlassSlider from '../ui/GlassSlider.vue'
import GlassList from '../ui/GlassList.vue'
import GlassListRow from '../ui/GlassListRow.vue'

const props = defineProps<{
  activeTab: string
}>()

const emit = defineEmits(['generate', 'loadSample'])

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()
const { parseJson, collectModels } = useJsonParser()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const requiredModeOptions = [
  { value: 'none', label: 'None' },
  { value: 'all', label: 'All' },
  { value: 'inferred', label: 'Inferred' },
  { value: 'custom', label: 'Custom' }
]

const searchQuery = ref('')

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

// Dynamically inspect AST models for Custom Required Fields UI & Outline
const parsedAstModels = computed(() => {
  if (!editorStore.rawJson.trim()) return []
  try {
    const ast = parseJson(editorStore.rawJson)
    if (!ast) return []
    const finalRootName = toPascalCase(generatorStore.rootClassName.trim()) || 'Root'
    if (ast.inferredType === 'object') {
      ast.typeName = finalRootName
    } else if (ast.inferredType === 'array' && ast.children?.[0] && ast.children[0].inferredType === 'object') {
      ast.children[0].typeName = finalRootName
    }

    const models = collectModels(ast)
    if (ast.inferredType === 'object' && !models.some(m => m.typeName === finalRootName)) {
      models.push(ast)
    }
    return models
  } catch {
    return []
  }
})

// Filtered models for search tab
const filteredModels = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return parsedAstModels.value
  return parsedAstModels.value.filter(m =>
    (m.typeName || '').toLowerCase().includes(q) ||
    (m.children || []).some(c => c.key.toLowerCase().includes(q))
  )
})

const getFieldOverrideState = (className: string, fieldKey: string, inferredState: boolean): boolean => {
  const key = `${className}.${fieldKey}`
  if (key in generatorStore.requiredOverrides) {
    return generatorStore.requiredOverrides[key]
  }
  return inferredState
}

const toggleFieldOverride = (className: string, fieldKey: string, current: boolean) => {
  generatorStore.setFieldOverride(`${className}.${fieldKey}`, !current)
}

const resetOverrides = () => {
  generatorStore.resetRequiredOverrides()
  toast.success('Fields reset to inferred defaults')
}

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
    generatorStore.rootClassName = 'FilterItem'
    editorStore.validateJson()
    toast.success('Loaded Filter sample (FilterItem)')
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
  <aside
    class="w-72 sm:w-80 shrink-0 select-none flex flex-col glass-panel rounded-3xl mx-2 mb-2 md:mb-3 md:mt-1 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300"
    aria-label="Configuration & Studio Sidebar"
  >
    <!-- Sidebar Header -->
    <div class="h-11 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
      <div class="flex items-center gap-2 text-white font-bold text-xs tracking-tight">
        <SlidersHorizontal v-if="activeTab === 'config'" class="w-3.5 h-3.5 text-blue-400" />
        <Layers v-else-if="activeTab === 'samples'" class="w-3.5 h-3.5 text-purple-400" />
        <Search v-else-if="activeTab === 'search'" class="w-3.5 h-3.5 text-amber-400" />
        <FileCode v-else class="w-3.5 h-3.5 text-blue-400" />

        <span v-if="activeTab === 'config'">CONFIGURATION</span>
        <span v-else-if="activeTab === 'samples'">SAMPLE LIBRARY</span>
        <span v-else-if="activeTab === 'search'">SEARCH & OUTLINE</span>
        <span v-else>MODEL STUDIO</span>
      </div>

      <button
        @click="emit('generate')"
        title="Regenerate Model"
        class="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-90"
      >
        <RefreshCw class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Scrollable Body -->
    <div class="flex-1 overflow-y-auto p-3.5 space-y-4 min-h-0 text-xs">
      <!-- ============================================== -->
      <!-- TAB: CONFIGURATION (Target & Required Fields)  -->
      <!-- ============================================== -->
      <template v-if="activeTab === 'config'">
        <!-- Section 1: TARGET CONFIGURATION -->
        <GlassList title="Target Language">
          <div class="p-3 space-y-3">
            <div>
              <label class="text-[11px] font-medium text-white/60 mb-1.5 block">Language</label>
              <LanguageSelector />
            </div>

            <div>
              <label class="text-[11px] font-medium text-white/60 mb-1.5 block">Framework Style</label>
              <FrameworkSelector />
            </div>

            <div>
              <label class="text-[11px] font-medium text-white/60 mb-1.5 block">Root Model Class Name</label>
              <input
                v-model="generatorStore.rootClassName"
                type="text"
                placeholder="Root"
                class="glass-input w-full px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </GlassList>

        <!-- Section 2: REQUIRED FIELDS (PART 1 DELIVERABLE) -->
        <GlassList
          title="Required Fields Mode"
          :footer="generatorStore.checkDefaultValue ? 'Notice: Safe Defaults is active. Fields with default values (0, 0.0, \'\', false, []) will use defaults instead of \'required\'.' : ''"
        >
          <div class="p-3 space-y-3">
            <GlassSegmented
              :modelValue="generatorStore.requiredMode"
              :options="requiredModeOptions"
              size="sm"
              @update:modelValue="(val) => generatorStore.setRequiredMode(val as any)"
            />

            <!-- Interaction Notice -->
            <div
              v-if="generatorStore.checkDefaultValue"
              class="flex items-start gap-2 p-2 rounded-xl bg-blue-500/10 border border-blue-400/20 text-[11px] text-blue-300 leading-relaxed"
            >
              <Info class="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Safe default values interact with required rules to generate non-null fallbacks.</span>
            </div>

            <!-- Custom Per-Field Overrides List -->
            <div v-if="generatorStore.requiredMode === 'custom'" class="pt-2 border-t border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold text-white/70">Fields by Model</span>
                <button
                  @click="resetOverrides"
                  class="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  <RotateCcw class="w-3 h-3" />
                  <span>Reset to Inferred</span>
                </button>
              </div>

              <!-- List each model and its fields -->
              <div v-if="parsedAstModels.length === 0" class="text-white/40 italic text-[11px] py-2 text-center">
                Paste valid JSON to customize field rules.
              </div>

              <div
                v-for="model in parsedAstModels"
                :key="model.typeName"
                class="rounded-xl bg-black/20 border border-white/10 p-2.5 space-y-2"
              >
                <div class="font-bold text-white/90 text-xs flex items-center justify-between">
                  <span class="font-mono text-blue-300">{{ model.typeName }}</span>
                  <span class="text-[10px] text-white/40">{{ model.children?.length || 0 }} fields</span>
                </div>

                <div class="divide-y divide-white/5">
                  <div
                    v-for="child in model.children"
                    :key="child.key"
                    class="py-1.5 flex items-center justify-between text-xs"
                  >
                    <div class="flex items-center gap-2 min-w-0 flex-1">
                      <span class="font-mono text-white/80 truncate text-[11px]">{{ child.key }}</span>
                      <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/60 font-mono">
                        {{ child.inferredType }}
                      </span>
                    </div>

                    <div class="shrink-0 flex items-center gap-1.5">
                      <span class="text-[10px] text-white/40">
                        {{ getFieldOverrideState(model.typeName || 'Root', child.key, child.presentInAllSamples && !child.everNull) ? 'Req' : 'Opt' }}
                      </span>
                      <GlassToggle
                        :modelValue="getFieldOverrideState(model.typeName || 'Root', child.key, child.presentInAllSamples && !child.everNull)"
                        @update:modelValue="() => toggleFieldOverride(model.typeName || 'Root', child.key, getFieldOverrideState(model.typeName || 'Root', child.key, child.presentInAllSamples && !child.everNull))"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nullable If Absent Option -->
            <GlassListRow
              title="Nullable if Absent"
              subtitle="Omitted fields become nullable types"
            >
              <GlassToggle v-model="generatorStore.nullableIfAbsent" />
            </GlassListRow>
          </div>
        </GlassList>

        <!-- Section 3: CODE EMISSION SETTINGS -->
        <GlassList title="Code Emission Settings">
          <GlassListRow
            title="Safe Default Values"
            subtitle="Emit 0, '', false, [] fallback values"
            :icon="ShieldCheck"
            iconBg="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
          >
            <GlassToggle v-model="generatorStore.checkDefaultValue" />
          </GlassListRow>
        </GlassList>

        <!-- Section 4: LIQUID GLASS INTENSITY (PART 2 DELIVERABLE) -->
        <GlassList title="Liquid Glass Appearance">
          <div class="p-3">
            <GlassSlider
              v-model="generatorStore.glassIntensity"
              leftLabel="Clear"
              rightLabel="Tinted"
            />
          </div>
        </GlassList>
      </template>

      <!-- ============================================== -->
      <!-- TAB: SAMPLES LIBRARY                           -->
      <!-- ============================================== -->
      <template v-else-if="activeTab === 'samples'">
        <GlassList title="Curated Payloads">
          <div
            @click="loadTemplate('ecommerce')"
            class="p-3 hover:bg-white/5 cursor-pointer transition-colors space-y-1"
          >
            <div class="font-bold text-white flex items-center justify-between">
              <span>E-Commerce Product</span>
              <span class="text-[10px] font-mono text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded-full">Product</span>
            </div>
            <p class="text-[11px] text-white/50">Complex nested product with categories, prices, rating and tags.</p>
          </div>

          <div
            @click="loadTemplate('filters')"
            class="p-3 hover:bg-white/5 cursor-pointer transition-colors space-y-1"
          >
            <div class="font-bold text-white flex items-center justify-between">
              <span>Filter Categories (Array)</span>
              <span class="text-[10px] font-mono text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded-full">FilterItem</span>
            </div>
            <p class="text-[11px] text-white/50">Top-level list of filter models with identifiers and icons.</p>
          </div>

          <div
            @click="loadTemplate('saas')"
            class="p-3 hover:bg-white/5 cursor-pointer transition-colors space-y-1"
          >
            <div class="font-bold text-white flex items-center justify-between">
              <span>SaaS Platform Payload</span>
              <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">Platform</span>
            </div>
            <p class="text-[11px] text-white/50">Complete cloud tenant model with UUIDs, dates and events.</p>
          </div>
        </GlassList>
      </template>

      <!-- ============================================== -->
      <!-- TAB: SEARCH & OUTLINE                          -->
      <!-- ============================================== -->
      <template v-else-if="activeTab === 'search'">
        <GlassList title="Search Models">
          <div class="p-3 space-y-3">
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filter models or fields..."
                class="glass-input w-full pl-8 pr-3 py-1.5 text-xs text-white outline-none"
              />
            </div>

            <div class="space-y-2">
              <div
                v-for="model in filteredModels"
                :key="model.typeName"
                class="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div class="font-bold text-white text-xs font-mono text-blue-300">
                  {{ model.typeName }}
                </div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="child in model.children"
                    :key="child.key"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono"
                  >
                    {{ child.key }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassList>
      </template>

      <!-- ============================================== -->
      <!-- TAB: EXPLORER (Default Workspace View)         -->
      <!-- ============================================== -->
      <template v-else>
        <!-- Open Editors Group -->
        <GlassList title="Open Editors">
          <div
            @click="router.push('/')"
            class="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2">
              <FileJson class="w-4 h-4 text-amber-400" />
              <span class="font-mono text-white/90">input.json</span>
            </div>
            <span class="text-[10px] font-mono text-white/40">JSON Payload</span>
          </div>

          <div
            @click="router.push('/')"
            class="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2">
              <FileCode class="w-4 h-4 text-sky-400" />
              <span class="font-mono text-white/90">{{ generatorStore.rootClassName }}.{{ fileExtension }}</span>
            </div>
            <span class="text-[10px] font-mono text-white/40 uppercase">{{ generatorStore.selectedLanguage }}</span>
          </div>
        </GlassList>

        <!-- Quick Jump to Configuration -->
        <GlassList title="Quick Setup">
          <div class="p-3 flex items-center justify-between">
            <div>
              <div class="font-bold text-white">Target Language</div>
              <div class="text-[11px] text-white/50 capitalize">{{ generatorStore.selectedLanguage }} ({{ generatorStore.selectedFramework }})</div>
            </div>
            <NuxtLink
              to="/languages"
              class="glass-pill px-2.5 py-1 text-[11px] text-blue-400 hover:text-white cursor-pointer"
            >
              Change
            </NuxtLink>
          </div>
        </GlassList>
      </template>
    </div>
  </aside>
</template>
