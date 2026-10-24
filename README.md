# ⚡ JSON Model Generator

<p align="center">
  <strong>Next-Generation IDE-Grade JSON to Strongly-Typed Model & Schema Generator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxtdotjs&logoColor=white" alt="Nuxt 4" />
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Editor-Monaco-007ACC?style=flat&logo=visualstudiocode&logoColor=white" alt="Monaco Editor" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="License: MIT" />
</p>

---

**JSON Model Generator** is a developer-first SaaS web application and modern alternative to QuickType. Designed with an interface inspired by modern tools like **VS Code, Linear, and Raycast**, it enables developers to paste, upload, or fetch raw JSON payloads and instantly produce clean, idiomatic, strongly-typed models, DTOs, entities, and schemas across **24+ programming languages and frameworks**.

All core conversions run **100% client-side in the browser** — your data never leaves your machine.

---

## ✨ Features & Highlights

### ⚡ Client-Side Architecture & Privacy
- **Instant Reactive Generation**: Models update in real-time as you type, toggle options, or adjust parameters.
- **Complete Privacy**: All AST parsing, type inference, and code generation take place within the browser sandbox.

### 🎨 VS Code-Inspired Frosted Glass IDE
- **Dual Monaco Editors**: Full syntax highlighting, line numbers, error markers, bracket matching, and word wrap for both JSON input and target code output.
- **Activity & Title Bars**: File menu navigation, command actions, collapsible sidebar (`Ctrl+B`), quick theme toggling, and integrated sample libraries.
- **Live Status Bar**: Real-time line/character counts, JSON syntax validation state, active language style indicator, and encoding display.
- **Glassmorphism Design**: High-fidelity translucent UI with frosted backdrops and smooth micro-animations.

### 🧠 QuickType-Grade Smart Inference Engine
- **Primitive Detection**: Strings, numbers, booleans, and nulls with precision integer detection.
- **Semantic Type Detection**: ISO-8601 Datetime strings, UUIDs (`v1-v5`), and CSS/hex color values.
- **Array Normalization**: Handles homogeneous arrays and computes union types for heterogeneous collections.
- **Deduplication & Singularization**: Nested objects are deduplicated into clean, reusable class definitions named using English singularization (e.g., `categories` &rarr; `Category`).
- **Sound Null Safety & Fallbacks**: Configurable safe default value assignments (`0`, `0.0`, `""`, `false`, `[]`, `DateTime.now()`) to prevent null-pointer exceptions.
- **Resilient Loose Parser**: Parses standard JSON as well as loose inputs, including single-quoted properties, unquoted keys, trailing commas, and log outputs.

### 🛠️ Developer Productivity
- **JSON Formatting & Minification**: Cleanly beautify (`Ctrl+Shift+F`) or minify JSON payloads.
- **Import Options**: Paste text, upload files (`.json`, `.txt`), drag & drop, or fetch remote payloads directly via a CORS-safe proxy.
- **Export & Share**: Single-click clipboard copying (`Ctrl+Shift+C`), dynamic file downloads with language-accurate extensions (`.dart`, `.ts`, `.kt`, `.swift`, `.go`, `.cs`, etc.), and shareable permalinks (`/s/:id` or self-contained hash URLs).
- **Comprehensive Keyboard Shortcuts**: Quick access to every major function without leaving the keyboard.

---

## 🌐 Supported Languages & Frameworks

The generator supports **24 languages and frameworks** spanning over **40 distinct generation styles**:

| Language / Framework | Output Styles & Formats | Target Extension |
| :--- | :--- | :---: |
| **Flutter (Dart)** | Plain Dart Model, Equatable Model, Freezed Model, Json Serializable | `.dart` |
| **Laravel (PHP)** | Eloquent Model, Data Transfer Object (DTO), API Resource, Cast Class | `.php` |
| **PHP** | Standard Typed Class, DTO | `.php` |
| **Java** | Plain Old Java Object (POJO), Java 14+ Record, Lombok Model (`@Data`, `@Builder`) | `.java` |
| **Spring Boot** | JPA Entity (`@Entity`), DTO, Record | `.java` |
| **Kotlin** | Kotlin Data Class (`@Serializable`) | `.kt` |
| **Swift** | Swift Codable Struct | `.swift` |
| **Go** | Go Struct with JSON struct tags | `.go` |
| **C#** | C# Class with `[JsonPropertyName]`, C# 9+ Record | `.cs` |
| **ASP.NET** | Entity Model, DTO | `.cs` |
| **TypeScript** | Interface (`export interface`), Type Alias (`export type`) | `.ts` |
| **Node.js** | TypeScript Interface, Type Alias | `.ts` |
| **NestJS** | DTO with `class-validator` decorators, TypeORM Entity | `.ts` |
| **JavaScript** | JSDoc Typed Definitions | `.js` |
| **Python** | Python `dataclass`, Pydantic `BaseModel` (v2), `TypedDict` | `.py` |
| **Rust** | Rust Struct with Serde (`#[derive(Serialize, Deserialize)]`) | `.rs` |
| **Prisma** | Prisma Database Schema Model (`model ModelName { ... }`) | `.prisma` |
| **Mongoose** | Mongoose Schema (`new Schema({ ... })`) | `.js` |
| **Sequelize** | Sequelize Model Definition | `.js` |
| **TypeORM** | TypeORM Entity with column decorators | `.ts` |
| **GraphQL** | GraphQL Object Type (`type Model { ... }`), Input Type (`input ModelInput { ... }`) | `.graphql` |
| **OpenAPI** | OpenAPI 3.0 / Swagger JSON Schema Component definition | `.json` |
| **Zod** | Zod Schema (`z.object({ ... })`) with type inference | `.ts` |
| **JSON Schema** | JSON Schema Draft-07 specification | `.json` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Trigger Model Generation | Global |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> | Format JSON Payload (Beautify) | Editor |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | Copy Generated Model Code | Global |
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle Primary Sidebar (Explorer / Config) | Global |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>Ctrl</kbd> + <kbd>S</kbd> | Open Keyboard Shortcuts Dialog | Global |
| <kbd>Escape</kbd> | Close Modals / Menus / Drawers | Global |

---

## 🏗️ Project Architecture

```text
nn_generatemodel/
├── app/
│   ├── app.vue                 # App entry with Nuxt layout & page router
│   ├── assets/
│   │   └── css/main.css        # Tailwind CSS v4 styling & glassmorphism tokens
│   ├── components/             # Reusable UI components
│   │   ├── ide/                # VS Code-style IDE shell
│   │   │   ├── IdeActivityBar.vue   # Far-left tool rail (Explorer, Config, Docs, Shortcuts)
│   │   │   ├── IdeSidebar.vue       # Collapsible drawer (Files, Options, Sample library)
│   │   │   ├── IdeStatusBar.vue     # Bottom status bar (Metrics, Language, Encoding)
│   │   │   ├── IdeTitleBar.vue      # Top bar with menus, actions & share trigger
│   │   │   └── IdeWatermark.vue     # Empty state watermark & quick start hints
│   │   ├── CodePreview.vue          # Output Monaco Editor instance
│   │   ├── JsonEditor.vue           # Input Monaco Editor instance with error markers
│   │   ├── LanguageSelector.vue     # Target language selector
│   │   ├── FrameworkSelector.vue    # Target framework/style selector
│   │   ├── ThemeSwitcher.vue        # Dark / Light / System theme controller
│   │   ├── ShortcutsSidebar.vue     # Interactive keyboard shortcuts drawer
│   │   └── ToastList.vue            # Floating notification provider
│   ├── composables/            # Core logic & stateful utilities
│   │   ├── useCodeGenerator.ts # Multi-language code emitters (24+ languages)
│   │   ├── useJsonParser.ts    # AST generator, semantic detector & loose parser
│   │   ├── useShareLink.ts     # Permalink generator (Short URL & base64 URL)
│   │   ├── useFileUpload.ts    # File reader for .json and .txt uploads
│   │   ├── useClipboard.ts     # System clipboard copy helper
│   │   ├── useDownload.ts      # Browser file download trigger
│   │   └── useAnalytics.ts     # Provider-agnostic analytics engine
│   ├── constants/              # Static definitions
│   │   ├── languages.ts        # Single source of truth for supported languages & styles
│   │   └── site.ts             # Metadata, SEO descriptions, and author links
│   ├── layouts/
│   │   └── default.vue         # Frosted glass IDE desktop layout
│   ├── pages/
│   │   ├── index.vue           # Main IDE split workspace
│   │   ├── languages.vue       # Language gallery & search catalog
│   │   └── docs.vue            # Integrated documentation & quick-start guide
│   └── stores/                 # Pinia reactive state stores
│       ├── editor.store.ts     # Raw input, validation state & formatting actions
│       ├── generator.store.ts  # Target language, framework style & output settings
│       └── theme.store.ts      # Active visual theme state
├── public/                     # Static assets (favicons, backdrops)
├── server/                     # Nuxt Nitro server engine
│   ├── api/
│   │   ├── fetch-json.get.ts   # CORS proxy for loading JSON from remote URLs
│   │   └── share/              # Server-side share link storage endpoints
│   └── routes/
│       ├── sitemap.xml.ts      # Dynamic XML sitemap
│       └── robots.txt.ts       # Dynamic robots.txt
├── nuxt.config.ts              # Nuxt 4 configuration, Tailwind v4 Vite plugin, SEO head
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NhebPanha/nn_generatemodel.git
   cd nn_generatemodel
   ```

2. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Local dev server port | `3000` |
| `NUXT_PUBLIC_SITE_URL` | Canonical public URL for SEO & metadata | `https://json-model-generator.vercel.app` |
| `NUXT_PUBLIC_ANALYTICS_PROVIDER`| Analytics provider (`plausible`, `google`, `umami`, or empty) | `""` |
| `NUXT_PUBLIC_ANALYTICS_ID` | Tracking ID (Google Analytics or Umami website ID) | `""` |
| `NUXT_PUBLIC_ANALYTICS_DOMAIN` | Plausible custom domain | `""` |
| `NUXT_PUBLIC_ANALYTICS_HOST` | Custom analytics host endpoint (optional) | `""` |
| `KV_REST_API_URL` | Vercel KV / Upstash Redis REST URL for short share links | `""` |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash Redis REST Token for short share links | `""` |

> **Note:** If Redis credentials are not configured, the application automatically falls back to self-contained, client-side compressed share links (`#s=...`), requiring zero database infrastructure.

---

## 📦 Build & Deployment

### Production Build Locally

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel

The application is pre-configured for frictionless deployment to [Vercel](https://vercel.com):

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Import the project into your Vercel Dashboard.
3. Vercel automatically detects the **Nuxt** preset.
4. Click **Deploy**.

For advanced deployment details, consult [DEPLOYMENT.md](file:///d:/Assignment/nn_generatemodel/DEPLOYMENT.md).

---

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, TypeScript, Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **Theming**: `@nuxtjs/color-mode`

---

## 📄 License

This project is licensed under the **MIT License**.

Copyright &copy; 2026 **JSON Model Generator**. Created by [Nheb Panha](https://github.com/NhebPanha).
