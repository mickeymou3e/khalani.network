import { RequestStatus } from '@constants/Request'

import {
  historyReducer,
  historyActions,
  initHistorySliceState,
} from './history.slice'
import {
  IContractOperation,
  ITransaction,
  OperationStatus,
  TransactionStatus,
  TransactionType,
} from './history.types'

describe('createDepositPlan', () => {
  it('addTransaction', () => {
    const transactionObject: ITransaction = {
      id: '1',
      operations: [
        {
          id: '2',
          status: OperationStatus.Pending,
          description: 'description',
          timeStamp: Date.now(),
          title: 'title',
        },
      ],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    expect(
      historyReducer(
        initHistorySliceState,
        historyActions.addTransaction(transactionObject),
      ),
    ).toEqual({
      ids: [transactionObject.id],
      status: RequestStatus.Idle,
      pendingQueue: [],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: transactionObject,
      },
    })
  })

  it('clear history', () => {
    const transactionObject: ITransaction = {
      id: '1',
      operations: [
        {
          id: '2',
          status: OperationStatus.Pending,
          description: 'description',
          timeStamp: Date.now(),
          title: 'title',
        },
      ],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const initialState = {
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      pendingQueue: [] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: transactionObject,
      },
    }

    expect(
      historyReducer(initialState, historyActions.clearTransactions()),
    ).toEqual({
      ids: [],
      status: RequestStatus.Resolved,
      lastSubgraphSyncedBlock: 0,
      pendingQueue: [],
      entities: {},
    })
  })

  it('close unfinished transactions', () => {
    const transactionObject: ITransaction = {
      id: '1',
      operations: [
        {
          id: '1-1',
          status: OperationStatus.Pending,
          description: 'description',
          timeStamp: Date.now(),
          title: 'title',
        },
      ],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const operationOpen: IContractOperation = {
      id: '1-1',
      status: OperationStatus.Pending,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const operationClose: IContractOperation = {
      id: '2-1',
      status: OperationStatus.Success,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const transactionHalfClosedObject: ITransaction = {
      id: '3',
      operations: [operationOpen, operationClose],
      status: TransactionStatus.Pending,
      type: TransactionType.Withdraw,
    }

    const transactionCloseObject: ITransaction = {
      id: '4',
      operations: [operationClose],
      status: TransactionStatus.Success,
      type: TransactionType.Swap,
    }

    const initialState = {
      status: RequestStatus.Resolved,
      ids: [
        transactionObject.id,
        transactionHalfClosedObject.id,
        transactionCloseObject.id,
      ],
      lastSubgraphSyncedBlock: 0,
      pendingQueue: [] as string[],
      entities: {
        [transactionObject.id]: transactionObject,
        [transactionHalfClosedObject.id]: transactionHalfClosedObject,
        [transactionCloseObject.id]: transactionCloseObject,
      },
    }

    const endState = {
      ids: [
        transactionObject.id,
        transactionHalfClosedObject.id,
        transactionCloseObject.id,
      ],
      pendingQueue: [] as string[],
      lastSubgraphSyncedBlock: 0,
      status: RequestStatus.Resolved,
      entities: {
        [transactionObject.id]: {
          ...transactionObject,
          operations: transactionObject.operations.map((x) => ({
            ...x,
            status: OperationStatus.Aborted,
          })),
          status: TransactionStatus.Fail,
        },
        [transactionHalfClosedObject.id]: {
          ...transactionHalfClosedObject,
          status: TransactionStatus.Fail,
          operations: [
            {
              ...operationOpen,
              status: OperationStatus.Aborted,
            },
            operationClose,
          ],
        },
        [transactionCloseObject.id]: transactionCloseObject,
      },
    }

    expect(
      historyReducer(
        initialState,
        historyActions.closeUnfinishedTransactions(),
      ),
    ).toEqual(endState)
  })

  it('set operation pending', () => {
    const firstOperation = {
      id: '2',
      status: OperationStatus.Waiting,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const secondOperation = {
      id: '3',
      status: OperationStatus.Waiting,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const transactionObject: ITransaction = {
      id: '1',
      operations: [firstOperation, secondOperation],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const initialState = {
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      pendingQueue: [] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: transactionObject,
      },
    }

    expect(
      historyReducer(
        initialState,
        historyActions.setOperationPending({
          transactionId: transactionObject.id,
        }),
      ),
    ).toEqual({
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      pendingQueue: [firstOperation.id] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: {
          ...transactionObject,
          operations: [
            { ...firstOperation, status: OperationStatus.Pending },
            secondOperation,
          ],
        },
      },
    })
  })

  it('set operation success', () => {
    const firstOperation = {
      id: '2',
      status: OperationStatus.Success,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const secondOperation = {
      id: '3',
      status: OperationStatus.Pending,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const transactionObject: ITransaction = {
      id: '1',
      operations: [firstOperation, secondOperation],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const initialState = {
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      lastSubgraphSyncedBlock: 0,
      pendingQueue: [secondOperation.id] as string[],
      entities: {
        [transactionObject.id]: transactionObject,
      },
    }

    expect(
      historyReducer(
        initialState,
        historyActions.setOperationSuccess({
          transactionId: transactionObject.id,
        }),
      ),
    ).toEqual({
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      pendingQueue: [] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: {
          ...transactionObject,
          status: TransactionStatus.Success,
          operations: [
            firstOperation,
            { ...secondOperation, status: OperationStatus.Success },
          ],
        },
      },
    })
  })

  it('set operation failure', () => {
    const firstOperation = {
      id: '2',
      status: OperationStatus.Pending,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const secondOperation = {
      id: '3',
      status: OperationStatus.Waiting,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
    }

    const transactionObject: ITransaction = {
      id: '1',
      operations: [firstOperation, secondOperation],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const initialState = {
      ids: [transactionObject.id],
      status: RequestStatus.Resolved,
      pendingQueue: [firstOperation.id] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: transactionObject,
      },
    }

    expect(
      historyReducer(
        initialState,
        historyActions.setOperationFailure({
          transactionId: transactionObject.id,
        }),
      ),
    ).toEqual({
      ids: [transactionObject.id],
      pendingQueue: [] as string[],
      status: RequestStatus.Resolved,
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: {
          ...transactionObject,
          status: TransactionStatus.Fail,
          operations: [
            { ...firstOperation, status: OperationStatus.Fail },
            { ...secondOperation, status: OperationStatus.Aborted },
          ],
        },
      },
    })
  })
})
