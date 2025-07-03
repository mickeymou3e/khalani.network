import { camelToSnake, convertToSnakeCase } from './convertToSnakeCase'

describe('camelToSnake', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelToSnake('camelCase')).toBe('camel_case')
    expect(camelToSnake('someVariableName')).toBe('some_variable_name')
    expect(camelToSnake('already_snake_case')).toBe('already_snake_case')
    expect(camelToSnake('AnotherExample')).toBe('another_example')
  })
})

describe('convertToSnakeCase', () => {
  it('should convert object keys from camelCase to snake_case', () => {
    const input = {
      camelCase: 'value',
      nestedObject: {
        innerCamel: 'innerValue',
        anotherInner: {
          deepCamel: 'deepValue',
        },
      },
      arrayWithObjects: [{ arrayCamel: 'arrayValue' }],
    }

    const expectedOutput = {
      camel_case: 'value',
      nested_object: {
        inner_camel: 'innerValue',
        another_inner: {
          deep_camel: 'deepValue',
        },
      },
      array_with_objects: [{ array_camel: 'arrayValue' }],
    }

    expect(convertToSnakeCase(input)).toEqual(expectedOutput)
  })

  it('should handle arrays properly', () => {
    const input = [{ camelCase: 'value1' }, { anotherCamel: 'value2' }]

    const expectedOutput = [
      { camel_case: 'value1' },
      { another_camel: 'value2' },
    ]

    expect(convertToSnakeCase(input)).toEqual(expectedOutput)
  })

  it('should handle non-object and non-array values without changes', () => {
    expect(convertToSnakeCase('string')).toBe('string')
    expect(convertToSnakeCase(42)).toBe(42)
    expect(convertToSnakeCase(null)).toBe(null)
    expect(convertToSnakeCase(undefined)).toBe(undefined)
  })
})
