import React, { ComponentProps, useEffect, useState } from 'react'

import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react/types-6-0'

import RadioButtonModal from './'

export default {
  title: 'Components/Modals/RadioButtonModal',
  description: '',
  component: RadioButtonModal,
}

const Template: Story<ComponentProps<typeof RadioButtonModal>> = (args) => {
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
}

export const Basic = Template.bind({})

Basic.args = {
  open: true,
}
