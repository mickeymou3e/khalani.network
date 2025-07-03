export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Storybook = 'storybook',
}

export const isTestOrLocalEnv =
  process.env.CONFIG === 'testnet' || process.env.CONFIG === 'local'
