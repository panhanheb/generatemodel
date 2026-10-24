<script setup lang="ts">
defineProps<{
  title?: string
  footer?: string
}>()
</script>

<template>
  <div class="space-y-1.5 w-full">
    <!-- Header -->
    <div
      v-if="title"
      class="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/50"
    >
      {{ title }}
    </div>

    <!-- Inset Grouped Container -->
    <div
      class="glass-inset-card rounded-2xl overflow-hidden divide-y divide-white/10 dark:divide-white/8 transition-all duration-300"
    >
      <slot />
    </div>

    <!-- Footer Note -->
    <div
      v-if="footer"
      class="px-3 text-[11px] text-white/50 leading-relaxed"
    >
      {{ footer }}
    </div>
  </div>
</template>

<style scoped>
.glass-inset-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(var(--glass-blur, 24px)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur, 24px)) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px -4px rgba(0, 0, 0, 0.3);
}

:root:not(.dark) .glass-inset-card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8);
}
</style>
