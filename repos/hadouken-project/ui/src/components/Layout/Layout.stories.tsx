import React, { ComponentProps } from 'react'

import Header from '@components/header/Header'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import Layout from './Layout.component'

export default {
  title: 'Components/Layout',
  description: '',
  component: Layout,
}

type Story = StoryObj<ComponentProps<typeof Layout>>

const Template: Story = {
  render: () => (
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
  ),
}

export const Basic = { ...Template }

Basic.args = {}
