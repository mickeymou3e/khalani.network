import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { IAllowance } from '@store/allowance/allowance.types'
import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'
import { logger } from '@utils/logger'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'

export function* fetchERC20Allowances(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
  spenderParam?: string,
): Generator<Effect, IAllowance[]> {
  try {
    const tokenConnector = yield* select(
      evmChainContractsSelectors.crossChainTokenConnector,
    )

    const selectStkToken = yield* select(tokenSelectors.selectStkToken)

    const balances: IAllowance[] = []
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i]

      const tokenAddress = token.address
      const erc20Contract = tokenConnector
        ? yield* call(tokenConnector, tokenAddress)
        : null
      let spender = spenderParam

      if (!spenderParam) {
        const stkToken = selectStkToken(token.symbol)
        if (!stkToken) throw new Error('Stake token not found')
        spender = stkToken.address
      }

      if (!spender) throw new Error('Spender address not found')
      if (!erc20Contract) throw Error('Token contract not found')

      const balance = yield* call(erc20Contract.allowance, userAddress, spender)

      balances.push({
        tokenAddress,
        balance,
        spender,
        owner: userAddress,
      })
    }
    return balances
  } catch (error) {
    logger.error(error)
    throw new Error('Fetching allowance has failed')
  }
}
