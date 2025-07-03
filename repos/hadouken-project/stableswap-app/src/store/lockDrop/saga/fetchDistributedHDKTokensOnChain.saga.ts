import axios from 'axios'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import { LockDropQueryResultData } from '../lockDrop.types'

const fetchDistributedHDKTokensOnChain = async (
  chainId: string,
): Promise<BigDecimal> => {
  try {
    const response = await axios.get<LockDropQueryResultData>(
      `${config.lockdropBackend}/lockdrops?chainId=${chainId}`,
    )

    const distributedHdkTokens = BigDecimal.from(
      response.data.totalUserHdkToClaim,
    ) // Backend returns how much HDK tokens are distributed on chain if we not pass user

    return distributedHdkTokens
  } catch (e) {
    return BigDecimal.from(0)
  }
}

export function* getDistributedHDKTokensOnChain(): Generator<
  StrictEffect,
  BigDecimal
> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const distributedHdkTokens = yield* call(
    fetchDistributedHDKTokensOnChain,
    chainId,
  )

  return distributedHdkTokens
}
