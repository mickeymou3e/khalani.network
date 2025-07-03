import { CANCEL } from '@constants/messages'

const DEPOSIT_TITLE = 'How much would you like to deposit?'
const DEPOSIT_DESCRIPTION = (symbol: string): string =>
  `You may further boost your ${symbol} deposits by depositing h${symbol} into the backstop pool. Funds in the backstop will be used to perform crowdsourced liquidations, resulting in pro-rated liquidation bonuses for all h${symbol} depositors. Note that you may receive other tokens in addition to h${symbol}, depending on which types of positions are liquidated.`
const CURRENT_DEPOSIT_BALANCE = 'Current deposit balance'
const NEW_DEPOSIT_BALANCE = 'New deposit balance'
const OLD_HEALTH_FACTOR = 'Old health factor'
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
