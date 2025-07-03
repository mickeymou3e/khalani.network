import React, { ComponentProps } from 'react'

import { ENetwork } from '@interfaces/core'
import { Button, Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TransactionComplete from './TransactionComplete.component'

export default {
  title: 'Components/TransactionComplete',
  description: '',
  component: TransactionComplete,
}

const Template: Story<ComponentProps<typeof TransactionComplete>> = (args) => {
  const [open, setOpen] = React.useState(true)

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
        <TransactionComplete
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </Paper>
    </Container>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  text: 'Transaction Complete',
  sourceNetworkId: ENetwork.MumbaiTestnet,
  destinationNetworkId: ENetwork.AvalancheTestnet,
  tokenAmount: 10000000n,
  tokenSymbol: 'ETH',
}
