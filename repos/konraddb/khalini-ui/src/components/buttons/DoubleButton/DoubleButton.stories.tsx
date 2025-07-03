import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import DoubleButton from './DoubleButton.component'

export default {
  title: 'Components/buttons/DoubleButton',
  description: '',
  component: DoubleButton,
}

const Template: Story<ComponentProps<typeof DoubleButton>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <DoubleButton {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  primaryLabel: 'Settings',
  secondaryLabel: 'Close',
  onClick: () => true,
}
