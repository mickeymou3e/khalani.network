import { BigNumber, ethers } from 'ethers'
import { applyDecimal, bigNumberToString } from '../yokai-sdk/utils'
import dedent = require('dedent-js')
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { ArbitragePair, LiquidationProcessTxReceiptEvent } from '../lambdaTypes'
import { pools as linearPools, vaultAddress } from '@config/linearPools.json'
import { signerAddress, treasuryAddress } from '@config/arbitragePairs.json'
import { ERC20Abi__factory } from '../../types/ethers-contracts/factories/artifacts-core/contracts/test/ERC20.sol'
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'
import { commify, formatUnits } from 'ethers/lib/utils'
import { GodwokenTokenService } from '../token/godwokenToken.service'
import { Injectable } from '@nestjs/common'
import { BalanceFetcherService } from '../balance-fetcher/balance-fetcher.service'
import { Token } from '../token/token.types'
import { EventBridgeEvent } from 'aws-lambda'
import { TriCryptoBackstopAbi } from '@hadouken-project/backstop'
import { TokenService } from '../token/token.service'
import { CHAIN_EXPLORER } from '../liquidation-fetcher/liquidation-fetcher.constants'

export type TransactionReceiptPassedThroughEvent = Omit<
  TransactionReceipt,
  | 'gasUsed'
  | 'effectiveGasPrice'
  | 'contractAddress'
  | 'transactionIndex'
  | 'logsBloom'
  | 'blockNumber'
  | 'confirmations'
  | 'cumulativeGasUsed'
  | 'byzantium'
  | 'type'
> & {
  gasUsed: {
    type: 'BigNumber'
    hex: string
  }
}

@Injectable()
export class EventBridgeEventFormatterService {
  public getFormattedText(event: EventBridgeEvent<any, any>): string {
    return dedent`
    Bot stopped early. Event message:
    \`\`\`${JSON.stringify(event, null, 2)}\`\`\`
    `
  }
}

@Injectable()
export class ArbitrageNotificationFormatterService {
  constructor(
    private readonly tokenService: GodwokenTokenService,
    private readonly balanceFetcherService: BalanceFetcherService,
  ) {}

  public async getFormattedText(
    txReceipt: TransactionReceiptPassedThroughEvent,
    arbitragePair: ArbitragePair,
    quoteAmount: string,
    gasPrice: BigNumber,
  ): Promise<string> {
    const balance = await this.balanceFetcherService.getCkbBalance()
    const success = txReceipt.status === 1
    const icon = success ? '✅' : '❌'

    const quoteToken = this.tokenService.findTokenBySymbol(
      arbitragePair.quoteToken,
    )

    const fee = BigNumber.from(txReceipt.gasUsed.hex).mul(gasPrice)

    return dedent`
      ${icon}___________________________${icon}
      Arbitrage trade ${success ? 'executed successfully!' : 'failed :('}

      ***Arbitrage pair***:
      --------------------------------------------------
      Pool for buy: ${arbitragePair.poolNameForBuy}
      Pool for sell: ${arbitragePair.poolNameForSell}
      Base token: ${arbitragePair.baseToken}
      Quote token: ${arbitragePair.quoteToken}
      Min threshold: ${bigNumberToString(
        BigNumber.from(arbitragePair.quoteTokenThreshold),
        quoteToken.decimals,
        quoteToken.decimals,
      )} ${quoteToken.symbol}
      --------------------------------------------------

      ***Amount***: ${bigNumberToString(
        BigNumber.from(quoteAmount),
        quoteToken.decimals,
        2,
      )} ${quoteToken.symbol}

      ***Gas Used***: ${bigNumberToString(fee, 18, 2)} CKB
      ${
        success
          ? `\n***Net profit***: ${bigNumberToString(
              this.getProfit(txReceipt.logs),
              quoteToken.decimals,
              2,
            )} ${quoteToken.symbol}\n`
          : ''
      }
      ***Balance after trade***: ${bigNumberToString(
        BigNumber.from(balance),
        18,
        2,
      )} CKB

      Transaction link: https://gwscan.com/tx/${txReceipt.transactionHash}
      ___________________________
      `
  }

  private getProfit(logs: ethers.providers.Log[]) {
    const erc20 = new ERC20Abi__factory()
    const transferToSigner = logs
      .map((log) => {
        try {
          return erc20.interface.parseLog(log)
        } catch {}
      })
      .find(
        (parsed) =>
          parsed?.name === 'Transfer' && this.eq(parsed.args.to, signerAddress), // Profit
      )

    if (transferToSigner) {
      return BigNumber.from(transferToSigner.args.value)
    } else {
      return BigNumber.from(0)
    }
  }

  private eq(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase()
  }
}

@Injectable()
export class LinearNotificationFormatterService {
  constructor(
    private readonly tokenService: GodwokenTokenService,
    private readonly balanceFetcherService: BalanceFetcherService,
  ) {}

  public async getFormattedText(
    txReceipt: TransactionReceiptPassedThroughEvent,
    poolName: string,
    gasPrice: BigNumber,
  ): Promise<string> {
    const balance = await this.balanceFetcherService.getCkbBalance()
    const success = txReceipt.status === 1
    const icon = success ? '✅' : '❌'

    const pool = linearPools.find(({ name }) => name === poolName)
    const mainToken = this.tokenService.findTokenBySymbol(pool.mainToken)

    const { operation, transferredToken, amount } = this.getOperation(
      mainToken,
      txReceipt.logs,
    )

    const fee = BigNumber.from(txReceipt.gasUsed.hex).mul(gasPrice)

    return dedent`
      ${icon}___________________________${icon}
      Linear pool trade ${success ? 'executed successfully!' : 'failed :('}

      ***Balancing pool***: ${pool.name}
      ${
        success
          ? `\n***Operation***: ${operation}\n` +
            `\n***Amount***: ${bigNumberToString(
              BigNumber.from(amount),
              transferredToken.decimals,
              2,
            )} ${transferredToken.symbol}\n` +
            `\n***Net profit***: ${bigNumberToString(
              this.getProfit(txReceipt.logs),
              mainToken.decimals,
              4,
            )} ${mainToken.symbol}\n`
          : ''
      }
      ***Gas Used***: ${bigNumberToString(fee, 18, 2)} CKB

      ***Balance after trade***: ${bigNumberToString(
        BigNumber.from(balance),
        18,
        2,
      )} CKB

      Transaction link: https://gwscan.com/tx/${txReceipt.transactionHash}
      ___________________________
      `
  }

  private getProfit(logs: ethers.providers.Log[]) {
    const erc20 = new ERC20Abi__factory()
    const transferToSigner = logs
      .map((log) => {
        try {
          return erc20.interface.parseLog(log)
        } catch {}
      })
      .find(
        (parsed) =>
          parsed?.name === 'Transfer' && this.eq(parsed.args.to, signerAddress),
      )

    if (transferToSigner) {
      return BigNumber.from(transferToSigner.args.value)
    } else {
      return BigNumber.from(0)
    }
  }

  private getOperation(mainToken: Token, logs: ethers.providers.Log[]) {
    const erc20 = new ERC20Abi__factory()
    const transferToVault = logs
      .map((log) => {
        try {
          return {
            log: erc20.interface.parseLog(log),
            address: log.address,
          }
        } catch {}
      })
      .find(
        (parsed) =>
          parsed?.log?.name === 'Transfer' &&
          this.eq(parsed?.log.args.to, vaultAddress),
      )

    if (transferToVault) {
      const transferredToken = this.tokenService.findTokenByAddress(
        transferToVault.address,
      )
      const operation = transferredToken === mainToken ? 'UNWIND' : 'WIND'
      return {
        amount: BigNumber.from(transferToVault.log.args.value),
        transferredToken,
        operation,
      } as const
    } else {
      return {
        amount: BigNumber.from(0),
        operation: 'NONE',
      } as const
    }
  }

  private eq(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase()
  }
}

type TransactionEvent = {
  txReceipt: TransactionReceiptPassedThroughEvent
  poolNameForBuy: string
  poolNameForSell: string
  binanceQuoteAmount: string
  binanceBaseAmount: string
  baseTokenSymbol: string
  quoteTokenSymbol: string
  quoteTokenThreshold: string
  minProfit: string
  binanceFee: string
}

@Injectable()
export class BinanceNotificationFormatterService {
  constructor(
    private readonly tokenService: GodwokenTokenService,
    private readonly balanceFetcherService: BalanceFetcherService,
  ) {}

  public async getBalancesFor(
    baseTokenSymbol: string,
    quoteTokenSymbol: string,
  ) {
    const hQuoteTokenBalance =
      await this.balanceFetcherService.getBalanceForPoolType(
        'hadouken',
        quoteTokenSymbol,
      )
    const hBaseTokenBalance =
      await this.balanceFetcherService.getBalanceForPoolType(
        'hadouken',
        baseTokenSymbol,
      )

    const bQuoteTokenBalance =
      await this.balanceFetcherService.getBalanceForPoolType(
        'binance',
        getBinanceTokenEquivalentSymbol(quoteTokenSymbol),
      )

    const bBaseTokenBalance =
      await this.balanceFetcherService.getBalanceForPoolType(
        'binance',
        baseTokenSymbol,
      )

    const hadoukenBalance = {
      quoteToken: hQuoteTokenBalance,
      baseToken: hBaseTokenBalance,
    }

    const binanceBalance = {
      quoteToken: bQuoteTokenBalance,
      baseToken: bBaseTokenBalance,
    }

    return { hadoukenBalance, binanceBalance }
  }

  public async getFormattedText(
    transactionEvent: TransactionEvent,
    gasPrice: BigNumber,
  ): Promise<string> {
    const {
      poolNameForBuy,
      binanceQuoteAmount,
      binanceBaseAmount,
      baseTokenSymbol,
      quoteTokenSymbol,
    } = transactionEvent
    const { binanceBalance, hadoukenBalance } = await this.getBalancesFor(
      baseTokenSymbol,
      quoteTokenSymbol,
    )

    const binanceQuoteTokenSymbol =
      getBinanceTokenEquivalentSymbol(quoteTokenSymbol)
    const binanceBaseTokenSymbol =
      getBinanceTokenEquivalentSymbol(baseTokenSymbol)

    const fee = BigNumber.from(transactionEvent.txReceipt.gasUsed.hex).mul(
      gasPrice,
    )

    const isBuyBinance = poolNameForBuy.includes('binance')

    const {
      decimals: baseTokenDecimals,
      address: baseTokenAddress,
      displayDecimals: baseTokenPrecision,
    } = this.tokenService.findTokenBySymbol(baseTokenSymbol)
    const {
      decimals: quoteTokenDecimals,
      address: quoteTokenAddress,
      displayDecimals: quoteTokenPrecision,
    } = this.tokenService.findTokenBySymbol(quoteTokenSymbol)

    const formattedQuoteAmountBinance = this.formatTokenAmount(
      quoteTokenDecimals,
      BigNumber.from(binanceQuoteAmount).mul(isBuyBinance ? -1 : 1),
      quoteTokenPrecision,
    )
    const formattedBaseAmountBinance = this.formatTokenAmount(
      baseTokenDecimals,
      BigNumber.from(binanceBaseAmount).mul(isBuyBinance ? 1 : -1),
      baseTokenPrecision,
    )

    const binanceBaseBalanceBefore = binanceBalance.baseToken.sub(
      BigNumber.from(binanceBaseAmount).mul(isBuyBinance ? 1 : -1),
    )

    const binanceQuoteBalanceBefore = binanceBalance.quoteToken.sub(
      BigNumber.from(binanceQuoteAmount).mul(isBuyBinance ? -1 : 1),
    )

    const binanceAfterBaseTokenBalance = this.formatTokenAmount(
      baseTokenDecimals,
      binanceBalance.baseToken,
      baseTokenPrecision,
    )
    const binanceAfterQuoteTokenBalance = this.formatTokenAmount(
      quoteTokenDecimals,
      binanceBalance.quoteToken,
      quoteTokenPrecision,
    )
    const binanceBeforeBaseTokenBalance = this.formatTokenAmount(
      baseTokenDecimals,
      binanceBaseBalanceBefore,
      baseTokenPrecision,
    )
    const binanceBeforeQuoteTokenBalance = this.formatTokenAmount(
      quoteTokenDecimals,
      binanceQuoteBalanceBefore,
      quoteTokenPrecision,
    )

    const hadoukenBaseTokenBalance = this.formatTokenAmount(
      baseTokenDecimals,
      BigNumber.from(hadoukenBalance.baseToken),
      baseTokenPrecision,
    )
    const hadoukenQuoteTokenBalance = this.formatTokenAmount(
      quoteTokenDecimals,
      BigNumber.from(hadoukenBalance.quoteToken),
      quoteTokenPrecision,
    )

    const tokenDeltas = this.getTokenDeltasFromTxLogs(
      transactionEvent.txReceipt.logs,
    )
    const hadoukenBaseChange =
      tokenDeltas.get(baseTokenAddress)?.abs() ?? BigNumber.from(0)
    const hadoukenQuoteChange =
      tokenDeltas.get(quoteTokenAddress)?.abs() ?? BigNumber.from(0)

    const formattedQuoteAmountHadouken = this.formatTokenAmount(
      quoteTokenDecimals,
      BigNumber.from(hadoukenQuoteChange).mul(isBuyBinance ? 1 : -1),
      quoteTokenPrecision,
    )

    const formattedBaseAmountHadouken = this.formatTokenAmount(
      baseTokenDecimals,
      BigNumber.from(hadoukenBaseChange).mul(isBuyBinance ? -1 : 1),
      baseTokenPrecision,
    )

    const hadoukenBaseBalanceBefore = isBuyBinance
      ? BigNumber.from(hadoukenBalance.baseToken).add(hadoukenBaseChange)
      : BigNumber.from(hadoukenBalance.baseToken).sub(hadoukenBaseChange)

    const hadoukenQuoteBalanceBefore = isBuyBinance
      ? BigNumber.from(hadoukenBalance.quoteToken).sub(hadoukenQuoteChange)
      : BigNumber.from(hadoukenBalance.quoteToken).add(hadoukenQuoteChange)

    const formattedHadoukenBaseBalanceBefore = this.formatTokenAmount(
      baseTokenDecimals,
      hadoukenBaseBalanceBefore,
      baseTokenPrecision,
    )
    const formattedHadoukenQuoteBalanceBefore = this.formatTokenAmount(
      quoteTokenDecimals,
      hadoukenQuoteBalanceBefore,
      quoteTokenPrecision,
    )

    const arbitrageProfit = ethers.utils.formatUnits(
      isBuyBinance
        ? BigNumber.from(hadoukenQuoteChange).add(
            BigNumber.from(binanceQuoteAmount).mul(-1),
          )
        : BigNumber.from(binanceQuoteAmount).add(hadoukenQuoteChange.mul(-1)),
      quoteTokenDecimals,
    )
    const formattedArbitrageProfit = commify(
      parseFloat(arbitrageProfit).toFixed(2),
    )

    const success = transactionEvent.txReceipt.status === 1
    const binanceFeesSummed = transactionEvent.binanceFee
    return dedent`
\`\`\`\


    Binance
         ${binanceBaseTokenSymbol.padStart(
           8,
         )}         |        ${binanceQuoteTokenSymbol}
            ---------------------------
    Before |${binanceBeforeBaseTokenBalance.padStart(
      13,
    )} |${binanceBeforeQuoteTokenBalance.padStart(12)}
    Change |${formattedBaseAmountBinance.padStart(
      13,
    )} |${formattedQuoteAmountBinance.padStart(12)}
    After  |${binanceAfterBaseTokenBalance.padStart(
      13,
    )} |${binanceAfterQuoteTokenBalance.padStart(12)}

    Godwoken
              ${baseTokenSymbol}         |        ${quoteTokenSymbol}
            ---------------------------
    Before |${formattedHadoukenBaseBalanceBefore.padStart(
      13,
    )} |${formattedHadoukenQuoteBalanceBefore.padStart(12)}
    Change |${formattedBaseAmountHadouken.padStart(
      13,
    )} |${formattedQuoteAmountHadouken.padStart(12)}
    After  |${hadoukenBaseTokenBalance.padStart(
      13,
    )} |${hadoukenQuoteTokenBalance.padStart(12)}

    Godwoken transaction ${success ? 'successful ✅' : 'failed ❌'}

    Binance fee:${binanceFeesSummed.padStart(20)} BNB
    Godwoken tx fee:${bigNumberToString(fee.mul(-1), 18, 2).padStart(16)} CKB
    Arbitrage profit:${formattedArbitrageProfit.padStart(
      15,
    )} ${quoteTokenSymbol}


\`\`\`
Transaction link: https://gwscan.com/tx/${
      transactionEvent.txReceipt.transactionHash
    }

`
  }

  private getTokenDeltasFromTxLogs(logs: ethers.providers.Log[]) {
    const erc20 = new ERC20Abi__factory()
    return logs
      .map((log) => {
        try {
          return { parsed: erc20.interface.parseLog(log), log }
        } catch {}
      })
      .filter((item) => {
        return item?.parsed?.name === 'Transfer'
      })
      .reduce((accumulator, { parsed, log }) => {
        const address = log.address.toLowerCase()
        const value = accumulator.get(address) ?? BigNumber.from(0)
        const trValue = BigNumber.from(parsed.args.value)
        if (this.eq(parsed.args.to, treasuryAddress)) {
          accumulator.set(address, value.add(trValue))
        }
        if (this.eq(parsed.args.from, treasuryAddress)) {
          accumulator.set(address, value.sub(trValue))
        }
        return accumulator
      }, new Map<string, BigNumber>())
  }

  private eq(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase()
  }

  formatTokenAmount(decimals: number, rawBalance: BigNumber, precision = 2) {
    const precisionFactor = applyDecimal(
      decimals - ++precision,
      BigNumber.from(10),
    )
    const tokenBalance = ethers.utils.formatUnits(
      rawBalance.div(precisionFactor).mul(precisionFactor),
      decimals,
    )

    return commify(tokenBalance)
  }
}

@Injectable()
export class LiquidationFormatterService {
  constructor(private readonly tokenService: TokenService) {}

  public getFormattedText(event: LiquidationProcessTxReceiptEvent) {
    const {
      amount,
      collateralToken: collateralTokenAddress,
      debtToken: debtTokenAddress,
      txReceipt,
      userAddress,
      chainId,
    } = event

    const isSuccess = txReceipt.status === 1

    const triCryptoBackstopInterface = new ethers.utils.Interface(
      TriCryptoBackstopAbi,
    )

    let profit = '0'
    const triCryptoPoolDecimals = 18

    const debtToken = this.tokenService.findTokenByAddress(debtTokenAddress)

    const collateralToken = this.tokenService.findTokenByAddress(
      collateralTokenAddress,
    )

    const repayAmount = this.formatTokenAmount(amount, debtToken.decimals)

    const chainExplorer: string = CHAIN_EXPLORER[chainId]

    if (isSuccess) {
      txReceipt.logs.forEach((log) => {
        try {
          const parsedLog = triCryptoBackstopInterface.parseLog(log)

          if (parsedLog && parsedLog.name === 'Liquidation') {
            profit = this.formatTokenAmount(
              parsedLog.args[parsedLog.args.length - 1].toString(),
              triCryptoPoolDecimals,
            )
          }
        } catch {}
      })
    }

    return dedent(`
      \`\`\`\


      Liquidation transaction ${isSuccess ? 'successful ✅' : 'failed ❌'}
      --------------------------------------------------
      User address: ${userAddress}
      Collateral token: ${collateralToken.symbol}
      Debt token: ${debtToken.symbol}
      Repay amount: ${repayAmount} ${debtToken.symbol}
      Profit: ${profit} HDK-TriCrypto
      
      \`\`\`
      Transaction link: ${chainExplorer}/tx/${txReceipt.transactionHash}
    `)
  }

  public formatTokenAmount(tokenAmount: string, decimals: number) {
    const amount = formatUnits(tokenAmount, decimals)

    return amount
  }
}
