import { Signature as SignatureEthers } from 'ethers-v6'

export interface Signature {
  r: string
  s: string
  v: string
}

export const parseSignatureToRsv = (signature: string): Signature => {
  const parsedSignature = SignatureEthers.from(signature)
  const { r, s, v } = parsedSignature
  if (!v) {
    throw new Error('Invalid signature')
  }
  return { r, s, v: v.toString() }
}
