import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Switch from './Switch.component'

export default {
  title: 'Components/Switch',
  description: '',
  component: Switch,
}

type Story = StoryObj<ComponentProps<typeof Switch>>

const Template: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked)
    return (
      <Paper>
        <Switch
          {...args}
          checked={checked}
          onChange={() => setChecked((val) => !val)}
        />
      </Paper>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  checked: true,
  disabled: false,
}
