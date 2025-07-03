import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'
import { tokens } from '@tests/tokens'

import TokenBar from './TokenBar.component'

export default {
  title: 'Components/TokenBar',
  description: '',
  component: TokenBar,
}

const Template: Story<ComponentProps<typeof TokenBar>> = (args) => {
  return (
    <Box display="flex" width={500}>
      <TokenBar {...args} />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  symbol: tokens[0].symbol,
  percentage: 52.33,
}
