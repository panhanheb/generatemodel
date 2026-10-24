<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { SITE } from '~/constants/site'
import { LANGUAGES } from '~/constants/languages'
import { useGeneratorStore } from '~/stores/generator.store'
import {
  FileJson,
  FileCode,
  BookOpen,
  X,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Share2,
  Lock,
  Keyboard,
  Compass
} from 'lucide-vue-next'

useHead({
  title: `Documentation — ${SITE.name}`,
  meta: [{ name: 'description', content: `How to use ${SITE.name}: paste or upload JSON, pick a target language, and export strongly-typed models.` }]
})

const router = useRouter()
const generatorStore = useGeneratorStore()

const fileExtension = computed(() => {
  const lang = generatorStore.selectedLanguage
  switch (lang) {
    case 'flutter': return 'dart'
    case 'typescript': case 'nodejs': case 'nestjs': return 'ts'
    case 'javascript': return 'js'
    case 'java': case 'spring_boot': return 'java'
    case 'kotlin': return 'kt'
    case 'swift': return 'swift'
    case 'go': return 'go'
    case 'csharp': case 'asp_net': return 'cs'
    case 'php': case 'laravel': return 'php'
    case 'python': return 'py'
    case 'rust': return 'rs'
    default: return 'txt'
  }
})

const steps = [
  { title: 'Provide JSON', body: 'Paste JSON into the editor, upload a .json / .txt file, or drag & drop a file directly into the workspace.' },
  { title: 'Validate & Format', body: 'The editor validates JSON as you type and displays exact error lines. Use Format (Ctrl+Shift+F) to beautify or Minify to compact.' },
  { title: 'Choose a Target Language', body: 'Pick a language and framework style (e.g. Flutter Freezed, TypeScript Interface, Python Pydantic) in the Target Configuration sidebar.' },
  { title: 'Export & Share', body: 'Models regenerate automatically. Copy code (Ctrl+Shift+C), download the source file, or generate a permalink to share with teammates.' }
]

const shortcuts = [
  { keys: 'Ctrl + Enter', action: 'Regenerate models' },
  { keys: 'Ctrl + Shift + F', action: 'Format JSON document' },
  { keys: 'Ctrl + Shift + C', action: 'Copy generated model code' },
  { keys: 'Ctrl + B', action: 'Toggle Primary Sidebar' },
  { keys: 'Ctrl + K  Ctrl + S', action: 'Open Keyboard Shortcuts dialog' }
]

const features = [
  { title: 'Smart Type Inference', body: 'QuickType-grade engine that deduplicates common types, detects optional & nullable fields, UUIDs, dates, and colors.', icon: Zap },
  { title: 'Sound Null Safety & Fallbacks', body: 'Default null/0 assigns safe variable fallbacks (0, 0.0, "", false, [], DateTime.now()) based on property types.', icon: CheckCircle2 },
  { title: `${LANGUAGES.length} Languages & Frameworks`, body: 'Covers Flutter, Laravel, Swift, TypeScript, Go, Kotlin, Python, Rust, Prisma, and more.', icon: Globe },
  { title: 'Shareable Permalinks', body: 'Share your exact input JSON, selected language, style, and settings via a compact compressed link.', icon: Share2 },
  { title: '100% Client-Side & Private', body: 'Generation runs entirely in your local browser sandbox. Your data is never sent to or stored on external servers.', icon: Lock }
]
</script>

<template>
  <div class="glass-panel h-full flex flex-col min-h-0 overflow-hidden text-[#cccccc] select-none">
    <!-- VS Code Top Editor Tab Bar -->
    <div class="glass-header h-9 flex items-center justify-between px-2 text-xs shrink-0 select-none border-b border-white/10">
      <!-- Tabs List -->
      <div class="flex items-center h-full">
        <!-- input.json Tab (Inactive) -->
        <NuxtLink
          to="/"
          class="h-full px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FileJson class="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>input.json</span>
        </NuxtLink>

        <!-- Model Code Tab (Inactive) -->
        <NuxtLink
          to="/"
          class="h-full px-3 flex items-center gap-2 font-mono text-xs cursor-pointer border-r border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FileCode class="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{{ generatorStore.rootClassName }}.{{ fileExtension }}</span>
        </NuxtLink>

        <!-- Documentation Tab (ACTIVE) -->
        <div class="h-full bg-white/10 text-white border-t-2 border-t-sky-400 px-3 flex items-center gap-2 font-mono text-xs border-r border-white/10 backdrop-blur-md shadow-inner">
          <BookOpen class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Documentation</span>
          <NuxtLink
            to="/"
            title="Close Tab"
            class="ml-2 p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>

      <!-- Tab Actions Right -->
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 px-2.5 py-1 glass-pill hover:bg-white/15 rounded-md text-[11px] text-white transition-all cursor-pointer"
        >
          <ArrowLeft class="w-3 h-3" />
          <span>Back to Editor</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 select-text max-w-4xl pb-12">
      <!-- Header -->
      <div class="border-b border-white/10 pb-4">
        <h1 class="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-emerald-400" />
          Documentation & Guide
        </h1>
        <p class="text-xs text-white/60 mt-1">
          {{ SITE.name }} converts raw JSON payloads into strongly-typed model code across 24+ languages.
        </p>
      </div>

      <!-- Section: Getting Started -->
      <section class="space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
          <Compass class="w-4 h-4 text-sky-400" />
          Workflow Steps
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="glass-card rounded-xl p-4 flex gap-3"
          >
            <span class="flex-none w-6 h-6 rounded bg-sky-400/20 text-sky-300 font-bold font-mono text-xs flex items-center justify-center border border-sky-400/40">
              {{ i + 1 }}
            </span>
            <div>
              <h3 class="text-xs font-bold text-white">{{ step.title }}</h3>
              <p class="text-xs text-white/70 mt-1 leading-relaxed">{{ step.body }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Key Capabilities -->
      <section class="space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
          <Sparkles class="w-4 h-4 text-amber-400" />
          Key Capabilities
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="f in features"
            :key="f.title"
            class="glass-card rounded-xl p-4 space-y-1.5"
          >
            <div class="flex items-center gap-2">
              <component :is="f.icon" class="w-4 h-4 text-sky-400" />
              <h3 class="text-xs font-bold text-white">{{ f.title }}</h3>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">{{ f.body }}</p>
          </div>
        </div>
      </section>

      <!-- Section: Keyboard Shortcuts -->
      <section class="space-y-3">
        <h2 class="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
          <Keyboard class="w-4 h-4 text-purple-400" />
          Quick Keyboard Shortcuts
        </h2>
        <div class="glass-card rounded-xl divide-y divide-white/10 overflow-hidden text-xs">
          <div
            v-for="s in shortcuts"
            :key="s.keys"
            class="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
          >
            <span class="text-[#cccccc]">{{ s.action }}</span>
            <span class="font-mono text-[11px] bg-white/10 text-sky-300 px-2 py-0.5 rounded border border-white/15">
              {{ s.keys }}
            </span>
          </div>
        </div>
      </section>

      <!-- Footer Quick Link -->
      <div class="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
        <span class="text-white/60">Looking for supported languages & frameworks?</span>
        <NuxtLink to="/languages" class="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
          <span>View Supported Languages</span>
          <span>&rarr;</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
