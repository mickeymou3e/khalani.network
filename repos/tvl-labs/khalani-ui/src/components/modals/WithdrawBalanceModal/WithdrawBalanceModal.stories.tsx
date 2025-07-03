import React, { ComponentProps, useState } from 'react'

import Typography from '@components/Typography'
import Button from '@components/buttons/Button'
import PrimaryButton from '@components/buttons/PrimaryButton'
import { ENetwork } from '@interfaces/core'
import { Box, Paper, Stack } from '@mui/material'
import { Story } from '@storybook/react'
import { getTokenComponent } from '@utils/icons'
import { getNetworkIcon } from '@utils/network'

import WithdrawBalanceModal from './WithdrawBalanceModal.component'

export default {
  title: 'Components/Modals/WithdrawBalanceModal',
  description: '',
  component: WithdrawBalanceModal,
}

const Template: Story<ComponentProps<typeof WithdrawBalanceModal>> = (args) => {
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
        <WithdrawBalanceModal {...args} open={open} onClose={handleClose} />
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
  buttonComponent: (
    <PrimaryButton
      text="Withdraw"
      onClick={() => console.log('submit')}
      sx={{ padding: '0 25px' }}
    />
  ),
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
  amount: '1000',
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
  ],
}
