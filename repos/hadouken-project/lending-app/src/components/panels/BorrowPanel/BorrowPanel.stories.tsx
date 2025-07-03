import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import BorrowPanel from './BorrowPanel.component'
import { BorrowPanelProps } from './BorrowPanel.types'

export default {
  title: 'Components/Panels/BorrowPanel',
  description: '',
  component: BorrowPanel,
}

const Template: Story<ComponentProps<typeof BorrowPanel>> = (args) => (
  <BorrowPanel {...args} />
)

export const Basic = Template.bind({})

const args: BorrowPanelProps = {
  borrowed: '100.74',
  collateral: '996.041',
  borrowingPowerUsed: '69%',
  healthFactor: '7.92',
  LTV: '0.1008',
  maxLTV: '0.75',
  liqThreshold: '0.8',
}

Basic.args = args
