import axios from 'axios'
import config from '@config'

export interface MedusaTransactions {
  publish_timestamp: number | null
  publish_tx_hash: string | null
  solve_timestamp: number | null
  solve_tx_hash: string | null
  redeem_timestamp: number | null
  redeem_tx_hash: string | null
  withdraw_timestamp: number | null
  withdraw_to_spoke_timestamp: number | null
  withdraw_tx_hash: string | null
  cancel_timestamp: number | null
  cancel_tx_hash: string | null
  remaining_intent_id: number | null
  error_timestamp: number
  error_tx_hash: string
  error_type: IntentErrorType
}

export interface MedusaIntent {
  author: string
  ttl: string
  nonce: string
  srcMToken: string
  srcAmount: string
  outcome: {
    mTokens: string[]
    mAmounts: string[]
    outcomeAssetStructure: string
    fillStructure: string
  }
}

export type MedusaHistory = [MedusaTransactions, MedusaIntent]

enum IntentErrorType {
  Publish = 'Publish',
  Solve = 'Solve',
  Cancel = 'Cancel',
  Redeem = 'Redeem',
  Withdraw = 'Withdraw',
}

export async function getMedusaHistory(
  intentId: string,
  customProxyUrl?: string,
): Promise<MedusaHistory> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'getHistory',
      params: [intentId],
      id: 1,
    }

    const response = await axios.post(baseUrl, jsonRpcPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.result) {
      return response.data.result
    } else if (response.data && response.data.error) {
      console.error('Error in JSON-RPC response:', response.data.error)
      throw new Error(
        `Error in JSON-RPC response: ${response.data.error.message}`,
      )
    } else {
      throw new Error('Unexpected response format')
    }
  } catch (error) {
    console.error('Error getting history:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error in get history request: ${status} ${statusText}`)
    } else {
      throw new Error('An unexpected error occurred in get history request')
    }
  }
}
