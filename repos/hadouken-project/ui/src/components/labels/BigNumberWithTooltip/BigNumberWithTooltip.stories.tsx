import React, { ComponentProps } from 'react'

import { BigNumber } from 'ethers'

import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import BigNumberWithTooltip from './BigNumberWithTooltip.component'

export default {
  title: 'Components/labels/BigNumberWithTooltip',
  description: '',
  component: BigNumberWithTooltip,
}

type Story = StoryObj<ComponentProps<typeof BigNumberWithTooltip>>

const Template: Story = {
  render: (args) => (
    <Box p={2}>
      <BigNumberWithTooltip {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  value: BigNumber.from(100),
}

export const OtherValue = { ...Template }

OtherValue.args = {
  value: BigNumber.from(11199999999),
  decimals: 8,
  roundingDecimals: 4,
}

export const WithDollars = { ...Template }

WithDollars.args = {
  value: BigNumber.from(111199999999),
  decimals: 8,
  showDollars: true,
  roundingDecimals: 4,
}

export const anotherCase = { ...Template }

anotherCase.args = {
  value: BigNumber.from(111111),
  decimals: 8,
  showDollars: true,
  roundingDecimals: 3,
}

export const lessThenSupport = { ...Template }

lessThenSupport.args = {
  value: BigNumber.from(111),
  decimals: 6,
  showDollars: true,
  roundingDecimals: 3,
}

export const roundingTest = { ...Template }

roundingTest.args = {
  value: BigNumber.from(1000000),
  decimals: 6,
  showDollars: true,
  roundingDecimals: 3,
}
