export const getRetireHistoryQuery = (customerAddress: string) => ({
  query: `
  {
    transferSingles(orderBy: blockTimestamp, orderDirection: desc, where: { and: [{from: "${customerAddress}"}, {to: "0x0000000000000000000000000000000000000000"}]}) {
      id: JasmineEAT_id
      value
      from
      to
      transactionHash
      blockTimestamp
    }
    transferBatches(orderBy: blockTimestamp, orderDirection: desc, where: { and: [{from: "${customerAddress}"}, {to: "0x0000000000000000000000000000000000000000"}]}) {
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
