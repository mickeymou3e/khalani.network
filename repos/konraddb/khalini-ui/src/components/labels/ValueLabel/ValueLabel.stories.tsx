import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import ValueLabel from './ValueLabel.component'

export default {
  title: 'Components/labels/ValueLabel',
  description: '',
  component: ValueLabel,
}

const Template: Story<ComponentProps<typeof ValueLabel>> = (args) => (
  <Box
    p={2}
    maxWidth={{
      xs: 110,
      md: 160,
      xl: 200,
    }}
  >
    <ValueLabel {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  label: 'CKB',
  value: '0.597234652893756298765237896',
}
