import React, { ComponentProps, useState } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import SlippageTolerance from './SlippageTolerance.component'

export default {
  title: 'Components/Inputs/SlippageTolerance',
  description: '',
  component: SlippageTolerance,
}

const Template: Story<ComponentProps<typeof SlippageTolerance>> = (args) => {
  const [value, setValue] = useState<bigint | undefined>()

  return (
    <Container sx={{ width: 500, mt: 4 }}>
      <Paper elevation={2} sx={{ py: 5, px: 2 }}>
        <SlippageTolerance {...args} value={value} setValue={setValue} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  onValueChange: () => true,
}
