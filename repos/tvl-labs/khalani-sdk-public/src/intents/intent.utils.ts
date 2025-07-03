export const createIntentNonce = () => BigInt(Math.floor(Date.now() / 1000))
export const createIntentDeadline = () => BigInt(2n ** 256n - 1n)

export const createExclusivityEndTime = () => createIntentDeadline() / 3n
