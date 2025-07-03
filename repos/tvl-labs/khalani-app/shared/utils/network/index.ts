import { Network, stringToNetwork } from '@tvl-labs/sdk'

// TODO[wallet]: Move to SDK

export const getNetworkById = (networkId: number): Network | undefined =>
  stringToNetwork('0x' + networkId.toString(16))

export const getNetworkIdNumber = (network: Network) =>
  parseInt(network.slice(2), 16)
