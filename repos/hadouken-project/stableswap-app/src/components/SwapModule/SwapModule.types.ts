import { TokenModelBalance } from '@hadouken-project/ui'
import { PoolTokenBalance } from '@interfaces/token'

export interface ISwapModuleProps {
  tokens: PoolTokenBalance[]

  isFetchingBalances?: boolean
}
export type BaseAndQuoteToken = {
  baseToken: TokenModelBalance | undefined
  quoteToken: TokenModelBalance | undefined
  sortedTokens: TokenModelBalance[]
  quoteTokenOptions: TokenModelBalance[]
}
