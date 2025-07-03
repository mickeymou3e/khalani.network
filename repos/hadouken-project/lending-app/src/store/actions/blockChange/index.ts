import { call, delay, put, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { fetchUserBalances } from '@store/balances/fetchUserBalances/fetchUserBalances.saga'
import { pricesActions } from '@store/prices/prices.slice'
import { contractsSelectors } from '@store/provider/provider.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'

export function* updatePrices(): Generator {
  const reserves = yield* select(reservesSelectors.selectAll)
  const reserveAddresses = reserves.map((res) => res.address)
  const reserveSymbols = reserves.map((res) => res.symbol)
  const hadoukenOracle = yield* select(contractsSelectors.hadoukenOracle)

  if (hadoukenOracle) {
    const prices = yield* call(hadoukenOracle.getAssetsPrices, reserveAddresses)

    const allPrices = prices.map((price, index) => {
      return {
        id: reserveSymbols[index],
        price: price,
      }
    })

    yield* put(pricesActions.updatePricesSuccess(allPrices))
  }
}

export function* blockChangeSaga(_action: PayloadAction<number>): Generator {
  try {
    yield* call(updatePrices)
    yield* call(fetchUserBalances)
  } catch (exc) {
    console.error(exc)
  }
}

export function* waitForDataToBeUpToDate(blockNumber?: number): Generator {
  let blockUpToDate = false

  while (!blockUpToDate && blockNumber !== undefined) {
    const latestBlock = ((yield select(
      contractsSelectors.latestBlock,
    )) as unknown) as number

    blockUpToDate = blockNumber <= latestBlock

    if (!blockUpToDate) {
      yield delay(1000)
    }
  }
}
