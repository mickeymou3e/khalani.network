import { BigNumber } from 'ethers'
import { expectSaga } from 'redux-saga-test-plan'

import { combineReducers } from '@reduxjs/toolkit'
import { historyReducer } from '@store/history/history.slice'
import {
  IContractOperation,
  OperationStatus,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { createApproveOperation } from '@store/history/history.utils'
import { StoreKeys } from '@store/store.keys'

import { createApprovePlan } from './createApprovePlan'

const uuid = '00fe34ae-8b29-4973-afaf-113ad77ebad9'

jest.mock('uuid', () => {
  return {
    v4: () => uuid,
  }
})

jest.mock('@store/history/history.utils', () => ({
  createApproveOperation: jest.fn(),
}))

describe('Approve plan saga', () => {
  const createApproveOperationMock = createApproveOperation as jest.Mock
  const approvalTokens = [
    {
      amount: BigNumber.from(10),
      address: '0x6C214FCFFC5F9184300bD95ea1322F78BA189642',
      symbol: 'PAN',
    },
  ]
  const approveMockOperation: IContractOperation = {
    id: uuid,
    description: 'description',
    status: OperationStatus.Pending,
    timeStamp: Date.now(),
    title: 'approve',
  }
  createApproveOperationMock.mockImplementation(() => approveMockOperation)

  it('should return expected result', async () => {
    await expectSaga(createApprovePlan, approvalTokens)
      .withReducer(
        combineReducers({
          [StoreKeys.History]: historyReducer,
        }),
      )
      .withState({
        [StoreKeys.History]: {
          pendingQueue: [],
          ids: [],
          entities: {},
        },
      })
      .hasFinalState({
        [StoreKeys.History]: {
          pendingQueue: [],
          ids: [uuid],
          entities: {
            [uuid]: {
              id: uuid,
              type: TransactionType.Approve,
              operations: [approveMockOperation],
              status: TransactionStatus.Pending,
            },
          },
        },
      })
      .run()
  })
})
