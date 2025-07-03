import React, { ComponentProps } from 'react'

import { Box } from '@mui/material'
import { Story } from '@storybook/react'

import NoBalanceView from './NoBalanceView.component'

export default {
  title: 'Components/NoBalanceView',
  component: NoBalanceView,
}

const Template: Story<ComponentProps<typeof NoBalanceView>> = (args) => (
  <Box
    sx={{
      background: 'linear-gradient(180deg, #280773 0%, #4B0ED9 100%)',
      height: 500,
    }}
  >
    <NoBalanceView {...args} />
  </Box>
)

export const Basic = Template.bind({})
Basic.args = {
  onClick: () => console.log('click'),
}
