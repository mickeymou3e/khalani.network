import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { READ_ONLY_GAS_PRICE } from '@constants/Godwoken'
import { ITokenBalance } from '@interfaces/tokens'
import { PayloadAction } from '@reduxjs/toolkit'
import { contractsSelectors } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

import { balancesActions } from '../balances.slice'
import { IBalance } from '../balances.types'

export function* fetchOracleBalance(
  action: PayloadAction<string>,
): Generator<StrictEffect, ITokenBalance[]> {
  try {
    const CKBToken = yield* select(tokenSelectors.getNativeToken)

    const userBalancesContract = yield* select(contractsSelectors.userBalances)

    if (!userBalancesContract || !CKBToken) return []

    const walletAddress = action.payload
    const tokenBalance = yield* call(
      userBalancesContract.balancesOf,
      walletAddress,
      [CKBToken.address],
      [],
      [],
      [],
      {
        gasPrice: READ_ONLY_GAS_PRICE,
      },
    )

    const balance = [CKBToken].map((token, index) => ({
      address: token.address,
      balance: tokenBalance[index] ?? BigNumber.from(0),
      symbol: token.symbol,
      decimal: token.decimals,
    }))

    const oracleBalancesData = [...balance].reduce((data, current) => {
      data[current.address] = {
        isFetching: false,
        decimals: current.decimal,
        symbol: current.symbol,
        value: current.balance,
      }

      return data
    }, {} as IBalance['balances'])

    const data: IBalance = {
      id: walletAddress,
      balances: oracleBalancesData,
    }

    yield* put(balancesActions.updateOracleBalancesSuccess(data))
  } catch (e) {
    console.error('error')
  }

  return []
}
