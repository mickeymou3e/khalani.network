import { getConfig } from '@hadouken-project/lending-contracts'
import {
  IBorrowBalanceToken,
  IReserve,
  ITokenValueWithNameAndCollateral,
  TokenModel,
} from '@interfaces/tokens'
import { createSelector } from '@reduxjs/toolkit'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { StoreKeys } from '@store/store.keys'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import { IDepositAsset } from '@store/userData/userData.types'
import {
  calculateBalanceWithEarnings,
  calculateStableDebt,
  calculateVariableDebt,
} from '@utils/math'
import { ENVIRONMENT } from '@utils/stringOperations'

import { selectReducer } from '../store.utils'
import { walletSelectors } from '../wallet/wallet.selector'
import { balancesAdapter } from './balances.slice'
import { IBalance } from './balances.types'

const selectUserBalances = createSelector(
  [selectReducer(StoreKeys.Balances), selectReducer(StoreKeys.Wallet)],
  (balancesState, walletState) => {
    if (walletState.applicationChainId && walletState.ethAddress) {
      const userBalance = balancesAdapter
        .getSelectors()
        .selectById(balancesState, walletState.ethAddress)

      if (!userBalance) {
        return null
      }

      const config = getConfig(walletState.applicationChainId)?.(ENVIRONMENT)
      const wrapTokenAddress = config?.nativeToken?.wrapAddress
      if (wrapTokenAddress) {
        const balances = { ...userBalance.balances }
        if (balances) {
          balances[wrapTokenAddress.toLowerCase()] =
            balances[config?.nativeToken?.address.toLowerCase()]
        }

        return {
          id: userBalance?.id,
          balances,
        }
      } else {
        return userBalance
      }
    }

    return null
  },
)

const selectUserTokenBalance = createSelector(
  [selectReducer(StoreKeys.Balances), selectReducer(StoreKeys.Wallet)],
  (balancesState, walletState) => (tokenAddress: string) => {
    if (walletState.applicationChainId && walletState.ethAddress) {
      const config = getConfig(walletState.applicationChainId)?.(ENVIRONMENT)

      const isWrapped =
        config?.nativeToken?.wrapAddress?.toLowerCase() ===
        tokenAddress.toLowerCase()
      if (isWrapped) {
        return balancesAdapter
          .getSelectors()
          .selectById(balancesState, walletState.ethAddress)?.balances[
          config.nativeToken.address
        ]
      } else {
        return balancesAdapter
          .getSelectors()
          .selectById(balancesState, walletState.ethAddress)?.balances[
          tokenAddress
        ]
      }
    }
    return null
  },
)

const selectUserTokensBalance = createSelector(
  [selectReducer(StoreKeys.Balances), selectReducer(StoreKeys.Wallet)],
  (balancesState, walletState) => (tokenAddress: string[]) => {
    if (!walletState?.ethAddress) return null

    const walletBalances = balancesAdapter
      .getSelectors()
      .selectById(balancesState, walletState.ethAddress)

    return tokenAddress
      .map((address) => walletBalances?.balances[address])
      .filter((x) => x !== undefined)
  },
)

const selectAllUserTokensBalance = createSelector(
  [selectReducer(StoreKeys.Balances), selectReducer(StoreKeys.Wallet)],
  (balancesState, walletState) => {
    if (!walletState?.ethAddress) return null

    const walletBalances = balancesAdapter
      .getSelectors()
      .selectById(balancesState, walletState.ethAddress)

    const keys = Object.keys(walletBalances?.balances ?? {})
    return keys
      .map((address) => walletBalances?.balances[address])
      .filter((x) => x !== undefined)
  },
)

const selectTokenBalance = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => (walletAddress: string, tokenAddress: string) =>
    balancesAdapter.getSelectors().selectById(state, walletAddress)?.balances[
      tokenAddress
    ],
)

const selectTokensBalance = createSelector(
  selectReducer(StoreKeys.Balances),
  (state) => (walletAddress: string, tokenAddress: string[]) => {
    const walletBalances = balancesAdapter
      .getSelectors()
      .selectById(state, walletAddress)

    const balances = tokenAddress
      .map((address) => walletBalances?.balances[address])
      .filter((x) => x !== undefined)

    return balances
  },
)

const getUserDepositBalances = (
  balances: IBalance,
  aTokens: TokenModel[],
  reserves: IReserve[],
  userDeposits: IDepositAsset[],
) => {
  const userDepositBalances: ITokenValueWithNameAndCollateral[] = aTokens.reduce(
    (data, token) => {
      const reserve = reserves.find((x) => x.aTokenAddress === token.address)

      const isCollateral = userDeposits.find(
        (deposit) => deposit?.TokenBalance?.tokenAddress === reserve?.address,
      )?.isCollateral

      const balance = balances?.balances[token.address]
      if (balance?.value?.gt(0)) {
        if (reserve) {
          const tokenBalanceWithEarnings = calculateBalanceWithEarnings(
            balance.value,
            reserve.liquidityIndex,
            reserve.liquidityRate,
            reserve.lastUpdateTimestamp,
          )

          data.push({
            address: token.address,
            decimals: token.decimals,
            symbol: reserve.symbol,
            name: reserve.symbol,
            displayName: reserve.displayName,
            value: tokenBalanceWithEarnings,
            isCollateral: isCollateral ?? false,
          })
        }
      }

      return data
    },
    [] as ITokenValueWithNameAndCollateral[],
  )

  return userDepositBalances
}

const selectUserDepositBalances = createSelector(
  [
    selectUserBalances,
    tokenSelectors.selectAllDepositTokens,
    reservesSelectors.selectAll,
    userDataSelector.userDeposits,
  ],
  (balances, aTokens, reserves, userDeposits) =>
    balances
      ? getUserDepositBalances(balances, aTokens, reserves, userDeposits)
      : undefined,
)

const selectUserDepositBalancesCallback = createSelector(
  [
    selectUserBalances,
    tokenSelectors.selectAllDepositTokens,
    reservesSelectors.selectAll,
    userDataSelector.userDeposits,
  ],
  (balances, aTokens, reserves, userDeposits) => () =>
    balances
      ? getUserDepositBalances(balances, aTokens, reserves, userDeposits)
      : null,
)
const selectUserDepositBalance = createSelector(
  [
    selectUserBalances,
    tokenSelectors.selectAllDepositTokens,
    reservesSelectors.selectAll,
    userDataSelector.userDeposits,
  ],
  (balances, aTokens, reserves, userDeposits) => (
    tokenAddress?: string | null,
  ) => {
    const token = aTokens.find((x) => x.address === tokenAddress)

    if (!token) return null

    const reserve = reserves.find((x) => x.aTokenAddress === token.address)
    const isCollateral = reserve
      ? userDeposits.find((deposit) =>
          deposit?.TokenBalance?.tokenAddress.startsWith(reserve.address),
        )?.isCollateral
      : false

    const balance = balances?.balances[token.address]
    if (balance && balance.value) {
      if (reserve) {
        const tokenBalanceWithEarnings = calculateBalanceWithEarnings(
          balance.value,
          reserve.liquidityIndex,
          reserve.liquidityRate,
          reserve.lastUpdateTimestamp,
        )

        const tokeBalance: ITokenValueWithNameAndCollateral = {
          address: token.address,
          decimals: token.decimals,
          symbol: reserve.symbol,
          name: reserve.symbol,
          displayName: reserve.symbol,
          value: tokenBalanceWithEarnings,
          isCollateral: isCollateral ?? false,
        }
        return tokeBalance
      }
    }
    return null
  },
)

const getUserBorrowBalances = (
  balances: IBalance,
  debtTokens: TokenModel[],
  reserves: IReserve[],
) => {
  const userBorrowBalances: IBorrowBalanceToken[] = debtTokens.reduce(
    (data, token) => {
      const balance = balances?.balances[token.address]
      const reserve = reserves.find(
        (reserve) =>
          reserve.variableDebtTokenAddress === token.address ||
          reserve.stableDebtTokenAddress === token.address,
      )

      if (balance && balance.value.gt(0) && reserve) {
        const value = token.isVariableDebt
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

        const name = token.isVariableDebt
          ? `${reserve.symbol} Variable`
          : `${reserve.symbol} Stable`

        data.push({
          address: token.address,
          symbol: reserve.symbol,
          name: name,
          value: value,
          decimals: token.decimals,
          displayName: token.displayName,
          isVariableDebt: token.isVariableDebt ?? false,
          isStableDebt: token.isStableDebt ?? false,
        })
      }
      return data
    },
    [] as IBorrowBalanceToken[],
  )

  return userBorrowBalances
}

const selectUserBorrowBalance = createSelector(
  [selectUserBalances, reservesSelectors.selectAll],
  (balances, reserves) => (tokenAddress: string) => {
    const balance = balances?.balances[tokenAddress]
    const reserve = reserves.find(
      (reserve) =>
        reserve.variableDebtTokenAddress === tokenAddress ||
        reserve.stableDebtTokenAddress === tokenAddress,
    )

    if (balance && reserve) {
      const isVariableDebt = reserve.variableDebtTokenAddress === tokenAddress
      const value = isVariableDebt
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

      const name = isVariableDebt
        ? `${reserve.symbol} Variable`
        : `${reserve.symbol} Stable`

      return {
        address: tokenAddress,
        symbol: reserve.symbol,
        name: name,
        value: value,
        decimals: reserve.decimals,
        isVariableDebt: isVariableDebt,
        isStableDebt: !isVariableDebt,
      }
    }

    return null
  },
)

const selectUserBorrowBalances = createSelector(
  [
    selectUserBalances,
    tokenSelectors.selectAllDebtTokens,
    reservesSelectors.selectAll,
  ],
  (balances, debtTokens, reserves) =>
    balances ? getUserBorrowBalances(balances, debtTokens, reserves) : null,
)

const selectUserNativeTokenBalance = createSelector(
  [selectUserTokenBalance, walletSelectors.applicationChainId],
  (userTokenBalance, applicationChainId) => {
    const config = getConfig(applicationChainId)?.(ENVIRONMENT)

    return userTokenBalance(config?.nativeToken?.address ?? '')
  },
)

const selectUserBorrowBalancesCallback = createSelector(
  [
    selectUserBalances,
    tokenSelectors.selectAllDebtTokens,
    reservesSelectors.selectAll,
  ],
  (balances, debtTokens, reserves) => () =>
    balances
      ? getUserBorrowBalances(balances, debtTokens, reserves)
      : undefined,
)

export const balancesSelectors = {
  selectUserBalances,
  selectUserTokensBalance,
  selectUserTokenBalance,
  selectAllUserTokensBalance,
  selectTokenBalance,
  selectTokensBalance,
  selectUserDepositBalancesCallback,
  selectUserDepositBalances,
  selectUserDepositBalance,
  selectUserBorrowBalances,
  selectUserBorrowBalancesCallback,
  selectUserBorrowBalance,
  selectUserNativeTokenBalance,
}
