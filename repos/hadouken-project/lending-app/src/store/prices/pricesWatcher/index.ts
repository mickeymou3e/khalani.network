import { all, call, select, take, put } from 'typed-redux-saga'

import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState } from '@store/wallet/wallet.types'

import { reservesActions } from '../../reserves/reserves.slice'
import { IPrice, pricesActions } from '../prices.slice'

export function* watchPrices(): Generator {
  yield* all([take(providerActions.initializeProviderSuccess)])

  while (true) {
    yield* take(walletActions.changeConnectionStateStatus)
    yield* take(reservesActions.fetchReservesSuccess)
    const { connectionState } = yield* select(
      walletSelectors.connectionStateStatus,
    )
    if (connectionState === ConnectionState.Connected) {
      const assets = yield* select(reservesSelectors.selectAll)
      const addresses = assets.map((asset) => asset.address)

      const hadoukenOracleContract = yield* select(
        contractsSelectors.hadoukenOracle,
      )

      if (hadoukenOracleContract) {
        try {
          const data = yield* call(
            hadoukenOracleContract.getAssetsPrices,
            addresses,
          )
          const symbols = assets.map((asset) => asset.symbol)
          const allPrices: IPrice[] = data.map((price, index) => ({
            price,
            id: symbols[index],
          }))
          yield* put(pricesActions.updatePricesSuccess(allPrices))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
