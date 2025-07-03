import { BigNumber } from 'ethers'

export interface PoolInformationFetcher {
  poolType: 'yokai' | 'hadouken' | 'binance'
  getOutGivenIn(
    amount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber>
  getInGivenOut(
    amount: BigNumber,
    tokenIn: string,
    tokenOut: string,
  ): Promise<BigNumber>
}
