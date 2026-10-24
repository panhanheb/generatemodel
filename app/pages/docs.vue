<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { SITE } from '~/constants/site'
import { LANGUAGES } from '~/constants/languages'
import { useGeneratorStore } from '~/stores/generator.store'
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Share2,
  Lock,
  Keyboard,
  Compass,
  Sliders,
  ShieldCheck,
  Check
} from 'lucide-vue-next'

useHead({
  title: `Documentation — ${SITE.name}`,
  meta: [{ name: 'description', content: `How to use ${SITE.name}: paste or upload JSON, configure required fields, pick a target language, and export strongly-typed models.` }]
})

const router = useRouter()
const generatorStore = useGeneratorStore()

const steps = [
  { title: '1. Provide JSON Payload', body: 'Paste raw JSON into the studio, upload a file (.json, .txt), or drop files directly onto the editor. Nested objects, heterogeneous arrays, and sample lists are automatically inspected.' },
  { title: '2. Select Language & Architecture', body: 'Pick from 24+ languages and frameworks (Dart Freezed, TS Interface, NestJS DTO, Zod, Kotlin, Swift, Python Pydantic, Go, Rust serde, Prisma, etc.).' },
  { title: '3. Fine-Tune Required Fields', body: 'Choose your nullability strategy: Inferred (QuickType behaviour), All required, None optional, or Custom per-field toggles. Safe fallback values ensure runtime resilience.' },
  { title: '4. Export & Collaborate', body: 'Copy clean code (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>), download source files with accurate extensions, or copy shareable permalinks to share your model state.' }
]

const requiredModesDoc = [
  {
    mode: 'Inferred (Recommended)',
    desc: 'Fields are marked required only if they exist in 100% of samples and are never null. Absent or nullable keys in array samples become optional.'
  },
  {
    mode: 'All Required',
    desc: 'Every single field is treated as non-nullable and strictly required. Ideal for strict API contracts in Dart, Kotlin, and Swift.'
  },
  {
    mode: 'None (All Optional)',
    desc: 'All fields become optional/nullable (`?`, `Optional[...]`, pointer, or `@IsOptional()`). Ideal for partial patch update models.'
  },
  {
    mode: 'Custom Per-Field',
    desc: 'Inspect detected models in the sidebar and toggle each field individually as required or optional with one click.'
  }
]

const shortcuts = [
  { keys: 'Ctrl + Enter', action: 'Regenerate typed models' },
  { keys: 'Ctrl + Shift + F', action: 'Format JSON document' },
  { keys: 'Ctrl + Shift + C', action: 'Copy generated model code' },
  { keys: 'Ctrl + B', action: 'Toggle Sidebar' },
  { keys: 'Ctrl + K  Ctrl + S', action: 'Open Keyboard Shortcuts sheet' }
]

const features = [
  { title: 'Smart Type Inference', body: 'Advanced parser merges object samples across arrays, recognizes UUIDs, ISO 8601 timestamps, dates, colors, and deduplicates shared schemas.', icon: Zap },
  { title: 'Required Fields Control', body: 'Comprehensive nullability logic supporting Inferred, All, None, and Custom overrides across all 24 emitters.', icon: Sliders },
  { title: 'Safe Default Fallbacks', body: 'Optionally assigns zero-fallbacks (0, 0.0, "", false, [], DateTime.now()) to eliminate runtime NPEs.', icon: ShieldCheck },
  { title: `${LANGUAGES.length} Languages & Frameworks`, body: 'From mobile (Flutter, Swift, Kotlin) to backend (NestJS, Go, Spring, Laravel) and databases (Prisma, Mongoose, TypeORM).', icon: Globe },
  { title: 'Compressed Permalinks', body: 'Share your exact payload and generator options via a compact URL hash (#s=) or ID, 100% client-side.', icon: Share2 },
  { title: '100% Client-Side Privacy', body: 'Generation runs entirely in your local browser sandbox. Your payload data is never transmitted to any external server.', icon: Lock }
]
</script>

<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden text-[var(--text-primary)] select-none">
    <!-- iOS 27 Navigation Header -->
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
          System Guide & Specifications
        </span>
      </div>
    </header>

    <!-- Scrollable Content -->
    <div class="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-10 select-text max-w-5xl mx-auto w-full pb-20">
      <!-- Apple Hero Title -->
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-[var(--accent-color)] bg-[var(--accent-subtle)] border border-[var(--accent-color)]/20">
          <BookOpen class="w-3.5 h-3.5" />
          <span>Documentation & Architecture</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Quick Start & Guide
        </h1>
        <p class="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {{ SITE.name }} converts raw JSON payloads into strongly-typed model code across 24+ languages,
          with AST type inference, customizable nullability strategies, and liquid-glass aesthetics.
        </p>
      </div>

      <!-- Section: Workflow Steps -->
      <section class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Compass class="w-4 h-4 text-[var(--accent-color)]" />
          <span>Workflow Steps</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="step in steps"
            :key="step.title"
            class="glass-card rounded-2xl p-5 space-y-2"
          >
            <h3 class="text-sm font-bold text-[var(--text-primary)]">{{ step.title }}</h3>
            <p class="text-xs text-[var(--text-secondary)] leading-relaxed">{{ step.body }}</p>
          </div>
        </div>
      </section>

      <!-- Section: Required Fields Specification -->
      <section class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Sliders class="w-4 h-4 text-[var(--accent-color)]" />
          <span>Required Fields & Nullability Modes</span>
        </h2>
        <div class="glass-card rounded-2xl p-6 space-y-4">
          <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
            Every language handles nullability and required properties differently: Dart uses <code class="px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] font-mono text-[var(--accent-color)]">required this.field</code>,
            TypeScript uses <code class="px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] font-mono text-[var(--accent-color)]">field?: type</code>, Kotlin uses <code class="px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] font-mono text-[var(--accent-color)]">val field: Type? = null</code>,
            and Go uses pointer fields with <code class="px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] font-mono text-[var(--accent-color)]">omitempty</code>.
            Choose the mode that best matches your codebase:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              v-for="item in requiredModesDoc"
              :key="item.mode"
              class="glass-card rounded-xl p-4 border border-[var(--glass-border)] space-y-1.5"
            >
              <div class="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Check class="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>{{ item.mode }}</span>
              </div>
              <p class="text-xs text-[var(--text-secondary)] leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Key Capabilities -->
      <section class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-[var(--accent-color)]" />
          <span>Core Capabilities</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="f in features"
            :key="f.title"
            class="glass-card rounded-2xl p-5 space-y-2 transition-all hover:-translate-y-0.5"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--accent-subtle)] text-[var(--accent-color)] border border-[var(--accent-color)]/20">
              <component :is="f.icon" class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-[var(--text-primary)]">{{ f.title }}</h3>
            <p class="text-xs text-[var(--text-secondary)] leading-relaxed">{{ f.body }}</p>
          </div>
        </div>
      </section>

      <!-- Section: Keyboard Shortcuts -->
      <section class="space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Keyboard class="w-4 h-4 text-[var(--accent-color)]" />
          <span>Keyboard Shortcuts</span>
        </h2>
        <div class="glass-card rounded-2xl divide-y divide-[var(--glass-border)] overflow-hidden text-xs">
          <div
            v-for="s in shortcuts"
            :key="s.keys"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--glass-highlight)] transition-colors"
          >
            <span class="text-[var(--text-secondary)]">{{ s.action }}</span>
            <span class="font-mono text-[11px] bg-[var(--accent-subtle)] text-[var(--accent-color)] px-2.5 py-1 rounded-lg border border-[var(--accent-color)]/20 shadow-xs">
              {{ s.keys }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
