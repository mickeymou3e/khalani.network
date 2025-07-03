import { fromHex } from '@mysten/bcs'

export function toU256Bytes(num: number | bigint) {
  const bytes = new Array(32).fill(0)
  let value = typeof num === 'bigint' ? num : BigInt(num)
  for (let i = 31; i >= 0 && value > 0n; i--) {
    bytes[i] = Number(value & 0xffn)
    value = value >> 8n
  }
  return bytes
}

/**
 * Convert a 0x-prefixed Ethereum address into a 20-byte array
 */
export function addressToBytes(address: string): number[] {
  const clean = address.startsWith('0x') ? address.slice(2) : address
  return Array.from(fromHex(clean))
}
