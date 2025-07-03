import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react'

import PrimaryButton from './PrimaryButton.component'

export default {
  title: 'Components/Buttons/PrimaryButton',
  component: PrimaryButton,
}

const Template: Story<ComponentProps<typeof PrimaryButton>> = (args) => (
  <PrimaryButton {...args} />
)

export const Basic = Template.bind({})
Basic.args = {
  text: 'Button',
  size: 'large',
}

export const Disabled = Template.bind({})
Disabled.args = {
  text: 'Button',
  disabled: true,
  size: 'large',
  variant: 'contained',
}

export const IsLoading = Template.bind({})
IsLoading.args = {
  text: 'Button',
  disabled: true,
  isLoading: true,
  size: 'large',
  variant: 'contained',
}
