import React, { ComponentProps } from 'react'

import { ENetwork } from '@interfaces/core'
import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import ChainChip from './ChainChip.component'

export default {
  title: 'Components/Chain/ChainChip',
  description: '',
  component: ChainChip,
}

const Template: Story<ComponentProps<typeof ChainChip>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper elevation={3} sx={{ py: 5 }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <ChainChip {...args} />
      </Box>
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  chainId: ENetwork.Ethereum,
  chainName: 'Ethereum',
}

export const WithCloseButton = Template.bind({})

WithCloseButton.args = {
  chainId: ENetwork.Ethereum,
  chainName: 'Ethereum',
  withCloseButton: true,
}
