import React from 'react'
import { useSelector } from 'react-redux'

import { useSwapFeePercentage } from '@components/PoolTable/PoolTable.hooks'
import { getTokenComponent } from '@hadouken-project/ui/dist/utils/icons'
import { GENERIC_POOL_SYMBOL, IPool } from '@interfaces/pool'
import { Box, Grid, Paper, Skeleton, Tooltip, Typography } from '@mui/material'
import { metricsSelectors } from '@store/metrics/metrics.selectors'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { messages } from './PoolParameters.messages'

export interface IPoolParametersContainerProps {
  poolId: IPool['id']
}

const PoolParametersContainer: React.FC<IPoolParametersContainerProps> = ({
  poolId,
}) => {
  const isFetching = false

  const protocolSwapFeePercentage = useSwapFeePercentage()
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const selectManyTokens = useSelector(tokenSelectors.selectMany)
  const poolModel = selectPoolModelById(poolId)

  const tokens =
    poolModel &&
    selectManyTokens(poolModel.tokens.map(({ address }) => address))

  poolModel?.pool?.totalSwapFee
  poolModel?.pool?.totalSwapVolume
  const selectPoolTotalValueUSD = useSelector(
    metricsSelectors.selectPoolTotalValueUSD,
  )
  const selectPoolVolume24hUSD = useSelector(
    metricsSelectors.selectPoolVolume24hUSD,
  )
  const selectPoolAPR = useSelector(metricsSelectors.selectPoolAPR)

  const selectPoolSwapFee24hUSD = useSelector(
    metricsSelectors.selectPoolSwapFee24hUSD,
  )

  const poolTotalValueUSD = selectPoolTotalValueUSD(poolId)
  const poolVolume24hUSD = selectPoolVolume24hUSD(poolId)
  const apr = selectPoolAPR(poolId, protocolSwapFeePercentage)
  const poolSwapFee24h = selectPoolSwapFee24hUSD(poolId)

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        {!isFetching && (
          <>
            <Tooltip title={poolModel?.pool.name ?? ''}>
              <Typography
                variant="h1"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {poolModel?.pool.name}
              </Typography>
            </Tooltip>
            {tokens?.map((token) => (
              <Box ml={2} display="flex" key={token.id}>
                {getTokenComponent(
                  token.isLpToken ? GENERIC_POOL_SYMBOL : token.symbol,
                  { height: 24, width: 24 },
                )}
                <Tooltip title={token.name}>
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      ml: 1,
                    }}
                    variant="caption"
                  >
                    {token.symbol}
                  </Typography>
                </Tooltip>
              </Box>
            ))}
          </>
        )}
        {isFetching && <Skeleton height={50} width="40%" />}
      </Box>
      <Box pb={6}>
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
                xs={3}
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
                  ${poolTotalValueUSD.toFixed(2)}
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
                  ${poolVolume24hUSD.toFixed(2)}
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
                  ${poolSwapFee24h.toFixed(2)}
                </Typography>
              </Grid>
              <Grid
                xs={3}
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
                <Typography variant="paragraphMedium">
                  {apr.toFixed(2)}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default PoolParametersContainer
