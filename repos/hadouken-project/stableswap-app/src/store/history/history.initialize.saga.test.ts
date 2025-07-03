import { expectSaga } from 'redux-saga-test-plan'

import { combineReducers } from '@reduxjs/toolkit'
import { historyReducer } from '@store/history/history.slice'
import {
  ITransaction,
  OperationStatus,
  OperationType,
  TransactionStatus,
  TransactionType,
} from '@store/history/history.types'
import { StoreKeys } from '@store/store.keys'

import { initializeHistorySaga } from './history.initialize.saga'

describe('initializeHistorySaga', () => {
  it('Clear unfinished transactions', async () => {
    const transactionObject: ITransaction = {
      id: '1',
      operations: [
        {
          id: '2',
          status: OperationStatus.Success,
          description: 'description',
          timeStamp: Date.now(),
          title: 'title',
          type: OperationType.Approve,
        },
        {
          id: '3',
          status: OperationStatus.Pending,
          description: 'description',
          timeStamp: Date.now(),
          title: 'title',
          type: OperationType.Approve,
        },
      ],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }
    await expectSaga(initializeHistorySaga)
      .withReducer(
        combineReducers({
          [StoreKeys.History]: historyReducer,
        }),
      )
      .withState({
        [StoreKeys.History]: {
          pendingQueue: [],
          ids: [transactionObject.id],
          entities: {
            [transactionObject.id]: transactionObject,
          },
        },
      })
      .hasFinalState({
        [StoreKeys.History]: {
          pendingQueue: [],
          ids: [transactionObject.id],
          entities: {
            [transactionObject.id]: {
              ...transactionObject,
              status: TransactionStatus.Fail,
              operations: [
                {
                  ...transactionObject.operations[0],
                },
                {
                  ...transactionObject.operations[1],
                  status: OperationStatus.Aborted,
                },
              ],
            },
          },
          showBadge: false,
          showHistoryDropdown: false,
        },
      })
      .run()
  })
})
