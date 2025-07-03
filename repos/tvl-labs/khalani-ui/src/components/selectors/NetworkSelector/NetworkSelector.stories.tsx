import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story, Meta } from '@storybook/react'

import NetworkSelector from './NetworkSelector.component'

export default {
  title: 'Components/Selectors/NetworkSelector',
  component: NetworkSelector,
} as Meta

const chains = [
  {
    id: 43113,
    chainName: 'Avalanche Testnet',
    chainId: '0xa869',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    blockExplorerUrls: ['https://testnet.snowtrace.io'],
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    logo: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
    borderColor: '#CC3333',
    poolTokenSymbol: 'USDC.avax',
  },
  {
    id: 1098411886,
    chainName: 'Khalani',
    chainId: '0x41786f6e',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
    rpcUrls: ['https://www.axon-node.info'],
    logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
    borderColor: '#228c22',
  },
]

const Template: Story<ComponentProps<typeof NetworkSelector>> = (args) => {
  return (
    <Container maxWidth="md" sx={{ mt: 5, width: 500 }}>
      <Paper elevation={2} sx={{ px: 2, py: 10 }}>
        <NetworkSelector {...args} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  chains,
}
