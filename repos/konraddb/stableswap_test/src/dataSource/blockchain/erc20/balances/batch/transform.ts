import { BigNumber } from 'ethers'

import { Address } from '@interfaces/data'
import { IToken } from '@interfaces/token'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { BigDecimal } from '@utils/math'

export function reduceTokensBalances(
  address: Address,
  tokens: IToken[],
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
