import React, { ComponentProps } from 'react'

import Header from '@components/header/Header'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import Layout from './Layout.component'

export default {
  title: 'Components/Layout',
  description: '',
  component: Layout,
}

const Template: Story<ComponentProps<typeof Layout>> = () => (
  <>
    <Header
      chainId={0x1}
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
    />
    <Layout>
      <Box>TEST TEST TEST</Box>
    </Layout>
  </>
)

export const Basic = Template.bind({})

Basic.args = {}
