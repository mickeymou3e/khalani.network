import React, { useEffect } from 'react'

import LightButton from '@components/buttons/LightButton'
import BigNumberInput from '@components/inputs/BigNumberInput'
import { InputAdornment, Paper, Typography } from '@mui/material'

import { defaultValues, SLIPPAGE_DECIMALS } from './SlippageTolerance.constants'
import { ISlippageToleranceProps } from './SlippageTolerance.types'

const SlippageTolerance: React.FC<ISlippageToleranceProps> = (props) => {
  const { value, setValue, onValueChange } = props

  useEffect(() => {
    onValueChange(value)
  }, [value, onValueChange])

  return (
    <>
      <Typography variant="body2" sx={{ mb: 1.25 }}>
        Slippage Tolerance:
      </Typography>
      <Paper>
        <BigNumberInput
          size="small"
          startAdornment={
            <Typography variant="body2" sx={{ mr: 1 }}>
              %
            </Typography>
          }
          endAdornment={
            <InputAdornment position="end" sx={{ gap: 1 }}>
              {defaultValues.map((item) => (
                <LightButton
                  key={item.id}
                  text={item.label}
                  onClick={() => setValue(item.value)}
                />
              ))}
            </InputAdornment>
          }
          sx={{ p: 2 }}
          value={value}
          onChange={setValue}
          decimals={SLIPPAGE_DECIMALS}
          hideUSDAmount
        />
      </Paper>
    </>
  )
}

export default SlippageTolerance
