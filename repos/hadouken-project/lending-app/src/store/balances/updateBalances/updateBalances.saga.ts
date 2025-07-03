import { BigNumber } from 'ethers'
import { put, select } from 'typed-redux-saga'

import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { balancesActions } from '../balances.slice'
import { IBalance } from '../balances.types'

export function* updateBalances(
  action: ReturnType<typeof balancesActions['updateBalancesRequest']>,
): Generator {
  const walletAddress = yield* select(walletSelectors.ethAddress)
  if (!walletAddress) return null

  const tokens = yield* select(tokenSelectors.selectAll)

  const userTokens = action.payload.filter(
    (x) => x.walletAddress === walletAddress,
  )

  const userBalance = userTokens.reduce((balance, currentBalance) => {
    const value = BigNumber.from(currentBalance.balance)
    const token = tokens.find(
      (token) => token.address === currentBalance.tokenAddress,
    )

    if (!token) return balance

    const displayValue = {
      id: token.id,
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      isFetching: false,
      value: value,
      displayName: token.displayName,
    }

    if (!balance || !balance.balances) {
      balance = {
        id: walletAddress,
        balances: {},
      }
    }

    balance.balances[currentBalance.tokenAddress] = displayValue

    return balance
  }, {} as IBalance)

  if (userBalance && Object.keys(userBalance).length !== 0) {
    yield* put(balancesActions.updateBalancesSuccess(userBalance))
  }
}
