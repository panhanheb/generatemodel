# Changelog

All notable changes to **JSON Model Generator** (`nn_generatemodel`) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-10-24

### 🚀 Added
- **"Required Fields" Nullability Engine**:
  - Multi-sample AST inference in `useJsonParser.ts`: tracks `presentInAllSamples`, `everNull`, and computes `isRequired` based on active nullability mode.
  - Four flexible generation strategies:
    - `inferred`: Required only when present in all samples and never null (QuickType behavior; default for TS, Go, Python, etc.).
    - `all`: Every property is required and non-nullable (default for Flutter/Dart, Kotlin, Swift).
    - `none`: Every property is optional/nullable.
    - `custom`: Granular per-field override matrix with grouped model fields and quick-reset option.
  - Safe Default Fallback Interaction: When safe defaults are enabled, fields with assigned default values (e.g. `this.count = 0` in Dart) omit redundant `required` keywords to prevent language syntax errors.
  - Backward-compatible share links: Added `rm`, `ro`, `na`, `cd` keys to permalinks (`/s/:id` and `#s=`), with automatic language-default fallbacks when parsing legacy links.
  - Full code generator support across all 24 emitters with required-first constructor and parameter ordering (Dart, TypeScript, Kotlin, Swift, Python dataclasses/Pydantic, Go, Rust serde, Java records, NestJS, etc.).
  - Automated unit test suite with **Vitest** (`tests/requiredFields.test.ts`) covering heterogeneous AST inference, all four modes, language snapshots, defaults interaction, and permalink serialization.

- **iOS 27 Liquid Glass Redesign**:
  - Translucent liquid glass aesthetic with specular refraction highlights and content diffusion layer.
  - Dynamic **Glass Intensity Control** slider in Settings (Clear &harr; Tinted) driving live CSS variables (`--glass-blur`, `--glass-opacity`, `--glass-tint`, `--glass-highlight`).
  - Native iOS-style component suite in `app/components/ui/`:
    - `GlassToggle.vue`: iOS spring toggle with haptic feedback animation.
    - `GlassSegmented.vue`: Liquid glass sliding segmented pill control.
    - `GlassSlider.vue`: Accessible, styled glass range slider.
    - `GlassSheet.vue`: Centered spring modal sheet with blurred backdrop.
    - `GlassList.vue` & `GlassListRow.vue`: iOS Inset Grouped list containers.
  - Redesigned IDE chrome:
    - Floating capsule title bar with grouped iOS context menus.
    - Floating glass activity rail with integrated search, model explorer, options, and shortcuts.
    - Inset grouped sidebar options with live required-fields toggles.
    - Floating glass status capsule with live metrics and valid/invalid JSON indicator.
    - iOS-style top sliding notification banners (`ToastList.vue`).
    - Responsive mobile switcher for seamless toggling between JSON input and generated code.
  - Apple SF Pro Text & SF Mono typography stack.
  - Comprehensive accessibility compliance:
    - `@media (prefers-reduced-transparency)` fallback to solid high-legibility surfaces.
    - `@media (prefers-contrast: more)` high-contrast borders and disabled blur.
    - `@media (prefers-reduced-motion)` disables spring transitions.

### 🔄 Changed
- Migrated all UI components to use Tailwind CSS v4 `@theme` and dynamic CSS variables (`--glass-surface`, `--glass-border`, `--accent-color`).
- Updated `languages.vue` and `docs.vue` pages with Apple-style large bold hero titles and liquid glass card layouts.
- Updated Monaco editor background and gutters to transparent mode with custom `glass-light` and `glass-dark` themes.

### 🧪 Tested
- Verified 100% pass rate across 14 Vitest test cases in `tests/requiredFields.test.ts`.
- Verified production bundle compilation with `npm run build` (Nitro 2.13.4, Vite 7.3.6, Nuxt 4.4.8).
