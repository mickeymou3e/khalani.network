import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Switch from './Switch.component'

export default {
  title: 'Components/Switch',
  description: '',
  component: Switch,
}

const Template: Story<ComponentProps<typeof Switch>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Paper elevation={3} sx={{ p: 2 }}>
      <Switch {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})
