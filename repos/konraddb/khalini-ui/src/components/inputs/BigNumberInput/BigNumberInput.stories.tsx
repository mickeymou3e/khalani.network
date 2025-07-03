import React, { ComponentProps, useState } from 'react'

import { BigNumber } from 'ethers'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Story } from '@storybook/react/types-6-0'

import BigNumberInput from './'

export default {
  title: 'Components/Inputs/BigNumberInput',
  description: '',
  component: BigNumberInput,
}

const Template: Story<ComponentProps<typeof BigNumberInput>> = (args) => {
  const [amount, setAmount] = useState<BigNumber>(BigNumber.from(1000000))

  const onValueChange = (value: BigNumber) => {
    setAmount(value)
  }

  return (
    <Paper>
      <Box display="flex" flexDirection="column">
        <Box marginY={2}>
          <Typography variant="h3">Default</Typography>
          <BigNumberInput
            {...args}
            name="input1"
            onChange={onValueChange}
            value={amount}
          />
        </Box>
        <Box marginY={2}>
          <Typography variant="h3">Small(dense)</Typography>
          <BigNumberInput
            {...args}
            name="input2"
            onChange={onValueChange}
            value={amount}
            margin="dense"
          />
        </Box>
        <Box marginY={2}>
          <Typography variant="h3">Error</Typography>
          <BigNumberInput
            {...args}
            name="input3"
            onChange={onValueChange}
            value={amount}
            error
          />
        </Box>
        <Box marginY={2}>
          <Typography variant="h3">Disabled</Typography>
          <BigNumberInput
            {...args}
            name="input4"
            onChange={onValueChange}
            value={amount}
            disabled
          />
        </Box>
        <Box marginY={2}>
          <Typography variant="h3">Loading</Typography>
          <BigNumberInput
            {...args}
            name="input5"
            onChange={onValueChange}
            value={amount}
            loading={true}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  decimals: 6,
  loading: false,
}
