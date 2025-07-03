import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import CustomizedRadioGroup from './CustomizedRadioGroup.component'

export default {
  title: 'Components/Buttons/CustomizedRadioGroup',
  description: '',
  component: CustomizedRadioGroup,
}

const Template: Story<ComponentProps<typeof CustomizedRadioGroup>> = (args) => {
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
}

export const Basic = Template.bind({})
Basic.args = {
  maxValue: BigNumber.from(1000000),
  decimals: 4,
}

const ControlledTemplate: Story<
  ComponentProps<typeof CustomizedRadioGroup>
> = ({ value }) => {
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
}

export const Controlled = ControlledTemplate.bind({})

Controlled.args = {
  value: BigNumber.from(10000),
  maxValue: BigNumber.from(1000000),
  decimals: 4,
}

export const WithDifferentDecimals = Template.bind({})

WithDifferentDecimals.args = {
  decimals: 2,
}
