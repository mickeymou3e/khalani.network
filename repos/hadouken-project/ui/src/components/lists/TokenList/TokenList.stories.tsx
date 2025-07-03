import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import TokenList from './TokenList.component'

export default {
  title: 'Components/lists/TokenList',
  description: '',
  component: TokenList,
}

const tokens: { id: string; symbol: string }[] = [
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
  {
    id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72c123',
    symbol: 'eth',
  },
  {
    id: '0xA600286A67c5BaedCDb4bEAee96Ff51fE72cF345',
    symbol: 'wbtc',
  },
]

type Story = StoryObj<ComponentProps<typeof TokenList>>

const Template: Story = {
  render: () => {
    const [popularTokensList, setPopularTokensList] = useState<
      { id: string; symbol: string }[]
    >(tokens)
    const [selectedTokenList, setSelectedTokenList] = useState<
      { id: string; symbol: string }[]
    >([])
    const handlePopularTokenList = (id: string) => {
      const removedItem = popularTokensList.find((token) => token.id === id)
      setSelectedTokenList(
        removedItem
          ? [...selectedTokenList, removedItem]
          : [...selectedTokenList],
      )
      const filteredTokens = popularTokensList?.filter(
        (token) => token.id !== id,
      )
      setPopularTokensList(filteredTokens)
    }

    const handleSelectedTokenList = (id: string) => {
      const removedItem = selectedTokenList?.find((token) => token.id === id)
      setPopularTokensList(
        removedItem
          ? [...popularTokensList, removedItem]
          : [...popularTokensList],
      )
      const filteredToken = selectedTokenList?.filter(
        (token) => token.id !== id,
      )
      setSelectedTokenList(filteredToken)
    }
    return (
      <Paper sx={{ maxWidth: '800px', padding: 5 }}>
        <TokenList
          popularTokensList={popularTokensList}
          selectedTokenList={selectedTokenList}
          handlePopularTokenList={handlePopularTokenList}
          handleSelectedTokenList={handleSelectedTokenList}
        />
      </Paper>
    )
  },
}

export const Basic = { ...Template }
