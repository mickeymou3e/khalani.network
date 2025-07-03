import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import { DaiIcon, UsdcIcon, UsdtIcon } from '@components/icons'
import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import TokenSelectorInput from './TokenSelectorInput.component'

export default {
  title: 'Components/Inputs/TokenSelectorInput',
  description: '',
  component: TokenSelectorInput,
}

const tokens = [
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF420',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF420',
    name: 'Wrapped BUSD (ForceBridge from BSC)',
    decimals: 6,
    symbol: 'BUSD|bsc',
    balance: BigNumber.from('1001001000000000000'),
  },
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'DAI',
    decimals: 88,
    symbol: 'DAI',
    balance: BigNumber.from('10000000100000000000'),
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'USDC',
    decimals: 6,
    symbol: 'USDC',
    balance: BigNumber.from('10000000000000000000000000000'),
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
    name: 'USDT',
    decimals: 6,
    symbol: 'USDT',
    balance: BigNumber.from('10000000000'),
  },
]

const Template: Story<ComponentProps<typeof TokenSelectorInput>> = (args) => {
  const [amount, setAmount] = useState<BigNumber | undefined>()
  const [token, setToken] = useState(tokens[0])

  return (
    <Paper sx={{ padding: 2 }}>
      <TokenSelectorInput
        {...args}
        amount={amount}
        selectedToken={token}
        onAmountChange={(amount) => setAmount(amount)}
        onTokenChange={(token) => setToken(token)}
        error={
          amount && amount > BigNumber.from('500')
            ? 'You need to deposit minimum 400 CKB'
            : undefined
        }
      />
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokens: tokens,
  disabled: false,
}

export const Fetching = Template.bind({})

Fetching.args = {
  tokens: tokens,
  isFetching: true,
  disabled: false,
}

const TemplateSmall: Story<ComponentProps<typeof TokenSelectorInput>> = (
  args,
) => {
  const [amount, setAmount] = useState<BigNumber | undefined>()
  const [token, setToken] = useState(tokens[0])

  return (
    <Box width={616} p={3} m={2} border="1px black solid">
      <TokenSelectorInput
        {...args}
        amount={amount}
        selectedToken={token}
        onAmountChange={(amount) => setAmount(amount)}
        onTokenChange={(token) => setToken(token)}
        error={
          amount && amount > BigNumber.from('500')
            ? 'You need to deposit minimum 400 CKB'
            : undefined
        }
      />
    </Box>
  )
}

export const SmallWitCustomIcon = TemplateSmall.bind({})

SmallWitCustomIcon.args = {
  tokens: [
    ...tokens,
    {
      address: '0x3',
      balance: BigNumber.from(0),
      symbol: 'ALL',
      decimals: 18,
      id: '222',
      name: 'ALL',
      icon: (
        <Box display="flex">
          <DaiIcon />
          <UsdcIcon />
          <UsdtIcon />
        </Box>
      ),
    },
  ],
  disabled: false,
}
