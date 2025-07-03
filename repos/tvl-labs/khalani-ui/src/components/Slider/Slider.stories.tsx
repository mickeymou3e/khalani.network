import React, { useState } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Slider from './Slider.component'

export default {
  title: 'Components/Slider',
  description: '',
}

const Template: Story = () => {
  const [percentage, setPercentage] = useState(1)

  return (
    <Container sx={{ mt: 5, width: 500 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        {percentage}
        <Slider value={percentage} onChange={setPercentage} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})
