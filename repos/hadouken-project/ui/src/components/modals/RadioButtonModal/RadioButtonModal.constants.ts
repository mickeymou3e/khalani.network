import { BigNumber } from 'ethers'

export const getDefaultValue = (decimals: number): BigNumber => {
  return BigNumber.from(15).mul(BigNumber.from(10).pow(decimals))
}
