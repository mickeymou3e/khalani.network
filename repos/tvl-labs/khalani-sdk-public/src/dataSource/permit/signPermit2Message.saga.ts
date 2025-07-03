import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'
import { providerSelector } from '@store/provider/provider.selector'
import { SignatureTransfer, PermitTransferFrom } from '@uniswap/permit2-sdk'
import { handleProviderError } from '@utils/error'
import { StrictEffect } from 'redux-saga/effects'
import { select, apply } from 'typed-redux-saga'

export function* signPermit2MessageSaga(
  tokenAddress: string,
  amount: bigint,
  intentNonce: bigint,
  intentDeadline: bigint,
): Generator<StrictEffect, string | undefined> {
  try {
    const assetReservesAddress = yield* select(
      evmChainContractsSelectors.assetReservesAddress,
    )
    if (!assetReservesAddress)
      throw new Error('Asset reserves address not found')

    const permit2Address = yield* select(
      evmChainContractsSelectors.permit2Address,
    )
    if (!permit2Address) throw new Error('Permit2 address not found')

    const network = yield* select(providerSelector.network)
    if (!network) throw new Error('network not found')

    const signer = yield* select(providerSelector.signer)
    if (!signer) throw new Error('network not found')

    const permit: PermitTransferFrom = {
      permitted: {
        token: tokenAddress,
        amount,
      },
      spender: assetReservesAddress,
      nonce: intentNonce,
      deadline: intentDeadline,
    }

    const { domain, types, values } = SignatureTransfer.getPermitData(
      permit,
      permit2Address,
      parseInt(network, 16),
    )

    const signature = yield* apply(signer, signer.signTypedData, [
      domain,
      types,
      values as any,
    ])

    return signature
  } catch (error) {
    handleProviderError(error)
  }
}
