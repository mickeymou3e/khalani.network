import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import {
  BigNumberWithTooltip,
  Button,
  convertBigNumberToDecimal,
  getTokenIconComponent,
  IRow,
} from '@hadouken-project/ui'
import { IBackstopPool } from '@interfaces/data'
import { Box } from '@mui/material'
import { backstopSelectors } from '@store/backstop/backstop.selector'
import { usePushHistoryInternal } from '@utils/navigation'
import { bigNumberPercentage, createIconCell } from '@utils/table'

const createRow = (
  pool: IBackstopPool,
  onDepositClick: (address: string) => void,
  onWithdrawClick: (address: string) => void,
): IRow => {
  const TokenIcon = getTokenIconComponent(pool?.symbol)
  const row: IRow = {
    id: pool?.address,
    cells: {
      assets: {
        value: createIconCell(
          <TokenIcon width={40} height={40} />,
          `h${pool?.symbol}`,
        ),
        sortingValue: pool?.symbol,
      },
      market: {
        value: (
          <BigNumberWithTooltip
            value={pool.totalBalance}
            decimals={pool.decimals ?? 0}
            showDollars={true}
          />
        ),
        sortingValue: Number(
          convertBigNumberToDecimal(pool.totalBalance, pool.decimals ?? 0),
        ),
      },

      apy: {
        value: bigNumberPercentage(BigNumber.from(0)), // TODO
      },
      actions: {
        value: (
          <Box display="flex">
            <Button
              fullWidth
              variant="contained"
              size="small"
              text="deposit"
              onClick={() => onDepositClick(pool.address)}
            />
            <Button
              sx={{ ml: 2 }}
              fullWidth
              variant="contained"
              size="small"
              text="withdraw"
              onClick={() => onWithdrawClick(pool.address)}
            />
          </Box>
        ),
      },
    },
  }
  return row
}

export const useBackstopList = (): IRow[] => {
  const pushHistoryInternal = usePushHistoryInternal()
  const [backstopList, setBackstopPool] = useState<IRow[]>([])
  const pools = useSelector(backstopSelectors.selectAll)
  const isFetching = useSelector(backstopSelectors.isFetching)

  useEffect(() => {
    if (isFetching) {
      setBackstopPool([])
      return
    }
    const onDepositClick = (address: string) => {
      pushHistoryInternal(`/backstop/deposit/${address}`)
    }
    const onWithdrawClick = (address: string) => {
      pushHistoryInternal(`/backstop/withdraw/${address}`)
    }
    setBackstopPool(
      pools.map((pool) => createRow(pool, onDepositClick, onWithdrawClick)),
    )
  }, [pools, isFetching, pushHistoryInternal])

  return backstopList
}
