import { call, select } from 'typed-redux-saga'
import { Contract, Interface } from 'ethers-v6'
import { chainsSelectors } from '@store/chains/chains.selector'
import { groupBy } from 'lodash'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { IBalances } from '@store/balances/balances.types'
import { Network } from '@constants/Networks'
import { getFallbackProvider } from '@services/provider/fallbackProvider'
import { formatTokenSymbol } from '@utils/token'
import { MULTICALL_ABI } from '@artifacts/MulticallArtifact'
import config from '@config'

export function* fetchERC20MultiChainBalances(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
): Generator<any, IBalances[]> {
  const selectChainById = yield* select(chainsSelectors.selectById)
  const multiCallAddress = config.contracts.multiCall

  const balances: IBalances[] = []
  const groupedTokens = groupBy(tokens, (token) => token.chainId)

  for (const chainId in groupedTokens) {
    const tokensInChain = groupedTokens[chainId]
    const chain = selectChainById(chainId as Network)

    if (chain && multiCallAddress) {
      const provider = getFallbackProvider(chain.rpcUrls)

      try {
        const chainBalances = yield* call(
          fetchBalancesWithMulticall,
          tokensInChain,
          userAddress,
          multiCallAddress,
          provider,
        )

        balances.push(...chainBalances)
      } catch (error) {
        console.error(
          `Multicall failed on chain ${chainId}. Falling back to individual calls.`,
          error,
        )

        for (const token of tokensInChain) {
          try {
            const contract = new Contract(
              token.address,
              ['function balanceOf(address owner) view returns (uint256)'],
              provider,
            )

            const balance = yield* call(
              [contract, contract.balanceOf],
              userAddress,
            )

            balances.push({
              id: token.id,
              tokenSymbol: formatTokenSymbol(token.symbol) ?? '',
              balance,
              chainId: token.chainId,
              decimals: token.decimals,
            })
          } catch (singleCallError) {
            console.error(
              `Failed to fetch balance for token ${token.symbol} on chain ${chainId}:`,
              singleCallError,
            )
          }
        }
      }
    } else {
      console.warn(
        `Multicall address missing for chain ${chainId}. Skipping chain.`,
      )
    }
  }

  return balances
}

function* fetchBalancesWithMulticall(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
  multicallAddress: string,
  provider: any,
): Generator<any, IBalances[]> {
  const multicallIface = new Interface(MULTICALL_ABI)

  const tokenIface = new Interface([
    'function balanceOf(address owner) view returns (uint256)',
  ])

  const calls = tokens.map((t) => ({
    target: t.address,
    callData: tokenIface.encodeFunctionData('balanceOf', [userAddress]),
  }))

  const payload = multicallIface.encodeFunctionData('aggregate', [calls])

  const raw: string = (yield* call(() =>
    provider.call({ to: multicallAddress, data: payload }),
  )) as string

  const [_, returnData] = multicallIface.decodeFunctionResult('aggregate', raw)

  return tokens.map((token, idx) => {
    const balance = tokenIface.decodeFunctionResult(
      'balanceOf',
      returnData[idx],
    )[0]

    return {
      id: token.id,
      tokenSymbol: formatTokenSymbol(token.symbol) ?? '',
      balance,
      chainId: token.chainId,
      decimals: token.decimals,
    }
  })
}
