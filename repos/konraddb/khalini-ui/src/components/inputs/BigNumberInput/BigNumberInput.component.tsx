import React, { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import { ClickAwayListener } from '@mui/material'
import { Box } from '@mui/system'
import {
  convertDecimalToBigNumber,
  bigNumberToString,
  getInputValue,
} from '@utils/text'

import InputBase from '../Input'
import { IBigNumberInputProps } from './BigNumberInput.types'
import { compareBigNumbers } from './BigNumberInput.utils'

const BIG_NUMBER_PLACEHOLDER = '0.00'
const BigNumberInput: React.FC<IBigNumberInputProps> = ({
  decimals,
  value,
  maxAmount,
  onChange,
  loading,
  InputComponent: Input = InputBase,
  margin,
  sx,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState<string>('')

  useEffect(() => {
    const currentBigNumberValue =
      displayValue === '' || decimals === undefined
        ? null
        : convertDecimalToBigNumber(displayValue, decimals)

    const isTheSameValue = compareBigNumbers(currentBigNumberValue, value)

    if (!isTheSameValue) {
      if (value === null || value === undefined || decimals === undefined) {
        setDisplayValue('')
      } else {
        setDisplayValue(bigNumberToString(value, decimals))
      }

      onChange?.(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals])

  const valueChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    const value = getInputValue(event?.currentTarget?.value, decimals)

    if (value === '') {
      onChange?.(undefined)
      setDisplayValue('')
      return
    }

    if ((value || value === '') && decimals !== undefined) {
      const bigNumberValue = convertDecimalToBigNumber(value, decimals)
      if (maxAmount && bigNumberValue.gt(maxAmount)) {
        const maxAmountDisplayValue = bigNumberToString(maxAmount, decimals)
        setDisplayValue(maxAmountDisplayValue)
        onChange?.(convertDecimalToBigNumber(maxAmountDisplayValue, decimals))
      } else {
        setDisplayValue(value)
        onChange?.(bigNumberValue)
      }
    }
  }

  const formatInput = () => {
    if (
      value !== null &&
      value !== undefined &&
      !value.eq(BigNumber.from('0')) &&
      decimals !== undefined
    ) {
      setDisplayValue(bigNumberToString(value, decimals))
    }
  }

  const marginDenseInput =
    margin === 'dense'
      ? {
          height: 40,
          padding: '8px 8px',
        }
      : {}

  const marginDenseInputBase =
    margin === 'dense'
      ? {
          fontSize: '15px',
          lineHeight: '150%',
          fontWeight: 500,
          fontStyle: 'normal',
        }
      : {}

  return (
    <ClickAwayListener onClickAway={formatInput}>
      <Box width="100%">
        <Input
          sx={{
            ...sx,
            ...marginDenseInput,
          }}
          loading={loading}
          inputProps={{ inputMode: 'numeric', style: marginDenseInputBase }}
          onChange={valueChangeHandler}
          value={displayValue}
          placeholder={BIG_NUMBER_PLACEHOLDER}
          {...rest}
        />
      </Box>
    </ClickAwayListener>
  )
}

export default BigNumberInput
