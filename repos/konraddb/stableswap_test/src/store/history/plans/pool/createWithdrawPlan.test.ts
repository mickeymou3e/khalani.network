// import { BigNumber } from 'ethers'
// import { expectSaga } from 'redux-saga-test-plan'
// import { select } from 'redux-saga-test-plan/matchers'

// import { ERC20 } from '@hadouken-project/stableswap-contracts'
// import { IToken } from '@interfaces/token'
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
//   createWithdrawFromPoolOperation,
// } from '@store/history/history.utils'
// import { poolsReducer } from '@store/pool/pool.slice'
// import { ITokenAmount } from '@store/pool/saga/withdraw/withdraw.saga'
// import { poolSelectors } from '@store/pool/selectors/pool.selector'
// import { contractsSelectors } from '@store/provider/provider.selector'
// import { StoreKeys } from '@store/store.keys'
// import { tokenSelectors } from '@store/tokens/tokens.selector'
// import { tokensReducer } from '@store/tokens/tokens.slice'
// import { walletReducer } from '@store/wallet/wallet.slice'
// import { user1 } from '@tests/accounts'
// import { pool, poolContract } from '@tests/pools'
// import { daiToken, lpToken, tokensReducerMock, usdcToken } from '@tests/tokens'
// import {
//   getDisplayValue,
//   convertIntegerDecimalToDecimal,
//   truncateDecimals,
// } from '@utils/string'

// import { createWithdrawPlan } from './createWithdrawPlan'

// const uuidId = 'testId'

// jest.mock('uuid', () => {
//   return {
//     v4: () => uuidId,
//   }
// })

// jest.mock('@store/history/history.utils', () => ({
//   createApproveOperation: jest.fn(),
//   createWithdrawFromPoolOperation: jest.fn(),
//   createBlockConfirmation: jest.fn(),
// }))

describe('createWithdrawPlan', () => {
  // TODO: rewrite tests
  // const createApproveOperationMock = createApproveOperation as jest.Mock
  // const createWithdrawOperationMock = createWithdrawFromPoolOperation as jest.Mock
  // const createBlockConfirmationMock = createBlockConfirmation as jest.Mock
  // const generateApproveOperation = (symbol: string, amount: string) => ({
  //   id: 'id',
  //   title: symbol,
  //   description: amount,
  //   status: OperationStatus.Pending,
  //   timeStamp: 12345,
  // })
  // createApproveOperationMock.mockImplementation(generateApproveOperation)
  // const withdrawMockOperation: IContractOperation = {
  //   id: 'id',
  //   description: 'description',
  //   status: OperationStatus.Pending,
  //   timeStamp: Date.now(),
  //   title: 'deposit',
  // }
  // createWithdrawOperationMock.mockImplementation(
  //   (): IContractOperation => {
  //     return withdrawMockOperation
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
  // it('Create withdraw plan without lp token approve', async () => {
  //   const daiValue = getDisplayValue(
  //     BigNumber.from(1000).mul(BigNumber.from(10).pow(daiToken.decimals)),
  //     2,
  //     daiToken.decimals,
  //   )
  //   const usdcValue = getDisplayValue(
  //     BigNumber.from(4000).mul(BigNumber.from(10).pow(usdcToken.decimals)),
  //     2,
  //     usdcToken.decimals,
  //   )
  //   const tokens: ITokenAmount[] = [
  //     {
  //       address: daiToken.id,
  //       amount: daiValue.value,
  //     },
  //     {
  //       address: usdcToken.id,
  //       amount: usdcValue.value,
  //     },
  //   ]
  //   const tokenModels: IToken[] = [daiToken, usdcToken]
  //   const lpTokenContract: Partial<ERC20> = {
  //     allowance: jest
  //       .fn()
  //       .mockImplementation(() =>
  //         BigNumber.from(5000).mul(BigNumber.from(10).pow(lpToken.decimals)),
  //       ),
  //   }
  //   const result = await expectSaga(
  //     createWithdrawPlan,
  //     poolContract.address,
  //     tokens,
  //     BigNumber.from(0),
  //     50,
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
  //       [StoreKeys.Pools]: {},
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [],
  //         entities: {},
  //       },
  //     })
  //     .provide([
  //       [select(contractsSelectors.poolByAddress), () => poolContract],
  //       [select(poolSelectors.selectById), () => pool],
  //       [select(tokenSelectors.selectById), () => lpToken],
  //       [select(contractsSelectors.tokenByAddress), () => lpTokenContract],
  //       [select(tokenSelectors.selectMany), () => tokenModels],
  //     ])
  //     .hasFinalState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: {},
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [uuidId],
  //         entities: {
  //           [uuidId]: {
  //             id: uuidId,
  //             type: TransactionType.Withdraw,
  //             operations: [withdrawMockOperation, createBlockMockOperation],
  //             status: TransactionStatus.Pending,
  //           },
  //         },
  //       },
  //     })
  //     .run()
  //   expect(result.returnValue).toEqual({
  //     transactionId: uuidId,
  //     shouldAskForLpTokenApprove: false,
  //   })
  // })
  // it('Create withdraw plan with lp token approve', async () => {
  //   const daiValue = getDisplayValue(
  //     BigNumber.from(1000).mul(BigNumber.from(10).pow(daiToken.decimals)),
  //     2,
  //     daiToken.decimals,
  //   )
  //   const usdcValue = getDisplayValue(
  //     BigNumber.from(4000).mul(BigNumber.from(10).pow(usdcToken.decimals)),
  //     2,
  //     usdcToken.decimals,
  //   )
  //   const tokens: ITokenAmount[] = [
  //     {
  //       address: daiToken.id,
  //       amount: daiValue.value,
  //     },
  //     {
  //       address: usdcToken.id,
  //       amount: usdcValue.value,
  //     },
  //   ]
  //   const lpTokenAmount = BigNumber.from(100).mul(
  //     BigNumber.from(10).pow(lpToken.decimals),
  //   )
  //   const lpTokenDisplayValue = truncateDecimals(
  //     convertIntegerDecimalToDecimal(lpTokenAmount, lpToken.decimals),
  //   )
  //   const tokenModels: IToken[] = [daiToken, usdcToken]
  //   const lpTokenContract: Partial<ERC20> = {
  //     allowance: jest.fn().mockImplementation(() => BigNumber.from(0)),
  //   }
  //   const result = await expectSaga(
  //     createWithdrawPlan,
  //     poolContract.address,
  //     tokens,
  //     lpTokenAmount,
  //     50,
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
  //       [StoreKeys.Pools]: {},
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [],
  //         entities: {},
  //       },
  //     })
  //     .provide([
  //       [select(contractsSelectors.poolByAddress), () => poolContract],
  //       [select(poolSelectors.selectById), () => pool],
  //       [select(tokenSelectors.selectById), () => lpToken],
  //       [select(contractsSelectors.tokenByAddress), () => lpTokenContract],
  //       [select(tokenSelectors.selectMany), () => tokenModels],
  //     ])
  //     .hasFinalState({
  //       [StoreKeys.Wallet]: {
  //         accountId: user1,
  //       },
  //       [StoreKeys.Pools]: {},
  //       [StoreKeys.Tokens]: tokensReducerMock,
  //       [StoreKeys.History]: {
  //         pendingQueue: [],
  //         ids: [uuidId],
  //         entities: {
  //           [uuidId]: {
  //             id: uuidId,
  //             type: TransactionType.Withdraw,
  //             operations: [
  //               generateApproveOperation(lpToken.symbol, lpTokenDisplayValue),
  //               withdrawMockOperation,
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
  //     shouldAskForLpTokenApprove: true,
  //   })
  // })
})
