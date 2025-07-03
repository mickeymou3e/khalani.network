import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import HeaderLink from './'

export default {
  title: 'Components/Header/HeaderLink',
  description: '',
  component: HeaderLink,
}

type Story = StoryObj<ComponentProps<typeof HeaderLink>>

const Template: Story = {
  render: (args) => (
    <Box height={50} width={200}>
      <HeaderLink {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  href: 'test',
  text: 'Simple link',
  linkType: LinkEnum.Internal,
}
