<script setup lang="ts">
import { useToast } from '../composables/useToast'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed top-4 inset-x-0 mx-auto z-50 flex flex-col items-center gap-2 max-w-sm sm:max-w-md w-full px-4 pointer-events-none">
    <TransitionGroup
      name="toast"
      enter-active-class="transition duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] transform"
      enter-from-class="-translate-y-6 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-250 ease-in transform"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="-translate-y-6 opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border shadow-[0_16px_36px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-all duration-300 w-full"
        :class="{
          'bg-emerald-950/70 border-emerald-400/40 text-emerald-200': toast.type === 'success',
          'bg-rose-950/70 border-rose-400/40 text-rose-200': toast.type === 'error',
          'bg-amber-950/70 border-amber-400/40 text-amber-200': toast.type === 'warning',
          'bg-slate-900/80 border-white/20 text-white': toast.type === 'info'
        }"
      >
        <div class="shrink-0">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400" />
          <XCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-rose-400" />
          <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-400" />
          <Info v-else class="w-4 h-4 text-blue-400" />
        </div>

        <div class="flex-1 text-xs font-semibold truncate">
          {{ toast.message }}
        </div>

        <button
          @click="removeToast(toast.id)"
          class="shrink-0 p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer active:scale-90"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-move {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
</style>
