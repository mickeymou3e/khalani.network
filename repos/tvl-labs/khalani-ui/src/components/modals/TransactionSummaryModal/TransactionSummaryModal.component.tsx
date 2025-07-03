import React from 'react'

import Stepper from '@components/Stepper'
import { StepStatus } from '@components/Stepper/Stepper.types'
import Button from '@components/buttons/Button'
import PrimaryButton from '@components/buttons/PrimaryButton'
import Modal from '@components/modals/Modal'
import { Box, Divider } from '@mui/material'

import ModalHeader from '../ModalHeader'
import { ITransactionSummaryModalProps } from './TransactionSummaryModal.types'

const TransactionSummaryModal: React.FC<ITransactionSummaryModalProps> = ({
  buttonLabel,
  secondaryButtonLabel,
  isButtonDisabled,
  open,
  steps,
  handleClose,
  handleButtonClick,
  handleSecondaryButtonClick,
  children,
  title,
  currentStep,
}) => {
  const isLastStepCompleted =
    currentStep === steps.length &&
    steps.find((step) => step.id === currentStep)?.status ===
      StepStatus.COMPLETED

  return (
    <Modal open={open} handleClose={handleClose}>
      <Box width={{ xs: '100%', md: 450 }}>
        <ModalHeader title={title ?? ''} handleClose={handleClose} />

        {children}

        <Divider sx={{ mt: 2 }} />

        <Box my={2} display="flex" justifyContent="center">
          <Stepper steps={steps} />
        </Box>

        <Box display="flex" justifyContent="flex-end" width="100%" gap={2}>
          {isLastStepCompleted && (
            <Button
              text={secondaryButtonLabel}
              onClick={handleSecondaryButtonClick}
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
            />
          )}

          <PrimaryButton
            text={buttonLabel}
            disabled={isButtonDisabled}
            onClick={handleButtonClick}
            variant="contained"
            size="large"
            fullWidth
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default TransactionSummaryModal
