import { fetchERC20Balances } from '@dataSource/balances'
import { providerSelector } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { call, put, select } from 'typed-redux-saga'
import { balancesSelectors } from '../balances.selector'
import { balancesActions } from '../balances.slice'
import { IBalances } from '../balances.types'
import { replaceNewBalances } from '../utils/replaceNewBalances'
import { logger } from '@utils/logger'
import { stringifyBalanceWithBigIntsToString } from '@utils/adapter'
import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'
import { Network } from '@constants/Networks'

export function* updateCurrentChainBalancesSaga(): Generator {
  const userAddress = yield* select(providerSelector.userAddress)

  if (!userAddress) {
    return
  }

  const balanceSheet = yield* select(balancesSelectors.selectAll)
  const tokens = yield* select(tokenSelectors.selectByCurrentNetwork)
  const tokenConnector = yield* select(
    evmChainContractsSelectors.crossChainTokenConnector,
  )

  try {
    const updatedBalanceEntries = yield* call(
      fetchERC20Balances,
      tokens.filter((token) => token.chainId !== Network.Khalani),
      userAddress,
      tokenConnector,
    )

    let newBalanceSheet: IBalances[] = yield* call(
      replaceNewBalances,
      balanceSheet,
      updatedBalanceEntries,
    )

    if (
      !newBalanceSheet ||
      (newBalanceSheet.length === 0 && updatedBalanceEntries.length > 0)
    ) {
      newBalanceSheet = updatedBalanceEntries
    }

    const isBalanceSheetDifferent =
      stringifyBalanceWithBigIntsToString(balanceSheet) !==
      stringifyBalanceWithBigIntsToString(newBalanceSheet)

    if (isBalanceSheetDifferent) {
      yield* put(balancesActions.updateBalances(newBalanceSheet))
    }
  } catch (error) {
    logger.error(error)
  }
}
