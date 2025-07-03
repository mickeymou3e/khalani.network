import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { PoolType } from '@hadouken-project/sdk'
import { combineReducers } from '@reduxjs/toolkit'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import {
  depositActions,
  depositInitialState,
  depositReducer,
} from '@store/deposit/deposit.slice'
import { IDepositToken } from '@store/deposit/deposit.types'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { priceInitialState, pricesReducer } from '@store/prices/prices.slice'
import { StoreKeys } from '@store/store.keys'
import { walletInitState, walletReducer } from '@store/wallet/wallet.slice'
import { BigDecimal } from '@utils/math'

import { amountChangeSaga } from './amountChangeSaga'
import { calculatePriceImpact } from './utils'

describe('amountChangeSaga', () => {
  it('Happy path', async () => {
    const tokenAddress = '0x11111'
    const totalDepositValueUSD = BigDecimal.from(
      BigNumber.from(10).pow(27).mul(100),
      27,
    ) // 100 usd because prices is 1$
    const amount = BigNumber.from(10).pow(6).mul(BigNumber.from(100)) // 100 tokens
    const userBalance = BigDecimal.from(amount.mul(1000), 6)
    const depositTokensBefore: IDepositToken[] = [
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

    const priceImpact = '1.00%'

    const depositTokensAfter: IDepositToken[] = [
      {
        ...depositTokensBefore[0],
        amount: amount,
      },
    ]

    const priceState = {
      ids: [tokenAddress],
      entities: {
        [tokenAddress]: {
          id: tokenAddress,
          price: BigDecimal.from(BigNumber.from(10).pow(27), 27),
        },
      },
    }

    await expectSaga(
      amountChangeSaga,
      depositActions.amountChangeRequest({
        tokenAddress: tokenAddress,
        amount: amount,
      }),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.Deposit]: depositReducer,
          [StoreKeys.Wallet]: walletReducer,
          [StoreKeys.Prices]: pricesReducer,
        }),
      )
      .withState({
        [StoreKeys.Deposit]: {
          ...depositInitialState,
          depositTokens: depositTokensBefore,
        },
        [StoreKeys.Wallet]: walletInitState,
        [StoreKeys.Prices]: {
          ...priceInitialState,
          ...priceState,
        },
      })
      .provide([
        [
          select(userBalancesSelectors.selectUserTokensBalances),
          () => ({ [tokenAddress]: userBalance }),
        ],
        [
          // Get pool type
          select(poolsModelsSelector.selectById),
          () => ({
            pool: {
              poolType: PoolType.Weighted,
            },
          }),
        ],
        [call.fn(calculatePriceImpact), priceImpact],
      ])
      .hasFinalState({
        [StoreKeys.Deposit]: {
          ...depositInitialState,
          depositTokens: depositTokensAfter,
          buttonDisabled: false,
          proportionalCalculationForToken: tokenAddress,
          showLowLiquidityBanner: false,
          totalDepositValueUSD: totalDepositValueUSD,
          priceImpact: priceImpact,
        },
        [StoreKeys.Wallet]: walletInitState,
        [StoreKeys.Prices]: {
          ...priceInitialState,
          ...priceState,
        },
      })
      .run()
  })
})
