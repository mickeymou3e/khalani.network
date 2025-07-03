import React, { useEffect, useMemo, useState } from 'react'

import { BigNumber } from 'ethers'

import RadioButtonModal from '@components/modals/RadioButtonModal'
import {
  Box,
  FormControl,
  RadioGroup as MUIRadioGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { convertBigNumberToDecimal, getDisplayingValue } from '@utils/text'

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
  defaultCustomValue = BigNumber.from(15).mul(
    BigNumber.from(10).pow(decimals - 1),
  ),
}) => {
  if (decimals < 2) throw Error('Minimum 2 decimal places require')

  const options = useMemo(() => getOptions(decimals), [decimals])
  const [openModal, setOpenModal] = useState(false)

  const [selectedOptionId, setSelectedOptionId] = useState(
    getInitialId(decimals, value),
  )
  const [customAmount, setCustomAmount] = useState<BigNumber>(
    defaultCustomValue,
  )

  useEffect(() => {
    if (value !== undefined) {
      const selectedOption = options.find((option) => option.value.eq(value))

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
    if (selectedOptionId !== 'custom') {
      const newValue = options.find((option) => option.id === selectedOptionId)

      if (newValue?.value && newValue?.value !== value) {
        onSlippageChange?.(newValue ? newValue.value : BigNumber.from(0))
      }
    } else if (!value || !customAmount.eq(value)) {
      onSlippageChange?.(customAmount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptionId])

  useEffect(() => {
    if (selectedOptionId === 'custom') {
      onSlippageChange?.(customAmount)
    } else {
      const option = options.find((x) => x.id === selectedOptionId)
      onSlippageChange?.(option ? option.value : BigNumber.from(0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customAmount])

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
                    <Typography variant="paragraphTiny">
                      {buttonLabel}
                    </Typography>
                    &nbsp;
                    <Tooltip
                      title={convertBigNumberToDecimal(customAmount, decimals)}
                    >
                      <Box>
                        <Typography
                          variant="paragraphTiny"
                          color={(theme) => theme.palette.text.secondary}
                        >
                          {`[${getDisplayingValue(
                            Number(
                              convertBigNumberToDecimal(customAmount, decimals),
                            ),
                            2,
                          )}]`}
                        </Typography>
                        &nbsp;
                        <Typography variant="paragraphTiny">{'%'}</Typography>
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
