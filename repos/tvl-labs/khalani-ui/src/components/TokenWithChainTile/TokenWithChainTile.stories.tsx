import React, { ComponentProps } from 'react'

import { ENetwork } from '@interfaces/core'
import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react'

import TokenWithChainTile from './TokenWithChainTile.component'

export default {
  title: 'Components/TokenWithChainTile',
  description: '',
  component: TokenWithChainTile,
}

const handleClick = (poolId: string) => {
  console.log(poolId)
}

const Template: Story<ComponentProps<typeof TokenWithChainTile>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center" width={330}>
      <TokenWithChainTile {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  poolTokensSymbols: ['USDT'],
  chainId: ENetwork.Avalanche,
  userPoolTokenBalanceUSD: '1.25',
  liquidity: BigInt('212534512312400000000'),
  volume: BigInt('312353245345124000000'),
  poolId: '0x150ad35zv052addas435gf',
  apr: '0.51',
  onClick: handleClick,
}
