import config from '@config'

/**
 * Pure-SDK style cancelIntent RPC call
 */
export async function cancelIntent(
  intentId: string,
  chain_id: number,
  nonce: number,
  sig: { r: string; s: string; yParity: number },
  customUrl?: string,
): Promise<string> {
  const baseUrl = customUrl ?? config.medusa.apiUrl

  const rpcPayload = {
    payload: {
      chain_id: chain_id,
      intent_id: intentId,
      nonce: nonce,
    },
    signature: sig,
  }

  const response = await fetch(baseUrl, {
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

  return data.result as string
}
