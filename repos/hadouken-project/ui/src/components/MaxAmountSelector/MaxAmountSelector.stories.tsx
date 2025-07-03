import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import MaxAmountSelector from './'

export default {
  title: 'Components/MaxAmountSelector',
  description: '',
  component: MaxAmountSelector,
}

type Story = StoryObj<ComponentProps<typeof MaxAmountSelector>>

const Template: Story = {
  render: (args) => (
    <Box p={3} display="flex" justifyContent="center" alignItems="center">
      <MaxAmountSelector {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  decimals: 18,
  maxAmount: BigNumber.from('100000000000000000000'),
  isFetchingMaxAmount: false,
}
