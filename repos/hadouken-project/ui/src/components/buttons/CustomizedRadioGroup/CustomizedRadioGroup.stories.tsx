import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import CustomizedRadioGroup from './CustomizedRadioGroup.component'

export default {
  title: 'Components/Buttons/CustomizedRadioGroup',
  description: '',
  component: CustomizedRadioGroup,
}

type Story = StoryObj<ComponentProps<typeof CustomizedRadioGroup>>

const Template: Story = {
  render: (args) => {
    const [, setSlippage] = useState(BigNumber.from(1000))

    return (
      <>
        <Paper>
          <CustomizedRadioGroup
            {...args}
            onSlippageChange={setSlippage}
            buttonLabel="Custom amount"
          />
        </Paper>
      </>
    )
  },
}

export const Basic = { ...Template }
Basic.args = {
  maxValue: BigNumber.from(1000000),
  decimals: 4,
}

const ControlledTemplate: Story = {
  render: ({ value }) => {
    const [slippage, setSlippage] = useState(BigNumber.from(value))

    const onChange = (value: BigNumber) => {
      setSlippage(value)
    }

    return (
      <>
        <Paper>
          <CustomizedRadioGroup
            value={slippage}
            onSlippageChange={onChange}
            buttonLabel="Custom amount"
          />
        </Paper>
      </>
    )
  },
}

export const Controlled = { ...ControlledTemplate }

Controlled.args = {
  value: BigNumber.from(10000),
  maxValue: BigNumber.from(1000000),
  decimals: 4,
}

export const WithDifferentDecimals = { ...Template }

WithDifferentDecimals.args = {
  decimals: 2,
}
