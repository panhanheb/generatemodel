<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Keyboard,
  Globe,
  Sparkles
} from 'lucide-vue-next'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore, LANGUAGES } from '~/stores/generator.store'

const emit = defineEmits<{
  (e: 'toggleShortcuts'): void
}>()

const editorStore = useEditorStore()
const generatorStore = useGeneratorStore()

const currentLangName = computed(() => {
  const lang = LANGUAGES.find(l => l.id === generatorStore.selectedLanguage)
  return lang ? lang.name : generatorStore.selectedLanguage
})

const currentStyleName = computed(() => {
  const langObj = LANGUAGES.find(l => l.id === generatorStore.selectedLanguage)
  const styleObj = langObj?.options.find(o => o.id === generatorStore.selectedFramework)
  return styleObj ? styleObj.name : generatorStore.selectedFramework
})
</script>

<template>
  <footer class="px-3 pb-2 pt-0 shrink-0 z-30 select-none">
    <div class="glass-toolbar-capsule h-8 px-4 text-white flex items-center justify-between text-[11px] font-sans shadow-md">
      <!-- Left: Validation state & Metrics -->
      <div class="flex items-center gap-3">
        <!-- JSON Validity Indicator -->
        <div
          class="flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-colors"
          :class="editorStore.isValid ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/20 text-red-300 font-semibold'"
          :title="editorStore.isValid ? 'Valid JSON payload' : editorStore.errorMessage || 'Invalid JSON'"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="editorStore.isValid ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,199,89,0.8)]' : 'bg-red-400 animate-pulse'"
          ></span>
          <span>{{ editorStore.isValid ? 'JSON Valid' : `Error: Line ${editorStore.lineError || '?'}` }}</span>
        </div>

        <!-- Metric counter -->
        <div v-if="editorStore.rawJson.trim()" class="hidden sm:inline text-white/50 font-mono text-[10px]">
          {{ editorStore.rawJson.length.toLocaleString() }} chars
        </div>
      </div>

      <!-- Center: Required Mode & Language -->
      <div class="flex items-center gap-2">
        <!-- Required Mode Pill -->
        <div
          class="hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[10px]"
          title="Active Required Fields Mode"
        >
          <span class="text-white/40">Req:</span>
          <span class="font-bold uppercase text-blue-300">{{ generatorStore.requiredMode }}</span>
        </div>

        <!-- Target Info Pill -->
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
          <Globe class="w-3 h-3 text-blue-400" />
          <span>{{ currentLangName }}</span>
          <span class="text-white/40 hidden sm:inline">&bull; {{ currentStyleName }}</span>
        </div>
      </div>

      <!-- Right: Encoding & Shortcuts -->
      <div class="flex items-center gap-2 text-white/60">
        <!-- Safe Defaults Toggle -->
        <button
          @click="generatorStore.checkDefaultValue = !generatorStore.checkDefaultValue"
          class="hidden lg:flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          :title="`Safe Defaults (null/0 fallbacks): ${generatorStore.checkDefaultValue ? 'ON' : 'OFF'}`"
        >
          <ShieldCheck class="w-3 h-3" :class="generatorStore.checkDefaultValue ? 'text-emerald-400' : 'text-white/40'" />
          <span class="text-[10px] font-mono">Defaults: {{ generatorStore.checkDefaultValue ? 'ON' : 'OFF' }}</span>
        </button>

        <span class="hidden xl:inline text-white/40 text-[10px] font-mono">UTF-8</span>

        <button
          @click="emit('toggleShortcuts')"
          title="Keyboard Shortcuts"
          class="hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer active:scale-90"
        >
          <Keyboard class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </footer>
</template>
