import React, { ComponentProps } from 'react'

import { LinkEnum } from '@components/Link'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import HeaderLink from './'

export default {
  title: 'Components/Header/HeaderLink',
  description: '',
  component: HeaderLink,
}

const Template: Story<ComponentProps<typeof HeaderLink>> = (args) => (
  <Box height={50} width={200}>
    <HeaderLink {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  href: 'test',
  text: 'Simple link',
  linkType: LinkEnum.Internal,
}
