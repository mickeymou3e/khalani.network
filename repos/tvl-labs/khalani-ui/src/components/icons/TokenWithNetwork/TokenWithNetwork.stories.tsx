import React, { ComponentProps } from 'react'

import { ENetwork } from '@interfaces/core'
import { Container } from '@mui/material'
import { Story } from '@storybook/react'

import TokenWithNetwork from './TokenWithNetwork.component'

export default {
  title: 'Components/Icons/TokenWithNetwork',
  description: '',
  component: TokenWithNetwork,
}

const Template: Story<ComponentProps<typeof TokenWithNetwork>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <TokenWithNetwork {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  chainId: ENetwork.EthereumSepolia,
  tokenSymbol: 'USDC',
}
