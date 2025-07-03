import { fromHex } from '@mysten/bcs'

/**
 * Convert a 0x-prefixed Ethereum address into a 20-byte array
 */
export function addressToBytes(address: string): number[] {
  const clean = address.startsWith('0x') ? address.slice(2) : address
  return Array.from(fromHex(clean))
}

/**
 * Convert a BigInt or number into a 32-byte big-endian array
 */
export function toU256Bytes(input: number | bigint): number[] {
  const bytes = new Array(32).fill(0)
  let val = BigInt(input)
  for (let ix = 31; ix >= 0 && val > 0n; ix--) {
    bytes[ix] = Number(val & 0xffn)
    val = val >> 8n
  }
  return bytes
}
