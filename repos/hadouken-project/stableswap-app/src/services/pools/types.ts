import { BigNumber } from 'ethers'

import { IPoolToken } from '@dataSource/graph/pools/poolsTokens/types'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import {
  ExitPoolRequest,
  FundManagement,
  JoinPoolRequest,
  OutputReference,
  SwapType,
} from '@hadouken-project/sdk'
import { IPool } from '@interfaces/pool'
import { Balances, IToken } from '@interfaces/token'

import { BatchSwapStep, SwapV2 } from '../trade/types'

export interface IPoolServiceProvider {
  provide(pool: IPool): IPoolService | null
}

export type QueryJoinParams = {
  account: string
  pool: IPool
  allPools: IPool[]
  allTokens: IPoolToken[]
  amountsIn: BigNumber[]
  tokensIn: string[]
  chainId: string
  slippage?: BigNumber
}

export type QueryJoinResult = {
  amountOut: BigNumber
  amountsIn: BigNumber[]
  error?: string
  isWEth: boolean
  ethAmount: BigNumber
}

export type JoinParams = {
  account: string
  pool: IPool
  allPools: IPool[]
  allTokens: IPoolToken[]
  amountsIn: BigNumber[]
  tokensIn: string[]
  chainId: string
  minBptOut?: BigNumber
  slippage?: BigNumber
  stakeToBackstop?: boolean
  backstop?: string
}

export type QueryJoinSwapParams = {
  amountsOut: BigNumber[]
  assets: string[]
  swaps: SwapV2[]
  error?: string
}

export type QueryExitTokenInParams = {
  account: string
  pool: IPool
  allPools: IPool[]
  tokenInAddress: IToken['address']
  amountsIn: BigNumber[]
  tokensOutAddresses: IToken['address'][]
  chainId: string
  balances?: Balances
}

export type QueryExitTokenInResult = {
  amountsOut: BigNumber[]
  amountsIn: BigNumber[]
  swaps: SwapV2[]
  assets: string[]
}

export type ExitTokenInParams = {
  account: string
  pool: IPool
  allPools: IPool[]
  allTokens: IPoolToken[]
  tokenInAddress: IToken['address']
  amountsIn: BigNumber[]
  tokensOutAddresses: IToken['address'][]
  slippage?: BigNumber
  chainId: string
  balances?: Balances
}

export type QueryExitTokensOutParams = {
  account: string
  pool: IPool
  tokenInAddress: IToken['address']
  amountsOut: BigNumber[]
  tokensOutAddresses: IToken['address'][]
  chainId: string
}

export type QueryExitTokensOutResult = {
  amountsOut: BigNumber[]
  amountsIn: BigNumber[]
  swaps: SwapV2[]
  assets: string[]
}

export type ExitTokensOutParams = {
  account: string
  pool: IPool
  allPools: IPool[]
  allTokens: IPoolToken[]
  tokenInAddress: IToken['address']
  amountsOut: BigNumber[]
  tokensOutAddresses: IToken['address'][]
  fullUserLpTokenBalance?: BigNumber
  isMaxAmount?: boolean
  tokenIndex?: number | null
  slippage?: BigNumber
  chainId: string
}

export type SwapPair = {
  swaps: BatchSwapStep[]
  assets: string[]
}

export interface EncodeAaveDepositInput {
  staticToken: string
  sender: string
  recipient: string
  amount: BigNumber
  fromUnderlying: boolean
  outputReference: BigNumber
}

export interface EncodeBackstopDepositInput {
  triCryptoBackstop: string
  sender: string
  recipient: string
  amount: BigNumber
}

export interface EncodeAaveWithdrawInput {
  staticToken: string
  sender: string
  recipient: string
  amount: BigNumber
  toUnderlying: boolean
  outputReference: BigNumber
}

export interface EncodeBatchSwapInput {
  swapType: SwapType
  swaps: BatchSwapStep[]
  assets: string[]
  funds: FundManagement
  limits: string[]
  deadline: BigNumber
  value: BigNumber
  outputReferences: OutputReference[]
}

export interface EncodeRefundTokens {
  tokens: string[]
  recipient: string
}

export interface EncodeJoinPoolInput {
  poolId: string
  poolKind: number
  sender: string
  recipient: string
  joinPoolRequest: JoinPoolRequest
  value: BigNumber
  outputReference: BigNumber
}

export interface EncodeExitPoolInput {
  poolId: string
  poolKind: number
  sender: string
  recipient: string
  outputReferences: OutputReference[]
  exitPoolRequest: ExitPoolRequest
}

export type BatchSwapData = {
  swaps: SwapV2[]
  assets: string[]
}

export type WeightedBoostedLendingTokensJoinParams = {
  pool: IPool
  allPools: IPool[]
  minBptOut?: BigNumber
  destinationTokens: string[]
  lendingTokens: IPoolToken[]
  tokensIn: string[]
  account: string
  amountsIn: BigNumber[]
  allTokens: IPoolToken[]
  slippage: BigNumber
  notEmptyTokensIn: string[]
  stakeToBackstop?: boolean
  backstop?: string
  ethAmount?: BigNumber
}

// There are four possible operations in `manageUserBalance`:
//
// - DEPOSIT_INTERNAL
// Increases the Internal Balance of the `recipient` account by transferring tokens from the corresponding
// `sender`. The sender must have allowed the Vault to use their tokens via `IERC20.approve()`.
//
// ETH can be used by passing the ETH sentinel value as the asset and forwarding ETH in the call: it will be wrapped
// and deposited as WETH. Any ETH amount remaining will be sent back to the caller (not the sender, which is
// relevant for relayers).
//
// Emits an `InternalBalanceChanged` event.
//
//
// - WITHDRAW_INTERNAL
// Decreases the Internal Balance of the `sender` account by transferring tokens to the `recipient`.
//
// ETH can be used by passing the ETH sentinel value as the asset. This will deduct WETH instead, unwrap it and send
// it to the recipient as ETH.
//
// Emits an `InternalBalanceChanged` event.
//
//
// - TRANSFER_INTERNAL
// Transfers tokens from the Internal Balance of the `sender` account to the Internal Balance of `recipient`.
//
// Reverts if the ETH sentinel value is passed.
//
// Emits an `InternalBalanceChanged` event.
//
//
// - TRANSFER_EXTERNAL
// Transfers tokens from `sender` to `recipient`, using the Vault's ERC20 allowance. This is typically used by
// relayers, as it lets them reuse a user's Vault allowance.
//
// Reverts if the ETH sentinel value is passed.
//
// Emits an `ExternalBalanceTransfer` event.
export enum UserBalanceOpKind {
  DEPOSIT_INTERNAL = 0,
  WITHDRAW_INTERNAL = 1,
  TRANSFER_INTERNAL = 2,
  TRANSFER_EXTERNAL = 3,
}

export type LendingToken = { address: string; wrappedAmount: BigNumber }
export type ChainReferenceTokenAmount = { address: string; amount: BigNumber }

export interface IPoolService {
  queryJoin({
    account,
    pool,
    amountsIn,
    tokensIn,
    slippage,
  }: QueryJoinParams): Promise<QueryJoinResult>

  join({
    account,
    pool,
    allPools,
    amountsIn,
    tokensIn,
    slippage,
    stakeToBackstop,
    backstop,
  }: JoinParams): Promise<TransactionResponse>

  queryExitTokenIn({
    account,
    pool,
    allPools,
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
    balances,
  }: QueryExitTokenInParams): Promise<QueryExitTokenInResult>

  exitTokenIn({
    account,
    pool,
    tokenInAddress,
    amountsIn,
    tokensOutAddresses,
  }: ExitTokenInParams): Promise<TransactionResponse>

  queryExitTokensOut({
    account,
    pool,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
  }: QueryExitTokensOutParams): Promise<QueryExitTokensOutResult>

  exitTokensOut({
    account,
    pool,
    tokenInAddress,
    amountsOut,
    tokensOutAddresses,
    fullUserLpTokenBalance,
    isMaxAmount,
    tokenIndex,
  }: ExitTokensOutParams): Promise<TransactionResponse>
}
