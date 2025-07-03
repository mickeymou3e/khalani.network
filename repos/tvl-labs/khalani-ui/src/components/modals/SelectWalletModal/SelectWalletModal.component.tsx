import React from 'react'

import SearchList from '@components/search/SearchList'
import { IListItem } from '@components/search/SearchList/SearchList.types'
import { Box, Typography } from '@mui/material'
import { getWalletIcon } from '@utils/wallet'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { SelectorItem } from '../NetworkSelectorModal/NetworkSelectorModal.styled'
import { ISelectWalletModalProps } from './SelectWalletModal.types'

const SelectWalletModal: React.FC<ISelectWalletModalProps> = (props) => {
  const { wallets, onWalletSelect, onClose, open } = props

  const handleWalletSelect = (item: IListItem) => {
    onWalletSelect(item.id)
    onClose()
  }

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 400 }}>
        <ModalHeader title={'Connect a wallet'} handleClose={onClose} />

        <Box pt={2}>
          <SearchList
            items={wallets.map((wallet) => ({
              id: wallet.type,
              text: wallet.name,
              description: wallet.name,
            }))}
            isSearchBoxVisible={false}
            onSelect={handleWalletSelect}
            itemRenderer={(item) => {
              const wallet = wallets.find((wallet) => wallet.type === item.id)
              if (!wallet) return

              return (
                <SelectorItem p={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getWalletIcon(wallet.type)}
                    <Typography variant="body2" color="text.secondary">
                      {wallet.name}
                    </Typography>
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

export default SelectWalletModal
