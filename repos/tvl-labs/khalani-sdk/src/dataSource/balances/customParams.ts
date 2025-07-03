import { Interface, Result } from 'ethers-v6'
import { call } from 'typed-redux-saga'
import { CustomJsonRpcProvider } from '@classes/CustomJsonRpcProvider'
import { formatTokenSymbol } from '@utils/token'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { Effect } from 'redux-saga/effects'
import { IMTokenBalances } from '@store/mTokenBalances'

export function* fetchERC20BalancesTest(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
): Generator<Effect, IMTokenBalances[]> {
  const balances: IMTokenBalances[] = []

  const erc20Interface = new Interface([
    'function balanceOf(address owner) view returns (uint256)',
  ])

  const provider = new CustomJsonRpcProvider(
    'https://rpc.khalani.network',
    undefined,
    10000,
    {
      'Custom-Header': 'YourHeaderValue',
    },
  )

  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const data = erc20Interface.encodeFunctionData('balanceOf', [userAddress])

    // Construct the eth_call parameters
    const params = [
      {
        to: token.address,
        input: data,
      },
      'latest',
    ]
    try {
      // Send the eth_call request directly
      const resultHex: string = yield* call(
        [provider, provider.send],
        'eth_call',
        params,
      )
      const result: Result = erc20Interface.decodeFunctionResult(
        'balanceOf',
        resultHex,
      )
      const balance: bigint = result[0]

      balances.push({
        id: token.id,
        tokenSymbol: formatTokenSymbol(token.symbol) ?? '',
        balance: balance,
        chainId: token.chainId,
        decimals: token.decimals,
        sourceChainId: token.sourceChainId,
      })
    } catch (error) {
      console.error('Error fetching balance for token:', token.address, error)
    }
  }
  return balances
}
