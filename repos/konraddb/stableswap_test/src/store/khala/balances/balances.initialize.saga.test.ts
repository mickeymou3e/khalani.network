import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { fetchERC20MultiChainBalances } from '@dataSource/blockchain/erc20/balances/contract'
import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { khalaTokenSelectors } from '../tokens/tokens.selector'
import { ITokenModelBalanceWithChain } from '../tokens/tokens.types'
import { initializeKhalaBalancesSaga } from './balances.initialize.saga'
import { khalaBalancesActions, khalaBalancesReducer } from './balances.slice'
import { IKhalaBalances } from './balances.types'
import { findTheOnlyChainIdWithTokens } from './utils/findOnlyChainIdWithTokens'

describe('Initialize balances saga', () => {
  it('should return expected balances state', async () => {
    const balances: IKhalaBalances[] = [
      {
        id: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4-05',
        chainId: Network.GodwokenTestnet,
        balance: BigNumber.from(5),
      },
    ]

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

    const onlyChainIdWithTokens = Network.GodwokenTestnet

    const expectedBalancesState = {
      ids: [balances[0].id],
      entities: {
        [balances[0].id]: {
          ...balances[0],
        },
      },
      status: RequestStatus.Resolved,
      isFetching: false,
      onlyChainIdWithTokens: onlyChainIdWithTokens,
    }

    await expectSaga(initializeKhalaBalancesSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.KhalaBalances]: khalaBalancesReducer,
        }),
      )
      .provide([
        [select(khalaTokenSelectors.selectAll), tokens],
        [select(walletSelectors.userAddress), '0xas51adf'],
        [call.fn(fetchERC20MultiChainBalances), balances],
        [call.fn(findTheOnlyChainIdWithTokens), onlyChainIdWithTokens],
      ])
      .put(
        khalaBalancesActions.updateOnlyChainIdWithTokens(onlyChainIdWithTokens),
      )
      .put(khalaBalancesActions.updateKhalaBalances(balances))
      .put(khalaBalancesActions.initializeKhalaBalancesSuccess())
      .hasFinalState({
        [StoreKeys.KhalaBalances]: expectedBalancesState,
      })
      .run()
  })
})
