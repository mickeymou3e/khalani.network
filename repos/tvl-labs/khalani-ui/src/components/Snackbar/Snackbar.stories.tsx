import React, { ComponentProps } from 'react'

import Typography from '@components/Typography'
import { Button, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import Snackbar from './Snackbar.component'

export default {
  title: 'Components/Snackbar',
  description: '',
  component: Snackbar,
}

const Template: Story<ComponentProps<typeof Snackbar>> = (args) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
    >
      <Paper elevation={3} sx={{ px: 2, py: 4 }}>
        <Button onClick={handleClick}>Open Snackbar</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  message: <Typography text="Snackbar body" variant="body2" />,
}
