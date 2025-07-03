import React, { ComponentProps } from 'react'

import { UsdcIcon, UsdtIcon } from '@components/icons/tokens'
import { Box } from '@mui/material'
import { Story } from '@storybook/react/types-6-0'

import IconStackView from './IconStackView.component'

export default {
  title: 'Components/IconStackView',
  description: '',
  component: IconStackView,
}

const Template: Story<ComponentProps<typeof IconStackView>> = (args) => (
  <Box p={3} width={350}>
    <IconStackView {...args} />
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  mainIcon: {
    icon: <UsdcIcon style={{ height: 40, width: 40 }} />,
    id: '1',
    text: 'USDC-a-USDT',
  },
  icons: [
    {
      icon: <UsdcIcon style={{ height: 40, width: 40 }} />,
      id: '1',
      text: 'Force Bridge USDC from Ethereum',
    },
    {
      icon: <UsdtIcon style={{ height: 40, width: 40 }} />,
      id: '2',
      text: 'USDT',
    },
  ],
}
