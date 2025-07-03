import { BigNumber } from 'ethers'

import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { BigDecimal } from '@utils/math'

export function reduceTokensBalances(
  address: string,
  tokens: { address: string; decimals: number }[],
  balances: BigNumber[],
): IBalance {
  return {
    id: address,
    balances: tokens.reduce((prevBalances, currentToken, index) => {
      return {
        ...prevBalances,
        [currentToken.address]: BigDecimal.from(
          balances[index],
          currentToken.decimals,
        ),
      }
    }, {} as IBalance['balances']),
  }
}
