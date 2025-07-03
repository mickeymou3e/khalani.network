import { CANCEL } from '@constants/messages'

const BORROW_TITLE = 'How much would you like to borrow?'
const BORROW_DESCRIPTION =
  'Please enter an amount you would like to borrow. The maximum amount you can borrow is shown below.'
const BORROW = 'Borrow'
const SAFER = 'Safer'
const RISKIER = 'Riskier'
const INTEREST_RATE = 'Interest rate'
const STABLE_BORROW_LIMITED =
  'Stable borrow is limited to 25% of available liquidity'
const HEALTH_FACTOR = 'Health factor'
const STABLE_BORROW_SAME_AS_COLLATERAL =
  'Collateral is (mostly) the same currency that is being borrowed'

export const messages = {
  BORROW_TITLE,
  BORROW_DESCRIPTION,
  BORROW,
  SAFER,
  RISKIER,
  HEALTH_FACTOR,
  INTEREST_RATE,
  STABLE_BORROW_LIMITED,
  STABLE_BORROW_SAME_AS_COLLATERAL,
  CANCEL,
}
