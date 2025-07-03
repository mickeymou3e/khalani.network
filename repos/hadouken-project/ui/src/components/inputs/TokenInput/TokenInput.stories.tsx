import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

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
    displayName: 'DAI',
    source: 'eth',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    displayName: 'USDC',
    source: 'bsc',
  },
]

type Story = StoryObj<ComponentProps<typeof TokenInput>>

const Template: Story = {
  render: (args) => {
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
  },
}

export const Basic = { ...Template }

Basic.args = {
  token: tokens[0],
  maxAmount: BigNumber.from('100000000000000030000'),
  disabled: false,
  maxInputDisabled: false,
}

export const Error = { ...Template }

Error.args = {
  token: tokens[0],
  error: 'error message',
  maxAmount: BigNumber.from('100000002000000000000'),
  disabled: false,
  maxInputDisabled: false,
}

export const Loading = { ...Template }

Loading.args = {
  token: undefined,
  maxAmount: BigNumber.from(0),
  isFetchingMaxAmount: true,
  disabled: false,
  maxInputDisabled: false,
}

export const WithoutMaxAmount = { ...Template }

WithoutMaxAmount.args = {
  token: tokens[0],
  isFetchingMaxAmount: true,
}
