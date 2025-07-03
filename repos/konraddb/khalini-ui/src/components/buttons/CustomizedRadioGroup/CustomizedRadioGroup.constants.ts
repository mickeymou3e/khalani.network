import { BigNumber } from 'ethers'

export const getOptions = (
  decimals: number,
): { id: string; name: string; value: BigNumber }[] => [
  {
    id: '1',
    name: '0.5',
    value: BigNumber.from(5).mul(BigNumber.from(10).pow(decimals - 1)),
  },
  {
    id: '2',
    name: '1.0',
    value: BigNumber.from(10).mul(BigNumber.from(10).pow(decimals - 1)),
  },
  {
    id: '3',
    name: '2.0',
    value: BigNumber.from(20).mul(BigNumber.from(10).pow(decimals - 1)),
  },
]
