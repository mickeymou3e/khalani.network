import { BigNumber } from 'ethers'

import { ITokenBalance } from '@interfaces/tokens'

export type IUserAccountDataWithInitialize = IUserAccountData & {
  isInitialized: boolean
}

export interface IUserAccountData {
  totalCollateral: BigNumber
  totalDeposit: BigNumber
  totalBorrow: BigNumber
  currentLiquidationThreshold: BigNumber
  ltv: BigNumber
  depositAssets: IDepositAsset[]
}

export interface IDepositAsset {
  TokenBalance: ITokenBalance
  isCollateral: boolean
}
