import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import HamburgerMenu from './HamburgerMenu.component'

export default {
  title: 'Components/Header/HamburgerMenu',
  description: '',
  component: HamburgerMenu,
}

const Template: Story<ComponentProps<typeof HamburgerMenu>> = (args) => (
  <Box height={50} width={200}>
    <HamburgerMenu {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  items: [
    {
      text: 'Mint / Reedem',
      id: '1',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Mint / Reedem',
        },
      ],
    },
    {
      text: 'Bridge',
      id: '2',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Bridge',
        },
      ],
    },
    {
      text: 'Liquidity',
      id: '3',
      pages: [
        {
          href: '4_2',
          id: '4_2',
          linkType: LinkEnum.Internal,
          text: 'Liquidity',
        },
      ],
    },
  ],
}
