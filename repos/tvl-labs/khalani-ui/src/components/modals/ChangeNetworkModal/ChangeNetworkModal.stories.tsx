import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

import ChangeNetworkModal from './ChangeNetworkModal.component'

export default {
  title: 'Components/Modals/ChangeNetworkModal',
  description: '',
  component: ChangeNetworkModal,
}

const Template: Story<ComponentProps<typeof ChangeNetworkModal>> = (args) => {
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
      <ChangeNetworkModal
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
  previousNetwork: 'rostopen',
  expectedNetwork: 'mainnet',
}
