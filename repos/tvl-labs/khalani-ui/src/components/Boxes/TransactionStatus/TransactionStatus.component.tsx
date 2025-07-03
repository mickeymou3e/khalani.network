import React from 'react'

import LinearProgress from '@components/LinearProgress'
import CustomizedTooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import { ETransactionStatus as TransactionStatusEnum } from '@interfaces/core'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Stack } from '@mui/material'

import { ITransactionStatusProps } from './TransactionStatus.types'

const TransactionStatus: React.FC<ITransactionStatusProps> = (props) => {
  const {
    status,
    progress,
    statusText,
    errorMessage,
    isTooltipVisible = false,
  } = props

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}
      width={status === TransactionStatusEnum.Pending ? '100%' : 'auto'}
    >
      {status === TransactionStatusEnum.Success ? (
        <Stack direction="row" alignItems="center">
          <CheckCircleOutlineIcon
            color="success"
            style={{ width: 14, height: 14 }}
          />
          <Typography
            variant="caption"
            text={'Success'}
            fontWeight={700}
            color="success.main"
          />
        </Stack>
      ) : status === TransactionStatusEnum.Fail ? (
        <Stack direction="row" alignItems="center">
          <ErrorOutlineIcon color="error" style={{ width: 14, height: 14 }} />
          <Typography
            variant="caption"
            text={'Error'}
            fontWeight={700}
            color="error.main"
          />
          {errorMessage && (
            <Typography
              variant="body2"
              text={`: ${errorMessage}`}
              fontWeight={700}
              color="error.main"
            />
          )}
        </Stack>
      ) : (
        <Box width="100%">
          <CustomizedTooltip title={isTooltipVisible ? statusText : ''}>
            <Stack width="100%" direction="row" alignItems="center" spacing={1}>
              <Box width="100%">
                <LinearProgress value={progress} decimals={0} />
              </Box>
              {!isTooltipVisible && (
                <Typography
                  text={statusText}
                  variant="body2"
                  color="text.secondary"
                  sx={{ textWrap: 'nowrap' }}
                />
              )}
            </Stack>
          </CustomizedTooltip>
        </Box>
      )}
    </Stack>
  )
}

export default TransactionStatus
