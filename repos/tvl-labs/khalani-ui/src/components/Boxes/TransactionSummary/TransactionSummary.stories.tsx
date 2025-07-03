import React, { ComponentProps } from 'react'

import Typography from '@components/Typography'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TransactionSummary from './TransactionSummary.component'

export default {
  title: 'Components/Boxes/TransactionSummary',
  description: '',
  component: TransactionSummary,
}

const Template: Story<ComponentProps<typeof TransactionSummary>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <TransactionSummary {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  items: [
    {
      id: 1,
      label: 'Solver Preference',
      value: (
        <Typography
          text="USS Enterprise"
          variant="caption"
          fontWeight={700}
          color="text.secondary"
        />
      ),
    },
    {
      id: 2,
      label: 'ETA',
      value: (
        <Typography
          text="~ 3 mins"
          variant="caption"
          fontWeight={700}
          color="text.secondary"
        />
      ),
    },
  ],
}
