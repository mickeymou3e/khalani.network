import React, { ComponentProps } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Toggle from './Toggle.component'

export default {
  title: 'Components/Toggle',
  description: '',
  component: Toggle,
}

const Template: Story<ComponentProps<typeof Toggle>> = (args) => {
  return (
    <Paper>
      <Toggle {...args} />
    </Paper>
  )
}

export const Basic = Template.bind({})

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
}
