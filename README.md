# ⚡ JSON Model Generator

<p align="center">
  <strong>Next-Generation IDE-Grade JSON to Strongly-Typed Model & Schema Generator</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Design-iOS_27_Liquid_Glass-0A84FF?style=flat&logo=apple&logoColor=white" alt="iOS 27 Liquid Glass" />
  <img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat&logo=nuxtdotjs&logoColor=white" alt="Nuxt 4" />
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vuedotjs&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Editor-Monaco-007ACC?style=flat&logo=visualstudiocode&logoColor=white" alt="Monaco Editor" />
  <img src="https://img.shields.io/badge/Tests-Vitest_Passing-22C55E?style=flat&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="License: MIT" />
</p>

---

**JSON Model Generator** is a developer-first SaaS studio and modern alternative to QuickType. Designed with an ultra-premium **Apple iOS 27 Liquid Glass** design language adapted for desktop and mobile web, it enables developers to paste, upload, or fetch raw JSON payloads and instantly produce clean, idiomatic, strongly-typed models, DTOs, entities, and schemas across **24+ programming languages and frameworks**.

All conversions run **100% client-side in the browser** — your data never leaves your machine.

---

## 📸 Interface Preview (iOS 27 Liquid Glass)

<!-- UI Screenshot Placeholders -->
<div align="center">
  <p><strong>iOS 27 Liquid Glass Dual-Pane Studio</strong></p>
  <img src="https://via.placeholder.com/1280x720/0f172a/0a84ff?text=JSON+Model+Generator+%E2%80%94+iOS+27+Liquid+Glass+Studio" alt="Studio Split View" width="90%" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

<br/>

<div align="center">
  <p><strong>Required Fields Nullability Matrix & Inset Grouped Controls</strong></p>
  <img src="https://via.placeholder.com/1280x720/0f172a/38bdf8?text=Required+Fields+Control+%E2%80%94+Custom+Per-Field+Overrides" alt="Required Fields Options" width="90%" style="border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);" />
</div>

---

## ✨ Features & Highlights

### 💎 iOS 27 Liquid Glass Design Language
- **Translucent Refraction Surfaces**: Fluid, translucent glass panels with specular refraction edge highlights and high-diffusion content backing for crystal-clear code legibility.
- **Dynamic Glass Intensity**: Interactive slider in Settings (Clear &harr; Tinted) driving live CSS variables (`--glass-blur`, `--glass-opacity`, `--glass-tint`, `--glass-highlight`).
- **Floating Glass Capsule UI**: Floating navigation capsule at the top, pill action rail on the left, and floating status capsule at the bottom.
- **Native iOS Components**: Custom built-in `GlassToggle`, `GlassSegmented`, `GlassSlider`, `GlassSheet`, and `GlassList` inset-grouped components.
- **Accessibility First**: Full automatic compliance for `prefers-reduced-transparency` (solid fallback surfaces), `prefers-contrast: more` (high-contrast borders, zero glass blur), and `prefers-reduced-motion` (disabled spring animations).
- **SF Pro Typography**: Tailored typography stack matching Apple's system typeface (`-apple-system, "SF Pro Text", "Inter"`) with SF Mono for Monaco editor panes.

### 🎯 Required Fields & Nullability Engine (New!)
- **Multi-Sample AST Inference**: Cross-analyzes object samples across arrays to track `presentInAllSamples`, `everNull`, and compute precise nullability.
- **4 Flexible Strategies**:
  - `inferred`: Required only when present in 100% of samples and never null (QuickType behavior).
  - `all`: Every property strictly required and non-nullable (strict contract default for Dart, Kotlin, Swift).
  - `none`: Every property marked optional/nullable (ideal for patch requests and loose APIs).
  - `custom`: Per-field granular override matrix grouped by model with reset capability.
- **Safe Fallback Interaction**: Intelligently relaxes `required` constraints when safe default values (e.g., `this.count = 0`) are active to maintain valid language semantics.

### ⚡ Client-Side Architecture & Complete Privacy
- **Instant Reactive Generation**: Models regenerate on every keystroke, option toggle, or parameter adjustment.
- **100% Client-Side Sandbox**: AST parsing, inference, and emission execute strictly in your local browser sandbox. No server databases, telemetry payloads, or remote tracking.

### 🧠 QuickType-Grade Smart Inference
- **Semantic Type Detection**: ISO-8601 Datetime strings, UUIDs (`v1-v5`), and CSS/hex color values.
- **Deduplication & Singularization**: Normalizes nested objects and plural arrays into clean, reusable models (e.g., `categories` &rarr; `Category`).
- **Resilient Loose Parser**: Parses standard JSON as well as loose inputs (unquoted keys, single quotes, trailing commas, logs).

---

## 🎯 Required Fields & Nullability Strategies

Different languages represent required vs. optional fields in distinct ways: Dart constructors, TypeScript optional properties (`?`), Kotlin default `null` values, Python dataclass placement order, and Go pointers with `omitempty`.

### Mode Comparison

| Mode | Behavior | Best Used For |
| :--- | :--- | :--- |
| **`Inferred`** | Marked required only if key exists in all sample objects and is never `null`. | Heterogeneous API payloads, array responses |
| **`All`** | Every field is generated as required and non-null. | Strict backend contracts, mobile models (Dart/Kotlin/Swift) |
| **`None`** | Every field is marked optional/nullable. | Partial DTOs, HTTP `PATCH` update bodies |
| **`Custom`** | Interactive per-field toggle list in the sidebar. | Fine-grained API modeling, schema tailoring |

### Code Generation Examples Across Languages

#### 1. Dart (Plain & Freezed)
When a field is required, Dart requires `required this.field` in the constructor. When optional, it becomes nullable (`String?`):

```dart
// Required: 'inferred' or 'all'
class User {
  final int id;
  final String? nickname;

  const User({
    required this.id,
    this.nickname,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'] as int,
    nickname: json['nickname'] as String?,
  );
}

// Freezed format:
@freezed
class User with _$User {
  const factory User({
    required int id,
    String? nickname,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

> **Note on Safe Defaults**: In Dart, named parameters cannot combine `required` with a default value (`required this.count = 0` is invalid Dart). When **Safe Defaults** is toggled on, defaulted primitives emit `this.count = 0` while non-defaulted required objects emit `required this.user`.

#### 2. TypeScript & Node.js
Required fields are standard properties; optional fields use the `?:` modifier. If a field was observed as null in sample data, `| null` is appended:

```typescript
export interface User {
  id: number;
  nickname?: string | null;
  email: string;
}
```

#### 3. Kotlin Data Class
Kotlin expresses optional fields with nullable types (`String?`) defaulting to `= null`:

```kotlin
@Serializable
data class User(
    val id: Int,
    val nickname: String? = null,
    val email: String
)
```

#### 4. Python (Dataclass & Pydantic v2)
In Python dataclasses, parameters without defaults must precede parameters with defaults to prevent `SyntaxError`. The generator automatically reorders fields:

```python
# Python dataclass
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    id: int
    email: str
    nickname: Optional[str] = None

# Pydantic v2
from pydantic import BaseModel

class User(BaseModel):
    id: int
    email: str
    nickname: str | None = None
```

#### 5. Go Struct
Go uses value types for required fields and pointers with `omitempty` for optional fields:

```go
type User struct {
    ID       int     `json:"id"`
    Email    string  `json:"email"`
    Nickname *string `json:"nickname,omitempty"`
}
```

#### 6. JSON Schema / OpenAPI 3.0
Required properties are listed in the `required: [...]` array:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "nickname": { "type": "string" },
    "email": { "type": "string" }
  },
  "required": [
    "id",
    "email"
  ]
}
```

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
| **ASP.NET** | Entity Model, DTO with `[Required]` validation | `.cs` |
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
| <kbd>Ctrl</kbd> + <kbd>B</kbd> | Toggle Sidebar Drawer | Global |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>Ctrl</kbd> + <kbd>S</kbd> | Open Keyboard Shortcuts Sheet | Global |
| <kbd>Escape</kbd> | Close Modals / Sheets / Menus | Global |

---

## 🏗️ Project Architecture

```text
nn_generatemodel/
├── app/
│   ├── app.vue                 # App entry with Nuxt layout & page router
│   ├── assets/
│   │   └── css/main.css        # Tailwind CSS v4 & iOS 27 Liquid Glass design tokens
│   ├── components/             # Reusable UI components
│   │   ├── ide/                # iOS 27 Liquid Glass studio components
│   │   │   ├── IdeActivityBar.vue   # Floating glass pill rail
│   │   │   ├── IdeSidebar.vue       # Inset grouped options drawer & field overrides
│   │   │   ├── IdeStatusBar.vue     # Floating capsule status bar
│   │   │   ├── IdeTitleBar.vue      # Floating glass header with context menus
│   │   │   └── IdeWatermark.vue     # Empty state watermark & quick start hints
│   │   ├── ui/                 # iOS 27 design system primitives
│   │   │   ├── GlassToggle.vue      # Spring-animated iOS toggle
│   │   │   ├── GlassSegmented.vue   # Translucent segmented switch
│   │   │   ├── GlassSlider.vue      # Smooth glass intensity slider
│   │   │   ├── GlassList.vue        # iOS Inset Grouped list container
│   │   │   ├── GlassListRow.vue     # iOS Inset list row with chevron/control
│   │   │   └── GlassSheet.vue       # Spring modal sheet with backdrop blur
│   │   ├── CodePreview.vue          # Output Monaco Editor instance
│   │   ├── JsonEditor.vue           # Input Monaco Editor instance with error markers
│   │   ├── ThemeSwitcher.vue        # Light / Dark / System theme switcher
│   │   ├── ShortcutsSidebar.vue     # Shortcuts modal sheet
│   │   └── ToastList.vue            # Floating iOS glass toast banners
│   ├── composables/            # Core logic & stateful utilities
│   │   ├── useCodeGenerator.ts # Multi-language code emitters (24+ languages)
│   │   ├── useJsonParser.ts    # Multi-sample AST parser & nullability inference
│   │   ├── useShareLink.ts     # Backward-compatible permalink engine
│   │   ├── useFileUpload.ts    # File reader for .json and .txt uploads
│   │   ├── useClipboard.ts     # System clipboard copy helper
│   │   ├── useDownload.ts      # Browser file download trigger
│   │   └── useAnalytics.ts     # Provider-agnostic analytics engine
│   ├── constants/              # Static definitions
│   │   ├── languages.ts        # Language & architecture catalog
│   │   └── site.ts             # Metadata, SEO descriptions, and author links
│   ├── layouts/
│   │   └── default.vue         # Liquid Glass dynamic wrapper
│   ├── pages/
│   │   ├── index.vue           # Dual-pane glass IDE workspace
│   │   ├── languages.vue       # Language gallery & search catalog
│   │   └── docs.vue            # Integrated documentation & quick-start guide
│   └── stores/                 # Pinia reactive state stores
│       ├── editor.store.ts     # Raw input, validation state & formatting actions
│       ├── generator.store.ts  # Target language, requiredMode & settings
│       └── theme.store.ts      # Active visual theme state
├── tests/
│   └── requiredFields.test.ts  # Vitest test suite for inference & emitters
├── public/                     # Static assets (favicons, backdrops)
├── server/                     # Nuxt Nitro server engine
├── vitest.config.ts            # Unit test configuration
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

4. **Run Unit Tests:**
   ```bash
   npm test
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

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

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3.5, TypeScript 5.4, Vite 7)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Testing**: [Vitest](https://vitest.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **Theming**: `@nuxtjs/color-mode`

---

## 📄 License

This project is licensed under the **MIT License**.

Copyright &copy; 2026 **JSON Model Generator**. Created by [Nheb Panha](https://github.com/NhebPanha).
