import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { BigDecimal } from '@utils/math'

import { withdrawSelectors } from '../withdraw.selector'
import { withdrawActions, withdrawReducer } from '../withdraw.slice'
import { amountChangeSaga } from './withdrawAmountChange.saga'
import { withdrawPriceImpact } from './withdrawPriceImpact.saga'

describe('withdraw amount change', () => {
  const selectedToken: TokenModelBalanceWithIcon = {
    id: '0x123',
    address: '0x123',
    balance: BigDecimal.from(100, 18).toBigNumber(),
    decimals: 18,
    displayName: 'Test token',
    name: 'Test token',
    source: '',
    symbol: 'TEST',
  }

  it('should update amount', async () => {
    const amount = BigDecimal.from(10, 18)

    await expectSaga(
      amountChangeSaga,
      withdrawActions.amountChangeRequest(amount),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Withdraw]: withdrawReducer,
        }),
      )
      .withState({
        [StoreKeys.Withdraw]: {
          selectedToken,
          percentage: 30,
        },
      })
      .provide([
        [select(withdrawSelectors.isProportionalWithdraw), () => false],
        [call.fn(withdrawPriceImpact), '1'],
      ])
      .hasFinalState({
        [StoreKeys.Withdraw]: {
          percentage: 30,
          selectedToken,
          withdrawAmount: amount,
          buttonDisabled: false,
        },
      })
  })

  it('should button be disabled if amount exceeds balance', async () => {
    const amount = BigDecimal.from(200, 18)

    await expectSaga(
      amountChangeSaga,
      withdrawActions.amountChangeRequest(amount),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Withdraw]: withdrawReducer,
        }),
      )
      .withState({
        [StoreKeys.Withdraw]: {
          selectedToken,
          percentage: 30,
        },
      })
      .provide([
        [select(withdrawSelectors.isProportionalWithdraw), () => false],
        [call.fn(withdrawPriceImpact), '1'],
      ])
      .hasFinalState({
        [StoreKeys.Withdraw]: {
          percentage: 30,
          selectedToken,
          withdrawAmount: amount,
          buttonDisabled: true,
        },
      })
  })

  it('should button be disabled if percentage is 0 ', async () => {
    const amount = BigDecimal.from(1, 18)

    await expectSaga(
      amountChangeSaga,
      withdrawActions.amountChangeRequest(amount),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Withdraw]: withdrawReducer,
        }),
      )
      .withState({
        [StoreKeys.Withdraw]: {
          selectedToken,
          percentage: 0,
        },
      })
      .provide([
        [select(withdrawSelectors.isProportionalWithdraw), () => true],
        [call.fn(withdrawPriceImpact), '1'],
      ])
      .hasFinalState({
        [StoreKeys.Withdraw]: {
          percentage: 0,
          selectedToken,
          withdrawAmount: amount,
          buttonDisabled: true,
        },
      })
  })
})
