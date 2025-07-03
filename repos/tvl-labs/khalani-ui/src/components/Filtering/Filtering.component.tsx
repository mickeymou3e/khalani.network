import React, { useState } from 'react'

import NetworkSelectorModal from '@components/modals/NetworkSelectorModal'
import TokenSelectorModal from '@components/modals/TokenSelectorModal'
import { Box } from '@mui/material'

import { FilteringType, IFilteringProps } from './Filtering.types'
import FilteringItem from './components/FilteringItem.component'

const Filtering: React.FC<IFilteringProps> = (props) => {
  const { chain, token, chains, tokens, onChainChange, onTokenChange } = props

  const [networkModalOpen, setNetworkModalOpen] = useState<boolean>(false)
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false)

  const onNetworkFilterClick = () => {
    setNetworkModalOpen(true)
  }

  const onNetworkCloseClick = () => {
    onChainChange(undefined)
  }

  const onTokenFilterClick = () => {
    setTokenModalOpen(true)
  }

  const onTokenCloseClick = () => {
    onTokenChange(undefined)
  }

  return (
    <>
      <Box display="flex" gap={1}>
        <FilteringItem
          type={FilteringType.Network}
          value={chain?.chainId}
          onFilterClick={onNetworkFilterClick}
          onCloseClick={onNetworkCloseClick}
        />
        <FilteringItem
          type={FilteringType.Token}
          value={token?.symbol}
          onFilterClick={onTokenFilterClick}
          onCloseClick={onTokenCloseClick}
        />
      </Box>

      <NetworkSelectorModal
        open={networkModalOpen}
        onClose={() => setNetworkModalOpen(false)}
        chains={chains ?? []}
        onChainSelect={onChainChange}
        selectedChain={chain}
        headerText={'Select network'}
      />
      <TokenSelectorModal
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
        tokens={tokens}
        balances={[]}
        onTokenSelect={onTokenChange}
        selectedToken={token}
        hideBalances
      />
    </>
  )
}

export default Filtering
