import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  ETransactionStatus,
  TransactionComplete,
  TransactionProcessing as TransactionProcessingUI,
} from '@tvl-labs/khalani-ui'
import {
  getIntentStatus,
  RpcIntentState,
  getDepositById,
  balancesSelectors,
  formatTokenSymbol,
} from '@tvl-labs/sdk'

import { ITransactionProcessingProps } from './TransactionProcessing.types'

const TransactionProcessing: React.FC<ITransactionProcessingProps> = ({
  sourceChain,
  destinationChain,
  tokenSymbol,
  tokenDecimals,
  amount,
  depositId,
  destinationTokenId,
  destinationTokenValue,
  onSuccess,
}) => {
  const [progress, setProgress] = useState<bigint>(0n)
  const [status, setStatus] = useState<ETransactionStatus>(
    ETransactionStatus.Pending,
  )
  const [statusText, setStatusText] = useState<string>('Publishing Intent')
  const [openComplete, setOpenComplete] = useState<boolean>(false)
  const getTokenBalance = useSelector(balancesSelectors.selectById)
  const currentBalance = destinationTokenId
    ? getTokenBalance(destinationTokenId)?.balance ?? 0n
    : 0n

  const [startingBalance, setStartingBalance] = useState<bigint>(currentBalance)

  useEffect(() => {
    setStartingBalance(currentBalance)
  }, [depositId])

  const isBalancesUpdated = useMemo(() => {
    if (!destinationTokenId) return false
    return currentBalance === startingBalance + destinationTokenValue
  }, [
    currentBalance,
    startingBalance,
    destinationTokenValue,
    destinationTokenId,
  ])

  useEffect(() => {
    if (!depositId || status === ETransactionStatus.Success) return

    const fetchStatus = async () => {
      try {
        const deposit = await getDepositById(depositId)

        if (deposit.status === 'pending') {
          setProgress(25n)
          setStatus(ETransactionStatus.Pending)
          setStatusText('Publishing Intent')
          return
        }

        if (deposit.status === 'error') {
          setStatus(ETransactionStatus.Fail)
          setStatusText('Failed to publish intent')
          return
        }

        if (deposit.status === 'success') {
          if (deposit.intentId) {
            const intentStatus = await getIntentStatus(deposit.intentId)
            if (intentStatus === RpcIntentState.Solved && isBalancesUpdated) {
              setProgress(100n)
              setStatus(ETransactionStatus.Success)
              setStatusText('Transaction Completed')
            } else if (intentStatus === RpcIntentState.Solved) {
              setProgress(75n)
              setStatus(ETransactionStatus.Pending)
              setStatusText('Awaiting Settlement')
            } else if (intentStatus === RpcIntentState.Open) {
              setProgress(50n)
              setStatusText('Awaiting Solution')
            }
          } else {
            setProgress(50n)
            setStatus(ETransactionStatus.Pending)
            setStatusText('Awaiting Solution')
          }
        }
      } catch (error) {
        setStatus(ETransactionStatus.Fail)
        setStatusText('Failed to fetch transaction status')
      }
    }

    fetchStatus()

    const intervalId = setInterval(fetchStatus, 3000)
    return () => {
      clearInterval(intervalId)
    }
  }, [depositId, status, isBalancesUpdated])

  useEffect(() => {
    if (status === ETransactionStatus.Success) {
      setOpenComplete(true)
      setStatus(ETransactionStatus.Pending)
      onSuccess()
    }
  }, [status, onSuccess])

  return (
    <>
      {depositId && status !== ETransactionStatus.Success && (
        <TransactionProcessingUI
          sourceChain={sourceChain}
          destinationChain={destinationChain}
          tokenSymbol={tokenSymbol}
          tokenDecimals={tokenDecimals}
          amount={amount}
          progress={progress}
          status={status}
          statusText={statusText}
        />
      )}

      <TransactionComplete
        open={openComplete}
        onClose={() => setOpenComplete(false)}
        text="Transaction Complete"
        sourceNetworkId={sourceChain.id}
        destinationNetworkId={destinationChain.id}
        tokenAmount={amount}
        tokenSymbol={formatTokenSymbol(tokenSymbol) ?? '-'}
        tokenDecimals={18}
      />
    </>
  )
}

export default TransactionProcessing
