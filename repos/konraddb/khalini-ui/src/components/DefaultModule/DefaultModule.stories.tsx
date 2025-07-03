import React, { ComponentProps } from 'react'

import ToggleGroup from '@components/buttons/ToggleGroup'
import { Story } from '@storybook/react/types-6-0'

import DefaultModule from './DefaultModule.component'

export default {
  title: 'Components/DefaultModule',
  description: '',
  component: DefaultModule,
}

const Template: Story<ComponentProps<typeof DefaultModule>> = (args) => (
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
)

export const Basic = Template.bind({})

Basic.args = {
  title: `Example title`,
  description: `Example description`,
}
