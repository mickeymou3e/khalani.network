import React from 'react'

import { BigNumber } from 'ethers'

import {
  Button,
  getTokenIconComponent,
  Modal,
  ModalHeader,
} from '@hadouken-project/ui'
import InfoIcon from '@mui/icons-material/Info'
import { Box, Divider, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { IConfirmModalProps } from '.'
import { messages } from './ConfirmModal.messages'

const mockTokens = [
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
    name: 'eth',
    decimals: 18,
    symbol: 'eth',
    balance: BigNumber.from(21212),
    isLpToken: false,
  },
  {
    id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f519',
    address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f519',
    name: 'usdt',
    decimals: 6,
    symbol: 'usdt',
    balance: BigNumber.from(123456),
    isLpToken: false,
  },
]
const ConfirmModal: React.FC<IConfirmModalProps> = ({
  open,
  handleClose,
  title,
  tokens,
  handleAction,
}) => {
  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <Box minWidth="404px">
          <ModalHeader title={title} />
          <Box display="flex" flexDirection="column" gap={0.25} py={3}>
            {mockTokens.map((token) => {
              const Icon = getTokenIconComponent(token.symbol)
              return (
                <Box
                  key={token.id}
                  display="flex"
                  justifyContent="space-between"
                  p={2}
                  bgcolor={(theme) => theme.palette.background.default}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Icon width={40} height={40} />
                    <Typography variant="paragraphBig">
                      {`${token.balance} ${token.symbol.toUpperCase()}`}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                  >
                    <Typography variant="paragraphSmall" textAlign="end">
                      {'$65.03'}
                    </Typography>
                    <Typography
                      variant="paragraphTiny"
                      textAlign="end"
                      color={(theme) => alpha(theme.palette.text.primary, 0.7)}
                    >
                      {'42.33%'}
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Typography variant="h4Bold">{messages.SUMMARY}</Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Typography variant="h5">{`${messages.TOTAL} $153.62`}</Typography>
              <Box display="flex">
                <Typography
                  variant="paragraphTiny"
                  color={(theme) => alpha(theme.palette.text.primary, 0.7)}
                >
                  {`${messages.PRICE_IMPACT} 0.00%`}
                </Typography>
                <Box pl={1}>
                  <Tooltip title={messages.DESCRIPTION}>
                    <InfoIcon />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box display="flex" gap={1} width="100%">
            <Button
              fullWidth
              variant="outlined"
              text={messages.CANCEL}
              onClick={handleClose}
            />
            <Button
              fullWidth
              variant="contained"
              text={messages.WITHDRAW}
              onClick={handleAction}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}
export default ConfirmModal
