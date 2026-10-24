import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { LANGUAGES } from '~/constants/languages'
import type { LanguageOption } from '~/types/generator'

// Re-exported for existing importers (components consume these from the store).
export { LANGUAGES }
export type { LanguageOption }

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

  function requestGenerate() {
    generateTrigger.value++
  }

  function requestLoadSample() {
    loadSampleTrigger.value++
  }

  // Watch for language changes and pick the first available style option if current is invalid
  watch(selectedLanguage, (newLang) => {
    const langObj = LANGUAGES.find(l => l.id === newLang)
    if (langObj && langObj.options.length > 0) {
      const isValidFramework = langObj.options.some(opt => opt.id === selectedFramework.value)
      if (!isValidFramework) {
        selectedFramework.value = langObj.options[0].id
      }
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
    }
  })

  // Watch settings change to save them back to local storage
  watch([selectedLanguage, selectedFramework, rootClassName, checkDefaultValue, isSidebarOpen], () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('json_model_gen_lang', selectedLanguage.value)
      localStorage.setItem('json_model_gen_framework', selectedFramework.value)
      localStorage.setItem('json_model_gen_root_class', rootClassName.value)
      localStorage.setItem('json_model_gen_check_default', String(checkDefaultValue.value))
      localStorage.setItem('json_model_gen_sidebar', String(isSidebarOpen.value))
    }
  })

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
    requestGenerate,
    requestLoadSample
  }
})
