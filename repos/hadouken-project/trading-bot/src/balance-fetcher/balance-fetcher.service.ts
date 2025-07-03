import { Inject, Injectable } from '@nestjs/common'
import { BigNumber, ethers } from 'ethers'
import { ERC20Abi__factory } from '../../types/ethers-contracts/factories/artifacts-core/contracts/test/ERC20.sol'
import { signerAddress, treasuryAddress } from '@config/arbitragePairs.json'
import { MainClient } from 'binance'
import * as Sentry from '@sentry/node'
import { applyDecimal } from '../yokai-sdk/utils'
import { getBinanceTokenEquivalentSymbol } from '../binance-bot/utils'
import { GodwokenTokenService } from '../token/godwokenToken.service'
import { JSON_RPC_PROVIDER } from '../helpers'

@Injectable()
export class BalanceFetcherService {
  constructor(
    @Inject(JSON_RPC_PROVIDER)
    private provider: ethers.providers.JsonRpcProvider,
    private readonly binanceClient: MainClient,
    private readonly tokenService: GodwokenTokenService,
  ) {}

  async getCkbBalance(): Promise<BigNumber> {
    const currentCkbToken = this.tokenService.findTokenBySymbol('CKB')

    const ckbAbi = ERC20Abi__factory.connect(
      currentCkbToken.address,
      this.provider,
    )
    const balance = await ckbAbi.balanceOf(signerAddress)

    return balance
  }

  async getGodwokenTokenBalance(tokenSymbol: string): Promise<BigNumber> {
    const token = this.tokenService.findTokenBySymbol(tokenSymbol)
    const tokenAbi = ERC20Abi__factory.connect(token.address, this.provider)
    const balance = await tokenAbi.balanceOf(treasuryAddress)

    return balance
  }

  async getBinanceTokenBalance(tokenSymbol: string): Promise<BigNumber> {
    const validTokenDecimals =
      this.tokenService.findTokenBySymbol(tokenSymbol).decimals

    const validToken = getBinanceTokenEquivalentSymbol(tokenSymbol)
    try {
      const { balances } = await this.binanceClient.getAccountInformation()
      const apiDotNumber = +balances.find(
        (balance) => balance.asset === validToken,
      ).free

      const bigNumberBalance = BigNumber.from(
        Math.floor(apiDotNumber * 10 ** 8),
      )

      const decimalDiff = validTokenDecimals - 8

      const tokenBalanceWithDecimals = applyDecimal(
        decimalDiff,
        bigNumberBalance,
      )

      return tokenBalanceWithDecimals
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  }

  async getBalanceForPoolType(
    poolType: string,
    tokenSymbol: string,
  ): Promise<BigNumber> {
    if (poolType === 'binance') {
      return this.getBinanceTokenBalance(tokenSymbol)
    } else {
      return this.getGodwokenTokenBalance(tokenSymbol)
    }
  }
}
