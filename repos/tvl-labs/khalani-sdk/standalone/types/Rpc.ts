export interface JsonRpcRequest<ParamsType> {
  jsonrpc: '2.0'
  method: string
  params: ParamsType
  id: number
}
