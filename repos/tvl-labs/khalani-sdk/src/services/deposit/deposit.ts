// File: src/sdk/backendApi.ts

import config from '@config'
import { APIError } from '@interfaces/api'

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

export interface DepositData {
  userAddress: string
  expectedBalance: string
  tokenAddress: string
  chainId: number
  intent: any
  intentSignature: string
  depositTx: string
}

export interface DepositRecord {
  id: string
  userAddress: string
  tokenAddress: string
  amount: string
  depositTx: string
  status: 'pending' | 'error' | 'success'
  intentId?: string
  errorMessage?: string
  intent?: any
  intentSignature?: { r: string; s: string; v: string }
  createdAt: string
  updatedAt?: string
}

/**
 * Fire-and-forget initiation of mint + intent.
 */
export async function monitorMinting(
  data: DepositData,
): Promise<{ depositId: string }> {
  const resp = await fetch(`${config.workerUrl}/api/monitorMinting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!resp.ok) {
    let errBody: APIError
    try {
      errBody = await resp.json()
    } catch {
      errBody = { code: String(resp.status), message: resp.statusText }
    }
    throw errBody
  }
  return resp.json()
}

/**
 * List a user's deposits, optionally filtered by status.
 */
export async function listDeposits(
  userAddress: string,
  status?: 'pending' | 'error' | 'success',
): Promise<DepositRecord[]> {
  const params = new URLSearchParams({ userAddress })
  if (status) params.set('status', status)
  const resp = await fetch(
    `${config.workerUrl}/api/deposits?${params.toString()}`,
    {
      headers: { Accept: 'application/json' },
    },
  )

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`listDeposits failed: ${errText || resp.status}`)
  }
  return resp.json()
}

/**
 * Fetch a single deposit by its ID.
 */
export async function getDepositById(id: string): Promise<DepositRecord> {
  const resp = await fetch(
    `${config.workerUrl}/api/deposits/${encodeURIComponent(id)}`,
    {
      headers: { Accept: 'application/json' },
    },
  )
  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`getDepositById failed: ${errText || resp.status}`)
  }
  return resp.json()
}
