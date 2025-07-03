import React, { ComponentProps, useState } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

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
    symbol: 'BUSD.bsc',
    chainId: '0x5',
    balance: BigInt(0),
  },
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'DAI',
    decimals: 16,
    symbol: 'DAI',
    chainId: '0x5',
    balance: BigInt(0),
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'USDC',
    decimals: 6,
    symbol: 'USDC',
    chainId: '0x5',
    balance: BigInt(0),
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
    name: 'USDT',
    decimals: 6,
    symbol: 'USDT',
    chainId: '0x5',
    balance: BigInt(0),
  },
]

const Template: Story<ComponentProps<typeof TokenSelectorInput>> = (args) => {
  const [amount, setAmount] = useState<bigint | undefined>()
  const [token, setToken] = useState(args.selectedToken)

  return (
    <Container sx={{ width: 550, mt: 4 }}>
      <Paper elevation={2} sx={{ py: 5, px: 2 }}>
        <TokenSelectorInput
          {...args}
          amount={amount}
          selectedToken={token}
          onAmountChange={(amount) => setAmount(amount)}
          onTokenChange={(token) => setToken(token)}
          error={false}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokens: tokens,
  disabled: false,
  selectedToken: tokens[0],
  maxAmount: BigInt(12511000152),
}

export const Fetching = Template.bind({})

Fetching.args = {
  tokens: [],
  disabled: false,
  selectedToken: undefined,
}

export const Disabled = Template.bind({})

Disabled.args = {
  tokens: tokens,
  selectedToken: tokens[0],
  disabled: true,
}
