import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import AprTooltip from './AprTooltip.component'

export default {
  title: 'Components/AprTooltip',
  description: '',
  component: AprTooltip,
}

type Story = StoryObj<ComponentProps<typeof AprTooltip>>

const Template: Story = {
  render: () => {
    return (
      <Paper>
        <Box width="20px" height="20px">
          <AprTooltip
            apr={{
              swapApr: 0.03213,
              lendingApr: 0.03643,
              totalApr: 0.06856,
            }}
          />
        </Box>
      </Paper>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {}
