import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { combineReducers } from '@reduxjs/toolkit'
import { getPoolDepositTokens } from '@store/deposit/saga/editor/utils'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { ITokenWithWeight } from '@store/pool/selectors/models/types'
import { StoreKeys } from '@store/store.keys'
import { BigDecimal } from '@utils/math'

import { withdrawActions, withdrawReducer } from '../withdraw.slice'
import { WithdrawState } from '../withdraw.types'
import { calculateComposablePoolProportional } from './composablePool/calculateComposablePoolProportional.saga'
import { getProportionalToken } from './getProportionalToken'
import { amountChangeSaga } from './withdrawAmountChange.saga'
import { withdrawSingleTokenMax } from './withdrawSingleTokenMax'
import { wrappedTokensChange } from './wrappedTokensChanges.saga'

describe('withdraw wrappedTokensChange', () => {
  it('Checkbox clicked', async () => {
    const withdrawInitialState = new WithdrawState()
    const tokenAddress = '0x123'
    const wrappedTokenAddress = '0x987'
    const poolId = '0x567'

    const withdrawTokens: ITokenWithWeight[] = [
      {
        id: tokenAddress,
        address: tokenAddress,
        decimals: 18,
        displayName: 'Test token',
        name: 'Test token',
        symbol: 'TEST',
      },
    ]

    const wrappedWithdrawTokens: ITokenWithWeight[] = [
      {
        id: wrappedTokenAddress,
        address: wrappedTokenAddress,
        decimals: 18,
        displayName: 'Wrapped Test token',
        name: 'Wrapped Test token',
        symbol: 'WTEST',
      },
    ]

    await expectSaga(
      wrappedTokensChange,
      withdrawActions.wrappedTokenChangeRequest(true),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Withdraw]: withdrawReducer,
        }),
      )
      .withState({
        [StoreKeys.Withdraw]: {
          ...withdrawInitialState,
          poolId: poolId,
          withdrawTokens: withdrawTokens,
          percentage: 30,
          userMaxLpTokenBalance: BigDecimal.from(0),
          showWrappedCheckbox: true,
          showWrappedTokens: true,
        },
        [StoreKeys.Network]: { applicationChainId: Network.GodwokenTestnet },
      })
      .provide([
        [call.fn(getPoolDepositTokens), wrappedWithdrawTokens],
        [call.fn(withdrawSingleTokenMax), {}],
        [call.fn(amountChangeSaga), null],
        [call.fn(calculateComposablePoolProportional), {}],
        [call.fn(getProportionalToken), undefined],
        [
          select(poolsModelsSelector.selectById),
          () => ({
            pool: {
              id: poolId,
              address: poolId,
            },
          }),
        ],
      ])
      .hasFinalState({
        [StoreKeys.Withdraw]: {
          ...withdrawInitialState,
          poolId: poolId,
          withdrawTokens: wrappedWithdrawTokens,
          showWrappedTokens: true,
          showWrappedCheckbox: true,
          buttonDisabled: true,
          proportionalToken: undefined,
          selectedToken: undefined,
          tokensMaxBalance: {},
        },
      })
      .run()
  })
})
