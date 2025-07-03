import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react'

import TokenButton from './TokenButton.component'

export default {
  title: 'Components/Buttons/TokenButton',
  description: '',
  component: TokenButton,
}

const Template: Story<ComponentProps<typeof TokenButton>> = (args) => (
  <TokenButton {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  symbol: 'USDC',
}
