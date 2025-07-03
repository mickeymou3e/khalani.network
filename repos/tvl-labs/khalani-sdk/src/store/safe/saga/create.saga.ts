import { apply, call, select } from 'typed-redux-saga'
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
  SafeFactoryConfig,
} from '@safe-global/protocol-kit'
import { SafeUserConfig } from '../safe.types'
import { safeSelector } from '../safe.selector'
import { StrictEffect } from 'redux-saga/effects'
import { ContractTransaction } from 'ethers-v6'
import { Confirmations } from '@constants/TxParams'
import { providerSelector } from '@store/provider/provider.selector'
import { Network } from '@constants/Networks'

export async function createSafe(
  safeConfig: SafeUserConfig,
  ethAdapter: EthersAdapter,
  factoryConfig: SafeFactoryConfig,
): Promise<any> {
  const safeFactory = await SafeFactory.create(factoryConfig)

  const safeAccountConfig: SafeAccountConfig = {
    owners: safeConfig.owners,
    threshold: safeConfig.threshold,
  }

  const predictedDeploySafeAddress = await safeFactory.predictSafeAddress(
    safeAccountConfig,
    safeConfig.saltNonce,
  )

  const isContractDeployed = await ethAdapter.isContractDeployed(
    predictedDeploySafeAddress,
  )

  if (isContractDeployed) {
    throw new Error('Safe already deployed')
  }

  let transactionHash: string | null = null
  await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce: safeConfig.saltNonce,
    callback: (txHash) => {
      transactionHash = txHash
    },
  })

  if (transactionHash) {
    return ethAdapter.getTransaction(transactionHash)
  }

  throw new Error('transactionHash is null')
}

export function* createSafeSaga(): Generator<
  StrictEffect,
  ContractTransaction
> {
  const defaultConfig = yield* select(safeSelector.defaultConfig)
  const ethAdapter = yield* select(safeSelector.ethersAdapter)
  const factoryConfig = yield* select(safeSelector.factoryConfig)
  const network = yield* select(providerSelector.network)

  if (network !== Network.Khalani) {
    throw new Error('Protocol account (Safe) must be created on Khalani chain')
  }

  if (!defaultConfig || !ethAdapter || !factoryConfig) {
    throw new Error('Safe configuration is not ready')
  }

  const tx = yield* call(createSafe, defaultConfig, ethAdapter, factoryConfig)
  yield* apply(tx, tx.wait, [Confirmations])

  return tx
}
