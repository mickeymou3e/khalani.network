import {
  FallbackProvider,
  JsonRpcProvider,
  FallbackProviderOptions,
} from 'ethers-v6'

// Cache to store providers keyed by a unique string derived from RPC URLs
const cachedProvidersMap = new Map()

/**
 * Returns a FallbackProvider instance using the provided RPC URLs.
 * The provider is cached and reused if the same set of URLs is passed.
 *
 * @param {string[]} rpcUrls - Array of RPC URL strings.
 * @param {FallbackProviderOptions} [fallbackOptions={ quorum: 1 }] - Options for FallbackProvider.
 * @returns {FallbackProvider} - A FallbackProvider configured with the given RPC URLs.
 */
export function getFallbackProvider(
  rpcUrls: string[],
  fallbackOptions: FallbackProviderOptions = { quorum: 1 },
) {
  const cacheKey = rpcUrls.slice().sort().join('-')
  if (cachedProvidersMap.has(cacheKey)) {
    return cachedProvidersMap.get(cacheKey)
  }

  const providerConfigs = rpcUrls.map((url) => ({
    provider: new JsonRpcProvider(url),
    stallTimeout: 400,
    priority: 1,
    weight: 1,
  }))

  const fallbackProvider = new FallbackProvider(
    providerConfigs,
    undefined,
    fallbackOptions,
  )

  cachedProvidersMap.set(cacheKey, fallbackProvider)

  return fallbackProvider
}
