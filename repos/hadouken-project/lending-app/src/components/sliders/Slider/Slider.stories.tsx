import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import Slider from './Slider.component'

export default {
  title: 'Components/Sliders/Slider',
  description: '',
  component: Slider,
}

const Template: Story<ComponentProps<typeof Slider>> = (args) => (
  <Slider {...args} />
)

export const Basic = Template.bind({})

Basic.args = {}
