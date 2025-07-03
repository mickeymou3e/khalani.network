import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import { READ_ONLY_GAS_PRICE } from '@constants/Godwoken'
import { HEALTH_FACTOR_DECIMAL } from '@constants/Lending'
import { fetchReserves as fetchReservesQuery } from '@graph/pools/queries'
import { fetchUsers as fetchUsersQuery } from '@graph/users/queries'
import { IPrice } from '@store/prices/prices.slice'
import { contractsSelectors } from '@store/provider/provider.selector'
import { getHealthFactor } from '@utils/math'
import { bigNumberToString } from '@utils/stringOperations'

import { IReserve } from '../../../graph/pools/types'
import { IUser } from '../../../graph/users/types'
import { User } from '../users.types'

const HEALTH_FACTOR_DISPLAY_THRESHOLD = 3

function fixUserCollateral(user: IUser, reserves: IReserve[]): IUser {
  const newATokenAssets = user.aTokenAssets.map((aTokenAsset) => {
    const reserve = reserves.find(
      (res) => res.aTokenAddress === aTokenAsset.address,
    )
    if (reserve && BigNumber.from(reserve.ltv).isZero()) {
      return {
        ...aTokenAsset,
        isCollateral: false,
      }
    }
    return aTokenAsset
  })

  return {
    ...user,
    aTokenAssets: newATokenAssets,
  }
}

export function* fetchUsersData(): Generator<StrictEffect, User[]> {
  try {
    const users = yield* call(fetchUsersQuery)
    const reserves = yield* call(fetchReservesQuery)
    const addresses = reserves.map((reserve) => reserve.address)
    const hadoukenOracleContract = yield* select(
      contractsSelectors.hadoukenOracle,
    )

    if (hadoukenOracleContract) {
      const data = yield* call(
        hadoukenOracleContract.getAssetsPrices,
        addresses,
        {
          gasPrice: READ_ONLY_GAS_PRICE,
        },
      )
      const symbols = reserves.map((reserve) => reserve.symbol)
      const prices: IPrice[] = data.map((price, index) => ({
        price,
        id: symbols[index],
      }))

      const usersHF: User[] = []
      const HealthFactorLiquidate = BigNumber.from(10)
        .pow(HEALTH_FACTOR_DECIMAL)
        .mul(HEALTH_FACTOR_DISPLAY_THRESHOLD)

      users.forEach((user) => {
        user = fixUserCollateral(user, reserves)
        const {
          healthFactor,
          borrowedTokens,
          collateralTokens,
        } = getHealthFactor(user, reserves, prices)
        if (healthFactor.lte(HealthFactorLiquidate)) {
          usersHF.push({
            id: user.id,
            healthFactor: healthFactor.eq(MAX_BIG_NUMBER)
              ? 'N/A'
              : bigNumberToString(healthFactor, HEALTH_FACTOR_DECIMAL, 6),
            borrowedTokens,
            collateralTokens,
          })
        }
      })
      return usersHF
    }
    return []
  } catch (error) {
    console.error(error)
    return []
  }
}
