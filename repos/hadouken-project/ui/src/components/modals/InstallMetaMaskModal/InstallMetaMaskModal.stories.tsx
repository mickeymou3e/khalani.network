import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import InstallMetaMaskModal from './'

export default {
  title: 'Components/Modals/InstallMetaMaskModal',
  description: '',
  component: InstallMetaMaskModal,
}

type Story = StoryObj<ComponentProps<typeof InstallMetaMaskModal>>

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
        <InstallMetaMaskModal open={open} handleClose={() => setOpen(false)} />
      </Box>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  open: true,
}
