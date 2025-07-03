import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { providerSelector } from '@store/provider/provider.selector'

import BatchRelayerService from '../../services/batchRelayer/batchRelayer.service'
import InvestService from '../../services/invest/invest.service'
import { BasePoolServiceProvider } from '../../services/pools/BasePool'
import { ComposableStablePoolServiceProvider } from '../../services/pools/ComposableStablePool'
import { PoolServiceProvider } from '../../services/pools/PoolService'
import { WeightedBoostedPoolServiceProvider } from '../../services/pools/WeightedBoostedPool'
import { ProtocolFeesCollector } from '../../services/protocolFees/protocolFeesCollector'
import TradeService from '../../services/trade/trade.service'

const batchRelayerService = createSelector(
  [contractsSelectors.batchRelayer],
  (batchRelayer) => {
    return batchRelayer ? new BatchRelayerService(batchRelayer) : null
  },
)

const investService = createSelector(
  [contractsSelectors.vault, contractsSelectors.poolHelpers],
  (vault, poolHelpers) =>
    vault && poolHelpers ? new InvestService(vault, poolHelpers) : null,
)

const tradeService = createSelector([contractsSelectors.vault], (vault) =>
  vault ? new TradeService(vault) : null,
)

const weightedBoostedPoolServiceProvider = createSelector(
  [tradeService, investService, batchRelayerService],
  (tradeService, investService, batchRelayerService) =>
    investService && tradeService && batchRelayerService
      ? new WeightedBoostedPoolServiceProvider(
          investService,
          tradeService,
          batchRelayerService,
        )
      : null,
)

const composableStablePoolServiceProvider = createSelector(
  [tradeService, investService, batchRelayerService],
  (tradeService, investService, batchRelayerService) =>
    investService && tradeService && batchRelayerService
      ? new ComposableStablePoolServiceProvider(
          investService,
          tradeService,
          batchRelayerService,
        )
      : null,
)

const basePoolServiceProvider = createSelector(
  [tradeService, investService],
  (tradeService, investService) =>
    investService && tradeService
      ? new BasePoolServiceProvider(investService, tradeService)
      : null,
)

const poolServiceProvider = createSelector(
  [
    composableStablePoolServiceProvider,
    basePoolServiceProvider,
    weightedBoostedPoolServiceProvider,
  ],
  (
    composableStablePoolServiceProvider,
    basePoolServiceProvider,
    weightedBoostedPoolServiceProvider,
  ) =>
    composableStablePoolServiceProvider &&
    weightedBoostedPoolServiceProvider &&
    basePoolServiceProvider
      ? new PoolServiceProvider([
          composableStablePoolServiceProvider,
          weightedBoostedPoolServiceProvider,
          basePoolServiceProvider,
        ])
      : null,
)

const poolServiceSelector = createSelector(
  [poolServiceProvider],
  (poolServiceProvider) => {
    return (pool: IPool) =>
      poolServiceProvider ? poolServiceProvider.provide(pool) : null
  },
)

const protocolFeesCollectorService = createSelector(
  [contractsSelectors.vault, providerSelector.provider],
  (vault, provider) => {
    if (vault && provider) {
      return new ProtocolFeesCollector(vault, provider)
    }
  },
)

export const servicesSelectors = {
  investService,
  tradeService,
  protocolFeesCollectorService,
  poolServiceProvider,
  poolServiceSelector,
  batchRelayerService,
}
