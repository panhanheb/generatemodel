<script setup lang="ts">
import { computed } from 'vue'
import { GitBranch, Check, AlertCircle, ShieldCheck, Keyboard, Bell, Sparkles } from 'lucide-vue-next'
import { useEditorStore } from '~/stores/editor.store'
import { useGeneratorStore, LANGUAGES } from '~/stores/generator.store'

const emit = defineEmits(['toggleShortcuts'])

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
  <footer class="glass-status-bar h-6 text-white flex items-center justify-between px-3 text-[11px] select-none shrink-0 z-30 font-sans shadow-md">
    <!-- Left Section: Git, Status, Warnings -->
    <div class="flex items-center gap-3">
      <!-- Git Branch -->
      <div class="flex items-center gap-1 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors" title="Branch: main">
        <GitBranch class="w-3.5 h-3.5" />
        <span class="font-medium">main*</span>
      </div>

      <!-- JSON Validation Status -->
      <div
        class="flex items-center gap-1 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        :title="editorStore.isValid ? 'JSON is valid' : editorStore.errorMessage || 'Invalid JSON'"
      >
        <template v-if="editorStore.isValid">
          <Check class="w-3.5 h-3.5" />
          <span>JSON Valid</span>
        </template>
        <template v-else>
          <AlertCircle class="w-3.5 h-3.5 text-amber-200" />
          <span class="text-amber-100 font-medium">Error: Line {{ editorStore.lineError || '?' }}</span>
        </template>
      </div>

      <!-- Live Char/Line Counter -->
      <div v-if="editorStore.rawJson.trim()" class="hidden md:flex items-center text-white/80">
        {{ editorStore.rawJson.length.toLocaleString() }} chars
      </div>
    </div>

    <!-- Right Section: Language, Null Check Toggle, Encoding, Spaces -->
    <div class="flex items-center gap-1 sm:gap-2">
      <!-- Default Null or 0 Toggle -->
      <button
        @click="generatorStore.checkDefaultValue = !generatorStore.checkDefaultValue"
        class="flex items-center gap-1 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
        :title="generatorStore.checkDefaultValue ? 'Default null/0 is ON (Click to toggle)' : 'Default null/0 is OFF (Click to toggle)'"
      >
        <ShieldCheck class="w-3 h-3" />
        <span>Default null/0:</span>
        <span class="font-bold underline">{{ generatorStore.checkDefaultValue ? 'ON' : 'OFF' }}</span>
      </button>

      <!-- Active Language -->
      <div class="hidden sm:flex items-center hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors font-medium">
        {{ currentLangName }}
      </div>

      <!-- Active Style -->
      <div class="hidden md:flex items-center text-white/80 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
        {{ currentStyleName }}
      </div>

      <!-- Encoding & Formatting -->
      <div class="hidden lg:flex items-center text-white/80 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
        UTF-8
      </div>

      <div class="hidden lg:flex items-center text-white/80 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
        Spaces: 2
      </div>

      <!-- Shortcuts / Bell -->
      <button
        @click="emit('toggleShortcuts')"
        title="Keyboard Shortcuts"
        class="hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors flex items-center"
      >
        <Keyboard class="w-3.5 h-3.5" />
      </button>
    </div>
  </footer>
</template>
