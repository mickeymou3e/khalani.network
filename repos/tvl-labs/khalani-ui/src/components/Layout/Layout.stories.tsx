import React, { ComponentProps } from 'react'

import Header from '@components/header/Header'
import { chains } from '@constants/chains'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import Layout from './Layout.component'

export default {
  title: 'Components/Layout',
  description: '',
  component: Layout,
}

const Template: Story<ComponentProps<typeof Layout>> = () => (
  <>
    <Header
      selectedChainId={chains[0].id}
      chains={chains}
      RouterLink={Box}
      items={[
        {
          text: 'Lending',
          id: '1',
          pages: [],
        },
        {
          text: 'Lending',
          id: '1',
          pages: [],
        },
      ]}
      currentTabId="1"
      onChainSelect={() => true}
      showConnectWalletButton
    />
    <Layout>
      <Box>TEST TEST TEST</Box>
    </Layout>
  </>
)

export const Basic = Template.bind({})

Basic.args = {}
