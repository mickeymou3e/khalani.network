import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import { StoryObj } from '@storybook/react'

import Header from './Header.component'

export default {
  title: 'Components/Header/Header',
  description: '',
  component: Header,
}

const headerItems = [
  {
    text: 'Trade',
    id: '1',
    pages: [
      {
        href: 'trade/swap',
        id: '2_1',
        linkType: LinkEnum.Internal,
        text: 'Swap',
      },
      {
        href: 'trade/pools',
        id: '2_2',
        linkType: LinkEnum.Internal,
        text: 'Pools',
      },
    ],
  },
  {
    text: 'Lend & Borrow',
    id: '2',
    pages: [
      {
        id: 'Lending-Market',
        href: `link`,
        linkType: LinkEnum.Internal,
        text: 'Market',
      },
      {
        id: 'Lending-Dashboard',
        linkType: LinkEnum.Internal,
        href: `link/dashboard`,
        text: 'Dashboard',
      },
      {
        id: 'Lending-Deposit',
        linkType: LinkEnum.Internal,
        href: `link/deposit`,
        text: 'Deposit',
      },
      {
        id: 'Lending-Borrow',
        linkType: LinkEnum.Internal,
        href: `link/borrow`,
        text: 'Borrow',
      },
    ],
  },
  {
    text: 'Bridge',
    id: '3',
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
    text: 'Test_empty_pages',
    id: '5',
    pages: [],
  },
]

type Story = StoryObj<ComponentProps<typeof Header>>

const Template: Story = { render: (args) => <Header {...args} /> }

export const Basic = { ...Template }

Basic.args = {
  chainId: 71402,
  items: headerItems,
}

Basic.parameters = {
  layout: 'fullscreen',
}

export const Login = { ...Template }

Login.args = {
  items: headerItems,
  chainId: 71402,
  authenticated: true,
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
  isFetchingNativeTokenBalance: true,
  nativeTokenBalance: '666.319905',
}

Login.parameters = {
  layout: 'fullscreen',
}
