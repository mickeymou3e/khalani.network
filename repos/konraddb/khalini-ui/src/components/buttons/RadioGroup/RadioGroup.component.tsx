import React from 'react'

import { FormControl, RadioGroup as MUIRadioGroup } from '@mui/material'

import RadioButton from '../RadioButton'
import { IRadioGroupProps } from './RadioGroup'

const RadioGroup: React.FC<IRadioGroupProps> = ({
  options,
  onOptionChange,
  selected,
  row = true,
}) => {
  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    if (value) {
      onOptionChange?.(value)
    }
  }

  return (
    <FormControl sx={{ width: '100%' }}>
      <MUIRadioGroup row={row} value={selected} onChange={handleChange}>
        {options.map((option) => (
          <RadioButton
            key={option.id}
            value={option.id}
            label={option.name}
            disabled={option?.disabled}
          />
        ))}
      </MUIRadioGroup>
    </FormControl>
  )
}

export default RadioGroup
