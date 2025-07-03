import axios from 'axios'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { networkSelectors } from '@store/network/network.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

export const fetchParticipation = async (
  chainId: string,
): Promise<BigDecimal> => {
  try {
    const { data: participation } = await axios.get<string>(
      `${config.lockdropBackend}/participation?chainId=${chainId}`,
    )

    return BigDecimal.from(participation, 2)
  } catch {
    return BigDecimal.from(0, 2)
  }
}

export function* getParticipation(): Generator<StrictEffect, BigDecimal> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const participation = yield* call(fetchParticipation, chainId)

  return participation
}
