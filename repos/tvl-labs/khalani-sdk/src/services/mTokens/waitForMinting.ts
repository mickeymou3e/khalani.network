import config from '@config'

/**
 * Under the hood, this function calls the new backend API `/api/monitorMinting` to initiate monitoring.
 */
export function* waitForMinting(
  token: { symbol: string; chainId: string },
  expectedBalance: bigint,
  userAddress: string,
  intent: any,
  intentSignature: any,
  depositTx: string,
): Generator<any, void, any> {
  const depositData = {
    userAddress,
    expectedBalance: expectedBalance.toString(),
    tokenAddress: token.symbol,
    chainId: Number(token.chainId),
    intent,
    intentSignature,
    depositTx,
  }

  console.log('depositData', depositData)

  console.log(`${config.workerUrl}/api/monitorMinting`)

  const response = yield fetch(`${config.workerUrl}/api/monitorMinting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(depositData),
  })
  console.log('response', response)
  if (!response.ok) {
    throw new Error('Failed to initiate monitorMinting via backend API')
  }
  const data = yield response.json()
  console.log('Monitor minting initiated:', data)
}
