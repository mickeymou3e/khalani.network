import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import AddressBox from './AddressBox.component'

export default {
  title: 'Components/Account/AddressBox',
  description: '',
  component: AddressBox,
}

type Story = StoryObj<ComponentProps<typeof AddressBox>>

const Template: Story = {
  render: (args) => (
    <Box
      display="flex"
      width="100%"
      height={250}
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <AddressBox {...args} />
    </Box>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  name: 'Address',
  address:
    'ckb1qjl58smqy32hnrq6vxjedcxe2fugvnz497h7yvwqvwel40uh4rltezes0ycput9gtz7n9nz20jv68x933ptcgwpx58z',
  explorerName: 'Testnet faucet',
  explorerAddress: 'https://faucet.nervos.org/',
}
