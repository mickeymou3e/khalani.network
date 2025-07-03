import axios from 'axios'
import config from '@config'

export interface SignedAddress {
  address: string
  signature: any
}

export async function withdrawMTokens(
  owner: SignedAddress,
  mToken: string,
  amount: bigint,
  customProxyUrl?: string,
): Promise<number> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'withdrawMtokens',
      params: [owner, mToken, amount.toString()],
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
      throw new Error(
        `Error in withdraw mTokens request: ${status} ${statusText}`,
      )
    } else {
      throw new Error(
        'An unexpected error occurred in withdraw mTokens request',
      )
    }
  }
}
