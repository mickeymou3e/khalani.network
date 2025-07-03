import React from 'react'

import { Box, Switch, Typography } from '@mui/material'
import InternalDrawer from '@ui/InternalDrawer'

import { messages } from './Settings.messages'
import { ISettingsProps } from './Settings.types'

const Settings: React.FC<ISettingsProps> = (props) => {
  const { showWithdrawalAddress, toggleWithdrawalAddress, toggleDrawer } = props

  return (
    <InternalDrawer
      header={messages.SETTINGS_DRAWER_HEADER}
      subheader={messages.SETTINGS_DRAWER_SUBHEADER}
      toggleDrawer={toggleDrawer}
    >
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Typography>{messages.SETTINGS_DRAWER_LABEL}</Typography>
        <Switch
          color="secondary"
          checked={showWithdrawalAddress}
          onChange={toggleWithdrawalAddress}
        />
      </Box>
    </InternalDrawer>
  )
}

export default Settings
