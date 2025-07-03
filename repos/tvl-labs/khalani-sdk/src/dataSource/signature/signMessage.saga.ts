import { providerSelector } from '@store/provider/provider.selector'
import { handleProviderError } from '@utils/error'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'
import { toUtf8Bytes } from 'ethers-v6'
import { utils } from 'ethers'

interface SignatureObject {
  r: string
  s: string
  v: number
}

export function* signMessageSaga(
  data: string,
): Generator<StrictEffect, SignatureObject | undefined> {
  try {
    const network = yield* select(providerSelector.network)
    if (!network) throw new Error('network not found')

    const signer = yield* select(providerSelector.signer)
    if (!signer) throw new Error('signer not found')

    const messageBytes = toUtf8Bytes(data)

    const signatureHex = yield* call([signer, signer.signMessage], messageBytes)
    const { r, s, v } = utils.splitSignature(signatureHex)
    const signatureObject = { r, s, v }

    return signatureObject
  } catch (error) {
    handleProviderError(error)
  }
}
