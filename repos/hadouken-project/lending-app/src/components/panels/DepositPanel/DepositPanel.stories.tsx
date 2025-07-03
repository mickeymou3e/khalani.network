import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import DepositPanel from './DepositPanel.component'
import { DepositPanelProps } from './DepositPanel.types'

export default {
  title: 'Components/Panels/DepositPanel',
  description: '',
  component: DepositPanel,
}

const Template: Story<ComponentProps<typeof DepositPanel>> = (args) => (
  <DepositPanel {...args} />
)

export const Basic = Template.bind({})

const args: DepositPanelProps = {
  balance: 10005.084,
}

Basic.args = args
