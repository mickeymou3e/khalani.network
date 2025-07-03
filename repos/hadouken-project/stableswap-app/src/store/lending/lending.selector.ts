import { address } from '@dataSource/graph/utils/formatters'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import { lendingReservesAdapter } from './lending.slice'

const selectAllReserves = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) => lendingReservesAdapter.getSelectors().selectAll(state.reserves),
)

const selectReserveByWrappedId = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) => (reserveAddress: string) => {
    const reserve = lendingReservesAdapter
      .getSelectors()
      .selectAll(state.reserves)
      .find(
        (reserve) =>
          address(reserve.wrappedATokenAddress) === address(reserveAddress),
      )

    if (!reserve) return undefined

    return {
      ...reserve,
      aTokenAddress: address(reserve.aTokenAddress),
      wrappedATokenAddress: address(reserve.wrappedATokenAddress),
    }
  },
)
const selectReserveByHTokenId = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) => (reserveAddress: string) => {
    const reserve = lendingReservesAdapter
      .getSelectors()
      .selectAll(state.reserves)
      .find(
        (reserve) => address(reserve.aTokenAddress) === address(reserveAddress),
      )

    if (!reserve) return undefined

    return {
      ...reserve,
      aTokenAddress: address(reserve.aTokenAddress),
      wrappedATokenAddress: address(reserve.wrappedATokenAddress),
    }
  },
)

const selectManyReservesByWrappedId = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) => (ids: string[]) => {
    lendingReservesAdapter
      .getSelectors()
      .selectAll(state.reserves)
      .filter((reserve) =>
        ids.some((id) => address(reserve.wrappedATokenAddress) === id),
      )
  },
)

const allWrappedToHTokenMappings = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) =>
    lendingReservesAdapter
      .getSelectors()
      .selectAll(state.reserves)
      .map((token) => ({
        wrappedHToken: address(token.wrappedATokenAddress),
        hToken: address(token.aTokenAddress),
      })),
)

const yieldFee = createSelector(
  selectReducer(StoreKeys.Lending),
  (state) => state.yieldFee,
)

export const lendingSelectors = {
  selectAllReserves,
  selectManyReservesByWrappedId,
  selectReserveByWrappedId,
  selectReserveByHTokenId,
  yieldFee,
  allWrappedToHTokenMappings,
}
