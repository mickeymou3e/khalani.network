import {
  BalancerError,
  BalancerErrorCode,
  BalancerSdkConfig,
  BalancerSdkSorConfig,
  PoolDataService,
  Sor,
  SubgraphPoolBase,
} from '@hadouken-project/sdk'

export class MockPoolDataService implements PoolDataService {
  constructor(private pools: SubgraphPoolBase[] = []) {}

  public async getPools(): Promise<SubgraphPoolBase[]> {
    return this.pools
  }

  public setPools(pools: SubgraphPoolBase[]): void {
    this.pools = pools
  }

  public getPool(poolId: string): SubgraphPoolBase {
    const pool = this.pools.find((pool) => pool.id == poolId)
    if (!pool) throw new BalancerError(BalancerErrorCode.POOL_DOESNT_EXIST)
    return pool
  }
}

const mockPoolBalanced: SubgraphPoolBase = {
  id: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
  address: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191',
  poolType: 'Weighted',
  swapEnabled: true,
  swapFee: '0.003',
  totalWeight: '1',
  totalShares: '138710.011389012104949255',
  tokens: [
    {
      decimals: 6,
      address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
      balance: '42154.451215',
      weight: '0.33',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      balance: '9026603.80217468',
      weight: '0.34',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      balance: '24.562593232',
      weight: '0.33',
      priceRate: '1',
    },
  ],
  tokensList: [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
  ],
  amp: undefined,
  expiryTime: undefined,
  unitSeconds: undefined,
  principalToken: undefined,
  baseToken: undefined,
  wrappedIndex: null,
  mainIndex: null,
  lowerTarget: null,
  upperTarget: null,
  sqrtAlpha: null,
  sqrtBeta: null,
  root3Alpha: null,
}
const mockPoolMoreUSDC: SubgraphPoolBase = {
  id: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
  address: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191',
  poolType: 'Weighted',
  swapEnabled: true,
  swapFee: '0.003',
  totalWeight: '1',
  totalShares: '138710.011389012104949255',
  tokens: [
    {
      decimals: 6,
      address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
      balance: '46369.896336',
      weight: '0.33',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      balance: '9026603.80217468',
      weight: '0.34',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      balance: '24.562593232',
      weight: '0.33',
      priceRate: '1',
    },
  ],
  tokensList: [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
  ],
  amp: undefined,
  expiryTime: undefined,
  unitSeconds: undefined,
  principalToken: undefined,
  baseToken: undefined,
  wrappedIndex: null,
  mainIndex: null,
  lowerTarget: null,
  upperTarget: null,
  sqrtAlpha: null,
  sqrtBeta: null,
  root3Alpha: null,
}
const mockPoolLessUSDC: SubgraphPoolBase = {
  id: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
  address: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191',
  poolType: 'Weighted',
  swapEnabled: true,
  swapFee: '0.003',
  totalWeight: '1',
  totalShares: '138710.011389012104949255',
  tokens: [
    {
      decimals: 6,
      address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
      balance: '37939.006093',
      weight: '0.33',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      balance: '9026603.80217468',
      weight: '0.34',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      balance: '24.562593232',
      weight: '0.33',
      priceRate: '1',
    },
  ],
  tokensList: [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
  ],
  amp: undefined,
  expiryTime: undefined,
  unitSeconds: undefined,
  principalToken: undefined,
  baseToken: undefined,
  wrappedIndex: null,
  mainIndex: null,
  lowerTarget: null,
  upperTarget: null,
  sqrtAlpha: null,
  sqrtBeta: null,
  root3Alpha: null,
}
const mockPoolMoreCKB: SubgraphPoolBase = {
  id: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
  address: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191',
  poolType: 'Weighted',
  swapEnabled: true,
  swapFee: '0.003',
  totalWeight: '1',
  totalShares: '138710.011389012104949255',
  tokens: [
    {
      decimals: 6,
      address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
      balance: '42154.451215',
      weight: '0.33',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      balance: '9929264.182392148',
      weight: '0.34',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      balance: '24.562593232',
      weight: '0.33',
      priceRate: '1',
    },
  ],
  tokensList: [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
  ],
  amp: undefined,
  expiryTime: undefined,
  unitSeconds: undefined,
  principalToken: undefined,
  baseToken: undefined,
  wrappedIndex: null,
  mainIndex: null,
  lowerTarget: null,
  upperTarget: null,
  sqrtAlpha: null,
  sqrtBeta: null,
  root3Alpha: null,
}
const mockPoolLessCKB: SubgraphPoolBase = {
  id: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191000100000000000000000001',
  address: '0xf1f6dad64c189ddc8368ebfd5761765aa31f4191',
  poolType: 'Weighted',
  swapEnabled: true,
  swapFee: '0.003',
  totalWeight: '1',
  totalShares: '138710.011389012104949255',
  tokens: [
    {
      decimals: 6,
      address: '0x186181e225dc1ad85a4a94164232bd261e351c33',
      balance: '42154.451215',
      weight: '0.33',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
      balance: '8123943.421957212',
      weight: '0.34',
      priceRate: '1',
    },
    {
      decimals: 18,
      address: '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
      balance: '24.562593232',
      weight: '0.33',
      priceRate: '1',
    },
  ],
  tokensList: [
    '0x186181e225dc1ad85a4a94164232bd261e351c33',
    '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
    '0x9e858a7aaedf9fdb1026ab1f77f627be2791e98a',
  ],
  amp: undefined,
  expiryTime: undefined,
  unitSeconds: undefined,
  principalToken: undefined,
  baseToken: undefined,
  wrappedIndex: null,
  mainIndex: null,
  lowerTarget: null,
  upperTarget: null,
  sqrtAlpha: null,
  sqrtBeta: null,
  root3Alpha: null,
}

export type MockPool =
  | 'balanced'
  | 'moreUSDC'
  | 'lessUSDC'
  | 'moreCKB'
  | 'lessCKB'

export const getSorMock = (pool: MockPool) => {
  let mockPool
  if (pool === 'balanced') {
    mockPool = mockPoolBalanced
  } else if (pool === 'moreUSDC') {
    mockPool = mockPoolMoreUSDC
  } else if (pool === 'lessUSDC') {
    mockPool = mockPoolLessUSDC
  } else if (pool === 'moreCKB') {
    mockPool = mockPoolMoreCKB
  } else if (pool === 'lessCKB') {
    mockPool = mockPoolLessCKB
  } else {
    throw new Error('invalid mock pool!')
  }

  const mockPoolDataService = new MockPoolDataService([mockPool])
  const mockSorConfig: BalancerSdkSorConfig = {
    tokenPriceService: 'coingecko',
    poolDataService: mockPoolDataService,
    fetchOnChainBalances: false,
  }

  const mockSdkConfig: BalancerSdkConfig = {
    network: 71402,
    rpcUrl: `https://graph-multi-http-hadouken.hadouken.finance/subgraphs/name/balancer-mainnet`,
    sor: mockSorConfig,
  }
  return new Sor(mockSdkConfig)
}
