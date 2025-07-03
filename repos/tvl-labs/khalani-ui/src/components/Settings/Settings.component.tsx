import React, { useState } from 'react'

import Switch from '@components/Switch'
import { Box, Paper, Stack, Typography } from '@mui/material'

const Settings: React.FC = () => {
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false)

  const onSwitchChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => {
    setAdvancedSettings(value)
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ px: 2, py: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography color="text.secondary" variant="caption">
            {'Advanced Settings'}
          </Typography>
          <Switch onChange={onSwitchChange} />
        </Stack>
        {advancedSettings && (
          <Box py={2}>
            <Typography color="text.secondary" variant="caption">
              {
                'Streamswap employs khalani solvers to identify the optimal and quickest transfers, ensuring the best available offers.'
              }
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default Settings
