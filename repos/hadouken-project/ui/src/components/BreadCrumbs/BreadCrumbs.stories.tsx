import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import { StoryObj } from '@storybook/react'

import BreadCrumbs from './BreadCrumbs.component'

export default {
  title: 'Components/BreadCrumbs',
  description: '',
  component: BreadCrumbs,
}

type Story = StoryObj<ComponentProps<typeof BreadCrumbs>>

const Template: Story = { render: (args) => <BreadCrumbs {...args} /> }

export const Basic = { ...Template }

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
