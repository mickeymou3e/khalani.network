export const isTestOrLocalEnv =
  process.env.CONTRACTS_CONFIG === 'testnet' ||
  process.env.CONTRACTS_CONFIG === 'local'

export const isLocalEnv = process.env.CONTRACTS_CONFIG === 'local'
