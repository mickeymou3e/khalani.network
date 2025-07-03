import { CANCEL } from '@constants/messages'

const WITHDRAW_TITLE = 'How much would you like to withdraw?'
const WITHDRAW_DESCRIPTION =
  'Please enter an amount you would like to withdraw. The maximum amount you can withdraw is shown below.'
const CURRENT_WITHDRAW_BALANCE = 'Current withdraw balance'
const NEW_WITHDRAW_BALANCE = 'New withdraw balance'
// const OLD_HEALTH_FACTOR = 'Old health factor'
// const NEW_HEALTH_FACTOR = 'New health factor *'
// const HEALTH_FACTOR_TIP =
//   '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'

const WITHDRAW = 'Withdraw'

export const messages = {
  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION,
  WITHDRAW,
  CANCEL,
  CURRENT_WITHDRAW_BALANCE,
  NEW_WITHDRAW_BALANCE,
}
