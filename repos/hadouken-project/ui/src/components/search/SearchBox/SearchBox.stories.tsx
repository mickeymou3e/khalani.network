import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import SearchBox from './SearchBox.component'

export default {
  title: 'Components/Search/SearchBox',
  description: '',
  component: SearchBox,
  argTypes: { valueChangeHandler: { action: 'typed' } },
}

type Story = StoryObj<ComponentProps<typeof SearchBox>>

const Template: Story = {
  render: ({ valueChangeHandler }) => {
    const [value, setValue] = useState('')

    return (
      <Paper>
        <SearchBox
          value={value}
          valueChangeHandler={(e) => {
            setValue(e)
            valueChangeHandler?.(e)
          }}
        />
      </Paper>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {}
