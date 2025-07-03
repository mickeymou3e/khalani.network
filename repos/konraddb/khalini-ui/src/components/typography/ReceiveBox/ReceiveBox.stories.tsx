import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import ReceiveBox from './ReceiveBox.component'

export default {
  title: 'Components/ReceiveBox',
  description: '',
  component: ReceiveBox,
}

const Template: Story<ComponentProps<typeof ReceiveBox>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <ReceiveBox {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  amount: 50,
  tokenSymbol: 'USDC.eth',
  chainLogo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  additionalData: { amount: 30, tokenSymbol: 'USDC.avax' },
}
