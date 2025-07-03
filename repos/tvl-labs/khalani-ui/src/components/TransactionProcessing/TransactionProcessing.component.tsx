import React from 'react'

import TransactionStatus from '@components/Boxes/TransactionStatus'
import Typography from '@components/Typography'
import PrimaryButton from '@components/buttons/PrimaryButton'
import { ArrowRightFilled, SuccessMark } from '@components/icons'
import { ETransactionStatus } from '@interfaces/core'
import { Box, CircularProgress, Stack } from '@mui/material'
import { getTokenIconComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'
import { bigIntToString } from '@utils/text'
import { formatTokenSymbol } from '@utils/tokens'

import Accordion from '../Accordion'
import { TransactionProcessingProps } from './TransactionProcessing.types'

const TransactionProcessing: React.FC<TransactionProcessingProps> = (props) => {
  const {
    sourceChain,
    destinationChain,
    tokenSymbol,
    tokenDecimals,
    amount,
    progress,
    status,
    statusText,
    errorMessage,
    buttonText,
    handleClick,
  } = props

  const TokenIcon = getTokenIconComponent(tokenSymbol)

  return (
    <Accordion
      summary={
        status === ETransactionStatus.Success ? (
          <Stack direction="row" alignItems="center" gap={1}>
            <SuccessMark />

            <Typography
              text={'Transaction Complete'}
              variant="button"
              color="text.secondary"
            />
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={16} sx={{ color: '#000' }} />

            <Typography
              text={'Transaction Processing'}
              variant="button"
              color="text.secondary"
            />
          </Stack>
        )
      }
      details={
        <Stack mb={3} pt={1}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              <Stack direction="row" gap={0.5}>
                {getNetworkIcon(sourceChain.id)}
                <Typography
                  text={sourceChain.chainName}
                  variant="button"
                  color="text.secondary"
                />
              </Stack>
              <ArrowRightFilled />
              <Stack direction="row" gap={0.5}>
                {getNetworkIcon(destinationChain.id)}
                <Typography
                  text={destinationChain.chainName}
                  variant="button"
                  color="text.secondary"
                />
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" gap={0.5}>
              <TokenIcon />
              <Typography
                text={formatTokenSymbol(tokenSymbol) ?? ''}
                variant="body2"
                color="text.secondary"
              />
              <Typography
                text={bigIntToString(amount, tokenDecimals)}
                variant="body2"
                color="text.secondary"
                fontWeight={700}
              />
            </Stack>
          </Stack>

          <Box mt={2} display="flex" gap={2} width="100%">
            <TransactionStatus
              progress={progress}
              statusText={statusText}
              status={status}
              errorMessage={errorMessage}
            />
            {buttonText && handleClick && (
              <PrimaryButton
                size="small"
                text={buttonText}
                onClick={handleClick}
              />
            )}
          </Box>
        </Stack>
      }
    />
  )
}

export default TransactionProcessing
