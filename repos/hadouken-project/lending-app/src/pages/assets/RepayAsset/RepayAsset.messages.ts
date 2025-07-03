import { CANCEL } from '@constants/messages'

const REPAY_TITLE = 'How much would you like to repay?'
const REPAY_DESCRIPTION =
  'Please enter an amount you would like to repay. The maximum amount you can repay is shown below.'
const REPAY = 'Repay'
const REPAY_ALL = 'Repay all'
const REMAIN_TO_REPAY = 'Remaining to repay'
const OLD_HEALTH_FACTOR = 'Old health factor'
const NEW_HEALTH_FACTOR = 'New health factor *'
const HEALTH_FACTOR_TOOLTIP =
  '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'
const SLIPPAGE = 'Slippage'
const SLIPPAGE_DESCRIPTION =
  'Typing slippage percentage will present minimal values user will get in target tokens '

export const messages = {
  REPAY_TITLE,
  REPAY_DESCRIPTION,
  REPAY,
  REPAY_ALL,
  REMAIN_TO_REPAY,
  OLD_HEALTH_FACTOR,
  NEW_HEALTH_FACTOR,
  HEALTH_FACTOR_TOOLTIP,
  CANCEL,
  SLIPPAGE,
  SLIPPAGE_DESCRIPTION,
}
