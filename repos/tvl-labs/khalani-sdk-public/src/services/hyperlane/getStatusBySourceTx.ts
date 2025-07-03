interface HyperlaneMessageStatusResponse {
  status: string
  message: string
  result: HyperlaneMessage[]
}

interface HyperlaneMessage {
  id: string
  status: string
  sender: string
  recipient: string
  originDomainId: number
  destinationDomainId: number
  nonce: number
  body: string
  originTransaction: HyperlaneTransaction
  destinationTransaction: HyperlaneTransaction
}

interface HyperlaneTransaction {
  from: string
  transactionHash: string
  blockNumber: number
  gasUsed: number
  timestamp: number
}

export const getStatusBySourceTx = async (sourceTx: string) => {
  const baseUrl = 'https://explorer.hyperlane.xyz/api'
  const action = 'module=message&action=search-messages'
  const query = sourceTx
  const url = `${baseUrl}?${action}&query=${query}`

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const data: HyperlaneMessageStatusResponse = await response.json()

  return data.result[0].status
}
