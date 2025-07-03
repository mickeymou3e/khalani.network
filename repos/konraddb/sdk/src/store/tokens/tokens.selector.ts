import { Network } from '../../constants/Networks'
import { createSelector } from '@reduxjs/toolkit'
import { providerSelector } from '../provider/provider.selector'
import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import {
  Address,
  TokenModel,
  TokenOnlyAddressAndChain,
  TokenWithChainId,
} from './tokens.types'
import { tokensAdapter } from './tokens.slice'

const selectById = createSelector(
  [selectReducer(StoreKeys.Tokens)],
  (state) => (id: TokenModel['id']) =>
    tokensAdapter.getSelectors().selectById(state, id),
)

const selectAll = createSelector([selectReducer(StoreKeys.Tokens)], (state) =>
  tokensAdapter.getSelectors().selectAll(state),
)

const selectByAddress = createSelector(
  [selectAll],
  (tokens) => (address: Address) =>
    tokens.find(
      (token) => token.address.toLowerCase() === address.toLowerCase(),
    ),
)
const selectByCurrentNetwork = createSelector(
  [selectAll, providerSelector.network],
  (tokens, network) => tokens.filter((token) => token.chainId === network),
)

const getFullTokensDetails = createSelector(
  [selectAll],
  (tokens) => (tokensWithChainId: TokenOnlyAddressAndChain[]) =>
    tokensWithChainId.map(
      (i) =>
        tokens.find(
          (j) =>
            j.address.toLowerCase() === i.address.toLowerCase() &&
            j.chainId === i.chainId,
        ) as TokenWithChainId,
    ),
)

const tokensToUpdate = createSelector(
  [selectAll, providerSelector.network],
  (tokens, network) =>
    tokens.filter(
      (token) => token.chainId !== Network.Khala && token.chainId !== network,
    ),
)

export const tokenSelectors = {
  selectById,
  selectAll,
  selectByCurrentNetwork,
  getFullTokensDetails,
  selectByAddress,
  tokensToUpdate,
}
