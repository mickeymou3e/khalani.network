import React, { ComponentProps, useState } from 'react'

import { Box, Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Toggle from './ToggleGroup.component'

export default {
  title: 'Components/Buttons/ToggleGroup',
  description: '',
  component: Toggle,
}

type Story = StoryObj<ComponentProps<typeof Toggle>>

const Template: Story = {
  render: (args) => {
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
  },
}

export const Basic = { ...Template }
export const Basic2 = { ...Template }

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

const WidthTemplate: Story = {
  render: (args) => {
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
  },
}

export const Width = { ...WidthTemplate }

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
