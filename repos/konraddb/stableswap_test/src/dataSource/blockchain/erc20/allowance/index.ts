import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { IAllowance } from '@store/allowance/allowance.types'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'

export function* fetchERC20Allowances(
  tokens: ITokenModelBalanceWithChain[],
  userAddress: string,
): Generator<Effect, IAllowance[]> {
  const tokenConnector = yield* select(
    contractsSelectors.crossChainTokenConnector,
  )

  const balances: IAllowance[] = []
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const erc20Contract = tokenConnector
      ? yield* call(tokenConnector, token.address)
      : null

    if (!erc20Contract) throw Error('Token contract not found')

    const balance = yield* call(
      erc20Contract.allowance,
      userAddress,
      userAddress,
    )

    balances.push({ tokenAddress: token.address, balance })
  }
  return balances
}
