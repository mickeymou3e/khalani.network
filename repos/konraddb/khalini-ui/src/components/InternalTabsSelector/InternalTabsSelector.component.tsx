import React, { useState } from 'react'

import { Box, Tab, Tabs } from '@mui/material'

import { IInternalTabsSelectorProps } from './InternalTabsSelector.types'

const InternalTabsSelector: React.FC<IInternalTabsSelectorProps> = (props) => {
  const { tabs, onChange, selectedTab } = props
  const [value, setValue] = useState<number | undefined>(selectedTab)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    onChange?.(tabs[newValue].route)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        textColor="secondary"
        indicatorColor="secondary"
        value={value}
        onChange={handleChange}
      >
        {tabs.map((tab) => (
          <Tab label={tab.label} key={tab.value} />
        ))}
      </Tabs>
    </Box>
  )
}

export default InternalTabsSelector
