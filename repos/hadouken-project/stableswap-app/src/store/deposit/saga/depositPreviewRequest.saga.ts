import { call, put } from 'typed-redux-saga'

import { setContractError } from '@store/contracts/setError.saga'
import { depositActions } from '@store/deposit/deposit.slice'
import { BigDecimal } from '@utils/math'

import { getMinimumLPTokensForDepositSaga } from './getMinimumLPTokensForDeposit.saga'

export function* depositPreviewRequestSaga(): Generator {
  try {
    const lpTokenAmount = yield* call(getMinimumLPTokensForDepositSaga)

    if (!lpTokenAmount || lpTokenAmount.eq(0))
      throw Error(
        'Due to the pool’s current liquidity, there’s no path through the smart order router to complete your deposit.',
      )

    yield* put(
      depositActions.depositPreviewRequestSuccess(
        BigDecimal.from(lpTokenAmount, 18),
      ),
    )
  } catch (error) {
    yield* put(depositActions.depositPreviewRequestError())
    yield* call(setContractError, error)
  }
}
