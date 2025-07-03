import React, { ComponentProps, useState } from 'react'

import { Box } from '@mui/material'
import { StoryObj } from '@storybook/react'

import Faucet from './'

export default {
  title: 'Components/Faucet',
  description: '',
  component: Faucet,
}

type Story = StoryObj<ComponentProps<typeof Faucet>>

const Template: Story = {
  render: (args) => {
    const [inProgress, setInProgress] = useState(false)

    const onMintRequest = () => {
      setInProgress(true)

      setTimeout(() => {
        setInProgress(false)
      }, 3000)
    }

    return (
      <Box>
        <Faucet
          {...args}
          onMintRequest={onMintRequest}
          inProgress={inProgress}
        />
      </Box>
    )
  },
}

export const Basic = { ...Template }

Basic.args = {
  tokens: [
    {
      address: '0x123',
      symbol: 'ETH',
      displayName: 'ETH',
      decimals: 18,
      id: '0x123',
      name: 'ETH',
      source: 'eth',
    },
    {
      id: '0x321',
      address: '0x321',
      symbol: 'CKB',
      name: 'CKB',
      displayName: 'CKB',
      decimals: 18,
      source: 'gw',
    },
    {
      id: '0x111',
      address: '0x111',
      symbol: 'USDC',
      source: 'multi',
      name: 'USDC',
      displayName: 'USDC',
      decimals: 6,
    },
  ],
}
