import React from 'react'

import SearchList from '@components/search/SearchList'
import { IListItem } from '@components/search/SearchList/SearchList.types'
import { Box, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { getNetworkIcon } from '@utils/network'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { messages } from './NetworkSelectorModal.messages'
import { SelectorItem } from './NetworkSelectorModal.styled'
import { INetworkSelectorModalProps } from './NetworkSelectorModal.types'

const NetworkSelectorModal: React.FC<INetworkSelectorModalProps> = (props) => {
  const {
    chains,
    selectedChain,
    onChainSelect,
    onClose,
    open,
    headerText,
  } = props

  const handleChainSelect = (item: IListItem) => {
    const chain = chains.find((chain) => chain.chainId === item.id)
    if (chain) {
      onChainSelect?.(chain)
    }
    onClose()
  }

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 400 }}>
        <ModalHeader title={headerText} handleClose={onClose} />

        <Box pt={2}>
          <SearchList
            items={chains.map((chain) => ({
              id: chain.chainId,
              text: chain.chainName,
              description: chain.chainName,
            }))}
            inputPlaceholder={messages.INPUT_PLACEHOLDER}
            onSelect={handleChainSelect}
            itemRenderer={(item) => {
              const chain = chains.find((chain) => chain.chainId === item.id)
              if (!chain) return

              const selected =
                selectedChain && selectedChain.chainId === item?.id

              return (
                <SelectorItem p={2} className={selected ? 'selected' : ''}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {chain ? (
                      getNetworkIcon(chain.id)
                    ) : (
                      <Skeleton variant="circular" width={24} height={24} />
                    )}
                    <Typography variant="body2">{chain?.chainName}</Typography>
                  </Box>
                </SelectorItem>
              )
            }}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default NetworkSelectorModal
