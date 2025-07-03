import { gql } from 'graphql-request'

export const usersQuery = gql`
  {
    users {
      id
      aTokenAssets {
        id
        address
        underlyingAsset
        scaledBalance
        isCollateral
      }
      variableBorrowAssets {
        id
        address
        underlyingAsset
        scaledVariableDebt
      }
      stableBorrowAssets {
        id
        address
        underlyingAsset
        principalStableDebt
      }
    }
  }
`
export const reservesQuery = gql`
  {
    reserves {
      address
      symbol
      decimals
      variableBorrowIndex
      variableBorrowRate
      stableBorrowRate
      liquidityIndex
      liquidityRate
      liquidityThreshold
      aTokenAddress
      variableDebtTokenAddress
      stableDebtTokenAddress
      liquidityBonus
      lastUpdateTimestamp
      ltv
      isActive
    }
  }
`
