import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import SelectNetworkModal from './'

export default {
  title: 'Components/Modals/SelectNetworkModal',
  description: '',
  component: SelectNetworkModal,
}

type Story = StoryObj<ComponentProps<typeof SelectNetworkModal>>

const Template: Story = {
  render: (args) => {
    const [open, setOpen] = useState(args.open)

    useEffect(() => {
      setOpen(args.open)
    }, [args.open])

    const onClick = () => {
      setOpen(true)
    }

    return (
      <Box>
        <Button onClick={onClick} text="Open" />
        <SelectNetworkModal
          open={open}
          handleClose={() => setOpen(false)}
          networks={args.networks}
          currentNetwork={args.currentNetwork}
          shouldBeAlwaysOpen={false}
        />
      </Box>
    )
  },
}

export const Mainnet = { ...Template }
export const Testnet = { ...Template }

Testnet.args = {
  open: true,
  networks: [
    { name: 'Godwoken Testnet', chainId: 71401 },
    { name: 'Zksync Testnet', chainId: 280 },
  ],
  currentNetwork: 71401,
}
Mainnet.args = {
  open: true,
  networks: [
    { name: 'Godwoken', chainId: 71402 },
    { name: 'Zksync', chainId: 324 },
  ],
  currentNetwork: 324,
}
