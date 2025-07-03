import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { BigNumber, ethers } from 'ethers'
import { GraphQLClient } from 'graphql-request'
import { reservesQuery, usersQuery } from './liquidation-fetcher.queries'
import {
  UsersResponseQuery,
  User,
  ReservesResponseQuery,
  Reserve,
  Price,
  ATokenAsset,
  VariableDebtTokenAsset,
  StableDebtTokenAsset,
} from './liquidation-fetcher.types'
import {
  GODWOKEN_TESTNET_CHAIN_ID,
  MANTLE_TESTNET_CHAIN_ID,
  ZERO,
  ZKSYNC_TESTNET_CHAIN_ID,
} from './liquidation-fetcher.constants'
import { getConnect, Environments } from '@hadouken-project/lending-contracts'
import { JSON_RPC_PROVIDER } from '../helpers'

@Injectable()
export class LiquidationFetcherService {
  private readonly logger = new Logger(LiquidationFetcherService.name)

  constructor(
    @InjectGraphQLClient() private readonly graphQL: GraphQLClient,
    @Inject(JSON_RPC_PROVIDER)
    private readonly provider: ethers.providers.JsonRpcProvider,
  ) {}
  public async fetchUsers(): Promise<User[]> {
    try {
      const { data } = await this.graphQL.rawRequest<UsersResponseQuery>(
        usersQuery,
      )

      const users = data.users.map(
        ({ id, aTokenAssets, variableBorrowAssets, stableBorrowAssets }) => {
          const userATokenAssets: ATokenAsset[] = aTokenAssets.map(
            ({ address, underlyingAsset, scaledBalance, isCollateral }) => ({
              address,
              underlyingAsset,
              scaledBalance: BigNumber.from(scaledBalance),
              isCollateral,
            }),
          )

          const userVariableDebtTokenAssets: VariableDebtTokenAsset[] =
            variableBorrowAssets.map(
              ({ address, underlyingAsset, scaledVariableDebt }) => ({
                address,
                underlyingAsset,
                scaledVariableDebt: BigNumber.from(scaledVariableDebt),
              }),
            )

          const userStableDebtTokenAssets: StableDebtTokenAsset[] =
            stableBorrowAssets.map(
              ({ address, underlyingAsset, principalStableDebt }) => ({
                address,
                underlyingAsset,
                principalStableDebt: BigNumber.from(principalStableDebt),
              }),
            )

          const user: User = {
            id,
            aTokenAssets: userATokenAssets,
            variableBorrowAssets: userVariableDebtTokenAssets,
            stableBorrowAssets: userStableDebtTokenAssets,
          }

          return user
        },
      )

      return users
    } catch {
      this.logger.error('Cannot fetch users')

      return []
    }
  }
  public async fetchReserves(): Promise<Reserve[]> {
    try {
      const { data } = await this.graphQL.rawRequest<ReservesResponseQuery>(
        reservesQuery,
      )

      const reserves: Reserve[] = data.reserves
        .filter((reserve) => reserve.isActive)
        .map(
          ({
            address,
            symbol,
            decimals,
            variableBorrowIndex,
            variableBorrowRate,
            stableBorrowRate,
            liquidityIndex,
            liquidityRate,
            liquidityThreshold,
            aTokenAddress,
            variableDebtTokenAddress,
            stableDebtTokenAddress,
            lastUpdateTimestamp,
            ltv,
            liquidityBonus,
          }) => ({
            symbol: symbol.split('.')[0],
            address,
            decimals: Number(decimals),
            variableBorrowIndex: BigNumber.from(variableBorrowIndex || ZERO),
            variableBorrowRate: BigNumber.from(variableBorrowRate || ZERO),
            stableBorrowRate: BigNumber.from(stableBorrowRate || ZERO),
            liquidityIndex: BigNumber.from(liquidityIndex || ZERO),
            liquidityRate: BigNumber.from(liquidityRate || ZERO),
            liquidityThreshold: BigNumber.from(liquidityThreshold || ZERO),
            aTokenAddress,
            variableDebtTokenAddress,
            stableDebtTokenAddress,
            liquidityBonus: BigNumber.from(liquidityBonus || ZERO),
            ltv: BigNumber.from(ltv),
            lastUpdateTimestamp: BigNumber.from(
              lastUpdateTimestamp ?? BigNumber.from(Date.now()).div(1000),
            ),
          }),
        )

      return reserves
    } catch {
      this.logger.error('Cannot fetch reserves')
    }
  }

  public async fetchPrices(reserves: Reserve[], chainId: string) {
    const lendingContractsEnv = this._getLendingEnvironment(chainId)
    const getContracts = getConnect(chainId)
    const { hadoukenOracle } = getContracts(this.provider, lendingContractsEnv)
    const reserveAddresses = reserves.map((reserve) => reserve.address)
    const reserveSymbols = reserves.map((reserve) => reserve.symbol)
    const pricesResponse = await hadoukenOracle?.getAssetsPrices(
      reserveAddresses,
    )

    if (!pricesResponse) return []

    const prices: Price[] = pricesResponse.map((price, index) => {
      return {
        symbol: reserveSymbols[index],
        rate: price,
      }
    })

    return prices
  }

  private _getLendingEnvironment(chainId: string) {
    const lendingContractsEnv: Environments =
      chainId === GODWOKEN_TESTNET_CHAIN_ID ||
      chainId === ZKSYNC_TESTNET_CHAIN_ID ||
      chainId === MANTLE_TESTNET_CHAIN_ID
        ? 'testnet'
        : 'mainnet'

    return lendingContractsEnv
  }
}
