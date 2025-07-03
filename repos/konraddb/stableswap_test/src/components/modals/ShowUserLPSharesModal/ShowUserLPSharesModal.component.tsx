import React from 'react'
import { useSelector } from 'react-redux'

import SummaryCard from '@components/SummaryCard'
import { Modal, ModalHeader } from '@hadouken-project/ui'
import { Box } from '@mui/material'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { getDisplayValue } from '@utils/string'

import { messages } from './ShowUserLPSharesModal.messages'
import { IShowUserLPSharesModalProps } from './ShowUserLPSharesModal.types'

const DISPLAY_DECIMALS = 2

export const ShowUserLPSharesModal: React.FC<IShowUserLPSharesModalProps> = ({
  open,
  handleClose,
  poolId,
}) => {
  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <Box width={550}>
          <Box p={2}>
            <ModalHeader title={messages.TITLE} />
            <SummaryCard label={messages.TITLE} tokens={[]} />
          </Box>
        </Box>
      </Modal>
    </>
  )
}
