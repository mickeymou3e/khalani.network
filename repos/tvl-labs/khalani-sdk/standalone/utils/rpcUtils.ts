import { JsonRpcRequest } from '../types'

/**
 * Creates a JSON-RPC payload for the given method name and parameters.
 * @param methodName - The RPC method, e.g. "getIntentStatus", "queryRefinement", etc.
 * @param params - The parameters required by that method.
 *                 Usually an array, but you can pass a single param if you wrap it in an array yourself.
 * @returns An object containing:
 *   - methodName: the method string
 *   - jsonRpcObject: the JSON-RPC 2.0 payload
 */
export function createJsonRpcRequest<ParamsType>(
  methodName: string,
  params: ParamsType,
): JsonRpcRequest<ParamsType> {
  return {
    jsonrpc: '2.0',
    method: methodName,
    params,
    id: 1,
  }
}
