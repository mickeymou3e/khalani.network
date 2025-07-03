import React, { ComponentProps, useState } from 'react'

import { TokenModel } from '@interfaces/core'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TokenSelector from './TokenSelector.component'

export default {
  title: 'Components/Selectors/TokenSelector',
  description: '',
  component: TokenSelector,
}

const tokens = [
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF420',
    symbol: 'BUSD',
    name: 'BUSD',
    decimals: 6,
    address: '',
    chainId: '0x41786f6e',
  },
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    symbol: 'DAI',
    name: 'DAI',
    decimals: 18,
    address: '',
    chainId: '0xa869',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 18,
    address: '',
    chainId: '0xa869',
  },
]

const Template: Story<ComponentProps<typeof TokenSelector>> = (args) => {
  const [selectedToken, setSelectedToken] = useState<TokenModel>(tokens[0])

  const handleTokenChange = (token: TokenModel) => {
    setSelectedToken(token)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, width: 600 }}>
      <Paper elevation={2} sx={{ px: 2, py: 10 }}>
        <TokenSelector
          {...args}
          selectedToken={selectedToken}
          handleTokenChange={handleTokenChange}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokens,
}
