import React, { useState } from 'react'

import { TransactionHistory } from '@components/TransactionHistory'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import TextTabsSelector from '@components/selectors/TextTabsSelector'
import Box from '@mui/material/Box'

import { tabs } from './UserAddressesModal.constants'
import { messages } from './UserAddressesModal.messages'
import { IUserAddressesModal, UserModalTabs } from './UserAddressesModal.types'
import AccountOverview from './components/AccountOverview'
import TokenBalancesList from './components/TokenBalancesList'

const UserAddressesModal: React.FC<IUserAddressesModal> = (props) => {
  const {
    open,
    title = messages.TITLE,
    tokenBalancesAcrossChains,
    accountAddress,
    accountBalance,
    isFetchingBalances,
    transactions,
    handleClose,
    handleDisconnectWallet,
    onClick,
  } = props

  const [selectedTab, setSelectedTab] = useState<number>(0)

  return (
    <Modal open={open} handleClose={handleClose}>
      <ModalHeader title={title} handleClose={handleClose} />
      <Box pt={2} width={{ xs: '100%', md: 345 }}>
        <AccountOverview
          accountAddress={accountAddress}
          accountBalance={accountBalance}
          handleDisconnectWallet={handleDisconnectWallet}
          isFetchingBalances={isFetchingBalances}
        />
        <Box mt={2}>
          <TextTabsSelector
            tabs={tabs}
            selectedTab={selectedTab}
            onChange={setSelectedTab}
          />
        </Box>

        {selectedTab === UserModalTabs.ASSETS ? (
          <TokenBalancesList
            tokenBalancesAcrossChains={tokenBalancesAcrossChains}
          />
        ) : (
          <TransactionHistory transactions={transactions} onClick={onClick} />
        )}
      </Box>
    </Modal>
  )
}

export default UserAddressesModal
