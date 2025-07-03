import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { fetchERC20CurrentChainBalances } from '@dataSource/blockchain/erc20/balances/contract'
import { combineReducers } from '@reduxjs/toolkit'
import { khalaTokenSelectors } from '@store/khala/tokens/tokens.selector'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { khalaBalancesSelectors } from '../balances.selector'
import { khalaBalancesActions, khalaBalancesReducer } from '../balances.slice'
import { IKhalaBalances } from '../balances.types'
import { replaceNewBalances } from '../utils/replaceNewBalances'
import { updateKhalaBalancesSaga } from './updateKhalaBalances.saga'

describe('Update khala balances saga', () => {
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

    const expectedBalancesState = {
      ids: [balances[0].id],
      entities: {
        [balances[0].id]: {
          ...balances[0],
        },
      },
      status: RequestStatus.Idle,
      isFetching: false,
    }

    await expectSaga(updateKhalaBalancesSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.KhalaBalances]: khalaBalancesReducer,
        }),
      )
      .provide([
        [select(khalaTokenSelectors.selectAll), tokens],
        [select(walletSelectors.userAddress), '0xa5235'],
        [select(networkSelectors.network), Network.GodwokenTestnet],
        [select(khalaBalancesSelectors.selectAll), balances],
        [call.fn(fetchERC20CurrentChainBalances), balances],
        [call.fn(replaceNewBalances), balances],
      ])
      .put(khalaBalancesActions.updateKhalaBalances(balances))
      .hasFinalState({
        [StoreKeys.KhalaBalances]: expectedBalancesState,
      })
      .run()
  })
})
