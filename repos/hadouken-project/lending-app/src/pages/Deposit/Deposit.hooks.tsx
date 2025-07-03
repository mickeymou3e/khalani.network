import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS } from '@constants/Lending'
import { IRow, getTokenIconComponent } from '@hadouken-project/ui'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { pricesSelectors } from '@store/prices/prices.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { maxAmountWithCap } from '@utils/math'
import { Balance, bigNumberPercentage, createIconCell } from '@utils/table'

export const useDepositAssetsList = (): IRow[] => {
  const [rows, setRows] = useState<IRow[]>([])
  const tokens = useSelector(tokenSelectors.selectAll)
  const userBalances = useSelector(balancesSelectors.selectUserBalances)
  const reserves = useSelector(reservesSelectors.selectAll)
  const prices = useSelector(pricesSelectors.selectAll)
  const isFetching = useSelector(reservesSelectors.isFetching)

  useEffect(() => {
    if (isFetching) {
      setRows([])
      return
    }

    const newRows = reserves.reduce((rows, reserve) => {
      const balance =
        userBalances && userBalances.balances?.[reserve.address]?.value
          ? userBalances.balances[reserve.address]?.value
          : BigNumber.from(0)

      const depositCap =
        reserve?.depositCap?.mul(BigNumber.from(10).pow(reserve.decimals)) ||
        BigNumber.from(0)
      const totalBorrowed = reserve
        ? reserve.totalStableDebt.add(reserve.totalVariableDebt)
        : BigNumber.from(0)
      const marketSize = reserve?.availableLiquidity.add(totalBorrowed)
      const maxAmount = maxAmountWithCap(marketSize, depositCap, balance)

      const token = tokens.find((x) => x.address === reserve.address)
      const price =
        prices.find((p) => p.id === token?.symbol)?.price || BigNumber.from(0)
      const tokenPriceInDollars = maxAmount
        .mul(price)
        .div(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))

      if (!token) return rows

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
          canBeCollateral: {
            value: BigNumber.from(0).eq(reserve.ltv) ? (
              <Box height="24px">
                <CancelIcon
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                />
              </Box>
            ) : (
              <Box height="24px">
                <CheckCircleIcon
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                />
              </Box>
            ),
          },
          balance: {
            value: (
              <Balance
                balance={maxAmount}
                tokenPriceInDollars={tokenPriceInDollars}
                decimals={token.decimals}
              />
            ),
          },
          APY: {
            value: bigNumberPercentage(reserve.liquidityRate),
            sortingValue: reserve.liquidityRate.toString(),
          },
        },
      })

      return rows
    }, [] as IRow[])

    setRows(newRows)
  }, [isFetching, reserves, userBalances, tokens, prices])

  return rows
}
