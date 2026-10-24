import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { LANGUAGES } from '~/constants/languages'
import type { LanguageOption, RequiredMode } from '~/types/generator'

// Re-exported for existing importers (components consume these from the store).
export { LANGUAGES }
export type { LanguageOption, RequiredMode }

export function getDefaultRequiredMode(language: string): RequiredMode {
  return ['flutter', 'kotlin', 'swift'].includes(language) ? 'all' : 'inferred'
}

export const useGeneratorStore = defineStore('generator', () => {
  const selectedLanguage = ref('typescript')
  const selectedFramework = ref('interface')
  const rootClassName = ref('Root')
  const generatedCode = ref('')
  const wordWrap = ref(true)
  const isFullscreen = ref(false)
  const checkDefaultValue = ref(true)
  const isSidebarOpen = ref(true)
  const activeActivityTab = ref('explorer')
  const showShortcuts = ref(false)
  const generateTrigger = ref(0)
  const loadSampleTrigger = ref(0)

  // Required Fields Configuration
  const requiredMode = ref<RequiredMode>('inferred')
  const userSelectedRequiredMode = ref(false)
  const requiredOverrides = ref<Record<string, boolean>>({})
  const nullableIfAbsent = ref(true)

  // iOS 27 Liquid Glass Settings (0 = Clear, 100 = Tinted)
  const glassIntensity = ref(45)

  // Mobile editor split tab ('input' | 'output')
  const editorActiveTab = ref<'input' | 'output'>('input')

  function requestGenerate() {
    generateTrigger.value++
  }

  function requestLoadSample() {
    loadSampleTrigger.value++
  }

  function setRequiredMode(mode: RequiredMode) {
    requiredMode.value = mode
    userSelectedRequiredMode.value = true
  }

  function setFieldOverride(key: string, isRequired: boolean) {
    requiredOverrides.value = {
      ...requiredOverrides.value,
      [key]: isRequired
    }
  }

  function resetRequiredOverrides() {
    requiredOverrides.value = {}
  }

  // Watch for language changes and pick first available style if current is invalid,
  // and update requiredMode to language default if user hasn't explicitly customized it.
  watch(selectedLanguage, (newLang) => {
    const langObj = LANGUAGES.find(l => l.id === newLang)
    if (langObj && langObj.options.length > 0) {
      const isValidFramework = langObj.options.some(opt => opt.id === selectedFramework.value)
      if (!isValidFramework) {
        selectedFramework.value = langObj.options[0].id
      }
    }
    if (!userSelectedRequiredMode.value) {
      requiredMode.value = getDefaultRequiredMode(newLang)
    }
  })

  // Load configuration options from local storage on mount
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('json_model_gen_lang')
      if (savedLang) {
        selectedLanguage.value = savedLang
      }
      const savedFramework = localStorage.getItem('json_model_gen_framework')
      if (savedFramework) {
        selectedFramework.value = savedFramework
      }
      const savedClass = localStorage.getItem('json_model_gen_root_class')
      if (savedClass) {
        rootClassName.value = savedClass
      }
      const savedCheckDefault = localStorage.getItem('json_model_gen_check_default')
      if (savedCheckDefault !== null) {
        checkDefaultValue.value = savedCheckDefault === 'true'
      }
      const savedSidebar = localStorage.getItem('json_model_gen_sidebar')
      if (savedSidebar !== null) {
        isSidebarOpen.value = savedSidebar === 'true'
      }

      // Required fields options
      const savedRequiredMode = localStorage.getItem('json_model_gen_required_mode') as RequiredMode | null
      if (savedRequiredMode) {
        requiredMode.value = savedRequiredMode
        userSelectedRequiredMode.value = true
      } else {
        requiredMode.value = getDefaultRequiredMode(selectedLanguage.value)
      }

      const savedOverrides = localStorage.getItem('json_model_gen_required_overrides')
      if (savedOverrides) {
        try {
          requiredOverrides.value = JSON.parse(savedOverrides)
        } catch {}
      }

      const savedNullable = localStorage.getItem('json_model_gen_nullable_if_absent')
      if (savedNullable !== null) {
        nullableIfAbsent.value = savedNullable === 'true'
      }

      const savedIntensity = localStorage.getItem('json_model_gen_glass_intensity')
      if (savedIntensity !== null) {
        glassIntensity.value = parseInt(savedIntensity, 10) || 45
      }
    }
  })

  // Watch settings change to save them back to local storage
  watch([
    selectedLanguage,
    selectedFramework,
    rootClassName,
    checkDefaultValue,
    isSidebarOpen,
    requiredMode,
    requiredOverrides,
    nullableIfAbsent,
    glassIntensity
  ], () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('json_model_gen_lang', selectedLanguage.value)
      localStorage.setItem('json_model_gen_framework', selectedFramework.value)
      localStorage.setItem('json_model_gen_root_class', rootClassName.value)
      localStorage.setItem('json_model_gen_check_default', String(checkDefaultValue.value))
      localStorage.setItem('json_model_gen_sidebar', String(isSidebarOpen.value))
      localStorage.setItem('json_model_gen_required_mode', requiredMode.value)
      localStorage.setItem('json_model_gen_required_overrides', JSON.stringify(requiredOverrides.value))
      localStorage.setItem('json_model_gen_nullable_if_absent', String(nullableIfAbsent.value))
      localStorage.setItem('json_model_gen_glass_intensity', String(glassIntensity.value))
    }
  }, { deep: true })

  return {
    selectedLanguage,
    selectedFramework,
    rootClassName,
    generatedCode,
    wordWrap,
    isFullscreen,
    checkDefaultValue,
    isSidebarOpen,
    activeActivityTab,
    showShortcuts,
    generateTrigger,
    loadSampleTrigger,
    requiredMode,
    userSelectedRequiredMode,
    requiredOverrides,
    nullableIfAbsent,
    glassIntensity,
    editorActiveTab,
    setRequiredMode,
    setFieldOverride,
    resetRequiredOverrides,
    requestGenerate,
    requestLoadSample
  }
})
