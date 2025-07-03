import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import {
  BorrowType,
  CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
  ETH_DECIMALS,
  HEALTH_FACTOR_DECIMAL,
} from '@constants/Lending'
import { pricesSelectors } from '@store/prices/prices.selector'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataSelector } from '@store/userData/userData.selector'
import {
  ONE_HEALTH_FACTOR,
  calculateHealthFactor,
  calculateUserAssetMaxBorrowAmount,
} from '@utils/math'

import { BORROW_PERCENTAGE_DECIMALS } from './BorrowAsset.constants'

export const MAX_HF = 20
const MAX_HF_BIG_NUMBER = BigNumber.from(MAX_HF).mul(
  BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL),
)

const useAvailableToBorrow = (
  tokenPrice: BigNumber,
  tokenAddress?: string,
  interestRate: BorrowType = BorrowType.variable,
) => {
  const [availableToBorrow, setAvailableToBorrow] = useState(BigNumber.from(0))
  const [borrowIsCapped, setBorrowIsCapped] = useState(false)
  const [stableBorrowLimited, setStableBorrowLimited] = useState(false)
  const userData = useSelector(userDataSelector.userDataInfo)
  const reserveSelector = useSelector(reservesSelectors.selectById)
  const tokenSelector = useSelector(tokenSelectors.selectById)
  const token = tokenSelector(tokenAddress)
  const reserve = reserveSelector(tokenAddress)

  const totalBorrowed = reserve
    ? reserve.totalStableDebt.add(reserve.totalVariableDebt)
    : BigNumber.from(0)

  const borrowCap =
    reserve?.borrowCap?.mul(BigNumber.from(10).pow(reserve.decimals)) ||
    BigNumber.from(0)

  useEffect(() => {
    if (token && reserve) {
      let result: BigNumber
      const {
        availableBorrow,
        borrowIsCapped,
      } = calculateUserAssetMaxBorrowAmount(
        userData.totalCollateral,
        userData.totalBorrow,
        userData.ltv,
        token.decimals,
        reserve.availableLiquidity,
        tokenPrice,
        totalBorrowed,
        borrowCap,
      )
      result = availableBorrow
      const stableBorrowLimit = reserve.availableLiquidity
        .mul(BigNumber.from(2500))
        .div(BigNumber.from(10000))
      setStableBorrowLimited(false)
      if (
        interestRate == BorrowType.stable &&
        stableBorrowLimit.lt(availableBorrow)
      ) {
        result = stableBorrowLimit
        setStableBorrowLimited(true)
      }

      setAvailableToBorrow(result)
      setBorrowIsCapped(borrowIsCapped)
    }
  }, [tokenPrice, userData, token, reserve, interestRate])

  return { availableToBorrow, borrowIsCapped, stableBorrowLimited }
}

export const useUserAvailableToBorrow = (
  tokenAddress?: string,
  interestRate: BorrowType = BorrowType.variable,
): {
  availableToBorrow: BigNumber
  healthFactor: BigNumber
  amount: BigNumber | undefined
  percentage: number
  setUserAmount: (value: BigNumber | undefined) => void
  borrowIsCapped: boolean
  stableBorrowLimited: boolean
} => {
  const tokenSelector = useSelector(tokenSelectors.selectById)
  const token = tokenSelector(tokenAddress)

  const selectPriceById = useSelector(pricesSelectors.selectById)
  const tokenPrice = selectPriceById(token?.symbol).price
  const userData = useSelector(userDataSelector.userDataInfo)
  const [userPercentage, setUserPercentage] = useState(0)
  const [userAmount, setUserAmount] = useState<BigNumber | undefined>()
  const [healthFactor, setHealthFactor] = useState<BigNumber>(MAX_BIG_NUMBER)

  const {
    availableToBorrow,
    borrowIsCapped,
    stableBorrowLimited,
  } = useAvailableToBorrow(tokenPrice, tokenAddress, interestRate)

  const calculateNewHealthFactor = useCallback(
    (borrowAmount: BigNumber) => {
      if (token) {
        const totalBorrow = userData.totalBorrow.add(
          borrowAmount
            .mul(BigNumber.from(10).pow(ETH_DECIMALS - token.decimals))
            .mul(tokenPrice)
            .div(
              BigNumber.from(10).pow(
                CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
              ),
            ),
        )

        const userHealthFactor = calculateHealthFactor(
          totalBorrow,
          userData.totalCollateral,
          userData.currentLiquidationThreshold,
        )

        return userHealthFactor
      }
      return ONE_HEALTH_FACTOR
    },
    [token, userData, tokenPrice],
  )

  useEffect(() => {
    if (
      token &&
      userData &&
      userData.isInitialized &&
      tokenPrice &&
      tokenPrice.gt(0) &&
      healthFactor.eq(MAX_BIG_NUMBER)
    ) {
      setHealthFactor(calculateNewHealthFactor(BigNumber.from(0)))
    }
  }, [
    token,
    userData,
    tokenPrice,
    setHealthFactor,
    healthFactor,
    calculateNewHealthFactor,
  ])

  const calculatePercentage = (newHealthFactor: BigNumber): number => {
    if (newHealthFactor.gt(MAX_HF_BIG_NUMBER)) return 0
    return MAX_HF_BIG_NUMBER.sub(newHealthFactor)
      .div(
        BigNumber.from(10).pow(
          HEALTH_FACTOR_DECIMAL - BORROW_PERCENTAGE_DECIMALS,
        ),
      )
      .toNumber()
  }

  const onAmountChange = (newAmount: BigNumber) => {
    if (token) {
      const newHealthFactor = calculateNewHealthFactor(
        newAmount || BigNumber.from(0),
      )
      const newPercentage = calculatePercentage(newHealthFactor)

      setUserPercentage(newPercentage)
      setUserAmount(newAmount || BigNumber.from(0))
      setHealthFactor(newHealthFactor)
    }
  }

  return {
    availableToBorrow,
    healthFactor,
    amount: userAmount,
    percentage: userPercentage,
    setUserAmount: onAmountChange,
    borrowIsCapped,
    stableBorrowLimited,
  }
}
