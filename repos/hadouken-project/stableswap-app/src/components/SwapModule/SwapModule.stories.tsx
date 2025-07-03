import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'
import { BigDecimal } from '@utils/math'

import SwapModule from './SwapModule.component'
import { ISwapModuleProps } from './SwapModule.types'

export default {
  title: 'Components/SwapModule',
  description: '',
  component: SwapModule,
}

const Template: Story<ComponentProps<typeof SwapModule>> = (args) => {
  return <SwapModule {...args} />
}

export const Basic = Template.bind({})

const args: ISwapModuleProps = {
  tokens: [
    {
      id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
      address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
      name: 'et',
      decimals: 18,
      symbol: 'dai',
      balance: BigDecimal.from(10),
      displayName: 'dai',
    },
    {
      id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f519',
      address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f519',
      name: 'usdc',
      decimals: 6,
      symbol: 'usdc',
      balance: BigDecimal.from(100, 6),
      displayName: 'usdc',
    },
    {
      id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f518',
      address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f518',
      name: 'usdt',
      decimals: 6,
      symbol: 'usdt',
      balance: BigDecimal.from(10, 6),
      displayName: 'usdt',
    },
  ],
}

Basic.args = args
