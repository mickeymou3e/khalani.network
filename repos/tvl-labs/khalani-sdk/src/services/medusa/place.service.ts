import axios from 'axios'
import config from '@config'
import { PlaceIntentParams, PlaceIntentResult } from '@store/swaps'
import { mapToTargetFormat, parseSignatureToRsv } from './utils'

export async function placeIntentRequest(
  params: PlaceIntentParams,
  customProxyUrl?: string,
): Promise<PlaceIntentResult> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const mappedIntent = mapToTargetFormat(params.intent)
    const mappedSignature = parseSignatureToRsv(params.signature)
    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'proposeIntent',
      params: [{ intent: mappedIntent, signature: mappedSignature }],
      id: 1,
    }

    const response = await axios.post(baseUrl, jsonRpcPayload, {
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
