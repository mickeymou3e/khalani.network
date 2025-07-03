import axios from 'axios'
import config from '@config'

export enum RpcIntentState {
  NonExistent = 'NonExistent',
  Open = 'Open',
  Locked = 'Locked',
  Solved = 'Solved',
  Settled = 'Settled',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  NotPublished = 'NotPublished',
  FailedToPublish = 'FailedToPublish',
}

export async function getIntent(
  intentId: string,
  customProxyUrl?: string,
): Promise<RpcIntentState> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'getIntent',
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
    console.error('Error getting intent:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error in get intent request: ${status} ${statusText}`)
    } else {
      throw new Error('An unexpected error occurred in get intent request')
    }
  }
}

export async function getIntentStatus(
  intentId: string,
  customProxyUrl?: string,
): Promise<RpcIntentState> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'getIntentStatus',
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
    console.error('Error proposing intent request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error proposing intent request: ${status} ${statusText}`)
    } else {
      throw new Error(
        'An unexpected error occurred while proposing intent request',
      )
    }
  }
}
