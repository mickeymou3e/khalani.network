export interface MessageView {
  msg_id: string
  nonce: number
  sender: string
  recipient: string
  is_delivered: boolean
  message_body: string
  origin_mailbox: string
  origin_domain_id: number
  origin_chain_id: number
  origin_block_id: number
  origin_block_height: number
  origin_block_hash: string
  origin_tx_sender: string
  origin_tx_recipient: string
  origin_tx_nonce: number
  origin_tx_max_priority_fee_per_gas: number
  origin_tx_max_fee_per_gas: number
  origin_tx_id: number
  origin_tx_hash: string
  origin_tx_gas_used: number
  origin_tx_gas_price: number
  origin_tx_gas_limit: number
  origin_tx_effective_gas_price: number
  origin_tx_cumulative_gas_used: number
  destination_block_id: number
  destination_block_hash: string
  destination_block_height: number
  destination_chain_id: number
  destination_domain_id: number
  destination_mailbox: string
  destination_tx_cumulative_gas_used: number
  destination_tx_effective_gas_price: number
  destination_tx_gas_limit: number
  destination_tx_gas_price: number
  destination_tx_gas_used: number
  destination_tx_hash: string
  destination_tx_id: number
  destination_tx_max_fee_per_gas: number
  destination_tx_max_priority_fee_per_gas: number
  destination_tx_nonce: number
  destination_tx_recipient: string
  destination_tx_sender: string
  send_occurred_at: string
  delivery_occurred_at: string
  delivery_latency: number
  num_payments: number
  total_payment: number
  total_gas_amount: number
}

export interface DestinationInfo {
  origin_tx_hash: string
  is_delivered: boolean
  destination_tx_hash: string
}
