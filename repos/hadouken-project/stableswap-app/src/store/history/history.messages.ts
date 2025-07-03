import { convertNumberToStringWithCommas } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { BigDecimal } from '@utils/math'

const APPROVE_TOKEN_TITLE = 'Approve token spend'

const APPROVE_BATCH_RELAYER_TITLE = 'Approve batch relayer'
const APPROVE_BATCH_RELAYER_DESCRIPTION =
  'This transaction allows Hadouken’s batch relayer to make calls to the vault on your behalf.'

const APPROVE_TOKEN_DESCRIPTION = (symbol: string, amount: string): string =>
  `This transaction allows Hadouken to access ${convertNumberToStringWithCommas(
    Number(amount),
    4,
    true,
  )} ${symbol} tokens from your wallet.`

const DEPOSIT_TO_POOL_TITLE = 'Deposit to liquidity pool'
const DEPOSIT_TO_POOL_DESCRIPTION = (
  tokens: IToken[],
  amounts: BigDecimal[],
  receiverName: string,
): string => {
  return `This transaction allows Hadouken to transfer ${tokens
    .map((token, index) =>
      amounts[index].gt(BigDecimal.from(0))
        ? `${convertNumberToStringWithCommas(
            amounts[index].toNumber(),
            4,
            true,
          )} ${token.displayName}`
        : null,
    )
    .filter((token) => token !== null)
    .join(', ')} to the ${receiverName}.`
}

const WITHDRAW_TITLE = 'Withdraw from liquidity pool'

const WITHDRAW_DESCRIPTION_AMOUNT = (
  inToken: IToken,
  inTokenAmount: BigDecimal,
  outTokens: IToken[],
  outTokensAmounts: BigDecimal[],
): string => {
  return `This transaction allows Hadouken to burn ${convertNumberToStringWithCommas(
    inTokenAmount.toNumber(),
    4,
    true,
  )} ${inToken.symbol} LP tokens and receive ${outTokens
    .map((token, index) =>
      outTokensAmounts[index].gt(BigDecimal.from(0))
        ? `${convertNumberToStringWithCommas(
            outTokensAmounts[index].toNumber(),
            4,
            true,
          )} ${token.displayName}`
        : null,
    )
    .filter((token) => token !== null)
    .join(', ')}.`
}

const SWAP_TITLE = 'Swap transaction'
const SWAP_DESCRIPTION = (
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDisplayValue: string,
): string =>
  `This transaction allows Hadouken to swap ${convertNumberToStringWithCommas(
    Number(baseTokenDisplayValue),
    4,
    true,
  )} ${baseTokenSymbol} to ${quoteTokenSymbol}.`

const BLOCK_FINALIZATION_DESCRIPTION =
  'Waiting for final transaction confirmation on Nervos Layer 1. This may take up to 45 seconds.'

const MINT_TOKEN_TITLE = 'Mint token'
const MINT_TOKEN_DESCRIPTION = (
  tokenName: string,
  amount: BigDecimal,
): string => {
  return `This transaction allows Hadouken to mint 
  ${convertNumberToStringWithCommas(
    amount.toNumber(),
    4,
    true,
  )} ${tokenName} testnet tokens`
}

const STAKE_TO_BACKSTOP_TITLE = 'stake to Backstop pool'
const STAKE_TO_BACKSTOP_DESCRIPTION =
  ' Stake your Boosted Weighted TriCrypto Lp tokens to Backstop pool'

const LOCK_TITLE = 'Lock'
const LOCK_DESCRIPTION = (amount: BigDecimal, tokenName: string): string =>
  `This transaction allows Hadouken to lock your ${amount} ${tokenName} tokens to participate in the lock drop`

const CLAIM_TITLE = 'Claim'
const CLAIM_DESCRIPTION = 'This transaction allows Hadouken to claim tokens'

const UNLOCK_TITLE = 'Unlock'
const UNLOCK_DESCRIPTION = 'This transaction allows Hadouken to unlock asset'

export const messages = {
  APPROVE_TOKEN_TITLE,
  APPROVE_TOKEN_DESCRIPTION,
  APPROVE_BATCH_RELAYER_TITLE,
  APPROVE_BATCH_RELAYER_DESCRIPTION,

  BLOCK_FINALIZATION_DESCRIPTION,

  DEPOSIT_TO_POOL_TITLE,
  DEPOSIT_TO_POOL_DESCRIPTION,

  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION_AMOUNT,

  SWAP_TITLE,
  SWAP_DESCRIPTION,

  MINT_TOKEN_TITLE,
  MINT_TOKEN_DESCRIPTION,

  STAKE_TO_BACKSTOP_TITLE,
  STAKE_TO_BACKSTOP_DESCRIPTION,

  LOCK_TITLE,
  LOCK_DESCRIPTION,

  CLAIM_TITLE,
  CLAIM_DESCRIPTION,

  UNLOCK_TITLE,
  UNLOCK_DESCRIPTION,
}
