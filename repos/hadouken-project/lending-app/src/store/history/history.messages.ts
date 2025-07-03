import { formatUnits } from 'ethers/lib/utils'

import { BorrowType } from '@constants/Lending'
import { convertNumberToStringWithCommas } from '@hadouken-project/ui'
import { ITokenValue } from '@interfaces/tokens'
import {
  convertSymbolToDisplayValue,
  getBorrowTypeName,
  getNextBorrowTypeName,
} from '@utils/token'

const APPROVE_TOKEN_TITLE = 'Approve token spend'
const APPROVE_TOKEN_DESCRIPTION = (token: ITokenValue): string =>
  `This transaction allows Hadouken to access ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} tokens from your wallet.`

const BLOCK_FINALIZATION_DESCRIPTION =
  'Waiting for final transaction confirmation on Nervos Layer 1. This may take up to 45 seconds.'

const BACKSTOP_DEPOSIT_TITLE = 'Deposit to backstop'
const BACKSTOP_DEPOSIT_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to transfer ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} into the backstop.`
}

const DEPOSIT_TITLE = 'Deposit to lending pool'
const DEPOSIT_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to deposit ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} into the lending pool.`
}

const WITHDRAW_TITLE = 'Withdraw from lending pool'
const WITHDRAW_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to withdraw ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} from the lending pool.`
}

const BACKSTOP_WITHDRAW_TITLE = 'Withdraw from backstop'
const BACKSTOP_WITHDRAW_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to withdraw ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} from the backstop.`
}

const BORROW_TITLE = 'Borrow from pool'
const BORROW_DESCRIPTION = (
  token: ITokenValue,
  borrowType: BorrowType,
): string => {
  return `This transaction allows Hadouken to borrow ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol)} using ${getBorrowTypeName(
    borrowType,
  )} rate.`
}

const REPAY_TITLE = 'Repay pool debt'
const REPAY_DESCRIPTION = (token: ITokenValue): string => {
  return `This transaction allows Hadouken to repay ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(
    token.symbol,
  )} towards your open loan position.`
}

const SWAP_BORROW_MODE_TITLE = 'Swap borrow mode'
const SWAP_BORROW_MODE_DESCRIPTION = (
  token: ITokenValue,
  borrowType: BorrowType,
): string => {
  const currentInterestType = getBorrowTypeName(borrowType)
  const nextInterestType = getNextBorrowTypeName(borrowType)
  return `This transactions allows Hadouken to switch your open ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(
    token.symbol,
  )} loan position from a ${currentInterestType} borrow rate to a ${nextInterestType} borrow rate.`
}

const COLLATERAL_TITLE = 'Changing collateral status'
const COLLATERAL_DESCRIPTION = (
  token: ITokenValue,
  useAsCollateral: boolean,
  chainId?: string,
): string => {
  return `This transaction allows Hadouken to switch ${
    useAsCollateral ? 'on' : 'off'
  } the collateral status of your ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol, chainId)} deposit.`
}

const MINT_TITLE = 'Mint asset'
const MINT_DESCRIPTION = (token: ITokenValue, chainId: string): string => {
  return `This transaction allows Hadouken to mint ${convertNumberToStringWithCommas(
    Number(formatUnits(token.value, token.decimals)),
    4,
    true,
  )} ${convertSymbolToDisplayValue(token.symbol, chainId)}.`
}

export const messages = {
  APPROVE_TOKEN_TITLE,
  APPROVE_TOKEN_DESCRIPTION,

  BLOCK_FINALIZATION_DESCRIPTION,

  DEPOSIT_TITLE,
  DEPOSIT_DESCRIPTION,

  BACKSTOP_DEPOSIT_TITLE,
  BACKSTOP_DEPOSIT_DESCRIPTION,

  WITHDRAW_TITLE,
  WITHDRAW_DESCRIPTION,

  BACKSTOP_WITHDRAW_TITLE,
  BACKSTOP_WITHDRAW_DESCRIPTION,

  BORROW_TITLE,
  BORROW_DESCRIPTION,

  REPAY_TITLE,
  REPAY_DESCRIPTION,

  SWAP_BORROW_MODE_TITLE,
  SWAP_BORROW_MODE_DESCRIPTION,

  COLLATERAL_TITLE,
  COLLATERAL_DESCRIPTION,

  MINT_TITLE,
  MINT_DESCRIPTION,
}
