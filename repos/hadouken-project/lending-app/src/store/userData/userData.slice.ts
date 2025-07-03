import { BigNumber } from 'ethers'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import {
  IDepositAsset,
  IUserAccountData,
  IUserAccountDataWithInitialize,
} from './userData.types'

const initUserDataState: IUserAccountDataWithInitialize = {
  totalCollateral: BigNumber.from(0),
  totalDeposit: BigNumber.from(0),
  totalBorrow: BigNumber.from(0),
  currentLiquidationThreshold: BigNumber.from(0),
  ltv: BigNumber.from(0),
  depositAssets: [],
  isInitialized: false,
}

export const userDataSlice = createSlice({
  initialState: initUserDataState,
  name: StoreKeys.UserData,
  reducers: {
    initializeUserDataSuccess: (
      state,
      action: PayloadAction<IUserAccountData | undefined>,
    ) => {
      const {
        currentLiquidationThreshold,
        ltv,
        depositAssets,
        totalCollateral,
      } = action.payload ?? {
        currentLiquidationThreshold: BigNumber.from(0),
        ltv: BigNumber.from(0),
        depositAssets: [] as IDepositAsset[],
      }

      state.currentLiquidationThreshold = BigNumber.from(
        currentLiquidationThreshold,
      )
      state.totalCollateral = totalCollateral ?? BigNumber.from(0)
      state.ltv = BigNumber.from(ltv)
      state.depositAssets = depositAssets
      state.isInitialized = true

      return state
    },
    initializeUserDataFailure: (state) => {
      state.isInitialized = false
      return state
    },
    updateUserBalances: (
      state,
      action: PayloadAction<{
        totalDeposit: BigNumber
        totalCollateral: BigNumber
        totalBorrow: BigNumber
      }>,
    ) => {
      state.totalDeposit = action.payload.totalDeposit
      state.totalCollateral = action.payload.totalCollateral
      state.totalBorrow = action.payload.totalBorrow
      return state
    },
    clearUserData: (state) => {
      state.totalCollateral = BigNumber.from(0)
      state.totalDeposit = BigNumber.from(0)
      state.totalBorrow = BigNumber.from(0)
      state.currentLiquidationThreshold = BigNumber.from(0)
      state.ltv = BigNumber.from(0)
      state.depositAssets = []
      state.isInitialized = false
      return state
    },
  },
})

export const userDataActions = userDataSlice.actions
export const userDataReducer = userDataSlice.reducer
