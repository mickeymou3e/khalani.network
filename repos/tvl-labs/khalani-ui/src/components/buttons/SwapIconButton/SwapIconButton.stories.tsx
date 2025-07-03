import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react'

import SwapIconButton from './SwapIconButton.component'

export default {
  title: 'Components/Buttons/SwapIconButton',
  description: '',
  component: SwapIconButton,
}

const Template: Story<ComponentProps<typeof SwapIconButton>> = (args) => (
  <Container sx={{ mt: 5, width: 500 }}>
    <SwapIconButton {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  onClick: () => true,
}
