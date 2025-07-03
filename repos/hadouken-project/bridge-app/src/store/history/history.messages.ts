import numeral from 'numeral'

import { ITokenValue } from '@interfaces/tokens'
import { convertBigNumberToDecimal } from '@utils/stringOperations'

const AMOUNT_FORMAT = '0.0000'

const APPROVE_TOKEN_TITLE = 'Approve token spend'
const APPROVE_TOKEN_DESCRIPTION = (token: ITokenValue): string =>
  `This transaction allows Hadouken to access ${numeral(
    convertBigNumberToDecimal(token.value, token.decimals),
  ).format(AMOUNT_FORMAT)} ${token.symbol} tokens from your wallet.`

const BLOCK_FINALIZATION_DESCRIPTION =
  'Waiting for final transaction confirmation on Nervos Layer 1. This may take up to 45 seconds.'

const DEPOSIT_TITLE = 'Initiate deposit using bridge'
const DEPOSIT_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to bridge ${numeral(
    convertBigNumberToDecimal(token.value, token.decimals),
  ).format(AMOUNT_FORMAT)} ${token.symbol} tokens to Godwoken.`
}

const WITHDRAW_TITLE = 'Initiate withdraw using bridge'
const WITHDRAW_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to bridge ${numeral(
    convertBigNumberToDecimal(token.value, token.decimals),
  ).format(AMOUNT_FORMAT)} ${token.symbol} tokens from Godwoken.`
}

export const messages = {
  APPROVE_TOKEN_TITLE,
  APPROVE_TOKEN_DESCRIPTION,

  BLOCK_FINALIZATION_DESCRIPTION,

  DEPOSIT_TITLE,
  DEPOSIT_DESCRIPTION,

  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION,
}
