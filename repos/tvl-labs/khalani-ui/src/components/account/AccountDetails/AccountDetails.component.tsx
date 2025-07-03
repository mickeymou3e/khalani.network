import React from 'react'

import { WalletIcon } from '@components/icons'
import { Button, Typography, useTheme } from '@mui/material'
import { getAddressLabel } from '@utils/text'

import { IAccountDetailsProps } from './AccountDetails.types'

const AccountDetails: React.FC<IAccountDetailsProps> = (props) => {
  const { ethAddress, onAddressClick } = props
  const theme = useTheme()

  return (
    <Button
      onClick={() => onAddressClick?.(ethAddress)}
      sx={{ paddingY: 1, paddingX: 3, height: 'auto' }}
      size="small"
      color="secondary"
      variant="contained"
    >
      <WalletIcon fill={theme.palette.text.secondary} />
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="left"
        sx={{ pl: 1.5 }}
      >
        {getAddressLabel(ethAddress)}
      </Typography>
    </Button>
  )
}

export default AccountDetails
