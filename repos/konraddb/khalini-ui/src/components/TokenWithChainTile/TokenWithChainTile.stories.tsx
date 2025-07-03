import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import TokenWithChainTile from './TokenWithChainTile.component'

export default {
  title: 'Components/TokenWithChainTile',
  description: '',
  component: TokenWithChainTile,
}

const Template: Story<ComponentProps<typeof TokenWithChainTile>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <TokenWithChainTile {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  chainLogo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  tokenName: 'USDC.eth',
  amount: 300000,
}
