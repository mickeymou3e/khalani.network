import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { READ_ONLY_GAS_PRICE } from '@constants/Godwoken'
import { fetchLiquidations as fetchLiquidationsQuery } from '@graph/liquidations/queries'
import { fetchReserves as fetchReservesQuery } from '@graph/pools/queries'
import { IReserve } from '@graph/pools/types'
import { IPrice } from '@store/prices/prices.slice'
import { contractsSelectors } from '@store/provider/provider.selector'
import { DisplayTokenBalance } from '@store/users/users.types'
import { getAmountInDollars } from '@utils/math'

import { LiquidationDisplay } from '../liquidation.types'

export function* fetchLiquidationData(): Generator<
  StrictEffect,
  LiquidationDisplay[]
> {
  try {
    const liquidations = yield* call(fetchLiquidationsQuery)
    const reserves = yield* call(fetchReservesQuery)
    const addresses = reserves.map((reserve) => reserve.address)
    const hadoukenOracleContract = yield* select(
      contractsSelectors.hadoukenOracle,
    )
    if (hadoukenOracleContract) {
      const data = yield* call(
        hadoukenOracleContract.getAssetsPrices,
        addresses,
        {
          gasPrice: READ_ONLY_GAS_PRICE,
        },
      )
      const symbols = reserves.map((reserve) => reserve.symbol)
      const prices: IPrice[] = data.map((price, index) => ({
        price,
        id: symbols[index],
      }))

      const liquidationsDisplay = liquidations.map((liquidation) => {
        const debtBalance = getDisplayToken(
          liquidation.debtAsset,
          liquidation.debtToCover,
          reserves,
          prices,
        )
        const collateralBalance = getDisplayToken(
          liquidation.collateralAsset,
          liquidation.liquidatedCollateralAmount,
          reserves,
          prices,
        )
        return {
          id: liquidation.id,
          user: liquidation.user,
          liquidator: liquidation.liquidator,
          debt: debtBalance,
          collateral: collateralBalance,
        }
      })
      return liquidationsDisplay
    }
    return []
  } catch (error) {
    console.error(error)
    return []
  }
}

const getDisplayToken = (
  tokenAddress: string,
  tokenAmount: BigNumber,
  reserves: IReserve[],
  prices: IPrice[],
): DisplayTokenBalance => {
  const token = reserves.find(
    (reserve) => reserve.address.toLowerCase() === tokenAddress.toLowerCase(),
  )

  const amount = tokenAmount
  const price = prices.find((price) => price.id === token?.symbol)
  const amountInDollars = getAmountInDollars(
    amount,
    price?.price || BigNumber.from(0),
    token?.decimals || 0,
  )
  return {
    balance: amount,
    balanceInDollars: amountInDollars,
    symbol: token?.symbol ?? '',
    decimals: token?.decimals ?? 0,
  }
}
