export const getErrorMessageFromContracts = (value: number): string => {
  switch (value) {
    case 1:
      return 'Amount must be greater than 0'
    case 2:
      return 'Action requires an active reserve'
    case 3:
      return 'Action cannot be performed because the reserve is frozen'
    case 4:
      return 'The current liquidity is not enough'
    case 5:
      return 'User cannot withdraw more than the available balance'
    case 6:
      return 'Transfer cannot be allowed.'
    case 7:
      return 'Borrowing is not enabled'
    case 8:
      return 'Invalid interest rate mode selected'
    case 9:
      return 'The collateral balance is 0'
    case 10:
      return 'Health factor is lesser than the liquidation threshold'
    case 11:
      return 'There is not enough collateral to cover a new borrow'
    case 12:
      return 'stable borrowing not enabled'
    case 13:
      return 'collateral is (mostly) the same currency that is being borrowed'
    case 14:
      return 'The requested amount is greater than the max loan size in stable rate mode'
    case 15:
      return 'for repayment of stable debt, the user needs to have stable debt, otherwise, he needs to have variable debt'
    case 16:
      return 'To repay on behalf of an user an explicit amount to repay is needed'
    case 17:
      return 'User does not have a stable rate loan in progress on this reserve'
    case 18:
      return 'User does not have a variable rate loan in progress on this reserve'
    case 19:
      return 'The underlying balance needs to be greater than 0'
    case 20:
      return 'User deposit is already being used as collateral'
    case 21:
      return 'User does not have any stable rate loan for this reserve'
    case 22:
      return 'Interest rate rebalanced conditions were not met'
    case 23:
      return 'Liquidation call failed'
    case 24:
      return 'There is not enough liquidity available to borrow'
    case 25:
      return 'The requested amount is too small for a FlashLoan.'
    case 26:
      return 'The actual balance of the protocol is inconsistent'
    case 27:
      return 'The caller of the function is not the lending pool configurator'
    case 28:
      return 'Lending pool - inconsistent flashloan params'
    case 29:
      return 'The caller of this function must be a lending pool'
    case 30:
      return 'User cannot give allowance to himself'
    case 31:
      return 'Transferred amount needs to be greater than zero'
    case 32:
      return 'Reserve has already been initialized'
    case 33:
      return 'The caller must be the pool admin'
    case 34:
      return 'The liquidity of the reserve needs to be 0'
    case 35:
      return 'Invalid a token address'
    case 36:
      return 'Invalid stable debt token address'
    case 37:
      return 'Invalid variable debt token address'
    case 38:
      return 'Invalid stable debt token underlying address'
    case 39:
      return 'Invalid variable debt token underlying address'
    case 40:
      return 'Invalid address provider id'
    case 41:
      return 'Provider is not registered'
    case 42:
      return 'Health factor is not below the threshold'
    case 43:
      return 'The collateral chosen cannot be liquidated'
    case 44:
      return 'User did not borrow the specified currency'
    case 45:
      return "There isn't enough liquidity available to liquidate"
    case 46:
      return 'No errors'
    case 47:
      return 'Invalid flashloan mode selected'
    case 48:
      return 'Math multiplication overflow'
    case 49:
      return 'Math addition overflow'
    case 50:
      return 'Math division by zero'
    case 51:
      return 'Liquidity index overflows uint128'
    case 52:
      return ' Variable borrow index overflows uint128'
    case 53:
      return 'Liquidity rate overflows uint128'
    case 54:
      return 'Variable borrow rate overflows uint128'
    case 55:
      return 'Stable borrow rate overflows uint128'
    case 56:
      return 'Invalid amount to mint'
    case 56:
      return 'Invalid amount to mint'
    case 57:
      return 'Failed to repay with collateral'
    case 58:
      return 'Invalid amount to burn'
    case 59:
      return 'User borrows on behalf, but allowance are too small'
    case 60:
      return 'Failed to swap collateral'
    case 61:
      return 'Invalid equality collateral swap'
    case 62:
      return 'Reentrancy not allowed'
    case 63:
      return 'Called must be an AToken'
    case 64:
      return 'Lending Pool is paused'
    case 65:
      return 'No more reserves allowed in Lending Pool'
    case 66:
      return 'Invalid flash loan executor return'
    case 67:
      return 'Invalid LTV'
    case 68:
      return 'Invalid liquidity threshold'
    case 69:
      return 'Invalid liquidity bonus'
    case 70:
      return 'Reserve configuration invalid decimals'
    case 71:
      return 'Reserve configuration invalid reserve factory'
    case 72:
      return 'Invalid address provider id'
    case 73:
      return 'Inconsistent flash loan params'
    case 74:
      return 'Lending pool inconsistent params length'
    case 75:
      return 'Invalid risk parameters for the reserve'
    case 76:
      return 'The caller must be the emergency admin'
    case 77:
      return 'User configuration invalid index'
    case 78:
      return 'Lending pool not a contract'
    case 79:
      return 'Stable debt token overflow'
    case 80:
      return 'Stable debt token burn exceeds balance'
    default:
      return 'No message defined'
  }
}
