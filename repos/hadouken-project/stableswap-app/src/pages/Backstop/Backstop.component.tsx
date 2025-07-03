import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import ActionInProgressBanner from '@components/banners/ActionInProgressBanner/ActionInProgressBanner.component'
import {
  Button,
  Table,
  TableSkeleton,
  ToggleGroup,
  TokenInput,
} from '@hadouken-project/ui'
import { ActionInProgress } from '@interfaces/action'
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material'
import { backstopSelectors } from '@store/backstop/backstop.selector'
import { backstopActions } from '@store/backstop/backstop.slice'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'

import {
  LIQUIDATIONS_LIMIT,
  TOGGLE_OPTIONS_LIQUIDITY,
} from './Backstop.constants'
import { MESSAGES } from './Backstop.messages'
import { COLUMNS, getRows } from './Backstop.table'
import { BackstopToggle } from './Backstop.types'

const BackstopPage: React.FC = () => {
  const dispatch = useDispatch()
  const [selectedToggle, setSelectedToggle] = useState<BackstopToggle>(
    BackstopToggle.Stake,
  )

  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const chainId = useSelector(networkSelectors.applicationChainId)
  const backstopToken = useSelector(backstopSelectors.backstopToken)
  const liquidationToken = useSelector(backstopSelectors.liquidationToken)
  const isInitialized = useSelector(backstopSelectors.isInitialized)
  const apr = useSelector(backstopSelectors.apr)
  const hasMore = useSelector(backstopSelectors.hasMore)

  const backstopTotalBalance = useSelector(
    backstopSelectors.backstopTotalBalance,
  )

  const liquidations = useSelector(backstopSelectors.liquidations)

  const liquidationRows = getRows(liquidations, chainId)

  const [amount, setAmount] = useState(BigNumber.from(0))
  const [withdrawAmount, setWithdrawAmount] = useState(BigNumber.from(0))

  useEffect(() => {
    if (isInitialized === null) {
      dispatch(backstopActions.initializeBackstopRequest())
    }
  }, [dispatch, isInitialized])

  const tokenBalance = useSelector(userBalancesSelectors.selectUserTokenBalance)
  const liquidityTokenBalance = tokenBalance(
    liquidationToken ? liquidationToken.address : '',
  )

  const userPoolBalance = tokenBalance(backstopToken?.address ?? '')

  const onToggleChange = (value: BackstopToggle) => {
    setSelectedToggle(value)
  }

  const onDeposit = async () => {
    dispatch(
      backstopActions.depositToBackstopRequest({
        amount: BigDecimal.from(amount, liquidationToken?.decimals),
      }),
    )
  }

  const onWithdraw = async () => {
    dispatch(
      backstopActions.backstopWithdrawRequest({
        amount: BigDecimal.from(amount, liquidationToken?.decimals),
      }),
    )
  }

  const onLoadMoreClick = () => {
    dispatch(
      backstopActions.loadMoreLiquidationsRequest({
        chainId,
        limit: LIQUIDATIONS_LIMIT,
        skip: liquidations.length,
      }),
    )
  }

  const isReady = isInitialized && liquidationToken && backstopToken

  return (
    <Box>
      <Box pl={3}>
        <Typography variant="h1">{MESSAGES.TITLE}</Typography>
      </Box>
      <Box pt={2}>
        <Paper>
          <Typography
            variant="caption"
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            {MESSAGES.DESCRIPTION}
          </Typography>
        </Paper>
      </Box>

      <Box pt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Paper>
              <Box>
                <ActionInProgressBanner
                  actionInProgress={actionInProgress}
                  currentAction={
                    selectedToggle === BackstopToggle.Stake
                      ? ActionInProgress.BackstopDeposit
                      : ActionInProgress.BackstopWithdraw
                  }
                />
              </Box>
              <ToggleGroup
                toggles={TOGGLE_OPTIONS_LIQUIDITY}
                selected={selectedToggle}
                onToggleChange={onToggleChange}
                sx={{
                  borderColor: (theme) => theme.palette.secondary.dark,
                }}
              />
              <Box pt={2}>
                {!isReady && (
                  <Skeleton variant="rectangular" width="100%" height={56} />
                )}

                {isReady && (
                  <Box pt={2}>
                    {selectedToggle === BackstopToggle.Stake && (
                      <Box>
                        <TokenInput
                          onMaxRequest={() =>
                            setAmount(
                              liquidityTokenBalance
                                ? liquidityTokenBalance.toBigNumber()
                                : BigNumber.from(0),
                            )
                          }
                          maxAmount={
                            liquidityTokenBalance
                              ? liquidityTokenBalance.toBigNumber()
                              : BigNumber.from(0)
                          }
                          amount={amount}
                          onAmountChange={(amount) =>
                            setAmount(amount ?? BigNumber.from(0))
                          }
                          token={{
                            ...liquidationToken,
                            source: '',
                          }}
                          tokenIconStyle={{ width: 64, height: 64 }}
                        />
                      </Box>
                    )}

                    {selectedToggle === BackstopToggle.Unstake && (
                      <Box>
                        <TokenInput
                          onMaxRequest={() =>
                            setAmount(
                              userPoolBalance
                                ? userPoolBalance.toBigNumber()
                                : BigNumber.from(0),
                            )
                          }
                          maxAmount={
                            userPoolBalance
                              ? userPoolBalance.toBigNumber()
                              : BigNumber.from(0)
                          }
                          amount={withdrawAmount}
                          onAmountChange={(amount) =>
                            setWithdrawAmount(amount ?? BigNumber.from(0))
                          }
                          token={{
                            ...backstopToken,
                            source: '',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                <Box pt={2} display="flex" justifyContent="end">
                  <Button
                    disabled={
                      Boolean(actionInProgress) ||
                      amount.eq(0) ||
                      !!(selectedToggle === BackstopToggle.Stake
                        ? liquidityTokenBalance &&
                          amount.gt(liquidityTokenBalance.toBigNumber())
                        : userPoolBalance &&
                          amount.gt(userPoolBalance.toBigNumber()))
                    }
                    isFetching={
                      selectedToggle === BackstopToggle.Stake
                        ? actionInProgress === ActionInProgress.BackstopDeposit
                        : actionInProgress === ActionInProgress.BackstopWithdraw
                    }
                    variant="contained"
                    text={
                      selectedToggle === BackstopToggle.Stake
                        ? MESSAGES.STAKE
                        : MESSAGES.UNSTAKE
                    }
                    onClick={
                      selectedToggle === BackstopToggle.Stake
                        ? onDeposit
                        : onWithdraw
                    }
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper>
              <Box>
                {isReady && (
                  <Typography variant="h5">
                    {backstopTotalBalance.toString()}
                  </Typography>
                )}

                {!isReady && (
                  <Box pb={1}>
                    <Skeleton variant="rectangular" width={200} height={20} />
                  </Box>
                )}

                <Typography
                  color={(theme) => theme.palette.text.gray}
                  variant="paragraphTiny"
                >
                  {MESSAGES.TOTAL_BALANCE}
                </Typography>

                <Box pt={3} display="flex">
                  <Box
                    p={3}
                    width="50%"
                    border={(theme) =>
                      `1px solid ${theme.palette.background.backgroundBorder}`
                    }
                    borderLeft="none"
                  >
                    <Typography variant="caption" color="textSecondary">
                      {MESSAGES.USER_BALANCE}
                    </Typography>
                    {isReady && userPoolBalance && (
                      <Typography>
                        {userPoolBalance?.toFixed(2).toString()}
                      </Typography>
                    )}
                    {!isReady && (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Box>
                  <Box
                    p={3}
                    width="50%"
                    border={(theme) =>
                      `1px solid ${theme.palette.background.backgroundBorder}`
                    }
                    borderRight="none"
                    borderLeft="none"
                  >
                    <Typography variant="caption" color="textSecondary">
                      {MESSAGES.APR}
                    </Typography>
                    {isReady && userPoolBalance && (
                      <Typography>{apr?.toFixed(2).toString()}</Typography>
                    )}
                    {!isReady && (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box pt={4}>
        <Typography pl={3} variant="h2">
          {MESSAGES.LIQUIDATIONS}
        </Typography>
        {isReady && (
          <Box pt={2}>
            <Paper>
              {liquidationRows.length === 0 ? (
                <Typography
                  color={(theme) => theme.palette.text.secondary}
                  align="center"
                  variant="paragraphBig"
                >
                  {MESSAGES.NO_RESULTS}
                </Typography>
              ) : (
                <Table columns={COLUMNS} rows={liquidationRows} />
              )}

              {hasMore && (
                <Box pt={2} display="flex" justifyContent="center">
                  <Button
                    text={MESSAGES.LOAD_MORE}
                    variant="contained"
                    size="medium"
                    onClick={onLoadMoreClick}
                  />
                </Box>
              )}
            </Paper>
          </Box>
        )}
        {!isReady && (
          <Paper>
            <TableSkeleton columns={COLUMNS} />
          </Paper>
        )}
      </Box>
    </Box>
  )
}

export default BackstopPage
