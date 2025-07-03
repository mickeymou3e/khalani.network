import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import MaxAmountSelector from './'

export default {
  title: 'Components/MaxAmountSelector',
  description: '',
  component: MaxAmountSelector,
}

const Template: Story<ComponentProps<typeof MaxAmountSelector>> = (args) => (
  <Box p={3} display="flex" justifyContent="center" alignItems="center">
    <MaxAmountSelector {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  decimals: 18,
  maxAmount: BigNumber.from('100000000000000000000'),
  isFetchingMaxAmount: false,
}
