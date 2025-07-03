import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react'

import SettingsButton from './SettingsButton.component'

export default {
  title: 'Components/buttons/SettingsButton',
  description: '',
  component: SettingsButton,
}

const Template: Story<ComponentProps<typeof SettingsButton>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <SettingsButton {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})
