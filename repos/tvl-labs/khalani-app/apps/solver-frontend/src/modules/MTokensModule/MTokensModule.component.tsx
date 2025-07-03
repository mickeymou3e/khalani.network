import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box } from '@mui/material'
import { StoreDispatch } from '@store/store.types'
import {
  chainsSelectors,
  mTokenBalancesSelectors,
  providerSelector,
  withdrawMTokenActions,
} from '@tvl-labs/sdk'

import { SUB_PAGES_PATH } from '../../App'
import { SubPage } from '../../constants/Page'
import {
  MTokensListContainer,
  WithdrawContainer,
  WithdrawContainerProps,
} from '../../containers'
import { buildMTokenBalancesRow, mapWithdrawProps } from './MTokensModule.utils'

const MTokensModule: React.FC = () => {
  const navigate = useNavigate()

  const [withdrawProps, setWithdrawProps] = useState<
    Omit<WithdrawContainerProps, 'open' | 'onClose'> | undefined
  >(undefined)
  const dispatch = useDispatch<StoreDispatch>()

  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false)

  const author = useSelector(providerSelector.userAddress)
  const chains = useSelector(chainsSelectors.chains)
  const mTokenBalances = useSelector(mTokenBalancesSelectors.selectAll)
  const isMTokenBalancesInitialized = useSelector(
    mTokenBalancesSelectors.isInitialized,
  )

  const mTokenBalancesRows = useMemo(
    () => buildMTokenBalancesRow(mTokenBalances, chains),
    [mTokenBalances, chains],
  )

  const handleRowClick = useCallback(
    (id: string) => {
      const foundItem = mTokenBalancesRows.find((data) => data.id === id)
      setWithdrawProps(mapWithdrawProps(foundItem, chains))
      setWithdrawModalOpen(true)
    },
    [chains, mTokenBalancesRows],
  )

  const handleWithdrawSubmit = async () => {
    if (!withdrawProps || !author) return
    const { amount, mToken } = withdrawProps

    dispatch(
      withdrawMTokenActions.withdrawMTokenRequest({
        from: author,
        mToken,
        amount,
      }),
    )
  }

  const openDepositTokens = () => {
    navigate(SUB_PAGES_PATH[SubPage.Deposit])
  }

  const noMTokenBalancesView = useMemo(
    () =>
      isMTokenBalancesInitialized &&
      mTokenBalances &&
      mTokenBalances.filter((mTokenBalance) => mTokenBalance.balance > 0n)
        .length === 0,
    [isMTokenBalancesInitialized, mTokenBalances],
  )

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={'column'}
    >
      <MTokensListContainer
        rowClickFn={handleRowClick}
        addBalanceFn={openDepositTokens}
        mTokenBalancesRows={mTokenBalancesRows}
        isMTokenBalancesInitialized={isMTokenBalancesInitialized}
        isNoBalanceView={noMTokenBalancesView}
      />

      {withdrawProps && (
        <WithdrawContainer
          open={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          {...withdrawProps}
          onSubmit={handleWithdrawSubmit}
        />
      )}
    </Box>
  )
}

export default MTokensModule
