import React from 'react'

import Typography from '@components/Typography'
import SecondaryButton from '@components/buttons/SecondaryButton'
import { ArrowRightFilled } from '@components/icons'
import { Box, Divider, Stack } from '@mui/material'
import { getTokenComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'

import Modal from '../Modal/Modal.component'
import ModalHeader from '../ModalHeader/ModalHeader.component'
import { SummaryBoxStyled } from './WithdrawBalanceModal.styled'
import { ISelectWalletModalProps } from './WithdrawBalanceModal.types'

const WithdrawBalanceModal: React.FC<ISelectWalletModalProps> = (props) => {
  const {
    tokenSymbol,
    sourceChain,
    destinationChain,
    amount,
    summaryItems,
    onClose,
    open,
    buttonComponent,
  } = props

  return (
    <Modal open={open} handleClose={onClose}>
      <Box width={{ xs: '100%', md: 450 }}>
        <ModalHeader title={'Withdraw Balance'} handleClose={onClose} />

        <Divider sx={{ mt: 2, mb: 4 }} />

        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <Stack direction="row" alignItems="center" gap={0.5}>
              {getNetworkIcon(sourceChain.id, {
                style: { width: 20, height: 20 },
              })}
              <Typography
                text={sourceChain.chainName}
                variant="button"
                color="text.secondary"
              />
            </Stack>
            <ArrowRightFilled />
            <Stack direction="row" alignItems="center" gap={0.5}>
              {getNetworkIcon(destinationChain.id, {
                style: { width: 20, height: 20 },
              })}
              <Typography
                text={destinationChain.chainName}
                variant="button"
                color="text.secondary"
              />
            </Stack>
          </Stack>

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
              text={amount}
              variant="body2"
              color="text.secondary"
              fontWeight={700}
            />
          </Stack>
        </Stack>
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
        <Stack direction="row" justifyContent="center" mt={1}>
          <SecondaryButton text="Cancel" onClick={onClose} />
          {buttonComponent}
        </Stack>
      </Box>
    </Modal>
  )
}

export default WithdrawBalanceModal
