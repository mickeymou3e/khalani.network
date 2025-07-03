import React from 'react'

import { Stack } from '@mui/material'
import {
  formatWithCommas,
  getNetworkIcon,
  getTokenIconComponent,
  IChain,
  PrimaryButton,
  Typography,
} from '@tvl-labs/khalani-ui'
import { getDepositDestinationChain, IMTokenBalances } from '@tvl-labs/sdk'

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
