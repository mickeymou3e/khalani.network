import { Inject, Injectable, flatten } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { toBigInt } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import {
  depositedHDKQuery,
  lockdropPricesQuery,
  lockdropsQuery,
  tokenBalancesQuery,
} from './graphql/query';
import {
  DepositHDKResponseQuery,
  DepositedHDK,
  Lockdrop,
  LockdropsResponseQuery,
  TokenBalanceResponseQuery,
  TokenPricesResponseQuery,
} from './graphql/types';
import {
  GodwokenGraphqlInjection,
  MantleGraphqlInjection,
  ZkSyncGraphqlInjection,
} from './modules/graphql';
import { ChainMapping, LockDropInfo, TokenBalances, TokenPrices } from './type';

@Injectable()
export class AppService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(GodwokenGraphqlInjection)
    private readonly godwokenGraphql: GraphQLClient,
    @Inject(ZkSyncGraphqlInjection)
    private readonly zksyncGraphql: GraphQLClient,
    @Inject(MantleGraphqlInjection)
    private readonly mantleGraphql: GraphQLClient,
  ) {}

  public async getLockDropInfo(
    chainId?: string,
    user?: string,
  ): Promise<LockDropInfo> {
    const totalHdkTokens = this.getTotalHDK();
    const allTokens = await this.getLockDropTokens();
    const allClients = await this.getClients();

    const [allLockdrops, allPrices] = await Promise.all([
      this.fetchLocks(allClients),
      this.fetchPrices(allClients, allTokens),
    ]);

    const tvl = await this.getLockdropsTotalValue(
      allLockdrops,
      allPrices,
      true,
    );

    const requestTokens = await this.getLockDropTokens(chainId);

    const lockdrops = allLockdrops
      .filter((lockdrop) =>
        user ? lockdrop.owner.toLowerCase() === user.toLowerCase() : true,
      )
      .filter((lockdrop) =>
        requestTokens
          .map((token) => token.toLowerCase())
          .includes(lockdrop.tokenAddress.toLowerCase()),
      );

    const lockdropsList = lockdrops.map((lockdrop) => {
      const price = allPrices[lockdrop.tokenAddress] ?? 0;

      const userAmount =
        (BigInt(lockdrop.weight) * BigInt(price)) / BigInt(1 * 10 ** 18);

      const lockInUSD =
        (BigInt(lockdrop.amount) * BigInt(price)) / BigInt(1 * 10 ** 18);

      const reward = (totalHdkTokens * userAmount) / tvl;

      return {
        ...lockdrop,
        lockInUSD: lockInUSD.toString(),
        reward: reward.toString(),
      };
    });

    const totalUserValueLocked = lockdropsList.reduce(
      (totalUserValue, lock) => {
        const price = allPrices[lock.tokenAddress] ?? 0;

        totalUserValue +=
          (BigInt(lock.amount) * BigInt(price)) / BigInt(1 * 10 ** 18);

        return totalUserValue;
      },
      BigInt(0),
    );

    const totalUserHdkToClaim = lockdropsList.reduce(
      (totalHdkToClaim, lock) => {
        totalHdkToClaim += BigInt(lock.reward);

        return totalHdkToClaim;
      },
      BigInt(0),
    );

    return {
      list: lockdropsList,
      totalHdkTokens: totalHdkTokens.toString(),
      totalUserHdkToClaim: totalUserHdkToClaim.toString(),
      totalUserValueLocked: totalUserValueLocked.toString(),
    };
  }

  public async getTotalValueLocked(
    chainId?: string,
  ): Promise<{ tvl: bigint; tvlWithWeight: bigint }> {
    const allTokens = await this.getLockDropTokens();
    const allClients = await this.getClients();

    const [allLockdrops, allPrices] = await Promise.all([
      this.fetchLocks(allClients),
      this.fetchPrices(allClients, allTokens),
    ]);

    const requestTokens = await this.getLockDropTokens(chainId);

    const lockdrops = allLockdrops.filter((lockdrop) =>
      requestTokens
        .map((token) => token.toLowerCase())
        .includes(lockdrop.tokenAddress.toLowerCase()),
    );

    const tvl = await this.getLockdropsTotalValue(lockdrops, allPrices, false);
    const tvlWithWeight = await this.getLockdropsTotalValue(
      lockdrops,
      allPrices,
      true,
    );

    return {
      tvl,
      tvlWithWeight,
    };
  }

  public async getParticipation(chainId?: string): Promise<bigint> {
    const clients = await this.getClients(chainId);

    const [totalDeposit, lockDropInfo] = await Promise.all([
      this.getTotalDepositedHDK(clients),
      this.getLockDropInfo(chainId),
    ]);

    const totalHdkDistributed = BigInt(lockDropInfo.totalUserHdkToClaim);

    return (
      (totalDeposit * BigInt(1 * 10 ** 18)) /
      (totalHdkDistributed * BigInt(1 * 10 ** 16))
    );
  }

  public async getPrices(): Promise<TokenPrices> {
    const allTokens = await this.getLockDropTokens();
    const allClients = await this.getClients();

    return await this.fetchPrices(allClients, allTokens);
  }

  private getTotalHDK(): bigint {
    const hdkTokens = this.configService.get<string>('totalHDK');

    return BigInt(BigInt(hdkTokens) * BigInt(1 * 10 ** 18));
  }

  private async getLockdropsTotalValue(
    lockdrops: Lockdrop[],
    prices: TokenPrices,
    withWeight?: boolean,
  ): Promise<bigint> {
    const balances = await this.calculateLockdropsTotalValue(
      lockdrops,
      withWeight,
    );

    const tokens = Object.keys(balances);

    const totalValue = tokens.reduce((totalValue, token) => {
      const tokenValue =
        (BigInt(balances[token]) * BigInt(prices[token])) /
        BigInt(1 * 10 ** 18);

      totalValue += tokenValue;
      return totalValue;
    }, toBigInt(0));

    return totalValue;
  }

  private async calculateLockdropsTotalValue(
    lockdrops: Lockdrop[],
    withWeight?: boolean,
  ): Promise<TokenBalances> {
    return lockdrops.reduce((balances, lockdrop) => {
      balances[lockdrop.tokenAddress]
        ? (balances[lockdrop.tokenAddress] += BigInt(
            withWeight ? lockdrop.weight : lockdrop.amount,
          ))
        : (balances[lockdrop.tokenAddress] = BigInt(
            withWeight ? lockdrop.weight : lockdrop.amount,
          ));

      return balances;
    }, {} as TokenBalances);
  }

  private async getTotalDepositedHDK(clients: GraphQLClient[]): Promise<any> {
    const response = await this.fetchDepositedHDK(clients);

    return response.reduce((total, deposit) => {
      total += BigInt(deposit.amount);
      return total;
    }, BigInt(0));
  }

  private async getGraphFromChainId(chainId: string): Promise<GraphQLClient> {
    const chainMapping = this.configService.get<ChainMapping>('chainMapping');
    const chainName = chainMapping[chainId];

    if (chainName === 'godwoken') {
      return this.godwokenGraphql;
    } else if (chainName === 'zksync') {
      return this.zksyncGraphql;
    } else if (chainName === 'mantle') {
      return this.mantleGraphql;
    }

    throw Error('Invalid chainId for getGraphFromChainId');
  }

  private async getLockDropTokens(chainId?: string): Promise<string[]> {
    const environment = this.configService.get<string>('environment');

    if (chainId) {
      const chainMapping = this.configService.get<ChainMapping>('chainMapping');
      const chainName = chainMapping[chainId];

      return this.configService
        .get<string[]>(`chains.${environment}.${chainName}.lockTokens`)
        .map((token) => token.toLowerCase());
    } else {
      return this.configService
        .get<string[]>(`chains.${environment}.lockTokens`)
        .map((token) => token.toLowerCase());
    }
  }

  private async fetchLockdrops(
    graphClient: GraphQLClient,
    user?: string,
  ): Promise<Lockdrop[]> {
    let hasNextPage = true;
    let lockdrops: Lockdrop[] = [];
    let skip = 0;

    while (hasNextPage) {
      const response = await graphClient.rawRequest<LockdropsResponseQuery>(
        lockdropsQuery,
        {
          where: {
            ...(user ? { owner: user.toLowerCase() } : {}),
          },
          first: 1000,
          skip,
        },
      );
      lockdrops = lockdrops.concat(response.data.lockdrops);
      hasNextPage = response.data.lockdrops.length === 1000;
      skip += 1000;
    }

    return lockdrops;
  }

  private async fetchDepositHDK(
    graphClient: GraphQLClient,
    user?: string,
  ): Promise<DepositedHDK[]> {
    let hasNextPage = true;
    let deposits: DepositedHDK[] = [];
    let skip = 0;

    while (hasNextPage) {
      const response = await graphClient.rawRequest<DepositHDKResponseQuery>(
        depositedHDKQuery,
        {
          where: {
            ...(user ? { user: user.toLowerCase() } : {}),
          },
          first: 1000,
          skip,
        },
      );
      deposits = deposits.concat(response.data.depositedHDKs);
      hasNextPage = response.data.depositedHDKs.length === 1000;
      skip += 1000;
    }

    return deposits;
  }

  private async fetchTokenPrices(
    client: GraphQLClient,
    tokenAddresses: string[],
  ): Promise<TokenPrices> {
    const pricesResponse =
      await client.rawRequest<TokenPricesResponseQuery>(lockdropPricesQuery);

    const isPhaseOne = pricesResponse.data.lockdropTokens.every(
      (x) => BigInt(x.price) === BigInt(0),
    );

    if (isPhaseOne) {
      const response = await client.rawRequest<TokenBalanceResponseQuery>(
        tokenBalancesQuery,
        {
          where: {
            address_in: tokenAddresses,
          },
        },
      );
      return response.data.tokens.reduce((prices, token) => {
        prices[token.address] = BigInt(BigInt(token.latestUSDPrice * 10 ** 18));

        return prices;
      }, {} as TokenPrices);
    }

    return pricesResponse.data.lockdropTokens.reduce((prices, token) => {
      prices[token.id] = BigInt(token.price);
      return prices;
    }, {} as TokenPrices);
  }

  private async fetchLocks(
    clients: GraphQLClient[],
    user?: string,
  ): Promise<Lockdrop[]> {
    return flatten(
      await Promise.all(
        clients.map((client) => this.fetchLockdrops(client, user)),
      ),
    );
  }

  private async fetchDepositedHDK(
    clients: GraphQLClient[],
    user?: string,
  ): Promise<DepositedHDK[]> {
    return flatten(
      await Promise.all(
        clients.map((client) => this.fetchDepositHDK(client, user)),
      ),
    );
  }

  private async fetchPrices(
    clients: GraphQLClient[],
    tokens: string[],
  ): Promise<TokenPrices> {
    return (
      await Promise.all(
        clients.map((client) => this.fetchTokenPrices(client, tokens)),
      )
    ).reduce((prices, token) => {
      Object.keys(token).forEach((key) => {
        prices[key] = token[key];
      });

      return prices;
    }, {} as TokenPrices);
  }

  private async getClients(chainId?: string): Promise<GraphQLClient[]> {
    const clients: GraphQLClient[] = [];
    if (!chainId) {
      clients.push(
        ...[this.godwokenGraphql, this.mantleGraphql, this.zksyncGraphql],
      );
    } else {
      clients.push(await this.getGraphFromChainId(chainId));
    }

    return clients;
  }
}
