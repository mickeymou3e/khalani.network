import React, { ComponentProps, useState } from 'react'

import Typography from '@components/Typography'
import Button from '@components/buttons/Button'
import { CopyClipboardIcon } from '@components/icons'
import { ENetwork, ETransactionStatus } from '@interfaces/core'
import { Box, IconButton, Paper, Stack } from '@mui/material'
import { Story } from '@storybook/react'
import { getTokenComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'
import { getAddressLabel } from '@utils/text'

import TransferDetailsModal from './TransferDetailsModal.component'

export default {
  title: 'Components/Modals/TransferDetailsModal',
  description: '',
  component: TransferDetailsModal,
}

const Template: Story<ComponentProps<typeof TransferDetailsModal>> = (args) => {
  const [open, setOpen] = useState(true)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <TransferDetailsModal {...args} open={open} onClose={handleClose} />
      </Paper>
      <Box>
        <Button onClick={handleClickOpen} text="open" />
      </Box>
    </>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  tokenSymbol: 'USDC',
  tokenDecimals: 6,
  sourceChain: {
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
  destinationChain: {
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
  amount: 10000000n,
  summaryItems: [
    {
      id: 1,
      label: "Fee's",
      value: (
        <Stack direction="row" alignItems="center" gap={0.5}>
          {getNetworkIcon(ENetwork.EthereumSepolia, {
            style: { width: 16, height: 16 },
          })}
          <Typography
            text="0.004 ETH $1.12"
            variant="caption"
            fontWeight={500}
            color="text.secondary"
          />
        </Stack>
      ),
    },
    {
      id: 2,
      label: 'Receive on Avalanche',
      value: (
        <Stack direction="row" alignItems="center" gap={0.5}>
          {getTokenComponent('USDC', { width: 16, height: 16 })}
          <Typography
            text="100,213.00"
            variant="caption"
            fontWeight={700}
            lineHeight={'normal'}
            color="text.secondary"
          />
        </Stack>
      ),
    },
    {
      id: 3,
      label: 'Source address',
      value: (
        <Stack direction="row" alignItems="center">
          <Typography
            text={getAddressLabel('0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419')}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
          <IconButton>
            <CopyClipboardIcon />
          </IconButton>
        </Stack>
      ),
    },
    {
      id: 4,
      label: 'Destination address',
      value: (
        <Stack direction="row" alignItems="center">
          <Typography
            text={getAddressLabel('0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419')}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
          <IconButton>
            <CopyClipboardIcon />
          </IconButton>
        </Stack>
      ),
    },
  ],
  progress: 50n,
  statusText: 'Pending',
  status: ETransactionStatus.Fail,
  buttonText: 'Withdraw',
  handleClick: () => {
    console.log('withdraw')
  },
}
