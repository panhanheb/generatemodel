<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore } from '~/stores/generator.store'
import { useCodeGenerator } from '~/composables/useCodeGenerator'
import { useClipboard } from '~/composables/useClipboard'
import { useFileUpload } from '~/composables/useFileUpload'
import { useDownload } from '~/composables/useDownload'
import { useToast } from '~/composables/useToast'
import { useShareLink } from '~/composables/useShareLink'
import JsonEditor from '../components/JsonEditor.vue'
import CodePreview from '../components/CodePreview.vue'
import ErrorState from '../components/ErrorState.vue'
import IdeWatermark from '../components/ide/IdeWatermark.vue'
import GlassSegmented from '../components/ui/GlassSegmented.vue'
import {
  FileJson,
  FileCode,
  AlignLeft,
  Shrink,
  Upload,
  Trash2,
  Copy,
  Check,
  Download,
  WrapText,
  Sparkles
} from 'lucide-vue-next'

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()
const codeGen = useCodeGenerator()
const { handleFile } = useFileUpload()
const { copy, copied } = useClipboard()
const { download } = useDownload()
const toast = useToast()
const { applyStateFromQuery, applyStateFromId } = useShareLink()
const route = useRoute()

const isDragging = ref(false)

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

// Mobile view switcher options
const mobileViewOptions = computed(() => [
  { value: 'input', label: 'Input JSON', icon: FileJson },
  { value: 'output', label: `${generatorStore.rootClassName}.${fileExtension.value}`, icon: FileCode }
])

// Main generate wrapper
const triggerGenerate = () => {
  if (!editorStore.rawJson.trim()) {
    generatorStore.generatedCode = ''
    return
  }
  
  try {
    const output = codeGen.generate(
      editorStore.rawJson,
      generatorStore.selectedLanguage,
      generatorStore.selectedFramework,
      generatorStore.rootClassName,
      generatorStore.checkDefaultValue,
      generatorStore.requiredMode,
      generatorStore.requiredOverrides,
      generatorStore.nullableIfAbsent
    )
    generatorStore.generatedCode = output
  } catch (error: any) {
    console.error('[JSON Model Generator] Generation failed:', error)
    toast.error(`Generation failed: ${error.message}`)
  }
}

// Watchers for instant feedback
watch([
  () => editorStore.rawJson,
  () => generatorStore.selectedLanguage,
  () => generatorStore.selectedFramework,
  () => generatorStore.rootClassName,
  () => generatorStore.checkDefaultValue,
  () => generatorStore.requiredMode,
  () => generatorStore.requiredOverrides,
  () => generatorStore.nullableIfAbsent
], () => {
  triggerGenerate()
}, { immediate: true, deep: true })

// Watch external trigger events from titlebar, sidebar, statusbar
watch(() => generatorStore.generateTrigger, () => {
  triggerGenerate()
  toast.success('Model generated')
})

watch(() => generatorStore.loadSampleTrigger, () => {
  loadSampleJson()
})

// Drag & Drop handlers
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    handleFile(file)
  }
}

// Load sample JSON
const loadSampleJson = () => {
  editorStore.rawJson = `{
  "id": 1,
  "name": "Filters",
  "icon": "filter",
  "value": ""
}`
  generatorStore.rootClassName = 'FilterItem'
  editorStore.validateJson()
  toast.success('Sample JSON loaded')
}

// Hidden file input hook
const fileInput = ref<HTMLInputElement | null>(null)
const triggerUploadSelect = () => {
  fileInput.value?.click()
}
const onFileSelectChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text.trim()) {
      editorStore.rawJson = text
      editorStore.validateJson()
      toast.success('Successfully pasted from clipboard')
    } else {
      toast.error('Clipboard is empty')
    }
  } catch (err) {
    toast.error('Clipboard access denied. Please use Ctrl+V to paste.')
  }
}

const handleCopy = () => {
  if (generatorStore.generatedCode) {
    copy(generatorStore.generatedCode)
  }
}

const handleDownload = () => {
  const name = `${generatorStore.rootClassName}.${fileExtension.value}`
  download(generatorStore.generatedCode, name)
}

// Global Keyboard Shortcuts
const handleGlobalKeydown = (e: KeyboardEvent) => {
  const isModifier = e.ctrlKey || e.metaKey

  // Ctrl+Enter / Cmd+Enter -> Generate
  if (isModifier && e.key === 'Enter') {
    e.preventDefault()
    triggerGenerate()
  }
  // Ctrl+B -> Toggle Sidebar
  if (isModifier && e.key.toLowerCase() === 'b') {
    e.preventDefault()
    generatorStore.isSidebarOpen = !generatorStore.isSidebarOpen
  }
  // Ctrl+Shift+F / Cmd+Shift+F -> Format JSON
  if (isModifier && e.shiftKey && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    editorStore.formatJson()
    toast.success('JSON Formatted')
  }
  // Ctrl+Shift+C / Cmd+Shift+C -> Copy Code
  if (isModifier && e.shiftKey && e.key.toLowerCase() === 'c') {
    e.preventDefault()
    handleCopy()
  }
}

onMounted(async () => {
  if (typeof route.query.id === 'string' && route.query.id) {
    if (await applyStateFromId(route.query.id)) {
      toast.success('Loaded shared JSON from link')
    }
  } else if (typeof route.query.s === 'string' && route.query.s) {
    if (applyStateFromQuery(route.query.s)) {
      toast.success('Loaded shared JSON from link')
    }
  }
  window.addEventListener('keydown', handleGlobalKeydown)
  triggerGenerate()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    class="relative w-full h-full flex flex-col flex-1 min-h-0 select-none overflow-hidden"
  >
    <!-- Drag & Drop overlay -->
    <div
      v-if="isDragging"
      class="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-md border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none"
    >
      <div class="glass-sheet-panel text-white px-8 py-5 rounded-3xl shadow-2xl border border-white/30 flex items-center gap-3">
        <FileJson class="w-8 h-8 text-blue-400 animate-bounce" />
        <span class="text-sm font-semibold">Drop JSON or TXT file here</span>
      </div>
    </div>

    <!-- Hidden input for file selection -->
    <input
      type="file"
      ref="fileInput"
      @change="onFileSelectChange"
      accept=".json,.txt"
      class="hidden"
    />

    <!-- Mobile View Switcher (iOS Segmented Control) -->
    <div class="lg:hidden pb-2 shrink-0">
      <GlassSegmented
        v-model="generatorStore.editorActiveTab"
        :options="mobileViewOptions"
        size="sm"
      />
    </div>

    <!-- IDE Dual Glass Cards Split Workspace -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2.5 min-h-0 overflow-hidden">
      <!-- Left Pane: Input JSON Glass Card -->
      <div
        class="glass-card flex flex-col h-full min-h-0 min-w-0 overflow-hidden transition-all duration-300"
        :class="{ 'hidden lg:flex': generatorStore.editorActiveTab === 'output' }"
      >
        <!-- Card Header -->
        <div class="h-10 px-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div class="flex items-center gap-2">
            <FileJson class="w-4 h-4 text-amber-400 shrink-0" />
            <span class="font-mono text-xs font-semibold text-white/90">input.json</span>
            <span v-if="editorStore.rawJson.trim()" class="text-[10px] text-white/40 font-mono">
              {{ editorStore.rawJson.length }}B
            </span>
          </div>

          <!-- Actions Capsule Pills -->
          <div class="flex items-center gap-1">
            <button
              @click="editorStore.formatJson"
              title="Format JSON (Ctrl+Shift+F)"
              class="glass-pill p-1.5 text-white/70 hover:text-white cursor-pointer active:scale-90"
            >
              <AlignLeft class="w-3.5 h-3.5" />
            </button>
            <button
              @click="editorStore.minifyJson"
              title="Minify JSON"
              class="glass-pill p-1.5 text-white/70 hover:text-white cursor-pointer active:scale-90"
            >
              <Shrink class="w-3.5 h-3.5" />
            </button>
            <button
              @click="triggerUploadSelect"
              title="Upload File (.json, .txt)"
              class="glass-pill p-1.5 text-white/70 hover:text-white cursor-pointer active:scale-90"
            >
              <Upload class="w-3.5 h-3.5" />
            </button>
            <button
              @click="editorStore.clearJson"
              title="Clear Input"
              class="glass-pill p-1.5 text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 cursor-pointer active:scale-90"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Monaco Editor Host -->
        <div class="relative flex-1 min-h-0 overflow-hidden">
          <JsonEditor />

          <!-- Error Alerts Floating Banner -->
          <div
            v-if="!editorStore.isValid"
            class="absolute bottom-2 inset-x-2 p-3 rounded-2xl border border-rose-400/30 bg-rose-950/80 backdrop-blur-xl z-20 shadow-lg"
          >
            <ErrorState :message="editorStore.errorMessage" :line="editorStore.lineError" />
          </div>
        </div>
      </div>

      <!-- Right Pane: Model Code Output Glass Card -->
      <div
        class="glass-card flex flex-col h-full min-h-0 min-w-0 overflow-hidden transition-all duration-300"
        :class="{ 'hidden lg:flex': generatorStore.editorActiveTab === 'input' }"
      >
        <!-- Card Header -->
        <div class="h-10 px-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div class="flex items-center gap-2 min-w-0">
            <FileCode class="w-4 h-4 text-blue-400 shrink-0" />
            <span class="font-mono text-xs font-semibold text-white/90 truncate">
              {{ generatorStore.rootClassName }}.{{ fileExtension }}
            </span>
            <span class="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded-full uppercase font-bold shrink-0">
              {{ fileExtension }}
            </span>
          </div>

          <!-- Actions Capsule Pills -->
          <div class="flex items-center gap-1">
            <button
              @click="handleCopy"
              title="Copy Code (Ctrl+Shift+C)"
              class="glass-pill p-1.5 text-white/70 hover:text-white cursor-pointer active:scale-90"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
            </button>
            <button
              @click="handleDownload"
              title="Download File"
              class="glass-pill p-1.5 text-white/70 hover:text-white cursor-pointer active:scale-90"
            >
              <Download class="w-3.5 h-3.5" />
            </button>
            <button
              @click="generatorStore.wordWrap = !generatorStore.wordWrap"
              title="Toggle Word Wrap"
              class="glass-pill p-1.5 cursor-pointer active:scale-90"
              :class="generatorStore.wordWrap ? 'text-blue-300 bg-blue-500/30 border-blue-400/50' : 'text-white/70 hover:text-white'"
            >
              <WrapText class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Editor Host or Empty Watermark -->
        <div class="relative flex-1 min-h-0 overflow-hidden">
          <IdeWatermark
            v-if="!editorStore.rawJson.trim()"
            @loadSample="loadSampleJson"
            @triggerUpload="triggerUploadSelect"
            @triggerPaste="handlePaste"
          />
          <CodePreview v-else />
        </div>
      </div>
    </div>
  </div>
</template>
