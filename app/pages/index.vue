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
  WrapText
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
      generatorStore.checkDefaultValue
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
  () => generatorStore.checkDefaultValue
], () => {
  triggerGenerate()
}, { immediate: true })

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
  generatorStore.rootClassName = 'SetEmailModel'
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
    class="relative w-full h-full flex flex-col flex-1 min-h-0 bg-[#1e1e1e] select-none overflow-hidden"
  >
    <!-- Drag & Drop overlay -->
    <div
      v-if="isDragging"
      class="fixed inset-0 z-50 bg-sky-500/20 backdrop-blur-xs border-2 border-dashed border-sky-400 flex items-center justify-center pointer-events-none"
    >
      <div class="bg-[#252526] text-white px-6 py-4 rounded-lg shadow-2xl border border-[#3c3c3c] flex items-center gap-3">
        <FileJson class="w-8 h-8 text-sky-400 animate-bounce" />
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

    <!-- IDE Dual Tabs & Split Workspace -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden">
      <!-- Left Pane: input.json -->
      <div class="glass-panel flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
        <!-- Tab Bar -->
        <div class="glass-header h-9 flex items-center justify-between px-2 text-xs shrink-0 select-none border-b border-white/10">
          <div class="flex items-center h-full">
            <div class="h-full bg-white/10 text-white border-t-2 border-t-sky-400 px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 backdrop-blur-md shadow-inner">
              <FileJson class="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>input.json</span>
              <span v-if="editorStore.rawJson.trim()" class="text-[10px] text-white/60 ml-1">
                {{ editorStore.rawJson.length }}B
              </span>
            </div>
          </div>

          <!-- Tab Actions -->
          <div class="flex items-center gap-1 text-white/70">
            <button
              @click="editorStore.formatJson"
              title="Format JSON (Ctrl+Shift+F)"
              class="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <AlignLeft class="w-3.5 h-3.5" />
            </button>
            <button
              @click="editorStore.minifyJson"
              title="Minify JSON"
              class="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <Shrink class="w-3.5 h-3.5" />
            </button>
            <button
              @click="triggerUploadSelect"
              title="Upload JSON File"
              class="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <Upload class="w-3.5 h-3.5" />
            </button>
            <button
              @click="editorStore.clearJson"
              title="Clear Input"
              class="p-1.5 hover:text-rose-400 hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Editor Host -->
        <div class="relative flex-1 min-h-0 overflow-hidden">
          <JsonEditor />
          <!-- Error Alerts Overlay -->
          <div v-if="!editorStore.isValid" class="absolute bottom-0 inset-x-0 p-3 border-t border-rose-500/30 bg-[#161822]/90 backdrop-blur-xl z-20">
            <ErrorState :message="editorStore.errorMessage" :line="editorStore.lineError" />
          </div>
        </div>
      </div>

      <!-- Right Pane: Model Code Output -->
      <div class="glass-panel flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
        <!-- Tab Bar -->
        <div class="glass-header h-9 flex items-center justify-between px-2 text-xs shrink-0 select-none border-b border-white/10">
          <div class="flex items-center h-full">
            <div class="h-full bg-white/10 text-white border-t-2 border-t-sky-400 px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 backdrop-blur-md shadow-inner">
              <FileCode class="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{{ generatorStore.rootClassName }}.{{ fileExtension }}</span>
              <span class="text-[9px] bg-sky-400/20 text-sky-300 border border-sky-400/30 px-1 rounded uppercase font-bold">
                {{ fileExtension }}
              </span>
            </div>
          </div>

          <!-- Tab Actions -->
          <div class="flex items-center gap-1 text-white/70">
            <button
              @click="handleCopy"
              title="Copy Code (Ctrl+Shift+C)"
              class="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
            </button>
            <button
              @click="handleDownload"
              title="Download File"
              class="p-1.5 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
            >
              <Download class="w-3.5 h-3.5" />
            </button>
            <button
              @click="generatorStore.wordWrap = !generatorStore.wordWrap"
              title="Toggle Word Wrap"
              class="p-1.5 rounded cursor-pointer transition-colors"
              :class="generatorStore.wordWrap ? 'text-sky-300 bg-sky-500/25 border border-sky-400/30' : 'hover:text-white hover:bg-white/10'"
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
