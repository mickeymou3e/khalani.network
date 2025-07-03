import React, { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Box } from '@mui/material'
import { StoreDispatch } from '@store/store.types'
import {
  chainsSelectors,
  depositHistorySelectors,
  intentsSelectors,
  providerSelector,
  tokenSelectors,
  withdrawIntentBalanceActions,
} from '@tvl-labs/sdk'

import { SUB_PAGES_PATH } from '../../App'
import { SubPage } from '../../constants/Page'
import {
  LiquidityListContainer,
  WithdrawContainer,
  WithdrawContainerProps,
} from '../../containers'
import {
  buildEmptyIntentBalancesRow,
  buildIntentBalancesRow,
  mapWithdrawProps,
} from './LiquidityModule.utils'

const LiquidityModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const navigate = useNavigate()

  const [withdrawProps, setWithdrawProps] = useState<
    Omit<WithdrawContainerProps, 'open' | 'onClose'> | undefined
  >(undefined)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false)

  const author = useSelector(providerSelector.userAddress)
  const mTokens = useSelector(tokenSelectors.selectMTokens)
  const chains = useSelector(chainsSelectors.chains)
  const intentBalances = useSelector(intentsSelectors.activeLiquidityIntents)
  const deposits = useSelector(depositHistorySelectors.deposits)

  const pendingDeposits = useMemo(() => {
    return deposits?.filter(
      (deposit) =>
        deposit.status === 'pending' &&
        deposit.intent.Refinement.outcome.fillStructure === 'PercentageFilled',
    )
  }, [deposits])

  const filteredIntentBalances = useMemo(() => {
    return intentBalances?.filter(
      (intent) => !intent.transactions.remaining_intent_id,
    )
  }, [intentBalances])

  const isIntentBalancesInitialized = useSelector(
    intentsSelectors.isInitialized,
  )

  const intentBalancesRows = useMemo(() => {
    if (!filteredIntentBalances) return []
    return buildIntentBalancesRow(filteredIntentBalances, mTokens, chains)
  }, [filteredIntentBalances, mTokens, chains])

  const depositsRows = useMemo(
    () => buildEmptyIntentBalancesRow(pendingDeposits, mTokens, chains),
    [pendingDeposits, mTokens, chains],
  )

  const rows = useMemo(() => {
    return [...depositsRows, ...intentBalancesRows]
  }, [intentBalancesRows, depositsRows])

  const handleRowClick = useCallback(
    (id: string) => {
      const foundItem = rows.find((data) => data.id === id)
      if (foundItem?.clickable) {
        setWithdrawProps(mapWithdrawProps(foundItem, chains))
        setWithdrawModalOpen(true)
      }
    },
    [chains, rows],
  )

  const handleWithdrawSubmit = async () => {
    if (!withdrawProps || !author) return
    const { id } = withdrawProps

    dispatch(
      withdrawIntentBalanceActions.withdrawIntentBalanceRequest({
        intentId: id,
      }),
    )
  }

  const openProvideLiquidity = () => {
    navigate(SUB_PAGES_PATH[SubPage.Provide])
  }

  const noLiquidityView = useMemo(
    () =>
      isIntentBalancesInitialized &&
      intentBalances &&
      intentBalances.length === 0,
    [isIntentBalancesInitialized, intentBalances],
  )

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={'column'}
    >
      <LiquidityListContainer
        rowClickFn={handleRowClick}
        addBalanceFn={openProvideLiquidity}
        intentBalancesRows={rows}
        isIntentBalancesInitialized={isIntentBalancesInitialized}
        isNoBalanceView={noLiquidityView as boolean}
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

export default LiquidityModule
