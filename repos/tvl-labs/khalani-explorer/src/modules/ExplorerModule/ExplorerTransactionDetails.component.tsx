import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import moment from 'moment'
import 'moment-precise-range-plugin'

import { EStatus } from '@enums/status.enum'
import { Box, Grid, Paper } from '@mui/material'
import { getSwapIntentBookByTxHash } from '@pages/Explorer/intents'
import { SwapIntentBook } from '@pages/Explorer/intents/types'
import { Typography, getNetworkIcon, PendingIcon } from '@tvl-labs/khalani-ui'

import { Network, NetworkName } from '../../constants/Networks'
import { BridgeProcessedMessage } from '../../pages/Explorer/sdk/types'
import {
  PendingStatusBox,
  SuccessStatusBox,
  ErrorStatusBox,
} from './ExplorerModule.styles'
import {
  chainIdToHexString,
  getTransactionStatus,
} from './ExplorerModule.utils'
import ExplorerTransactionBox from './ExplorerTransactionBox.component'

function calculateProcessingTime(startTimestamp: number) {
  const diffDateOne = moment.unix(startTimestamp)
  const diffDateTwo = moment()
  const diff = (moment as any).preciseDiff(diffDateOne, diffDateTwo, true)

  if (diff.days !== 0) {
    return `${diff.days} Days`
  }

  if (diff.hours !== 0) {
    diff.minutes += diff.hours * 60
  }

  return `${diff.minutes} Mins ${diff.seconds} Secs`
}

interface ExplorerTransactionDetailsProps {
  availableSourceNetworks: Network[]
}

const ExplorerTransactionDetails: React.FC<ExplorerTransactionDetailsProps> = () => {
  const params = useParams<{ id: string }>()
  const mountedRef = useRef(true)

  const [loading, setLoading] = useState(false)
  const [
    intermediateChainMessage,
    setIntermediateChainMessage,
  ] = useState<BridgeProcessedMessage>()
  const [transaction, setTransaction] = useState<SwapIntentBook>()

  const [
    foundTransactionDestinationChain,
    setFoundSourceTransactionDestination,
  ] = useState<Network>()

  const [processingTime, setProcessingTime] = useState('')
  useEffect(() => {
    if (!transaction?.blockTimestamp || transaction?.status !== 'Pending') {
      return
    }

    const startTimestamp = parseInt(transaction.blockTimestamp, 10)

    const ref = setInterval(() => {
      setProcessingTime(calculateProcessingTime(startTimestamp))
    }, 1000)

    return () => {
      clearInterval(ref)
      setProcessingTime('')
    }
  }, [transaction])

  const getExpandedStatus = useCallback(() => {
    const loadingPlaceholder = (
      <PendingStatusBox>
        <PendingIcon />
      </PendingStatusBox>
    )
    if (!transaction || loading) {
      return loadingPlaceholder
    }

    const status = getTransactionStatus(transaction)

    if (status === EStatus.COMPLETED) {
      return (
        <SuccessStatusBox marginLeft={'auto'}>
          Transaction Complete
        </SuccessStatusBox>
      )
    }

    if (status === EStatus.PENDING) {
      return (
        <PendingStatusBox>
          <Box ml="auto">Processing: {processingTime}</Box>

          <PendingIcon />
        </PendingStatusBox>
      )
    }

    if (status === EStatus.ERROR) {
      return (
        <ErrorStatusBox marginLeft={'auto'}>
          Error: Transaction Failed
        </ErrorStatusBox>
      )
    }

    return loadingPlaceholder
  }, [transaction, loading, processingTime])

  const loadDetails = useCallback(
    async (_searchText: string, sourceNetwork?: Network) => {
      setLoading(true)

      if (!sourceNetwork) {
        sourceNetwork = Network.Sepolia
      }

      setIntermediateChainMessage(undefined)
      setFoundSourceTransactionDestination(undefined)

      if (!_searchText) {
        setLoading(false)
        return
      }

      let sourceTransaction: SwapIntentBook | undefined = undefined
      sourceTransaction = await getSwapIntentBookByTxHash(_searchText)

      if (!sourceTransaction) {
        setLoading(false)
        return
      }

      if (!mountedRef.current) return
      console.log(sourceTransaction)
      setTransaction(sourceTransaction)
      const _destinationChain = Network.MumbaiTestnet

      if (_destinationChain) {
        setFoundSourceTransactionDestination(_destinationChain)
      }

      if (!mountedRef.current) return

      setLoading(false)
    },
    [],
  )

  useEffect(() => {
    if (params.id || !mountedRef.current) {
      loadDetails(params.id)
    }
    return () => {
      mountedRef.current = false
    }
  }, [loadDetails, params.id])

  if (!transaction) return <></>

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Grid container justifyContent="center" gap={4}>
        <Grid item xs={12} md={7}>
          <Typography text={`Intent details`} variant="subtitle1" />
          <Typography
            text={`${params.id.slice(0, 10)}...${params.id.slice(-10)}`}
            variant="subtitle2"
            fontWeight={500}
            fontSize={'16px'}
            color={'rgba(255, 255, 255, 0.5)'}
            lineHeight={'22px'}
          />
          <Box mt={2}>
            <Paper sx={{ p: '16px' }} elevation={2}>
              <Paper sx={{ p: '10px 32px' }} elevation={3}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  gap={1}
                  py={1}
                >
                  {foundTransactionDestinationChain && (
                    <Box>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        gap={1}
                      >
                        <Typography
                          text={`Swap intent book: `}
                          variant="subtitle2"
                          fontWeight={500}
                          fontSize={'16px'}
                          lineHeight={'22px'}
                        />
                        {getNetworkIcon(transaction.sourceChainId, {
                          style: { width: '24px' },
                        })}{' '}
                        <Typography
                          text={`${
                            NetworkName[
                              chainIdToHexString(transaction.sourceChainId)
                            ]
                          } ->`}
                          variant="subtitle2"
                          fontWeight={500}
                          fontSize={'16px'}
                          lineHeight={'22px'}
                        />
                        {getNetworkIcon(transaction.destinationChainId, {
                          style: { width: '24px' },
                        })}{' '}
                        <Typography
                          text={
                            NetworkName[
                              chainIdToHexString(transaction.destinationChainId)
                            ]
                          }
                          variant="subtitle2"
                          fontWeight={500}
                          fontSize={'16px'}
                          lineHeight={'22px'}
                        />
                      </Grid>
                    </Box>
                  )}

                  {getExpandedStatus()}
                </Grid>
              </Paper>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <ExplorerTransactionBox
            blockNumber={transaction.blockNumber}
            blockTimestamp={transaction.blockTimestamp}
            gasLimit={transaction.gasLimit}
            gasPrice={transaction.gasPrice}
            loading={loading}
            transactionStatus={transaction.status as EStatus}
            chainMessage={intermediateChainMessage}
            success={Boolean(intermediateChainMessage)}
            title="Sent"
            tokens={[transaction.sourceToken, transaction.destinationToken]}
            tokenAmount={transaction?.sourceAmount}
            tokensLabel="Source token -> Destination token:"
            signature={transaction.signature}
            permit2={transaction.sourcePermit2}
            transactionHash={transaction.transactionHash}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ExplorerTransactionDetails
