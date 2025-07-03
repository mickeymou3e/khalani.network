import React, { useState } from 'react'

import GreyButton from '@components/buttons/GreyButton'
import { Paper } from '@mui/material'

import { CustomizedTabsSelector } from './InternalTabsSelector.styled'
import { IInternalTabsSelectorProps } from './InternalTabsSelector.types'

const InternalTabsSelector: React.FC<IInternalTabsSelectorProps> = (props) => {
  const { tabs, onChange, selectedTab } = props

  const [value, setValue] = useState<number | undefined>(selectedTab)

  const handleClick = (newValue: number) => {
    setValue(newValue)
    onChange?.(tabs[newValue].route)
  }

  return (
    <CustomizedTabsSelector>
      <Paper elevation={1} sx={{ display: 'flex', gap: 1, padding: 0.5 }}>
        {tabs.map((tab) => (
          <GreyButton
            key={tab.value}
            onClick={() => handleClick(tab.value)}
            className={tab.value === value ? 'selected' : ''}
            disableRipple
          >
            {tab.label}
          </GreyButton>
        ))}
      </Paper>
    </CustomizedTabsSelector>
  )
}

export default InternalTabsSelector
