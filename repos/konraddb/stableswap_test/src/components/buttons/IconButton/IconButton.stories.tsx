import React, { ComponentProps } from 'react'

import walletLogo from '@assets/wallet.svg'
import { Story } from '@storybook/react/types-6-0'

import IconButton from './IconButton.component'

export default {
  title: 'Components/Buttons/IconButton',
  description: '',
  component: IconButton,
}

const Template: Story<ComponentProps<typeof IconButton>> = (args) => (
  <IconButton {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  text: 'Connect wallet',
  icon: walletLogo,
}
