<script setup lang="ts">
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
  <div class="h-screen w-screen overflow-hidden flex flex-col relative font-sans antialiased select-none text-[#cccccc]">
    <!-- Scenic Atmospheric Glass Backdrop -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 scale-105 transition-transform duration-1000"
      style="background-image: url('/images/glass_backdrop.jpg');"
    >
      <!-- Deep tinted translucent overlay so code text is crisp & readable with frosted blur -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0a0c12]/70 via-[#0d1017]/65 to-[#08090e]/80"></div>
    </div>

    <!-- IDE Shell (Translucent Frosted Glass Architecture) -->
    <div class="relative z-10 flex flex-col h-full w-full overflow-hidden">
      <!-- Top Title & Menu Bar -->
      <IdeTitleBar
        @generate="generatorStore.requestGenerate"
        @toggleSidebar="generatorStore.isSidebarOpen = !generatorStore.isSidebarOpen"
      />

      <!-- IDE Center: Activity Bar + Sidebar + Main Workspace -->
      <div class="flex-1 flex overflow-hidden relative">
        <!-- Activity Bar (Far Left Rail) -->
        <IdeActivityBar
          :activeTab="generatorStore.activeActivityTab"
          :isSidebarOpen="generatorStore.isSidebarOpen"
          @selectTab="handleSelectTab"
          @toggleShortcuts="generatorStore.showShortcuts = !generatorStore.showShortcuts"
        />

        <!-- Primary Sidebar (Collapsible Explorer / Config) -->
        <IdeSidebar
          v-show="generatorStore.isSidebarOpen"
          :activeTab="generatorStore.activeActivityTab"
          @generate="generatorStore.requestGenerate"
          @loadSample="generatorStore.requestLoadSample"
        />

        <!-- Main Editor Workspace -->
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <slot />
        </main>
      </div>

      <!-- Bottom Status Bar -->
      <IdeStatusBar
        @toggleShortcuts="generatorStore.showShortcuts = !generatorStore.showShortcuts"
      />
    </div>

    <!-- Shortcuts Drawer -->
    <ShortcutsSidebar v-if="generatorStore.showShortcuts" />

    <!-- Toast Notifications -->
    <ToastList />
  </div>
</template>
