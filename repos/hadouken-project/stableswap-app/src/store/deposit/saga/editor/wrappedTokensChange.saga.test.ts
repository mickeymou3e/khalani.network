import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { PoolType } from '@hadouken-project/sdk'
import { combineReducers } from '@reduxjs/toolkit'
import {
  depositActions,
  depositInitialState,
  depositReducer,
} from '@store/deposit/deposit.slice'
import { IDepositToken } from '@store/deposit/deposit.types'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { StoreKeys } from '@store/store.keys'
import { walletInitState, walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { getPoolDepositTokens, waitForPoolsAndTokensBeFetched } from './utils'
import { wrappedTokensChangeSaga } from './wrappedTokensChangeSaga'

describe('wrappedTokensChange', () => {
  it('Checkbox clicked', async () => {
    const tokenAddress = '0x11111'
    const wrappedTokenAddress = '0x2222222'
    const totalDepositValueUSD = BigDecimal.from(0)
    const poolId = '0x1'
    const amount = BigNumber.from(10).pow(6).mul(BigNumber.from(100)) // 100 tokens

    const depositTokens: IDepositToken[] = [
      {
        id: tokenAddress,
        address: tokenAddress,
        decimals: 6,
        displayName: 'first',
        name: 'F',
        symbol: 'F',
        amount: amount,
        isLpToken: false,
        source: 'gw',
        weight: undefined,
      },
    ]

    const wrappedDepositTokens: IDepositToken[] = [
      {
        id: wrappedTokenAddress,
        address: wrappedTokenAddress,
        decimals: 6,
        displayName: 'wrapped',
        name: 'W',
        symbol: 'W',
        amount: undefined,
        isLpToken: true,
        source: 'gw',
        weight: undefined,
      },
    ]

    await expectSaga(
      wrappedTokensChangeSaga,
      depositActions.wrappedTokenChangeRequest(true),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Deposit]: depositReducer,
          [StoreKeys.Wallet]: walletReducer,
        }),
      )
      .withState({
        [StoreKeys.Deposit]: {
          ...depositInitialState,
          poolId: poolId,
          depositTokens: depositTokens,
          showWrappedCheckbox: true,
          showWrappedTokens: false,
        },
        [StoreKeys.Wallet]: walletInitState,
        [StoreKeys.Network]: { applicationChainId: Network.GodwokenTestnet },
      })
      .provide([
        [call.fn(waitForPoolsAndTokensBeFetched), null],
        [call.fn(getPoolDepositTokens), wrappedDepositTokens],
        [
          // Get pool type
          select(poolsModelsSelector.selectById),
          () => ({
            pool: {
              poolType: PoolType.Weighted,
            },
          }),
        ],
      ])
      .hasFinalState({
        [StoreKeys.Deposit]: {
          ...depositInitialState,
          poolId: poolId,
          depositTokens: wrappedDepositTokens,
          showWrappedCheckbox: true,
          showWrappedTokens: true,
          buttonDisabled: true,
          showLowLiquidityBanner: false,
          totalDepositValueUSD: totalDepositValueUSD,
        },
        [StoreKeys.Wallet]: walletInitState,
      })
      .run()
  })
})
