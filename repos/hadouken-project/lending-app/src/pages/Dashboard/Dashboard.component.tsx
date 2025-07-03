import React from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import BorrowPanel from '@components/panels/BorrowPanel'
import DepositPanel from '@components/panels/DepositPanel'
import EmptyPanel from '@components/panels/EmptyPanel'
import BorrowTableSkeleton from '@components/skeletons/BorrowTableSkeleton'
import DepositTableSkeleton from '@components/skeletons/DepositTableSkeleton'
import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import {
  ETH_DECIMALS,
  HEALTH_FACTOR_DECIMAL,
  PERCENTAGE_DECIMAL,
} from '@constants/Lending'
import { Table, convertBigNumberToDecimal } from '@hadouken-project/ui'
import { Box, Grid, Typography } from '@mui/material'
import { userDataSelector } from '@store/userData/userData.selector'

import { messages } from './Dashboard.constants'
import {
  useDashboardBorrowList,
  useDashboardDepositList,
} from './Dashboard.hooks'
import { borrowColumns, depositColumns } from './Dashboard.utils'
import DashboardMobilePage from './DashboardMobile.component'

const DashboardPage: React.FC = () => {
  const dashboardData = useSelector(userDataSelector.userDataInfo)
  const healthFactor = useSelector(userDataSelector.userHealthFactor)

  const assets = useDashboardDepositList()
  const borrowed = useDashboardBorrowList()
  const {
    totalCollateral,
    totalDeposit,
    totalBorrow,
    ltv,
    currentLiquidationThreshold,
  } = dashboardData

  const currentLTV = totalCollateral.isZero()
    ? BigNumber.from(0)
    : totalBorrow
        .mul(BigNumber.from(10).pow(16))
        .div(totalCollateral)
        .div(BigNumber.from(10).pow(12))

  const collateral = totalCollateral
    .mul(ltv)
    .div(BigNumber.from(10).pow(PERCENTAGE_DECIMAL))

  const borrowingPowerUsed = totalCollateral.isZero()
    ? '0'
    : convertBigNumberToDecimal(
        totalBorrow
          .mul(BigNumber.from(10).pow(ETH_DECIMALS))
          .div(collateral.eq(0) ? BigNumber.from(1) : collateral),
        ETH_DECIMALS,
      )

  const args = {
    borrowed: convertBigNumberToDecimal(totalBorrow, ETH_DECIMALS),
    collateral: convertBigNumberToDecimal(totalCollateral, ETH_DECIMALS),
    borrowingPowerUsed,
    healthFactor: healthFactor.eq(MAX_BIG_NUMBER)
      ? 'N/A'
      : numbro(
          convertBigNumberToDecimal(healthFactor, HEALTH_FACTOR_DECIMAL),
        ).format('0.00'),
    LTV: convertBigNumberToDecimal(currentLTV, PERCENTAGE_DECIMAL),
    maxLTV: convertBigNumberToDecimal(ltv, PERCENTAGE_DECIMAL),
    liqThreshold: convertBigNumberToDecimal(
      currentLiquidationThreshold,
      PERCENTAGE_DECIMAL,
    ),
  }

  return (
    <>
      <Box display={{ xs: 'none', md: 'block' }}>
        <Grid container justifyContent="center" alignItems="flex-start">
          <Grid item xs={12}>
            <Typography
              variant="h1"
              sx={{
                paddingBottom: 3,
                paddingLeft: 3,
              }}
            >
              {messages.DEPOSIT_TITLE}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {assets ? (
              assets?.length === 0 ? (
                <Box
                  sx={{
                    boxShadow: (theme) =>
                      `6px 6px 0px ${theme.palette.common.black}`,
                  }}
                >
                  <DepositPanel
                    balance={convertBigNumberToDecimal(
                      totalDeposit,
                      ETH_DECIMALS,
                    )}
                  />

                  <Box
                    paddingX={3}
                    bgcolor={(theme) => theme.palette.primary.main}
                  >
                    <Table columns={depositColumns} />
                    <EmptyPanel text={messages.NO_DEPOSITS} />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    boxShadow: (theme) =>
                      `6px 6px 0px ${theme.palette.common.black}`,
                  }}
                >
                  <DepositPanel
                    balance={convertBigNumberToDecimal(
                      totalDeposit,
                      ETH_DECIMALS,
                    )}
                  />
                  <Box
                    paddingX={3}
                    paddingBottom={3}
                    bgcolor={(theme) => theme.palette.primary.main}
                  >
                    <Table columns={depositColumns} rows={assets} />
                  </Box>
                </Box>
              )
            ) : (
              <>
                <DepositTableSkeleton rowsCount={3} columnsCount={5} />
              </>
            )}
          </Grid>
          <Grid item xs={12} paddingTop={6}>
            <Typography
              variant="h1"
              sx={{
                paddingBottom: 3,
                paddingLeft: 3,
              }}
            >
              {messages.BORROW_TITLE}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {borrowed ? (
              borrowed.length === 0 ? (
                <Box
                  sx={{
                    boxShadow: (theme) =>
                      `6px 6px 0px ${theme.palette.common.black}`,
                  }}
                >
                  <BorrowPanel {...args} />
                  <Box
                    paddingX={3}
                    bgcolor={(theme) => theme.palette.primary.main}
                  >
                    <Table columns={borrowColumns} />
                    <EmptyPanel text={messages.NO_BORROWS} />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    boxShadow: (theme) =>
                      `6px 6px 0px ${theme.palette.common.black}`,
                  }}
                >
                  <BorrowPanel {...args} />
                  <Box
                    paddingX={3}
                    paddingBottom={3}
                    bgcolor={(theme) => theme.palette.primary.main}
                  >
                    <Table columns={borrowColumns} rows={borrowed} />
                  </Box>
                </Box>
              )
            ) : (
              <>
                <BorrowTableSkeleton rowsCount={3} columnsCount={5} />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box display={{ xs: 'block', md: 'none' }}>
        <DashboardMobilePage
          balance={convertBigNumberToDecimal(totalCollateral, ETH_DECIMALS)}
          args={args}
          deposits={assets}
          borrows={borrowed}
        />
      </Box>
    </>
  )
}

export default DashboardPage
