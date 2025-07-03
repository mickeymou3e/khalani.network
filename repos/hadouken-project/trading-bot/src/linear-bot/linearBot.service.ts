import { Inject, Injectable, Logger } from '@nestjs/common'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { DiscordNotifierService } from '../discord-notifier/discord-notifier.service'
import { pools } from '@config/linearPools.json'
import { LinearPoolSwap__factory } from '@abi/factories/LinearPoolSwap__factory'
import { ethers } from 'ethers'
import {
  EventBridgeEventFormatterService,
  LinearNotificationFormatterService,
  TransactionReceiptPassedThroughEvent,
} from '../formatter/formatters'
import { validateInput } from './validateInput'
import { EventBridgeEvent } from 'aws-lambda'
import { JSON_RPC_PROVIDER } from '../helpers'

const txOverrides = {
  gasLimit: 2_000_000,
}

@Injectable()
export class LinearBotService {
  private readonly logger = new Logger(LinearBotService.name)

  constructor(
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.JsonRpcProvider,
    private readonly signer: KMSSigner,
    private readonly discordNotifierService: DiscordNotifierService,
    private readonly formatter: LinearNotificationFormatterService,
    private readonly eventBridgeFormatter: EventBridgeEventFormatterService,
  ) {}

  async validateInput(event) {
    return await validateInput(event)
  }

  async GetIfIsOutOfRange(event: { poolName: string }) {
    const pool = pools.find((pool) => pool.name === event.poolName)
    this.logger.log(`Check if ${pool.name} is inside targets`)
    const linearPoolSwapContract = LinearPoolSwap__factory.connect(
      pool.contractAddress,
      this.signer,
    )

    const isOutsideRange =
      await linearPoolSwapContract.checkIfPoolIsOutsideRange(pool.threshold)

    if (isOutsideRange) {
      this.logger.log(`${pool.name} is outside of its targets`)
    } else {
      this.logger.log(`${pool.name} is inside of its targets`)
    }

    return isOutsideRange
  }

  async balancePool(event: { poolName: string }) {
    const pool = pools.find((pool) => pool.name === event.poolName)
    this.logger.log(`Balancing ${pool.name}`)
    const linearPoolSwapContract = LinearPoolSwap__factory.connect(
      pool.contractAddress,
      this.signer,
    )

    const tx = await linearPoolSwapContract.balancePool(
      pool.threshold,
      txOverrides,
    )

    this.logger.log(`Transaction hash: ${tx.hash}`)

    return tx.hash
  }

  async getTxReceipt(event: { txHash: string }) {
    const receipt = await this.provider.getTransactionReceipt(event.txHash)
    return receipt
  }
  async processTxReceipt(event: {
    txReceipt: TransactionReceiptPassedThroughEvent
    poolName: string
  }) {
    const tx = await this.provider.getTransaction(
      event.txReceipt.transactionHash,
    )

    const message = await this.formatter.getFormattedText(
      event.txReceipt,
      event.poolName,
      tx.gasPrice,
    )

    await this.discordNotifierService.sendNotification(message)

    return
  }
  public async notifyExecutionFailed(event: EventBridgeEvent<any, any>) {
    const message = this.eventBridgeFormatter.getFormattedText(event)
    await this.discordNotifierService.sendNotification(message)
  }
}
