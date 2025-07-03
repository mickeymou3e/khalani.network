import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { PoolType } from '@interfaces/pool'
import { combineReducers } from '@reduxjs/toolkit'
import {
  depositActions,
  depositInitialState,
  depositReducer,
} from '@store/deposit/deposit.slice'
import { IDepositToken } from '@store/deposit/deposit.types'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { IPoolModel } from '@store/pool/selectors/models/types'
import { StoreKeys } from '@store/store.keys'
import { walletInitState, walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { initializeDepositSaga } from './initializeDepositSaga'
import { waitForPoolsAndTokensBeFetched } from './utils'

describe('initializeDepositSaga', () => {
  it('Happy path', async () => {
    const poolAddress = '0x123456789'
    const poolId = `${poolAddress}000001`
    const tokenAddress = '0x11111'

    const depositTokens: IDepositToken[] = [
      {
        id: tokenAddress,
        address: tokenAddress,
        decimals: 6,
        displayName: 'first',
        name: 'F',
        symbol: 'F',
        amount: undefined,
        isLpToken: false,
        source: 'gw',
        weight: undefined,
      },
    ]

    const poolModel: IPoolModel = {
      id: poolId,
      address: poolAddress,
      allTokens: [],
      compositionBlocks: [],
      depositTokens: depositTokens,
      tokens: [],
      pool: {
        id: poolId,
        address: poolAddress,
        amp: '3000',
        createTime: new Date(),
        decimals: 18,
        displayName: 'Pool one',
        name: 'Pool one',
        owner: '0xBBBBBBBBB',
        poolType: PoolType.Weighted,
        swapFee: BigDecimal.from(1000000, 16),
        symbol: 'PL1',
        tokens: [],
        totalLiquidity: BigDecimal.from(0),
        totalShares: BigDecimal.from(0),
        totalSwapFee: BigDecimal.from(0),
        totalSwapVolume: BigDecimal.from(0),
        isLpToken: true,
        source: 'gw',
      },
    }

    await expectSaga(
      initializeDepositSaga,
      depositActions.initializeDepositRequest(poolId),
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
        },
        [StoreKeys.Wallet]: walletInitState,
        [StoreKeys.Network]: { applicationChainId: Network.GodwokenTestnet },
      })
      .provide([
        [
          // Get pool type
          select(poolsModelsSelector.selectById),
          () => poolModel,
        ],
        [call.fn(waitForPoolsAndTokensBeFetched), null],
      ])
      .hasFinalState({
        [StoreKeys.Deposit]: {
          ...depositInitialState,
          poolId: poolModel.pool.id,
          poolType: poolModel.pool.poolType,
          showLowLiquidityBanner: true,
          depositTokens: depositTokens,
          buttonDisabled: true,
          isFetchingTokens: false,
        },
        [StoreKeys.Wallet]: walletInitState,
      })
      .run()
  })
})
