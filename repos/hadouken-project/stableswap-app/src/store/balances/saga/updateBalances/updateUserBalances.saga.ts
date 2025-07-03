import { apply, call, put, select } from 'typed-redux-saga'

import { getChainConfig } from '@config'
import { fetchERC20BatchBalances } from '@dataSource/blockchain/erc20/balances/batch'
import { address } from '@dataSource/graph/utils/formatters'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { waitForPoolsAndTokensBeFetched } from '@store/deposit/saga/editor/utils'
import { networkSelectors } from '@store/network/network.selector'
import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { balancesActions } from '../../balances.slice'

export function* updateUserBalances(): Generator {
  const isCorrectNetwork = yield* select(networkSelectors.isExpectedNetwork)
  const applicationChainId = yield* select(networkSelectors.applicationChainId)
  const provider = yield* select(providerSelector.provider)
  const userAddress = yield* select(walletSelectors.userAddress)
  yield* call(waitForPoolsAndTokensBeFetched)

  const tokens = yield* select(tokenSelectors.selectAllTokens)

  if (userAddress && isCorrectNetwork) {
    try {
      const backstopContracts = yield* select(
        contractsSelectors.backstopContracts,
      )

      const parsedTokens = tokens.map((token) => ({
        address: token.address,
        decimals: token.decimals,
      }))
      const backstopAddress = backstopContracts?.backstop?.address
      const allTokens = backstopAddress
        ? [
            ...parsedTokens,
            {
              decimals: 18,
              address: backstopAddress,
            },
          ]
        : parsedTokens

      yield* put(balancesActions.updateUserBalanceRequest())

      const balances = yield* call(
        fetchERC20BatchBalances,
        userAddress,
        allTokens,
      )

      if (provider) {
        const userNativeTokenBalance = yield* apply(
          provider,
          provider.getBalance,
          [userAddress],
        )
        const userBalance = userNativeTokenBalance
          ? BigDecimal.from(userNativeTokenBalance)
          : BigDecimal.from(0)

        const config = getChainConfig(applicationChainId)
        if (config.nativeCurrency.wrapAddress && balances.balances) {
          balances.balances[
            address(config.nativeCurrency.wrapAddress)
          ] = userBalance
        }
      }

      yield* put(balancesActions.updateUserBalanceSuccess([balances]))
    } catch (error) {
      console.error(error)
      yield* put(balancesActions.updateUserBalanceFailure())
    }
  }
}
