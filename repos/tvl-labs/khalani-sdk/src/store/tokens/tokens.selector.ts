import { Network } from '@constants/Networks'
import { createSelector } from '@reduxjs/toolkit'
import { providerSelector } from '@store/provider/provider.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'

import {
  Address,
  TokenModel,
  TokenOnlyAddressAndChain,
  TokenType,
  TokenWithChainId,
} from './tokens.types'
import { tokensAdapter } from './tokens.slice'
import { formatTokenSymbol } from '@utils/token'

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

const selectByAddressAndNetwork = createSelector(
  [selectAll],
  (tokens) => (address: Address, network: Network) =>
    tokens.find(
      (token) =>
        token.address.toLowerCase() === address.toLowerCase() &&
        token.chainId === network,
    ),
)

const selectByCurrentNetwork = createSelector(
  [selectAll, providerSelector.network],
  (tokens, network) => tokens.filter((token) => token.chainId === network),
)

const selectByNetwork = createSelector(
  [selectAll],
  (tokens) => (network: Network) =>
    tokens.filter((token) => token.chainId === network),
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

const stkTokens = createSelector([selectAll], (tokens) =>
  tokens.filter((token) => token.type === TokenType.STK),
)

const tokensToUpdate = createSelector(
  [selectAll, providerSelector.network],
  (tokens, network) =>
    tokens.filter(
      (token) => token.chainId !== Network.Khalani && token.chainId !== network,
    ),
)

const klnTokens = createSelector([selectAll], (tokens) =>
  tokens.filter((token) => token.type === TokenType.KLN),
)

const selectStkToken = createSelector(
  [stkTokens],
  (tokens) => (symbol: string) =>
    tokens.find((token) =>
      token.symbol.includes(formatTokenSymbol(symbol) ?? ''),
    ),
)

const selectMTokens = createSelector([selectAll], (tokens) => {
  return tokens.filter((token) => token.chainId === Network.Khalani)
})

export const tokenSelectors = {
  selectById,
  selectAll,
  selectByCurrentNetwork,
  selectByNetwork,
  getFullTokensDetails,
  selectByAddress,
  selectByAddressAndNetwork,
  tokensToUpdate,
  selectStkToken,
  klnTokens,
  stkTokens,
  selectMTokens,
}
