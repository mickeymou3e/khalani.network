import axios from 'axios'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import {
  LockdropDepositedTokensBalances,
  LockdropDepositedTokensBalancesResponse,
} from '../lockDrop.types'

const fetchDepositedTokensBalances = async (
  chainId: string,
  user: string | null,
): Promise<LockdropDepositedTokensBalances> => {
  try {
    const {
      data: {
        totalPriceTokenDepositAmount,
        totalHdkDepositAmount,

        userPriceTokenDepositAmount,
        userHdkDepositAmount,
      },
    } = await axios.get<LockdropDepositedTokensBalancesResponse>(
      `${config.lockdropBackend}/deposits?chainId=${chainId}&user=${user}`,
    )

    return {
      totalPriceTokenDepositAmount: BigDecimal.from(
        totalPriceTokenDepositAmount,
      ),
      totalHdkDepositAmount: BigDecimal.from(totalHdkDepositAmount),
      userPriceTokenDepositAmount: BigDecimal.from(userPriceTokenDepositAmount),
      userHdkDepositAmount: BigDecimal.from(userHdkDepositAmount),
    }
  } catch {
    return {
      totalPriceTokenDepositAmount: BigDecimal.from(0),
      totalHdkDepositAmount: BigDecimal.from(0),
      userPriceTokenDepositAmount: BigDecimal.from(0),
      userHdkDepositAmount: BigDecimal.from(0),
    }
  }
}

export function* getDepositedTokensBalances(): Generator<
  StrictEffect,
  LockdropDepositedTokensBalances
> {
  const chainId = yield* select(networkSelectors.applicationChainId)
  const user = yield* select(walletSelectors.userAddress)

  const lockdropDepositBalances = yield* call(
    fetchDepositedTokensBalances,
    chainId,
    user,
  )

  return lockdropDepositBalances
}
