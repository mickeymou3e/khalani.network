import { BigNumber } from 'ethers'

import { IToken, PoolTokenBalance } from '@interfaces/token'

export interface ISwapModuleProps {
  tokens: PoolTokenBalance[]
  isFetching?: boolean
  swapPossibilities: {
    [key: string]: { address: string; poolId: string }[]
  }

  slippage: number
  isFetchingBalances?: boolean
  quoteTokenValue?: BigNumber
  inProgress?: boolean

  onChange?: (
    baseToken: IToken,
    quoteToken: IToken,
    baseTokenValue: BigNumber,
  ) => void
  onSlippageChange?: (slippage: number) => void
}
