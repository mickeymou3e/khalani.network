import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import ChainHeader from './ChainHeader.component'

export default {
  title: 'Components/chain/ChainHeader',
  description: '',
  component: ChainHeader,
}

const Template: Story<ComponentProps<typeof ChainHeader>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <ChainHeader {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  expectedChain: {
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
}
