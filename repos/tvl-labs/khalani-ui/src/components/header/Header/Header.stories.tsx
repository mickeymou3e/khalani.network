import React, { ComponentProps, useState } from 'react'

import { LinkEnum } from '@components/Link'
import { HyperstreamLogo } from '@components/icons'
import { chains } from '@constants/chains'
import { IChain } from '@interfaces/core'
import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import Header from './Header.component'

export default {
  title: 'Components/Header/Header',
  description: '',
  component: Header,
}

const headerItems = [
  {
    text: 'Mint / Reedem',
    id: '1',
    pages: [
      {
        href: '4_2',
        id: '4_2',
        linkType: LinkEnum.Internal,
        text: 'Mint / Reedem',
      },
    ],
  },
  {
    text: 'Bridge',
    id: '2',
    pages: [
      {
        href: '4_2',
        id: '4_2',
        linkType: LinkEnum.Internal,
        text: 'Bridge',
      },
    ],
  },
  {
    text: 'Liquidity',
    id: '3',
    pages: [
      {
        href: '4_2',
        id: '4_2',
        linkType: LinkEnum.Internal,
        text: 'Liquidity',
      },
    ],
  },
]

const Template: Story<ComponentProps<typeof Header>> = (args) => {
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(
    args.selectedChainId,
  )

  const handleChainSelect = (chain: IChain) => setSelectedChainId(chain.id)
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #280773 0%, #4B0ED9 100%)',
        paddingBottom: '200px',
      }}
    >
      <Header
        {...args}
        selectedChainId={selectedChainId}
        onChainSelect={handleChainSelect}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  items: headerItems,
  currentTabId: '1',
  showConnectWalletButton: true,
  onHomeClick: () => console.log('home click handled'),
}

export const WithHyperstreamLogo = Template.bind({})

WithHyperstreamLogo.args = {
  items: headerItems,
  currentTabId: '1',
  showConnectWalletButton: true,
  onHomeClick: () => console.log('home click handled'),
  headerLogo: <HyperstreamLogo />,
}

export const Login = Template.bind({})

Login.args = {
  ...Basic.args,
  selectedChainId: 43113,
  chains: chains,
  authenticated: true,
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
}

export const UnsupportedNetwork = Template.bind({})

UnsupportedNetwork.args = {
  ...Basic.args,
  selectedChainId: undefined,
  chains: chains,
  authenticated: false,
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
  isUnsupportedNetwork: true,
}
