import React, { ComponentProps } from 'react'

import { Box, Container } from '@mui/material'
import { Story } from '@storybook/react'

import TertiaryButton from './TertiaryButton.component'

export default {
  title: 'Components/buttons/TertiaryButton',
  description: '',
  component: TertiaryButton,
}

const Template: Story<ComponentProps<typeof TertiaryButton>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <Box display="flex" justifyContent="center">
      <TertiaryButton {...args} />
    </Box>
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'Proportional suggestion',
  onClickFn: () => true,
}
