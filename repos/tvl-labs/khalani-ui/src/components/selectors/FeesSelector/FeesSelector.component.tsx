import React, { useState } from 'react'

import Switch from '@components/Switch'
import TextField from '@components/inputs/TextField/TextField.component'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { getTokenIconComponent } from '@utils/icons'

import { IFeesSelectorProps } from './FeesSelector.types'
import FeeBox from './components/FeeBox.component'

const FeesSelector: React.FC<IFeesSelectorProps> = (props) => {
  const {
    fees,
    selectedFee,
    tokenSymbol,
    isFixedFee = false,
    feeChangeFn,
    textFieldChangeFn,
  } = props
  const [switchValue, setSwitchValue] = useState<boolean>(false)

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchValue(event.target.checked)
  }

  const TokenIcon = getTokenIconComponent(tokenSymbol)

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      {isFixedFee ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="text.secondary" variant="body2">
              Select Fees
            </Typography>

            <Stack direction="row" gap={0.5}>
              <Typography color="text.secondary" variant="body2">
                % based
              </Typography>
              <Switch value={switchValue} onChange={handleSwitchChange} />
              <Typography color="text.secondary" variant="body2">
                fixed amount
              </Typography>
            </Stack>
          </Stack>
          {!switchValue ? (
            <Stack direction="row" spacing={1} mt={2}>
              <TextField
                placeholder="Custom"
                endAdornmentSymbol="%"
                onChange={textFieldChangeFn}
              />
              <Stack direction="row" spacing={1}>
                {fees.map((fee) => (
                  <FeeBox
                    value={fee}
                    key={fee}
                    selected={fee === selectedFee}
                    onClick={() => feeChangeFn(fee)}
                  />
                ))}
              </Stack>
            </Stack>
          ) : (
            <Box mt={2}>
              <TextField
                placeholder="Enter fee value"
                onChange={textFieldChangeFn}
                startAdornment={<TokenIcon />}
              />
            </Box>
          )}
        </>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="text.secondary" variant="body2">
              Select Fees
            </Typography>
          </Stack>
          <Stack>
            <Stack direction="row" spacing={1} mt={2}>
              <TextField
                placeholder="Custom"
                endAdornmentSymbol="%"
                onChange={textFieldChangeFn}
              />
              <Stack direction="row" spacing={1}>
                {fees.map((fee) => (
                  <FeeBox
                    value={fee}
                    key={fee}
                    selected={fee === selectedFee}
                    onClick={() => feeChangeFn(fee)}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </Paper>
  )
}

export default FeesSelector
