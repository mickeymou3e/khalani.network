import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'
import { tokensWithIcons } from '@tests/tokens'

import TokenPaper from './TokenPaper.component'

export default {
  title: 'Components/TokenPaper',
  description: '',
  component: TokenPaper,
}

const Template: Story<ComponentProps<typeof TokenPaper>> = (args) => {
  return (
    <Paper>
      <Box display="flex">
        <TokenPaper {...args} />
        <TokenPaper {...args} selected={false} />
        <TokenPaper {...args} selected={false} />
        <TokenPaper {...args} selected={false} />
      </Box>
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  operationName: 'Withdraw',
  token: tokensWithIcons[0],
  description: 'of your share',
  selected: true,
  percentage: 50,
}
