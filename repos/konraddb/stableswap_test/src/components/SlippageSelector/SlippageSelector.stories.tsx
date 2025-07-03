import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import SlippageSelector from './SlippageSelector.component'

export default {
  title: 'Components/SlippageSelector',
  description: '',
  component: SlippageSelector,
}

const Template: Story<ComponentProps<typeof SlippageSelector>> = (args) => (
  <SlippageSelector {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  percentageOptions: [0.2, 0.5],
}
