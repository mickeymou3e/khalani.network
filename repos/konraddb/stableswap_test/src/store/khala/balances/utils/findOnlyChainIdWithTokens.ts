import { Network } from '@constants/Networks'
import { IKhalaBalances } from '@store/khala/balances/balances.types'

export const findTheOnlyChainIdWithTokens = (
  tokens: IKhalaBalances[],
): Network | undefined => {
  const chainsWithBalances: Network[] = []

  for (const token of tokens) {
    if (token.balance.gt(0) && !chainsWithBalances.includes(token.chainId)) {
      chainsWithBalances.push(token.chainId)
    }

    if (chainsWithBalances.length > 1) {
      break
    }
  }

  if (chainsWithBalances.length === 1) {
    return chainsWithBalances[0]
  }
}
