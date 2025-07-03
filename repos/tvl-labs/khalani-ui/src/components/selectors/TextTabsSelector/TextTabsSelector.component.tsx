import React, { useState } from 'react'

import { Box, Typography } from '@mui/material'

import { ITextTabsSelectorProps } from './TextTabsSelector.types'

const TextTabsSelector: React.FC<ITextTabsSelectorProps> = (props) => {
  const { tabs, onChange, selectedTab } = props

  const [value, setValue] = useState<number | undefined>(selectedTab)

  const handleClick = (newValue: number) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <Box display="flex" gap={2}>
      {tabs.map((tab) => (
        <Typography
          color={tab.value === value ? 'text.secondary' : 'text.primary'}
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          variant="button"
          sx={{ cursor: 'pointer' }}
        >
          {tab.label}
        </Typography>
      ))}
    </Box>
  )
}

export default TextTabsSelector
