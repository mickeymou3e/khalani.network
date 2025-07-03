import React, { ComponentProps } from 'react'

import { Story } from '@storybook/react/types-6-0'

import { LinkEnum } from '..'
import BreadCrumbs from './BreadCrumbs.component'

export default {
  title: 'Components/BreadCrumbs',
  description: '',
  component: BreadCrumbs,
}

const Template: Story<ComponentProps<typeof BreadCrumbs>> = (args) => (
  <BreadCrumbs {...args} />
)

export const Basic = Template.bind({})

Basic.args = {
  items: [
    {
      href: null,
      id: '1',
      text: 'Trade',
      linkType: null,
    },
    {
      href: 'swap',
      id: '2',
      text: 'Swap',
      linkType: LinkEnum.Internal,
    },
    {
      href: 'test',
      id: '3',
      text: 'Test',
      linkType: LinkEnum.Internal,
    },
    {
      href: null,
      id: '4',
      text: 'Test',
      linkType: null,
    },
  ],
}
