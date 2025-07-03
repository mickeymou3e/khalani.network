import { BigNumber } from 'ethers'

import { IToken } from '@interfaces/token'

export interface ISSwapUnderperformedBannerProps {
  quoteToken: IToken
  quoteTokenValue: BigNumber
  baseToken: IToken
  baseTokenValue: BigNumber
  onSwapAccept: () => void
}
