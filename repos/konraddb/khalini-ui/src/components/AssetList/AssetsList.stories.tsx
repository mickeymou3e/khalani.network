import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import AssetsList from './AssetsList.component'

export default {
  title: 'Components/Tables/AssetsList',
  description: '',
  component: AssetsList,
}

const Template: Story<ComponentProps<typeof AssetsList>> = (args) => (
  <Box pt={2} sx={{ display: 'flex' }}>
    <Box m="auto" sx={{ width: 400 }}>
      <AssetsList {...args} />
    </Box>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  assets: [
    {
      address: '0x123',
      balance: BigNumber.from('600').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('599').mul(BigNumber.from(10).pow(18)),
      decimals: 8,
      symbol: 'USDC',
      symbolDescription: 'USDC coin',
    },

    {
      address: '0x456',
      balance: BigNumber.from('300').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('29999').mul(BigNumber.from(10).pow(16)),
      decimals: 8,
      symbol: 'USDT',
      symbolDescription: 'USDT tether',
    },
  ],
}

export const DifferentLayout = Template.bind({})

DifferentLayout.args = {
  assets: [
    {
      address: '0x123',
      balance: BigNumber.from('600').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('599').mul(BigNumber.from(10).pow(18)),
      decimals: 8,
      symbol: 'USDC',
      symbolDescription: 'USDC coin',
    },

    {
      address: '0x456',
      balance: BigNumber.from('300').mul(BigNumber.from(10).pow(8)),
      balanceInDollars: BigNumber.from('29999').mul(BigNumber.from(10).pow(16)),
      decimals: 8,
      symbol: 'USDT',
      symbolDescription: 'USDT tether',
    },
  ],
  totalBalanceMessage: 'My pool balance',
  totalBalanceOnTop: true,
}
