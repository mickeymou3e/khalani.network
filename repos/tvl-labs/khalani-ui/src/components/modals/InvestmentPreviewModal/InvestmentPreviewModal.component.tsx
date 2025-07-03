import React from 'react'

import LPBalance from '@components/Boxes/LPBalance'
import TokenInSummary from '@components/Boxes/TokenInSummary'
import Modal from '@components/modals/Modal'
import ModalHeader from '@components/modals/ModalHeader'
import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { IInvestmentPreviewModalProps } from './InvestmentPreviewModal.types'

const InvestmentPreviewModal: React.FC<IInvestmentPreviewModalProps> = ({
  open,
  title,
  label,
  tokenSymbols,
  poolShare,
  outputAmount,
  tokens,
  isLoading,
  handleClose,
  handleConfirm,
}) => (
  <Modal open={open} handleClose={handleClose}>
    <Box width={{ xs: '100%', md: 416 }}>
      <ModalHeader title={title} handleClose={handleClose} />

      <Typography
        textAlign="start"
        variant="body2"
        color="text.secondary"
        sx={{ my: 2 }}
      >
        {label}
      </Typography>

      {tokens.map((token, index) => (
        <TokenInSummary
          key={index}
          symbol={token.symbol}
          amount={token.amount}
          amountUSD={token.amountUSD}
          chainId={token.chainId}
        />
      ))}

      <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
        Breakdown:
      </Typography>

      <LPBalance
        tokenSymbols={tokenSymbols}
        poolShare={poolShare}
        label={'You Receive:'}
        balance={outputAmount}
        isLoading={isLoading}
        isPoolShare
        fromModal
      />

      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="flex-end" width="100%" gap={2}>
        <Button
          onClick={handleClose}
          variant="contained"
          size="large"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          color="primary"
        >
          Confirm
        </Button>
      </Box>
    </Box>
  </Modal>
)

export default InvestmentPreviewModal
