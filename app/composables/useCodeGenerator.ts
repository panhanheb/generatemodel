import { useJsonParser, type ASTNode, toPascalCase, applyRequiredConfig } from './useJsonParser'
import type { RequiredMode } from '~/types/generator'

export function useCodeGenerator() {
  const { parseJson, collectModels } = useJsonParser()

  // Main code generator entry point
  function generate(
    jsonStr: string,
    language: string,
    framework: string,
    rootName: string = 'Root',
    checkDefault: boolean = true,
    requiredMode: RequiredMode = 'inferred',
    requiredOverrides: Record<string, boolean> = {},
    nullableIfAbsent: boolean = true
  ): string {
    if (!jsonStr.trim()) return ''

    let ast: ASTNode | null = null
    try {
      ast = parseJson(jsonStr)
    } catch (e: any) {
      return `// Invalid JSON: ${e.message}`
    }

    if (!ast) return '// Empty JSON input'

    const finalRootName = toPascalCase(rootName.trim()) || 'Root'
    if (ast.inferredType === 'object') {
      ast.typeName = finalRootName
    } else if (ast.inferredType === 'array' && ast.children?.[0] && ast.children[0].inferredType === 'object') {
      ast.children[0].typeName = finalRootName
    }

    const models = collectModels(ast)
    // Make sure we include the root model if it's an object
    if (ast.inferredType === 'object' && !models.some(m => m.typeName === finalRootName)) {
      models.push(ast)
    }

    // Apply Required Fields configuration across all collected models
    applyRequiredConfig(models, {
      requiredMode,
      requiredOverrides,
      nullableIfAbsent
    })

    // Direct generators
    switch (language) {
      case 'typescript':
      case 'nodejs':
        return generateTypeScript(models, framework, nullableIfAbsent)
      case 'flutter':
        return generateFlutter(models, framework, checkDefault, nullableIfAbsent)
      case 'laravel':
        return generateLaravel(models, framework)
      case 'php':
        return generatePHP(models, framework)
      case 'java':
        return generateJava(models, framework)
      case 'spring_boot':
        return generateSpringBoot(models, framework)
      case 'kotlin':
        return generateKotlin(models, framework, checkDefault)
      case 'swift':
        return generateSwift(models, framework)
      case 'go':
        return generateGo(models, framework)
      case 'csharp':
        return generateCSharp(models, framework)
      case 'asp_net':
        return generateAspNet(models, framework)
      case 'nestjs':
        return generateNestJS(models, framework)
      case 'javascript':
        return generateJavaScript(models, framework)
      case 'prisma':
        return generatePrisma(models)
      case 'mongoose':
        return generateMongoose(models)
      case 'sequelize':
        return generateSequelize(models)
      case 'typeorm':
        return generateTypeORM(models)
      case 'graphql':
        return generateGraphQL(models, framework)
      case 'openapi':
        return generateOpenAPI(models)
      case 'python':
        return generatePython(models, framework, checkDefault)
      case 'rust':
        return generateRust(models)
      case 'zod':
        return generateZod(models)
      case 'json_schema':
        return generateJsonSchema(models)
      default:
        return `// Language '${language}' not implemented yet.`
    }
  }

  // --- TYPESCRIPT / NODEJS ---
  function getTsType(node: ASTNode): string {
    let base = 'any'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'string'
    else if (node.inferredType === 'number') base = 'number'
    else if (node.inferredType === 'boolean') base = 'boolean'
    else if (node.inferredType === 'date') base = 'Date | string'
    else if (node.inferredType === 'object') base = node.typeName || 'any'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = child ? `${getTsType(child)}[]` : 'any[]'
    }
    else if (node.inferredType === 'union') {
      const members = (node.unionTypes || []).map(m => getTsType({ ...m, isNullable: false }))
      base = members.length ? Array.from(new Set(members)).join(' | ') : 'any'
    }
    return base
  }

  function generateTypeScript(models: ASTNode[], style: string, nullableIfAbsent: boolean = true): string {
    let code = ''
    for (const model of models) {
      const isInterface = style === 'interface'
      code += `export ${isInterface ? 'interface' : 'type'} ${model.typeName} ${isInterface ? '' : '= '}{\n`
      if (model.children) {
        for (const child of model.children) {
          const typeStr = getTsType(child)
          if (child.isRequired) {
            const nullSuffix = child.isNullable ? ' | null' : ''
            code += `  ${child.key}: ${typeStr}${nullSuffix};\n`
          } else {
            const nullSuffix = (child.everNull || nullableIfAbsent || child.isNullable) ? ' | null' : ''
            code += `  ${child.key}?: ${typeStr}${nullSuffix};\n`
          }
        }
      }
      code += `}${isInterface ? '' : ';'}\n\n`
    }
    return code.trim()
  }

  // --- DART / FLUTTER ---
  function getDartType(node: ASTNode): string {
    let base = 'dynamic'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'String'
    else if (node.inferredType === 'number') base = node.isInteger ? 'int' : 'double'
    else if (node.inferredType === 'boolean') base = 'bool'
    else if (node.inferredType === 'date') base = 'DateTime'
    else if (node.inferredType === 'object') base = node.typeName || 'dynamic'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = child ? `List<${getDartType(child)}>` : 'List<dynamic>'
    }
    else if (node.inferredType === 'union') base = 'dynamic'
    return base
  }

  function getDartDefault(child: ASTNode): string | null {
    if (child.inferredType === 'number') {
      return child.isInteger ? '0' : '0.0'
    }
    if (child.inferredType === 'boolean') {
      return 'false'
    }
    if (child.inferredType === 'string' || child.inferredType === 'uuid' || child.inferredType === 'color') {
      return "''"
    }
    if (child.inferredType === 'array') {
      return 'const []'
    }
    return null
  }

  function generateFlutter(models: ASTNode[], style: string, checkDefault: boolean = true, nullableIfAbsent: boolean = true): string {
    if (style === 'freezed') return generateFreezed(models, checkDefault)
    if (style === 'json_serializable') return generateJsonSerializable(models, checkDefault)

    function toCamelCase(str: string): string {
      if (!str) return ''
      if (str === 'CID' || str === 'cid') return 'cid'
      const parts = str.split(/[-_\s]+/)
      return parts.map((part, index) => {
        if (index === 0) return part.toLowerCase()
        return part.charAt(0).toUpperCase() + part.slice(1)
      }).join('')
    }

    const rootName = models[0]?.typeName || 'Welcome'
    const rootNameCamel = rootName.charAt(0).toLowerCase() + rootName.slice(1)

    let code = ''
    code += `// To parse this JSON data, do\n`
    code += `//\n`
    code += `//     final ${rootNameCamel} = ${rootNameCamel}FromJson(jsonString);\n\n`
    code += `import 'dart:convert';\n`

    const isEquatable = style === 'equatable'
    if (isEquatable) {
      code += "import 'package:equatable/equatable.dart';\n"
    }
    code += '\n'

    code += `${rootName} ${rootNameCamel}FromJson(String str) => ${rootName}.fromJson(json.decode(str));\n\n`
    code += `String ${rootNameCamel}ToJson(${rootName} data) => json.encode(data.toJson());\n\n`

    for (const model of models) {
      code += `class ${model.typeName} ${isEquatable ? 'extends Equatable ' : ''}{\n`
      
      const fieldPrefix = isEquatable ? 'final ' : ''
      const children = model.children || []

      // Fields
      for (const child of children) {
        const typeStr = getDartType(child)
        const hasDefault = checkDefault && getDartDefault(child) !== null
        const isNonNullable = child.isRequired || hasDefault
        const fieldName = toCamelCase(child.key)
        code += `    ${fieldPrefix}${typeStr}${isNonNullable ? '' : '?'} ${fieldName};\n`
      }
      code += '\n'

      // Constructor (Order: required first, then default values, then optional)
      code += `    ${model.typeName}({\n`
      const reqFields: string[] = []
      const defFields: string[] = []
      const optFields: string[] = []

      for (const child of children) {
        const fieldName = toCamelCase(child.key)
        const defVal = checkDefault ? getDartDefault(child) : null
        if (defVal !== null) {
          defFields.push(`        this.${fieldName} = ${defVal},\n`)
        } else if (child.isRequired) {
          reqFields.push(`        required this.${fieldName},\n`)
        } else {
          optFields.push(`        this.${fieldName},\n`)
        }
      }
      code += reqFields.join('')
      code += defFields.join('')
      code += optFields.join('')
      code += '    });\n\n'

      // From JSON
      code += `    factory ${model.typeName}.fromJson(Map<String, dynamic> json) => ${model.typeName}(\n`
      for (const child of children) {
        const key = child.key
        const fieldName = toCamelCase(key)
        const hasDefault = checkDefault && getDartDefault(child) !== null
        const isNullable = !child.isRequired && !hasDefault

        if (child.inferredType === 'object') {
          const innerName = child.typeName || 'dynamic'
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"] == null ? null : ${innerName}.fromJson(json["${key}"]),\n`
          } else {
            code += `        ${fieldName}: ${innerName}.fromJson(json["${key}"]),\n`
          }
        } else if (child.inferredType === 'array' && child.children?.[0]?.inferredType === 'object') {
          const innerName = child.children[0].typeName || 'dynamic'
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"] == null ? null : List<${innerName}>.from(json["${key}"].map((x) => ${innerName}.fromJson(x))),\n`
          } else if (checkDefault) {
            code += `        ${fieldName}: json["${key}"] == null ? [] : List<${innerName}>.from(json["${key}"].map((x) => ${innerName}.fromJson(x))),\n`
          } else {
            code += `        ${fieldName}: List<${innerName}>.from(json["${key}"].map((x) => ${innerName}.fromJson(x))),\n`
          }
        } else if (child.inferredType === 'array') {
          const elemType = getDartType(child.children?.[0] || { inferredType: 'any', isNullable: false, isOptional: false, key: '', presentInAllSamples: true, everNull: false, isRequired: true })
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"] == null ? null : List<${elemType}>.from(json["${key}"].map((x) => x)),\n`
          } else if (checkDefault) {
            code += `        ${fieldName}: json["${key}"] == null ? [] : List<${elemType}>.from(json["${key}"].map((x) => x)),\n`
          } else {
            code += `        ${fieldName}: List<${elemType}>.from(json["${key}"].map((x) => x)),\n`
          }
        } else if (child.inferredType === 'date') {
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"] == null ? null : DateTime.parse(json["${key}"]),\n`
          } else if (checkDefault) {
            code += `        ${fieldName}: json["${key}"] == null ? DateTime.now() : DateTime.parse(json["${key}"]),\n`
          } else {
            code += `        ${fieldName}: DateTime.parse(json["${key}"]),\n`
          }
        } else if (child.inferredType === 'number') {
          if (child.isInteger) {
            if (isNullable) {
              code += `        ${fieldName}: json["${key}"],\n`
            } else if (checkDefault) {
              code += `        ${fieldName}: json["${key}"] ?? 0,\n`
            } else {
              code += `        ${fieldName}: json["${key}"],\n`
            }
          } else {
            if (isNullable) {
              code += `        ${fieldName}: (json["${key}"] as num?)?.toDouble(),\n`
            } else if (checkDefault) {
              code += `        ${fieldName}: (json["${key}"] as num?)?.toDouble() ?? 0.0,\n`
            } else {
              code += `        ${fieldName}: (json["${key}"] as num).toDouble(),\n`
            }
          }
        } else if (child.inferredType === 'string' || child.inferredType === 'uuid' || child.inferredType === 'color') {
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"],\n`
          } else if (checkDefault) {
            code += `        ${fieldName}: json["${key}"] ?? "",\n`
          } else {
            code += `        ${fieldName}: json["${key}"],\n`
          }
        } else if (child.inferredType === 'boolean') {
          if (isNullable) {
            code += `        ${fieldName}: json["${key}"],\n`
          } else if (checkDefault) {
            code += `        ${fieldName}: json["${key}"] ?? false,\n`
          } else {
            code += `        ${fieldName}: json["${key}"],\n`
          }
        } else {
          code += `        ${fieldName}: json["${key}"],\n`
        }
      }
      code += '    );\n\n'

      // To JSON
      code += '    Map<String, dynamic> toJson() => {\n'
      for (const child of children) {
        const key = child.key
        const fieldName = toCamelCase(key)
        const hasDefault = checkDefault && getDartDefault(child) !== null
        const isNullable = !child.isRequired && !hasDefault

        if (child.inferredType === 'object') {
          if (isNullable) {
            code += `        "${key}": ${fieldName}?.toJson(),\n`
          } else {
            code += `        "${key}": ${fieldName}.toJson(),\n`
          }
        } else if (child.inferredType === 'array' && child.children?.[0]?.inferredType === 'object') {
          if (isNullable) {
            code += `        "${key}": ${fieldName} == null ? [] : List<dynamic>.from(${fieldName}!.map((x) => x.toJson())),\n`
          } else {
            code += `        "${key}": List<dynamic>.from(${fieldName}.map((x) => x.toJson())),\n`
          }
        } else if (child.inferredType === 'array') {
          if (isNullable) {
            code += `        "${key}": ${fieldName} == null ? [] : List<dynamic>.from(${fieldName}!.map((x) => x)),\n`
          } else {
            code += `        "${key}": List<dynamic>.from(${fieldName}.map((x) => x)),\n`
          }
        } else if (child.inferredType === 'date') {
          if (isNullable) {
            code += `        "${key}": ${fieldName}?.toIso8601String(),\n`
          } else {
            code += `        "${key}": ${fieldName}.toIso8601String(),\n`
          }
        } else {
          code += `        "${key}": ${fieldName},\n`
        }
      }
      code += '    };\n'

      // Equatable props
      if (isEquatable) {
        code += '\n    @override\n    List<Object?> get props => [\n'
        for (const child of children) {
          code += `        ${toCamelCase(child.key)},\n`
        }
        code += '    ];\n'
      }

      code += '}\n\n'
    }
    return code.trim()
  }

  function generateFreezed(models: ASTNode[], checkDefault: boolean = true): string {
    let code = "import 'package:freezed_annotation/freezed_annotation.dart';\n\n"
    code += "part 'models.freezed.dart';\n"
    code += "part 'models.g.dart';\n\n"

    for (const model of models) {
      code += '@freezed\n'
      code += `class ${model.typeName} with _\$${model.typeName} {\n`
      code += `  const factory ${model.typeName}({\n`
      const children = model.children || []

      const reqFields: string[] = []
      const defFields: string[] = []
      const optFields: string[] = []

      for (const child of children) {
        const typeStr = getDartType(child)
        const defVal = checkDefault ? getDartDefault(child) : null

        if (defVal !== null) {
          defFields.push(`    @Default(${defVal}) ${typeStr} ${child.key},\n`)
        } else if (child.isRequired) {
          reqFields.push(`    required ${typeStr} ${child.key},\n`)
        } else {
          optFields.push(`    ${typeStr}? ${child.key},\n`)
        }
      }

      code += reqFields.join('')
      code += defFields.join('')
      code += optFields.join('')

      code += `  }) = _${model.typeName};\n\n`
      code += `  factory ${model.typeName}.fromJson(Map<String, dynamic> json) => _\$${model.typeName}FromJson(json);\n`
      code += '}\n\n'
    }
    return code.trim()
  }

  function generateJsonSerializable(models: ASTNode[], checkDefault: boolean = true): string {
    let code = "import 'package:json_annotation/json_annotation.dart';\n\n"
    code += "part 'models.g.dart';\n\n"

    for (const model of models) {
      code += '@JsonSerializable(explicitToJson: true)\n'
      code += `class ${model.typeName} {\n`
      const children = model.children || []

      // Fields
      for (const child of children) {
        const typeStr = getDartType(child)
        const defVal = checkDefault ? getDartDefault(child) : null

        if (defVal !== null) {
          code += `  @JsonKey(defaultValue: ${defVal})\n`
          code += `  final ${typeStr} ${child.key};\n`
        } else if (child.isRequired) {
          code += `  @JsonKey(required: true)\n`
          code += `  final ${typeStr} ${child.key};\n`
        } else {
          code += `  final ${typeStr}? ${child.key};\n`
        }
      }
      code += '\n'

      // Constructor (required first, then default values, then optional)
      code += `  ${model.typeName}({\n`
      const reqFields: string[] = []
      const defFields: string[] = []
      const optFields: string[] = []

      for (const child of children) {
        const defVal = checkDefault ? getDartDefault(child) : null
        if (defVal !== null) {
          defFields.push(`    this.${child.key} = ${defVal},\n`)
        } else if (child.isRequired) {
          reqFields.push(`    required this.${child.key},\n`)
        } else {
          optFields.push(`    this.${child.key},\n`)
        }
      }
      code += reqFields.join('')
      code += defFields.join('')
      code += optFields.join('')
      code += '  });\n\n'

      code += `  factory ${model.typeName}.fromJson(Map<String, dynamic> json) => _\$${model.typeName}FromJson(json);\n`
      code += `  Map<String, dynamic> toJson() => _\$${model.typeName}ToJson(this);\n`
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- LARAVEL / PHP ---
  function getPhpType(node: ASTNode): string {
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') return 'string'
    if (node.inferredType === 'number') return node.isInteger ? 'int' : 'float'
    if (node.inferredType === 'boolean') return 'bool'
    if (node.inferredType === 'date') return 'DateTime'
    if (node.inferredType === 'object') return node.typeName || 'array'
    if (node.inferredType === 'array') return 'array'
    return 'mixed'
  }

  function generatePHP(models: ASTNode[], style: string): string {
    let code = "<?php\n\nnamespace App\\Models;\n\n"
    for (const model of models) {
      code += `class ${model.typeName}\n{\n`
      const children = model.children || []

      // Promoted Constructor: required first, optional with = null after
      code += `    public function __construct(\n`
      const reqList: string[] = []
      const optList: string[] = []

      for (const child of children) {
        const typeStr = getPhpType(child)
        if (child.isRequired) {
          reqList.push(`        public ${typeStr} $${child.key},\n`)
        } else {
          optList.push(`        public ?${typeStr} $${child.key} = null,\n`)
        }
      }
      code += reqList.join('')
      code += optList.join('')
      code += `    ) {}\n`
      code += '}\n\n'
    }
    return code.trim()
  }

  function generateLaravel(models: ASTNode[], style: string): string {
    if (style === 'dto') return generatePHP(models, 'dto')
    
    let code = "<?php\n\nnamespace App\\Http\\Resources;\n\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Http\\Resources\\Json\\JsonResource;\n\n"
    
    if (style === 'resource') {
      for (const model of models) {
        code += `class ${model.typeName}Resource extends JsonResource\n{\n`
        code += '    public function toArray(Request $request): array\n    {\n'
        code += '        return [\n'
        if (model.children) {
          for (const child of model.children) {
            code += `            '${child.key}' => $this->${child.key},\n`
          }
        }
        code += '        ];\n'
        code += '    }\n'
        code += '}\n\n'
      }
      return code.trim()
    }

    if (style === 'cast') {
      for (const model of models) {
        code += `class ${model.typeName}Cast implements \\Illuminate\\Contracts\\Database\\Eloquent\\CastsAttributes\n{\n`
        code += '    public function get($model, string $key, $value, array $attributes)\n    {\n'
        code += '        return $value ? json_decode($value, true) : null;\n    }\n\n'
        code += '    public function set($model, string $key, $value, array $attributes)\n    {\n'
        code += '        return json_encode($value);\n    }\n'
        code += '}\n\n'
      }
      return code.trim()
    }

    // Default: Laravel Model with rules()
    code = "<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\n"
    for (const model of models) {
      code += `class ${model.typeName} extends Model\n{\n`
      code += `    protected $table = '${model.typeName.toLowerCase()}s';\n\n`
      code += '    protected $fillable = [\n'
      if (model.children) {
        for (const child of model.children) {
          code += `        '${child.key}',\n`
        }
      }
      code += '    ];\n\n'

      // Validation Rules
      code += '    public static function rules(): array\n    {\n        return [\n'
      if (model.children) {
        for (const child of model.children) {
          const rule = child.isRequired ? 'required' : 'nullable'
          code += `            '${child.key}' => '${rule}',\n`
        }
      }
      code += '        ];\n    }\n'

      code += '}\n\n'
    }
    return code.trim()
  }

  // --- JAVA / SPRING BOOT ---
  function getJavaType(node: ASTNode): string {
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') return 'String'
    if (node.inferredType === 'number') return node.isInteger ? 'Integer' : 'Double'
    if (node.inferredType === 'boolean') return 'Boolean'
    if (node.inferredType === 'date') return 'java.time.Instant'
    if (node.inferredType === 'object') return node.typeName || 'Object'
    if (node.inferredType === 'array') {
      const child = node.children?.[0]
      return `java.util.List<${child ? getJavaType(child) : 'Object'}>`
    }
    return 'Object'
  }

  function generateJava(models: ASTNode[], style: string): string {
    let code = ''
    for (const model of models) {
      const children = model.children || []

      if (style === 'record') {
        // Record constructor: required params first, followed by compact constructor null checks
        const reqFields = children.filter(c => c.isRequired)
        const optFields = children.filter(c => !c.isRequired)
        const ordered = [...reqFields, ...optFields]

        code += `public record ${model.typeName}(\n`
        code += ordered.map(child => `    ${getJavaType(child)} ${child.key}`).join(',\n')
        code += '\n) {\n'

        if (reqFields.length > 0) {
          code += `    public ${model.typeName} {\n`
          for (const req of reqFields) {
            code += `        java.util.Objects.requireNonNull(${req.key}, "${req.key} must not be null");\n`
          }
          code += '    }\n'
        }
        code += '}\n\n'
      } else {
        const isLombok = style === 'lombok'
        if (isLombok) {
          code += '@lombok.Data\n@lombok.NoArgsConstructor\n@lombok.AllArgsConstructor\n'
        }
        code += `public class ${model.typeName} {\n`
        for (const child of children) {
          if (child.isRequired) {
            code += isLombok ? '    @lombok.NonNull\n' : '    @jakarta.validation.constraints.NotNull\n'
          }
          code += `    private ${getJavaType(child)} ${child.key};\n`
        }

        if (!isLombok) {
          code += '\n'
          for (const child of children) {
            const typeStr = getJavaType(child)
            const capKey = child.key.charAt(0).toUpperCase() + child.key.slice(1)
            code += `    public ${typeStr} get${capKey}() {\n        return this.${child.key};\n    }\n\n`
            code += `    public void set${capKey}(${typeStr} ${child.key}) {\n        this.${child.key} = ${child.key};\n    }\n\n`
          }
        }
        code += '}\n\n'
      }
    }
    return code.trim()
  }

  function generateSpringBoot(models: ASTNode[], style: string): string {
    if (style === 'record') return generateJava(models, 'record')
    
    let code = ''
    const isEntity = style === 'entity'
    
    for (const model of models) {
      if (isEntity) {
        code += '@jakarta.persistence.Entity\n@jakarta.persistence.Table(name = "' + model.typeName.toLowerCase() + '")\n'
      }
      code += `@lombok.Data\npublic class ${model.typeName} {\n`
      
      if (model.children) {
        let first = true
        for (const child of model.children) {
          if (isEntity && first) {
            code += '    @jakarta.persistence.Id\n'
            if (child.inferredType === 'uuid') {
              code += '    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)\n'
            } else {
              code += '    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)\n'
            }
            first = false
          }
          if (isEntity) {
            if (child.isRequired) {
              code += '    @jakarta.persistence.Column(nullable = false)\n'
              code += '    @jakarta.validation.constraints.NotNull\n'
            } else {
              code += '    @jakarta.persistence.Column(nullable = true)\n'
            }
          } else if (child.isRequired) {
            code += '    @jakarta.validation.constraints.NotNull\n'
          }
          code += `    private ${getJavaType(child)} ${child.key};\n`
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- KOTLIN ---
  function getKotlinType(node: ASTNode): string {
    let base = 'Any'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'String'
    else if (node.inferredType === 'number') base = node.isInteger ? 'Int' : 'Double'
    else if (node.inferredType === 'boolean') base = 'Boolean'
    else if (node.inferredType === 'date') base = 'java.time.Instant'
    else if (node.inferredType === 'object') base = node.typeName || 'Any'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `List<${child ? getKotlinType(child) : 'Any'}>`
    }
    return base
  }

  function generateKotlin(models: ASTNode[], style: string, checkDefault: boolean = true): string {
    let code = ''
    for (const model of models) {
      code += `data class ${model.typeName}(\n`
      const children = model.children || []

      // Required parameters first, optional parameters (= null / default) after
      const reqList: string[] = []
      const optList: string[] = []

      for (const child of children) {
        const baseType = getKotlinType(child)
        if (child.isRequired) {
          reqList.push(`    val ${child.key}: ${baseType}`)
        } else {
          optList.push(`    val ${child.key}: ${baseType}? = null`)
        }
      }

      code += [...reqList, ...optList].join(',\n')
      code += '\n)\n\n'
    }
    return code.trim()
  }

  // --- SWIFT ---
  function getSwiftType(node: ASTNode): string {
    let base = 'Any'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'String'
    else if (node.inferredType === 'number') base = node.isInteger ? 'Int' : 'Double'
    else if (node.inferredType === 'boolean') base = 'Bool'
    else if (node.inferredType === 'date') base = 'Date'
    else if (node.inferredType === 'object') base = node.typeName || 'Any'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `[${child ? getSwiftType(child) : 'Any'}]`
    }
    return base
  }

  function generateSwift(models: ASTNode[], style: string): string {
    let code = "import Foundation\n\n"
    for (const model of models) {
      code += `struct ${model.typeName}: Codable {\n`
      if (model.children) {
        for (const child of model.children) {
          const baseType = getSwiftType(child)
          const opt = child.isRequired ? '' : '?'
          code += `    let ${child.key}: ${baseType}${opt}\n`
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- GO ---
  function getGoType(node: ASTNode): string {
    let base = 'interface{}'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'string'
    else if (node.inferredType === 'number') base = node.isInteger ? 'int' : 'float64'
    else if (node.inferredType === 'boolean') base = 'bool'
    else if (node.inferredType === 'date') base = 'time.Time'
    else if (node.inferredType === 'object') base = node.typeName || 'struct{}'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `[]${child ? getGoType(child) : 'interface{}'}`
    }
    return base
  }

  function generateGo(models: ASTNode[], style: string): string {
    let code = "package models\n\nimport \"time\"\n\n"
    for (const model of models) {
      code += `type ${model.typeName} struct {\n`
      if (model.children) {
        for (const child of model.children) {
          const capName = child.key.charAt(0).toUpperCase() + child.key.slice(1)
          const baseType = getGoType(child)
          if (child.isRequired) {
            code += `\t${capName} ${baseType} \`json:"${child.key}"\`\n`
          } else {
            code += `\t${capName} *${baseType} \`json:"${child.key},omitempty"\`\n`
          }
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- C# / ASP.NET ---
  function getCSharpType(node: ASTNode): string {
    let base = 'object'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'string'
    else if (node.inferredType === 'number') base = node.isInteger ? 'int' : 'double'
    else if (node.inferredType === 'boolean') base = 'bool'
    else if (node.inferredType === 'date') base = 'DateTime'
    else if (node.inferredType === 'object') base = node.typeName || 'object'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `List<${child ? getCSharpType(child) : 'object'}>`
    }
    return base
  }

  function generateCSharp(models: ASTNode[], style: string): string {
    let code = "using System;\nusing System.Collections.Generic;\nusing System.Text.Json.Serialization;\n\nnamespace App.Models\n{\n"
    for (const model of models) {
      const children = model.children || []

      if (style === 'record') {
        code += `    public record ${model.typeName}(\n`
        const reqList: string[] = []
        const optList: string[] = []

        for (const child of children) {
          const capName = child.key.charAt(0).toUpperCase() + child.key.slice(1)
          const baseType = getCSharpType(child)
          if (child.isRequired) {
            reqList.push(`        [property: JsonPropertyName("${child.key}")] ${baseType} ${capName}`)
          } else {
            optList.push(`        [property: JsonPropertyName("${child.key}")] ${baseType}? ${capName} = null`)
          }
        }
        code += [...reqList, ...optList].join(',\n')
        code += '\n    );\n\n'
      } else {
        // C# 11 required property
        code += `    public class ${model.typeName}\n    {\n`
        for (const child of children) {
          const capName = child.key.charAt(0).toUpperCase() + child.key.slice(1)
          const baseType = getCSharpType(child)
          code += `        [JsonPropertyName("${child.key}")]\n`
          if (child.isRequired) {
            code += `        public required ${baseType} ${capName} { get; set; }\n\n`
          } else {
            code += `        public ${baseType}? ${capName} { get; set; }\n\n`
          }
        }
        code += '    }\n\n'
      }
    }
    code += '}'
    return code
  }

  function generateAspNet(models: ASTNode[], style: string): string {
    let code = "using System;\nusing System.ComponentModel.DataAnnotations;\nusing System.Text.Json.Serialization;\n\nnamespace App.Entities\n{\n"
    const isEntity = style === 'entity'

    for (const model of models) {
      code += `    public class ${model.typeName}\n    {\n`
      if (model.children) {
        let first = true
        for (const child of model.children) {
          const capName = child.key.charAt(0).toUpperCase() + child.key.slice(1)
          const baseType = getCSharpType(child)
          if (isEntity && first) {
            code += '        [Key]\n'
            first = false
          }
          if (child.isRequired) {
            code += '        [Required]\n'
          }
          code += `        [JsonPropertyName("${child.key}")]\n`
          const opt = child.isRequired ? '' : '?'
          code += `        public ${baseType}${opt} ${capName} { get; set; }\n\n`
        }
      }
      code += '    }\n\n'
    }
    code += '}'
    return code
  }

  // --- NESTJS ---
  function generateNestJS(models: ASTNode[], style: string): string {
    let code = ''
    const isDto = style === 'dto'
    if (isDto) {
      code += "import { IsString, IsNumber, IsBoolean, IsOptional, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';\n"
      code += "import { Type } from 'class-transformer';\n\n"
    } else {
      code += "import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';\n\n"
    }

    for (const model of models) {
      if (isDto) {
        code += `export class ${model.typeName}Dto {\n`
        if (model.children) {
          for (const child of model.children) {
            if (child.isRequired) {
              code += '  @IsNotEmpty()\n'
            } else {
              code += '  @IsOptional()\n'
            }

            if (child.inferredType === 'string' || child.inferredType === 'uuid' || child.inferredType === 'color' || child.inferredType === 'date') {
              code += '  @IsString()\n'
            } else if (child.inferredType === 'number') {
              code += '  @IsNumber()\n'
            } else if (child.inferredType === 'boolean') {
              code += '  @IsBoolean()\n'
            } else if (child.inferredType === 'array') {
              code += '  @IsArray()\n'
              if (child.children?.[0]?.inferredType === 'object') {
                code += `  @ValidateNested({ each: true })\n  @Type(() => ${child.children[0].typeName}Dto)\n`
              }
            } else if (child.inferredType === 'object') {
              code += `  @ValidateNested()\n  @Type(() => ${child.typeName}Dto)\n`
            }

            const opt = child.isRequired ? '' : '?'
            code += `  ${child.key}${opt}: ${getTsType(child)};\n\n`
          }
        }
        code += '}\n\n'
      } else {
        code += `@Entity('${model.typeName.toLowerCase()}s')\nexport class ${model.typeName}Entity {\n`
        if (model.children) {
          let first = true
          for (const child of model.children) {
            if (first) {
              code += '  @PrimaryGeneratedColumn()\n  id: number;\n\n'
              first = false
              if (child.key === 'id') continue
            }
            if (child.isRequired) {
              code += '  @Column()\n'
              code += `  ${child.key}: ${getTsType(child)};\n\n`
            } else {
              code += '  @Column({ nullable: true })\n'
              code += `  ${child.key}?: ${getTsType(child)};\n\n`
            }
          }
        }
        code += '}\n\n'
      }
    }
    return code.trim()
  }

  // --- JAVASCRIPT (JSDoc) ---
  function generateJavaScript(models: ASTNode[], style: string): string {
    let code = ''
    for (const model of models) {
      code += '/**\n'
      code += ` * @typedef {Object} ${model.typeName}\n`
      if (model.children) {
        for (const child of model.children) {
          let jsDocType = 'any'
          if (child.inferredType === 'string' || child.inferredType === 'uuid' || child.inferredType === 'color') jsDocType = 'string'
          else if (child.inferredType === 'number') jsDocType = 'number'
          else if (child.inferredType === 'boolean') jsDocType = 'boolean'
          else if (child.inferredType === 'date') jsDocType = 'string|Date'
          else if (child.inferredType === 'object') jsDocType = child.typeName || 'Object'
          else if (child.inferredType === 'array') {
            const childElem = child.children?.[0]
            jsDocType = childElem?.typeName ? `${childElem.typeName}[]` : 'Array'
          }

          if (child.isNullable || (!child.isRequired && child.everNull)) jsDocType += '|null'
          const keyStr = child.isRequired ? child.key : `[${child.key}]`
          code += ` * @property {${jsDocType}} ${keyStr}\n`
        }
      }
      code += ' */\n\n'
    }
    return code.trim()
  }

  // --- PRISMA SCHEMA ---
  function getPrismaType(node: ASTNode): string {
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') return 'String'
    if (node.inferredType === 'number') return node.isInteger ? 'Int' : 'Float'
    if (node.inferredType === 'boolean') return 'Boolean'
    if (node.inferredType === 'date') return 'DateTime'
    if (node.inferredType === 'object') return node.typeName || 'Json'
    if (node.inferredType === 'array') {
      const child = node.children?.[0]
      return child?.inferredType === 'object' ? `${child.typeName}[]` : 'Json'
    }
    return 'Json'
  }

  function generatePrisma(models: ASTNode[]): string {
    let code = 'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\n'
    for (const model of models) {
      code += `model ${model.typeName} {\n`
      if (model.children) {
        let first = true
        for (const child of model.children) {
          let typeStr = getPrismaType(child)
          let decorators = ''
          if (first) {
            decorators = ' @id'
            if (child.inferredType === 'uuid') {
              decorators += ' @default(uuid())'
            } else if (child.inferredType === 'number') {
              decorators += ' @default(autoincrement())'
            }
            first = false
          }
          const nullable = child.isRequired ? '' : '?'
          code += `  ${child.key} ${typeStr}${nullable}${decorators}\n`
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- MONGOOSE ---
  function getMongooseType(node: ASTNode): string {
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') return 'String'
    if (node.inferredType === 'number') return 'Number'
    if (node.inferredType === 'boolean') return 'Boolean'
    if (node.inferredType === 'date') return 'Date'
    if (node.inferredType === 'object') return node.typeName ? `${node.typeName}Schema` : 'Object'
    if (node.inferredType === 'array') {
      const child = node.children?.[0]
      return `[${child ? getMongooseType(child) : 'Schema.Types.Mixed'}]`
    }
    return 'Schema.Types.Mixed'
  }

  function generateMongoose(models: ASTNode[]): string {
    let code = "import { Schema, model } from 'mongoose';\n\n"
    
    // Sub schemas first
    for (const model of models) {
      if (model.typeName === 'Root') continue
      code += `const ${model.typeName}Schema = new Schema({\n`
      if (model.children) {
        for (const child of model.children) {
          const typeStr = getMongooseType(child)
          const req = child.isRequired ? ', required: true' : ''
          code += `  ${child.key}: { type: ${typeStr}${req} },\n`
        }
      }
      code += '});\n\n'
    }

    // Root Schema and Model
    const root = models.find(m => m.typeName === 'Root')
    if (root) {
      code += `const RootSchema = new Schema({\n`
      if (root.children) {
        for (const child of root.children) {
          const typeStr = getMongooseType(child)
          const req = child.isRequired ? ', required: true' : ''
          code += `  ${child.key}: { type: ${typeStr}${req} },\n`
        }
      }
      code += '});\n\n'
      code += "export const RootModel = model('Root', RootSchema);\n"
    }

    return code.trim()
  }

  // --- SEQUELIZE ---
  function generateSequelize(models: ASTNode[]): string {
    let code = "import { DataTypes } from 'sequelize';\nimport { sequelize } from './database';\n\n"
    for (const model of models) {
      code += `export const ${model.typeName} = sequelize.define('${model.typeName}', {\n`
      if (model.children) {
        let first = true
        for (const child of model.children) {
          let seqType = 'DataTypes.STRING'
          if (child.inferredType === 'number') seqType = child.isInteger ? 'DataTypes.INTEGER' : 'DataTypes.DOUBLE'
          else if (child.inferredType === 'boolean') seqType = 'DataTypes.BOOLEAN'
          else if (child.inferredType === 'date') seqType = 'DataTypes.DATE'
          else if (child.inferredType === 'array' || child.inferredType === 'object') seqType = 'DataTypes.JSON'

          code += `  ${child.key}: {\n`
          code += `    type: ${seqType},\n`
          if (first) {
            code += '    primaryKey: true,\n'
            if (child.inferredType === 'number') {
              code += '    autoIncrement: true,\n'
            }
            first = false
          }
          code += `    allowNull: ${child.isRequired ? 'false' : 'true'}\n`
          code += '  },\n'
        }
      }
      code += '});\n\n'
    }
    return code.trim()
  }

  // --- TYPEORM ---
  function generateTypeORM(models: ASTNode[]): string {
    return generateNestJS(models, 'entity')
  }

  // --- GRAPHQL ---
  function getGraphQlType(node: ASTNode): string {
    let base = 'String'
    if (node.inferredType === 'number') base = node.isInteger ? 'Int' : 'Float'
    else if (node.inferredType === 'boolean') base = 'Boolean'
    else if (node.inferredType === 'object') base = node.typeName || 'JSON'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `[${child ? getGraphQlType(child) : 'JSON'}]`
    }
    return base + (node.isRequired ? '!' : '')
  }

  function generateGraphQL(models: ASTNode[], style: string): string {
    let code = ''
    const keyword = style === 'input' ? 'input' : 'type'
    for (const model of models) {
      code += `${keyword} ${model.typeName} {\n`
      if (model.children) {
        for (const child of model.children) {
          code += `  ${child.key}: ${getGraphQlType(child)}\n`
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- OPENAPI ---
  function getOpenApiType(node: ASTNode): any {
    if (node.inferredType === 'string') return { type: 'string' }
    if (node.inferredType === 'uuid') return { type: 'string', format: 'uuid' }
    if (node.inferredType === 'color') return { type: 'string', format: 'color' }
    if (node.inferredType === 'number') return { type: node.isInteger ? 'integer' : 'number' }
    if (node.inferredType === 'boolean') return { type: 'boolean' }
    if (node.inferredType === 'date') return { type: 'string', format: 'date-time' }
    if (node.inferredType === 'object') return { $ref: `#/components/schemas/${node.typeName}` }
    if (node.inferredType === 'array') {
      const child = node.children?.[0]
      return {
        type: 'array',
        items: child ? getOpenApiType(child) : { type: 'object' }
      }
    }
    if (node.inferredType === 'union') {
      return { oneOf: (node.unionTypes || []).map(getOpenApiType) }
    }
    return { type: 'object' }
  }

  function generateOpenAPI(models: ASTNode[]): string {
    const schemas: Record<string, any> = {}
    for (const model of models) {
      const properties: Record<string, any> = {}
      const required: string[] = []

      if (model.children) {
        for (const child of model.children) {
          properties[child.key] = getOpenApiType(child)
          if (child.isRequired) {
            required.push(child.key)
          }
        }
      }

      schemas[model.typeName || ''] = {
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {})
      }
    }

    const openApiDoc = {
      openapi: '3.0.0',
      info: {
        title: 'JSON Model API Schema',
        version: '1.0.0'
      },
      components: {
        schemas
      }
    }

    return JSON.stringify(openApiDoc, null, 2)
  }

  function snakeCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase()
  }

  // --- PYTHON (dataclass / pydantic / TypedDict) ---
  function getPythonType(node: ASTNode): string {
    let base = 'Any'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'str'
    else if (node.inferredType === 'number') base = node.isInteger ? 'int' : 'float'
    else if (node.inferredType === 'boolean') base = 'bool'
    else if (node.inferredType === 'date') base = 'datetime'
    else if (node.inferredType === 'object') base = `'${node.typeName || 'Any'}'`
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `List[${child ? getPythonType(child) : 'Any'}]`
    }
    else if (node.inferredType === 'union') {
      const members = (node.unionTypes || []).map(getPythonType)
      base = members.length ? `Union[${Array.from(new Set(members)).join(', ')}]` : 'Any'
    }
    return base
  }

  function generatePython(models: ASTNode[], style: string, checkDefault: boolean = true): string {
    const isPydantic = style === 'pydantic'
    const isTypedDict = style === 'typeddict'

    let header = 'from __future__ import annotations\n'
    header += 'from typing import List, Optional, Union, Any'
    if (isTypedDict) header += ', TypedDict'
    header += '\n'
    if (isTypedDict) {
      header += 'from typing_extensions import Required, NotRequired\n'
    }
    header += 'from datetime import datetime\n'
    if (isPydantic) header += 'from pydantic import BaseModel\n'
    else if (!isTypedDict) header += 'from dataclasses import dataclass\n'
    header += '\n\n'

    let code = ''
    for (const model of models) {
      if (isPydantic) {
        code += `class ${model.typeName}(BaseModel):\n`
      } else if (isTypedDict) {
        code += `class ${model.typeName}(TypedDict):\n`
      } else {
        code += `@dataclass\nclass ${model.typeName}:\n`
      }

      const children = model.children || []
      if (children.length === 0) {
        code += '    pass\n'
      } else if (isTypedDict) {
        for (const child of children) {
          const baseType = getPythonType(child)
          if (child.isRequired) {
            code += `    ${snakeCase(child.key)}: Required[${baseType}]\n`
          } else {
            code += `    ${snakeCase(child.key)}: NotRequired[${baseType}]\n`
          }
        }
      } else {
        // Dataclass / Pydantic: Required fields (no default) MUST precede optional fields (= None)
        const reqList: string[] = []
        const optList: string[] = []

        for (const child of children) {
          const baseType = getPythonType(child)
          const fieldName = snakeCase(child.key)
          if (child.isRequired) {
            reqList.push(`    ${fieldName}: ${baseType}\n`)
          } else {
            reqList.push = reqList.push // noop
            optList.push(`    ${fieldName}: Optional[${baseType}] = None\n`)
          }
        }

        code += reqList.join('')
        code += optList.join('')
      }
      code += '\n\n'
    }
    return (header + code).trim()
  }

  // --- RUST (serde) ---
  function getRustType(node: ASTNode): string {
    let base = 'serde_json::Value'
    if (node.inferredType === 'string' || node.inferredType === 'uuid' || node.inferredType === 'color') base = 'String'
    else if (node.inferredType === 'number') base = node.isInteger ? 'i64' : 'f64'
    else if (node.inferredType === 'boolean') base = 'bool'
    else if (node.inferredType === 'date') base = 'String'
    else if (node.inferredType === 'object') base = node.typeName || 'serde_json::Value'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `Vec<${child ? getRustType(child) : 'serde_json::Value'}>`
    }
    else if (node.inferredType === 'union') base = 'serde_json::Value'
    return base
  }

  function generateRust(models: ASTNode[]): string {
    let code = 'use serde::{Deserialize, Serialize};\n\n'
    for (const model of models) {
      code += '#[derive(Debug, Clone, Serialize, Deserialize)]\n'
      code += `pub struct ${model.typeName} {\n`
      if (model.children) {
        for (const child of model.children) {
          const field = snakeCase(child.key)
          if (field !== child.key) {
            code += `    #[serde(rename = "${child.key}")]\n`
          }
          const baseType = getRustType(child)
          if (child.isRequired) {
            code += `    pub ${field}: ${baseType},\n`
          } else {
            code += `    #[serde(skip_serializing_if = "Option::is_none")]\n`
            code += `    pub ${field}: Option<${baseType}>,\n`
          }
        }
      }
      code += '}\n\n'
    }
    return code.trim()
  }

  // --- ZOD ---
  function getZodType(node: ASTNode): string {
    let base = 'z.any()'
    if (node.inferredType === 'string' || node.inferredType === 'color') base = 'z.string()'
    else if (node.inferredType === 'uuid') base = 'z.string().uuid()'
    else if (node.inferredType === 'number') base = 'z.number()'
    else if (node.inferredType === 'boolean') base = 'z.boolean()'
    else if (node.inferredType === 'date') base = 'z.coerce.date()'
    else if (node.inferredType === 'object') base = node.typeName ? `${node.typeName}Schema` : 'z.any()'
    else if (node.inferredType === 'array') {
      const child = node.children?.[0]
      base = `z.array(${child ? getZodType(child) : 'z.any()'})`
    }
    else if (node.inferredType === 'union') {
      const members = (node.unionTypes || []).map(getZodType)
      base = members.length > 1 ? `z.union([${members.join(', ')}])` : (members[0] || 'z.any()')
    }

    if (!node.isRequired) {
      if (node.isNullable || node.everNull) {
        base += '.nullable()'
      }
      base += '.optional()'
    } else if (node.isNullable) {
      base += '.nullable()'
    }
    return base
  }

  function generateZod(models: ASTNode[]): string {
    let code = 'import { z } from "zod";\n\n'
    for (const model of models) {
      code += `export const ${model.typeName}Schema = z.object({\n`
      if (model.children) {
        for (const child of model.children) {
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(child.key) ? child.key : `"${child.key}"`
          code += `  ${safeKey}: ${getZodType(child)},\n`
        }
      }
      code += '});\n'
      code += `export type ${model.typeName} = z.infer<typeof ${model.typeName}Schema>;\n\n`
    }
    return code.trim()
  }

  // --- JSON SCHEMA (Draft-07) ---
  function getJsonSchemaType(node: ASTNode): any {
    if (node.inferredType === 'string') return { type: 'string' }
    if (node.inferredType === 'uuid') return { type: 'string', format: 'uuid' }
    if (node.inferredType === 'color') return { type: 'string' }
    if (node.inferredType === 'number') return { type: node.isInteger ? 'integer' : 'number' }
    if (node.inferredType === 'boolean') return { type: 'boolean' }
    if (node.inferredType === 'date') return { type: 'string', format: 'date-time' }
    if (node.inferredType === 'object') return { $ref: `#/definitions/${node.typeName}` }
    if (node.inferredType === 'array') {
      const child = node.children?.[0]
      return { type: 'array', items: child ? getJsonSchemaType(child) : {} }
    }
    if (node.inferredType === 'union') {
      return { oneOf: (node.unionTypes || []).map(getJsonSchemaType) }
    }
    return {}
  }

  function generateJsonSchema(models: ASTNode[]): string {
    const definitions: Record<string, any> = {}
    for (const model of models) {
      const properties: Record<string, any> = {}
      const required: string[] = []
      if (model.children) {
        for (const child of model.children) {
          properties[child.key] = getJsonSchemaType(child)
          if (child.isRequired) {
            required.push(child.key)
          }
        }
      }
      definitions[model.typeName || 'Root'] = {
        type: 'object',
        properties,
        ...(required.length ? { required } : {})
      }
    }
    const rootName = models[models.length - 1]?.typeName || 'Root'
    const doc = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: `#/definitions/${rootName}`,
      definitions
    }
    return JSON.stringify(doc, null, 2)
  }

  return {
    generate
  }
}
