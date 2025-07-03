import { gql } from 'graphql-request';

export const lockdropsQuery = gql`
  query lockdropsQuery($where: Lockdrop_filter) {
    lockdrops(where: $where) {
      id
      tokenAddress
      timestamp
      owner
      lockId
      amount
      lockLength
      weight
      isLocked
      transaction
      isClaimed
    }
  }
`;

export const tokenBalancesQuery = gql`
  query tokensQuery($where: Token_filter) {
    tokens(where: $where) {
      id
      symbol
      address
      latestUSDPrice
    }
  }
`;

export const lockdropPricesQuery = gql`
  query lockdropPricesQuery {
    lockdropTokens {
      price
      id
    }
  }
`;

export const depositedHDKQuery = gql`
  query depositedHDKsQuery($where: Lockdrop_filter) {
    depositedHDKs(where: $where) {
      id
      amount
      user
      timestamp
    }
  }
`;
