import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import AccountDetails from './'

export default {
  title: 'Components/Account/AccountDetails',
  description: '',
  component: AccountDetails,
}

const Template: Story<ComponentProps<typeof AccountDetails>> = (args) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={300}
    >
      <Box
        bgcolor={(theme) => theme.palette.elevation.main}
        p={2}
        borderRadius={3}
      >
        <AccountDetails {...args} />
      </Box>
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
}
