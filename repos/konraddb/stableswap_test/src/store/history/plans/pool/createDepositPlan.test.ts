// import { BigNumber } from 'ethers'
// import { expectSaga } from 'redux-saga-test-plan'
// import { select } from 'redux-saga-test-plan/matchers'

// import { getDisplayValue } from '@components/inputs/BigNumberInput/BigNumberInput.utils'
// import { ERC20 } from '@hadouken-project/stableswap-contracts'
// import { IToken } from '@interfaces/token'
// import { combineReducers } from '@reduxjs/toolkit'
// import { contractsSelectors } from '@store/contracts/contracts.selector'
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
//   createDepositToPoolOperation,
// } from '@store/history/history.utils'
// import { poolsReducer } from '@store/pool/pool.slice'
// import { poolSelectors } from '@store/pool/selectors/pool.selector'
// import { StoreKeys } from '@store/store.keys'
// import { tokensReducer } from '@store/tokens/tokens.slice'
// import { walletReducer } from '@store/wallet/wallet.slice'
// import { user1 } from '@tests/accounts'
// import { pool, poolContract } from '@tests/pools'
// import { daiToken, tokensReducerMock, usdcToken } from '@tests/tokens'
// import { convertIntegerDecimalToDecimal, truncateDecimals } from '@utils/string'

// import { createDepositPlan } from './createDepositPlan'

// const uuidId = 'testId'

// jest.mock('uuid', () => {
//   return {
//     v4: () => uuidId,
//   }
// })

// jest.mock('@store/history/history.utils', () => ({
//   createApproveOperation: jest.fn(),
//   createDepositToPoolOperation: jest.fn(),
//   createBlockConfirmation: jest.fn(),
// }))

// describe('createDepositPlan', () => {
// TODO: rewrite tests
// const createApproveOperationMock = createApproveOperation as jest.Mock
// const createDepositToPoolOperationMock = createDepositToPoolOperation as jest.Mock
// const createBlockConfirmationMock = createBlockConfirmation as jest.Mock
// const generateApproveOperation = (symbol: string, amount: string) => ({
//   id: 'id',
//   title: symbol,
//   description: amount,
//   status: OperationStatus.Pending,
//   timeStamp: 12345,
// })
// createApproveOperationMock.mockImplementation(generateApproveOperation)
// const depositMockOperation: IContractOperation = {
//   id: 'id',
//   description: 'description',
//   status: OperationStatus.Pending,
//   timeStamp: Date.now(),
//   title: 'deposit',
// }
// createDepositToPoolOperationMock.mockImplementation(
//   (): IContractOperation => {
//     return depositMockOperation
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
// const daiValue = getDisplayValue(
//   BigNumber.from(4).mul(BigNumber.from(10).pow(daiToken.decimals)),
//   2,
//   daiToken.decimals,
// )
// const usdcValue = getDisplayValue(
//   BigNumber.from(6).mul(BigNumber.from(10).pow(usdcToken.decimals)),
//   2,
//   usdcToken.decimals,
// )
// const tokensValues = [daiValue, usdcValue]
// const tokens = [
//   {
//     address: daiToken.id,
//     amount: daiValue.value,
//   },
//   {
//     address: usdcToken.id,
//     amount: usdcValue.value,
//   },
// ]
// it('Create deposit plan without approves needed', async () => {
//   const tokenContractByAddress = (
//     tokenAddress: IToken['address'],
//   ): Partial<ERC20> => {
//     let allowance = BigNumber.from(0)
//     if (tokenAddress === tokens[0].address) {
//       allowance = tokensValues[0].value
//     } else if (tokenAddress === tokens[1].address) {
//       allowance = tokensValues[1].value
//     }
//     return {
//       allowance: jest.fn().mockImplementation(() => {
//         return allowance
//       }),
//     }
//   }
//   const result = await expectSaga(
//     createDepositPlan,
//     poolContract.address,
//     tokens,
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
//       [select(contractsSelectors.tokenByAddress), tokenContractByAddress],
//       [select(poolSelectors.selectById), () => pool],
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
//             type: TransactionType.Deposit,
//             operations: [depositMockOperation, createBlockMockOperation],
//             status: TransactionStatus.Pending,
//           },
//         },
//       },
//     })
//     .run()
//   expect(result.returnValue).toEqual({
//     transactionId: uuidId,
//     tokensToApprove: [],
//   })
// })
// it('Create deposit plan wih approves needed', async () => {
//   const tokenContractByAddress = (
//     tokenAddress: IToken['address'],
//   ): Partial<ERC20> => {
//     let allowance = BigNumber.from(0)
//     if (tokenAddress === tokens[0].address) {
//       allowance = tokensValues[0].value
//     } else if (tokenAddress === tokens[1].address) {
//       allowance = BigNumber.from(0)
//     }
//     return {
//       allowance: jest.fn().mockImplementation(() => {
//         return allowance
//       }),
//     }
//   }
//   const result = await expectSaga(
//     createDepositPlan,
//     poolContract.address,
//     tokens,
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
//       [select(contractsSelectors.tokenByAddress), tokenContractByAddress],
//       [select(poolSelectors.selectById), () => pool],
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
//             type: TransactionType.Deposit,
//             operations: [
//               generateApproveOperation(
//                 usdcToken.symbol,
//                 truncateDecimals(
//                   convertIntegerDecimalToDecimal(
//                     tokens[1].amount,
//                     usdcToken.decimals,
//                   ),
//                 ),
//               ),
//               depositMockOperation,
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
//     tokensToApprove: [tokens[1]],
//   })
// })
// })
