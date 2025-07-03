import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { lockService } from '@libs/services/lock.service'
import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { initializeKhalaTokensSaga } from './tokens.initialize.saga'
import { khalaTokensActions, khalaTokensReducer } from './tokens.slice'
import { ITokenModelBalanceWithChain } from './tokens.types'

describe('Initialize tokens saga', () => {
  it('should return expected tokens state', async () => {
    const tokens: ITokenModelBalanceWithChain[] = [
      {
        id: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4-05',
        address: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
        decimals: 18,
        name: 'USDC | avax',
        symbol: 'USDCavax',
        balance: BigNumber.from(0),
        icon: null,
        chainId: Network.GodwokenTestnet,
      },
    ]

    const expectedTokensState = {
      ids: [tokens[0].id],
      entities: {
        [tokens[0].id]: {
          ...tokens[0],
        },
      },
      status: RequestStatus.Resolved,
      isFetching: false,
    }

    await expectSaga(initializeKhalaTokensSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.KhalaTokens]: khalaTokensReducer,
        }),
      )
      .provide([[call.fn(lockService.getTokens), tokens]])
      .put(khalaTokensActions.updateKhalaTokens(tokens))
      .put(khalaTokensActions.initializeKhalaTokensSuccess())
      .hasFinalState({
        [StoreKeys.KhalaTokens]: expectedTokensState,
      })
      .run()
  })
})
