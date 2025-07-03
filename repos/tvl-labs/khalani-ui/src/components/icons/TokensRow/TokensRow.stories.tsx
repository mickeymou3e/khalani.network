import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TokensRow from './TokensRow.component'

export default {
  title: 'Components/Icons/TokensRow',
  description: '',
  component: TokensRow,
}

const Template: Story<ComponentProps<typeof TokensRow>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Paper sx={{ p: 4 }}>
      <TokensRow {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbols: ['USDC', 'USDT', 'DAI', 'KAI'],
}
