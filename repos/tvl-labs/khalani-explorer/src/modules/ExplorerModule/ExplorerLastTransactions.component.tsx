import React, { Fragment, ReactElement, useCallback, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import moment from 'moment'

import TransactionFilteringContainer from '@containers/TransactionFilteringContainer'
import { EStatus } from '@enums/status.enum'
import { Box, Grid } from '@mui/material'
import { SwapIntentBook } from '@pages/Explorer/intents/types'
import {
  CompletedIcon,
  ExplorerErrorIcon,
  IColumn,
  PendingIcon,
  Table,
  Typography,
  getTokenComponent,
  createNetworkChip,
  getAddressLabel,
} from '@tvl-labs/khalani-ui'

import { Network } from '../../constants/Networks'
import { useExplorerHooks } from './ExplorerModule.hooks'
import { getTransactionStatus } from './ExplorerModule.utils'

const createIconCellWithoutNetwork = (
  tokenSymbol: string,
  tokenAmount: string,
): ReactElement => (
  <Grid container direction="row" wrap="nowrap" alignItems="center" gap={1}>
    {getTokenComponent(tokenSymbol)}
    <Grid item>
      <Typography variant="body2" text={`${tokenAmount} ${tokenSymbol}`} />
    </Grid>
  </Grid>
)

interface ExplorerLastTransactionsProps {
  networks: Network[]
}

const ExplorerLastTransactions: React.FC<ExplorerLastTransactionsProps> = ({
  networks,
}) => {
  const { getTokensWithAmounts, transactions, isLoading } = useExplorerHooks()

  const getStatusCell = useCallback((transaction: SwapIntentBook) => {
    const status = getTransactionStatus(transaction)

    let icon = <PendingIcon />
    if (status === EStatus.COMPLETED) {
      icon = <CompletedIcon />
    } else if (status === EStatus.ERROR) {
      icon = <ExplorerErrorIcon />
    }

    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        <Box>{status}</Box>
        {icon}
      </Grid>
    )
  }, [])

  const tableColumns = [
    { label: 'Transaction', value: 'transaction', width: '40%' },
    { label: 'From', value: 'from', width: '10%' },
    { label: 'Token', value: 'tokens', width: '15%' },
    {
      label: 'Timestamp',
      value: 'timestamp',
      width: '20%',
      sortDefault: true,
    },
    { label: 'Status', value: 'status', width: '15%' },
  ]

  const columns: IColumn[] = tableColumns.map((column) => ({
    value: column.label,
    name: column.value,
    width: column.width,
    align: column.label === 'Status' ? 'right' : 'left',
    sortDefault: column.sortDefault,
  }))

  const rows = useMemo(
    () =>
      transactions?.map((transaction) => ({
        id: transaction.transactionHash,
        cells: {
          transaction: {
            value: (
              <>
                <Grid container direction="row" alignItems="center" gap={1}>
                  {createNetworkChip(transaction.sourceChainId)}
                  -&gt;
                  {createNetworkChip(transaction.destinationChainId)}
                </Grid>
              </>
            ),
          },
          from: {
            value: getAddressLabel(transaction.author),
          },
          tokens: {
            value: (
              <Grid container direction="row" alignItems="center" gap={1}>
                {getTokensWithAmounts(
                  [transaction.sourceToken],
                  [transaction.sourceAmount.toString()],
                ).map(({ symbol, amount }) => (
                  <Fragment key={symbol}>
                    {}
                    {createIconCellWithoutNetwork(symbol.slice(0, 4), amount) ||
                      'Error'}
                  </Fragment>
                ))}
              </Grid>
            ),
          },
          timestamp: {
            value:
              transaction.blockTimestamp === null
                ? `Block: ${transaction.blockNumber}`
                : moment
                    .unix(parseInt(transaction.blockTimestamp, 10))
                    .format('MMM D, YYYY HH:mm:ss A'),
          },
          status: {
            value: getStatusCell(transaction),
          },
        },
      })),
    [transactions, getTokensWithAmounts, getStatusCell],
  )

  return (
    <Grid mt={4} item lg={12} xl={10} sx={{ maxWidth: '100%' }}>
      <Box mb={2}>
        <Typography variant="subtitle1" text={`Transfers`}></Typography>
      </Box>
      <TransactionFilteringContainer networks={networks} />
      <Table
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        redirectPath={'explorer'}
        RouterLink={RouterLink}
      />
    </Grid>
  )
}

export default ExplorerLastTransactions
