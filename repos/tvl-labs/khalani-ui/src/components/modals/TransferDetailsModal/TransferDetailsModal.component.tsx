import React from 'react'

import TransactionStatus from '@components/Boxes/TransactionStatus'
import Typography from '@components/Typography'
import PrimaryButton from '@components/buttons/PrimaryButton'
import SourceToDestinationChain from '@components/chain/SourceToDestinationChain'
import { Box, Divider, Stack } from '@mui/material'
import { getTokenComponent } from '@utils/icons'
import { bigIntToString } from '@utils/text'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { SummaryBoxStyled } from './TransferDetailsModal.styled'
import { TransferDetailsModalProps } from './TransferDetailsModal.types'

const TransferDetailsModal: React.FC<TransferDetailsModalProps> = (props) => {
  const {
    tokenSymbol,
    sourceChain,
    destinationChain,
    amount,
    tokenDecimals,
    summaryItems,
    destChains,
    onClose,
    open,
    progress,
    statusText,
    status,
    errorMessage,
    buttonText,
    handleClick,
    onSourceChainClick,
    onDestinationChainClick,
  } = props

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 470 }}>
        <ModalHeader title={'Transfer Details'} handleClose={onClose} />

        <Divider sx={{ mt: 2, mb: 4 }} />

        <Stack direction="row" justifyContent="space-between">
          <SourceToDestinationChain
            sourceChain={sourceChain}
            destinationChain={destinationChain}
            destinationChains={destChains}
            onSourceChainClick={onSourceChainClick}
            onDestinationChainClick={onDestinationChainClick}
          />

          <Stack direction="row" alignItems="center" gap={0.5}>
            {getTokenComponent(tokenSymbol, {
              width: 20,
              height: 20,
            })}
            <Typography
              text={tokenSymbol}
              variant="body2"
              color="text.secondary"
            />
            <Typography
              text={bigIntToString(amount, tokenDecimals)}
              variant="body2"
              color="text.secondary"
              fontWeight={700}
            />
          </Stack>
        </Stack>
        <Box mt={2} display="flex" gap={2}>
          <TransactionStatus
            progress={progress}
            statusText={statusText}
            status={status}
            errorMessage={errorMessage}
          />
          {buttonText && handleClick && (
            <PrimaryButton
              size="small"
              text={buttonText}
              onClick={handleClick}
            />
          )}
        </Box>

        <SummaryBoxStyled mt={4}>
          {summaryItems.map((item, index) => (
            <Box key={item.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                px={1.5}
                py={1}
              >
                <Typography
                  text={item.label}
                  variant="caption"
                  color="text.secondary"
                />
                {item.value}
              </Stack>
              {index !== summaryItems.length - 1 && <Divider />}
            </Box>
          ))}
        </SummaryBoxStyled>
      </Box>
    </Modal>
  )
}

export default TransferDetailsModal
