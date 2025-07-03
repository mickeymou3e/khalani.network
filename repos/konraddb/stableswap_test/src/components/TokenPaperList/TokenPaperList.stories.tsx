import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'
import { tokens } from '@tests/tokens'

import TokenPaperList from './TokenPaperList.component'

export default {
  title: 'Components/TokenPaperList',
  description: '',
  component: TokenPaperList,
}

const Template: Story<ComponentProps<typeof TokenPaperList>> = (args) => {
  return (
    <Box display="flex" width={500}>
      <TokenPaperList {...args} />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  operationName: 'Withdraw',
  tokens: tokens,
  percentage: 50,
  description: 'of your share',
}
