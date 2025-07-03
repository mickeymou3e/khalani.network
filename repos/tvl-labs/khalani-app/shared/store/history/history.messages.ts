/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TokenModelBalanceWithChain,
  TokenModel,
  BigDecimal,
} from '@tvl-labs/sdk'

const APPROVE_TOKEN_TITLE = 'Approve token transfer'
const APPROVE_TOKEN_DESCRIPTION = (
  symbol: string,
  amount: string,
  receiverName: string,
): string =>
  `The operation allows contract to approve ${Number(amount).toFixed(
    2,
  )} ${symbol} tokens to ${receiverName} contract`

const DEPOSIT_TO_POOL_TITLE = 'Deposit to pool transfer'
const DEPOSIT_TO_POOL_DESCRIPTION = (
  tokens: TokenModelBalanceWithChain[],
  amounts: BigDecimal[],
  receiverName: string,
): string => {
  return `The operation allow contract to transfer ${tokens
    .map((token, index) => `${amounts[index].toString()} ${token.symbol}`)
    .join(', ')} to ${receiverName} contract`
}

const REMOVE_TITLE = 'Remove liquidity'
const REMOVE_DESCRIPTION_AMOUNT = (
  inToken: TokenModel,
  inTokenAmount: BigDecimal,
  outTokens: TokenModel[],
  outTokensAmounts: BigDecimal[],
): string => {
  return `This operation allows contract to burn ${inTokenAmount.toFixed(2)} ${
    inToken.symbol
  } LP tokens and receive ${outTokens
    .map(
      (token, index) => `${outTokensAmounts[index].toFixed(2)} ${token.symbol}`,
    )
    .join(', ')}`
}

const BLOCK_FINALIZATION_TITLE = 'Transaction confirmation'

const BLOCK_FINALIZATION_DESCRIPTION =
  "To make sure your transaction succeeded we're waiting on block containing this transaction receipt."

const LOCK_DESCRIPTION = (
  baseTokenSymbol: string,
  baseTokenDisplayValue: string,
): string =>
  `The operation allows contract to lock ${baseTokenDisplayValue} ${baseTokenSymbol} tokens.`

const DEPOSIT_TOKEN_AND_CALL = 'Deposit on source chain'

export const messages = {
  APPROVE_TOKEN_TITLE,
  APPROVE_TOKEN_DESCRIPTION,
  BLOCK_FINALIZATION_TITLE,
  BLOCK_FINALIZATION_DESCRIPTION,
  DEPOSIT_TO_POOL_TITLE,
  DEPOSIT_TO_POOL_DESCRIPTION,
  REMOVE_TITLE,
  REMOVE_DESCRIPTION_AMOUNT,
  LOCK_DESCRIPTION,
  DEPOSIT_TOKEN_AND_CALL,
}
