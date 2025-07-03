import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { BorrowType } from '@constants/Lending'
import {
  convertBigNumberToDecimal,
  getTokenIconComponent,
  IRow,
  Switch,
} from '@hadouken-project/ui'
import { Box, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import { calculateStableDebt, calculateVariableDebt } from '@utils/math'
import { usePushHistoryInternal } from '@utils/navigation'
import {
  bigNumberPercentage,
  CreateButtons,
  createIconCell,
} from '@utils/table'

import BorrowBalance from './BorrowBalance.component'
import DepositBalance from './DepositBalance.component'

export const useDashboardDepositList = (): IRow[] | undefined => {
  const [rows, setRows] = useState<IRow[] | undefined>()
  const userDeposit = useSelector(balancesSelectors.selectUserDepositBalances)

  const tokens = useSelector(tokenSelectors.selectAll)
  const reserves = useSelector(reservesSelectors.selectAll)
  const isFetching = useSelector(reservesSelectors.isFetching)
  const userDataInfo = useSelector(userDataSelector.userDataInfo)

  const pushHistoryInternal = usePushHistoryInternal()
  const dispatch = useDispatch<StoreDispatch>()

  const onDepositClick = useCallback(
    (address: string) => {
      if (address) {
        pushHistoryInternal(`deposit/${address}`)
      }
    },
    [pushHistoryInternal],
  )
  const onWithdrawClick = useCallback(
    (address: string) => {
      if (address) {
        pushHistoryInternal(`withdraw/${address}`)
      }
    },
    [pushHistoryInternal],
  )

  const onCollateralClick = useCallback(
    (tokenAddress: string, isCollateral: boolean) => {
      const query = isCollateral ? 'true' : 'false'
      if (tokenAddress) {
        pushHistoryInternal(
          `collateral-switch/${tokenAddress}`,
          `isCollateral=${query}`,
        )
      }
    },
    [pushHistoryInternal],
  )

  useEffect(() => {
    if (isFetching) {
      setRows(undefined)
      return
    }

    const newRows =
      userDeposit?.reduce((rows, deposit) => {
        const token = tokens.find(
          (tok) => tok.address.toLowerCase() === deposit.address.toLowerCase(),
        )
        const reserve = reserves.find(
          (x) => x.aTokenAddress.toLowerCase() === token?.address.toLowerCase(),
        )

        if (!token || !reserve) return rows
        const TokenIcon = getTokenIconComponent(token.symbol.slice(1))

        rows.push({
          id: token.address,
          cells: {
            assets: {
              value: createIconCell(
                <TokenIcon width={40} height={40} />,
                reserve.symbol,
              ),
              sortingValue: reserve.symbol,
            },
            balance: {
              value: <DepositBalance aTokenAddress={reserve.aTokenAddress} />,
              sortingValue: convertBigNumberToDecimal(
                deposit.value,
                deposit.decimals,
              ),
            },
            APY: {
              value: bigNumberPercentage(reserve.liquidityRate),
            },
            collateral: {
              value: (
                <Switch
                  checked={deposit?.isCollateral}
                  onChange={() =>
                    onCollateralClick(reserve.address, !deposit?.isCollateral)
                  }
                  disabled={reserve?.ltv?.eq(BigNumber.from(0))}
                />
              ),
            },
            button: {
              value: CreateButtons(
                {
                  text: 'Deposit',
                  onClick: (): void => onDepositClick(reserve.address),
                  testID: `deposit-${reserve.address}`,
                  size: 'small',
                },
                {
                  text: 'Withdraw',
                  onClick: (): void => onWithdrawClick(reserve.address),
                  testID: `withdraw-${reserve.address}`,
                  size: 'small',
                },
              ),
            },
          },
        })

        return rows
      }, [] as IRow[]) || ([] as IRow[])

    setRows(newRows)
  }, [
    isFetching,
    reserves,
    tokens,
    userDeposit,
    onDepositClick,
    onWithdrawClick,
    onCollateralClick,
    userDataInfo,
    dispatch,
  ])

  return rows
}

export const useDashboardBorrowList = (): IRow[] | undefined => {
  const allDebtTokens = useSelector(tokenSelectors.selectAllDebtTokens)
  const balances = useSelector(balancesSelectors.selectUserBorrowBalances)
  const pushHistoryInternal = usePushHistoryInternal()
  const reserves = useSelector(reservesSelectors.selectAll)
  const isFetching = useSelector(reservesSelectors.isFetching)
  const userData = useSelector(userDataSelector.userDataInfo)
  const [borrowBalances, setBorrowBalances] = useState<IRow[] | undefined>()

  const onBorrowClick = useCallback(
    (tokenAddress: string) => {
      if (tokenAddress) {
        pushHistoryInternal(`borrow/${tokenAddress}`)
      }
    },
    [pushHistoryInternal],
  )
  const onInterestSwap = useCallback(
    (tokenAddress: string, isVariableDebt: boolean) => {
      if (tokenAddress) {
        const borrowType = isVariableDebt ? 'Variable' : 'Stable'
        pushHistoryInternal(
          `interest-swap/${tokenAddress}`,
          `interestType=${borrowType}`,
        )
      }
    },
    [pushHistoryInternal],
  )
  const onRepayClick = useCallback(
    (tokenAddress: string, borrowType: BorrowType) => {
      if (tokenAddress) {
        pushHistoryInternal(`repay/${tokenAddress}`, `borrowType=${borrowType}`)
      }
    },
    [pushHistoryInternal],
  )

  useEffect(() => {
    if (isFetching) {
      setBorrowBalances(undefined)
      return
    }

    const userBorrowBalances = allDebtTokens?.reduce((rows, token) => {
      const balance = balances?.find(
        (balance) => balance.address === token.address,
      )
      const reserve = reserves.find(
        (reserve) =>
          reserve.variableDebtTokenAddress === token.address ||
          reserve.stableDebtTokenAddress === token.address,
      )
      if (balance && reserve) {
        const calculations = token.isVariableDebt
          ? calculateVariableDebt(
              balance.value,
              reserve.variableBorrowRate,
              reserve.variableBorrowIndex,
              reserve.lastUpdateTimestamp,
            )
          : calculateStableDebt(
              balance.value,
              reserve.stableBorrowRate,
              reserve.lastUpdateTimestamp,
            )
        const APY = token.isVariableDebt
          ? reserve.variableBorrowRate
          : reserve.stableBorrowRate
        const borrowType = token.isVariableDebt ? 2 : 1

        const name = reserve.symbol
        const TokenIcon = getTokenIconComponent(reserve.symbol)

        rows.push({
          id: token.address,
          cells: {
            assets: {
              value: createIconCell(<TokenIcon width={40} height={40} />, name),
              sortingValue: name,
            },
            borrowed: {
              value: <BorrowBalance tokenAddress={token.address} />,
              sortingValue: convertBigNumberToDecimal(
                calculations,
                reserve.decimals,
              ),
            },

            APY: {
              value: bigNumberPercentage(APY),
              sortingValue: APY.toString(),
            },
            APYType: {
              value: (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="paragraphTiny"
                    color={(theme) =>
                      token.isVariableDebt
                        ? theme.palette.text.secondary
                        : theme.palette.common.white
                    }
                  >
                    Stable
                  </Typography>
                  <Box px={1}>
                    <Switch
                      checked={token.isVariableDebt}
                      onChange={() =>
                        onInterestSwap(
                          reserve.address,
                          token.isVariableDebt ?? false,
                        )
                      }
                    />
                  </Box>
                  <Typography
                    variant="paragraphTiny"
                    color={(theme) =>
                      token.isVariableDebt
                        ? theme.palette.common.white
                        : theme.palette.text.secondary
                    }
                  >
                    Variable
                  </Typography>
                </div>
              ),
            },

            button: {
              value: CreateButtons(
                {
                  text: 'Borrow',
                  onClick: (): void => onBorrowClick(reserve.address),
                  testID: `borrow-${token.address}`,
                  size: 'small',
                },
                {
                  text: 'Repay',
                  onClick: (): void =>
                    onRepayClick(reserve.address, borrowType),
                  testID: `repay-${token.address}`,
                  size: 'small',
                },
              ),
            },
          },
        })
      }

      return rows
    }, [] as IRow[])

    setBorrowBalances(userBorrowBalances)
  }, [
    balances,
    allDebtTokens,
    reserves,
    onBorrowClick,
    onRepayClick,
    onInterestSwap,
    isFetching,
    userData,
  ])
  return borrowBalances
}
