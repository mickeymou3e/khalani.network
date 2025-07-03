import { BigNumber } from 'ethers'

import { BorrowType } from '@constants/Lending'

export interface IBorrowPayload {
  assetAddress: string
  amount: BigNumber
  borrowType: BorrowType
}
