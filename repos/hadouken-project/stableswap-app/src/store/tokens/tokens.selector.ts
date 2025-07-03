import { RequestStatus } from '@constants/Request'
import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { sortTokensByAddressOrder } from '@utils/token'

import { selectReducer } from '../store.utils'
import { tokensAdapter } from './tokens.slice'

const isReady = createSelector(
  selectReducer(StoreKeys.Tokens),
  (reducerState) =>
    reducerState.status === RequestStatus.Resolved ||
    reducerState.status === RequestStatus.Rejected,
)

const isFetching = createSelector(
  [isReady, selectReducer(StoreKeys.Tokens)],
  (isReady, reducerState) => !isReady || reducerState.isFetching,
)

const isMintingToken = createSelector(
  [selectReducer(StoreKeys.Tokens)],
  (reducerState) => reducerState.isMintingToken,
)

const selectMany = createSelector(
  selectReducer(StoreKeys.Tokens),

  (state) => (ids: string[]) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) =>
        ids.map((id) => id.toUpperCase()).includes(token.id.toUpperCase()),
      )
      .sort(sortTokensByAddressOrder(ids)),
)

const selectById = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) => (id: IToken['id']) =>
    tokensAdapter.getSelectors().selectById(state, id),
)

const selectAllTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) => tokensAdapter.getSelectors().selectAll(state),
)

const selectTokens = createSelector(selectReducer(StoreKeys.Tokens), (state) =>
  tokensAdapter
    .getSelectors()
    .selectAll(state)
    .filter((token) => !token.isLpToken),
)

const selectLPTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => token.isLpToken),
)

export const tokenSelectors = {
  isReady,
  selectById,
  selectMany,
  selectAllTokens,
  selectTokens,
  selectLPTokens,
  isFetching,
  isMintingToken,
}
