<script setup lang="ts">
import { computed } from 'vue'
import { Keyboard, Command, Sparkles, SlidersHorizontal, BookOpen } from 'lucide-vue-next'
import { useGeneratorStore } from '~/stores/generator.store'
import GlassSheet from './ui/GlassSheet.vue'

const generatorStore = useGeneratorStore()

const isMac = computed(() => {
  if (typeof window !== 'undefined' && navigator) {
    return /Mac|iPod|iPhone|iPad/.test(navigator.platform || '')
  }
  return false
})

const shortcutGroups = computed(() => [
  {
    title: 'Code Generation & Actions',
    items: [
      { action: 'Generate Model Code', keys: isMac.value ? '⌘ + Enter' : 'Ctrl + Enter' },
      { action: 'Format JSON Payload', keys: isMac.value ? '⌘ + Shift + F' : 'Ctrl + Shift + F' },
      { action: 'Copy Generated Code', keys: isMac.value ? '⌘ + Shift + C' : 'Ctrl + Shift + C' },
      { action: 'Toggle Sidebar Panel', keys: isMac.value ? '⌘ + B' : 'Ctrl + B' }
    ]
  },
  {
    title: 'Navigation & Dialogs',
    items: [
      { action: 'Open Keyboard Shortcuts', keys: isMac.value ? '⌘ + K  ⌘ + S' : 'Ctrl + K  Ctrl + S' },
      { action: 'Close Dialogs / Popovers', keys: 'Esc' },
      { action: 'Toggle Shortcuts Hint', keys: '?' }
    ]
  }
])

const close = () => {
  generatorStore.showShortcuts = false
}
</script>

<template>
  <GlassSheet
    :isOpen="generatorStore.showShortcuts"
    title="Keyboard Shortcuts"
    maxWidth="max-w-md"
    @close="close"
  >
    <template #icon>
      <Keyboard class="w-4 h-4 text-blue-400" />
    </template>

    <div class="space-y-4">
      <div
        v-for="group in shortcutGroups"
        :key="group.title"
        class="space-y-2"
      >
        <div class="text-[11px] font-semibold uppercase tracking-wider text-white/50 px-1">
          {{ group.title }}
        </div>

        <div class="rounded-2xl glass-inset-box divide-y divide-white/10 overflow-hidden text-xs">
          <div
            v-for="item in group.items"
            :key="item.action"
            class="flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition-colors"
          >
            <span class="text-white/80 font-medium">{{ item.action }}</span>
            <kbd class="px-2 py-0.5 rounded-lg bg-white/10 text-blue-300 font-mono text-[11px] border border-white/15 shadow-inner">
              {{ item.keys }}
            </kbd>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        @click="close"
        class="px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs shadow-md transition-all active:scale-95 cursor-pointer"
      >
        Got it
      </button>
    </template>
  </GlassSheet>
</template>

<style scoped>
.glass-inset-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
