import React from 'react'

import { v4 as uuid } from 'uuid'

import { Box, Skeleton, Stack } from '@mui/material'
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
  Network,
  TokenModelBalanceWithChain,
} from '@tvl-labs/sdk'
import { DepositRecord } from '@tvl-labs/sdk/dist/app/src/services/deposit'
import { IntentHistory } from '@tvl-labs/sdk/dist/app/src/store/intents/intents.types'

import { WithdrawContainerProps } from '../../containers'

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
      clickable: true,
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

export const buildEmptyIntentBalancesRow = (
  deposits: DepositRecord[] | undefined,
  mTokens: TokenModelBalanceWithChain[],
  chains: IChain[],
) => {
  if (!deposits) return []
  return deposits.map((deposit) => {
    const sourceMToken = mTokens.find(
      (token) =>
        token.address.toLowerCase() ===
        deposit.intent.Refinement.srcMToken.toLowerCase(),
    )

    const destMTokens = mTokens.filter((token) =>
      deposit.intent.Refinement.outcome.mTokens.includes(token.address),
    )
    const sourceChain = chains.find(
      (chain) => chain.chainId === sourceMToken?.sourceChainId,
    )
    const TokenIcon = getTokenIconComponent(sourceMToken?.symbol)

    return {
      id: deposit.intentId ?? uuid(),
      tokenSymbol: formatTokenSymbol(sourceMToken?.symbol) ?? '',
      destChain: sourceMToken?.sourceChainId ?? '',
      amount: deposit.intent.srcAmount,
      mToken: deposit.intent.srcMToken,
      isIntentBalance: true,
      clickable: false,
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
                deposit.intent.Refinement.srcAmount,
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
              text={`${bigIntToString(
                deposit.intent.Refinement.outcome.mAmounts[0],
                19,
              )}%`}
              variant="caption"
              color="text.secondary"
            />
          ),
        },
        action: {
          value: (
            <Stack
              alignItems={'flex-end'}
              justifyContent={'flex-end'}
              direction={'row'}
              gap={2}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                text={'Processing'}
              />
              <Skeleton sx={{ bgcolor: '#F72686' }} width={100} />
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
    successMessage: 'Liquidity Withdrawn Successfully',
    pendingMessage: 'Withdrawing Liquidity…',
  }
}

export function getSecondWordAfterColon(inputString: string): string | null {
  const parts = inputString.split(':')
  return parts[1] || null
}
