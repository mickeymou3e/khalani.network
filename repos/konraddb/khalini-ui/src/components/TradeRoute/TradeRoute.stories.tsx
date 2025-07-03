import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import TradeRoute from './TradeRoute.component'

export default {
  title: 'Components/TradeRoute',
  description: '',
  component: TradeRoute,
}

const Template: Story<ComponentProps<typeof TradeRoute>> = (args) => (
  <Paper>
    <TradeRoute {...args} />
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
    balance: '20000',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
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
          ],
        },
      ],
      percentage: '100.00',
    },
  ],
}

export const TwoTokenPair = Template.bind({})

TwoTokenPair.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
    balance: '20000',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
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
}

export const MultiRoot = Template.bind({})

MultiRoot.args = {
  inToken: {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'dai',
    decimals: 18,
    symbol: 'dai',
    balance: '20000',
  },
  outToken: {
    id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
    name: 'usdc',
    decimals: 6,
    symbol: 'usdc',
    balance: '10000000',
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
}
