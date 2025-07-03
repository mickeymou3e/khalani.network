export const getPoolHistoryQuery = (
  customerAddress: string,
  tokenAddress: string
) => ({
  query: `
  {
    transferSingles(orderBy: blockTimestamp, orderDirection: desc, where: { or: [{and: [{from: "${customerAddress}"}, {to: "${tokenAddress}"}]}, { and: [{to: "${customerAddress}"}, {from: "${tokenAddress}"}]}]}) {
      id: JasmineEAT_id
      value
      from
      to
      transactionHash
      blockTimestamp
    }
    transferBatches(orderBy: blockTimestamp, orderDirection: desc, where: { or: [{and: [{from: "${customerAddress}"}, {to: "${tokenAddress}"}]}, { and: [{to: "${customerAddress}"}, {from: "${tokenAddress}"}]}]}) {
      ids
      values
      from
      to
      transactionHash
      blockTimestamp
    }
  }
  `,
});
