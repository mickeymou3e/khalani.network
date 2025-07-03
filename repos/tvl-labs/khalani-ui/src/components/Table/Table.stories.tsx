import React, { ComponentProps, useState } from 'react'

import Typography from '@components/Typography'
import PrimaryButton from '@components/buttons/PrimaryButton'
import { createNetworkChip } from '@components/chain/ChainChip/ChainChip.utils'
import TokenWithNetwork from '@components/icons/TokenWithNetwork'
import { ENetwork } from '@interfaces/core'
import { Box, Paper, Stack } from '@mui/material'
import { Story } from '@storybook/react'
import { getNetworkIcon } from '@utils/network'

import Table from './Table.component'
import { ESortOrder, IColumn, IRow } from './Table.types'

const rows = [
  {
    id: 'CKB',
    cells: {
      tokenSymbol: {
        value: (
          <Box display="flex" alignItems="center" gap={1}>
            <TokenWithNetwork
              chainId={ENetwork.EthereumSepolia}
              tokenSymbol="USDT"
              displayBackground
            />
            <Typography
              variant="button"
              text={'USDT'}
              fontWeight={700}
            ></Typography>
          </Box>
        ),
      },
      balance: {
        value: (
          <Typography text="$20,000.00" variant="caption" color="primary" />
        ),
        sortingValue: 'Ethereum',
        filteringValue: ['0x5'],
      },
      targetConstraints: {
        value: (
          <Stack direction="row" gap={1}>
            {getNetworkIcon(ENetwork.Ethereum, {
              style: { width: 16, height: 16 },
            })}
            {getNetworkIcon(ENetwork.Avalanche, {
              style: { width: 16, height: 16 },
            })}
          </Stack>
        ),
      },
      fee: {
        value: (
          <Typography text="%0.1" variant="caption" color="text.secondary" />
        ),
      },
      action: {
        value: (
          <PrimaryButton
            text={'Withdraw'}
            sx={{ fontSize: 14, width: '100%' }}
          />
        ),
      },
    },
  },
  {
    id: 'DAI',
    cells: {
      tokenSymbol: {
        value: (
          <Box display="flex" alignItems="center" gap={1}>
            <TokenWithNetwork
              chainId={ENetwork.EthereumSepolia}
              tokenSymbol="DAI"
              displayBackground
            />
            <Typography
              variant="button"
              text={'DAI'}
              fontWeight={700}
            ></Typography>
          </Box>
        ),
      },
      network: {
        value: createNetworkChip(ENetwork.BscMainnet, 'Bsc Mainnet'),
        sortingValue: 'Bsc',
        filteringValue: ['0x5'],
      },
      balance: {
        value: (
          <Typography text="$20,000.00" variant="caption" color="primary" />
        ),
        sortingValue: 'Ethereum',
        filteringValue: ['0x5'],
      },
      targetConstraints: {
        value: (
          <Stack direction="row" gap={1}>
            {getNetworkIcon(ENetwork.Ethereum, {
              style: { width: 16, height: 16 },
            })}
            {getNetworkIcon(ENetwork.Avalanche, {
              style: { width: 16, height: 16 },
            })}
          </Stack>
        ),
      },
      fee: {
        value: (
          <Typography text="%0.1" variant="caption" color="text.secondary" />
        ),
      },
      action: {
        value: (
          <PrimaryButton
            text={'Withdraw'}
            sx={{ fontSize: 14, width: '100%' }}
          />
        ),
      },
    },
  },
  {
    id: 'USDC',
    cells: {
      tokenSymbol: {
        value: (
          <Box display="flex" alignItems="center" gap={1}>
            <TokenWithNetwork
              chainId={ENetwork.AvalancheTestnet}
              tokenSymbol="USDC"
              displayBackground
            />
            <Typography
              variant="button"
              text={'USDC'}
              fontWeight={700}
            ></Typography>
          </Box>
        ),
      },
      network: {
        value: createNetworkChip(ENetwork.GodwokenTestnet, 'Godwoken Testnet'),
        sortingValue: 'Godwoken',
        filteringValue: ['0x5'],
      },
      balance: {
        value: (
          <Typography text="$20,000.00" variant="caption" color="primary" />
        ),
        sortingValue: 'Ethereum',
        filteringValue: ['0x5'],
      },
      targetConstraints: {
        value: (
          <Stack direction="row" gap={1}>
            {getNetworkIcon(ENetwork.Ethereum, {
              style: { width: 16, height: 16 },
            })}
            {getNetworkIcon(ENetwork.Avalanche, {
              style: { width: 16, height: 16 },
            })}
          </Stack>
        ),
      },
      fee: {
        value: (
          <Typography text="%0.1" variant="caption" color="text.secondary" />
        ),
      },
      action: {
        value: (
          <PrimaryButton
            text={'Withdraw'}
            sx={{ fontSize: 14, width: '100%' }}
          />
        ),
      },
    },
  },
  {
    id: 'USDT',
    cells: {
      tokenSymbol: {
        value: (
          <Box display="flex" alignItems="center" gap={1}>
            <TokenWithNetwork
              chainId={ENetwork.BscMainnet}
              tokenSymbol="KAI"
              displayBackground
            />
            <Typography
              variant="button"
              text={'KAI'}
              fontWeight={700}
            ></Typography>
          </Box>
        ),
      },
      network: {
        value: createNetworkChip(ENetwork.EthereumSepolia, 'Ethereum'),
        sortingValue: 'Ethereum',
        filteringValue: ['0x5'],
      },
      balance: {
        value: (
          <Typography text="$20,000.00" variant="caption" color="primary" />
        ),
        sortingValue: 'Ethereum',
        filteringValue: ['0x5'],
      },
      targetConstraints: {
        value: (
          <Stack direction="row" gap={1}>
            {getNetworkIcon(ENetwork.Ethereum, {
              style: { width: 16, height: 16 },
            })}
            {getNetworkIcon(ENetwork.Avalanche, {
              style: { width: 16, height: 16 },
            })}
          </Stack>
        ),
      },
      fee: {
        value: (
          <Typography text="%0.1" variant="caption" color="text.secondary" />
        ),
      },
      action: {
        value: (
          <PrimaryButton
            text={'Withdraw'}
            sx={{ fontSize: 14, width: '100%' }}
          />
        ),
      },
    },
  },
] as IRow[]

const columns = [
  {
    name: 'tokenSymbol',
    value: 'Token',
    width: '18%',
    align: 'left',
  },
  {
    name: 'balance',
    value: 'My balance',
    width: '18%',
    align: 'left',
    sortOrder: ESortOrder.ASC,
    sortDefault: true,
  },
  {
    name: 'targetConstraints',
    value: 'Target Constraints',
    width: '35%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
  {
    name: 'fee',
    value: 'Fee’s',
    width: '15%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
  {
    name: 'action',
    value: '',
    width: '14%',
    align: 'left',
    sortOrder: ESortOrder.DESC,
  },
] as IColumn[]

export default {
  title: 'Components/Tables/Table',
  description: '',
  component: Table,
}

const Template: Story<ComponentProps<typeof Table>> = (args) => {
  const [selectedTab, setSelectedTab] = useState<number | string>('tab1')

  return (
    <Box width={985} margin="0 auto" mt={10}>
      <Paper sx={{ p: 4 }}>
        <Table
          {...args}
          selectedTab={selectedTab}
          handleTabChange={(_, value) => setSelectedTab(value)}
        />
      </Paper>
    </Box>
  )
}

export const Basic = Template.bind({})

Basic.args = {
  displayHeader: true,
  columns,
  rows,
  filteringParams: {
    tokenSymbol: 'USDC',
    network: '0x5',
  },
}

export const Loading = Template.bind({})
Loading.args = {
  displayHeader: true,
  columns,
  rows: [],
  isLoading: true,
}

export const HasNotData = Template.bind({})
HasNotData.args = {
  displayHeader: true,
  columns,
  rows: [],
  isLoading: false,
}

export const WithTabs = Template.bind({})
WithTabs.args = {
  displayHeader: true,
  columns,
  rows,
  tabs: [
    {
      label: 'Tab 1',
      value: 'tab1',
    },
    {
      label: 'Tab 2',
      value: 'tab2',
    },
  ],
  selectedTab: 'tab1',
}
