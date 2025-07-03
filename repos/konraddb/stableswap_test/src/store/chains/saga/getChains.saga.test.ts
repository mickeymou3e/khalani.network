import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'

import { chainsActions, chainsReducer } from '../chains.slice'
import { IChain } from '../chains.types'
import { getChains } from '../utils/getChains'
import { getChainsSaga } from './getChains.saga'

describe('Get chain saga checking expected result ', () => {
  it('should return expected chain state', async () => {
    const chains: IChain[] = [
      {
        id: 10012,
        chainName: 'Axon',
        chainId: Network.Axon,
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
        rpcUrls: ['https://www.axon-node.info'],
        logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
        borderColor: '#228c22',
      },
    ]
    const expectedChainsState = {
      status: RequestStatus.Resolved,
      chains,
    }

    await expectSaga(getChainsSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.Chains]: chainsReducer,
        }),
      )
      .withState({
        [StoreKeys.Chains]: {},
      })
      .provide([[call.fn(getChains), chains]])
      .put(chainsActions.updateChains(chains))
      .put(chainsActions.initializeChainsSuccess())
      .hasFinalState({
        [StoreKeys.Chains]: expectedChainsState,
      })
      .run()
  })
})
