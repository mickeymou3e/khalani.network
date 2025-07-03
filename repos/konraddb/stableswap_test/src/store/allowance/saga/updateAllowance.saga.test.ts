import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { Network } from '@constants/Networks'
import { RequestStatus } from '@constants/Request'
import { fetchERC20Allowances } from '@dataSource/blockchain/erc20/allowance'
import { combineReducers } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'
import { walletSelectors } from '@store/wallet/wallet.selector'

import { allowanceActions, allowanceReducer } from '../allowance.slice'
import { getTokens } from '../utils/getTokens'
import { updateAllowanceSaga } from './updateAllowance.saga'

describe('Update allowance saga', () => {
  const userAddress = '0x0azas'
  const network = Network.AvalancheTestnet
  const tokens = [
    {
      id: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
      address: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
      decimals: 18,
      name: 'USDC | avax',
      symbol: 'USDCavax',
      balance: null,
      icon: null,
      chainId: '0xa869',
    },
  ]
  const allowances = [
    {
      tokenAddress: '0x91FB270bEDfBCd92E212DB460AeF1BE5aa3C17C4',
      balance: BigNumber.from(5),
    },
  ]
  it('should return expected allowance state', async () => {
    const expectedAllowancesState = {
      status: RequestStatus.Resolved,
      allowances,
    }

    await expectSaga(updateAllowanceSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.Allowance]: allowanceReducer,
        }),
      )
      .withState({
        [StoreKeys.Allowance]: {},
      })
      .provide([
        [select(walletSelectors.userAddress), userAddress],
        [select(networkSelectors.network), network],
        [call.fn(getTokens), tokens],
        [call.fn(fetchERC20Allowances), allowances],
      ])
      .put(allowanceActions.updateAllowance(allowances))
      .put(allowanceActions.initializeAllowanceSuccess())
      .hasFinalState({
        [StoreKeys.Allowance]: expectedAllowancesState,
      })
      .run()
  })
  it('filtering tokens by network', async () => {
    const result = tokens.filter((token) => token.chainId === network)
    expect(result.length).toBe(1)
  })
})
