import React, { ComponentProps } from 'react'

import { mapToPoolType } from '@dataSource/graph/pools/pools/mapper'
import { PoolType } from '@hadouken-project/sdk'
import { IPool } from '@interfaces/pool'
import { Story } from '@storybook/react/types-6-0'
import { BigDecimal } from '@utils/math'

import PoolTable from './PoolTable.component'

export default {
  title: 'Components/PoolTable',
  description: '',
  component: PoolTable,
}

const pools: IPool[] = [
  {
    id: '1',
    address: '1',
    name: '2pool',
    displayName: 'Hadouken Boosted USD',
    poolType: mapToPoolType(PoolType.Stable),
    symbol: 'DAI/BUSD',
    decimals: 18,
    tokens: [
      {
        id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
        address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
        name: 'dai',
        decimals: 18,
        symbol: 'dai',
        balance: BigDecimal.from(10),
        displayName: 'DAI',
      },
      {
        symbol: 'BUSD',
        address: 'address',
        decimals: 18,
        id: '2',
        name: 'BUSD',
        balance: BigDecimal.from(10),
        displayName: 'BUSD',
      },
    ],
    amp: '1',
    swapFee: BigDecimal.from(0.5),
    createTime: new Date(),
    owner: '0x12345678910',
    totalShares: BigDecimal.from(1),
    totalLiquidity: BigDecimal.from(1),
    totalSwapFee: BigDecimal.from(1),
    totalSwapVolume: BigDecimal.from(1),
  },
  {
    id: '2',
    address: '2',
    name: '3pool',
    displayName: '3pool',
    createTime: new Date(),
    owner: '0x12345678910',
    poolType: mapToPoolType(PoolType.Stable),
    decimals: 18,
    symbol: 'DAI/USDC/USDT',
    tokens: [
      {
        id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
        address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
        name: 'dai',
        decimals: 18,
        symbol: 'dai',
        balance: BigDecimal.from(10),
        displayName: 'DAI',
      },
      {
        id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
        address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
        name: 'usdc',
        decimals: 6,
        symbol: 'usdc',
        balance: BigDecimal.from(10, 6),
        displayName: 'USDC',
      },
      {
        symbol: 'usdt',
        address: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
        decimals: 6,
        name: 'usdt',
        id: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
        balance: BigDecimal.from(10, 6),
        displayName: 'USDT',
      },
    ],
    amp: '1',
    swapFee: BigDecimal.from(0.5),
    totalShares: BigDecimal.from(1),
    totalLiquidity: BigDecimal.from(1),
    totalSwapFee: BigDecimal.from(1),
    totalSwapVolume: BigDecimal.from(1),
  },
]

const poolClickHandler = (poolAddress: string) => alert(poolAddress)

const Template: Story<ComponentProps<typeof PoolTable>> = (args) => (
  <PoolTable {...args} pools={pools} onPoolClick={poolClickHandler} />
)

export const Basic = Template.bind({})

Basic.args = {}
