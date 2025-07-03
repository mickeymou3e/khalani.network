import React from 'react'

import { poolTransactionTime } from '@containers/pools/utils'
import { Liquidation } from '@dataSource/graph/backstop/types'
import {
  IColumn,
  IRow,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
} from '@hadouken-project/ui'
import { Typography } from '@mui/material'

const LIQUIDATION_TABLE_COLUMNS = {
  PROFIT: 'profit',
  REPAY: 'repay',
  DEBT: 'debt',
  COLLATERAL: 'collateral',
  USER: 'user',
  TIME: 'time',
}

export const COLUMNS: IColumn[] = [
  {
    name: LIQUIDATION_TABLE_COLUMNS.PROFIT,
    width: '15%',
    isSortable: false,
    value: 'Profit',
  },
  {
    name: LIQUIDATION_TABLE_COLUMNS.DEBT,
    width: '10%',
    isSortable: false,
    value: 'Debt token',
  },
  {
    name: LIQUIDATION_TABLE_COLUMNS.REPAY,
    width: '15%',
    isSortable: false,
    value: 'Repay amount',
  },
  {
    name: LIQUIDATION_TABLE_COLUMNS.COLLATERAL,
    width: '10%',
    isSortable: false,
    value: 'Collateral token',
  },

  {
    name: LIQUIDATION_TABLE_COLUMNS.USER,
    width: '30%',
    isSortable: false,
    value: 'Liquidated user',
  },
  {
    name: LIQUIDATION_TABLE_COLUMNS.TIME,
    width: '20%',
    isSortable: false,
    value: 'Time',
  },
]

export const getRows = (
  liquidations: Liquidation[],
  chainId: string,
): IRow[] => {
  const rows: IRow[] = [...liquidations]
    .sort((tx1, tx2) => {
      return tx2.timestamp - tx1.timestamp
    })
    .map(
      ({
        id,
        debtToken,
        collateralToken,
        profit,
        repayAmount,
        timestamp,
        user,
      }) => {
        const DebtIcon = getTokenIconWithChainComponent(debtToken?.symbol ?? '')
        const CollateralIcon = getTokenIconWithChainComponent(
          collateralToken?.symbol ?? '',
        )

        return {
          id,
          cells: {
            [LIQUIDATION_TABLE_COLUMNS.PROFIT]: {
              value: (
                <Typography>
                  {convertNumberToStringWithCommas(
                    Number(profit.toNumber()),
                    4,
                    true,
                  )}
                </Typography>
              ),
            },
            [LIQUIDATION_TABLE_COLUMNS.DEBT]: {
              value: <DebtIcon />,
            },
            [LIQUIDATION_TABLE_COLUMNS.REPAY]: {
              value: (
                <Typography>
                  {convertNumberToStringWithCommas(
                    Number(repayAmount.toNumber()),
                    4,
                    true,
                  )}
                </Typography>
              ),
            },
            [LIQUIDATION_TABLE_COLUMNS.COLLATERAL]: {
              value: <CollateralIcon />,
            },
            [LIQUIDATION_TABLE_COLUMNS.USER]: {
              value: user,
            },
            [LIQUIDATION_TABLE_COLUMNS.TIME]: {
              value: poolTransactionTime(Number(timestamp), id, chainId),
            },
          },
        }
      },
    )

  return rows
}
