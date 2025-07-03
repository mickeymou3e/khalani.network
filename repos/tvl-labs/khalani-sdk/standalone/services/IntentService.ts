import { INTENTBOOK_ABI } from '../abis/IntentBookArtifact'
import { getIntentDomain, getIntentTypes } from '../constants/Intent'
import {
  FillStructure,
  MedusaIntent,
  OutcomeAssetStructure,
  RpcIntentState,
  RefineResult,
  JsonRpcRequest,
  SignIntentPayload,
} from '../types'
import { createJsonRpcRequest } from '../utils/rpcUtils'
import { parseSignatureToRsv, Signature } from '../utils/signatureUtils'
import { ContractService } from './ContractService'
import { WalletService } from './WalletService'
import ConfigSchema from '../config/config.schema.json'
import { NetworkType } from '../config'
import { FillStructureStringToEnum } from '../types/Intent'
import { CancelIntentPayload } from './bcs/bcs'
import { ethers } from 'ethers'
import { addressToBytes, toU256Bytes } from './bcs/utils'

export class IntentService {
  private walletService: WalletService
  private contractService: ContractService | null = null
  private config: typeof ConfigSchema
  private networkType: NetworkType
  /**
   * Constructor with optional dependencies.
   */
  constructor(
    config: typeof ConfigSchema,
    networkType: NetworkType,
    walletService: WalletService,
    contractService?: ContractService,
  ) {
    this.config = config
    this.networkType = networkType
    this.walletService = walletService
    if (contractService) this.contractService = contractService
  }

  public buildSignIntentPayload = async ({
    refineResult,
    account,
  }: {
    refineResult: RefineResult
    account: string
  }): Promise<SignIntentPayload> => {
    const intent = {
      author: refineResult.Refinement.author as `0x${string}`,
      ttl: BigInt(refineResult.Refinement.ttl),
      nonce: BigInt(refineResult.Refinement.nonce),
      srcMToken: refineResult.Refinement.srcMToken as `0x${string}`,
      srcAmount: BigInt(refineResult.Refinement.srcAmount),
      outcome: {
        mTokens: refineResult.Refinement.outcome.mTokens as `0x${string}`[],
        mAmounts: [BigInt(refineResult.Refinement.outcome.mAmounts[0])],
        outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
        fillStructure: FillStructure.Exact,
      },
    }

    return {
      domain: getIntentDomain(this.networkType),
      types: getIntentTypes(),
      message: intent,
      primaryType: 'Intent',
      account,
    }
  }

  public signIntent = async (refineResult: RefineResult): Promise<string> => {
    if (!this.walletService) {
      throw new Error(
        'WalletService is not set. Please update dependencies first.',
      )
    }
    try {
      const signer = this.walletService.getSigner()
      const intent = {
        author: refineResult.Refinement.author as `0x${string}`,
        ttl: BigInt(refineResult.Refinement.ttl),
        nonce: BigInt(refineResult.Refinement.nonce),
        srcMToken: refineResult.Refinement.srcMToken as `0x${string}`,
        srcAmount: BigInt(refineResult.Refinement.srcAmount),
        outcome: {
          mTokens: refineResult.Refinement.outcome.mTokens as `0x${string}`[],
          mAmounts: [BigInt(refineResult.Refinement.outcome.mAmounts[0])],
          outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
          fillStructure:
            FillStructureStringToEnum[
              refineResult.Refinement.outcome.fillStructure
            ],
        },
      }

      const signature = await signer.signTypedData(
        getIntentDomain(this.networkType),
        getIntentTypes(),
        intent,
      )

      return signature
    } catch (error) {
      console.error('Error signing intent:', error)
      throw new Error(
        `Failed to sign intent: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  public buildGetIntentStatusPayload = async ({
    intentId,
  }: {
    intentId: string
  }): Promise<JsonRpcRequest<string[]>> => {
    return createJsonRpcRequest('getIntentStatus', [intentId])
  }

  public getIntentStatus = async (
    intentId: string,
  ): Promise<RpcIntentState> => {
    try {
      const jsonRpcPayload = {
        jsonrpc: '2.0',
        method: 'getIntentStatus',
        params: [intentId],
        id: 1,
      }

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

      if (!data.result) {
        throw new Error('No result returned from intent status request')
      }

      return data.result
    } catch (error) {
      console.error('Error getting intent status:', error)
      throw error
    }
  }

  public pollIntentStatus = async (
    intentId: string,
    finalState: RpcIntentState,
    interval = 10000,
    maxAttempts = 20,
  ): Promise<RpcIntentState> => {
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const status = await this.getIntentStatus(intentId)
        console.log(
          `[Attempt ${attempts + 1}/${maxAttempts}] Current intent status:`,
          status,
        )
        if (status === finalState) {
          console.log('Intent reached final state:', status)
          return status
        }
        attempts++
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, interval))
        }
      } catch (error) {
        console.log(
          `[Attempt ${attempts + 1}/${maxAttempts}] Error polling status:`,
          error,
        )
        attempts++
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, interval))
        }
      }
    }
    throw new Error(
      `Max attempts (${maxAttempts}) reached while polling intent status`,
    )
  }

  public buildProposeIntentPayload = ({
    refineResult,
    signature,
  }: {
    refineResult: RefineResult
    signature: string
  }): JsonRpcRequest<{ intent: MedusaIntent; signature: Signature }[]> => {
    const intent = {
      author: refineResult.Refinement.author,
      ttl: refineResult.Refinement.ttl,
      nonce: refineResult.Refinement.nonce,
      srcMToken: refineResult.Refinement.srcMToken,
      srcAmount: refineResult.Refinement.srcAmount,
      outcome: {
        mTokens: refineResult.Refinement.outcome.mTokens,
        mAmounts: refineResult.Refinement.outcome.mAmounts,
        outcomeAssetStructure:
          refineResult.Refinement.outcome.outcomeAssetStructure,
        fillStructure: refineResult.Refinement.outcome.fillStructure,
      },
    }

    const mappedSignature = parseSignatureToRsv(signature)

    return createJsonRpcRequest('proposeIntent', [
      { intent, signature: mappedSignature },
    ])
  }

  public proposeIntent = async ({
    refineResult,
    signature,
  }: {
    refineResult: RefineResult
    signature: string
  }): Promise<{ transactionHash: string; intentId: string }> => {
    try {
      const proposeIntentPayload = this.buildProposeIntentPayload({
        refineResult,
        signature,
      })

      const response = await fetch(this.config.medusa.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposeIntentPayload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('fetch response data:', JSON.stringify(data, null, 2))

      if (data.error) {
        throw new Error(`Error in JSON-RPC response: ${data.error.message}`)
      }
      if (!data.result || !data.result[1]) {
        throw new Error('Invalid response format: missing intent ID')
      }

      return {
        transactionHash: data.result[0],
        intentId: data.result[1],
      }
    } catch (error) {
      console.error('Error proposing intent:', error)
      throw error
    }
  }

  // Helper method that retrieves the intent nonce from the IntentBook contract.
  public async getIntentNonce(account: string): Promise<bigint> {
    if (!this.contractService) {
      throw new Error(
        'ContractService is not set. Please update dependencies first.',
      )
    }
    const contract = this.contractService.getIntentBookContract()
    return await contract.getNonce(account)
  }

  public async buildGetIntentNoncePayload({
    account,
  }: {
    account: string
  }): Promise<{ name: string; params: { account: string }; abi: any }> {
    return { name: 'getNonce', params: { account }, abi: INTENTBOOK_ABI }
  }

  public async cancelIntent(
    intentId: string,
  ): Promise<{ transactionHash: string }> {
    try {
      const intentIdBytes = addressToBytes(intentId)

      const chain_id = parseInt(this.walletService.getHubChain(), 16) // is this correct?
      const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
      const bcsPayload = CancelIntentPayload.serialize({
        chain_id,
        intent_id: intentIdBytes,
        nonce: toU256Bytes(nonce),
      })
      const signature = await this.walletService?.signer?.signMessage(
        bcsPayload.toBytes(),
      )
      if (!signature) {
        throw new Error('Failed to sign message')
      }
      const splitSignature = ethers.utils.splitSignature(signature)
      const sig = {
        r: splitSignature.r,
        s: splitSignature.s,
        yParity: splitSignature.v - 27,
      }
      const rpcPayload = {
        payload: {
          chain_id: chain_id,
          intent_id: intentId,
          nonce: nonce,
        },
        signature: sig,
      }
      const response = await fetch(this.config.medusa.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'cancelIntent',
          params: [rpcPayload],
          id: nonce,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('fetch response data:', JSON.stringify(data, null, 2))

      if (data.error) {
        throw new Error(`Error in JSON-RPC response: ${data.error.message}`)
      }

      return {
        transactionHash: data.result,
      }
    } catch (error) {
      console.error('Error proposing intent:', error)
      throw error
    }
  }
}
