import { Address, TokenModel } from '@store/tokens/tokens.types'
import { BigDecimal } from '@utils/math'

interface IBalance {
  id: string
  balances: {
    [key: string]: BigDecimal | null
  }
}

function reduceTokenBalances(
  address: Address,
  tokens: TokenModel[],
  balances: bigint[],
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
