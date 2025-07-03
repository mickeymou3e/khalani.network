import { Inject, Injectable, Logger } from '@nestjs/common'
import { ethers } from 'ethers'
import { DiscordNotifierService } from '../discord-notifier/discord-notifier.service'
import {
  ChainId,
  GetTxReceiptEvent,
  LiquidateUserEvent,
  LiquidationProcessTxReceiptEvent,
} from '../lambdaTypes'
import { SAFE_HEALTH_FACTOR_VALUE } from '../lending-math/lending-math.constants'
import { LendingMathService } from '../lending-math/lending-math.service'
import { LiquidationFetcherService } from '../liquidation-fetcher/liquidaiton-fetcher.service'
import { LiquidationDetails, UserToLiquidate } from './liquidation.types'
import { getConnect as getBackstopConnect } from '@hadouken-project/backstop'
import {
  GODWOKEN_TESTNET_CHAIN_ID,
  ZKSYNC_TESTNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
} from '../liquidation-fetcher/liquidation-fetcher.constants'
import { KMSSigner } from '@rumblefishdev/eth-signer-kms'
import { LiquidationFormatterService } from '../formatter/formatters'
import { validateInput } from './validateInput'
import { JSON_RPC_PROVIDER } from '../helpers'

@Injectable()
export class LiquidationService {
  private readonly logger = new Logger(LiquidationService.name)

  constructor(
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.JsonRpcProvider,
    private discordNotifierService: DiscordNotifierService,
    private liquidationFetcher: LiquidationFetcherService,
    private lendingMath: LendingMathService,
    private readonly signer: KMSSigner,
    private liquidationFormatterService: LiquidationFormatterService,
  ) {}

  public async validateInput(event) {
    return await validateInput(event)
  }

  public async findUserToLiquidate(
    event: ChainId,
  ): Promise<LiquidationDetails | null> {
    const { chainId } = event
    const users = await this.liquidationFetcher.fetchUsers()
    const reserves = await this.liquidationFetcher.fetchReserves()
    const prices = await this.liquidationFetcher.fetchPrices(reserves, chainId)

    const usersToLiquidate: UserToLiquidate[] = []

    users.forEach((user) => {
      user = this.lendingMath.fixUserCollateral(user, reserves)
      const { borrowedTokens, collateralTokens, healthFactor } =
        this.lendingMath.getHealthFactor(user, reserves, prices)

      const largestDebtTokenWithBalance = borrowedTokens.reduce(
        (prev, current) =>
          prev.totalDebtInDollars.gt(current.totalDebtInDollars)
            ? prev
            : current,
        borrowedTokens[0],
      )

      const largestCollateralTokenWithBalance = collateralTokens.reduce(
        (prev, current) =>
          prev.totalCollateralInDollars.gt(current.totalCollateralInDollars)
            ? prev
            : current,
        collateralTokens[0],
      )

      if (
        healthFactor.gte(SAFE_HEALTH_FACTOR_VALUE) ||
        !largestCollateralTokenWithBalance
      )
        return

      const maxCollateral = this.lendingMath.calculateMaxCollateralToLiquidate(
        largestDebtTokenWithBalance,
        largestCollateralTokenWithBalance,
        prices,
      )

      usersToLiquidate.push({
        id: user.id,
        debtToken: largestDebtTokenWithBalance,
        collateralToken: largestCollateralTokenWithBalance,
        maxCollateral: maxCollateral,
      })
    })

    const liquidatableUsers = await this.filterUsersToLiquidate(
      usersToLiquidate,
      chainId,
    )

    const sortedUsersByMaxAmountCollateral = liquidatableUsers.sort(
      (user1, user2) =>
        user1.maxCollateral.maxAmountCollateralToLiquidateInDollars.gt(
          user2.maxCollateral.maxAmountCollateralToLiquidateInDollars,
        )
          ? -1
          : 1,
    )

    const firstUserToLiquidate = sortedUsersByMaxAmountCollateral[0]

    if (!firstUserToLiquidate) return null

    const debtToCover = firstUserToLiquidate.debtToken.totalDebt.div(2)

    return {
      userAddress: firstUserToLiquidate.id,
      amount: debtToCover.toString(),
      collateralToken: firstUserToLiquidate.collateralToken.address,
      debtToken: firstUserToLiquidate.debtToken.address,
    }
  }

  private async filterUsersToLiquidate(
    usersToLiquidate: UserToLiquidate[],
    chainId: string,
  ): Promise<UserToLiquidate[]> {
    const filteredUsers: UserToLiquidate[] = []

    const lendingEnv =
      chainId === GODWOKEN_TESTNET_CHAIN_ID ||
      chainId === ZKSYNC_TESTNET_CHAIN_ID ||
      chainId === MANTLE_TESTNET_CHAIN_ID
        ? 'testnet'
        : 'mainnet'

    const contracts = getBackstopConnect(chainId)(
      this.signer,
      lendingEnv,
      chainId,
    )
    const backstopContract = contracts?.backstop

    if (!backstopContract)
      throw new Error('Cannot find Backstop or Liquidation contract')

    async function canUserBeLiquidated(
      user: UserToLiquidate,
    ): Promise<boolean> {
      const result = await backstopContract.callStatic.canLiquidate(
        user.debtToken.address,
        user.collateralToken.address,
        user.id,
        user.debtToken.totalDebt.div(2),
      )
      return result
    }

    await Promise.all(
      usersToLiquidate.map(async (user) => {
        if (await canUserBeLiquidated(user)) {
          filteredUsers.push(user)
        }
      }),
    )

    return filteredUsers
  }

  public async liquidateUser(event: LiquidateUserEvent) {
    const { amount, collateralToken, debtToken, userAddress, chainId } = event

    const lendingEnv =
      chainId === GODWOKEN_TESTNET_CHAIN_ID ||
      chainId === ZKSYNC_TESTNET_CHAIN_ID ||
      chainId === MANTLE_TESTNET_CHAIN_ID
        ? 'testnet'
        : 'mainnet'

    const contracts = getBackstopConnect(chainId)(
      this.signer,
      lendingEnv,
      chainId,
    )

    const backstopContract = contracts?.backstop

    if (!backstopContract)
      throw new Error('Cannot find Backstop or Liquidation contract')

    try {
      const transaction = await backstopContract?.liquidate(
        debtToken,
        collateralToken,
        userAddress,
        amount,
        { gasLimit: 7 * 10 ** 6 }, //* TODO: make it as param, or estimate gas before tx
      )

      await transaction?.wait()

      return {
        txHash: transaction.hash,
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  public async getTransactionReceipt(event: GetTxReceiptEvent) {
    const receipt = await this.provider.getTransactionReceipt(event.txHash)

    return receipt
  }

  public async liquidationProcessTxReceipt(
    event: LiquidationProcessTxReceiptEvent,
  ) {
    const message = this.liquidationFormatterService.getFormattedText(event)

    await this.discordNotifierService.sendNotification(message)
  }
}
