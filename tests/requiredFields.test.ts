import { describe, it, expect } from 'vitest'
import { useJsonParser, applyRequiredConfig } from '../app/composables/useJsonParser'
import { useCodeGenerator } from '../app/composables/useCodeGenerator'
import { getDefaultRequiredMode } from '../app/stores/generator.store'

describe('Part 1 — Required Fields & Inference', () => {
  const { parseJson, collectModels } = useJsonParser()
  const { generate } = useCodeGenerator()

  describe('1.1 Inference with heterogeneous arrays', () => {
    it('infers presentInAllSamples, everNull, and isRequired correctly', () => {
      const json = JSON.stringify([
        { id: 1, name: 'Alpha', bio: 'Short bio' },
        { id: 2, name: 'Beta', bio: null },
        { id: 3, name: 'Gamma' } // bio is missing here
      ])

      const ast = parseJson(json)
      expect(ast).not.toBeNull()
      const models = collectModels(ast!)
      expect(models.length).toBeGreaterThan(0)

      const rootModel = models.find(m => m.children && m.children.length > 0)
      expect(rootModel).toBeDefined()
      const fields = rootModel!.children!

      const idField = fields.find(f => f.key === 'id')
      const nameField = fields.find(f => f.key === 'name')
      const bioField = fields.find(f => f.key === 'bio')

      expect(idField).toBeDefined()
      expect(idField!.presentInAllSamples).toBe(true)
      expect(idField!.everNull).toBe(false)
      expect(idField!.isRequired).toBe(true)

      expect(nameField).toBeDefined()
      expect(nameField!.presentInAllSamples).toBe(true)
      expect(nameField!.everNull).toBe(false)
      expect(nameField!.isRequired).toBe(true)

      expect(bioField).toBeDefined()
      expect(bioField!.presentInAllSamples).toBe(false) // Missing in sample 3
      expect(bioField!.everNull).toBe(true) // Null in sample 2
      expect(bioField!.isRequired).toBe(false)
    })
  })

  describe('1.2 Modes: none, all, inferred, custom', () => {
    const json = JSON.stringify([
      { id: 1, title: 'Item 1', description: 'Desc' },
      { id: 2, title: 'Item 2' }
    ])

    it("mode 'none' marks all fields optional", () => {
      const ast = parseJson(json)!
      const models = collectModels(ast)
      applyRequiredConfig(models, { requiredMode: 'none' })

      const fields = models[0]!.children!
      expect(fields.every(f => !f.isRequired)).toBe(true)
    })

    it("mode 'all' marks all fields required", () => {
      const ast = parseJson(json)!
      const models = collectModels(ast)
      applyRequiredConfig(models, { requiredMode: 'all' })

      const fields = models[0]!.children!
      expect(fields.every(f => f.isRequired)).toBe(true)
    })

    it("mode 'inferred' marks required only presentInAllSamples && !everNull", () => {
      const ast = parseJson(json)!
      const models = collectModels(ast)
      applyRequiredConfig(models, { requiredMode: 'inferred' })

      const fields = models[0]!.children!
      const idField = fields.find(f => f.key === 'id')!
      const titleField = fields.find(f => f.key === 'title')!
      const descField = fields.find(f => f.key === 'description')!

      expect(idField.isRequired).toBe(true)
      expect(titleField.isRequired).toBe(true)
      expect(descField.isRequired).toBe(false)
    })

    it("mode 'custom' applies per-field overrides", () => {
      const ast = parseJson(json)!
      const models = collectModels(ast)
      const className = models[0]!.typeName || 'Root'

      applyRequiredConfig(models, {
        requiredMode: 'custom',
        requiredOverrides: {
          [`${className}.id`]: false,
          [`${className}.description`]: true
        }
      })

      const fields = models[0]!.children!
      const idField = fields.find(f => f.key === 'id')!
      const titleField = fields.find(f => f.key === 'title')!
      const descField = fields.find(f => f.key === 'description')!

      expect(idField.isRequired).toBe(false) // overridden to false
      expect(titleField.isRequired).toBe(true) // inferred fallback
      expect(descField.isRequired).toBe(true) // overridden to true
    })
  })

  describe('1.3 Language Outputs & Constructor Ordering', () => {
    const sampleJson = JSON.stringify({
      id: 42,
      nickname: 'skywalker',
      count: 10
    })

    it('Dart plain output: required params without default, defaults not marked required', () => {
      const complexJson = JSON.stringify({
        id: 42,
        nickname: 'skywalker',
        count: 10,
        category: {
          name: 'Jedi'
        }
      })

      // When checkDefault = false: required fields have 'required this.field'
      const outputNoDefault = generate(
        complexJson,
        'flutter',
        'plain',
        'User',
        false, // checkDefaultValue = false
        'custom',
        { 'User.id': true, 'User.nickname': false, 'User.count': true },
        true
      )
      expect(outputNoDefault).toContain('required this.id')
      expect(outputNoDefault).toContain('required this.count')
      expect(outputNoDefault).toContain('this.nickname')
      expect(outputNoDefault).not.toContain('required this.nickname')

      // When checkDefault = true: count has default (this.count = 0, NOT required this.count),
      // while category has no default and is required (required this.category)
      const outputWithDefault = generate(
        complexJson,
        'flutter',
        'plain',
        'User',
        true, // checkDefaultValue = true
        'custom',
        { 'User.category': true, 'User.nickname': false },
        true
      )
      expect(outputWithDefault).toContain('this.count = 0')
      expect(outputWithDefault).not.toContain('required this.count')
      expect(outputWithDefault).toContain('required this.category')
    })

    it('TypeScript output: required fields no ?, optional fields with ?', () => {
      const output = generate(
        sampleJson,
        'typescript',
        'interface',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false, 'User.count': true },
        true
      )

      expect(output).toContain('export interface User')
      expect(output).toMatch(/id:\s*number;/)
      expect(output).toMatch(/nickname\?:\s*string/)
      expect(output).toMatch(/count:\s*number;/)
    })

    it('Kotlin output: required params first, optional with = null', () => {
      const output = generate(
        sampleJson,
        'kotlin',
        'data_class',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false, 'User.count': true },
        true
      )

      expect(output).toContain('data class User(')
      expect(output).toContain('val id: Int')
      expect(output).toContain('val count: Int')
      expect(output).toContain('val nickname: String? = null')
    })

    it('Python Dataclass output: required fields come first, optional = None after', () => {
      const output = generate(
        sampleJson,
        'python',
        'dataclass',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false, 'User.count': true },
        true
      )

      expect(output).toContain('@dataclass')
      expect(output).toContain('class User:')
      // id and count must be declared before nickname = None
      const idIdx = output.indexOf('id: int')
      const countIdx = output.indexOf('count: int')
      const nickIdx = output.indexOf('nickname: Optional[str] = None')

      expect(idIdx).toBeGreaterThan(-1)
      expect(countIdx).toBeGreaterThan(-1)
      expect(nickIdx).toBeGreaterThan(-1)
      expect(idIdx).toBeLessThan(nickIdx)
      expect(countIdx).toBeLessThan(nickIdx)
    })

    it('Python TypedDict output: Required vs NotRequired', () => {
      const output = generate(
        sampleJson,
        'python',
        'typeddict',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false },
        true
      )

      expect(output).toContain('class User(TypedDict):')
      expect(output).toContain('id: Required[int]')
      expect(output).toContain('nickname: NotRequired[str]')
    })

    it('Go output: required fields without omitempty, optional with pointer and omitempty', () => {
      const output = generate(
        sampleJson,
        'go',
        'struct',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false },
        true
      )

      expect(output).toContain('type User struct {')
      expect(output).toContain('Id int `json:"id"`')
      expect(output).toContain('Nickname *string `json:"nickname,omitempty"`')
    })

    it('JSON Schema output: only required fields listed in required array', () => {
      const output = generate(
        sampleJson,
        'json_schema',
        'schema',
        'User',
        false,
        'custom',
        { 'User.id': true, 'User.nickname': false, 'User.count': true },
        true
      )

      const parsed = JSON.parse(output)
      const rootDef = parsed.definitions.User
      expect(rootDef).toBeDefined()
      expect(rootDef.required).toContain('id')
      expect(rootDef.required).toContain('count')
      expect(rootDef.required).not.toContain('nickname')
    })
  })

  describe('1.4 Language defaults & Share Link backward compatibility', () => {
    it('getDefaultRequiredMode returns all for Flutter, Kotlin, Swift, inferred for others', () => {
      expect(getDefaultRequiredMode('flutter')).toBe('all')
      expect(getDefaultRequiredMode('kotlin')).toBe('all')
      expect(getDefaultRequiredMode('swift')).toBe('all')
      expect(getDefaultRequiredMode('typescript')).toBe('inferred')
      expect(getDefaultRequiredMode('go')).toBe('inferred')
      expect(getDefaultRequiredMode('python')).toBe('inferred')
    })

    it('encodes and decodes share link state with backward compatibility', () => {
      // Simulate modern payload with rm, ro, na
      const modernPayload = {
        j: '{"test":123}',
        l: 'flutter',
        s: 'plain',
        r: 'Root',
        rm: 'custom',
        ro: { 'Root.test': false },
        na: true,
        cd: true
      }
      const encodedModern = btoa(unescape(encodeURIComponent(JSON.stringify(modernPayload))))
      const decodedModern = JSON.parse(decodeURIComponent(escape(atob(encodedModern))))
      expect(decodedModern.rm).toBe('custom')
      expect(decodedModern.ro['Root.test']).toBe(false)

      // Simulate legacy payload missing rm (backward-compatibility test)
      const legacyPayload = {
        j: '{"test":123}',
        l: 'flutter',
        s: 'plain',
        r: 'Root'
      }
      const encodedLegacy = btoa(unescape(encodeURIComponent(JSON.stringify(legacyPayload))))
      const decodedLegacy = JSON.parse(decodeURIComponent(escape(atob(encodedLegacy))))

      // If rm is missing, it should fall back to language default
      const restoredMode = decodedLegacy.rm || getDefaultRequiredMode(decodedLegacy.l)
      expect(restoredMode).toBe('all')
    })
  })
})
