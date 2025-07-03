import {
  checkIfIsInProgress,
  findPendingOrLastTransaction,
  getPendingOperations,
} from './history.utils'

describe('history selector', () => {
  const transactions = [
    {
      id: '4617c296-b918-40e1-96c9-c157cbd96c9a',
      operations: [
        {
          description:
            'This operation allows contract to burn 0.00 balUSDTavaxKAI LP tokens and receive 0.00 KAI, 0.00 USDT.avax',
          id: '6b5dba9d-a6d6-4b1f-85d8-0b4ca72e2f6b',
          status: 1,
          timeStamp: 1681296670590,
          title: 'Remove liquidity',
        },
        {
          description:
            "To make sure your transaction succeeded we're waiting on block containing this transaction receipt.",
          id: '986eb36c-834d-47ad-aef6-7d6a5eda75c1',
          status: 0,
          timeStamp: 1681296670590,
          title: 'Transaction confirmation',
        },
      ],
      status: 0,
      type: 1,
    },
    {
      id: '6400d145-0f05-49c0-8c9e-f74cb271f59d',
      operations: [
        {
          description:
            'This operation allows contract to burn 0.00 balUSDTavaxKAI LP tokens and receive 0.00 KAI, 0.00 USDT.avax',
          id: '6b5dba9d-a6d6-4b1f-85d8-0b4ca72e2f6b',
          status: 2,
          timeStamp: 1681296670590,
          title: 'Remove liquidity',
        },
      ],
      status: 2,
      type: 1,
    },
  ]

  it('should return number of pending transactions', () => {
    expect(getPendingOperations(transactions)).toBe(2)
  })

  it('should check if transaction is in progress', () => {
    expect(checkIfIsInProgress(transactions)).toBe(true)
  })

  it('should find pending or last transaction', () => {
    expect(findPendingOrLastTransaction(transactions)).toEqual(transactions[0])
  })
})
