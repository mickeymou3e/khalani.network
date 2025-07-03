import React, { ComponentProps } from 'react'

import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import ExplorerBox from './ExplorerBox.component'

export default {
  title: 'Components/Account/ExplorerBox',
  description: '',
  component: ExplorerBox,
}

const Template: Story<ComponentProps<typeof ExplorerBox>> = (args) => (
  <Box
    display="flex"
    width="100%"
    height={250}
    justifyContent="center"
    alignItems="center"
    bgcolor="background.default"
  >
    <ExplorerBox {...args} />
  </Box>
)

export const MultipleExplorers = Template.bind({})

MultipleExplorers.args = {
  networkName: 'Godwoken',
  address:
    'ckb1qjl58smqy32hnrq6vxjedcxe2fugvnz497h7yvwqvwel40uh4rltezes0ycput9gtz7n9nz20jv68x933ptcgwpx58z',
  explorers: [
    { name: 'Testnet faucet', url: 'https://faucet.nervos.org/' },
    { name: 'Godwoken explorer', url: 'https://gwscan.com/' },
  ],
}

export const SingleExplorers = Template.bind({})

SingleExplorers.args = {
  networkName: 'Godwoken',
  address:
    'ckb1qjl58smqy32hnrq6vxjedcxe2fugvnz497h7yvwqvwel40uh4rltezes0ycput9gtz7n9nz20jv68x933ptcgwpx58z',
  explorers: [{ name: 'CKB Explorer', url: 'https://faucet.nervos.org/' }],
}
