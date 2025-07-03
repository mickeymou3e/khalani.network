import React, { ComponentProps, useState } from 'react'

import { Box, Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Toggle from './ToggleGroup.component'

export default {
  title: 'Components/Buttons/ToggleGroup',
  description: '',
  component: Toggle,
}

const Template: Story<ComponentProps<typeof Toggle>> = (args) => {
  const [selected, setSelected] = useState<string>(args.selected)
  return (
    <Paper>
      <Toggle
        {...args}
        selected={selected}
        onChange={(_e, v: string) => setSelected(v)}
      />
    </Paper>
  )
}

export const Basic = Template.bind({})
export const Basic2 = Template.bind({})

Basic.args = {
  toggles: [
    {
      id: '1',
      name: 'In % of my stake',
    },
    {
      id: '2',
      name: 'Specify exact assets amounts',
    },
  ],
  selected: '1',
}

Basic2.args = {
  toggles: [
    {
      id: '1',
      name: 'In % of my stake',
    },
    {
      id: '2',
      name: 'Specify exact assets amounts',
    },
    {
      id: '3',
      name: 'Third',
    },
    {
      id: '4',
      name: 'Fourth',
      disabled: true,
    },
  ],
  selected: '2',
}

const WidthTemplate: Story<ComponentProps<typeof Toggle>> = (args) => {
  const [selected, setSelected] = useState<string>(args.selected)
  return (
    <Paper>
      <Box width={500}>
        <Toggle
          {...args}
          selected={selected}
          onChange={(_e, v: string) => setSelected(v)}
        />
      </Box>
    </Paper>
  )
}

export const Width = WidthTemplate.bind({})

Width.args = {
  toggles: [
    {
      id: '1',
      name: 'In % of my stake',
    },
    {
      id: '2',
      name: 'Specify exact assets amounts',
    },
  ],
  selected: '2',
}
