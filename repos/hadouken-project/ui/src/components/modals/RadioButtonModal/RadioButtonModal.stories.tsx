import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { StoryObj } from '@storybook/react'

import RadioButtonModal from './'

export default {
  title: 'Components/Modals/RadioButtonModal',
  description: '',
  component: RadioButtonModal,
}

type Story = StoryObj<ComponentProps<typeof RadioButtonModal>>

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
        <RadioButtonModal
          {...args}
          open={open}
          handleClose={() => setOpen(false)}
        />
      </Box>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  open: true,
}
