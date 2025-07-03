import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { poolBalancesSelectors } from '@store/balances/selectors/pool/balances.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { balancesSelectors } from '../balances.selector'

const selectUserBalances = createSelector(
  [balancesSelectors.selectBalances, walletSelectors.userAddress],
  (selectBalances, userAddress) =>
    userAddress ? selectBalances(userAddress) : null,
)

const selectUserTokenBalance = createSelector(
  [balancesSelectors.selectTokenBalance, walletSelectors.userAddress],
  (selectTokenBalance, userAddress) => (tokenAddress: IToken['address']) =>
    userAddress ? selectTokenBalance(userAddress, tokenAddress) : null,
)

const selectUserTokensBalances = createSelector(
  [balancesSelectors.selectTokensBalances, walletSelectors.userAddress],
  (selectTokensBalances, userAddress) => (tokensAddresses: IToken['id'][]) =>
    userAddress ? selectTokensBalances(userAddress, tokensAddresses) : null,
)

const selectUserPoolBalances = createSelector(
  [
    poolBalancesSelectors.selectPoolBalancesByAddress,
    walletSelectors.userAddress,
  ],
  (selectPoolBalancesByAddress, userAddress) => {
    return (poolId: string) => {
      return userAddress
        ? selectPoolBalancesByAddress(userAddress, poolId)
        : null
    }
  },
)

const selectUserPoolUnderlyingBalances = createSelector(
  [
    poolBalancesSelectors.selectPoolUnderlyingBalancesByAddress,
    walletSelectors.userAddress,
  ],
  (selectPoolUnderlyingBalancesByAddress, userAddress) => {
    return (poolId: string) => {
      return userAddress
        ? selectPoolUnderlyingBalancesByAddress(userAddress, poolId)
        : null
    }
  },
)
export const userBalancesSelectors = {
  selectUserBalances,
  selectUserTokensBalances,
  selectUserTokenBalance,
  selectUserPoolBalances,
  selectUserPoolUnderlyingBalances,
}
