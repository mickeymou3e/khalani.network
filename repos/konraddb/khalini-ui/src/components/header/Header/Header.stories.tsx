import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import { Story } from '@storybook/react/types-6-0'

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

const Template: Story<ComponentProps<typeof Header>> = (args) => (
  <Header {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  chainId: 71402,
  items: headerItems,
}

export const Login = Template.bind({})

Login.args = {
  items: headerItems,
  chainId: 71402,
  authenticated: true,
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
  isFetchingNativeTokenBalance: true,
  nativeTokenBalance: '666.319905',
}
