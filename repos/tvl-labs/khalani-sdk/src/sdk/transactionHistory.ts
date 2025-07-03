import {
  bridgeHistorySelectors,
  getBridgeHistorySaga,
  getLiquidityHistorySaga,
  liquidityHistorySelectors,
} from '@store/history'
import { intentsSelectors } from '@store/intents/intents.selector'
import { runSaga, useReduxSelector } from '@store/store.utils'
import { BridgeHistory } from '@store/history/bridge/bridge.types'
import { LiquidityHistory } from '@store/history/liquidity/liquidity.types'
import { getIntentsHistorySaga } from '@store/intents'
import { IntentHistory } from '@store/intents/intents.types'
export class TransactionHistory {
  constructor() {}

  async updateBridgeHistory(): Promise<any> {
    return await runSaga(getBridgeHistorySaga)
  }
  async updateLiquidityHistory(): Promise<any> {
    return await runSaga(getLiquidityHistorySaga)
  }
  async updateIntentsHistory(): Promise<any> {
    return await runSaga(getIntentsHistorySaga)
  }

  async getBridgeHistory(): Promise<BridgeHistory[] | null> {
    const bridgeHistory = useReduxSelector(bridgeHistorySelectors.selectAll)
    return bridgeHistory
  }
  async getLiquidityHistory(): Promise<LiquidityHistory[] | null> {
    const liquidityHistory = useReduxSelector(
      liquidityHistorySelectors.selectAll,
    )
    return liquidityHistory
  }
  async getIntentsHistory(): Promise<IntentHistory[] | null> {
    const intentsHistory = useReduxSelector(intentsSelectors.selectAll)
    return intentsHistory
  }
  async getLiquidityIntents(): Promise<IntentHistory[] | null> {
    const liquidityIntentsHistory = useReduxSelector(
      intentsSelectors.liquidityIntents,
    )
    return liquidityIntentsHistory
  }
}
