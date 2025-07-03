import { CANCEL } from '@constants/messages'

const COLLATERAL_TITLE = (symbol: string): string =>
  `Switch ${symbol} collateral`
const COLLATERAL_SUBTITLE =
  'These are your transaction details. Make sure to check if this is correct before submitting.'
const USE_AS_COLLATERAL = 'Will be used as collateral'
const OLD_HEALTH_FACTOR = 'Old health factor'
const NEW_HEALTH_FACTOR = 'New health factor'
const HEALTH_FACTOR_TOO_LOW =
  'Your health factor is too low to disable asset as collateral'
const COLLATERAL_DESCRIPTION =
  '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'
const SUBMIT = 'SUBMIT'

export const messages = {
  COLLATERAL_TITLE,
  COLLATERAL_SUBTITLE,
  USE_AS_COLLATERAL,
  OLD_HEALTH_FACTOR,
  NEW_HEALTH_FACTOR,
  HEALTH_FACTOR_TOO_LOW,
  SUBMIT,
  CANCEL,
  COLLATERAL_DESCRIPTION,
}
