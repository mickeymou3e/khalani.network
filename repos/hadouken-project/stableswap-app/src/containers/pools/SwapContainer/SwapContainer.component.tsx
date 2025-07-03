import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SwapModule from '@components/SwapModule/SwapModule.component'
import { Box } from '@mui/material'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { StoreDispatch } from '@store/store.types'
import { swapActions } from '@store/swap/swap.slice'

import { useTokenWithBalances } from './SwapContainer.hooks'

const SwapContainer: React.FC = () => {
  const { tokens } = useTokenWithBalances()

  const dispatch = useDispatch<StoreDispatch>()

  const isFetchingBalances = useSelector(balancesSelectors.loading)

  useEffect(() => {
    dispatch(swapActions.initializeSwapStoreRequest())
  }, [dispatch])

  return (
    <Box pt={4} display="flex" justifyContent="center">
      <SwapModule tokens={tokens} isFetchingBalances={isFetchingBalances} />
    </Box>
  )
}

export default SwapContainer
