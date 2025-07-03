import React, { ComponentProps } from 'react'

import { avalancheTestnet, khalaniTestnet } from '@constants/chains'
import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import SourceToDestinationChain from './SourceToDestinationChain.component'

export default {
  title: 'Components/Chain/SourceToDestinationChain',
  description: '',
  component: SourceToDestinationChain,
}

const Template: Story<ComponentProps<typeof SourceToDestinationChain>> = (
  args,
) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Paper elevation={3} sx={{ py: 5 }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <SourceToDestinationChain {...args} />
      </Box>
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  sourceChain: avalancheTestnet,
  destinationChain: khalaniTestnet,
}

export const MultipleDestinationChains = Template.bind({})

MultipleDestinationChains.args = {
  sourceChain: avalancheTestnet,
  destinationChain: khalaniTestnet,
  destinationChains: [khalaniTestnet, avalancheTestnet],
}
