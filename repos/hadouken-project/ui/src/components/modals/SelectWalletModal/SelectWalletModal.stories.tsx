import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import SelectWalletModal from './'

export default {
  title: 'Components/Modals/SelectWalletModal',
  description: '',
  component: SelectWalletModal,
}

type Story = StoryObj<ComponentProps<typeof SelectWalletModal>>

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
        <SelectWalletModal
          open={open}
          handleClose={() => setOpen(false)}
          disableMetamask={false}
          disableWalletConnect={false}
        />
      </Box>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  open: true,
}
