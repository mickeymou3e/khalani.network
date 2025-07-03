import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import ChainSelector from './ChainSelector.component'

export default {
  title: 'Components/chain/ChainSelector',
  description: '',
  component: ChainSelector,
}

const Template: Story<ComponentProps<typeof ChainSelector>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <ChainSelector {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'Origin chain',
  selectedChain: {
    id: 5,
    chainName: 'Ethereum Goerli',
    chainId: '0x5',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'GoerliETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    logo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
    borderColor: '#808080',
    isDefault: true,
    poolTokenSymbol: 'USDC.eth',
  },
  chains: [
    {
      id: 5,
      chainName: 'Ethereum Goerli',
      chainId: '0x5',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'GoerliETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.etherscan.io'],
      rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      logo: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
      borderColor: '#808080',
      isDefault: true,
      poolTokenSymbol: 'USDC.eth',
    },
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
      id: 71401,
      chainName: 'Godwoken Testnet',
      chainId: '0x116e9',
      nativeCurrency: {
        name: 'CKB',
        symbol: 'pCKB',
        decimals: 18,
      },
      blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
      rpcUrls: ['https://godwoken-testnet-v1.ckbapp.dev'],
      logo:
        'https://pbs.twimg.com/profile_images/1574457602322243584/DPhcGeDA_400x400.jpg',
      borderColor: '#ffffff',
    },
    {
      id: 10012,
      chainName: 'Axon',
      chainId: '0x271c',
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
  handleChainClick: () => true,
}
