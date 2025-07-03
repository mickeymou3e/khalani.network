import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'
import { call, select } from 'redux-saga-test-plan/matchers'

import { combineReducers } from '@reduxjs/toolkit'
import { StoreKeys } from '../../../store/store.keys'

import { allowanceActions, allowanceReducer } from '../allowance.slice'
import { updateAllowanceSaga } from './updateAllowance.saga'
import { Network } from '../../../constants/Networks'
import { RequestStatus } from '../../../constants/Request'
import { contractsReducer } from '../../contracts/contracts.slice'
import { providerReducer } from '../../provider/provider.slice'
import config from '@config'
import { providerSelector } from '../../provider/provider.selector'
import { tokenSelectors } from '../../tokens/tokens.selector'
import { fetchERC20Allowances } from '../../../dataSource/allowance'

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
      spender: '0x0',
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
          [StoreKeys.Contracts]: contractsReducer,
          [StoreKeys.Provider]: providerReducer,
        }),
      )
      .withState({
        [StoreKeys.Allowance]: {},
        [StoreKeys.Contracts]: {
          axonCrossChainRouterAddress: config.contracts.NexusDiamond,
        },
        [StoreKeys.Provider]: {},
      })
      .provide([
        [select(providerSelector.userAddress), userAddress],
        [select(providerSelector.network), network],
        [select(tokenSelectors.selectAll), tokens],
        [call.fn(fetchERC20Allowances), allowances],
      ])
      .put(allowanceActions.updateAllowance(allowances))
      .put(allowanceActions.initializeAllowanceSuccess())
      .hasFinalState({
        [StoreKeys.Allowance]: expectedAllowancesState,
        [StoreKeys.Contracts]: {
          axonCrossChainRouterAddress: config.contracts.NexusDiamond,
        },
        [StoreKeys.Provider]: {},
      })
      .run()
  })
  it('filtering tokens by network', async () => {
    const result = tokens.filter((token) => token.chainId === network)
    expect(result.length).toBe(1)
  })
})
