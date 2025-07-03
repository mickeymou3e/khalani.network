import React, { ComponentProps } from 'react'

import { ETransactionStatus } from '@interfaces/core'
import { Container, Paper } from '@mui/material'
import { Story } from '@storybook/react'

import TransactionProcessing from './TransactionProcessing.component'

export default {
  title: 'Components/TransactionProcessing',
  description: '',
  component: TransactionProcessing,
}

const Template: Story<ComponentProps<typeof TransactionProcessing>> = (
  args,
) => (
  <Container
    maxWidth="md"
    sx={{ mt: 5, position: 'relative', width: 500, height: 400 }}
  >
    <Paper elevation={3} sx={{ px: 2, py: 4 }}>
      <TransactionProcessing {...args} />
    </Paper>
  </Container>
)

const commonProps = {
  sourceChain: {
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
  destinationChain: {
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
  tokenSymbol: 'USDC',
  tokenDecimals: 6,
  amount: 100n,
  progress: 20n,
  statusText: 'Transaction Processing',
  errorMessage: 'Transaction failed',
}

export const Basic = Template.bind({})
Basic.args = {
  ...commonProps,
  status: ETransactionStatus.Pending,
}

export const Success = Template.bind({})
Success.args = {
  ...commonProps,
  status: ETransactionStatus.Success,
}
