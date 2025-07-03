import React, { useCallback, useEffect, useState } from 'react'

import {
  FormControlLabel,
  Radio,
  RadioGroup,
  RadioProps,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import InputBase from '@mui/material/InputBase'
import { alpha, useTheme } from '@mui/material/styles'

import { messages } from './SlippageSelector.messages'
import { ISlippageSelectorProps } from './SlippageSelector.types'

const PercentageRadio: React.FC<RadioProps> = ({ value, ...props }) => {
  const { palette } = useTheme()

  return (
    <Radio
      value={value}
      style={{
        minHeight: 50,
        color: palette.primary.main,
      }}
      {...props}
    />
  )
}

const RadioInputField: React.FC<
  RadioProps & {
    inputValue?: number
    inputPlaceholder?: string
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onFieldClick: (value: number) => void
  }
> = (props) => {
  const {
    inputValue,
    inputPlaceholder,
    onInputChange,
    onFieldClick,
    ...radioProps
  } = props

  const { value, checked } = radioProps
  const { palette } = useTheme()

  return (
    <Box onClick={() => onFieldClick(value as number)}>
      <PercentageRadio value={value} {...radioProps} />
      <InputBase
        style={{
          height: 48,
          width: 200,
          borderRadius: 5,
          padding: 10,
        }}
        value={inputValue}
        onChange={onInputChange}
        readOnly={!checked}
        placeholder={inputPlaceholder}
        endAdornment={
          <InputAdornment position="end">
            <Typography
              style={{ color: palette.primary.main, fontWeight: 700 }}
            >
              {messages.PERCENTAGE_SIGN}
            </Typography>
          </InputAdornment>
        }
      />
    </Box>
  )
}

const CUSTOM_PERCENTAGE_OPTION = 0

const SlippageSelector: React.FC<ISlippageSelectorProps> = ({
  initialPercentage,
  percentageOptions,
  onChange,
}) => {
  const { palette } = useTheme()
  const isCustomPercentageSelected = (option: number) =>
    option === CUSTOM_PERCENTAGE_OPTION

  const getPercentageOption = (percentage: number) => {
    const percentageOption = percentageOptions?.find(
      (percentageOption) => percentageOption === percentage,
    )

    if (percentageOption === undefined) {
      return CUSTOM_PERCENTAGE_OPTION
    }

    return percentageOption
  }

  const getPercentage = useCallback(
    (percentageOption: number, customPercentage: number) => {
      if (isCustomPercentageSelected(percentageOption)) {
        return customPercentage
      }

      return percentageOption
    },
    [],
  )

  const initialPercentageOption =
    initialPercentage === undefined
      ? percentageOptions?.[0]
      : getPercentageOption(initialPercentage)

  const [percentageOption, setPercentageOption] = useState(
    initialPercentageOption,
  )

  const initialCustomPercentage = isCustomPercentageSelected(percentageOption)
    ? initialPercentage
    : undefined

  const [customPercentage, setCustomPercentage] = useState(
    initialCustomPercentage ?? 0,
  )

  useEffect(() => {
    const percentage = getPercentage(percentageOption, customPercentage)
    onChange?.(percentage)
  }, [getPercentage, onChange, percentageOption, customPercentage])

  if (!percentageOptions || percentageOptions.length === 0) return null

  const onSelectionChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    handleSelectionChange(Number(value))
  }

  const handleSelectionChange = (percentageOption: number) => {
    setPercentageOption(percentageOption)

    const percentage = getPercentage(percentageOption, customPercentage)

    onChange?.(percentage)
    setCustomPercentage(0)
  }

  const onCustomPercentageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = event?.currentTarget?.value
    const onlyIntegerPercentagePattern = '^[0-9][0-9]?$|^100$'
    const regexp = new RegExp(onlyIntegerPercentagePattern)

    if (value.match(regexp)) {
      setCustomPercentage(Number(value))
      onChange?.(Number(value))
    } else if (value === '') {
      setCustomPercentage(0)
      onChange?.(null)
    }
  }

  return (
    <RadioGroup value={percentageOption} onChange={onSelectionChange}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        alignItems="flex-start"
        borderLeft={`2px solid ${alpha(palette.primary.main, 0.2)}`}
        pr="101.5px"
        pl="40px"
      >
        {percentageOptions.map((percentageOption) => {
          return (
            <FormControlLabel
              key={percentageOption}
              value={percentageOption}
              label={
                <Typography
                  style={{
                    color: palette.primary.main,
                    fontStyle: 'italic',
                    fontWeight: 700,
                  }}
                >
                  {percentageOption}
                  {messages.PERCENTAGE_SIGN}
                </Typography>
              }
              control={<PercentageRadio />}
            />
          )
        })}
        <FormControlLabel
          value={CUSTOM_PERCENTAGE_OPTION}
          control={
            <RadioInputField
              checked={isCustomPercentageSelected(percentageOption)}
              inputValue={customPercentage}
              inputPlaceholder={messages.CUSTOM_PERCENTAGE_INPUT}
              onInputChange={onCustomPercentageChange}
              onFieldClick={handleSelectionChange}
            />
          }
          label=""
        />
      </Box>
    </RadioGroup>
  )
}

export default SlippageSelector
