import React from 'react'

import { OperationStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Story } from '@storybook/react/types-6-0'

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
  LogoIcon,
  NetworkIcon,
  SearchIcon,
  SwapRight,
  TwitterIcon,
  WalletIcon,
  InvestIcon,
  WithdrawIcon,
} from './index'
import {
  BinanceLogo,
  EthereumLogo,
  GodwokenLogo,
  GodwokenTestnetLogo,
  WrongLogo,
} from './networks'
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
  LpTokenBoostedIcon,
  LpTokenIcon,
  UsdcBoostedIcon,
  UsdcIcon,
  UsdtBoostedIcon,
  UsdtIcon,
  WbtcIcon,
} from './tokens'

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

      <DaiBoostedIcon />
      <EthBoostedIcon />
      <LpTokenBoostedIcon />
      <UsdcBoostedIcon />
      <UsdtBoostedIcon />
      <BusdBoostedIcon />
    </Box>

    <Box pt={3} display="flex" justifyContent="space-between" width={200}>
      <Typography>Social</Typography>
      <TwitterIcon />
      <GithubIcon />
      <DiscordIcon />
      <TwitterIcon />
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
      <WalletIcon />
      <NetworkIcon />
      <BorrowIcon />
      <DepositIcon />
      <InvestIcon />
      <WithdrawIcon />
    </Box>
    <Box pt={3} display="flex" justifyContent="space-between" width={300}>
      <Typography>Logo</Typography>
      <LogoIcon />
    </Box>

    <Box pt={2}>
      <Typography>Network logos</Typography>
      <BinanceLogo />
      <EthereumLogo />
      <GodwokenLogo />
      <GodwokenTestnetLogo />
      <WrongLogo />
    </Box>
  </Paper>
)

export const Basic = Template.bind({})

Basic.args = {
  title: 'Approve token transfer',
  description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
  status: OperationStatus.Success,
}
