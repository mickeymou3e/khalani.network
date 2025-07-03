import { StrictEffect } from 'redux-saga/effects'
import { select, call, apply } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { handleProviderError } from '@utils/error'
import {
  contractsSelectors,
  evmChainContractsSelectors,
} from '@store/contracts/contracts.selectors'
import { Contract, ContractTransactionResponse, MaxUint256 } from 'ethers-v6'
import { Network } from '@constants/Networks'

export function* depositSaga(
  srcToken: string,
  amount: bigint,
  nonce: bigint,
  ttl: bigint,
  signature: string,
): Generator<StrictEffect, ContractTransactionResponse | undefined> {
  try {
    const signer = yield* select(providerSelector.signer)
    const userAddress = yield* select(providerSelector.userAddress)
    if (!signer || !userAddress) {
      throw new Error('Wallet is not connected')
    }

    const tokenConnector = yield* select(
      evmChainContractsSelectors.crossChainTokenConnector,
    )

    const erc20Contract: Contract | null = yield* call(tokenConnector, srcToken)
    if (!erc20Contract) throw Error('Token contract not found')

    const permit2Address = yield* select(
      evmChainContractsSelectors.permit2Address,
    )
    if (!permit2Address) throw new Error('Permit2 address not found')

    const allowance = yield* call(
      erc20Contract.allowance,
      userAddress,
      permit2Address,
    )

    if (allowance < amount) {
      console.log('Insufficient allowance, requesting user approval...')
      const tx = yield* call(erc20Contract.approve, permit2Address, MaxUint256)
      yield* apply(tx, tx.wait, [])
    }

    const assetReserves = yield* select(contractsSelectors.assetReserves)
    if (!assetReserves) {
      throw new Error('Asset reserves contract not found')
    }

    const transaction = (yield* call(
      assetReserves.deposit,
      srcToken,
      amount,
      parseInt(Network.Khalani),
      nonce,
      ttl,
      signature,
      // { value: ethers.parseEther('0.001') },
    )) as ContractTransactionResponse

    console.log('Deposit Transaction Hash:', transaction.hash)
    return transaction
  } catch (error) {
    console.log(error)
    handleProviderError(error)
  }
}
