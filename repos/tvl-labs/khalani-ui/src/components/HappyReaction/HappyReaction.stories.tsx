import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react'

import HappyReaction from './HappyReaction.component'

export default {
  title: 'Components/HappyReaction',
  description: '',
  component: HappyReaction,
}

const Template: Story<ComponentProps<typeof HappyReaction>> = (args) => (
  <Container maxWidth="md" sx={{ mt: 5 }}>
    <HappyReaction {...args} />
  </Container>
)

export const Basic = Template.bind({})
