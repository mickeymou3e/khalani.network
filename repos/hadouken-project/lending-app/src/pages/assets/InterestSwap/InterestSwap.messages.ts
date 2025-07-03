import { CANCEL } from '@constants/messages'

const INTEREST_SWAP_TITLE = `Switch interest type to`
const INTEREST_SWAP_DESCRIPTION =
  'These are your transaction details. Make sure to check if this is correct before submitting.'
const INTEREST_SWAP_TOOLTIP =
  '* If your health factor decreases below 1, the liquidation of your deposits may be triggered.'
const AMOUNT = 'Amount'
const SUBMIT = 'Submit'

const CURRENT_BORROW_TYPE = (borrowType: string): string =>
  `Current Borrow type ${borrowType} rate`

const NEXT_BORROW_TYPE = (borrowType: string): string =>
  `Next Borrow type ${borrowType} rate`

export const messages = {
  INTEREST_SWAP_TITLE,
  INTEREST_SWAP_DESCRIPTION,
  INTEREST_SWAP_TOOLTIP,
  SUBMIT,
  CANCEL,
  AMOUNT,
  CURRENT_BORROW_TYPE,
  NEXT_BORROW_TYPE,
}
