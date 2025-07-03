import React from 'react'

import { Box, Stack } from '@mui/material'
import {
  bigIntToString,
  ENetwork,
  formatWithCommas,
  getNetworkIcon,
  getTokenIconComponent,
  IChain,
  PrimaryButton,
  Typography,
} from '@tvl-labs/khalani-ui'
import {
  formatTokenSymbol,
  getDepositDestinationChain,
  IMTokenBalances,
  Network,
  TokenModelBalanceWithChain,
} from '@tvl-labs/sdk'
import { IntentHistory } from '@tvl-labs/sdk/dist/app/src/store/intents/intents.types'

import { WithdrawContainerProps } from '../../containers'

export const buildMTokenBalancesRow = (
  balances: IMTokenBalances[],
  chains: IChain[],
) =>
  balances
    .filter((item) => item.balance > 0n)
    .map((item) => {
      const TokenIcon = getTokenIconComponent(item.tokenSymbol)
      const sourceChain = chains.find(
        (chain) => chain.chainId === item.sourceChainId,
      )

      return {
        id: item.id,
        tokenSymbol: item.tokenSymbol ?? '',
        destChain: item.sourceChainId ?? '',
        mToken: getSecondWordAfterColon(item.id),
        amount: item.balance,
        isIntentBalance: false,
        cells: {
          tokenSymbol: {
            value: (
              <Stack direction="row" alignItems="center" gap={0.5}>
                <TokenIcon />
                <Typography
                  text={item.tokenSymbol}
                  variant="button"
                  fontWeight={700}
                  color="text.secondary"
                />
              </Stack>
            ),
          },
          chain: {
            value: (
              <Stack direction="row" alignItems="center" gap={0.5}>
                {getNetworkIcon(sourceChain?.id)}
                <Typography
                  text={sourceChain?.chainName ?? ''}
                  variant="button"
                  color="text.secondary"
                />
              </Stack>
            ),
          },
          balance: {
            value: (
              <Typography
                text={`${formatWithCommas(item.balance, item.decimals)}`}
                variant="caption"
                color="primary"
              />
            ),
            sortingValue: 'Ethereum',
            filteringValue: ['0x5'],
          },
          provider: {
            value: (
              <Typography
                text={`Hyperlane`}
                variant="caption"
                color="text.secondary"
              />
            ),
          },
          action: {
            value: (
              <Stack alignItems={'flex-end'}>
                <PrimaryButton
                  text={'Withdraw to Origin Chain'}
                  sx={{ fontSize: 14, px: 2 }}
                />
              </Stack>
            ),
          },
        },
      }
    })

export const buildIntentBalancesRow = (
  intentBalances: IntentHistory[] | null,
  mTokens: TokenModelBalanceWithChain[],
  chains: IChain[],
) => {
  if (!intentBalances) return []
  return intentBalances.map((item) => {
    const sourceMToken = mTokens.find(
      (token) =>
        token.address.toLowerCase() === item.intent.srcMToken.toLowerCase(),
    )
    const destMTokens = mTokens.filter((token) =>
      item.intent.outcome.mTokens.includes(token.address.toLowerCase()),
    )
    const sourceChain = chains.find(
      (chain) => chain.chainId === sourceMToken?.sourceChainId,
    )
    const TokenIcon = getTokenIconComponent(sourceMToken?.symbol)

    return {
      id: item.intentId,
      tokenSymbol: formatTokenSymbol(sourceMToken?.symbol) ?? '',
      destChain: sourceMToken?.sourceChainId ?? '',
      amount: item.intent.srcAmount,
      mToken: item.intent.srcMToken,
      isIntentBalance: true,
      cells: {
        tokenSymbol: {
          value: (
            <Box display="flex" alignItems="center" gap={0.5}>
              <TokenIcon />
              <Typography
                variant="button"
                text={formatTokenSymbol(sourceMToken?.symbol) ?? ''}
                fontWeight={700}
                color="text.secondary"
              />
            </Box>
          ),
        },
        chain: {
          value: (
            <Stack direction="row" alignItems="center" gap={0.5}>
              {getNetworkIcon(sourceChain?.id)}
              <Typography
                text={sourceChain?.chainName ?? ''}
                variant="button"
                color="text.secondary"
              />
            </Stack>
          ),
        },
        balance: {
          value: (
            <Typography
              text={`${formatWithCommas(
                item.intent.srcAmount,
                sourceMToken?.decimals ?? 18,
              )}`}
              variant="caption"
              color="primary"
            />
          ),
          sortingValue: 'Ethereum',
          filteringValue: ['0x5'],
        },
        targetConstraints: {
          value: (
            <Stack direction="row" gap={1}>
              {destMTokens.map((token) => (
                <Box key={token.id}>
                  {getNetworkIcon(
                    parseInt(
                      token.sourceChainId ?? Network.ArbitrumSepolia,
                      16,
                    ),
                    {
                      style: { width: 16, height: 16 },
                    },
                  )}
                </Box>
              ))}
            </Stack>
          ),
        },
        fee: {
          value: (
            <Typography
              text={`${bigIntToString(item.intent.outcome.mAmounts[0], 19)}%`}
              variant="caption"
              color="text.secondary"
            />
          ),
        },
        action: {
          value: (
            <Stack alignItems={'flex-end'}>
              <PrimaryButton
                text={'Exit Liquidity Position'}
                sx={{ fontSize: 14, width: 'auto', px: 2 }}
              />
            </Stack>
          ),
        },
      },
    }
  })
}

export const liquidityListData = [
  {
    id: '1',
    sourceChain: ENetwork.AvalancheTestnet,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    destinationChains: [ENetwork.EthereumSepolia, ENetwork.BscTestnet],
    balance: 10000000n,
    fee: 0.5,
  },
  {
    id: '2',
    sourceChain: ENetwork.EthereumSepolia,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    destinationChains: [ENetwork.AvalancheTestnet, ENetwork.OptimismSepolia],
    balance: 20000000n,
    fee: 0.5,
  },
]

export const mapWithdrawProps = (
  foundItem: any,
  chains: IChain[],
): Omit<WithdrawContainerProps, 'open' | 'onClose'> => {
  return {
    id: foundItem.id,
    tokenSymbol: foundItem.tokenSymbol,
    tokenDecimals: 18,
    mToken: foundItem.mToken,
    sourceChain: chains.find(
      (data) => data.chainId === getDepositDestinationChain(),
    ),
    destinationChain: chains.find(
      (data) => data.chainId === foundItem.destChain,
    ),
    amount: foundItem.amount,
    fee: 0,
    outputAmount: foundItem.amount,
    feeUsd: 0,
    feeSymbol: 'ETH',
    isIntentBalance: foundItem.isIntentBalance,
    onSubmit: () => true,
    successMessage: 'MTokens Withdrawn Successfully',
    pendingMessage: 'Withdrawing MTokens…',
  }
}

export function getSecondWordAfterColon(inputString: string): string | null {
  const parts = inputString.split(':')
  return parts[1] || null
}
