import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Switch from './Switch.component'

export default {
  title: 'Components/Switch',
  description: '',
  component: Switch,
}

const Template: Story<ComponentProps<typeof Switch>> = (args) => {
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
}

export const Basic = Template.bind({})

Basic.args = {
  checked: true,
  disabled: false,
}
