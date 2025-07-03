import { IToken } from '@interfaces/token'
import { createSelector } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { StoreKeys } from '@store/store.keys'

import { selectReducer } from '../../store.utils'
import { khalaTokensAdapter } from './tokens.slice'
import { ITokenOnlyAddressAndChain, ITokenWithChainId } from './tokens.types'

const selectById = createSelector(
  selectReducer(StoreKeys.KhalaTokens),
  (state) => (id: IToken['id']) =>
    khalaTokensAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector(
  selectReducer(StoreKeys.KhalaTokens),
  (state) => khalaTokensAdapter.getSelectors().selectAll(state),
)

const selectByCurrentNetwork = createSelector(
  [selectAll, networkSelectors.network],
  (tokens, network) => tokens.filter((token) => token.chainId === network),
)

const getFullTokensDetails = createSelector(
  [selectAll],
  (tokens) => (tokensWithChainId: ITokenOnlyAddressAndChain[]) =>
    tokensWithChainId.map((i) => {
      return tokens.find(
        (j) => j.address === i.address && j.chainId === i.chainId,
      ) as ITokenWithChainId
    }),
)

export const khalaTokenSelectors = {
  selectById,
  selectAll,
  selectByCurrentNetwork,
  getFullTokensDetails,
}
