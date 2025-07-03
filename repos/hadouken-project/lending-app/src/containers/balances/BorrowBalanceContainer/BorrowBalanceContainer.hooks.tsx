import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { REFRESH_TOOLTIPS_MS } from '@constants/Numbers'
import { Asset, assetNameMapping } from '@hadouken-project/ui'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'

export const useUserBorrowBalancesOverTime = (): { assets: Asset[] } => {
  const [timeStamp, setTimeStamp] = useState(
    BigNumber.from(Date.now()).div(1000),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStamp(BigNumber.from(Date.now()).div(1000))
    }, REFRESH_TOOLTIPS_MS)
    return () => clearInterval(timer)
  })

  const borrowBalancesCallback = useSelector(
    balancesSelectors.selectUserBorrowBalancesCallback,
  )
  const prices = useSelector(pricesSelectors.selectAll)
  const borrowBalances = borrowBalancesCallback?.()

  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    if (borrowBalances) {
      const newAssets = borrowBalances.reduce((assets, borrowBalance) => {
        const price =
          prices?.find((price) => price.id === borrowBalance.symbol)?.price ||
          BigNumber.from(0)

        const assetBalanceInDollars = borrowBalance.value
          .mul(price)
          .div(BigNumber.from(10).pow(borrowBalance.decimals))

        assets.push({
          address: borrowBalance.address,
          balance: borrowBalance.value,
          decimals: borrowBalance.decimals,
          balanceInDollars: assetBalanceInDollars,
          symbol: borrowBalance.symbol,
          source: '',
          symbolDescription: assetNameMapping(borrowBalance.symbol),
          displayName: borrowBalance.displayName,
        })
        return assets
      }, [] as Asset[])

      setAssets(newAssets)
    }
  }, [timeStamp, setAssets, borrowBalancesCallback, prices])

  return { assets }
}
