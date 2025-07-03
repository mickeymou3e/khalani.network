import { Injectable } from '@nestjs/common'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { MainClient } from 'binance'

@Injectable()
export class BinanceBSCIntegrationService {
  constructor(
    private readonly binance: MainClient,
    private readonly signer: KMSSigner,
  ) {}

  async depositAddress(tokenSymbol: string) {
    const deposit = await this.binance.getDepositAddress({ coin: tokenSymbol })

    return deposit.address
  }

  async getBalances() {
    return await this.binance.getBalances()
  }

  async getWithdrawHistory() {
    return await this.binance.getWithdrawHistory()
  }

  async withdraw(
    tokenSymbol: string,
    amount: string,
    recipientAddress: string,
    network: string,
  ) {
    const tokenAmount = Number(amount)

    const withdrawID = await this.binance.withdraw({
      coin: tokenSymbol,
      address: recipientAddress,
      amount: tokenAmount,
      network,
    })

    return withdrawID.id
  }
}
