import React, { ComponentProps } from 'react'

import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import RadioGroup from './RadioGroup.component'

export default {
  title: 'Components/Buttons/RadioGroup',
  description: '',
  component: RadioGroup,
}

const Template: Story<ComponentProps<typeof RadioGroup>> = (args) => {
  return (
    <Paper>
      <RadioGroup {...args} />
    </Paper>
  )
}

export const Basic = Template.bind({})
export const Basic2 = Template.bind({})
export const Basic3 = Template.bind({})

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

const Width: Story<ComponentProps<typeof RadioGroup>> = (args) => {
  return (
    <Paper>
      <Box width={400}>
        <RadioGroup {...args} />
      </Box>
    </Paper>
  )
}

export const WidthTest = Width.bind({})

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
