<script setup lang="ts">
import { FileUp, Clipboard, Wand2 } from 'lucide-vue-next'

const emit = defineEmits(['loadSample', 'triggerUpload', 'triggerPaste'])
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-auto bg-transparent text-[#cccccc] p-6 z-10">
    <!-- VisionOS Frosted Glass Quick Action Card Container -->
    <div class="space-y-3 max-w-sm w-full text-xs">
      <div
        @click="emit('loadSample')"
        class="glass-card py-2.5 px-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200"
      >
        <span class="text-[#e2e8f0] group-hover:text-white flex items-center gap-2.5 font-medium">
          <Wand2 class="w-4 h-4 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          Load Sample JSON
        </span>
        <span class="font-mono text-[11px] text-[#aaaaaa] bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15 backdrop-blur-md">
          Ctrl + Enter
        </span>
      </div>

      <div
        @click="emit('triggerPaste')"
        class="glass-card py-2.5 px-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200"
      >
        <span class="text-[#e2e8f0] group-hover:text-white flex items-center gap-2.5 font-medium">
          <Clipboard class="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          Paste from Clipboard
        </span>
        <span class="font-mono text-[11px] text-[#aaaaaa] bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15 backdrop-blur-md">
          Ctrl + V
        </span>
      </div>

      <div
        @click="emit('triggerUpload')"
        class="glass-card py-2.5 px-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all duration-200"
      >
        <span class="text-[#e2e8f0] group-hover:text-white flex items-center gap-2.5 font-medium">
          <FileUp class="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          Upload JSON / TXT File
        </span>
        <span class="font-mono text-[11px] text-[#aaaaaa] bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15 backdrop-blur-md">
          Drop File
        </span>
      </div>
    </div>
  </div>
</template>
