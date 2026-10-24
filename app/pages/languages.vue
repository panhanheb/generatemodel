<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LANGUAGES } from '~/constants/languages'
import { SITE } from '~/constants/site'
import { useGeneratorStore } from '~/stores/generator.store'
import { useToast } from '~/composables/useToast'
import {
  Globe,
  Search,
  Check,
  ArrowLeft,
  Sparkles,
  Layers,
  Code2
} from 'lucide-vue-next'

useHead({
  title: `Supported Languages — ${SITE.name}`,
  meta: [
    { name: 'description', content: `Browse all ${LANGUAGES.length} languages and frameworks supported by ${SITE.name}, from Flutter and Laravel to TypeScript, Go, and Prisma.` }
  ]
})

const router = useRouter()
const generatorStore = useGeneratorStore()
const toast = useToast()

const searchQuery = ref('')
const totalStyles = LANGUAGES.reduce((sum, l) => sum + l.options.length, 0)

const filteredLanguages = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return LANGUAGES
  return LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.id.toLowerCase().includes(q) ||
    l.options.some(o => o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  )
})

const selectLanguageAndStyle = (langId: string, styleId?: string) => {
  generatorStore.selectedLanguage = langId
  if (styleId) {
    generatorStore.selectedFramework = styleId
  } else {
    const langObj = LANGUAGES.find(l => l.id === langId)
    if (langObj && langObj.options.length > 0) {
      generatorStore.selectedFramework = langObj.options[0].id
    }
  }
  toast.success(`Target set to ${generatorStore.selectedLanguage}`)
  router.push('/')
}
</script>

<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden text-[var(--text-primary)] select-none">
    <!-- iOS 27 Floating Glass Navigation Bar -->
    <header class="glass-header h-14 flex items-center justify-between px-6 border-b border-[var(--glass-border)] shrink-0 z-20">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-3.5 py-1.5 glass-capsule hover:scale-105 active:scale-95 text-xs font-medium text-[var(--text-primary)] transition-all cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>Back to Studio</span>
        </NuxtLink>
        <div class="h-4 w-px bg-[var(--glass-border)]"></div>
        <span class="text-xs text-[var(--text-secondary)] font-mono">
          {{ LANGUAGES.length }} Languages &bull; {{ totalStyles }} Styles
        </span>
      </div>

      <!-- Quick Search input in nav bar -->
      <div class="relative w-64 max-w-xs hidden sm:block">
        <Search class="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search languages..."
          class="glass-input w-full rounded-full pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] outline-none transition-all placeholder-[var(--text-muted)]"
        />
      </div>
    </header>

    <!-- Scrollable Content -->
    <div class="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-8 select-text">
      <!-- Large Apple-style Page Title -->
      <div class="max-w-6xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-[var(--accent-color)] bg-[var(--accent-subtle)] border border-[var(--accent-color)]/20">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Universal Polyglot Engine</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Languages & Frameworks
        </h1>
        <p class="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Select any of the {{ LANGUAGES.length }} target languages or {{ totalStyles }} framework architectural styles below.
          Typed models, serialization schemas, and required-field rules will adapt in real-time.
        </p>

        <!-- Mobile search input -->
        <div class="relative w-full sm:hidden pt-2">
          <Search class="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-5 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search languages or styles..."
            class="glass-input w-full rounded-full pl-9 pr-4 py-2 text-xs text-[var(--text-primary)] outline-none transition-all placeholder-[var(--text-muted)]"
          />
        </div>
      </div>

      <!-- Language Cards Grid -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
        <article
          v-for="lang in filteredLanguages"
          :key="lang.id"
          class="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group"
          :class="generatorStore.selectedLanguage === lang.id ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/30' : ''"
        >
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--accent-subtle)] text-[var(--accent-color)] border border-[var(--accent-color)]/20 shadow-sm">
                  <Code2 class="w-4 h-4" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                    {{ lang.name }}
                  </h2>
                  <span class="text-[10px] font-mono text-[var(--text-muted)]">{{ lang.id }}</span>
                </div>
              </div>

              <span
                v-if="generatorStore.selectedLanguage === lang.id"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[var(--accent-color)] text-white shadow-sm"
              >
                Active
              </span>
            </div>

            <!-- Styles Segment Pills -->
            <div class="mt-4 space-y-2">
              <label class="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Framework Styles
              </label>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="opt in lang.options"
                  :key="opt.id"
                  @click="selectLanguageAndStyle(lang.id, opt.id)"
                  class="px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border text-left active:scale-95"
                  :class="generatorStore.selectedLanguage === lang.id && generatorStore.selectedFramework === opt.id
                    ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white font-medium shadow-md shadow-[var(--accent-color)]/25'
                    : 'glass-pill text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--glass-border-strong)]'"
                  :title="`Switch to ${lang.name} (${opt.name})`"
                >
                  <span>{{ opt.name }}</span>
                  <Check
                    v-if="generatorStore.selectedLanguage === lang.id && generatorStore.selectedFramework === opt.id"
                    class="w-3 h-3 text-white"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="mt-6 pt-3.5 border-t border-[var(--glass-border)] flex items-center justify-between">
            <span class="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <Layers class="w-3 h-3" />
              <span>{{ lang.options.length }} {{ lang.options.length === 1 ? 'architecture' : 'architectures' }}</span>
            </span>
            <button
              @click="selectLanguageAndStyle(lang.id)"
              class="text-xs font-semibold text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
            >
              <span>Use Target</span>
              <span>&rarr;</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
