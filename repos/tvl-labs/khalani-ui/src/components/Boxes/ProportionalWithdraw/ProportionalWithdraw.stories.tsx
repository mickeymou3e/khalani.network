import React, { ComponentProps, useState } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import ProportionalWithdraw from './ProportionalWithdraw.component'

export default {
  title: 'Components/Boxes/ProportionalWithdraw',
  description: '',
  component: ProportionalWithdraw,
}

const Template: Story<ComponentProps<typeof ProportionalWithdraw>> = () => {
  const [percentage, setPercentage] = useState(1)

  return (
    <Container sx={{ mt: 5, width: 500 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <ProportionalWithdraw value={percentage} onChange={setPercentage} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})
