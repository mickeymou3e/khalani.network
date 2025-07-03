import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { mapTokenSymbolToPriceSymbol } from '@dataSource/blockchain/oracle/prices/mapper'
import { IToken } from '@interfaces/token'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { walletSelectors } from '@store/wallet/wallet.selector'

export function* fetchTokenPrice(
  token: IToken,
): Generator<StrictEffect, BigNumber> {
  const oracle = yield* select(contractsSelectors.oracle)
  if (!oracle) throw Error('Oracle not found')
  const isConnected = yield* select(walletSelectors.isConnected)

  let price = [BigNumber.from(0), BigNumber.from(0)]
  if (isConnected) {
    price = yield* call(
      oracle.callStatic.getValue,
      `${mapTokenSymbolToPriceSymbol(token.symbol)}/USD`,
    )
  }
  const valueUSD = price[0]

  return valueUSD
}
