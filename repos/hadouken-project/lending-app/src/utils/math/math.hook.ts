import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import {
  CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
  ETH_DECIMALS,
} from '@constants/Lending'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'

export const useGetUserTotalCollateral = (
  ignoreCollateralFlag = false,
): BigNumber | undefined => {
  const depositBalances = useSelector(
    balancesSelectors.selectUserDepositBalances,
  )

  const prices = useSelector(pricesSelectors.selectAll)
  const [totalCollateral, setTotalCollateral] = useState<
    BigNumber | undefined
  >()

  useEffect(() => {
    const currentTotalCollateral = depositBalances?.reduce((data, balance) => {
      if (ignoreCollateralFlag || balance.isCollateral) {
        const price =
          prices.find((price) => price.id === balance.symbol)?.price ||
          BigNumber.from(0)
        const assetCollateral = balance.value
          .mul(BigNumber.from(10).pow(ETH_DECIMALS - balance.decimals))
          .mul(price)
          .div(
            BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS),
          )

        data = data.add(assetCollateral)
      }

      return data
    }, BigNumber.from(0))

    setTotalCollateral(currentTotalCollateral ?? undefined)
  }, [depositBalances, prices])

  return totalCollateral
}

export const useGetUserTotalBorrow = (): BigNumber | undefined => {
  const borrowBalances = useSelector(balancesSelectors.selectUserBorrowBalances)

  const prices = useSelector(pricesSelectors.selectAll)
  const [totalBorrow, setTotalBorrow] = useState<BigNumber | undefined>()

  useEffect(() => {
    const currentTotalBorrow = borrowBalances?.reduce((data, balance) => {
      const price =
        prices.find((price) => price.id === balance.symbol)?.price ||
        BigNumber.from(0)

      const borrowAmount = balance.value
        .mul(BigNumber.from(10).pow(ETH_DECIMALS - balance.decimals))
        .mul(price)
        .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))

      data = data.add(borrowAmount)

      return data
    }, BigNumber.from(0))

    setTotalBorrow(currentTotalBorrow ?? undefined)
  }, [borrowBalances, prices])

  return totalBorrow
}
