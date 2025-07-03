import { BigNumber } from 'ethers'

import { IColumn } from '@components/Table'

interface ITokenValue {
  symbol: string
  value: BigNumber
  decimals: number
}

interface IPrice {
  id: string
  price: BigNumber
}

export const assetListColumns: IColumn[] = [
  {
    name: 'assets',
    value: '',
    width: '60%',
    align: 'left',
    isSortable: false,
  },
  {
    name: 'amount',
    value: '',
    width: '40%',
    align: 'right',
    isSortable: false,
  },
]

export const calculateTotalBalance = (
  assets: ITokenValue[],
  balanceDecimal: number,
): BigNumber => {
  const totalBalance = assets.reduce((totalBalance, asset) => {
    const additionalDecimalsForAsset = balanceDecimal - asset.decimals
    const assetBalance = asset.value.mul(
      BigNumber.from(10).pow(additionalDecimalsForAsset),
    )

    return totalBalance.add(assetBalance)
  }, BigNumber.from(0))

  return totalBalance
}

export const calculateTotalBalanceInDollars = (
  assets: ITokenValue[],
  balanceDecimal: number,
  prices: IPrice[],
): BigNumber => {
  const totalBalance = assets.reduce((totalBalance, asset) => {
    const additionalDecimalsForAsset = balanceDecimal - asset.decimals
    const assetBalance = asset.value.mul(
      BigNumber.from(10).pow(additionalDecimalsForAsset),
    )

    const price =
      prices?.find((price) => price.id === asset.symbol)?.price ||
      BigNumber.from(0)

    const assetBalanceInDollars = assetBalance
      .mul(price)
      .div(BigNumber.from(10).pow(18))

    return totalBalance.add(assetBalanceInDollars)
  }, BigNumber.from(0))

  return totalBalance
}
