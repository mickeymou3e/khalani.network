import React, { ComponentProps } from 'react'

import {
  LpTokenBoostedIcon,
  UsdcIcon,
  UsdcLinearIcon,
  UsdtIcon,
  UsdtLinearIcon,
} from '@components/icons/tokens'
import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import IconStackView from './IconStackView.component'

export default {
  title: 'Components/IconStackView',
  description: '',
  component: IconStackView,
}

type Story = StoryObj<ComponentProps<typeof IconStackView>>

const Template: Story = {
  render: (args) => (
    <Box p={3} width={350}>
      <IconStackView {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  mainIcon: {
    icon: <UsdcIcon style={{ height: 40, width: 40 }} />,
    id: '1',
    text: 'USDC-a-USDT',
  },
  icons: [
    {
      icon: <UsdcIcon style={{ height: 40, width: 40 }} />,
      id: '1',
      text: 'Force Bridge USDC from Ethereum',
    },
    {
      icon: <UsdtIcon style={{ height: 40, width: 40 }} />,
      id: '2',
      text: 'USDT',
    },
  ],
}

export const NestedLinearPools = { ...Template }

NestedLinearPools.args = {
  mainIcon: {
    icon: <LpTokenBoostedIcon style={{ height: 40, width: 40 }} />,
    id: '1',
    text: 'HDK Boosted USD',
  },
  icons: [
    {
      icon: <UsdcLinearIcon style={{ height: 40, width: 40 }} />,
      id: '1',
      text: 'USDC Linear Pool',
      subIcons: [
        {
          icon: <UsdcIcon style={{ height: 30, width: 30 }} />,
          id: '1',
          text: 'USDC',
        },
        {
          icon: <UsdcIcon style={{ height: 30, width: 30 }} />,
          id: '1',
          text: 'Wrapped hUSDC',
        },
      ],
    },
    {
      icon: <UsdtLinearIcon style={{ height: 40, width: 40 }} />,
      id: '2',
      text: 'USDT Linear Pool',
      subIcons: [
        {
          icon: <UsdtIcon style={{ height: 30, width: 30 }} />,
          id: '1',
          text: 'USDC',
        },
        {
          icon: <UsdtIcon style={{ height: 30, width: 30 }} />,
          id: '1',
          text: 'Wrapped hUSDT',
        },
      ],
    },
  ],
}
