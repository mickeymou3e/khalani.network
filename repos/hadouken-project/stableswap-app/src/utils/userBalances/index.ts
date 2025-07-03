import { BigNumber } from 'ethers'

import { Network } from '@constants/Networks'
import { mapTokenNames } from '@dataSource/graph/pools/poolsTokens/mapper'
import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { Asset } from '@hadouken-project/ui'
import { IPool } from '@interfaces/pool'
import { Dictionary } from '@reduxjs/toolkit'
import { IPrice } from '@store/prices/prices.types'
import { DepositBalances } from '@store/userShares/userShares.types'
import { BigDecimal } from '@utils/math'
import { sortAssetsByBusinessOrder } from '@utils/token'

export const getAssetListForUserBalances = (
  tokens: IPoolToken[] | undefined,
  balances: DepositBalances,
  prices: Dictionary<IPrice>,
  chainId: Network,
  pool?: IPool,
): Asset[] => {
  return tokens
    ? tokens
        .map((token) => {
          // initialize the token balance and balance in dollars to 0
          let value = BigDecimal.from(0)
          let valueInDollars = BigDecimal.from(0, 27)

          if (pool) {
            const depositBalance = balances[pool.address]?.[token.address]

            if (depositBalance) {
              value = depositBalance

              const price = prices[token.address]

              if (price) {
                valueInDollars = value.mul(price.price)

                if (valueInDollars.decimals < 27) {
                  valueInDollars = BigDecimal.from(
                    valueInDollars
                      .toBigNumber()
                      .mul(
                        BigNumber.from(10).pow(27 - valueInDollars.decimals),
                      ),
                    27,
                  )
                }
              }
            }
          }

          const mappedToken = mapTokenNames(token, chainId)

          return {
            address: token.address,
            decimals: value.decimals,
            symbol: token.symbol,
            symbolDescription: mappedToken?.name ?? token.name,
            balance: value.toBigNumber(),
            balanceInDollars: valueInDollars.toBigNumber(),
            displayName: token.displayName,
            source: token.source ?? '',
          }
        })
        .sort((tokenA, tokenB) =>
          sortAssetsByBusinessOrder(tokenA.symbol, tokenB.symbol),
        )
    : []
}
