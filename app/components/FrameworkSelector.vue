<script setup lang="ts">
import { useGeneratorStore, LANGUAGES } from '~/stores/generator.store'
import { computed } from 'vue'

const generatorStore = useGeneratorStore()

const currentOptions = computed(() => {
  const langObj = LANGUAGES.find(l => l.id === generatorStore.selectedLanguage)
  return langObj ? langObj.options : []
})
</script>

<template>
  <div v-if="currentOptions.length > 1" class="flex flex-wrap items-center gap-2">
    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">Style:</span>
    <div class="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/55 border border-slate-200 dark:border-slate-800/80 p-0.5 rounded-xl">
      <button
        v-for="opt in currentOptions"
        :key="opt.id"
        type="button"
        @click="generatorStore.selectedFramework = opt.id"
        class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
        :class="generatorStore.selectedFramework === opt.id ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
      >
        {{ opt.name }}
      </button>
    </div>
  </div>
</template>
