import React from 'react'

import Snackbar from '@components/Snackbar'
import Typography from '@components/Typography'
import { ArrowRightFilled, SuccessMark } from '@components/icons'
import { Divider, Stack } from '@mui/material'
import { getNetworkIcon } from '@utils/network'
import { bigIntToString } from '@utils/text'

import { TransactionCompleteProps } from './TransactionComplete.types'

const TransactionComplete: React.FC<TransactionCompleteProps> = (props) => {
  const {
    open,
    onClose,
    text,
    sourceNetworkId,
    destinationNetworkId,
    tokenAmount,
    tokenSymbol,
    tokenDecimals,
  } = props

  const message = (
    <Stack>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <SuccessMark />
        <Typography text={text} variant="button" />
      </Stack>
      <Divider sx={{ my: 1.5 }} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={0.5}
      >
        <Stack direction="row">
          {getNetworkIcon(sourceNetworkId)}
          <ArrowRightFilled />
          {getNetworkIcon(destinationNetworkId)}
        </Stack>
        <Typography
          text={`${bigIntToString(tokenAmount, tokenDecimals)} ${tokenSymbol}`}
          variant="caption"
          fontWeight={700}
        />
      </Stack>
    </Stack>
  )

  return <Snackbar open={open} onClose={onClose} message={message} />
}

export default TransactionComplete
