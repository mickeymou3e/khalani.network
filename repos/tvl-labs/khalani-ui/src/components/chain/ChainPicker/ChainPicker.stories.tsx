import React, { ComponentProps, useState } from 'react'

import { chains } from '@constants/chains'
import { ENetwork } from '@interfaces/core'
import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import ChainPicker from './ChainPicker.component'
import { ChainPickerItem } from './ChainPicker.types'

export default {
  title: 'Components/Chain/ChainPicker',
  description: '',
  component: ChainPicker,
}

const Template: Story<ComponentProps<typeof ChainPicker>> = (args) => {
  const [selectedChains, setSelectableChains] = useState<ChainPickerItem[]>(
    args.selectedChains,
  )

  const handleChainDelete = (id: number) => {
    setSelectableChains(selectedChains.filter((chain) => chain.id !== id))
  }

  const handleChainSelect = (id: number) => {
    const newChain = chains.find((chain) => chain.id === id)
    if (!newChain) return
    setSelectableChains([
      ...selectedChains,
      { id: newChain.id, name: newChain.chainName },
    ])
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={1} sx={{ py: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ChainPicker
            selectedChains={selectedChains}
            chains={chains}
            buttonClickFn={handleChainDelete}
            chainSelectedFn={handleChainSelect}
          />
        </Box>
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  selectedChains: [
    { id: ENetwork.ArbitrumSepolia, name: 'Arbitrum Goerli' },
    { id: ENetwork.EthereumSepolia, name: 'Ethereum Sepolia' },
  ],
  chains: [
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
  ],
}
