import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { IRow, getTokenComponent } from '@hadouken-project/ui'
import { ITokenFetchValue } from '@interfaces/tokens'
import { Box } from '@mui/material'
import { balancesSelectors } from '@store/balances/balances.selector'
import { IBalance } from '@store/balances/balances.types'
import { liquidationSelectors } from '@store/liquidation/liquidation.selector'
import { LiquidationDisplay } from '@store/liquidation/liquidation.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { usersSelectors } from '@store/users/users.selector'
import { User } from '@store/users/users.types'
import { getAppConfig } from '@utils/config'
import { bigNumberToString } from '@utils/stringOperations'
import { Balance, createIconCell } from '@utils/table'

const createUserRow = (user: User): IRow => {
  return {
    id: user.id,
    cells: {
      user: {
        value: user.id,
        sortingValue: user.id,
      },
      healthFactor: {
        value: user.healthFactor,
        sortingValue: Number(user.healthFactor),
      },
      debtTokens: {
        value: (
          <Box>
            {user.borrowedTokens.map((token) => (
              <Balance
                key={`borrow-${token.id}`}
                balance={token.balance}
                symbol={token.symbol}
                decimals={token.decimals || 0}
                tokenPriceInDollars={
                  token.balanceInDollars || BigNumber.from(0)
                }
                textAlign={{ xs: 'right', md: 'left' }}
              />
            ))}
          </Box>
        ),
      },
      collateralTokens: {
        value: (
          <Box>
            {user.collateralTokens.map((token) => (
              <Balance
                key={`collateral-${token.id}`}
                balance={token.balance}
                symbol={token.symbol}
                decimals={token.decimals || 0}
                tokenPriceInDollars={
                  token.balanceInDollars || BigNumber.from(0)
                }
                textAlign={{ xs: 'right', md: 'left' }}
              />
            ))}
          </Box>
        ),
      },
    },
  }
}

export const useUsersList = (): IRow[] => {
  const users = useSelector(usersSelectors.selectAll)
  const [usersList, setUsersList] = useState<IRow[]>([])

  useEffect(() => {
    setUsersList(users.map((user) => createUserRow(user)))
  }, [users])

  return usersList
}

const createLiquidationRow = (liquidation: LiquidationDisplay): IRow => {
  return {
    id: liquidation.id,
    cells: {
      user: {
        value: liquidation.user,
        sortingValue: liquidation.user,
      },
      liquidator: {
        value: liquidation.liquidator,
      },
      debtToken: {
        value: (
          <Balance
            balance={liquidation.debt.balance}
            symbol={liquidation.debt.symbol}
            decimals={liquidation.debt.decimals || 0}
            tokenPriceInDollars={
              liquidation.debt.balanceInDollars || BigNumber.from(0)
            }
            textAlign={{ xs: 'right', md: 'left' }}
          />
        ),
      },
      collateralToken: {
        value: (
          <Balance
            balance={liquidation.collateral.balance}
            symbol={liquidation.collateral.symbol}
            decimals={liquidation.collateral.decimals}
            tokenPriceInDollars={liquidation.collateral.balanceInDollars}
            textAlign={{ xs: 'right', md: 'left' }}
          />
        ),
      },
    },
  }
}

export const useLiquidationsList = (): IRow[] => {
  const liquidation = useSelector(liquidationSelectors.selectAll)
  const [liquidationsList, setLiquidationsList] = useState<IRow[]>([])

  useEffect(() => {
    setLiquidationsList(
      liquidation.map((liquidation) => createLiquidationRow(liquidation)),
    )
  }, [liquidation])

  return liquidationsList
}

const createBalanceRow = (
  balance: [string, ITokenFetchValue],
  displayDecimals = 6,
): IRow => {
  const tokenValue = balance[1]
  return {
    id: balance[0],
    cells: {
      symbol: {
        value: createIconCell(
          getTokenComponent(tokenValue.symbol),
          tokenValue.symbol,
        ),
      },
      amount: {
        value: bigNumberToString(
          tokenValue.value,
          tokenValue.decimals,
          displayDecimals,
        ),
      },
    },
  }
}

export const useBalancesList = (): IRow[] => {
  const balancesWallet = useSelector(balancesSelectors.selectAll)
  const [balancesList, setBalancesList] = useState<IRow[]>([])

  const applicationConfig = getAppConfig()
  const liquidatorAddress = applicationConfig.contracts.liquidator
  const balancesTest = liquidatorAddress
    ? balancesWallet.find((balance) => balance.id === liquidatorAddress)
    : balancesWallet[0]
  const balances = useMemo(
    () =>
      balancesTest === undefined ? [] : Object.entries(balancesTest.balances),
    [balancesTest],
  )

  useEffect(() => {
    setBalancesList(balances.map((balance) => createBalanceRow(balance)))
  }, [balances])

  return balancesList
}

export const useTreasuryBalance = (): IRow[] => {
  const balances = useSelector(balancesSelectors.selectAll)

  const treasuryAddress = getAppConfig().contracts.treasury

  const treasuryBalance = balances.find(({ id }) => id === treasuryAddress)

  if (treasuryBalance) {
    return Object.entries(treasuryBalance.balances).map((balance) =>
      createBalanceRow(balance, balance[1].decimals),
    )
  }

  return []
}

export const useProtocolFeeBalances = (): IRow[] => {
  const balances = useSelector(balancesSelectors.selectAll)

  const protocolFeeAddress = getAppConfig().contracts.protocolFeeCollector

  const protocolFeeBalance = balances.find(
    ({ id }) => id === protocolFeeAddress,
  )

  if (protocolFeeBalance) {
    return Object.entries(protocolFeeBalance.balances).map((balance) =>
      createBalanceRow(balance, balance[1].decimals),
    )
  }

  return []
}

export const useOracleBalance = (oracleAddress: string | undefined): string => {
  const balancesWallet = useSelector(balancesSelectors.selectAll)
  const [oracleBalance, setOracleBalance] = useState<string>('0')
  const CKBToken = useSelector(tokenSelectors.getNativeToken)

  const balance = useMemo(() => {
    return oracleAddress
      ? balancesWallet.find((balance) => balance.id === oracleAddress)
      : ({ balances: {} } as IBalance)
  }, [oracleAddress, balancesWallet])

  const balanceCKB = useMemo(
    () => (CKBToken ? balance?.balances[CKBToken.address] : null),
    [balance, CKBToken],
  )

  useEffect(() => {
    setOracleBalance(
      balanceCKB
        ? bigNumberToString(balanceCKB.value, balanceCKB.decimals, 6)
        : '0',
    )
  }, [balanceCKB, CKBToken])

  return oracleBalance
}
