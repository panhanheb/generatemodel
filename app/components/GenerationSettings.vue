<script setup lang="ts">
import { Sparkles, ShieldCheck } from 'lucide-vue-next'
import FrameworkSelector from './FrameworkSelector.vue'
import { useGeneratorStore } from '~/stores/generator.store'

const generatorStore = useGeneratorStore()
const emit = defineEmits(['generate'])
</script>

<template>
  <div class="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 px-3.5 py-2 rounded-2xl transition-all shadow-xs flex flex-wrap items-center justify-between gap-3 min-h-[46px]">
    <div class="flex flex-wrap items-center gap-3">
      <FrameworkSelector />

      <!-- Default null or 0 check by variable type -->
      <label
        class="flex items-center gap-2 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none transition-all shadow-2xs shrink-0"
        title="Check default values by variable type (e.g. 0 for int, 0.0 for double, '' for String, false for bool, [] for List, or null if nullable)"
      >
        <input
          type="checkbox"
          v-model="generatorStore.checkDefaultValue"
          class="w-3.5 h-3.5 rounded text-brand-primary focus:ring-brand-primary accent-brand-primary cursor-pointer"
        />
        <div class="flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5 text-brand-primary" />
          <span>Default null / 0</span>
        </div>
      </label>
    </div>

    <button
      type="button"
      @click="emit('generate')"
      class="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-brand-primary/10 transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0 ml-auto"
    >
      <Sparkles class="w-3.5 h-3.5" />
      <span>Generate Model</span>
    </button>
  </div>
</template>
