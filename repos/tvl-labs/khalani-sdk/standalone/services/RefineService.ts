import { buildOutcome } from '../utils/outcomeUtils'
import {
  CreateRefinePayload,
  RefineResultOrNotFound,
  RefineResultStatus,
  CreateIntentParams,
  JsonRpcRequest,
} from '../types'
import { createJsonRpcRequest } from '../utils/rpcUtils'
import ConfigSchema from '../config/config.schema.json'
import { TokensService } from './TokensService'
export class RefineService {
  private config: typeof ConfigSchema
  private tokensService: TokensService | null = null
  constructor(config: typeof ConfigSchema, tokensService?: TokensService) {
    this.config = config
    if (tokensService) {
      this.tokensService = tokensService
    }
  }

  public createRefine = async (args: {
    accountAddress: string
    fromChainId: number
    fromTokenAddress: string
    amount: bigint
    toChainId: number
    toTokenAddress: string
    currentNonce: bigint
    fillStructure: string
  }): Promise<string> => {
    const jsonRpcPayload = this.buildCreateRefinePayload(args)

    const response = await fetch(this.config.medusa.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonRpcPayload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`)
    }

    return data.result
  }

  public buildCreateRefinePayload = (args: {
    accountAddress: string
    fromChainId: number
    fromTokenAddress: string
    amount: bigint
    toChainId: number
    toTokenAddress: string
    currentNonce: bigint
    fillStructure: string
    feePercentage?: number
  }): JsonRpcRequest<CreateRefinePayload[]> => {
    if (!this.tokensService) {
      throw new Error('TokensService is not initialized')
    }
    const fromToken = this.tokensService.findTokenByAddress(
      args.fromTokenAddress,
      args.fromChainId,
    )
    const toToken = this.tokensService.findTokenByAddress(
      args.toTokenAddress,
      args.toChainId,
    )

    const fromTokenArcadia = this.tokensService.findArcadiaToken(
      args.fromChainId,
      fromToken.address,
    )
    const toTokenArcadia = this.tokensService.findArcadiaToken(
      args.toChainId,
      toToken.address,
    )

    const refineParams: CreateIntentParams = {
      selectedChain: args.fromChainId,
      srcToken: fromToken.address,
      srcAmount: args.amount.toString(),
      srcChainId: fromToken.chainId,
      srcSymbol: fromToken.symbol,
      destTokens: [toToken.address],
      destChains: [args.toChainId],
      destChainId: toToken.chainId,
      destSymbol: toToken.symbol,
    }

    const refinementParams = {
      author: args.accountAddress,
      ttl: (Math.floor(Date.now() / 1000) + 600).toString(),
      nonce: args.currentNonce.toString(),
      srcMToken: fromTokenArcadia.address,
      srcAmount: args.amount.toString(),
      outcome: buildOutcome(
        refineParams,
        [toTokenArcadia.address],
        args.fillStructure,
        args.feePercentage,
      ),
    }

    return createJsonRpcRequest('createRefinement', [refinementParams])
  }

  public queryRefine = async (
    refineId: string,
  ): Promise<RefineResultOrNotFound> => {
    const jsonRpcPayload = this.buildQueryRefinePayload(refineId)

    const response = await fetch(this.config.medusa.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonRpcPayload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(`Error in JSON-RPC response: ${data.error.message}`)
    }

    const result = data.result

    if (result !== null) {
      if (typeof result === 'string') {
        return RefineResultStatus.RefinementNotFound
      }
      return result
    } else {
      throw new Error(`Query refine error: ${JSON.stringify(result, null, 2)}`)
    }
  }

  public buildQueryRefinePayload = (
    refineId: string,
  ): JsonRpcRequest<string[]> => {
    return createJsonRpcRequest('queryRefinement', [refineId])
  }

  public pollRefine = async (
    refineId: string,
    interval = 60000,
    maxAttempts = 10,
  ): Promise<RefineResultOrNotFound> => {
    let attempts = 0
    while (attempts < maxAttempts) {
      try {
        const result = await this.queryRefine(refineId)
        if (result === RefineResultStatus.RefinementNotFound) {
          return RefineResultStatus.RefinementNotFound
        }
        return result
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) {
          throw new Error('Max attempts reached while polling refine')
        }
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
    }
    throw new Error('Failed to get refine result')
  }
}
