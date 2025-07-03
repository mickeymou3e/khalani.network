// import { AddressTranslator } from 'nervos-godwoken-integration'
// import { expectSaga } from 'redux-saga-test-plan'
// import { call, select } from 'redux-saga-test-plan/matchers'

// import { Network } from '@constants/Networks'
// import { RequestStatus } from '@constants/Request'
// import { combineReducers } from '@reduxjs/toolkit'
// import { providerSelector } from '@store/provider/provider.selector'
// import { StoreKeys } from '@store/store.keys'
// import { getNetwork, getNetworkName } from '@utils/network'

// import { initializeWalletSaga } from './wallet.initialize.saga'
// import { walletReducer } from './wallet.slice'
// import { getConnectedAccount, getProvider } from './wallet.utils'

// jest.mock('nervos-godwoken-integration')

describe('initializeWalletSaga', () => {
  test.todo('after redesign test needs a rewrite')

  //   const ethAddress = '0xC36ACB7052183B8633ad1279A3B98Bc1ECF27E05'
  //   const godwokenShortAddress = '0xcf09b6afbdce495b85e25c2aa930f04092257f0e'
  //   const ckbAddress =
  //     'ckt1q3vvtay34wndv9nckl8hah6fzzcltcqwcrx79apwp2a5lkd07fdx8k39zcavfqkm4ejtcmjzr7l4zcjtxxpssyxlmzx'

  //   const godwokenAddressTranslatorInstance = {} as AddressTranslator
  //   godwokenAddressTranslatorInstance.ethAddressToGodwokenShortAddress = () =>
  //     godwokenShortAddress

  //   godwokenAddressTranslatorInstance.ethAddressToCkbAddress = () => ckbAddress

  //   it('Initial wallet without user', async () => {
  //     await expectSaga(initializeWalletSaga)
  //       .withReducer(
  //         combineReducers({
  //           [StoreKeys.Wallet]: walletReducer,
  //         }),
  //       )
  //       .provide([
  //         [
  //           select(providerSelector.addressTranslator),
  //           godwokenAddressTranslatorInstance,
  //         ],
  //         [call.fn(getConnectedAccount), ''],
  //         [call.fn(getNetwork), ''],
  //       ])

  //       .hasFinalState({
  //         [StoreKeys.Wallet]: {
  //           ethAddress: null,
  //           godwokenShortAddress: null,
  //           ckbAddress: null,
  //           chainId: null,
  //           networkName: null,
  //           errorMessage: null,
  //           lastTx: null,

  //           creatingLayer2Account: null,
  //           status: RequestStatus.Resolved,
  //         },
  //       })
  //       .run()
  //   })

  //   it('Initial wallet with user and properly chainId', async () => {
  //     const ethereum = {
  //       chainId: Network.Rinkeby,
  //       isMetaMask: true,
  //     }

  //     await expectSaga(initializeWalletSaga)
  //       .withReducer(
  //         combineReducers({
  //           [StoreKeys.Wallet]: walletReducer,
  //         }),
  //       )
  //       .provide([
  //         [
  //           select(providerSelector.addressTranslator),
  //           godwokenAddressTranslatorInstance,
  //         ],
  //         [call.fn(getNetwork), Network.Rinkeby],
  //         [call.fn(getProvider), ethereum],
  //         [call.fn(getConnectedAccount), ethAddress],
  //         [call.fn(getNetwork), Network.Rinkeby],
  //       ])
  //       .hasFinalState({
  //         [StoreKeys.Wallet]: {
  //           ethAddress: ethAddress,
  //           godwokenShortAddress: godwokenShortAddress,
  //           ckbAddress: ckbAddress,
  //           chainId: Network.Rinkeby,
  //           errorMessage: null,
  //           lastTx: null,
  //           networkName: getNetworkName(Network.Rinkeby),

  //           creatingLayer2Account: null,

  //           status: RequestStatus.Resolved,
  //         },
  //       })
  //       .run()
  //   })
})
