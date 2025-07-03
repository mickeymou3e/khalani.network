import { gql } from '@apollo/client'

export const BLOCKS_QUERY = gql`
  query blocksQuery($timestamp: Int!) {
    blocksQuery: blocks(
      orderDirection: asc
      orderBy: timestamp
      first: 1
      where: { timestamp_gt: $timestamp }
    ) {
      id
      number
      timestamp
    }
  }
`
