import { call, put, select } from 'typed-redux-saga'
import { safeActions } from '../safe.slice'
import { EthersAdapter, SafeAccountConfig, SafeFactory, SafeFactoryConfig } from '@safe-global/protocol-kit'
import { SafeSliceState, SafeUserConfig } from '../safe.types'
import { safeSelector } from '../safe.selector'

export async function getSafeState(safeConfig: SafeUserConfig, ethAdapter: EthersAdapter, factoryConfig: SafeFactoryConfig): Promise<Pick<SafeSliceState, 'address' | 'deployed'>> {
  const safeFactory = await SafeFactory.create(factoryConfig);

  const safeAccountConfig: SafeAccountConfig = {
    owners: safeConfig.owners,
    threshold: safeConfig.threshold
  }

  const address = await safeFactory.predictSafeAddress(
    safeAccountConfig,
    safeConfig.saltNonce
  )

  const deployed = await ethAdapter.isContractDeployed(address)

  return {
    address,
    deployed
  }
}

export function* updateSafeStateSaga(): Generator {
  const defaultConfig = yield* select(safeSelector.defaultConfig)
  const ethAdapter = yield* select(safeSelector.ethersAdapter)
  const factoryConfig = yield* select(safeSelector.factoryConfig)

  if (defaultConfig && ethAdapter && factoryConfig) {
    const state = yield* call(getSafeState, defaultConfig, ethAdapter, factoryConfig)
    yield* put(safeActions.update(state))
  }
}
