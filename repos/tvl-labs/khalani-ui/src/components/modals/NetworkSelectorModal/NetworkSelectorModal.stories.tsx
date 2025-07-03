import React, { ComponentProps, useState } from 'react'

import Button from '@components/buttons/Button'
import { Box, Paper, Typography } from '@mui/material'
import { Story } from '@storybook/react'

import NetworkSelectorModal from './NetworkSelectorModal.component'
import { messages } from './NetworkSelectorModal.messages'

export default {
  title: 'Components/Modals/NetworkSelectorModal',
  description: '',
  component: NetworkSelectorModal,
}

const Template: Story<ComponentProps<typeof NetworkSelectorModal>> = (args) => {
  const [open, setOpen] = useState(true)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const [chain, setChain] = useState(args.chains[1])

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <NetworkSelectorModal
          open={open}
          onClose={handleClose}
          chains={args.chains}
          onChainSelect={setChain}
          selectedChain={chain}
          headerText={messages.SELECT_NETWORK}
        />
      </Paper>
      <Box>
        <Button onClick={handleClickOpen} text="open" />
        <Typography>{chain.chainName}</Typography>
      </Box>
    </>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  chains: [
    {
      id: 43113,
      chainName: 'Avalanche Testnet',
      chainId: '0xa869',
      nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
      },
      blockExplorerUrls: ['https://testnet.snowtrace.io'],
      rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
      logo: 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
      borderColor: '#CC3333',
      poolTokenSymbol: 'USDC.avax',
    },
    {
      id: 1098411886,
      chainName: 'Khalani',
      chainId: '0x41786f6e',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://v1.betanet.gwscan.com/'],
      rpcUrls: ['https://www.axon-node.info'],
      logo: 'https://pbs.twimg.com/media/FdWhUExUUAE30t_.png',
      borderColor: '#228c22',
    },
  ],
}
