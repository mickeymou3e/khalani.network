import config from '@config'
import { Network } from '@constants/Networks'
import { createSelector } from '@reduxjs/toolkit'
import { providerSelector } from '@store/provider/provider.selector'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../store.utils'
import { IChain } from './chains.types'
import {
  findChain,
  findChainByTokenSymbol,
  findChains,
} from './utils/findChain'

const chains = createSelector(
  [selectReducer(StoreKeys.Chains)],
  (reducerState) => reducerState.chains,
)

const chainsIds = createSelector([chains], (chains) =>
  chains.map(({ chainId }) => chainId),
)

const selectById = createSelector(
  [selectReducer(StoreKeys.Chains)],
  ({ chains }) =>
    (chainId: IChain['chainId']) =>
      findChain(chains, chainId),
)

const selectByIds = createSelector(
  [selectReducer(StoreKeys.Chains)],
  ({ chains }) =>
    (chainIds: IChain['chainId'][]) =>
      findChains(chains, chainIds),
)

const selectByTokenSymbol = createSelector(
  [selectReducer(StoreKeys.Chains)],
  ({ chains }) =>
    (poolTokenSymbol: string | undefined) =>
      findChainByTokenSymbol(chains, poolTokenSymbol),
)

const chainsWithoutBalancerChain = createSelector([chains], (chains) =>
  chains.filter((chain) => chain.chainId !== Network.Khalani),
)

export const chainsSelectors = {
  chains,
  chainsIds,
  selectById,
  selectByIds,
  selectByTokenSymbol,
  chainsWithoutBalancerChain,
}
