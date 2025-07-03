import React, { useMemo } from 'react'

import { BigNumber } from 'ethers'
import moment from 'moment'
import { BridgeProcessedMessage } from 'src/pages/Explorer/sdk/types'

import { EStatus } from '@enums/status.enum'
import { Paper, Grid, Box } from '@mui/material'
import {
  LinkEnum,
  DoorIcon,
  Typography,
  Link,
  PendingIcon,
  formatWithCommas,
} from '@tvl-labs/khalani-ui'

import config from '../../config'
import { Network } from '../../constants/Networks'
import { useExplorerHooks } from './ExplorerModule.hooks'
import { messages } from './ExplorerModule.messages'
import { PendingStatusInnerBox, PropertyLabel } from './ExplorerModule.styles'
import { resolveStatus } from './ExplorerTransactionBox.utils'

interface ExplorerTransactionBoxProps {
  blockNumber: number | undefined
  blockTimestamp: string | undefined
  gasLimit: string | undefined
  gasPrice: string | undefined
  loading: boolean
  transactionStatus: EStatus | null
  success: boolean
  title: string
  tokens: string[] | undefined
  tokenAmount: BigNumber | undefined
  tokensLabel: string
  transactionHash: string | undefined
  signature: string
  permit2: string
  chainMessage?: BridgeProcessedMessage
}

const ExplorerTransactionBox: React.FC<ExplorerTransactionBoxProps> = ({
  blockNumber,
  blockTimestamp,
  gasLimit,
  gasPrice,
  loading,
  transactionStatus,
  chainMessage,
  success,
  title,
  tokens,
  tokenAmount,
  tokensLabel,
  transactionHash,
  signature,
  permit2,
}) => {
  const { getTokensWithAmounts } = useExplorerHooks()

  const blockTimestampDisplayValue = useMemo(
    () =>
      blockTimestamp
        ? moment
            .unix(parseInt(blockTimestamp, 10))
            .format('MMM D, YYYY HH:mm:ss')
        : '',
    [blockTimestamp],
  )

  const statusComponent = resolveStatus(
    success,
    transactionStatus,
    chainMessage,
  )

  return (
    <Paper sx={{ p: 3, minHeight: '446px' }} elevation={2}>
      {!loading && blockTimestamp && tokens && transactionHash ? (
        <>
          <Grid container direction="row" alignItems="center" gap={1}>
            <Typography
              text={title}
              variant="body1"
              fontWeight={600}
              fontSize={18}
              lineHeight={'27px'}
            />
          </Grid>

          <PropertyLabel text={messages.TRANSACTION_HASH} variant="subtitle2" />

          <Grid container direction="row" alignItems="center" gap={1}>
            <Link
              style={{ width: '100%', background: 'none' }}
              linkType={LinkEnum.External}
              target="_blank"
              url={`${
                (config.explorer.blockExplorer as {
                  [key: string]: string | undefined
                })[Network.Khalani]
              }/tx/${transactionHash}`}
              color={'textPrimary'}
              fontSize={'14px'}
              lineHeight={'22px'}
              fontStyle={'normal'}
              display={'flex'}
              sx={{ textDecoration: 'none' }}
            >
              {transactionHash.slice(0, 10)}...
              {transactionHash.slice(-10)}
              <Box marginLeft={'auto'}>
                <DoorIcon />
              </Box>
            </Link>
          </Grid>

          <PropertyLabel text={messages.BLOCK_LABEL} variant="subtitle2" />
          <Typography
            text={blockNumber?.toString() || ''}
            fontSize={'14px'}
            fontWeight={500}
            lineHeight={'22px'}
            variant="subtitle2"
          />

          <PropertyLabel text={messages.TIMESTAMP} variant="subtitle2" />
          <Typography
            text={blockTimestampDisplayValue}
            variant="subtitle2"
            fontSize={'14px'}
            fontWeight={500}
            lineHeight={'22px'}
          />

          <Box mt={2}>
            <Paper sx={{ p: 3 }} elevation={3}>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={'Source amount'}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={formatWithCommas(tokenAmount ?? BigNumber.from(0), 6)}
                />
              </Grid>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={tokensLabel}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={getTokensWithAmounts(tokens, ['1', '1'])
                    .map((token) =>
                      token ? `${token.symbol.slice(0, 4)}` : '',
                    )
                    .join(' -> ')}
                />
              </Grid>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={'Signature:'}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={`${signature.slice(0, 10)}...${signature.slice(-10)}`}
                />
              </Grid>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={'Permit2:'}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={`${permit2.slice(0, 10)}...${permit2.slice(-10)}`}
                />
              </Grid>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={messages.GAS_PRICE}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={gasPrice || ''}
                />
              </Grid>
              <Grid container direction="row" alignItems="center" gap={1}>
                <Typography
                  text={messages.GAS_LIMIT}
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  variant="subtitle2"
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  fontSize={'14px'}
                  lineHeight={'22px'}
                  marginLeft={'auto'}
                  text={gasLimit || ''}
                />
              </Grid>
            </Paper>
          </Box>
          {statusComponent}
        </>
      ) : (
        <Grid container direction="row" alignItems="center" height="396px">
          {transactionStatus !== EStatus.ERROR && (
            <PendingStatusInnerBox
              marginLeft={'auto'}
              marginRight={'auto'}
              display={'block'}
              width={loading ? '46px' : '140px'}
            >
              {!loading && <>Processing </>}
              <PendingIcon />
            </PendingStatusInnerBox>
          )}
        </Grid>
      )}
    </Paper>
  )
}

export default ExplorerTransactionBox
