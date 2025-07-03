export function camelToSnake(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export function convertToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertToSnakeCase(v))
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      result[camelToSnake(key)] = convertToSnakeCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}
