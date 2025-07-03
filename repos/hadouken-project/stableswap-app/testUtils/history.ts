import {
  OperationStatus,
  TransactionStatus,
} from '@store/history/history.types'

export const historyAction = {
  title: 'Deposit',
  status: TransactionStatus.Pending,
  date: new Date(Date.now()),
  open: true,
  operations: [
    {
      id: '1',
      title: 'Approve token transfer',
      description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
      status: OperationStatus.Success,
    },
    {
      id: '2',
      title: 'Approve token transfer',
      status: OperationStatus.Pending,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },
    {
      id: '3',
      title: 'Approve token transfer',
      status: OperationStatus.Pending,
      description:
        'The operation allow contract to transfer 1.00 USDT tokens to 3pool contract',
    },
  ],
}
