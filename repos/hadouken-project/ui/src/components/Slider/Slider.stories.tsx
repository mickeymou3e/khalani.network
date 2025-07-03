import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Slider from './Slider.component'

export default {
  title: 'Components/Slider',
  description: '',
  component: Slider,
}

type Story = StoryObj<ComponentProps<typeof Slider>>

const Template: Story = {
  render: () => {
    const [value, setValue] = useState<number>(30)

    const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number)
    }
    return (
      <Paper>
        <Slider value={value} setValue={handleChange} title="Example title" />
      </Paper>
    )
  },
}

export const Basic = { ...Template }
