<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: any
  iconBg?: string
}>()
</script>

<template>
  <div class="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors hover:bg-white/5 select-none">
    <!-- Left: Icon + Label -->
    <div class="flex items-center gap-2.5 min-w-0 flex-1">
      <div
        v-if="icon"
        class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
        :class="iconBg || 'bg-blue-500/20 text-blue-400 border border-blue-400/30'"
      >
        <component :is="icon" class="w-3.5 h-3.5" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="font-medium text-white/90 truncate">{{ title }}</div>
        <div v-if="subtitle" class="text-[11px] text-white/50 truncate leading-snug">
          {{ subtitle }}
        </div>
      </div>
    </div>

    <!-- Right: Control Slot -->
    <div class="shrink-0 flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>
