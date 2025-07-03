import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import TradeRoute from './TradeRoute.component'

export default {
  title: 'Components/TradeRoute',
  description: '',
  component: TradeRoute,
}

type Story = StoryObj<ComponentProps<typeof TradeRoute>>

const Template: Story = {
  render: (args) => (
    <Paper>
      <TradeRoute {...args} />
    </Paper>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'usdt',
    decimals: 18,
    symbol: 'usdt',
    balance: '20000',
    displayName: 'usdt',
    source: 'eth',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
    displayName: 'USDC',
    source: 'eth',
  },
  inTokenValue: '10',
  outTokenValue: '2',
  routes: [
    {
      pools: [
        {
          id: '0x1234567653',
          name: 'Boosted USD',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'usdt',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
          ],
        },
        {
          id: '0x8930281',
          name: 'TriCrypto',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'hdk-boosted-usd',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'hdk-heth-eth',
            },
            {
              id: '0xA600236A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'hdk-hckb-ckb',
            },
          ],
        },
      ],
      percentage: '100.00',
    },
  ],
  poolsWithSortedTokens: {
    ['0x1234567653']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },
    ['0x8930281']: {
      name: 'TriCrypto',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'hdk-boosted-usd',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-heth-eth',
        },
        {
          id: '0xA600236A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-hckb-ckb',
        },
      ],
      displayPoolIcon: false,
      symbol: '',
    },
  },
}

export const TwoTokenPair = { ...Template }

TwoTokenPair.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
    balance: '20000',
    displayName: 'DAI',
    source: 'eth',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
    displayName: 'USDC',
    source: 'eth',
  },
  inTokenValue: '10',
  outTokenValue: '2',
  routes: [
    {
      pools: [
        {
          id: '0x1234567653',
          name: 'power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x123456765321',
          name: 'super power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF418',
              symbol: 'eth',
            },
          ],
        },
        {
          id: '0x1234567653456',
          name: 'weak pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x12345676530988',
          name: 'medium pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
          ],
        },
      ],
      percentage: '20.00',
    },
    {
      pools: [
        {
          id: '0x1234567653456',
          name: 'weak pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x12345676530988',
          name: 'medium pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
          ],
        },
      ],
      percentage: '20.00',
    },
  ],
  poolsWithSortedTokens: {
    ['0x1234567653']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },
    ['0x12345676530988']: {
      name: 'medium pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },

    ['0x1234567653456']: {
      name: 'weak pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },

    ['0x123456765321']: {
      name: 'super power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },

    ['0x8930281']: {
      name: 'TriCrypto',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'hdk-boosted-usd',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-heth-eth',
        },
        {
          id: '0xA600236A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-hckb-ckb',
        },
      ],
      displayPoolIcon: false,
      symbol: '',
    },
  },
}

export const MultiRoot = { ...Template }

MultiRoot.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
    balance: '20000',
    displayName: 'DAI',
    source: 'eth',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
    displayName: 'USDC',
    source: 'eth',
  },
  inTokenValue: '10',
  outTokenValue: '2',
  routes: [
    {
      pools: [
        {
          id: '0x1234567653',
          name: 'power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'ckb',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x123456765321',
          name: 'super power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF418',
              symbol: 'eth',
            },
          ],
        },
        {
          id: '0x1234567653456',
          name: 'weak pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x12345676530988',
          name: 'medium pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
          ],
        },
      ],
      percentage: '20.00',
    },
    {
      pools: [
        {
          id: '0x1234567653',
          name: 'power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x123456765321',
          name: 'super power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'HDK-LNR-USDC',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF418',
              symbol: 'eth',
            },
          ],
        },

        {
          id: '0x12345676530988',
          name: 'medium pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
          ],
        },
      ],
      percentage: '20.00',
    },
    {
      pools: [
        {
          id: '0x1234567653',
          name: 'power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
        {
          id: '0x123456765321',
          name: 'super power pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF417',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF418',
              symbol: 'eth',
            },
          ],
        },
        {
          id: '0x1234567653456',
          name: 'weak pool',
          tokens: [
            {
              id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
              symbol: 'dai',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
              symbol: 'usdc',
            },
            {
              id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF419',
              symbol: 'usdt',
            },
          ],
        },
      ],
      percentage: '20.00',
    },
  ],
  poolsWithSortedTokens: {
    ['0x1234567653']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },
    ['0x1234567653456']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },
    ['0x12345676530988']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },

    ['0x123456765321']: {
      name: 'power pool',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'usdt',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'usdc',
        },
      ],
      symbol: 'HDK-BOOSTED-USD',
      displayPoolIcon: true,
    },
    ['0x8930281']: {
      name: 'TriCrypto',
      tokens: [
        {
          id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
          symbol: 'hdk-boosted-usd',
        },
        {
          id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-heth-eth',
        },
        {
          id: '0xA600236A67c5BaedCDb4bEA2696Ff51fE72cF419',
          symbol: 'hdk-hckb-ckb',
        },
      ],
      displayPoolIcon: false,
      symbol: '',
    },
  },
}
