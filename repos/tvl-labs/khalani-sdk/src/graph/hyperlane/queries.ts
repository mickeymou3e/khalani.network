import { gql } from '@apollo/client/core'

export const MESSAGE_VIEW_QUERY = gql`
  query MessageView($txHash: bytea!) {
    message_view(limit: 1, where: { origin_tx_hash: { _eq: $txHash } }) {
      msg_id
      nonce
      sender
      recipient
      is_delivered
      message_body
      origin_mailbox
      origin_domain_id
      origin_chain_id
      origin_block_id
      origin_block_height
      origin_block_hash
      origin_tx_sender
      origin_tx_recipient
      origin_tx_nonce
      origin_tx_max_priority_fee_per_gas
      origin_tx_max_fee_per_gas
      origin_tx_id
      origin_tx_hash
      origin_tx_gas_used
      origin_tx_gas_price
      origin_tx_gas_limit
      origin_tx_effective_gas_price
      origin_tx_cumulative_gas_used
      destination_block_id
      destination_block_hash
      destination_block_height
      destination_chain_id
      destination_domain_id
      destination_mailbox
      destination_tx_cumulative_gas_used
      destination_tx_effective_gas_price
      destination_tx_gas_limit
      destination_tx_gas_price
      destination_tx_gas_used
      destination_tx_hash
      destination_tx_id
      destination_tx_max_fee_per_gas
      destination_tx_max_priority_fee_per_gas
      destination_tx_nonce
      destination_tx_recipient
      destination_tx_sender
      send_occurred_at
      delivery_occurred_at
      delivery_latency
      num_payments
      total_payment
      total_gas_amount
    }
  }
`

export const DESTINATION_TX_QUERY = gql`
  query DestinationTx($txHash: bytea!) {
    message_view(limit: 1, where: { origin_tx_hash: { _eq: $txHash } }) {
      origin_tx_hash
      is_delivered
      destination_tx_hash
    }
  }
`

export const DESTINATION_TXS_QUERY = gql`
  query DestinationTxs($txHashes: [bytea!]!) {
    message_view(where: { origin_tx_hash: { _in: $txHashes } }) {
      origin_tx_hash
      is_delivered
      destination_tx_hash
    }
  }
`
