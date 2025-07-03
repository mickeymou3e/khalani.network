import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import RadioGroup from './RadioGroup.component'

export default {
  title: 'Components/Buttons/RadioGroup',
  description: '',
  component: RadioGroup,
}

type Story = StoryObj<ComponentProps<typeof RadioGroup>>

const Template: Story = {
  render: (args) => {
    return (
      <Paper>
        <RadioGroup {...args} />
      </Paper>
    )
  },
}

export const Basic = { ...Template }
export const Basic2 = { ...Template }
export const Basic3 = { ...Template }

Basic.args = {
  options: [
    {
      id: '1',
      name: 'Variable rate',
    },
    {
      id: '2',
      name: 'Fixed rate',
    },
  ],
}

Basic2.args = {
  options: [
    {
      id: '1',
      name: 'First',
      disabled: true,
    },
    {
      id: '2',
      name: 'Second',
    },
    {
      id: '3',
      name: 'Third',
      disabled: true,
    },
    {
      id: '4',
      name: 'Fourth',
    },
  ],
}

Basic3.args = {
  options: [
    {
      id: '1',
      name: 'First',
      disabled: true,
    },
    {
      id: '2',
      name: 'Second',
    },
    {
      id: '3',
      name: 'Third',
      disabled: true,
    },
    {
      id: '4',
      name: 'Fourth',
    },
  ],
  selected: '4',
}

const Width: Story = {
  render: (args) => {
    return (
      <Paper>
        <Box width={400}>
          <RadioGroup {...args} />
        </Box>
      </Paper>
    )
  },
}

export const WidthTest = { ...Width }

WidthTest.args = {
  options: [
    {
      id: '1',
      name: 'First',
    },
    {
      id: '2',
      name: 'Second',
    },
    {
      id: '3',
      name: 'Third',
    },
  ],
  row: true,
}
