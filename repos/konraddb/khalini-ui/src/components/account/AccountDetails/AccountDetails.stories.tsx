import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import AccountDetails from './'

export default {
  title: 'Components/Account/AccountDetails',
  description: '',
  component: AccountDetails,
}

const Template: Story<ComponentProps<typeof AccountDetails>> = (args) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="100%"
    height={300}
  >
    <Box bgcolor="background.default" p={2} borderRadius={12}>
      <AccountDetails {...args} />
    </Box>
  </Box>
)

export const Basic = Template.bind({})

Basic.args = {
  ethAddress: '0x742971ac86E36152B9aac7090cF0B5C0acaa90F4',
  chainId: 71402,
  nativeTokenBalance: '666.319905',
  nativeTokenSymbol: 'CKB',
}
