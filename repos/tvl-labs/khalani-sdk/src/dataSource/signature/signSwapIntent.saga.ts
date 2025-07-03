import { providerSelector } from '@store/provider/provider.selector'
import { Intent } from '@store/swaps'
import { handleProviderError } from '@utils/error'
import { StrictEffect } from 'redux-saga/effects'
import { apply, select } from 'typed-redux-saga'
import { ethers, TypedDataDomain, TypedDataField } from 'ethers-v6'
import config from '@config'

function validateSignature(
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  intent: Intent,
  signature: string,
  expectedAuthor: string,
) {
  const recoveredAddress = ethers.verifyTypedData(
    domain,
    types,
    intent,
    signature,
  )

  console.log('Recovered Address:', recoveredAddress)
  console.log('Expected Author:', expectedAuthor)
  if (recoveredAddress.toLowerCase() !== expectedAuthor.toLowerCase()) {
    throw new Error(
      'Signature validation failed: recovered address does not match intent author.',
    )
  }

  return true
}

export function* signSwapIntentSaga(
  intent: Intent,
): Generator<StrictEffect, string | undefined> {
  try {
    const network = yield* select(providerSelector.network)
    if (!network) throw new Error('network not found')

    const signer = yield* select(providerSelector.signer)
    if (!signer) throw new Error('signer not found')

    const domain = {
      name: 'KhalaniIntent',
      version: '1.0.0',
      verifyingContract: config.contracts.IntentBook,
    }

    const types = {
      Intent: [
        { name: 'author', type: 'address' },
        { name: 'ttl', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'srcMToken', type: 'address' },
        { name: 'srcAmount', type: 'uint256' },
        { name: 'outcome', type: 'Outcome' },
      ],
      Outcome: [
        { name: 'mTokens', type: 'address[]' },
        { name: 'mAmounts', type: 'uint256[]' },
        { name: 'outcomeAssetStructure', type: 'uint8' },
        { name: 'fillStructure', type: 'uint8' },
      ],
    }

    const signature = yield* apply(signer, signer.signTypedData, [
      domain,
      types,
      intent as any,
    ])

    // Validate the signature against the intent and author
    validateSignature(domain, types, intent, signature, intent.author)

    console.log('Signature validated successfully')
    return signature
  } catch (error) {
    handleProviderError(error)
  }
}
