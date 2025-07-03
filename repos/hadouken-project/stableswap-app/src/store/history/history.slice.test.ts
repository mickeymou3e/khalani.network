import { RequestStatus } from '@constants/Request'

import {
  historyActions,
  historyReducer,
  initHistorySliceState,
} from './history.slice'
import {
  IContractOperation,
  ITransaction,
  OperationStatus,
  OperationType,
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
          type: OperationType.Approve,
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
      showBadge: false,
      showHistoryDropdown: false,
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
          type: OperationType.Approve,
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
      showBadge: false,
      showHistoryDropdown: false,
    }

    expect(
      historyReducer(initialState, historyActions.clearTransactions()),
    ).toEqual({
      ids: [],
      status: RequestStatus.Resolved,
      lastSubgraphSyncedBlock: 0,
      pendingQueue: [],
      entities: {},
      showBadge: false,
      showHistoryDropdown: false,
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
          type: OperationType.Approve,
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
      type: OperationType.Approve,
    }

    const operationClose: IContractOperation = {
      id: '2-1',
      status: OperationStatus.Success,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
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
      showBadge: false,
      showHistoryDropdown: false,
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
          operations: transactionObject.operations.map((operation) => ({
            ...operation,
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
      showBadge: false,
      showHistoryDropdown: false,
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
      id: '2-2',
      status: OperationStatus.Waiting,
      description: 'description 1',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
    }

    const secondOperation = {
      id: '3-3',
      status: OperationStatus.Waiting,
      description: 'description 2',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
    }

    const transactionObject: ITransaction = {
      id: '1',
      operations: [firstOperation, secondOperation],
      status: TransactionStatus.Pending,
      type: TransactionType.Deposit,
    }

    const initialState = {
      ids: [transactionObject.id],
      status: RequestStatus.Pending,
      pendingQueue: [] as string[],
      lastSubgraphSyncedBlock: 0,
      entities: {
        [transactionObject.id]: transactionObject,
      },
      showBadge: false,
      showHistoryDropdown: false,
    }

    expect(
      historyReducer(
        initialState,
        historyActions.setOperationPending({
          transactionId: transactionObject.id,
          operationId: firstOperation.id,
        }),
      ),
    ).toEqual({
      ids: [transactionObject.id],
      status: RequestStatus.Pending,
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
      showBadge: false,
      showHistoryDropdown: false,
    })
  })

  it('set operation success', () => {
    const firstOperation = {
      id: '2',
      status: OperationStatus.Success,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
    }

    const secondOperation = {
      id: '3',
      status: OperationStatus.Pending,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
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
      showBadge: false,
      showHistoryDropdown: false,
    }

    expect(
      historyReducer(
        initialState,
        historyActions.setOperationSuccess({
          transactionId: transactionObject.id,
          operationId: secondOperation.id,
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
      showBadge: false,
      showHistoryDropdown: false,
    })
  })

  it('set operation failure', () => {
    const firstOperation = {
      id: '2',
      status: OperationStatus.Pending,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
    }

    const secondOperation = {
      id: '3',
      status: OperationStatus.Waiting,
      description: 'description',
      timeStamp: Date.now(),
      title: 'title',
      type: OperationType.Approve,
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
      showBadge: false,
      showHistoryDropdown: false,
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
      showBadge: false,
      showHistoryDropdown: false,
    })
  })
})
