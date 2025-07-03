import { getFallbackProvider } from '@services/provider/fallbackProvider'
import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall'

export const tokenAmountsMultiCall = async (
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
  rpcUrls: string[],
): Promise<ContractCallResults> => {
  const provider = getFallbackProvider(rpcUrls)

  const multicall = new Multicall({
    nodeUrl: rpcUrls[0],
    tryAggregate: true,
  })

  const contractCallContext: ContractCallContext[] = tokens.map((token) => ({
    reference: token.id,
    contractAddress: token.address,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'owner',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    calls: [
      {
        reference: 'balanceOfCall',
        methodName: 'balanceOf',
        methodParameters: [userAddress],
      },
    ],
  }))

  const results = await multicall.call(contractCallContext)
  return results
}
