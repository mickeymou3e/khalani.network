export const createIntentNonce = () => BigInt(Math.floor(Date.now() / 1000))
export const createPermit2Nonce = () => BigInt(Math.floor(Date.now() / 1000))
export const createIntentDeadline = () => BigInt(2n ** 256n - 1n)
export const createPermit2Deadline = () =>
  BigInt(Math.floor(Date.now() / 1000) + 600)

export const createExclusivityEndTime = () => createIntentDeadline() / 3n
