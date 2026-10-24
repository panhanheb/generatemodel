<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    leftLabel?: string
    rightLabel?: string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    leftLabel: 'Clear',
    rightLabel: 'Tinted'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

const percentage = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return Math.min(100, Math.max(0, ((props.modelValue - props.min) / range) * 100))
})

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', parseFloat(target.value))
}
</script>

<template>
  <div class="w-full space-y-1.5 select-none">
    <div v-if="leftLabel || rightLabel" class="flex justify-between items-center text-[11px] text-white/50 px-1 font-medium">
      <span>{{ leftLabel }}</span>
      <span class="font-mono text-white/80 text-[10px]">{{ modelValue }}%</span>
      <span>{{ rightLabel }}</span>
    </div>

    <div class="relative flex items-center h-7 w-full">
      <!-- Background track -->
      <div class="absolute inset-x-0 h-2 rounded-full bg-white/10 dark:bg-black/40 border border-white/10 dark:border-white/5 overflow-hidden">
        <!-- Filled progress -->
        <div
          class="h-full bg-gradient-to-r from-blue-500/70 to-[#0A84FF] transition-[width] duration-75"
          :style="{ width: `${percentage}%` }"
        ></div>
      </div>

      <!-- Native Range Input Invisible Overlay -->
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onInput"
        class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />

      <!-- Visual Glass Thumb Indicator -->
      <div
        class="pointer-events-none absolute h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/40 -translate-x-1/2 transition-[left] duration-75 flex items-center justify-center z-10"
        :style="{ left: `${percentage}%` }"
      >
        <div class="w-1.5 h-1.5 rounded-full bg-blue-500/80"></div>
      </div>
    </div>
  </div>
</template>
