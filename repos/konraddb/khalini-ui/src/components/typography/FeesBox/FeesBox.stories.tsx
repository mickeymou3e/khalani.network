import React, { ComponentProps } from 'react'

import { Container } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import FeesBox from './FeesBox.component'

export default {
  title: 'Components/FeesBox',
  description: '',
  component: FeesBox,
}

const Template: Story<ComponentProps<typeof FeesBox>> = (args) => (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <FeesBox {...args} />
  </Container>
)

export const Basic = Template.bind({})

Basic.args = {
  platformFee: 5,
  gasFee: 3,
}
