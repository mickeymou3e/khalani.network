import React from 'react'

import { OperationStatus } from '@interfaces/core'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { StoryObj } from '@storybook/react'
import { getTokenIconWithChainComponent } from '@utils/icons'

import {
  AprIcon,
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
  InvestIcon,
  LogoIcon,
  MetamaskIcon,
  NetworkIcon,
  SearchIcon,
  SwapRight,
  TwitterIcon,
  WalletConnectIcon,
  WalletIcon,
  WithdrawIcon,
} from './index'
import {
  BinanceLogo,
  EthereumLogo,
  GodwokenLogo,
  GodwokenTestnetLogo,
  MantleLogo,
  MantleTestnetLogo,
  WrongLogo,
  ZksyncLogo,
  ZksyncTestnetLogo,
} from './networks'
import {
  BnbIcon,
  BtcIcon,
  BusdIcon,
  BusdLinearIcon,
  CelerIcon,
  CkbIcon,
  CkbLinearIcon,
  DaiIcon,
  DaiLinearIcon,
  EthIcon,
  EthLinearIcon,
  HadoukenBackstopToken,
  HadoukenToken,
  LpTokenBoostedIcon,
  MultichainIcon,
  TriCryptoBoostedCKB,
  UsdcIcon,
  UsdcLinearIcon,
  UsdtIcon,
  UsdtLinearIcon,
  WbtcIcon,
} from './tokens'
import { TriCryptoBoostedWBTC } from './tokens/boosted/TriCryptoBoosted'
import { BtcLinearIcon } from './tokens/linear/BtcLinear'

export default {
  title: 'Components/Icons/icons',
  description: '',
  component: History,
}

const CeUSDC = getTokenIconWithChainComponent('USDC', 'ce')
const BscUSDC = getTokenIconWithChainComponent('USDC', 'bsc')
const EthUSDC = getTokenIconWithChainComponent('USDC', 'eth')
const MultiUSDC = getTokenIconWithChainComponent('USDC', 'multi')

const Template: StoryObj = {
  render: () => (
    <Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width={400}
        gap={1}
      >
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

        <DaiLinearIcon />
        <EthLinearIcon />
        <LpTokenBoostedIcon />
        <UsdcLinearIcon />
        <UsdtLinearIcon />
        <BusdLinearIcon />
        <CelerIcon />
        <MultichainIcon />
        <CkbLinearIcon />
        <BtcLinearIcon />

        <TriCryptoBoostedCKB />
        <TriCryptoBoostedWBTC />

        <HadoukenBackstopToken />
        <HadoukenToken />
      </Box>

      <Box
        pt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width={400}
        gap={1}
      >
        <Typography>Currencies with source</Typography>

        <EthUSDC />
        <BscUSDC />
        <CeUSDC />
        <MultiUSDC />
      </Box>

      <Box
        pt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width={200}
        gap={1}
      >
        <Typography>Social</Typography>
        <TwitterIcon />
        <GithubIcon />
        <DiscordIcon />
        <TwitterIcon />
      </Box>
      <Box
        pt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width={600}
        gap={1}
      >
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
        <AprIcon />
        <MetamaskIcon />
        <WalletConnectIcon />
      </Box>
      <Box
        pt={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={300}
      >
        <Typography>Logo</Typography>
        <LogoIcon />
      </Box>

      <Box
        pt={3}
        display="flex"
        justifyContent="space-between"
        width={400}
        gap={1}
      >
        <Typography>Network logos</Typography>
        <BinanceLogo />
        <EthereumLogo />
        <GodwokenLogo />
        <GodwokenTestnetLogo />
        <ZksyncLogo />
        <ZksyncTestnetLogo />
        <MantleLogo />
        <MantleTestnetLogo />
        <WrongLogo />
      </Box>
    </Paper>
  ),
}

export const Basic = { ...Template }

Basic.args = {
  title: 'Approve token transfer',
  description: `The operation allow contract to transfer 1.00 DAI tokens to 3pool contract`,
  status: OperationStatus.Success,
}
