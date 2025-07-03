import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import ValueLabel from './ValueLabel.component'

export default {
  title: 'Components/labels/ValueLabel',
  description: '',
  component: ValueLabel,
}

type Story = StoryObj<ComponentProps<typeof ValueLabel>>

const Template: Story = {
  render: (args) => (
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
  ),
}

export const Basic = { ...Template }

Basic.args = {
  label: 'CKB',
  value: '0.597234652893756298765237896',
}
