import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import HamburgerMenu from './HamburgerMenu.component'

export default {
  title: 'Components/Header/HamburgerMenu',
  description: '',
  component: HamburgerMenu,
}

type Story = StoryObj<ComponentProps<typeof HamburgerMenu>>

const Template: Story = {
  render: (args) => (
    <Box height={50} width={200}>
      <HamburgerMenu {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  items: [
    {
      text: 'Swap',
      id: '1',
      pages: [
        {
          href: '2_2',
          id: '2_2',
          linkType: LinkEnum.Button,
          text: 'Swap',
        },
        {
          href: '2_3',
          id: '2_3',
          linkType: LinkEnum.Button,
          text: 'Pools',
        },
      ],
    },
    {
      text: 'Lending',
      pages: [
        {
          href: '3_2',
          id: '3_2',
          linkType: LinkEnum.Button,
          text: 'Swap',
        },
        {
          href: '3_3',
          id: '3_3',
          linkType: LinkEnum.Button,
          text: 'Pools',
        },
      ],
      id: '2',
    },
    {
      text: 'Bridge',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Button,
          text: 'Swap',
        },
        {
          href: '4_3',
          id: '4_3',
          linkType: LinkEnum.Button,
          text: 'Pools',
        },
      ],
      id: '3',
    },
  ],
}
