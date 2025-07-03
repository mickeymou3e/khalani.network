import React from 'react'

import { ENetwork, OperationStatus } from '@interfaces/core'
import { SwapVert } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Story } from '@storybook/react'
import { getNetworkIcon } from '@utils/network'

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  BellIcon,
  BorrowIcon,
  CloseIcon,
  CopyClipboardIcon,
  DepositIcon,
  DiscordIcon,
  ErrorIcon,
  GithubIcon,
  HyperlinkIcon,
  NetworkIcon,
  SearchIcon,
  SwapRight,
  TwitterIcon,
  WalletIcon,
  InvestIcon,
  WithdrawIcon,
  LogoIcon,
  SettingsIcon,
  CompletedIcon,
  ExplorerErrorIcon,
  PendingIcon,
  ExplorerArrowRightIcon,
  DoorIcon,
  TransferIcon,
  SuccessMark,
} from './index'
import { WrongLogo } from './networks'
import TelegramIcon from './socials/Telegram/Telegram.component'
import {
  BnbIcon,
  BtcIcon,
  BusdBoostedIcon,
  BusdIcon,
  CkbIcon,
  DaiBoostedIcon,
  DaiIcon,
  EthBoostedIcon,
  EthIcon,
  KaiIcon,
  LpTokenBoostedIcon,
  LpTokenIcon,
  UsdcBoostedIcon,
  UsdcIcon,
  UsdtBoostedIcon,
  UsdtIcon,
  WbtcIcon,
  StkBusdIcon,
  StkUsdcIcon,
  StkUsdtIcon,
} from './tokens'
import { MetamaskIcon, WalletconnectIcon } from './wallets'

export default {
  title: 'Components/Icons/icons',
  description: '',
  component: History,
}

const Template: Story = () => (
  <Paper>
    <Box display="flex" justifyContent="space-between" width={400}>
      <Typography>Currencies</Typography>

      <BnbIcon />
      <BtcIcon />
      <CkbIcon />
      <DaiIcon />
      <EthIcon />
      <UsdcIcon />
      <UsdtIcon />
      <BusdIcon />
      <WbtcIcon />
      <LpTokenIcon />
      <KaiIcon />

      <DaiBoostedIcon />
      <EthBoostedIcon />
      <LpTokenBoostedIcon />
      <UsdcBoostedIcon />
      <UsdtBoostedIcon />
      <BusdBoostedIcon />
    </Box>

    <Box display="flex" gap={3}>
      <Typography>Stake tokens</Typography>

      <StkBusdIcon />
      <StkUsdcIcon />
      <StkUsdtIcon />
    </Box>

    <Box pt={3} display="flex" justifyContent="space-between" width={200}>
      <Typography>Social</Typography>
      <TwitterIcon />
      <GithubIcon />
      <DiscordIcon />
      <TwitterIcon />
      <TelegramIcon />
    </Box>
    <Box pt={3} display="flex" justifyContent="space-between" width={600}>
      <Typography>Business</Typography>
      <ArrowLeftIcon />
      <ArrowUpIcon />
      <ArrowDownIcon />
      <BellIcon />
      <CloseIcon />
      <CopyClipboardIcon />
      <ErrorIcon />
      <HyperlinkIcon />
      <SearchIcon />
      <SwapRight />
      <ExplorerArrowRightIcon />
      <SwapVert />
      <WalletIcon />
      <NetworkIcon />
      <BorrowIcon />
      <DepositIcon />
      <InvestIcon />
      <WithdrawIcon />
      <SettingsIcon />
      <CompletedIcon />
      <ExplorerErrorIcon />
      <PendingIcon />
      <DoorIcon />
      <TransferIcon />
      <SuccessMark />
    </Box>
    <Box pt={3} display="flex" justifyContent="space-between" width={300}>
      <Typography>Logo</Typography>
      <LogoIcon />
    </Box>

    <Box pt={2}>
      <Typography>Network logos</Typography>
      <Box>
        {getNetworkIcon(ENetwork.BscTestnet)}
        {getNetworkIcon(ENetwork.Holesky)}
        {getNetworkIcon(ENetwork.AvalancheTestnet)}
        {getNetworkIcon(ENetwork.Khalani)}
        {getNetworkIcon(ENetwork.MumbaiTestnet)}
        {getNetworkIcon(ENetwork.OptimismSepolia)}
        {getNetworkIcon(ENetwork.GodwokenTestnet)}
        {getNetworkIcon(ENetwork.ArbitrumSepolia)}
        {getNetworkIcon(ENetwork.BaseSepolia)}
        <WrongLogo />
      </Box>
    </Box>

    <Box pt={2}>
      <Typography>Wallets</Typography>
      <Box>
        <WalletconnectIcon />
        <MetamaskIcon />
      </Box>
    </Box>
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'Approve token transfer',
  description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
  status: OperationStatus.Success,
}
