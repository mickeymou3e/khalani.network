import { CANCEL } from '@constants/messages'

const DEPOSIT_TITLE = 'How much would you like to deposit?'
const DEPOSIT_DESCRIPTION =
  'Please enter an amount you would like to deposit. The maximum amount you can deposit is shown below.'
const CURRENT_DEPOSIT_BALANCE = 'Current deposit balance'
const NEW_DEPOSIT_BALANCE = 'New deposit balance'
const OLD_HEALTH_FACTOR = 'Current health factor'
const NEW_HEALTH_FACTOR = 'New health factor *'
const HEALTH_FACTOR_TIP =
  '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'

const DEPOSIT = 'Deposit'

export const messages = {
  DEPOSIT_TITLE,
  DEPOSIT_DESCRIPTION,
  DEPOSIT,
  CANCEL,
  OLD_HEALTH_FACTOR,
  NEW_HEALTH_FACTOR,
  CURRENT_DEPOSIT_BALANCE,
  NEW_DEPOSIT_BALANCE,
  HEALTH_FACTOR_TIP,
}
