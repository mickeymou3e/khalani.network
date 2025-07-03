import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react'

import CustomizedRadioGroup from './CustomizedRadioGroup.component'

export default {
  title: 'Components/Buttons/CustomizedRadioGroup',
  description: '',
  component: CustomizedRadioGroup,
}

const Template: Story<ComponentProps<typeof CustomizedRadioGroup>> = (args) => {
  const [, setSlippage] = useState(BigInt(1000))

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
  maxValue: BigInt(1000000),
  decimals: 4,
}

const ControlledTemplate: Story<
  ComponentProps<typeof CustomizedRadioGroup>
> = ({ value }) => {
  const [slippage, setSlippage] = useState(BigInt(value))

  const onChange = (value: bigint) => {
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
  value: BigInt(10000),
  maxValue: BigInt(1000000),
  decimals: 4,
}

export const WithDifferentDecimals = Template.bind({})

WithDifferentDecimals.args = {
  decimals: 2,
}
