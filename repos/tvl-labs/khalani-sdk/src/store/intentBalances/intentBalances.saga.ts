import { put } from 'redux-saga/effects'
import { logger } from '@utils/logger'
import { apply, call, select } from 'typed-redux-saga'
import { providerSelector } from '@store/provider/provider.selector'
import { intentBalancesActions } from './intentBalances.slice'
import { khalaniContractsSelectors } from '@store/contracts/khalani.contracts.selectors'
import { getLiquidityHistory } from '@graph/history/liquidity'
import { IntentEntity } from '@graph/index'

export function* updateIntentBalancesSaga(): Generator {
  try {
    yield put(intentBalancesActions.request())

    const author = yield* select(providerSelector.userAddress)
    if (!author) throw new Error('Author not found')

    const intents = (yield call(getLiquidityHistory, author)) as IntentEntity[]

    const intentBook = yield* select(khalaniContractsSelectors.intentBook)
    if (!intentBook) throw new Error('IntentBook contract not found')

    const mTokenManager = yield* select(khalaniContractsSelectors.mTokenManager)
    if (!mTokenManager) throw new Error('MTokenManager contract not found')

    const intentsWithBalances: IntentEntity[] = []
    for (let index = 0; index < intents.length; index++) {
      const currentIntentId = intents[index].id

      const intentState: bigint = (yield* apply(
        intentBook,
        intentBook.getIntentState,
        [currentIntentId],
      )) as bigint

      if (intentState === 1n) {
        intentsWithBalances.push(intents[index])
      }
    }
    yield put(
      intentBalancesActions.requestSuccess(
        intentsWithBalances as IntentEntity[],
      ),
    )
  } catch (error) {
    yield put(intentBalancesActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
