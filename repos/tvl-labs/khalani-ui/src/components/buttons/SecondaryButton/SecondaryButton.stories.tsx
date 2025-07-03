import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import SecondaryButton from './SecondaryButton.component'

export default {
  title: 'Components/Buttons/SecondaryButton',
  component: SecondaryButton,
}

const Template: Story<ComponentProps<typeof SecondaryButton>> = (args) => (
  <Box
    sx={{
      background: 'linear-gradient(180deg, #280773 0%, #4B0ED9 100%)',
      height: 500,
    }}
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <SecondaryButton {...args} />
  </Box>
)

export const Basic = Template.bind({})
Basic.args = {
  text: 'Button',
}
