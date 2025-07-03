import React, { ComponentProps, useState } from 'react'

import { Paper } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import Slider from './Slider.component'

export default {
  title: 'Components/Slider',
  description: '',
  component: Slider,
}

const Template: Story<ComponentProps<typeof Slider>> = () => {
  const [value, setValue] = useState<number>(30)

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
  }
  return (
    <Paper>
      <Slider value={value} setValue={handleChange} title="Example title" />
    </Paper>
  )
}

export const Basic = Template.bind({})
