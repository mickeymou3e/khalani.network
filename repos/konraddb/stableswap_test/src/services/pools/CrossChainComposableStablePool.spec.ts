import { generateTestingUtils } from 'eth-testing'
import { ethers, BigNumber, constants, Contract } from 'ethers'
import { SwapV2 } from 'src/services/trade/types'

import config from '@config'
import { Network } from '@constants/Networks'
import { connectVault } from '@hadouken-project/swap-contracts-v2'
import { IPool, PoolType } from '@interfaces/pool'
import { lockService } from '@libs/services/lock.service'
import { CROSS_CHAIN_ROUTER_ABI } from '@services/pools/CrossChainRouterArtifact'
import {
  ITokenModelBalanceWithChain,
  ITokenWithChainId,
} from '@store/khala/tokens/tokens.types'
import { BigDecimal } from '@utils/math'

import InvestService from '../invest/invest.service'
import TradeService from '../trade/trade.service'
import { CrossChainComposableStablePoolServiceProvider } from './CrossChainComposableStablePool'

const EXAMPLE_EOA_ACCOUNT = '0xE8fb7Ec07375e889824eC0fdD336e358122087Ea'
const USDC_ETH_PAN_POOL_ADDRESS = '0x15DE62d289Ac42C1e6062C0359d3F58473287Ee0'
const CROSS_CHAIN_ROUTER_ADDRESS = constants.AddressZero

const USDC_ETH_POOL = {
  id: USDC_ETH_PAN_POOL_ADDRESS,
  address: USDC_ETH_PAN_POOL_ADDRESS,
  poolType: PoolType.ComposableStable,
  name: 'USDC.eth/PAN',
  symbol: 'USDC.eth/PAN',
  decimals: 18,
  tokens: [],
  amp: '',
  swapFee: BigDecimal.from(1),
  totalLiquidity: BigDecimal.from(1),
  totalShares: BigDecimal.from(1),
  totalSwapFee: BigDecimal.from(1),
  totalSwapVolume: BigDecimal.from(1),
} as IPool

describe.skip('CrossChainComposableStablePoolService service', () => {
  let USDC_ETH_ON_AXON: ITokenWithChainId
  let USDC_AVAX_ON_AXON: ITokenWithChainId
  let USDC_ETH_ON_GOERLI: ITokenWithChainId
  let USDC_AVAX_ON_AVALANCHE: ITokenWithChainId

  function createServiceInstance(pool: IPool) {
    const poolHelpers = null as any
    const testingUtils = generateTestingUtils()

    const provider = new ethers.providers.Web3Provider(
      testingUtils.getProvider(),
    )
    const signer = provider.getSigner()
    const vault = connectVault(config.contracts.Vault, signer)
    const router = new Contract(
      CROSS_CHAIN_ROUTER_ADDRESS,
      CROSS_CHAIN_ROUTER_ABI,
    ).connect(signer)

    const investService = new InvestService(vault, poolHelpers)
    const tradeService = new TradeService(vault)

    const composableStablePoolServiceProvider = new CrossChainComposableStablePoolServiceProvider(
      investService,
      tradeService,
      router,
    )

    const service = composableStablePoolServiceProvider.provide(pool)
    if (!service) {
      throw new Error()
    }

    return { service, testingUtils }
  }

  beforeAll(async () => {
    let mockedTokens: ITokenModelBalanceWithChain[]
    try {
      mockedTokens = await lockService.getTokens()
    } catch (error) {
      throw new Error(
        `Seems mocks are configured incorrectly or not running in tests. Can't find USDCeth on Axon.`,
      )
    }

    const usdcEthOnAxon = mockedTokens.find(
      (i) => i.chainId === Network.Axon && i.symbol === 'USDCeth',
    )

    if (usdcEthOnAxon) {
      USDC_ETH_ON_AXON = usdcEthOnAxon
      USDC_ETH_POOL.tokens.push({
        ...USDC_ETH_ON_AXON,
        balance: BigDecimal.from(0),
      })
    }

    const usdcAvaxOnAxon = mockedTokens.find(
      (i) => i.chainId === Network.Axon && i.symbol === 'USDCavax',
    )
    if (usdcAvaxOnAxon) {
      USDC_AVAX_ON_AXON = usdcAvaxOnAxon
    }

    const usdcEthOnGoerli = mockedTokens.find(
      (i) => i.chainId === Network.Goerli && i.symbol === 'USDC.eth',
    )
    if (usdcEthOnGoerli) {
      USDC_ETH_ON_GOERLI = usdcEthOnGoerli
    }

    const usdcAvaxOnAvalanche = mockedTokens.find(
      (i) => i.chainId === Network.AvalancheTestnet && i.symbol === 'USDC.avax',
    )
    if (usdcAvaxOnAvalanche) {
      USDC_AVAX_ON_AVALANCHE = usdcAvaxOnAvalanche
    }
  })

  it('correctly calculates cross-chain add single-sided USDC liquidity into Balancer pool call data', async () => {
    const { service } = createServiceInstance(USDC_ETH_POOL)

    ;(service as any).queryJoinSwap = () => ({
      assets: [USDC_ETH_PAN_POOL_ADDRESS] as string[],
      amountsOut: [BigNumber.from(777777777)],
      swaps: [] as SwapV2[],
    })

    expect(
      await service.encodeCrossChainJoinABI({
        account: EXAMPLE_EOA_ACCOUNT,
        amountsIn: [BigNumber.from(22)],
        tokensIn: [USDC_ETH_ON_AXON],
        pool: USDC_ETH_POOL,
      }),
    ).toBe(
      '0x156d5dac000000000000000000000000a889d68e5522bab2c48debaf7d8466a7accccc930000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000015de62d289ac42c1e6062c0359d3f58473287ee000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001c4945bcec9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000140000000000000000000000000e8fb7ec07375e889824ec0fdd336e358122087ea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e8fb7ec07375e889824ec0fdd336e358122087ea00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000015de62d289ac42c1e6062c0359d3f58473287ee00000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffd3f5734800000000000000000000000000000000000000000000000000000000',
    )
  })

  it('is calculating join ABI correctly', async () => {
    const { service } = createServiceInstance(USDC_ETH_POOL)

    ;(service as any).queryJoinSwap = () => ({
      assets: [USDC_ETH_PAN_POOL_ADDRESS] as string[],
      amountsOut: [BigNumber.from(777777777)],
      swaps: [] as SwapV2[],
    })

    const joinABI = await service.encodeJoinABI({
      account: EXAMPLE_EOA_ACCOUNT,
      amountsIn: [BigNumber.from(22)],
      tokensIn: [USDC_ETH_ON_AXON],
      pool: USDC_ETH_POOL,
    })

    expect(joinABI).toBe(
      '0x945bcec9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000140000000000000000000000000e8fb7ec07375e889824ec0fdd336e358122087ea0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e8fb7ec07375e889824ec0fdd336e358122087ea00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000015de62d289ac42c1e6062c0359d3f58473287ee00000000000000000000000000000000000000000000000000000000000000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffffd3f57348',
    )
  })

  it('can send cross chain join transaction', async () => {
    const { service, testingUtils } = createServiceInstance(USDC_ETH_POOL)
    testingUtils.mockConnectedWallet([EXAMPLE_EOA_ACCOUNT])
    const contractTestingUtils = testingUtils.generateContractUtils(
      CROSS_CHAIN_ROUTER_ABI as any,
    )
    contractTestingUtils.mockTransaction('depositTokenAndCall')
    ;(service as any).queryJoinSwap = () => ({
      assets: [USDC_ETH_PAN_POOL_ADDRESS] as string[],
      amountsOut: [BigNumber.from(777777777)],
      swaps: [] as SwapV2[],
    })

    const tx = await service.crossChainJoin({
      account: EXAMPLE_EOA_ACCOUNT,
      amountsIn: [BigNumber.from(22)],
      tokensIn: [USDC_ETH_ON_AXON],
      pool: USDC_ETH_POOL,
    })

    expect(tx.from).toBe(EXAMPLE_EOA_ACCOUNT)
  })

  describe('originChainToBalancerChainTokens', () => {
    it('correctly finding USDCeth on Axon when USDCeth from Goerli is passed', async () => {
      const { service } = createServiceInstance(USDC_ETH_POOL)

      const result = await service.originChainToBalancerChainTokens([
        USDC_ETH_ON_GOERLI,
      ])
      expect(result.length).toBe(1)
      expect(result[0].symbol).toBe(USDC_ETH_ON_AXON.symbol)
      expect(result[0].address).toBe(USDC_ETH_ON_AXON.address)
    })

    it('correctly finding USDCavax on Axon when USDCavax from Avalanche is passed', async () => {
      const { service } = createServiceInstance(USDC_ETH_POOL)

      const result = await service.originChainToBalancerChainTokens([
        USDC_AVAX_ON_AVALANCHE,
      ])
      expect(result.length).toBe(1)
      expect(result[0].symbol).toBe(USDC_AVAX_ON_AXON.symbol)
      expect(result[0].address).toBe(USDC_AVAX_ON_AXON.address)
    })
  })

  test.todo('can add double-sided liquidity into Balancer pool')
  test.todo('can withdraw single token from Balancer pool')
  test.todo('can withdraw multiple tokens at once from Balancer pool')
})
