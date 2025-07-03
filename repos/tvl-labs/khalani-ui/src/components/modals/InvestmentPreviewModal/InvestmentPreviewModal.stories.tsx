import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import InvestmentPreviewModal from './InvestmentPreviewModal.component'

export default {
  title: 'Components/Modals/InvestmentPreviewModal',
  description: '',
  component: InvestmentPreviewModal,
}

const Template: Story<ComponentProps<typeof InvestmentPreviewModal>> = (
  args,
) => {
  const [open, setOpen] = useState(args.open)

  useEffect(() => {
    setOpen(args.open)
  }, [args.open])

  const onClick = () => {
    setOpen(true)
  }

  return (
    <Box>
      <Button onClick={onClick} variant="contained" text="Open" />
      <InvestmentPreviewModal
        {...args}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
  title: 'Confirm providing liquidity',
  label: 'You are providing:',
  tokenSymbols: ['USDC.Avax'],
  poolShare: '0.0031',
  outputAmount: '1.25',
  tokens: [
    { symbol: 'USDT.Avax', amount: '1.23', amountUSD: '1.24', chainId: '0x1' },
  ],
  handleConfirm: () => true,
}
