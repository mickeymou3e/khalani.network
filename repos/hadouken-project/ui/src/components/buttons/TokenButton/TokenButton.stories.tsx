import React, { ComponentProps } from 'react'

import { StoryObj } from '@storybook/react'

import TokenButton from './TokenButton.component'

export default {
  title: 'Components/Buttons/TokenButton',
  description: '',
  component: TokenButton,
}

type Story = StoryObj<ComponentProps<typeof TokenButton>>

const Template: Story = { render: (args) => <TokenButton {...args} /> }

export const Basic = { ...Template }

Basic.args = {
  symbol: 'USDC',
  name: 'USD Coin',
}
