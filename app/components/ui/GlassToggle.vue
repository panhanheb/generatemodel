<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    disabled?: boolean
    id?: string
    name?: string
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :id="id"
    @click="toggle"
    class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 select-none"
    :class="[
      modelValue
        ? 'bg-[#007AFF] dark:bg-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.45)]'
        : 'bg-black/15 dark:bg-white/15 border border-black/5 dark:border-white/10'
    ]"
  >
    <span
      class="pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
    >
      <!-- Subtly glossy refraction center on knob -->
      <span class="block h-full w-full rounded-full bg-gradient-to-b from-white/90 via-white/50 to-white/10 opacity-70"></span>
    </span>
  </button>
</template>
