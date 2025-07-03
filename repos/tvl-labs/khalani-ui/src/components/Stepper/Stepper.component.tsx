import React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, CircularProgress, Divider, Typography } from '@mui/material'

import { StepperItem } from './Stepper.styled'
import { StepperProps, Step, StepStatus } from './Stepper.types'

const Stepper: React.FC<StepperProps> = (props) => {
  const { steps } = props

  const resolveStepItem = (step: Step) => {
    switch (step.status) {
      case StepStatus.IDLE:
      case StepStatus.ACTIVE:
        return (
          <StepperItem key={step.id} className={step.status}>
            <Typography variant="button">{step.id}</Typography>
          </StepperItem>
        )
      case StepStatus.COMPLETED:
        return <CheckCircleIcon color="success" />
      case StepStatus.PENDING:
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={24} />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="button" component="div">
                {step.id}
              </Typography>
            </Box>
          </Box>
        )
    }
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index !== 0 && <Divider sx={{ width: 31 }} />}
          {resolveStepItem(step)}
        </React.Fragment>
      ))}
    </Box>
  )
}

export default Stepper
