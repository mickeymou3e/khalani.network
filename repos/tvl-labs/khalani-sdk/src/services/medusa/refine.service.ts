import config from '@config'
import { CreateRefineParams } from '@store/refine/create/create.types'
import {
  QueryRefineErrors,
  QueryRefineParams,
  QueryRefineResult,
} from '@store/refine/query/query.types'
import axios from 'axios'
import { mapToTargetFormat } from './utils'

export async function queryRefinementRequest(
  params: QueryRefineParams,
  customProxyUrl?: string,
): Promise<QueryRefineResult | null> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'queryRefinement',
      params: [params],
      id: 1,
    }

    const response = await axios.post(baseUrl, jsonRpcPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.data && response.data.result !== null) {
      if (Object.values(QueryRefineErrors).includes(response.data.result)) {
        return response.data.result as QueryRefineErrors
      }
      return response.data.result.Refinement
    } else if (response.data && response.data.error) {
      console.error('Error in JSON-RPC response:', response.data.error)
      throw new Error(
        `Error in JSON-RPC response: ${response.data.error.message}`,
      )
    } else {
      return null
    }
  } catch (error) {
    console.error('Error querying refine request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error querying refine request: ${status} ${statusText}`)
    } else {
      throw new Error(
        'An unexpected error occurred while querying refine request',
      )
    }
  }
}

export async function createRefinementRequest(
  params: CreateRefineParams,
  customProxyUrl?: string,
): Promise<string> {
  const mappedIntent = mapToTargetFormat(params)
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'createRefinement',
      params: [mappedIntent],
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
    console.error('Error creating refine request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error creating refine request: ${status} ${statusText}`)
    } else {
      throw new Error(
        'An unexpected error occurred while creating refine request',
      )
    }
  }
}

export async function requestAddSolver(): Promise<string> {
  try {
    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'getConnectedSolvers',
      id: 1,
    }

    const response = await axios.post(config.medusa.apiUrl, jsonRpcPayload, {
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
    console.error('Error in requestAddSolver request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(
        `Error in requestAddSolver request: ${status} ${statusText}`,
      )
    } else {
      throw new Error(
        'An unexpected error occurred while processing requestAddSolver request',
      )
    }
  }
}
