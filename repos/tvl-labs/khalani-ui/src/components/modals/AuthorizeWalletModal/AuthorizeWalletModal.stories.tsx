import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import AuthorizeWalletModal from './'

export default {
  title: 'Components/Modals/AuthorizeWalletModal',
  description: '',
  component: AuthorizeWalletModal,
}

const Template: Story<ComponentProps<typeof AuthorizeWalletModal>> = (args) => {
  const [open, setOpen] = useState(args.open)

  useEffect(() => {
    setOpen(args.open)
  }, [args.open])

  const onClick = () => {
    setOpen(true)
  }

  return (
    <Box>
      <Button onClick={onClick} variant="contained" text="Open" />
      <AuthorizeWalletModal
        {...args}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
}
