import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { REFRESH_TOOLTIPS_MS } from '@constants/Numbers'
import { Asset, assetNameMapping } from '@hadouken-project/ui'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'

export const useUserDepositBalancesOverTime = (): { assets: Asset[] } => {
  const [timeStamp, setTimeStamp] = useState(
    BigNumber.from(Date.now()).div(1000),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStamp(BigNumber.from(Date.now()).div(1000))
    }, REFRESH_TOOLTIPS_MS)
    return () => clearInterval(timer)
  })

  const depositBalanceCallback = useSelector(
    balancesSelectors.selectUserDepositBalancesCallback,
  )

  const prices = useSelector(pricesSelectors.selectAll)

  const [assets, setAssets] = useState<Asset[]>([])
  const depositBalances = depositBalanceCallback?.()

  useEffect(() => {
    if (depositBalances) {
      const newAssets = depositBalances.reduce((assets, depositBalance) => {
        const price =
          prices?.find((price) => price.id === depositBalance.symbol)?.price ||
          BigNumber.from(0)

        const assetBalanceInDollars = depositBalance.value
          .mul(price)
          .div(BigNumber.from(10).pow(depositBalance.decimals))

        assets.push({
          address: depositBalance.address,
          balance: depositBalance.value,
          balanceInDollars: assetBalanceInDollars,
          decimals: depositBalance.decimals,
          symbol: depositBalance.symbol,
          symbolDescription: assetNameMapping(depositBalance.symbol),
          source: '',
          displayName: depositBalance.displayName,
        })

        return assets
      }, [] as Asset[])

      setAssets(newAssets)
    }
  }, [timeStamp, setAssets, depositBalanceCallback, prices])

  return { assets: assets }
}
