import { BigNumber } from 'ethers'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import { ETH_DECIMALS, HEALTH_FACTOR_DECIMAL } from '@constants/Lending'

import { calculateHealthFactor, calculateUserAssetMaxBorrowAmount } from '.'

describe('Math', () => {
  describe('calculateHealthFactor', () => {
    it('when total borrow is 0 return max big number', () => {
      const totalBorrow = BigNumber.from(0)
      const collateral = BigNumber.from(10).pow(22) // 1000
      const ltv = BigNumber.from(7500) // 4 decimals 75%
      const healthFactor = calculateHealthFactor(totalBorrow, collateral, ltv)
      expect(healthFactor).toEqual(MAX_BIG_NUMBER)
    })

    it('standard calculation', () => {
      const totalBorrow = BigNumber.from(10).pow(21) // 100
      const collateral = BigNumber.from(10).pow(22) // 1000
      const ltv = BigNumber.from(7500) // 4 decimals 75%

      // 1000 * 75% / 100 = 750 / 100 = 7.5
      const expectResult = BigNumber.from(75).mul(
        BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL - 1),
      )
      const healthFactor = calculateHealthFactor(totalBorrow, collateral, ltv)
      expect(healthFactor).toEqual(expectResult)
    })
  })
  describe('calculateUserAssetMaxBorrowAmount', () => {
    it('when asset market liquidity is smaller then user collateral return market liquidity', () => {
      const userCollateral = BigNumber.from(10).pow(22) // 10 000
      const userBorrow = BigNumber.from(0) // 0
      const userLTV = BigNumber.from(7500)
      const assetDecimals = 6
      const marketLiquidity = BigNumber.from(10).pow(assetDecimals + 3) // 1000
      const tokenPrice = BigNumber.from(10).pow(9) // 1 token is 1 dollar
      const totalBorrowed = BigNumber.from(10).pow(22)
      const borrowCap = BigNumber.from(0)

      const { availableBorrow } = calculateUserAssetMaxBorrowAmount(
        userCollateral,
        userBorrow,
        userLTV,
        assetDecimals,
        marketLiquidity,
        tokenPrice,
        totalBorrowed,
        borrowCap,
      )
      expect(availableBorrow).toEqual(marketLiquidity)
    })

    it('standard calculation', () => {
      const userCollateral = BigNumber.from(10).pow(22) // 10000
      const userBorrow = BigNumber.from(0) // 0
      const userLTV = BigNumber.from(7500)
      const assetDecimals = 6
      const tokenPrice = BigNumber.from(10).pow(18) // 1 token is 1 dollar

      const marketLiquidity = BigNumber.from(10).pow(ETH_DECIMALS + 5) // 100 000

      const expectResult = BigNumber.from(7009345700) // 7 009,345700
      const totalBorrowed = BigNumber.from(10).pow(22)
      const borrowCap = BigNumber.from(0)

      // 75% * (10 000) / 1.07 = 7 009,345794393
      const { availableBorrow } = calculateUserAssetMaxBorrowAmount(
        userCollateral,
        userBorrow,
        userLTV,
        assetDecimals,
        marketLiquidity,
        tokenPrice,
        totalBorrowed,
        borrowCap,
      )

      expect(availableBorrow).toEqual(expectResult)
    })
  })
})
