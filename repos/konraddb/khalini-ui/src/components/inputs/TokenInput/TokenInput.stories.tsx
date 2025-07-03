import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import TokenInput from './'

export default {
  title: 'Components/Inputs/TokenInput',
  description: '',
  component: TokenInput,
}

const tokens = [
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
  },
]

const Template: Story<ComponentProps<typeof TokenInput>> = (args) => {
  const [amount, setAmount] = useState<BigNumber | undefined>()

  return (
    <Box p={2}>
      <TokenInput
        {...args}
        amount={amount}
        onAmountChange={(amount) => setAmount(amount)}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  token: tokens[0],
  maxAmount: BigNumber.from('100000000000000030000'),
}

export const Error = Template.bind({})

Error.args = {
  token: tokens[0],
  error: 'error message',
  maxAmount: BigNumber.from('100000002000000000000'),
}

export const Loading = Template.bind({})

Loading.args = {
  token: undefined,
  maxAmount: BigNumber.from(0),
  isFetchingMaxAmount: true,
}

export const WithoutMaxAmount = Template.bind({})

WithoutMaxAmount.args = {
  token: tokens[0],
  isFetchingMaxAmount: true,
}
