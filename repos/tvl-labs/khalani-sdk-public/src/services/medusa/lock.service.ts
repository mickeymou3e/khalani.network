import axios from 'axios'
import config from '@config'

interface LockIntentParams {
  intentIds: string[]
}

export async function lockIntentRequest(params: string[]): Promise<string[]> {
  try {
    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'lockIntents',
      params: [params],
      id: 1,
    }

    const response = await axios.post(config.medusa.apiUrl, jsonRpcPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data && !response.data.error) {
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
    console.error('Error locking intent request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error locking intent request: ${status} ${statusText}`)
    } else {
      throw new Error(
        'An unexpected error occurred while locking intent request',
      )
    }
  }
}
