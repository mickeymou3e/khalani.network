import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { apply, call, put, select } from 'typed-redux-saga'

import { getConfig } from '@hadouken-project/lending-contracts'
import { ITokenBalance } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { ENVIRONMENT } from '@utils/stringOperations'

import { balancesActions } from '../balances.slice'
import { IBalance } from '../balances.types'

// fetch standard tokens with variable/stable debt + deposit
export function* fetchUserBalances(): Generator<StrictEffect, ITokenBalance[]> {
  try {
    const walletAddress = yield* select(walletSelectors.ethAddress)
    // change here to fetch only standard if needed

    const erc20Tokens = yield* select(tokenSelectors.selectAllStandardTokens)
    const applicationChainId = yield* select(walletSelectors.applicationChainId)

    const contractsConfig = getConfig(applicationChainId)?.(ENVIRONMENT)

    const hTokens = yield* select(tokenSelectors.selectAllDepositTokens)
    const hsTokens = yield* select(tokenSelectors.selectAllStableDebtTokens)
    const hvTokens = yield* select(tokenSelectors.selectAllVariableDebtTokens)

    const userBalancesContract = yield* select(contractsSelectors.userBalances)

    if (!userBalancesContract || !walletAddress) return []

    const tokenBalance = yield* call(
      userBalancesContract.balancesOf,
      walletAddress,
      erc20Tokens.map((x) => x.address),
      hTokens.map((x) => x.address),
      hsTokens.map((x) => x.address),
      hvTokens.map((x) => x.address),
    )

    const balances = [...erc20Tokens, ...hTokens, ...hsTokens, ...hvTokens].map(
      (token, index) => ({
        address: token.address,
        balance: tokenBalance[index] ?? BigNumber.from(0),
        symbol: token.symbol,
        decimal: token.decimals,
        displayName: token.displayName,
      }),
    )

    const provider = yield* select(contractsSelectors.provider)
    const walletChainId = yield* select(walletSelectors.walletChainId)

    if (applicationChainId === walletChainId && provider) {
      const nativeAssetBalance = yield* apply(provider, provider.getBalance, [
        walletAddress,
      ])

      balances.push({
        address: contractsConfig?.nativeToken?.address ?? '',
        balance: nativeAssetBalance,
        symbol: contractsConfig?.nativeToken?.symbol ?? '',
        decimal: 18,
        displayName: contractsConfig?.nativeToken?.displaySymbol ?? '',
      })
    }

    const userBalancesData = [...balances].reduce((data, current) => {
      data[current.address] = {
        address: current.address,
        isFetching: false,
        decimals: current.decimal,
        symbol: current.symbol,
        displayName: current.displayName,
        value: current.balance,
      }

      return data
    }, {} as IBalance['balances'])

    const data: IBalance = {
      id: walletAddress,
      balances: userBalancesData,
    }

    yield* put(balancesActions.updateBalancesSuccess(data))
  } catch (e) {
    console.error('error')
  }

  return []
}
