import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import { Box, Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import AssetsList from './AssetsList.component'

export default {
  title: 'Components/Tables/AssetsList',
  description: '',
  component: AssetsList,
}

type Story = StoryObj<ComponentProps<typeof AssetsList>>

const Template: Story = {
  render: (args) => (
    <Box pt={2} sx={{ display: 'flex' }}>
      <Box m="auto" sx={{ width: 400 }}>
        <Paper>
          <AssetsList {...args} />
        </Paper>
      </Box>
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  assets: [
    {
      address: '0x123',
      balance: BigNumber.from('600').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('599').mul(BigNumber.from(10).pow(18)),
      decimals: 8,
      symbol: 'USDC',
      symbolDescription: 'USDC coin',
      displayName: 'USDC',
      source: 'ce',
    },

    {
      address: '0x456',
      balance: BigNumber.from('300').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('29999').mul(BigNumber.from(10).pow(16)),
      decimals: 8,
      symbol: 'USDT',
      symbolDescription: 'USDT tether',
      displayName: 'USDT',
      source: 'eth',
    },
  ],
}

export const DifferentLayout = { ...Template }

DifferentLayout.args = {
  assets: [
    {
      address: '0x123',
      balance: BigNumber.from('600').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('599').mul(BigNumber.from(10).pow(18)),
      decimals: 8,
      symbol: 'USDC',
      symbolDescription: 'USDC coin',
      displayName: 'USDC',
      source: 'eth',
    },

    {
      address: '0x456',
      balance: BigNumber.from('300').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('29999').mul(BigNumber.from(10).pow(16)),
      decimals: 8,
      symbol: 'USDT',
      symbolDescription: 'USDT tether',
      displayName: 'USDT',
      source: 'bsc',
    },
  ],
  totalBalanceMessage: 'My pool balance',
  totalBalanceOnTop: true,
}
