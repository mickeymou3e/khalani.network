import { BigNumber } from 'ethers'
import { put, call, select } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { BigDecimal } from '@utils/math'

import { withdrawSelectors } from '../withdraw.selector'
import { withdrawActions } from '../withdraw.slice'
import { withdrawPriceImpact } from './withdrawPriceImpact.saga'

export function* amountChangeSaga(
  action: PayloadAction<BigDecimal>,
): Generator {
  const priceImpact = yield* call(withdrawPriceImpact, action.payload)

  const { selectedToken, percentage } = yield* select(
    withdrawSelectors.withdrawEditor,
  )

  const isProportional = yield* select(withdrawSelectors.isProportionalWithdraw)

  const exceedsBalance = action.payload.gt(
    BigDecimal.from(
      selectedToken?.balance ?? BigNumber.from(0),
      selectedToken?.decimals,
    ),
  )

  const isAmountEqualToZero = !action.payload.gt(BigDecimal.from(0))

  yield* put(
    withdrawActions.amountChangeSuccess({
      withdrawAmount: action.payload,
      buttonDisabled:
        (!isProportional && (isAmountEqualToZero || exceedsBalance)) ||
        (isProportional && percentage === 0),
      priceImpact,
    }),
  )
}
