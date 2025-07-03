import { getNetworkName } from '@hadouken-project/lending-contracts'
import { getSupportedNetworksInApplication } from '@utils/network'

export const SUPPORTED_PATHS = ['/', '/dashboard', '/deposit', '/borrow']

const supportedChainsId = getSupportedNetworksInApplication()

if (!supportedChainsId) throw new Error('Invalid network config')

const supportedNetworks = supportedChainsId.map((network) =>
  getNetworkName(network.toString()),
)

const supportedNetworkNames = supportedNetworks.map((name) =>
  name.split(' ').join('-').toLowerCase(),
)

export const createRouteForChains = (path: string, isDefaultRoute = false) => {
  return supportedNetworkNames.map((network) => {
    if (isDefaultRoute) {
      return `/${network}`
    }
    return `/${network}/${path}`
  })
}
