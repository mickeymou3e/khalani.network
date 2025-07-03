import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from '@components/PoolTable/PoolTable.constants'
import { getChainConfig } from '@config'
import { IJoinExit } from '@dataSource/graph/pools/poolLiquidity/types'
import { ISwap } from '@dataSource/graph/pools/poolsSwaps/types'
import { address } from '@dataSource/graph/utils/formatters'
import {
  convertNumberToStringWithCommas,
  ExternalLink,
  getTokenIconWithChainComponent,
  SwapRight,
} from '@hadouken-project/ui'
import { PoolType } from '@interfaces/pool'
import { Box, Typography } from '@mui/material'
import { CompositionType, IPoolModel } from '@store/pool/selectors/models/types'
import { formatDistanceShorten } from '@utils/date'

export const useGetPoolIdFromSlug = (): string => {
  const location = useLocation()
  const poolId = location.pathname.split('/')[3]

  return poolId
}

export const formatTokenSymbol = (symbol: string): string =>
  symbol.replace('.e', '')

export const setPoolIdToSlug = (slug: string, poolId: string): string =>
  slug.replace(':poolId', poolId)

export const poolLiquidityTokens = (
  poolModel: IPoolModel | undefined,
  amounts: IJoinExit['amounts'],
  symbols: IJoinExit['symbols'],
): ReactElement => {
  if (!poolModel || !amounts.length) return <Box />

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      {amounts.map((amount, index) => {
        if (Number(amount) > 0) {
          const tokenSymbol =
            poolModel.pool.poolType === PoolType.ComposableStable
              ? formatTokenSymbol(symbols?.[index] ?? '')
              : formatTokenSymbol(poolModel.pool.tokens[index]?.symbol ?? '')

          const TokenIcon = getTokenIconWithChainComponent(
            tokenSymbol ?? '',
            '',
          )

          return (
            <Box
              bgcolor={(theme) => theme.palette.background.default}
              display="flex"
              alignItems="center"
              p={['6px', '8px']}
              m={0.25}
              key={index}
            >
              <TokenIcon height={20} width={20} />
              <Typography sx={{ ml: 1 }} variant="caption">
                {convertNumberToStringWithCommas(Number(amount), 4, true)}
              </Typography>
            </Box>
          )
        }
        return null
      })}
    </Box>
  )
}

export const poolSwapTokens = (swap: ISwap): ReactElement => {
  const TokenInIcon = getTokenIconWithChainComponent(
    formatTokenSymbol(swap.tokenInSym),
    '',
  )
  const TokenOutIcon = getTokenIconWithChainComponent(
    formatTokenSymbol(swap.tokenOutSym),
    '',
  )

  return (
    <Box display="flex" alignItems="center">
      <Box
        bgcolor={(theme) => theme.palette.background.default}
        display="flex"
        alignItems="center"
        p={['6px', '8px']}
        m={0.25}
      >
        <TokenInIcon height={20} width={20} />
        <Typography sx={{ ml: 1 }} variant="caption">
          {convertNumberToStringWithCommas(Number(swap.tokenAmountIn), 4, true)}
        </Typography>
      </Box>
      <Box ml={1} mr={1}>
        <SwapRight />
      </Box>
      <Box
        bgcolor={(theme) => theme.palette.background.default}
        display="flex"
        alignItems="center"
        p={['6px', '8px']}
        m={0.25}
      >
        <TokenOutIcon height={20} width={20} />
        <Typography sx={{ ml: 1 }} variant="caption">
          {convertNumberToStringWithCommas(
            Number(swap.tokenAmountOut),
            4,
            true,
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export const poolTransactionTime = (
  timestamp: number,
  transactionHash: string,
  chainId: string,
): ReactElement => (
  <Box display="flex" alignItems="center">
    <Typography variant="paragraphMedium">
      {formatDistanceShorten(timestamp * 1000, Date.now(), {
        addSuffix: true,
      })}
    </Typography>
    <Box ml={2}>
      <ExternalLink
        hash={transactionHash}
        type="tx"
        destination={getChainConfig(chainId).explorerUrl.godwoken}
        width={15}
        height={15}
      />
    </Box>
  </Box>
)

export const isDeepLinearPool = (nestedPoolModel: IPoolModel): boolean =>
  nestedPoolModel.compositionBlocks.every((block) => {
    if (block.type === CompositionType.POOL) {
      const pool = block.value as IPoolModel
      if (
        pool.pool.poolType === PoolType.AaveLinear ||
        BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(pool.pool.symbol.toLowerCase())
      )
        return true
    }

    return false
  })

export const isCustomLinearPool = (
  applicationChainId: string,
  poolAddress: string,
): boolean =>
  getChainConfig(applicationChainId).customLinearPools.some(
    (customLinearPoolAddress) =>
      address(customLinearPoolAddress) === address(poolAddress),
  )
