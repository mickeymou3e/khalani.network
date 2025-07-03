import { BigNumber } from 'ethers'

import { IPool } from '@interfaces/pool'
import { IToken } from '@interfaces/token'

export interface IRemoveLiquidityRequest {
  poolId: IPool['id']
  outTokens: IToken['address'][]
  outTokensAmounts: BigNumber[]
}
