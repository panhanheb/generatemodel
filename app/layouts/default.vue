<script setup lang="ts">
import { computed } from 'vue'
import IdeTitleBar from '../components/ide/IdeTitleBar.vue'
import IdeActivityBar from '../components/ide/IdeActivityBar.vue'
import IdeSidebar from '../components/ide/IdeSidebar.vue'
import IdeStatusBar from '../components/ide/IdeStatusBar.vue'
import ShortcutsSidebar from '../components/ShortcutsSidebar.vue'
import ToastList from '../components/ToastList.vue'
import { useGeneratorStore } from '~/stores/generator.store'

const generatorStore = useGeneratorStore()

const handleSelectTab = (tab: string) => {
  if (generatorStore.activeActivityTab === tab && generatorStore.isSidebarOpen) {
    generatorStore.isSidebarOpen = false
  } else {
    generatorStore.activeActivityTab = tab
    generatorStore.isSidebarOpen = true
  }
}
</script>

<template>
  <div
    class="h-screen w-screen overflow-hidden flex flex-col relative font-sans antialiased select-none text-white/90"
    :style="{ '--glass-intensity': generatorStore.glassIntensity }"
  >
    <!-- Scenic Atmospheric Glass Backdrop Wallpaper -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 scale-105 transition-transform duration-1000"
      style="background-image: url('/images/glass_backdrop.jpg');"
    >
      <!-- Refined liquid diffusion gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#06080e]/65 via-[#0b0e17]/60 to-[#04060a]/75 backdrop-blur-[2px]"></div>
    </div>

    <!-- IDE Shell (iOS 27 Liquid Glass Architecture) -->
    <div class="relative z-10 flex flex-col h-full w-full overflow-hidden">
      <!-- Top Floating Toolbar Capsule -->
      <IdeTitleBar
        @generate="generatorStore.requestGenerate"
        @toggleSidebar="generatorStore.isSidebarOpen = !generatorStore.isSidebarOpen"
      />

      <!-- IDE Center: Activity Rail + Inset Sidebar + Main Workspace -->
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        <!-- Activity Rail (Floating pill rail on desktop, bottom bar on mobile) -->
        <IdeActivityBar
          :activeTab="generatorStore.activeActivityTab"
          :isSidebarOpen="generatorStore.isSidebarOpen"
          @selectTab="handleSelectTab"
          @toggleShortcuts="generatorStore.showShortcuts = !generatorStore.showShortcuts"
        />

        <!-- Primary Inset Sidebar (Collapsible Options / Config / Samples) -->
        <IdeSidebar
          v-show="generatorStore.isSidebarOpen"
          :activeTab="generatorStore.activeActivityTab"
          @generate="generatorStore.requestGenerate"
          @loadSample="generatorStore.requestLoadSample"
        />

        <!-- Main Editor Workspace (Liquid Glass Split Cards) -->
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative px-2 mb-2 md:mb-3">
          <slot />
        </main>
      </div>

      <!-- Bottom Floating Status Bar Capsule -->
      <IdeStatusBar
        @toggleShortcuts="generatorStore.showShortcuts = !generatorStore.showShortcuts"
      />
    </div>

    <!-- Centered Glass Shortcuts Modal -->
    <ShortcutsSidebar v-if="generatorStore.showShortcuts" />

    <!-- Top Sliding Toast Banners -->
    <ToastList />
  </div>
</template>
