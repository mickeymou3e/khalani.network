import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import SecondaryButton from './SecondaryButton.component'

export default {
  title: 'Components/buttons/SecondaryButton',
  description: '',
  component: SecondaryButton,
}

const Template: Story<ComponentProps<typeof SecondaryButton>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <SecondaryButton {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'Proportional suggestion',
  onClickFn: () => true,
}
