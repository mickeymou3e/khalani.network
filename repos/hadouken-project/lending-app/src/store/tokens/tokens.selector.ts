import { memoize } from 'lodash'

import { TokenModel } from '@interfaces/tokens'
import { createSelector } from '@reduxjs/toolkit'
import { StoreKeys } from '@store/store.keys'
import { sortTokensByAddressOrder } from '@utils/token'

import { selectReducer } from '../store.utils'
import { tokensAdapter } from './tokens.slice'

const selectAll = createSelector(
  selectReducer(StoreKeys.Tokens),
  tokensAdapter.getSelectors().selectAll,
)

const selectAllStandardTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter(
        (token) =>
          !token.isAToken && !token.isStableDebt && !token.isVariableDebt,
      ),
)

const selectAllStableDebtTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => token.isStableDebt),
)

const selectAllVariableDebtTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => token.isVariableDebt),
)

const selectAllApplicationTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter(
        (token) => token.isAToken || token.isStableDebt || token.isVariableDebt,
      ),
)

const selectAllDepositTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => token.isAToken),
)

const selectAllDebtTokens = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => token.isStableDebt || token.isVariableDebt),
)

const tokens = createSelector(selectReducer(StoreKeys.Tokens), (state) =>
  tokensAdapter.getSelectors().selectAll(state),
)

const selectMany = createSelector(selectReducer(StoreKeys.Tokens), (state) =>
  memoize((ids: string[]) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .filter((token) => ids.includes(token.id))
      .sort(sortTokensByAddressOrder(ids)),
  ),
)

const selectById = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) => (id?: TokenModel['id']) =>
    id ? tokensAdapter.getSelectors().selectById(state, id) : undefined,
)

const getNativeToken = createSelector(
  selectReducer(StoreKeys.Tokens),
  (state) =>
    tokensAdapter
      .getSelectors()
      .selectAll(state)
      .find((token) => token.name === 'CKB'),
)

export const tokenSelectors = {
  tokens,
  selectAll,
  selectAllStandardTokens,
  selectAllStableDebtTokens,
  selectAllVariableDebtTokens,
  selectAllDepositTokens,
  selectAllApplicationTokens,
  selectAllDebtTokens,
  selectMany,
  selectById,
  getNativeToken,
}
