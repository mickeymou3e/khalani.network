import React, { ComponentProps } from 'react'

import ToggleGroup from '@components/buttons/ToggleGroup'
import { StoryObj } from '@storybook/react'

import DefaultModule from './DefaultModule.component'

export default {
  title: 'Components/DefaultModule',
  description: '',
  component: DefaultModule,
}
type Story = StoryObj<ComponentProps<typeof DefaultModule>>

const Template: Story = {
  render: (args) => (
    <DefaultModule {...args}>
      <ToggleGroup
        toggles={[
          {
            id: '1',
            name: 'In % of my stake',
          },
          {
            id: '2',
            name: 'Specify exact assets amounts',
          },
        ]}
        selected={'1'}
      />
    </DefaultModule>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: `Example title`,
  description: `Example description`,
}
