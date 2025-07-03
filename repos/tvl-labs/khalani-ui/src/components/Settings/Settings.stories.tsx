import React, { ComponentProps } from 'react'

import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Settings from './Settings.component'

export default {
  title: 'Components/Settings',
  description: '',
  component: Settings,
}

const Template: Story<ComponentProps<typeof Settings>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5, width: 500 }}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <Settings {...args} />
    </Paper>
  </Container>
)

export const Basic = Template.bind({})
