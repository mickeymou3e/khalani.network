import React, { ComponentProps, useState } from 'react'

import { Box, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import FeesSelector from './FeesSelector.component'

export default {
  title: 'Components/Selectors/FeesSelector',
  description: '',
  component: FeesSelector,
}

const Template: Story<ComponentProps<typeof FeesSelector>> = (args) => {
  const [selectedFee, setFee] = useState<string>(args.selectedFee)

  const handleFeeChange = (fee: string) => {
    setFee(fee)
  }

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFee(event.target.value)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5, position: 'relative' }}>
      <Box width={500}>
        <Paper elevation={2} sx={{ py: 5, px: 2 }}>
          <FeesSelector
            {...args}
            selectedFee={selectedFee}
            feeChangeFn={handleFeeChange}
            textFieldChangeFn={handleTextFieldChange}
          />
        </Paper>
      </Box>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  fees: ['0.02', '0.05', '0.1'],
  selectedFee: '0.02',
  tokenSymbol: 'USDT',
}

export const IsFixedFee = Template.bind({})

IsFixedFee.args = {
  fees: ['0.02', '0.05', '0.1'],
  selectedFee: '0.02',
  tokenSymbol: 'USDT',
  isFixedFee: true,
}
