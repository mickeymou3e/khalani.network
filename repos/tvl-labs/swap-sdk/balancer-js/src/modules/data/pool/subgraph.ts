import { Findable, Searchable } from '../types';
import {
  createSubgraphClient,
  SubgraphClient,
  SubgraphPool,
  Pool_OrderBy,
  OrderDirection,
  SubgraphPoolTokenFragment,
} from '@/modules/subgraph/subgraph';
import {
  GraphQLArgsBuilder,
  SubgraphArgsFormatter,
} from '@/lib/graphql/args-builder';
import { GraphQLArgs } from '@/lib/graphql/types';
import { PoolAttribute, PoolsRepositoryFetchOptions } from './types';
import { GraphQLQuery, Pool, PoolType, PoolToken } from '@/types';
import { Network } from '@/lib/constants/network';
import { PoolsQueryVariables } from '../../subgraph/subgraph';
import { logger } from '@/logger';

interface PoolsSubgraphRepositoryOptions {
  url: string;
  chainId: Network;
  blockHeight?: () => Promise<number | undefined>;
  query?: GraphQLQuery;
}

/**
 * Access pools using generated subgraph client.
 *
 * Balancer's subgraph URL: https://thegraph.com/hosted-service/subgraph/balancer-labs/balancer-v2
 */
export class PoolsSubgraphRepository
  implements Findable<Pool, PoolAttribute>, Searchable<Pool>
{
  private client: SubgraphClient;
  private chainId: Network;
  private pools?: Promise<Pool[]>;
  public skip = 0;
  private blockHeight: undefined | (() => Promise<number | undefined>);
  private query: GraphQLQuery;

  /**
   * Repository with optional lazy loaded blockHeight
   *
   * @param url subgraph URL
   * @param chainId current network, needed for L2s logic
   * @param blockHeight lazy loading blockHeigh resolver
   */
  constructor(options: PoolsSubgraphRepositoryOptions) {
    this.client = createSubgraphClient(options.url);
    this.blockHeight = options.blockHeight;
    this.chainId = options.chainId;

    const defaultArgs: GraphQLArgs = {
      orderBy: Pool_OrderBy.TotalLiquidity,
      orderDirection: OrderDirection.Desc,
      where: {
        swapEnabled: {
          eq: true,
        },
        totalShares: {
          gt: 0,
        },
      },
    };

    const args = options.query?.args || defaultArgs;
    const attrs = options.query?.attrs || {};

    this.query = {
      args,
      attrs,
    };
  }

  /**
   * We need a list of all the pools, for calculating APRs (nested pools), and for SOR (path finding).
   * All the pools are fetched on page load and cachced for speedy lookups.
   *
   * @returns Promise resolving to pools list
   */
  private async fetchDefault(): Promise<Pool[]> {
    logger.profile('fetching pools', { level: 'debug' });
    const { pool0, pool1000, pool2000 } = await this.client.AllPools({
      where: { swapEnabled: true, totalShares_gt: '0' },
      orderBy: Pool_OrderBy.TotalLiquidity,
      orderDirection: OrderDirection.Desc,
      block: this.blockHeight
        ? { number: await this.blockHeight() }
        : undefined,
    });
    logger.profile('fetching pools', { level: 'debug' });

    return [...pool0, ...pool1000, ...pool2000].map(this.mapType.bind(this));
  }

  async fetch(options?: PoolsRepositoryFetchOptions): Promise<Pool[]> {
    if (options?.skip) {
      this.query.args.skip = options.skip;
    }
    if (this.blockHeight) {
      this.query.args.block = { number: await this.blockHeight() };
    }

    this.query.args.first = options?.first || 1000;

    const formattedQuery = new GraphQLArgsBuilder(this.query.args).format(
      new SubgraphArgsFormatter()
    ) as PoolsQueryVariables;

    const { pools } = await this.client.Pools(formattedQuery);

    this.skip = (options?.skip || 0) + pools.length;

    return pools.map(this.mapType.bind(this));
  }

  async find(id: string): Promise<Pool | undefined> {
    return await this.findBy('id', id);
  }

  async findBy(param: PoolAttribute, value: string): Promise<Pool | undefined> {
    if (!this.pools) {
      this.pools = this.fetchDefault();
    }

    return (await this.pools).find((pool) => pool[param] == value);
  }

  async all(): Promise<Pool[]> {
    if (!this.pools) {
      this.pools = this.fetchDefault();
    }
    return this.pools;
  }

  async where(filter: (pool: Pool) => boolean): Promise<Pool[]> {
    if (!this.pools) {
      this.pools = this.fetchDefault();
    }

    return (await this.pools).filter(filter);
  }

  private mapType(subgraphPool: SubgraphPool): Pool {
    return {
      id: subgraphPool.id,
      name: subgraphPool.name || '',
      address: subgraphPool.address,
      chainId: this.chainId,
      poolType: subgraphPool.poolType as PoolType,
      swapFee: subgraphPool.swapFee,
      swapEnabled: subgraphPool.swapEnabled,
      amp: subgraphPool.amp ?? undefined,
      owner: subgraphPool.owner ?? undefined,
      factory: subgraphPool.factory ?? undefined,
      tokens: (subgraphPool.tokens || []).map(this.mapToken),
      tokensList: subgraphPool.tokensList,
      tokenAddresses: (subgraphPool.tokens || []).map((t) => t.address),
      totalLiquidity: subgraphPool.totalLiquidity,
      totalShares: subgraphPool.totalShares,
      totalSwapFee: subgraphPool.totalSwapFee,
      totalSwapVolume: subgraphPool.totalSwapVolume,
      // onchain: subgraphPool.onchain,
      createTime: subgraphPool.createTime,
      mainIndex: subgraphPool.mainIndex ?? undefined,
      wrappedIndex: subgraphPool.wrappedIndex ?? undefined,
      // mainTokens: subgraphPool.mainTokens,
      // wrappedTokens: subgraphPool.wrappedTokens,
      // unwrappedTokens: subgraphPool.unwrappedTokens,
      // isNew: subgraphPool.isNew,
      // volumeSnapshot: subgraphPool.volumeSnapshot,
      // feesSnapshot: subgraphPool.???, // Approximated last 24h fees
      // boost: subgraphPool.boost,
      totalWeight: subgraphPool.totalWeight || '1',
    };
  }

  private mapToken(subgraphToken: SubgraphPoolTokenFragment): PoolToken {
    let subgraphTokenPool = null;
    if (subgraphToken.token?.pool) {
      subgraphTokenPool = {
        ...subgraphToken.token.pool,
        poolType: subgraphToken.token.pool.poolType as PoolType,
      };
    }
    return {
      ...subgraphToken,
      token: {
        pool: subgraphTokenPool,
      },
    };
  }
}
