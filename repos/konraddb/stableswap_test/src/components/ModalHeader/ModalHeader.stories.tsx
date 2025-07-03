import React, { ComponentProps } from 'react'

import icon from '@assets/wallet.svg'
import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import ModalHeader from './ModalHeader.component'

export default {
  title: 'Components/ModalHeader',
  description: '',
  component: ModalHeader,
}

const Template: Story<ComponentProps<typeof ModalHeader>> = (args) => (
  <Box
    bgcolor={(theme) => theme.palette.background.default}
    width={500}
    height={300}
    p={2}
  >
    <ModalHeader {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  title: `Example title`,
  icon: icon,
  showLoader: false,
}
