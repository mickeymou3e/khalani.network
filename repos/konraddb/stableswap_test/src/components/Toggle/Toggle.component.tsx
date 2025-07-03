import React from 'react'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// import { useStyles } from './Toggle.styles'
import { IToggleProps } from './Toggle.types'

const Toggle: React.FC<IToggleProps> = ({
  toggles,
  onToggleChange,
  disabled,
}) => {
  // const classes = useStyles()
  const [selected, setSelected] = React.useState(toggles[0].id)

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
    if (value) {
      setSelected(value)
      onToggleChange?.(value)
    }
  }

  return (
    <ToggleButtonGroup
      exclusive
      // classes={{
      //   root: classes.toggleButtonContainer,
      //   grouped: classes.toggleButtonGrouped,
      // }}
      value={selected}
      onChange={handleChange}
    >
      {toggles.map((toggle) => (
        <ToggleButton
          disabled={disabled}
          key={toggle.id}
          // classes={{
          //   root: classes.toggleButton,
          //   label: classes.toggleButtonLabel,
          //   selected: classes.toggleSelected,
          // }}
          value={toggle.id}
          selected={selected === toggle.id}
        >
          {toggle.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default Toggle
