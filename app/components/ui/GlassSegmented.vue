<script setup lang="ts">
import { computed } from 'vue'

export interface SegmentOption {
  value: string
  label: string
  icon?: any
  badge?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: SegmentOption[]
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'md'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const select = (val: string) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div
    class="relative inline-flex items-center p-1 rounded-2xl glass-control-track select-none transition-all duration-300 w-full"
    :class="size === 'sm' ? 'text-xs gap-0.5' : 'text-xs gap-1'"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      @click="select(opt.value)"
      class="relative z-10 flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] cursor-pointer"
      :class="[
        modelValue === opt.value
          ? 'text-white font-semibold glass-segmented-active shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
          : 'text-white/60 hover:text-white/90 hover:bg-white/5'
      ]"
    >
      <component :is="opt.icon" v-if="opt.icon" class="w-3.5 h-3.5 shrink-0" />
      <span>{{ opt.label }}</span>
      <span
        v-if="opt.badge"
        class="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-white"
      >
        {{ opt.badge }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.glass-control-track {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.glass-segmented-active {
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root:not(.dark) .glass-control-track {
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
}

:root:not(.dark) .glass-segmented-active {
  background: rgba(255, 255, 255, 0.85);
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), inset 0 1px 1px #fff;
}
</style>
