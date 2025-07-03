export type SignBcsResult<T> = {
  payload: T
  signature: { r: string; s: string; v: number }
}
