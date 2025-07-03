// import { BigNumber } from 'ethers'
// import { expectSaga } from 'redux-saga-test-plan'
// import { select } from 'redux-saga-test-plan/matchers'

// import { Swaps } from '@hadouken-project/stableswap-contracts'
// import { combineReducers } from '@reduxjs/toolkit'
// import { historyReducer } from '@store/history/history.slice'
// import {
//   IContractOperation,
//   OperationStatus,
//   TransactionStatus,
//   TransactionType,
// } from '@store/history/history.types'
// import {
//   createApproveOperation,
//   createBlockConfirmation,
//   createSwapOperation,
// } from '@store/history/history.utils'
// import { poolsReducer } from '@store/pool/pool.slice'
// import { IToken } from '@store/pool/saga/withdraw/withdraw.saga'
// import { poolSelectors } from '@store/pool/selectors/pool.selector'
// import { contractsSelectors } from '@store/provider/provider.selector'
// import { StoreKeys } from '@store/store.keys'
// import { tokenSelectors } from '@store/tokens/tokens.selector'
// import { tokensReducer } from '@store/tokens/tokens.slice'
// import { walletReducer } from '@store/wallet/wallet.slice'
// import { user1 } from '@tests/accounts'
// import { pool, poolContract, poolsReducerMock } from '@tests/pools'
// import { daiToken, tokensReducerMock, usdcToken } from '@tests/tokens'
// import { convertIntegerDecimalToDecimal, truncateDecimals } from '@utils/string'

// import { createSwapPlan } from './createSwapPlan'

// const uuidId = 'testId'

// jest.mock('uuid', () => {
//   return {
//     v4: () => uuidId,
//   }
// })

// jest.mock('@store/history/history.utils', () => ({
//   createApproveOperation: jest.fn(),
//   createSwapOperation: jest.fn(),
//   createBlockConfirmation: jest.fn(),
// }))

describe('createWithdrawPlan', () => {
  // TODO: rewrite tests
  // const createApproveOperationMock = createApproveOperation as jest.Mock
  // const createSwapOperationMock = createSwapOperation as jest.Mock
  // const createBlockConfirmationMock = createBlockConfirmation as jest.Mock
  // const generateApproveOperation = (symbol: string, amount: string) => ({
  //   id: 'id',
  //   title: symbol,
  //   description: amount,
  //   status: OperationStatus.Pending,
  //   timeStamp: 12345,
  // })
  // createApproveOperationMock.mockImplementation(generateApproveOperation)
  // const swapMockOperation: IContractOperation = {
  //   id: 'id',
  //   description: 'description',
  //   status: OperationStatus.Pending,
  //   timeStamp: Date.now(),
  //   title: 'deposit',
  // }
  // const swapsContract: Partial<Swaps> = {
  //   address: '0xaE4059E2E23958f627eF75d2467343F4d8838709',
  // }
  // createSwapOperationMock.mockImplementation(
  //   (): IContractOperation => {
  //     return swapMockOperation
  //   },
  // )
  // const createBlockMockOperation: IContractOperation = {
  //   id: 'id',
  //   description: 'description',
  //   status: OperationStatus.Pending,
  //   timeStamp: Date.now(),
  //   title: 'deposit',
  // }
  // createBlockConfirmationMock.mockImplementation(
  //   (): IContractOperation => {
  //     return createBlockMockOperation
  //   },
  // )
  // it('Create swap plan without token approve', async () => {
  //   const baseToken: IToken = {
  //     address: usdcToken.address,
  //     amount: BigNumber.from(1000).mul(
  //       BigNumber.from(10).pow(usdcToken.decimals),
  //     ),
  //   }
  //   const tokenContract = {
  //     allowance: () => {
  //       return BigNumber.from(10_000).mul(
  //         BigNumber.from(10).pow(usdcToken.decimals),
  //       )
  //     },
  //   }
  //   const result = await expectSaga(
  //     createSwapPlan,
  //     baseToken,
  //     daiToken.address,
  //     poolContract.address,
  //   )
  //     .withReducer(
  //       combineReducers({
  //         [StoreKeys.Wallet]: walletReducer,
  //         [StoreKeys.Pools]: poolsReducer,
  //         [StoreKeys.History]: historyReducer,
  //         [StoreKeys.Tokens]: tokensReducer,
  //       }),
  //     )
  //     .withState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: poolsReducerMock,
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [],
  //         entities: {},
  //       },
  //     })
  //     .provide([
  //       [select(contractsSelectors.swaps), swapsContract],
  //       [select(contractsSelectors.tokenByAddress), () => tokenContract],
  //       [select(poolSelectors.selectById), () => pool],
  //       [select(tokenSelectors.selectById), () => daiToken],
  //     ])
  //     .hasFinalState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: poolsReducerMock,
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [uuidId],
  //         entities: {
  //           [uuidId]: {
  //             id: uuidId,
  //             type: TransactionType.Swap,
  //             operations: [swapMockOperation, createBlockMockOperation],
  //             status: TransactionStatus.Pending,
  //           },
  //         },
  //       },
  //     })
  //     .run()
  //   expect(result.returnValue).toEqual({
  //     transactionId: uuidId,
  //     shouldAskForBaseTokenApprove: false,
  //   })
  // })
  // it('Create swap plan with token approve', async () => {
  //   const baseToken: IToken = {
  //     address: usdcToken.address,
  //     amount: BigNumber.from(1000).mul(
  //       BigNumber.from(10).pow(usdcToken.decimals),
  //     ),
  //   }
  //   const baseTokenDisplayValue = truncateDecimals(
  //     convertIntegerDecimalToDecimal(baseToken.amount, usdcToken.decimals),
  //   )
  //   const tokenContract = {
  //     allowance: () => {
  //       return BigNumber.from(0)
  //     },
  //   }
  //   const result = await expectSaga(
  //     createSwapPlan,
  //     baseToken,
  //     daiToken.address,
  //     poolContract.address,
  //   )
  //     .withReducer(
  //       combineReducers({
  //         [StoreKeys.Wallet]: walletReducer,
  //         [StoreKeys.Pools]: poolsReducer,
  //         [StoreKeys.History]: historyReducer,
  //         [StoreKeys.Tokens]: tokensReducer,
  //       }),
  //     )
  //     .withState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: poolsReducerMock,
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [],
  //         entities: {},
  //       },
  //     })
  //     .provide([
  //       [select(contractsSelectors.swaps), swapsContract],
  //       [select(contractsSelectors.tokenByAddress), () => tokenContract],
  //       [select(poolSelectors.selectById), () => pool],
  //     ])
  //     .hasFinalState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: poolsReducerMock,
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [uuidId],
  //         entities: {
  //           [uuidId]: {
  //             id: uuidId,
  //             type: TransactionType.Swap,
  //             operations: [
  //               generateApproveOperation(
  //                 usdcToken.symbol,
  //                 baseTokenDisplayValue,
  //               ),
  //               swapMockOperation,
  //               createBlockMockOperation,
  //             ],
  //             status: TransactionStatus.Pending,
  //           },
  //         },
  //       },
  //     })
  //     .run()
  //   expect(result.returnValue).toEqual({
  //     transactionId: uuidId,
  //     shouldAskForBaseTokenApprove: true,
  //   })
  // })
})
