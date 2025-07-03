import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

const APPROVE_TOKEN_TITLE = 'Approve token transfer'
const APPROVE_TOKEN_DESCRIPTION = (
  symbol: string,
  amount: string,
  receiverName: string,
): string =>
  `The operation allow contract to transfer ${amount} ${symbol} tokens to ${receiverName} contract`

const DEPOSIT_TO_POOL_TITLE = 'Deposit to pool transfer'
const DEPOSIT_TO_POOL_DESCRIPTION = (
  tokens: IToken[],
  amounts: BigDecimal[],
  receiverName: string,
): string => {
  return `The operation allow contract to transfer ${tokens
    .map((token, index) => `${amounts[index].toString()} ${token.symbol}`)
    .join(', ')} to ${receiverName} contract`
}

const WITHDRAW_TITLE = 'Withdraw transfer'

const WITHDRAW_DESCRIPTION_PERCENTAGE = (
  lpTokenAmount: string,
  lpTokenSymbol: string,
  withdrawTokens: string[],
): string =>
  `The operation withdraw tokens by burning ${lpTokenAmount} ${lpTokenSymbol} tokens and receive ${withdrawTokens.join(
    ', ',
  )} `

const WITHDRAW_DESCRIPTION_AMOUNT = (
  inToken: IToken,
  inTokenAmount: BigDecimal,
  outTokens: IToken[],
  outTokensAmounts: BigDecimal[],
): string => {
  return `The operation allow contract to burn ${inTokenAmount.toString()} ${
    inToken.symbol
  } tokens and receive ${outTokens
    .map(
      (token, index) => `${outTokensAmounts[index].toString()} ${token.symbol}`,
    )
    .join(', ')}`
}

const SWAP_TITLE = 'Swap transfer'
const SWAP_DESCRIPTION = (
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDisplayValue: string,
): string =>
  `The operation allow contract to swap ${baseTokenDisplayValue} ${baseTokenSymbol} tokens to ${quoteTokenSymbol} tokens`

const BLOCK_FINALIZATION_TITLE = 'Transaction confirmation'

const BLOCK_FINALIZATION_DESCRIPTION =
  "To make sure your transaction succeed we've waiting on block containing this transaction receipt."

const LOCK_DESCRIPTION = (
  baseTokenSymbol: string,
  baseTokenDisplayValue: string,
): string =>
  `The operation allow contract to lock ${baseTokenDisplayValue} ${baseTokenSymbol} tokens`

export const messages = {
  APPROVE_TOKEN_TITLE,
  APPROVE_TOKEN_DESCRIPTION,
  BLOCK_FINALIZATION_TITLE,
  BLOCK_FINALIZATION_DESCRIPTION,
  DEPOSIT_TO_POOL_TITLE,
  DEPOSIT_TO_POOL_DESCRIPTION,
  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION_AMOUNT,
  WITHDRAW_DESCRIPTION_PERCENTAGE,
  SWAP_TITLE,
  SWAP_DESCRIPTION,
  LOCK_DESCRIPTION,
}
