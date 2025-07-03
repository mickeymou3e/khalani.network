const WITHDRAW_AMOUNTS_BALANCE_TO_LOW = (symbol: string): string =>
  `You do not have enough ${symbol} to withdraw`

const WITHDRAW_WRONG_NETWORK =
  'You need to change network before process with withdraw'
const WITHDRAW_NOT_LOGGED_IN = 'You need to log in before process with withdraw'

const DEPOSIT_WRONG_NETWORK =
  'You need to change network before process with deposit'
const DEPOSIT_NOT_LOGGED_IN = 'You need to log in before process with deposit'

const SOMETHING_WRONG_HAPPENS = 'Something wrong happens'

export const messages = {
  WITHDRAW_AMOUNTS_BALANCE_TO_LOW,
  WITHDRAW_WRONG_NETWORK,
  WITHDRAW_NOT_LOGGED_IN,
  DEPOSIT_WRONG_NETWORK,
  DEPOSIT_NOT_LOGGED_IN,
  SOMETHING_WRONG_HAPPENS,
}
