<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title?: string
    maxWidth?: string
  }>(),
  {
    maxWidth: 'max-w-xl'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="glass-sheet">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <!-- Backdrop -->
        <div
          @click="emit('close')"
          class="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        ></div>

        <!-- Sheet Panel -->
        <div
          class="relative w-full rounded-3xl glass-sheet-panel border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden flex flex-col max-h-[85vh] z-10"
          :class="maxWidth"
        >
          <!-- Drag Handle Indicator (iOS sheet style) -->
          <div class="pt-2.5 pb-1 flex justify-center">
            <div class="w-10 h-1.5 rounded-full bg-white/25"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
            <h2 class="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <slot name="icon" />
              <span>{{ title }}</span>
            </h2>

            <button
              @click="emit('close')"
              class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer active:scale-90"
              title="Close (Esc)"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body Content -->
          <div class="p-6 overflow-y-auto flex-1 min-h-0 text-xs text-white/80 space-y-4">
            <slot />
          </div>

          <!-- Footer slot (optional) -->
          <div v-if="$slots.footer" class="px-6 py-3 bg-white/5 border-t border-white/10 flex justify-end gap-2 shrink-0">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.glass-sheet-panel {
  background: rgba(22, 26, 36, 0.78);
  backdrop-filter: blur(var(--glass-blur, 32px)) saturate(190%);
  -webkit-backdrop-filter: blur(var(--glass-blur, 32px)) saturate(190%);
}

.glass-sheet-enter-active,
.glass-sheet-leave-active {
  transition: all 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.glass-sheet-enter-from,
.glass-sheet-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(12px);
}
</style>
