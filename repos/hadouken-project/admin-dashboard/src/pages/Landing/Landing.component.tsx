import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { orderBy } from 'lodash'

import SearchNotFoundPanel from '@components/panels/SearchNotFoundPanel'
import SearchBoxSkeleton from '@components/skeletons/SearchBoxSkeleton'
import TableSkeleton from '@components/skeletons/TableSkeleton'
import { SearchBox, Table } from '@hadouken-project/ui'
import { Box, Grid, Paper, Typography } from '@mui/material'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { getAppConfig } from '@utils/config'

import {
  useBalancesList,
  useLiquidationsList,
  useOracleBalance,
  useProtocolFeeBalances,
  useTreasuryBalance,
  useUsersList,
} from './Landing.hooks'
import { messages } from './Landing.messages'
import {
  DEFAULT_SORT_COLUMN,
  balancesColumns,
  liquidationsColumns,
  usersColumns,
} from './Landing.utils'

const LandingPage: React.FC = () => {
  const isFetching = useSelector(reservesSelectors.isFetching)
  const appConfig = getAppConfig()
  const diaOracleAddress = appConfig.contracts.diaOracle
  const bandOracleAddress = appConfig.contracts.bandOracle

  const [searchText, setSearchText] = useState<string>('')
  const usersRows = useUsersList()
  const liquidationsRows = useLiquidationsList()
  const balancesRows = useBalancesList()
  const diaOracleBalance = useOracleBalance(diaOracleAddress ?? undefined)
  const bandOracleBalance = useOracleBalance(bandOracleAddress ?? undefined)

  const treasuryBalance = useTreasuryBalance()
  const protocolFeeBalance = useProtocolFeeBalances()

  const [columnName, setColumnName] = useState<string | undefined>(
    DEFAULT_SORT_COLUMN,
  )
  const [isSortDirectionDesc, setIsSortDirectionDesc] = useState<
    boolean | undefined
  >(true)

  const onSortDesc = (isDesc: boolean | undefined) => {
    if (isDesc === undefined) {
      setIsSortDirectionDesc(true)
    } else if (isDesc) {
      setIsSortDirectionDesc(undefined)
    } else {
      setIsSortDirectionDesc(false)
    }
  }

  const onSortColumn = (columnName: string) => setColumnName(columnName)

  const sortedUserRows =
    columnName && isSortDirectionDesc !== undefined
      ? orderBy(
          usersRows,
          (item) => item.cells?.[columnName].sortingValue,
          isSortDirectionDesc ? 'desc' : 'asc',
        )
      : usersRows

  const filteredUserRows = sortedUserRows.filter((usersRow) =>
    String(usersRow.cells.user.sortingValue || usersRow.cells.assets.value)
      .toLocaleLowerCase()
      .includes(searchText.toLocaleLowerCase()),
  )

  return (
    <Box py={12}>
      <Box pb={2}>
        <Typography variant="h3">{appConfig.appName}</Typography>
      </Box>
      {isFetching && (
        <>
          <SearchBoxSkeleton />
          <Box>
            <TableSkeleton columns={usersColumns} />
          </Box>
        </>
      )}

      {!isFetching && (
        <>
          {appConfig.contracts.diaOracle !== null && (
            <Box pb={2}>
              <Paper elevation={2}>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Typography variant="h5">
                    {messages.DIA_ORACLE_CKB_BALANCE}
                  </Typography>
                  <Typography variant="h5">
                    {diaOracleBalance} {appConfig.nativeToken.symbol}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          {appConfig.contracts.bandOracle !== null && (
            <Box pb={6}>
              <Paper elevation={2}>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Typography variant="h5">
                    {messages.BAND_ORACLE_CKB_BALANCE}
                    {appConfig.contracts.bandOracle === null ?? 'Disabled'}
                  </Typography>
                  <Typography variant="h5">
                    {bandOracleBalance} {appConfig.nativeToken.symbol}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          <Paper elevation={2} sx={{ marginBottom: 6 }}>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {messages.BALANCES_TABLE_TITLE}
                </Typography>
              </Grid>
            </Grid>
            <Table columns={balancesColumns} rows={balancesRows} />
          </Paper>

          <Paper elevation={2} sx={{ marginBottom: 6 }}>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5">
                  {messages.USERS_TABLE_TITLE}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <SearchBox
                  value={searchText}
                  valueChangeHandler={setSearchText}
                />
              </Grid>
            </Grid>
            <Table
              columns={usersColumns}
              rows={filteredUserRows}
              onSortDesc={onSortDesc}
              sortDesc={isSortDirectionDesc}
              onSortColumn={onSortColumn}
              sortedColumnName={columnName}
            />
          </Paper>

          {searchText && filteredUserRows?.length === 0 && (
            <SearchNotFoundPanel searchText={searchText} />
          )}

          <Paper elevation={2} sx={{ marginTop: 6 }}>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {messages.LIQUIDATION_TABLE_TITLE}
                </Typography>
              </Grid>
            </Grid>
            <Table columns={liquidationsColumns} rows={liquidationsRows} />
          </Paper>

          <Paper elevation={2} sx={{ marginTop: 6 }}>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {messages.LENDING_TREASURY_BALANCE}
                </Typography>
              </Grid>
            </Grid>
            <Table columns={balancesColumns} rows={treasuryBalance} />
          </Paper>

          <Paper elevation={2} sx={{ marginTop: 6 }}>
            <Grid container alignItems="center" gap={{ xs: 2, md: 0 }}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {messages.PROTOCOL_FEE_BALANCE}
                </Typography>
              </Grid>
            </Grid>
            <Table columns={balancesColumns} rows={protocolFeeBalance} />
          </Paper>
        </>
      )}
    </Box>
  )
}

export default LandingPage
