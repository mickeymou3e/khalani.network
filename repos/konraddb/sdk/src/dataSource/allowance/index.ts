import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { IAllowance } from '../../store/allowance/allowance.types'
import { contractsSelectors } from '../../store/contracts/contracts.selectors'
import { TokenModelBalanceWithChain } from '../../store/tokens/tokens.types'
import { TxParams } from '../../constants/TxParams'

export function* fetchERC20Allowances(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
  spender: string,
): Generator<Effect, IAllowance[]> {
  try {
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
        spender,
        TxParams,
      )

      balances.push({ tokenAddress: token.address, balance, spender })
    }
    return balances
  } catch (error) {
    console.log(error)
    throw new Error('Fetching allowance has failed')
  }
}
