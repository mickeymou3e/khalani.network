import { CANCEL } from '@constants/messages'

const WITHDRAW_TITLE = 'How much would you like to withdraw?'
const WITHDRAW_DESCRIPTION =
  'Please enter an amount you would like to withdraw. The maximum amount you can withdraw is shown below.'
const WITHDRAW = 'WITHDRAW'
const WITHDRAW_ALL = 'Withdraw all'
const REMAINING_TO_WITHDRAW = 'Balance after withdrawal'
const OLD_HEALTH_FACTOR = 'Old health factor'
const NEW_HEALTH_FACTOR = 'New health factor'
const HEALTH_FACTOR_TOOLTIP =
  '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'
const LIMITED_LIQUIDITY = 'Withdraw is limited by available liquidity'

export const messages = {
  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION,
  WITHDRAW,
  WITHDRAW_ALL,
  OLD_HEALTH_FACTOR,
  NEW_HEALTH_FACTOR,
  REMAINING_TO_WITHDRAW,
  HEALTH_FACTOR_TOOLTIP,
  LIMITED_LIQUIDITY,
  CANCEL,
}
