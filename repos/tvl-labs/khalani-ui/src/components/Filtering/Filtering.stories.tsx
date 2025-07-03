import React, { ComponentProps, useState } from 'react'

import { IChain, TokenModelBalance } from '@interfaces/core'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Filtering from './Filtering.component'

export default {
  title: 'Components/Filtering',
  description: '',
  component: Filtering,
}

const Template: Story<ComponentProps<typeof Filtering>> = (args) => {
  const [network, setNetwork] = useState<IChain | undefined>()
  const [token, setToken] = useState<TokenModelBalance | undefined>()

  const onChainChange = (chain: IChain) => {
    setNetwork(chain)
  }

  const onTokenChange = (token: TokenModelBalance) => {
    setToken(token)
  }

  return (
    <Container sx={{ mt: 5, width: 500 }}>
      <Paper sx={{ p: 4 }}>
        <Filtering
          {...args}
          chain={network}
          token={token}
          onChainChange={onChainChange}
          onTokenChange={onTokenChange}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokens: [
    {
      id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF420',
      symbol: 'usdc',
      name: 'usdc',
      decimals: 6,
      address: '',
      balance: BigInt('1000000'),
      chainId: '0x41786f6e',
    },
    {
      id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
      symbol: 'dai',
      name: 'dai',
      decimals: 18,
      address: '',
      balance: BigInt('1000000000000000000'),
      chainId: '0xa869',
    },
    {
      id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
      symbol: 'usdt',
      name: 'usdt',
      decimals: 18,
      address: '',
      balance: BigInt('1000000000000000000'),
      chainId: '0xa869',
    },
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
