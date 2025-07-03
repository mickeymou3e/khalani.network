import React, { ComponentProps, useState } from 'react'

import { IChain } from '@interfaces/core'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import ChainSelector from './ChainSelector.component'

export default {
  title: 'Components/Selectors/ChainSelector',
  description: '',
  component: ChainSelector,
}

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

const Template: Story<ComponentProps<typeof ChainSelector>> = (args) => {
  const [originChain, setOriginChain] = useState<IChain>(chains[0])
  const [destinationChain, setDestinationChain] = useState<IChain>(chains[1])

  const handleOriginChainChange = (chain: IChain) => {
    setOriginChain(chain)
  }

  const handleDestinationChainChange = (chain: IChain) => {
    setDestinationChain(chain)
  }

  const handleSwapButtonClick = () => {
    setOriginChain(destinationChain)
    setDestinationChain(originChain)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, width: 600 }}>
      <Paper elevation={2} sx={{ px: 2, py: 10 }}>
        <ChainSelector
          {...args}
          selectedOriginChain={originChain}
          selectedDestinationChain={destinationChain}
          handleOriginChainChange={handleOriginChainChange}
          handleDestinationChainChange={handleDestinationChainChange}
          handleSwapButtonClick={handleSwapButtonClick}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  originChains: chains,
  destinationChains: chains,
}
