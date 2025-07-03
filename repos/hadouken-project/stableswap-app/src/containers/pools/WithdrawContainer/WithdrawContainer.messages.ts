const DISMISS = 'Dismiss'
const TITLE = 'Withdraw from pool'
const PROPORTIONAL_WITHDRAW = 'Proportional withdraw'
const SLIPPAGE_TOLERANCE = 'Slippage tolerance'
const CUSTOM_AMOUNT = 'Custom amount'
const EXCEEDS_BALANCE = 'Exceeds Deposit Balance'
const WARNING = 'Warning'
const WITHDRAW_WARNING_DESCRIPTION =
  'You may only withdraw up to 30% of the pool’s total value with a single-asset withdrawal.'
const WRAPPED_TOKENS = 'Wrapped tokens'

const IMBALANCE_POOL_WITHDRAW_TITLE = 'Warning: large withdrawal'
const IMBALANCE_POOL_WITHDRAW_DESCRIPTION =
  'Due to your significant holdings in the pool, it may not be possible to withdraw all your assets in a single transaction. You may need to submit multiple proportional withdrawal transactions in order to remove all of your assets.'

const WITHDRAW_ERROR_TITLE = 'Withdraw unsuccessful'

const WITHDRAW_ERROR_DESCRIPTION = 'Failed to withdraw tokens'

export const messages = {
  TITLE,
  PROPORTIONAL_WITHDRAW,
  SLIPPAGE_TOLERANCE,
  CUSTOM_AMOUNT,
  EXCEEDS_BALANCE,
  WARNING,
  WITHDRAW_WARNING_DESCRIPTION,
  IMBALANCE_POOL_WITHDRAW_TITLE,
  IMBALANCE_POOL_WITHDRAW_DESCRIPTION,
  WRAPPED_TOKENS,
  WITHDRAW_ERROR_TITLE,
  DISMISS,
  WITHDRAW_ERROR_DESCRIPTION,
}
