import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import HealthCheckSlider from './HealthCheckSlider.component'

export default {
  title: 'Components/Sliders/HealthCheckSlider',
  description: '',
  component: HealthCheckSlider,
}

const Template: Story<ComponentProps<typeof HealthCheckSlider>> = (args) => (
  <HealthCheckSlider {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  leftLabel: 'Safer',
  factorLabel: 'New health factor:',
  rightLabel: 'Riskier',
  min: 10,
  max: 100,
  step: 1,
  disabled: false,
}
