import React, { ComponentProps, useEffect, useState } from 'react'

import { steps } from '@components/Stepper/Stepper.stories'
import Button from '@components/buttons/Button'
import InvestmentPreview from '@components/previews/InvestmentPreview'
import { investmentPreviewProps } from '@components/previews/InvestmentPreview/InvestmentPreview.stories'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import TransactionSummaryModal from './TransactionSummaryModal.component'

export default {
  title: 'Components/Modals/TransactionSummaryModal',
  description: '',
  component: TransactionSummaryModal,
}

const Template: Story<ComponentProps<typeof TransactionSummaryModal>> = (
  args,
) => {
  const [open, setOpen] = useState(args.open)

  useEffect(() => {
    setOpen(args.open)
  }, [args.open])

  const onClick = () => {
    setOpen(true)
  }

  const view = <InvestmentPreview {...investmentPreviewProps} />

  return (
    <Box>
      <Button onClick={onClick} text="Open" />
      <TransactionSummaryModal
        {...args}
        open={open}
        handleClose={() => setOpen(false)}
      >
        {view}
      </TransactionSummaryModal>
    </Box>
  )
}

const props = {
  open: true,
  title: 'Add liquidity',
  buttonLabel: 'Approve',
  secondaryButtonLabel: 'View tx in explorer',
  isButtonDisabled: false,
  steps,
}

export const Basic = Template.bind({})

Basic.args = {
  ...props,
  currentStep: 2,
}

export const LastStep = Template.bind({})

LastStep.args = {
  ...props,
  currentStep: 4,
}
