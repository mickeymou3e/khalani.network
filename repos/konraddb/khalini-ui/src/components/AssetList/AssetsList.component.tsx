import React, { ReactElement, ReactNode } from 'react'

import { BigNumber } from 'ethers'
import numbro from 'numbro'

import Table from '@components/Table'
import BigNumberWithTooltip from '@components/labels/BigNumberWithTooltip'
import { Box, Divider, Grid, Skeleton, Typography } from '@mui/material'
import { getTokenComponent } from '@utils/icons'
import { bigNumberToString } from '@utils/text'

import { AssetsListProps } from './AssetsList.types'
import { assetListColumns } from './AssetsList.utils'

const createIconCellSubtitle = (
  icon: ReactNode,
  title?: string,
  subTitle?: string,
  isFetching?: boolean,
): ReactElement => (
  <Grid
    container
    direction="row"
    wrap="nowrap"
    key="icon"
    alignItems="center"
    gap={2}
  >
    <Grid item display="inline-flex">
      {icon}
    </Grid>
    <Grid item>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        {isFetching && (
          <Skeleton variant="rectangular" width={40} height={27} />
        )}
        {!isFetching && <Typography variant="paragraphBig">{title}</Typography>}

        {isFetching && (
          <Skeleton
            sx={{ mt: 0.75 }}
            variant="rectangular"
            width={70}
            height={18}
          />
        )}
        {!isFetching && (
          <Typography
            variant="caption"
            color={(theme) => theme.palette.text.gray}
          >
            {subTitle}
          </Typography>
        )}
      </Box>
    </Grid>
  </Grid>
)

const CreateBalance = (
  balance: string,
  balanceInDollars: string,
  isFetching?: boolean,
): ReactElement => (
  <Grid container direction="column" wrap="nowrap">
    <Grid item>
      {isFetching && (
        <Skeleton
          sx={{ ml: 'auto' }}
          variant="rectangular"
          width={70}
          height={27}
        />
      )}
      {!isFetching && (
        <Typography variant="paragraphBig" whiteSpace="nowrap">
          {numbro(balance).format('$0.00a').slice(1)}
        </Typography>
      )}
    </Grid>
    <Grid item>
      {isFetching && (
        <Skeleton
          sx={{ mt: 0.75, ml: 'auto' }}
          variant="rectangular"
          width={60}
          height={18}
        />
      )}
      {!isFetching && (
        <Typography
          variant="caption"
          color={(theme) => theme.palette.text.gray}
          whiteSpace="nowrap"
        >
          {numbro(balanceInDollars).format('$ 0,0.00')}
        </Typography>
      )}
    </Grid>
  </Grid>
)

const fetchingElements = [1, 2].map((asset) => {
  return {
    id: asset.toString(),
    cells: {
      assets: {
        value: createIconCellSubtitle(
          getTokenComponent(undefined),
          undefined,
          undefined,
          true,
        ),
      },
      amount: {
        value: CreateBalance('0', '0', true),
      },
    },
  }
})

export const AssetsList: React.FC<AssetsListProps> = ({
  assets,
  isFetching,
  totalBalanceMessage = 'Total balance',
  totalBalanceOnTop = false,
  totalBalanceDecimals = 18,
}) => {
  const totalBalance = assets.reduce((prev, current) => {
    return prev.add(current.balanceInDollars)
  }, BigNumber.from(0))

  const rows = isFetching
    ? fetchingElements
    : assets.map((asset) => {
        return {
          id: asset.address,
          cells: {
            assets: {
              value: createIconCellSubtitle(
                asset?.icon ?? getTokenComponent(asset.symbol),
                asset.symbol,
                asset.symbolDescription,
              ),
            },
            amount: {
              value: CreateBalance(
                bigNumberToString(asset.balance, asset.decimals),
                bigNumberToString(asset.balanceInDollars, totalBalanceDecimals),
              ),
            },
          },
        }
      })

  return (
    <>
      {totalBalanceOnTop && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="paragraphSmall">
              {totalBalanceMessage}
            </Typography>
            <BigNumberWithTooltip
              variant="paragraphBig"
              value={totalBalance}
              isFetching={isFetching}
              decimals={totalBalanceDecimals}
              showDollars
            />
          </Box>
          {rows.length > 0 && <Divider sx={{ height: 1 }} />}
        </>
      )}
      <Box alignItems="center" overflow="hidden">
        <Table
          columns={assetListColumns}
          rows={rows}
          displayHeader={false}
          sx={{
            background: 'none',
            '.MuiTableHead-root .MuiTableRow-root': {
              border: 'none',
            },
            '.MuiTableBody-root .MuiTableRow-root': {
              background: 'none',
              '&:hover': {
                background: 'none',
              },

              '&:last-child': {
                '.MuiTableCell-root': {
                  padding: 0,
                  border: 'none',
                },
              },

              border: 'none',
              '.MuiTableCell-root': {
                padding: 0,
                background: 'none',
                paddingBottom: 3,
                border: 'none',
              },
            },
          }}
        />
      </Box>

      {!totalBalanceOnTop && (
        <>
          {rows.length > 0 && <Divider sx={{ height: 1 }} />}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="paragraphSmall">
              {totalBalanceMessage}
            </Typography>
            <BigNumberWithTooltip
              variant="paragraphBig"
              value={totalBalance}
              decimals={totalBalanceDecimals}
              isFetching={isFetching}
              showDollars
            />
          </Box>
        </>
      )}
    </>
  )
}

export default AssetsList
