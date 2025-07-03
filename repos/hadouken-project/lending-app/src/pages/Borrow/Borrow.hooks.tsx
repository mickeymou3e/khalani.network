import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS } from '@constants/Lending'
import { IRow, getTokenIconComponent } from '@hadouken-project/ui'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import { calculateUserAssetMaxBorrowAmount } from '@utils/math'
import { Balance, bigNumberPercentage, createIconCell } from '@utils/table'

export const useBorrowAssetsList = (): IRow[] => {
  const [rows, setRows] = useState<IRow[]>([])
  const userData = useSelector(userDataSelector.userDataInfo)
  const tokens = useSelector(tokenSelectors.selectAll)
  const prices = useSelector(pricesSelectors.selectAll)
  const userBalances = useSelector(balancesSelectors.selectUserBalances)
  const reserves = useSelector(reservesSelectors.selectAll)
  const isFetching = useSelector(reservesSelectors.isFetching)

  useEffect(() => {
    if (isFetching) {
      setRows([])
      return
    }

    const newRows = reserves.reduce((rows, reserve) => {
      const token = tokens.find((tok) => tok.address === reserve.address)
      if (!token) return rows

      const tokenPrice =
        prices.find((price) => price.id === token.symbol)?.price ||
        BigNumber.from(0)

      const totalBorrowed = reserve
        ? reserve.totalStableDebt.add(reserve.totalVariableDebt)
        : BigNumber.from(0)

      const borrowCap =
        reserve?.borrowCap?.mul(BigNumber.from(10).pow(reserve.decimals)) ||
        BigNumber.from(0)

      const { availableBorrow } = calculateUserAssetMaxBorrowAmount(
        userData.totalCollateral,
        userData.totalBorrow,
        userData.ltv,
        token.decimals,
        reserve.availableLiquidity,
        tokenPrice,
        totalBorrowed,
        borrowCap,
      )

      const availableBorrowInDollars = availableBorrow
        .mul(tokenPrice)
        .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))
      const TokenIcon = getTokenIconComponent(token.symbol)

      rows.push({
        id: token.address,
        cells: {
          assets: {
            value: createIconCell(
              <TokenIcon width={40} height={40} />,
              token.symbol,
            ),
            sortingValue: token.symbol,
          },
          balance: {
            value: (
              <Balance
                balance={availableBorrow}
                tokenPriceInDollars={availableBorrowInDollars}
                decimals={token.decimals}
              />
            ),
          },
          VariableAPY: {
            value: bigNumberPercentage(reserve.variableBorrowRate),
            sortingValue: reserve.variableBorrowRate.toString(),
          },
          // TODO-HDK-652 bring back stable borrow
          // StableAPY: {
          //   value: bigNumberPercentage(reserve.stableBorrowRate),
          //   sortingValue: reserve.stableBorrowRate.toString(),
          // },
        },
      })

      return rows
    }, [] as IRow[])

    setRows(newRows)
  }, [isFetching, reserves, userBalances, tokens, userData, prices])

  return rows
}
