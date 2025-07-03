import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react'

import TokenWithBackground from './TokenWithBackground.component'

export default {
  title: 'Components/Icons/TokenWithBackground',
  description: '',
  component: TokenWithBackground,
}

const Template: Story<ComponentProps<typeof TokenWithBackground>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <TokenWithBackground {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbol: 'USDC',
}
