import { BigNumber } from 'ethers'

import { BorrowType } from '@constants/Lending'

export interface ISwapBorrowModePayload {
  assetAddress: string
  amount: BigNumber
  borrowType: BorrowType
}
