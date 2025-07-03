import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Stepper from './Stepper.component'
import { StepStatus } from './Stepper.types'

export default {
  title: 'Components/Stepper',
  description: '',
  component: Stepper,
}

export const steps = [
  { id: 1, status: StepStatus.IDLE },
  { id: 2, status: StepStatus.PENDING },
  { id: 3, status: StepStatus.ACTIVE },
  { id: 4, status: StepStatus.COMPLETED },
]

const Template: Story<ComponentProps<typeof Stepper>> = (args) => (
  <Container
    maxWidth="md"
    sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
  >
    <Paper elevation={2} sx={{ px: 2, py: 4 }}>
      <Stepper {...args}></Stepper>
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  steps,
}
