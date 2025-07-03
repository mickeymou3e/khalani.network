import React from 'react'

import { CopyClipboardIcon, JazzIcon } from '@components/icons'
import RedirectIcon from '@components/icons/business/Redirect'
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material'
import { theme } from '@styles/theme'
import { formatWithCommas, getAddressLabel } from '@utils/text'

import { IAccountOverviewProps } from './AccountOverview.types'

const AccountOverview: React.FC<IAccountOverviewProps> = (props) => {
  const {
    accountAddress,
    accountBalance,
    isFetchingBalances,
    handleDisconnectWallet,
  } = props

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  return (
    <Paper elevation={7} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <JazzIcon
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            size={24}
            address={accountAddress}
          />
          <Typography variant="button" color="text.secondary">
            {getAddressLabel(accountAddress)}
          </Typography>
          <IconButton
            sx={{ p: 0 }}
            onClick={() => handleCopyToClipboard(accountAddress)}
          >
            <CopyClipboardIcon />
          </IconButton>
        </Box>
        <IconButton onClick={handleDisconnectWallet} sx={{ mr: 1 }}>
          <RedirectIcon fill={theme.palette.primary.main} />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="body2" color="text.secondary">
          Account Balance
        </Typography>
        {isFetchingBalances ? (
          <Skeleton sx={{ bgcolor: theme.palette.primary.main }} width={100} />
        ) : (
          <Typography variant="h5" color="text.secondary">
            ${accountBalance ? formatWithCommas(accountBalance, 14) : '0.00'}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}

export default AccountOverview
