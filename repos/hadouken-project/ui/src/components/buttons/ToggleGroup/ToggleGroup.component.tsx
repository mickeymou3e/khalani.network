import React from 'react'

import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { IToggleGroupProps } from './ToggleGroup.types'

const ToggleGroup: React.FC<IToggleGroupProps> = ({
  toggles,
  onToggleChange,
  selected,
  disabled,
  ...rest
}) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
    if (value) {
      onToggleChange?.(value)
    }
  }

  return (
    <ToggleButtonGroup
      exclusive
      value={selected}
      onChange={handleChange}
      disabled={disabled}
      {...rest}
    >
      {toggles.map((toggle) => (
        <ToggleButton
          sx={{ width: '100%' }}
          key={toggle.id}
          value={toggle.id}
          disabled={toggle.disabled}
        >
          {toggle.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default ToggleGroup
