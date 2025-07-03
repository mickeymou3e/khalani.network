import React, { useEffect, useMemo, useState } from 'react'

import RadioButtonModal from '@components/modals/RadioButtonModal'
import {
  Box,
  FormControl,
  RadioGroup as MUIRadioGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { convertBigIntToDecimal, getDisplayingValue } from '@utils/text'

import RadioButton from '../RadioButton'
import { getOptions } from './CustomizedRadioGroup.constants'
import { ICustomizedRadioGroupProps } from './CustomizedRadioGroup.types'
import { getInitialId } from './CustomizedRadioGroup.utils'

const CustomizedRadioGroup: React.FC<ICustomizedRadioGroupProps> = ({
  value,
  maxValue,
  decimals = 4,
  onSlippageChange,
  row = true,
  buttonLabel,
  defaultCustomValue = BigInt(15) * BigInt(10) ** BigInt(decimals - 1),
}) => {
  if (decimals < 2) throw Error('Minimum 2 decimal places require')

  const options = useMemo(() => getOptions(decimals), [decimals])
  const [openModal, setOpenModal] = useState(false)

  const [selectedOptionId, setSelectedOptionId] = useState(
    getInitialId(decimals, value),
  )
  const [customAmount, setCustomAmount] = useState<bigint>(defaultCustomValue)

  useEffect(() => {
    if (value !== undefined) {
      const selectedOption = options.find((option) => option.value === value)

      if (selectedOption && selectedOptionId !== selectedOption.id) {
        setSelectedOptionId(selectedOption.id)
      } else if (!selectedOption && selectedOptionId !== 'custom') {
        setSelectedOptionId('custom')
        setCustomAmount(value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    if (selectedOptionId === 'custom') {
      onSlippageChange?.(customAmount)
    } else {
      const option = options.find((x) => x.id === selectedOptionId)
      onSlippageChange?.(option ? option.value : BigInt(0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customAmount, onSlippageChange])

  const handleClose = () => {
    setOpenModal(false)
  }

  return (
    <FormControl>
      <RadioButtonModal
        open={openModal}
        handleClose={handleClose}
        customizedAmount={customAmount}
        onCustomizedAmountChange={(value) => {
          if (value) {
            setCustomAmount(value)
          }
        }}
        maxValue={maxValue}
        decimals={decimals}
      />
      <FormControl sx={{ width: '100%' }}>
        <MUIRadioGroup
          row={row}
          value={selectedOptionId}
          onChange={(_e, id) => {
            setSelectedOptionId(id)
          }}
        >
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
            <Box>
              {options.map((option) => (
                <RadioButton
                  sx={{
                    mr: 1,
                    py: 1,
                  }}
                  key={option.id}
                  value={option.id}
                  label={`${option.name}%`}
                />
              ))}
              <RadioButton
                sx={{
                  mr: 0,
                  py: 1,
                }}
                value="custom"
                label={
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1">{buttonLabel}</Typography>
                    &nbsp;
                    <Tooltip
                      title={convertBigIntToDecimal(customAmount, decimals)}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          color={(theme) => theme.palette.text.secondary}
                        >
                          {`[${getDisplayingValue(
                            Number(
                              convertBigIntToDecimal(customAmount, decimals),
                            ),
                            2,
                          )}]`}
                        </Typography>
                        &nbsp;
                        <Typography variant="body1">{'%'}</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                }
                onClick={() => setOpenModal(true)}
              />
            </Box>
          </Box>
        </MUIRadioGroup>
      </FormControl>
    </FormControl>
  )
}

export default CustomizedRadioGroup
