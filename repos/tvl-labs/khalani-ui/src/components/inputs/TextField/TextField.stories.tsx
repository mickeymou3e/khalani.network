import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TextField from './TextField.component'

export default {
  title: 'Components/Inputs/TextField',
  description: '',
  component: TextField,
}

const Template: Story<ComponentProps<typeof TextField>> = (args) => {
  return (
    <Container sx={{ width: 550, mt: 4 }}>
      <Paper elevation={3} sx={{ py: 5, px: 2 }}>
        <TextField {...args} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  endAdornmentSymbol: '%',
  placeholder: 'Custom',
}
