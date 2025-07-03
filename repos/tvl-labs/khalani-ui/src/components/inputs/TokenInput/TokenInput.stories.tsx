import React, { ComponentProps, useState } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

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
    name: 'USDT',
    decimals: 18,
    symbol: 'USDT',
    chainId: '0x1',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    chainId: '0x1',
  },
]

const maxAmount = BigInt('100000000000000030000')

const Template: Story<ComponentProps<typeof TokenInput>> = (args) => {
  const [amount, setAmount] = useState<bigint | undefined>()

  const onSliderChange = (value: number) => {
    console.log(value)
  }

  return (
    <Container sx={{ width: 550, mt: 4 }}>
      <Paper elevation={2} sx={{ py: 5, px: 2 }}>
        <TokenInput
          {...args}
          amount={amount}
          onMaxRequest={() => setAmount(maxAmount)}
          onAmountChange={(amount) => setAmount(amount)}
          onSliderChange={onSliderChange}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  token: tokens[0],
  maxAmount,
}

export const Error = Template.bind({})

Error.args = {
  token: tokens[0],
  error: true,
  maxAmount: BigInt('100000002000000000000'),
}

export const Loading = Template.bind({})

Loading.args = {
  token: undefined,
  maxAmount: BigInt(0),
  isFetchingMaxAmount: true,
}

export const WithoutMaxAmount = Template.bind({})

WithoutMaxAmount.args = {
  token: tokens[0],
  isFetchingMaxAmount: true,
}

export const WithUSDValue = Template.bind({})

WithUSDValue.args = {
  token: tokens[0],
  maxAmount,
  usdAmount: { value: BigInt('1052354543463400000'), decimals: 16 },
}

export const WithSlider = Template.bind({})

WithSlider.args = {
  token: tokens[0],
  maxAmount,
  usdAmount: { value: BigInt('1052354543463400000'), decimals: 16 },
  isSlider: true,
}

export const WithTopLabel = Template.bind({})

WithTopLabel.args = {
  token: tokens[0],
  topLabel: 'Receive on Optimism',
}

export const WithoutTokenButton = Template.bind({})

WithoutTokenButton.args = {
  token: tokens[0],
  maxAmount,
  hideTokenButton: true,
}

export const WithoutMaxButton = Template.bind({})

WithoutMaxButton.args = {
  token: tokens[0],
  maxAmount,
  hideMaxButton: true,
}
