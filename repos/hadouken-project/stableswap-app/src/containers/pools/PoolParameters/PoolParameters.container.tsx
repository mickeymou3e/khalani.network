import React from 'react'
import { useSelector } from 'react-redux'

import { BOOSTED_POOLS_SYMBOL_LOWER_CASE } from '@components/PoolTable/PoolTable.constants'
import { useSwapFeePercentage } from '@components/PoolTable/PoolTable.hooks'
import {
  AprTooltip,
  convertNumberToStringWithCommas,
  LpTokenBoostedIcon,
  WarningBanner,
} from '@hadouken-project/ui'
import { getTokenIconComponent } from '@hadouken-project/ui/dist/utils/icons'
import { IPool, PoolType } from '@interfaces/pool'
import {
  Box,
  Grid,
  Link,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { poolSelectors } from '@store/pool/selectors/pool.selector'
import { BigDecimal } from '@utils/math'
import { getPoolFullName, isPoolVulnerable } from '@utils/pool'
import { sortAssetsByBusinessOrder } from '@utils/token'

import { messages } from './PoolParameters.messages'

export interface IPoolParametersContainerProps {
  poolId: IPool['id']
}

const PoolParametersContainer: React.FC<IPoolParametersContainerProps> = ({
  poolId,
}) => {
  const protocolSwapFeePercentage = useSwapFeePercentage()
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolModel = selectPoolModelById(poolId)
  const pools = useSelector(poolSelectors.pools)
  const selectPoolTotalValueUSD = useSelector(
    metricsSelectors.selectPoolTotalValueUSD,
  )
  const selectPoolVolume7dUSD = useSelector(
    metricsSelectors.selectPoolVolume7dUSD,
  )
  const selectPoolAPR = useSelector(metricsSelectors.selectPoolAPR)

  const selectPoolSwapFee7dUSD = useSelector(
    metricsSelectors.selectPoolSwapFee7dUSD,
  )

  const poolTotalValueUSD = selectPoolTotalValueUSD(poolId)
  const poolVolume7dUSD = selectPoolVolume7dUSD(poolId)
  const apr = selectPoolAPR(poolId, protocolSwapFeePercentage)
  const showAprTooltip =
    apr.swapApr !== undefined && apr.lendingApr !== undefined
  const poolSwapFee7d = selectPoolSwapFee7dUSD(poolId)

  const poolName = poolModel ? getPoolFullName(poolModel?.pool) : ''
  const isVulnerable = isPoolVulnerable(pools, poolModel?.pool)

  return (
    <Box>
      <Box pl={3} pb={2}>
        {poolModel && (
          <>
            <Tooltip title={poolName}>
              <Typography
                variant="h1"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {poolName}
              </Typography>
            </Tooltip>
            <Box display="flex" gap={1} mt={1}>
              {poolModel?.tokens
                .sort((tokA, tokB) =>
                  sortAssetsByBusinessOrder(
                    tokA.symbol.toLowerCase(),
                    tokB.symbol.toLowerCase(),
                  ),
                )
                .map((token) => {
                  const isBoostedToken = BOOSTED_POOLS_SYMBOL_LOWER_CASE.includes(
                    token.symbol.toLowerCase(),
                  )

                  const weight =
                    poolModel?.pool.tokens.find(
                      (poolToken) => poolToken.address === token.address,
                    )?.weight ?? BigDecimal.from(0)

                  const TokenIcon = getTokenIconComponent(token.symbol)

                  return (
                    <Box
                      display="flex"
                      key={token.id}
                      bgcolor={(theme) => theme.palette.background.paper}
                      px={1}
                      py={0.75}
                      alignItems="center"
                    >
                      {isBoostedToken ? (
                        <LpTokenBoostedIcon style={{ width: 20, height: 20 }} />
                      ) : (
                        <TokenIcon width={20} height={20} />
                      )}
                      <Tooltip title={token.displayName}>
                        <Box display="flex" gap={1} alignItems="center" pl={1}>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            variant="caption"
                          >
                            {token.displayName ?? token.symbol}
                          </Typography>
                          {poolModel.pool.poolType === PoolType.Weighted ||
                          poolModel.pool.poolType ===
                            PoolType.WeightedBoosted ? (
                            <Typography
                              variant="caption"
                              color={(theme) => theme.palette.text.gray}
                            >
                              {Number(weight?.toString()) * 100}%
                            </Typography>
                          ) : null}
                        </Box>
                      </Tooltip>
                    </Box>
                  )
                })}
            </Box>
          </>
        )}
        {!poolModel && (
          <Box width="45%">
            <Skeleton height={60} />
            <Box display="flex">
              <Skeleton height={40} width="20%" sx={{ marginRight: 1 }} />
              <Skeleton height={40} width="20%" />
            </Box>
          </Box>
        )}
      </Box>
      {isVulnerable ? (
        <Box pb={2}>
          <WarningBanner
            title={messages.VULNERABILITY_TITLE}
            description={
              <>
                {messages.VULNERABILITY_DESCRIPTION}
                <Link href={messages.VULNERABILITY_LINK}>
                  {messages.VULNERABILITY_LINK_TEXT}
                </Link>
              </>
            }
          />
        </Box>
      ) : null}
      <Box>
        <Paper
          elevation={3}
          sx={{
            paddingX: { xs: 2, md: 3 },
          }}
        >
          {/*// TODO: Data Charts appears there*/}
          <Box pt={3} pb={3}>
            <Grid container>
              <Grid
                xs={4}
                sx={{ wordBreak: 'break-all' }}
                p={1.5}
                borderTop={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                borderBottom={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                item
              >
                <Typography variant="paragraphSmall" color="textSecondary">
                  {messages.POOL_VALUE_PARAMETER}
                </Typography>
                <Typography variant="paragraphMedium">
                  $
                  {convertNumberToStringWithCommas(
                    poolTotalValueUSD.toNumber(),
                  )}
                </Typography>
              </Grid>
              <Grid
                xs={3}
                p={1.5}
                border={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                item
              >
                <Typography variant="paragraphSmall" color="textSecondary">
                  {messages.VOLUME_PARAMETER}
                </Typography>
                <Typography variant="paragraphMedium">
                  ${convertNumberToStringWithCommas(poolVolume7dUSD.toNumber())}
                </Typography>
              </Grid>
              <Grid
                xs={3}
                p={1.5}
                border={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                item
              >
                <Typography variant="paragraphSmall" color="textSecondary">
                  {messages.FEES_PARAMETER}
                </Typography>
                <Typography variant="paragraphMedium">
                  ${convertNumberToStringWithCommas(poolSwapFee7d.toNumber())}
                </Typography>
              </Grid>
              <Grid
                xs={2}
                p={1.5}
                borderTop={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                borderBottom={(theme) =>
                  `1px solid ${theme.palette.background.backgroundBorder}`
                }
                item
              >
                <Typography variant="paragraphSmall" color="textSecondary">
                  {messages.APR_PARAMETER}
                </Typography>
                <Grid container spacing="4">
                  <Grid item>
                    <Typography variant="paragraphMedium">
                      {apr.totalApr.toNumber().toFixed(2)}%
                    </Typography>
                  </Grid>
                  {showAprTooltip ? (
                    <Grid item>
                      <AprTooltip
                        apr={{
                          swapApr: apr.swapApr.toNumber(),
                          lendingApr: apr.lendingApr.toNumber(),
                          totalApr: apr.totalApr.toNumber(),
                        }}
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default PoolParametersContainer
