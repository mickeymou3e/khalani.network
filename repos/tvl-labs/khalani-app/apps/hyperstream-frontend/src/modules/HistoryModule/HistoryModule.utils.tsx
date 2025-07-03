import React from 'react'

import { formatDistanceToNow } from 'date-fns'
import { v4 as uuid } from 'uuid'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Box, IconButton, Link, Stack } from '@mui/material'
import { formatAccountAddress } from '@shared/utils/string'
import {
  CopyClipboardIcon,
  EthIcon,
  ETransactionStatus,
  ExplorerArrowRightIcon,
  getAddressLabel,
  getTokenComponent,
  SourceToDestinationChain,
  TokenWithAmount,
  TransactionStatus,
  Typography,
} from '@tvl-labs/khalani-ui'
import {
  BigDecimal,
  formatTokenSymbol,
  getDepositDestinationChain,
  getDepositFee,
  IChain,
  IPrice,
  Network,
  WorkerErrorCodes,
} from '@tvl-labs/sdk'
import sdkConfig from '@tvl-labs/sdk/dist/app/src/config'
import { DepositRecord } from '@tvl-labs/sdk/dist/app/src/services/deposit'
import { IntentHistory } from '@tvl-labs/sdk/dist/app/src/store/intents/intents.types'

import { HistoryListItem } from './HistoryModule.types'

export const convertPostgresHex = (postgresHex: string): string => {
  return postgresHex.replace('\\x', '0x')
}

const constructExplorerUrl = (
  network: Network,
  chains: IChain[],
  transactionHash: string,
) => {
  const foundChain = chains.find((chain) => chain.chainId === network)
  if (!foundChain) return ''
  return `${foundChain.blockExplorerUrls[0]}/tx/${transactionHash}`
}

/**
 * Convert a BigInt (with `inputDecimals` fractional digits) into
 * a decimal string with `decimals` places, rounded half-up.
 *
 * @param {bigint} value
 * @param {number} [decimals=2]
 * @param {number} [inputDecimals=18]
 * @returns {string}
 */
const bigIntToFixed = (
  value: bigint,
  inputDecimals = 18,
  decimals = 2,
): string => {
  const scaleDown = inputDecimals - decimals
  const divisor = 10n ** BigInt(scaleDown)
  const half = divisor / 2n

  const scaled = (value + half) / divisor

  const unit = 10n ** BigInt(decimals)
  const intPart = scaled / unit
  const fracPart = scaled % unit

  const fracStr = String(fracPart).padStart(decimals, '0')

  return `${intPart.toString()}.${fracStr}`
}

export const buildRowItems = (items: HistoryListItem[]) => {
  return items.map((item) => {
    const timeAgo = formatDistanceToNow(new Date(item.timestamp * 1000), {
      addSuffix: true,
    })

    return {
      id: item.id,
      cells: {
        sourceToDestinationChain: {
          value: (
            <Stack direction="column" gap={1.25} pl={2}>
              <Stack direction="row" alignItems="center">
                <AccessTimeIcon sx={{ width: 14, height: 14, color: '#666' }} />
                <Typography
                  text={timeAgo}
                  variant="caption"
                  fontWeight={500}
                  lineHeight={'normal'}
                  color="#666"
                />
              </Stack>

              <SourceToDestinationChain
                sourceChain={item.sourceChain}
                destinationChain={item.destinationChain}
              />
            </Stack>
          ),
        },
        tokenWithAmount: {
          value: (
            <Stack direction="column" gap={2}>
              <Box height={16} />
              <TokenWithAmount
                symbol={formatTokenSymbol(item.tokenSymbol) ?? ''}
                balance={bigIntToFixed(item.balance, item.tokenDecimals)}
                isTooltipVisible
              />
            </Stack>
          ),
        },
        status: {
          value: (
            <Stack direction="column" gap={2} pr={2}>
              <Box height={16} />
              <Stack direction="row" justifyContent="flex-end">
                <TransactionStatus
                  status={item.status}
                  progress={item.progress ?? 0n}
                  statusText={item.statusText}
                  isTooltipVisible
                  // errorMessage={item.errorMessage}
                />
              </Stack>
            </Stack>
          ),
        },
      },
    }
  })
}

export const mapTransferDetailsProps = (
  foundItem: HistoryListItem,
  chains: IChain[],
  selectPriceById: (id: string) => IPrice | undefined,
  withdrawMTokens?: () => void,
) => {
  const price = selectPriceById(foundItem.sourceChain.chainId)
  const depositFee = getDepositFee()

  let depositFeeUsd: string | undefined
  if (price) {
    const depositFeeBD = BigDecimal.from(depositFee, 18)
    const depositFeeUsdBD = depositFeeBD.mul(price?.price)
    depositFeeUsd = depositFeeUsdBD.toFixed(2)
  }
  const summaryItems: {
    id: number
    label: string
    value: React.ReactNode
  }[] = [
    {
      id: 1,
      label: `Fee's`,
      value: (
        <Stack direction="row" alignItems="center" gap={0.5}>
          <EthIcon style={{ width: 16, height: 16 }} />
          <Typography
            text={`${bigIntToFixed(depositFee, 18, 3)} ${
              price ? price?.tokenSymbol : '-'
            } $${depositFeeUsd ?? '-'}`}
            variant="caption"
            fontWeight={500}
            color="text.secondary"
          />
        </Stack>
      ),
    },
    {
      id: 2,
      label: `Receive on ${foundItem.destinationChain.chainName}`,
      value: (
        <Stack direction="row" alignItems="center" gap={0.5}>
          {getTokenComponent(foundItem.tokenSymbol, {
            width: 16,
            height: 16,
          })}
          <Typography
            text={bigIntToFixed(
              foundItem.outcomeAmount,
              foundItem.tokenDecimals,
              2,
            )}
            variant="caption"
            fontWeight={700}
            lineHeight={'normal'}
            color="text.secondary"
          />
        </Stack>
      ),
    },
    {
      id: 3,
      label: 'Source address',
      value: (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <Typography
            text={getAddressLabel(foundItem.sourceAddress)}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
          <IconButton sx={{ p: 0 }}>
            <CopyClipboardIcon />
          </IconButton>
        </Stack>
      ),
    },
    {
      id: 4,
      label: 'Destination address',
      value: (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <Typography
            text={getAddressLabel(foundItem.destinationAddress)}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
          <IconButton sx={{ p: 0 }}>
            <CopyClipboardIcon />
          </IconButton>
        </Stack>
      ),
    },
    {
      id: 5,
      label: 'Solver preference',
      value: (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <Typography
            text={'Fastest'}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
        </Stack>
      ),
    },
    {
      id: 6,
      label: 'Solver address',
      value: (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={0.5}
        >
          <Typography
            text={getAddressLabel(sdkConfig.solver)}
            variant="caption"
            fontWeight={500}
            lineHeight={'normal'}
            color="text.secondary"
          />
          <IconButton sx={{ p: 0 }}>
            <CopyClipboardIcon />
          </IconButton>
        </Stack>
      ),
    },
    {
      id: 7,
      label: 'Spoke Deposit Tx',
      value: (
        <Link
          href={constructExplorerUrl(
            foundItem.sourceChain.chainId as Network,
            chains,
            foundItem.depositTx ?? '',
          )}
          target="_blank"
        >
          <Stack direction="row" alignItems="center">
            <Typography
              text={formatAccountAddress(foundItem.depositTx ?? '-')}
              variant="caption"
              fontWeight={500}
              lineHeight={'normal'}
              color="text.secondary"
            />
            <IconButton>
              <ExplorerArrowRightIcon
                fill="#000"
                style={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Stack>
        </Link>
      ),
    },
  ]

  if (foundItem.transactionHash) {
    summaryItems.push({
      id: 9,
      label: 'Hub Publish Intent Tx',
      value: (
        <Link
          href={constructExplorerUrl(
            getDepositDestinationChain(),
            chains,
            foundItem.transactionHash,
          )}
          target="_blank"
        >
          <Stack direction="row" alignItems="center">
            <Typography
              text={formatAccountAddress(foundItem.transactionHash)}
              variant="caption"
              fontWeight={500}
              lineHeight={'normal'}
              color="text.secondary"
            />
            <IconButton>
              <ExplorerArrowRightIcon
                fill="#000"
                style={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Stack>
        </Link>
      ),
    })
  }

  return {
    itemId: foundItem.id,
    tokenSymbol: foundItem.tokenSymbol ?? '',
    sourceChain: foundItem.sourceChain,
    destinationChain: foundItem.destinationChain,
    destChains: foundItem.destChains,
    amount: foundItem.balance,
    tokenDecimals: foundItem.tokenDecimals,
    outcomeAmount: foundItem.outcomeAmount,
    summaryItems,
    progress: foundItem.progress ?? 0n,
    statusText: foundItem.statusText,
    status: foundItem.status,
    errorMessage: foundItem.errorMessage,
    buttonText:
      foundItem.errorCode === WorkerErrorCodes.PublishRevert
        ? 'Withdraw MTokens'
        : undefined,
    handleClick: withdrawMTokens,
    onSourceChainClick: foundItem.depositTx
      ? () => {
          window.open(
            constructExplorerUrl(
              foundItem.sourceChain.chainId as Network,
              chains,
              foundItem.depositTx ?? '',
            ),
          )
        }
      : undefined,
    onDestinationChainClick: foundItem.destinationTxHash
      ? () => {
          window.open(
            constructExplorerUrl(
              foundItem.destinationChain.chainId as Network,
              chains,
              convertPostgresHex(foundItem.destinationTxHash ?? ''),
            ),
          )
        }
      : undefined,
  }
}

export const mapDepositEntity = (
  entity: DepositRecord,
): HistoryListItem | null => {
  const errorCode = entity.errorMessage
    ? entity.errorMessage.split(':')[0]
    : undefined

  const mTokens = sdkConfig.mTokens
  const srcMToken = mTokens.find(
    (mToken) =>
      mToken.address.toLowerCase() ===
      entity.intent.Refinement.srcMToken.toLowerCase(),
  )
  const destMToken = mTokens.find(
    (mToken) =>
      mToken.address.toLowerCase() ===
      entity.intent.Refinement.outcome.mTokens[0].toLowerCase(),
  )

  const sourceChain = sdkConfig.supportedChains.find(
    (chain) => chain.chainId === srcMToken?.sourceChainId,
  )
  const destinationChain = sdkConfig.supportedChains.find(
    (chain) => chain.chainId === destMToken?.sourceChainId,
  )

  let progress = 25n
  let status = ETransactionStatus.Pending
  let statusText = 'Publishing Intent'

  if (entity.status === 'pending') {
    status = ETransactionStatus.Pending
    statusText = 'Publishing Intent'
  } else if (entity.status === 'success') {
    status = ETransactionStatus.Pending
    progress = 50n
    statusText = 'Awaiting Solution'
  } else if (entity.status === 'error') {
    status = ETransactionStatus.Fail
    statusText = 'Failed to publish intent'
  }

  if (!sourceChain || !destinationChain) {
    console.error('Source or destination chain not found')
    return null
  }

  return {
    id: entity.intentId ?? uuid(),
    timestamp: entity.createdAt
      ? Math.floor(new Date(entity.createdAt).getTime() / 1000)
      : 0,
    sourceChain,
    destinationChain,
    transactionHash: '',
    depositTx: entity.depositTx ?? '',
    tokenSymbol: formatTokenSymbol(srcMToken?.symbol) ?? '',
    tokenDecimals: srcMToken?.decimals ?? 18,
    balance: BigInt(entity.intent.Refinement.srcAmount),
    outcomeAmount: BigInt(entity.intent.Refinement.outcome.mAmounts[0]),
    status,
    sourceAddress: entity.intent.Refinement.author ?? '',
    destinationAddress: entity.intent.Refinement.author ?? '',
    statusText,
    progress,
    errorMessage: errorCode ? parseErrorMessage(errorCode) : undefined,
    errorCode,
    intentType: entity.intent.Refinement.outcome.fillStructure,
  }
}

export const mapIntentEntity = (
  entity: IntentHistory,
): HistoryListItem | null => {
  const mTokens = sdkConfig.mTokens
  const srcMToken = mTokens.find(
    (mToken) =>
      mToken.address.toLowerCase() === entity.intent.srcMToken.toLowerCase(),
  )
  const destMToken = mTokens.find(
    (mToken) =>
      mToken.address.toLowerCase() ===
      entity.intent.outcome.mTokens[0].toLowerCase(),
  )

  const sourceChain = sdkConfig.supportedChains.find(
    (chain) => chain.chainId === srcMToken?.sourceChainId,
  )
  const destinationChain = sdkConfig.supportedChains.find(
    (chain) => chain.chainId === destMToken?.sourceChainId,
  )

  let progress = 0n
  let statusText = 'Publishing Intent'
  if (entity.transactions.withdraw_tx_hash) {
    statusText = 'Awaiting Settlement'
    progress = 75n
  } else if (entity.transactions.publish_tx_hash) {
    statusText = 'Awaiting Solution'
    progress = 50n
  }

  let status = ETransactionStatus.Pending

  if (entity.transactions.error_timestamp) {
    status = ETransactionStatus.Fail
  } else {
    status = ETransactionStatus.Pending
  }

  if (!sourceChain || !destinationChain) {
    console.error('Source or destination chain not found')
    return null
  }

  return {
    id: entity.intentId,
    timestamp: entity.transactions.publish_timestamp ?? 0,
    sourceChain,
    destinationChain,
    transactionHash: entity.transactions.publish_tx_hash ?? '',
    withdrawTxHash: entity.transactions.withdraw_tx_hash ?? '',
    tokenSymbol: formatTokenSymbol(srcMToken?.symbol) ?? '',
    tokenDecimals: srcMToken?.decimals ?? 18,
    balance: entity.intent.srcAmount,
    outcomeAmount: entity.intent.outcome.mAmounts[0],
    status,
    sourceAddress: entity.intent.author ?? '',
    destinationAddress: entity.intent.author ?? '',
    statusText,
    progress,
  }
}

const parseErrorMessage = (error: string) => {
  switch (error) {
    case WorkerErrorCodes.PublishRevert:
      return 'Publish Intent Revert'
    case WorkerErrorCodes.ExecTimeout:
      return 'Deposit Tokens Failed'
    default:
      return 'Provider Error'
  }
}
