import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { READ_ONLY_GAS_PRICE } from '@constants/Godwoken'
import { TokenModel } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'
import { SwapToken } from '@store/swapTokens/swapTokens.types'

import { balancesActions } from '../balances.slice'
import { IBalance } from '../balances.types'

export function* fetchBalance({
  address,
  tokens,
}: {
  address: string | undefined
  tokens: TokenModel[] | SwapToken[]
}): Generator<StrictEffect, void> {
  try {
    const userBalancesContract = yield* select(contractsSelectors.userBalances)

    if (!userBalancesContract || !address) throw new Error()

    const tokenBalance = yield* call(
      userBalancesContract.balancesOf,
      address,
      tokens.map(({ address }) => address),
      [],
      [],
      [],
      {
        gasPrice: READ_ONLY_GAS_PRICE,
      },
    )

    const balances = [...tokens].map((token, index) => ({
      address: token.address,
      balance: tokenBalance[index] ?? BigNumber.from(0),
      symbol: token.symbol,
      decimal: token.decimals,
    }))

    const userBalancesData = [...balances].reduce((data, current) => {
      data[current.address] = {
        isFetching: false,
        decimals: current.decimal,
        symbol: current.symbol,
        value: current.balance,
      }

      return data
    }, {} as IBalance['balances'])

    const data: IBalance = {
      id: address,
      balances: userBalancesData,
    }

    yield* put(balancesActions.updateBalancesSuccess(data))
  } catch (e) {
    console.error('error', e)
  }
}
