export function createLog(
  funcName: string,
  label?: string,
): (message?: unknown, ...optionalParams: unknown[]) => void {
  return (message, ...optionalParams) => {
    if (label) {
      console.log(label, funcName, message, ...optionalParams)
    } else {
      console.log(funcName, message, ...optionalParams)
    }
  }
}
