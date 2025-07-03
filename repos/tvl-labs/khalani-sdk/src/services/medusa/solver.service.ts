import axios from 'axios'
import config from '@config'
import { RpcIntentState } from './state.service'

export async function getConnectedSolvers(
  customProxyUrl?: string,
): Promise<RpcIntentState> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'getConnectedSolvers',
      params: [],
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
    console.error('Error in get solvers request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error in get solvers request: ${status} ${statusText}`)
    } else {
      throw new Error('An unexpected error occurred in get solvers request')
    }
  }
}

export async function requestAddSolver(
  solverAddr: string,
  customProxyUrl?: string,
): Promise<RpcIntentState> {
  try {
    const baseUrl = customProxyUrl || config.medusa.apiUrl

    const jsonRpcPayload = {
      jsonrpc: '2.0',
      method: 'requestAddSolver',
      params: [solverAddr],
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
    console.error('Error in add solver request:', error)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const statusText = error.response?.statusText
      throw new Error(`Error in add solver request: ${status} ${statusText}`)
    } else {
      throw new Error('An unexpected error occurred in add solver request')
    }
  }
}
