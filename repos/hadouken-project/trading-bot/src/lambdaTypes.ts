import { TransactionReceiptPassedThroughEvent } from './formatter/formatters'
import { SwapInfo } from './execution/execution.service'
import { BigNumber } from 'ethers'

export interface ChainId {
  chainId: string
}
export interface ValidateInputEvent extends ChainId {
  stateName: 'ValidateInput'
}

export interface ArbitragePair {
  poolNameForBuy: string
  poolNameForSell: string
  baseToken: string
  quoteToken: string
  quoteTokenThreshold: string
  minProfit: string
}

export interface CalculateTradeVolumeEvent extends ChainId {
  stateName: 'CalculateTradeVolume'
  arbitragePair: ArbitragePair
  subgraphBlocksBehind: number
}

export interface ArbitrageSendTxEvent extends ChainId {
  stateName: 'SendTx'
  arbitragePair: ArbitragePair
  quoteAmount: string
  baseAmount: string
  swapInfo: SwapInfo
}

export interface LinearSendTxEvent extends ChainId {
  stateName: 'SendTx'
  poolName: string
}

export interface GetTxReceiptEvent extends ChainId {
  stateName: 'GetTxReceipt'
  txHash: string
}
export interface ArbitrageProcessTxReceiptEvent extends ChainId {
  stateName: 'ProcessTxReceipt'
  txReceipt: TransactionReceiptPassedThroughEvent
  arbitragePair: ArbitragePair
  quoteAmount: string
}

export interface LinearProcessTxReceiptEvent extends ChainId {
  stateName: 'ProcessTxReceipt'
  txReceipt: TransactionReceiptPassedThroughEvent
  poolName: string
}

export interface BinanceProcessTxReceiptEvent extends ChainId {
  stateName: 'ProcessTxReceipt'
  txReceipt: TransactionReceiptPassedThroughEvent
  poolNameForBuy: string
  poolNameForSell: string
  binanceQuoteAmount: string
  binanceBaseAmount: string
  hadoukenQuoteAmount: string
  hadoukenBaseAmount: string
  baseTokenSymbol: string
  quoteTokenSymbol: string
  quoteTokenThreshold: string
  minProfit: string
  binanceFee: string
}

export interface GetIfIsOutOfRangeEvent extends ChainId {
  stateName: 'GetIfIsOutOfRange'
  poolName: string
}

export interface GetBinanceBalances extends ChainId {
  stateName: 'GetBinanceBalances'
  symbol: string
}

export interface GetBinanceDepositAddress extends ChainId {
  stateName: 'GetBinanceDepositAddress'
  tokenSymbol: string
}

export interface GetWithdrawHistory extends ChainId {
  stateName: 'GetWithdrawHistory'
}

export interface WithdrawFromBinance extends ChainId {
  stateName: 'WithdrawFromBinance'
  tokenSymbol: string
  amount: BigNumber
  recipientAddress: string
  network: string
}

export interface FindOpportunityBinanceHadouken extends ChainId {
  stateName: 'FindOpportunity'
  poolNameForBuy: string
  poolNameForSell: string
  baseTokenSymbol: string
  quoteTokenSymbol: string
  quoteTokenThreshold: string
  minProfit: string
  subgraphBlocksBehind: number
}

export interface ExecuteTradeOnBinance extends ChainId {
  stateName: 'ExecuteTradeOnBinance'
  poolNameForBuy: string
  poolNameForSell: string
  quoteAmount: string
  baseAmount: string
  baseTokenSymbol: string
  quoteTokenSymbol: string
  binancePrice: string
}
export interface ExecuteTradeOnHadouken extends ChainId {
  stateName: 'ExecuteTradeOnHadouken'
  baseAmount: string
  baseTokenSymbol: string
  quoteTokenSymbol: string
  poolNameForBuy: string
  poolNameForSell: string
  binanceFee: string
}

export interface SorChartEvent extends ChainId {
  stateName: 'SorChartEvent'
  tokenIn: string
  tokenOut: string
  from: BigNumber
  to: BigNumber
  step: BigNumber
}

export interface TokenTransferEvent extends ChainId {
  stateName: 'TokenTransferEvent'
  tokenAddress: string
  recipient: string
  amount: BigNumber
}

export interface TokenBalanceEvent extends ChainId {
  stateName: 'TokenBalanceEvent'
  tokenAddress: string
  walletAddress: string
}

export interface FindUserToLiquidateEvent extends ChainId {
  stateName: 'FindUserToLiquidate'
}

export interface LiquidateUserEvent extends ChainId {
  stateName: 'LiquidateUser'
  userAddress: string
  debtToken: string
  collateralToken: string
  amount: string
}
export interface LiquidationProcessTxReceiptEvent extends ChainId {
  stateName: 'ProcessTxReceipt'
  txReceipt: TransactionReceiptPassedThroughEvent
  userAddress: string
  debtToken: string
  collateralToken: string
  amount: string
}
