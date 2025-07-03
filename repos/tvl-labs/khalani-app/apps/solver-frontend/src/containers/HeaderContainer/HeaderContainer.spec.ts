import { renderHookWithProviders } from '@tests/containers'
import {
  balancesSelectors,
  BigDecimal,
  nativeBalancesSelectors,
  Network,
  pricesSelector,
} from '@tvl-labs/sdk'

import { Routes } from './HeaderContainer.constants'
import { useTokenBalancesAcrossChains } from './HeaderContainer.hooks'

describe('HeaderContainer component', () => {
  it('correctly finding header item id by path name', async () => {
    const headerItems = Routes
    const expectedData = [{ path: '/liquidity', id: 'Liquidity' }]

    expectedData.map((expected) => {
      let currentId
      headerItems.map((route) => {
        const foundId = route.pages.find(
          (page) =>
            page.href.includes(expected.path) ||
            page.internalHrefs?.includes(expected.path),
        )?.id
        if (foundId) {
          currentId = foundId
        }
      })
      expect(currentId).toBe(expected.id)
    })
  })
})

describe('useTokenBalancesAcrossChains hook', () => {
  const useKhalaBalances = jest.spyOn(balancesSelectors, 'selectAll')
  const usePrices = jest.spyOn(pricesSelector, 'selectAll')
  const useNativeBalances = jest.spyOn(nativeBalancesSelectors, 'selectAll')

  it('should return expected result', async () => {
    useKhalaBalances.mockReturnValue([
      {
        chainId: Network.Sepolia,
        decimals: 6,
        id: '0x18B98AB4fd6D9eAbDa5745885f263Ff24C9CA0D8',
        tokenSymbol: 'USDT',
        balance: BigInt(555),
      },
      {
        chainId: Network.AvalancheTestnet,
        decimals: 6,
        id: '0x9462e15bDd59e3429E40dd0a9BCC9E844f102Aed',
        tokenSymbol: 'USDT',
        balance: BigInt(455),
      },
    ])

    usePrices.mockReturnValue([
      {
        id: '0x18B98AB4fd6D9eAbDa5745885f263Ff24C9CA0D8',
        price: BigDecimal.from(10000000, 8),
      },
      {
        id: '0x9462e15bDd59e3429E40dd0a9BCC9E844f102Aed',
        price: BigDecimal.from(10000000, 8),
      },
      {
        id: '0x2b58A19B50C4F67783704BA426056a93064aa372',
        price: BigDecimal.from(10000000, 8),
      },
      {
        id: '0xaa36a7',
        price: BigDecimal.from(10000000, 8),
      },
      {
        id: '0xa869',
        price: BigDecimal.from(10000000, 8),
      },
    ])

    useNativeBalances.mockReturnValue([
      {
        chainId: Network.Sepolia,
        decimals: 6,
        id: Network.Sepolia,
        tokenSymbol: 'ETH',
        balance: BigInt(3555),
      },
      {
        chainId: Network.AvalancheTestnet,
        decimals: 6,
        id: Network.AvalancheTestnet,
        tokenSymbol: 'AVAX',
        balance: BigInt(1455),
      },
    ])

    const { result } = renderHookWithProviders(() =>
      useTokenBalancesAcrossChains(),
    )

    expect(result).toStrictEqual({
      current: {
        tokenBalancesAcrossChains: [
          {
            tokenId: '0x18B98AB4fd6D9eAbDa5745885f263Ff24C9CA0D8',
            tokenSymbol: 'USDT',
            tokenDecimals: 6,
            balances: [
              {
                chainId: 11155111,
                value: 555n,
              },
              {
                chainId: 43113,
                value: 455n,
              },
            ],
            summedBalance: 1010n,
            summedBalanceUSD: 10100000000n,
          },
          {
            tokenId: '0xaa36a7',
            tokenSymbol: 'ETH',
            tokenDecimals: 6,
            balances: [
              {
                chainId: 11155111,
                value: 3555n,
              },
            ],
            summedBalance: 3555n,
            summedBalanceUSD: 35550000000n,
          },
          {
            tokenId: '0xa869',
            tokenSymbol: 'AVAX',
            tokenDecimals: 6,
            balances: [
              {
                chainId: 43113,
                value: 1455n,
              },
            ],
            summedBalance: 1455n,
            summedBalanceUSD: 14550000000n,
          },
        ],
        accountBalance: 60200000000n,
        isFetchingBalances: false,
      },
    })
  })
})
