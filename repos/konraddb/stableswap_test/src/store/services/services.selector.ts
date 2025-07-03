import { IPool } from '@interfaces/pool'
import { createSelector } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { providerSelector } from '@store/provider/provider.selector'

import InvestService from '../../services/invest/invest.service'
import { BasePoolServiceProvider } from '../../services/pools/BasePool'
import { ComposableStablePoolServiceProvider } from '../../services/pools/ComposableStablePool'
import { CrossChainComposableStablePoolServiceProvider } from '../../services/pools/CrossChainComposableStablePool'
import { PoolServiceProvider } from '../../services/pools/PoolService'
import { ProtocolFeesCollector } from '../../services/protocolFees/protocolFeesCollector'
import TradeService from '../../services/trade/trade.service'

const investService = createSelector(
  [contractsSelectors.vault, contractsSelectors.poolHelpers],
  (vault, poolHelpers) =>
    vault && poolHelpers ? new InvestService(vault, poolHelpers) : null,
)

const tradeService = createSelector([contractsSelectors.vault], (vault) =>
  vault ? new TradeService(vault) : null,
)

const crossChainComposableStablePoolServiceProvider = createSelector(
  [tradeService, investService, contractsSelectors.crossChainRouter],
  (tradeService, investService, crossChainRouter) => {
    if (investService && tradeService && crossChainRouter) {
      return new CrossChainComposableStablePoolServiceProvider(
        investService,
        tradeService,
        crossChainRouter,
      )
    }

    return null
  },
)

const composableStablePoolServiceProvider = createSelector(
  [tradeService, investService],
  (tradeService, investService) =>
    investService && tradeService
      ? new ComposableStablePoolServiceProvider(investService, tradeService)
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
  [composableStablePoolServiceProvider, basePoolServiceProvider],
  (composableStablePoolServiceProvider, basePoolServiceProvider) =>
    composableStablePoolServiceProvider && basePoolServiceProvider
      ? new PoolServiceProvider([
          composableStablePoolServiceProvider,
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
  crossChainComposableStablePoolServiceProvider,
}
