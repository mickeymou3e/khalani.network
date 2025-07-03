import type { Signer } from 'ethers-v6'
import { arrayify, splitSignature } from 'ethers/lib/utils'
import { SignBcsResult } from './types'

/**
 * Serialize with BCS, then sign those bytes
 * @param type   – one of BCS struct descriptors
 * @param payload– the plain JS object matching that struct
 * @param signer – ethers Signer
 */
export async function signBcsPayload<T>(
  type: { serialize(obj: T): { toBytes(): Uint8Array } },
  payload: T,
  signer: Signer,
): Promise<SignBcsResult<T>> {
  const serialized = type.serialize(payload)
  const rawBytes = serialized.toBytes()

  const flatSig = await signer.signMessage(arrayify(rawBytes))
  const { r, s, v } = splitSignature(flatSig)

  return { payload, signature: { r, s, v } }
}
